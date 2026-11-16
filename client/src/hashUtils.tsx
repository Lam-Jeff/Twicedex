export type Hashes = { ahash: string; dhash: string; phash: string };

// ── Helpers ───────────────────────────────────────────

function toGrays(data: Uint8ClampedArray): number[] {
  const grays: number[] = [];
  for (let i = 0; i < data.length; i += 4) {
    grays.push(0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]);
  }
  return grays;
}

function normalizeContrast(grays: number[]): number[] {
  const min = Math.min(...grays);
  const max = Math.max(...grays);
  const range = max - min || 1;
  return grays.map((g) => ((g - min) / range) * 255);
}

function computeAHash(grays: number[]): string {
  const avg = grays.reduce((a, b) => a + b, 0) / grays.length;
  return grays.map((g) => (g > avg ? "1" : "0")).join("");
}

function computeDHash(grays: number[], size: number): string {
  const bits: string[] = [];
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size - 1; col++) {
      const idx = row * size + col;
      bits.push(grays[idx] > grays[idx + 1] ? "1" : "0");
    }
  }
  return bits.join("");
}

function computePHash(grays: number[], size: number): string {
  const dct: number[] = [];
  for (let u = 0; u < 8; u++) {
    for (let v = 0; v < 8; v++) {
      let sum = 0;
      for (let x = 0; x < size; x++) {
        for (let y = 0; y < size; y++) {
          sum +=
            grays[x * size + y] *
            Math.cos(((2 * x + 1) * u * Math.PI) / (2 * size)) *
            Math.cos(((2 * y + 1) * v * Math.PI) / (2 * size));
        }
      }
      dct.push(sum);
    }
  }
  const dctWithoutDC = dct.slice(1);
  const avg = dctWithoutDC.reduce((a, b) => a + b, 0) / dctWithoutDC.length;
  return dctWithoutDC.map((v) => (v > avg ? "1" : "0")).join("");
}

// ── API publique ──────────────────────────────────────

export async function computeHashes(source: string | File): Promise<Hashes> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const isFile = source instanceof File;
    const url = isFile ? URL.createObjectURL(source) : source;

    if (!isFile) img.crossOrigin = "anonymous";

    img.onload = () => {
      const canvas16 = document.createElement("canvas");
      canvas16.width = canvas16.height = 16;
      const ctx16 = canvas16.getContext("2d")!;
      ctx16.drawImage(img, 0, 0, 16, 16);
      const grays16Raw = toGrays(ctx16.getImageData(0, 0, 16, 16).data);
      const grays16 = isFile ? normalizeContrast(grays16Raw) : grays16Raw;

      const canvas32 = document.createElement("canvas");
      canvas32.width = canvas32.height = 32;
      const ctx32 = canvas32.getContext("2d")!;
      ctx32.drawImage(img, 0, 0, 32, 32);
      const grays32Raw = toGrays(ctx32.getImageData(0, 0, 32, 32).data);
      const grays32 = isFile ? normalizeContrast(grays32Raw) : grays32Raw;

      if (isFile) URL.revokeObjectURL(url);

      resolve({
        ahash: computeAHash(grays16),
        dhash: computeDHash(grays16, 16),
        phash: computePHash(grays32, 32),
      });
    };

    img.onerror = reject;
    img.src = url;
  });
}

export function hammingDistance(h1: string, h2: string): number {
  let d = 0;
  for (let i = 0; i < h1.length; i++) if (h1[i] !== h2[i]) d++;
  return d;
}

export function combinedDistance(photo: Hashes, stored: Hashes): number {
  const distA = hammingDistance(photo.ahash, stored.ahash);
  const distD = hammingDistance(photo.dhash, stored.dhash);
  const distP = hammingDistance(photo.phash, stored.phash);
  return distP * 0.5 + distD * 0.3 + distA * 0.2;
}
