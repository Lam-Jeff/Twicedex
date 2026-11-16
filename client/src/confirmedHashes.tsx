// src/utils/confirmedHashes.ts
// Hashes confirmés par l'utilisateur — stockés dans PocketBase
// Quand l'utilisateur confirme un résultat incertain, le hash de sa photo
// est sauvegardé pour améliorer les recherches futures.

import { Hashes, combinedDistance } from "./hashUtils";

const PB_API        = "/api";
const PB_COLLECTION = "confirmed_hashes";
const MAX_PER_CARD  = 5; // max 5 photos confirmées par carte

// ── Chargement ────────────────────────────────────────

export async function loadConfirmedHashes(): Promise<Map<number, Hashes[]>> {
  try {
    const res = await fetch(
      `${PB_API}/collections/${PB_COLLECTION}/records?perPage=500`
    );
    if (!res.ok) return new Map();

    const { items } = await res.json();
    const map = new Map<number, Hashes[]>();

    items.forEach((item: { card_id: number; hashes: Hashes[] }) => {
      if (item.card_id && Array.isArray(item.hashes)) {
        map.set(item.card_id, item.hashes);
      }
    });

    return map;
  } catch {
    return new Map(); // PocketBase inaccessible — silencieux
  }
}

// ── Sauvegarde ────────────────────────────────────────

export async function saveConfirmedHash(
  cardId: number,
  hashes: Hashes,
  confirmedIndex: Map<number, Hashes[]>
): Promise<void> {
  const existing = confirmedIndex.get(cardId) ?? [];
  const updated  = [...existing, hashes].slice(-MAX_PER_CARD);

  try {
    // Cherche si un record existe déjà pour cette carte
    const searchRes = await fetch(
      `${PB_API}/collections/${PB_COLLECTION}/records?filter=(card_id=${cardId})`
    );
    const { items } = await searchRes.json();

    if (items.length > 0) {
      await fetch(
        `${PB_API}/collections/${PB_COLLECTION}/records/${items[0].id}`,
        {
          method:  "PATCH",
          headers: { "Content-Type": "application/json" },
          body:    JSON.stringify({ hashes: updated }),
        }
      );
    } else {
      await fetch(`${PB_API}/collections/${PB_COLLECTION}/records`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ card_id: cardId, hashes: updated }),
      });
    }

    // Met à jour l'index en mémoire immédiatement
    confirmedIndex.set(cardId, updated);
  } catch {
    // Sauvegarde échouée — l'index en mémoire est quand même mis à jour
    confirmedIndex.set(cardId, updated);
  }
}

// ── Recherche ─────────────────────────────────────────

export function getBestConfirmedDistance(
  photoHashes: Hashes,
  cardId: number,
  confirmedIndex: Map<number, Hashes[]>
): number {
  const entries = confirmedIndex.get(cardId);
  if (!entries?.length) return Infinity;
  return Math.min(...entries.map((h) => combinedDistance(photoHashes, h)));
}
