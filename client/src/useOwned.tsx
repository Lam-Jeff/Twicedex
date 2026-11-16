/**
 * useCollection.js
 * - owned  : cartes possédées
 * - wished : cartes souhaitées
 *
 * Règle : cocher une carte comme possédée la retire automatiquement de wished.
 */

import { useState, useEffect, useRef, useCallback } from "react";

const PB_API = "/api";
const PB_COLLECTION = "Twice_photocards";

async function pbFindOrCreate() {
  const res = await fetch(
    `${PB_API}/collections/${PB_COLLECTION}/records?perPage=1`,
  );
  if (!res.ok) throw new Error();
  const { items } = await res.json();
  if (items.length > 0) return items[0];

  const created = await fetch(
    `${PB_API}/collections/${PB_COLLECTION}/records`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ owned: [], wished: [] }),
    },
  );
  if (!created.ok) throw new Error();
  return created.json();
}

async function pbSave(
  recordId: string,
  data: { owned: number[]; wished: number[] },
) {
  const res = await fetch(
    `${PB_API}/collections/${PB_COLLECTION}/records/${recordId}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    },
  );
  if (!res.ok) throw new Error();
}

function parseField(val: any): number[] {
  if (!val) return [];
  if (typeof val === "string") return JSON.parse(val);
  return val;
}

export function useCollection() {
  const [owned, setOwned] = useState<Set<number>>(new Set());
  const [wished, setWished] = useState<Set<number>>(new Set());
  // Ajoute ces deux refs dans le hook
  const ownedRef = useRef<Set<number>>(new Set());
  const wishedRef = useRef<Set<number>>(new Set());

  // Maintiens-les à jour à chaque render
  ownedRef.current = owned;
  wishedRef.current = wished;
  const [syncStatus, setSyncStatus] = useState("loading");
  const recordIdRef = useRef<string | null>(null);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const isInitialized = useRef(false);

  // ── Chargement initial ──────────────────────────────
  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const record = await pbFindOrCreate();
        if (cancelled) return;
        recordIdRef.current = record.id;
        setOwned(new Set(parseField(record.owned)));
        setWished(new Set(parseField(record.wished)));
        setSyncStatus("synced");
        isInitialized.current = true;
      } catch {
        if (!cancelled) setSyncStatus("error");
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  // ── Sauvegarde automatique dès que owned ou wished change ──
  useEffect(() => {
    // On ne sauvegarde pas pendant le chargement initial
    if (!isInitialized.current || !recordIdRef.current) return;

    clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(async () => {
      setSyncStatus("saving");
      try {
        await pbSave(recordIdRef.current!, {
          owned: [...ownedRef.current],
          wished: [...wishedRef.current],
        });
        setSyncStatus("synced");
      } catch {
        setSyncStatus("error");
      }
    }, 600);
  }, [owned, wished]);

  // ── Toggles — state pur, aucun side effect ──────────
  const toggleOwned = useCallback((id: number) => {
    setOwned((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
    // Si on coche comme possédé → retirer de wished
    setWished((prev) => {
      if (!prev.has(id)) return prev; // rien à faire
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);

  const toggleWished = useCallback((id: number) => {
    setWished((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  return {
    owned,
    toggleOwned,
    wished,
    toggleWished,
    isLoading: syncStatus === "loading",
    syncStatus,
  };
}
