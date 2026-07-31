import { useState, useEffect, useRef } from "react";
import { ICardsProps } from "./collection";
import { computeHashes, combinedDistance, Hashes } from "./hashUtils";
import { loadHashesFromIDB, saveHashesToIDB } from "./idbUtils";
import {
  loadConfirmedHashes,
  saveConfirmedHash,
  getBestConfirmedDistance,
} from "./confirmedHashes";

// ── Constantes ────────────────────────────────────────

const THRESHOLD_CERTAIN = 25; // haute confiance → résultat direct
const THRESHOLD_UNCERTAIN = 45; // confiance faible → demande confirmation

// ── Types ─────────────────────────────────────────────

export type ScanStatus =
  | "idle"
  | "indexing"
  | "searching"
  | "found"
  | "found_uncertain"
  | "not_found"
  | "error";

export interface ScanResult {
  card: ICardsProps;
  previewUrl: string;
  scannedAt: Date;
}

// ── Hook ──────────────────────────────────────────────

export function useImageSearch(cards: ICardsProps[]) {
  const [status, setStatus] = useState<ScanStatus>("indexing");
  const [result, setResult] = useState<ICardsProps | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [history, setHistory] = useState<ScanResult[]>([]);
  const [cameraAvailable, setCameraAvailable] = useState(false);
  const [indexProgress, setIndexProgress] = useState(0);

  // Index de référence (hashes des images ImageKit)
  const hashIndex = useRef<Map<number, Hashes>>(new Map());

  // Index des hashes confirmés par l'utilisateur (PocketBase)
  const confirmedIndex = useRef<Map<number, Hashes[]>>(new Map());

  // Hash de la dernière photo scannée — utilisé dans confirmResult
  const lastPhotoHashes = useRef<Hashes | null>(null);

  // ── Détection caméra ───────────────────────────────
  useEffect(() => {
    navigator.mediaDevices
      ?.enumerateDevices()
      .then((devices) => {
        setCameraAvailable(devices.some((d) => d.kind === "videoinput"));
      })
      .catch(() => setCameraAvailable(false));
  }, []);

  // ── Construction de l'index ────────────────────────
  useEffect(() => {
    if (!cards.length) return;

    async function buildIndex() {
      // Charge en parallèle : cache IDB + hashes confirmés PocketBase
      const [cached, confirmed] = await Promise.all([
        loadHashesFromIDB(),
        loadConfirmedHashes(),
      ]);

      confirmedIndex.current = confirmed;

      if (cached.size === cards.length) {
        hashIndex.current = cached;
        setIndexProgress(cards.length);
        setStatus("idle");
        return;
      }

      setStatus("indexing");
      const missing = cards.filter((c) => !cached.has(c.id));
      hashIndex.current = cached;
      setIndexProgress(cached.size);

      const BATCH_SIZE = 10;
      for (let i = 0; i < missing.length; i += BATCH_SIZE) {
        const batch = missing.slice(i, i + BATCH_SIZE);
        await Promise.allSettled(
          batch.map(async (card) => {
            try {
              const hashes = await computeHashes(card.thumbnail);
              hashIndex.current.set(card.id, hashes);
              setIndexProgress((prev) => prev + 1);
            } catch {}
          }),
        );
      }

      await saveHashesToIDB(hashIndex.current);
      setStatus("idle");
    }

    buildIndex();
  }, [cards]);

  // ── Recherche ──────────────────────────────────────
  const searchByImage = async (file: File) => {
    const preview = URL.createObjectURL(file);
    setPreviewUrl(preview);
    setResult(null);
    setStatus("searching");

    try {
      const photoHashes = await computeHashes(file);
      lastPhotoHashes.current = photoHashes; // stocke pour confirmResult

      let bestCard: ICardsProps | null = null;
      let bestDist = Infinity;

      for (const card of cards) {
        const stored = hashIndex.current.get(card.id);
        if (!stored) continue;

        // Vérifie la cohérence des longueurs
        if (
          stored.ahash.length !== photoHashes.ahash.length ||
          stored.dhash.length !== photoHashes.dhash.length ||
          stored.phash.length !== photoHashes.phash.length
        )
          continue;

        // Distance de référence
        const refDist = combinedDistance(photoHashes, stored);

        // Distance confirmée (photos réelles confirmées par l'utilisateur)
        const confirmedDist = getBestConfirmedDistance(
          photoHashes,
          card.id,
          confirmedIndex.current,
        );

        // Prend la meilleure des deux
        const dist = Math.min(refDist, confirmedDist);

        if (dist < bestDist) {
          bestDist = dist;
          bestCard = card;
        }
      }

      if (bestCard && bestDist < THRESHOLD_CERTAIN) {
        setResult(bestCard);
        setStatus("found");
        addToHistory(bestCard, preview);
      } else if (bestCard && bestDist < THRESHOLD_UNCERTAIN) {
        setResult(bestCard);
        setStatus("found_uncertain");
        // Pas encore dans l'historique — attend la confirmation
      } else {
        setStatus("not_found");
      }
    } catch (e) {
      console.error("Erreur searchByImage:", e);
      setStatus("error");
    }
  };

  // ── Helpers history ────────────────────────────────
  function addToHistory(card: ICardsProps, preview: string) {
    setHistory((prev) => {
      if (prev[0]?.card.id === card.id) return prev;
      return [
        { card, previewUrl: preview, scannedAt: new Date() },
        ...prev.slice(0, 9),
      ];
    });
  }

  // ── Confirmation résultat incertain ────────────────
  const confirmResult = async () => {
    if (result && previewUrl) {
      addToHistory(result, previewUrl);

      // Sauvegarde le hash de la photo confirmée dans PocketBase
      if (lastPhotoHashes.current) {
        await saveConfirmedHash(
          result.id,
          lastPhotoHashes.current,
          confirmedIndex.current,
        );
      }
    }
    setStatus("found");
  };

  // ── Rejet résultat incertain ───────────────────────
  const rejectResult = () => {
    setResult(null);
    setStatus("not_found");
  };

  // ── Reset ──────────────────────────────────────────
  const reset = () => {
    setResult(null);
    setPreviewUrl(null);
    setStatus("idle");
  };

  return {
    status,
    result,
    previewUrl,
    history,
    cameraAvailable,
    indexProgress,
    totalCards: cards.length,
    searchByImage,
    confirmResult,
    rejectResult,
    reset,
  };
}
