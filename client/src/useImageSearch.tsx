import { useState, useEffect, useRef } from "react";
import { ICardsProps } from "./collection";
import { computeHashes, combinedDistance, Hashes } from "./hashUtils";
import { loadHashesFromIDB, saveHashesToIDB } from "./idbUtils";
import {
  loadConfirmedHashes,
  saveConfirmedHash,
  getBestConfirmedDistance,
} from "./confirmedHashes";

const THRESHOLD_CERTAIN = 25;
const THRESHOLD_UNCERTAIN = 45;

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

export function useImageSearch(cards: ICardsProps[]) {
  const [status, setStatus] = useState<ScanStatus>("indexing");
  const [result, setResult] = useState<ICardsProps | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [history, setHistory] = useState<ScanResult[]>([]);
  const [cameraAvailable, setCameraAvailable] = useState(false);
  const [indexProgress, setIndexProgress] = useState(0);

  const hashIndex = useRef<Map<number, Hashes>>(new Map());
  const confirmedIndex = useRef<Map<number, Hashes[]>>(new Map());
  const lastPhotoHashes = useRef<Hashes | null>(null);

  useEffect(() => {
    navigator.mediaDevices
      ?.enumerateDevices()
      .then((devices) => {
        setCameraAvailable(devices.some((d) => d.kind === "videoinput"));
      })
      .catch(() => setCameraAvailable(false));
  }, []);

  useEffect(() => {
    if (!cards.length) return;
    // A new run (StrictMode, cards that change) cancels the previous one
    let cancelled = false;

    async function buildIndex() {
      const [cached, confirmed] = await Promise.all([
        loadHashesFromIDB(),
        loadConfirmedHashes(),
      ]);
      if (cancelled) return;

      confirmedIndex.current = confirmed;

      const missing = cards.filter((c) => !cached.has(c.id));
      hashIndex.current = cached;

      if (missing.length === 0) {
        setIndexProgress(cards.length);
        setStatus("idle");
        return;
      }

      setStatus("indexing");
      // Only the cached hashes of the current cards count
      setIndexProgress(cards.length - missing.length);

      const BATCH_SIZE = 10;
      for (let i = 0; i < missing.length; i += BATCH_SIZE) {
        if (cancelled) return;
        const batch = missing.slice(i, i + BATCH_SIZE);
        await Promise.allSettled(
          batch.map(async (card) => {
            try {
              const hashes = await computeHashes(card.thumbnail);
              if (cancelled) return;
              hashIndex.current.set(card.id, hashes);
              setIndexProgress((prev) => prev + 1);
            } catch {}
          }),
        );
      }
      if (cancelled) return;

      await saveHashesToIDB(hashIndex.current);
      setStatus("idle");
    }

    buildIndex();
    return () => {
      cancelled = true;
    };
  }, [cards.length]);

  const searchByImage = async (file: File) => {
    const preview = URL.createObjectURL(file);
    setPreviewUrl(preview);
    setResult(null);
    setStatus("searching");

    try {
      const photoHashes = await computeHashes(file);
      lastPhotoHashes.current = photoHashes;

      let bestCard: ICardsProps | null = null;
      let bestDist = Infinity;

      for (const card of cards) {
        const stored = hashIndex.current.get(card.id);
        if (!stored) continue;

        if (
          stored.ahash.length !== photoHashes.ahash.length ||
          stored.dhash.length !== photoHashes.dhash.length ||
          stored.phash.length !== photoHashes.phash.length
        )
          continue;

        const refDist = combinedDistance(photoHashes, stored);

        const confirmedDist = getBestConfirmedDistance(
          photoHashes,
          card.id,
          confirmedIndex.current,
        );

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
      } else {
        setStatus("not_found");
      }
    } catch (e) {
      console.error("Erreur searchByImage:", e);
      setStatus("error");
    }
  };

  function addToHistory(card: ICardsProps, preview: string) {
    setHistory((prev) => {
      if (prev[0]?.card.id === card.id) return prev;
      return [
        { card, previewUrl: preview, scannedAt: new Date() },
        ...prev.slice(0, 9),
      ];
    });
  }

  const confirmResult = async () => {
    if (result && previewUrl) {
      addToHistory(result, previewUrl);

      if (lastPhotoHashes.current) {
        try {
          await saveConfirmedHash(
            result.id,
            lastPhotoHashes.current,
            confirmedIndex.current,
          );
        } catch (e) {
          // The result is still valid even if the hash could not be saved
          console.error("Erreur saveConfirmedHash:", e);
        }
      }
    }
    setStatus("found");
  };

  const rejectResult = () => {
    setResult(null);
    setStatus("not_found");
  };

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
