import { combinedDistance, computeHashes, hammingDistance } from "../hashUtils";
import type { Hashes } from "../hashUtils";

/* ------------------------------------------------------------------ */
/* Fixtures                                                            */
/* ------------------------------------------------------------------ */

const hashes = (ahash: string, dhash: string, phash: string): Hashes => ({
  ahash,
  dhash,
  phash,
});

// Builds the RGBA pixels of a square image from a gray level per pixel.
const makePixels = (
  size: number,
  gray: (row: number, col: number) => number,
): Uint8ClampedArray => {
  const data = new Uint8ClampedArray(size * size * 4);
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      const i = (row * size + col) * 4;
      data[i] = data[i + 1] = data[i + 2] = gray(row, col);
      data[i + 3] = 255;
    }
  }
  return data;
};

class FakeImage {
  static instances: FakeImage[] = [];
  static fail = false;
  crossOrigin = "";
  onload: (() => void) | null = null;
  onerror: ((error: unknown) => void) | null = null;

  constructor() {
    FakeImage.instances.push(this);
  }

  // An accessor (not a class field), so that "img.src = url" always goes through it.
  set src(_value: string) {
    queueMicrotask(() =>
      FakeImage.fail
        ? this.onerror?.(new Error("load failed"))
        : this.onload?.(),
    );
  }
}

// Fakes the image loading (jsdom does not load images) and the canvas pixels.
const stubBrowser = (gray: (row: number, col: number) => number) => {
  FakeImage.instances = [];
  vi.stubGlobal("Image", FakeImage);

  const realCreateElement = document.createElement.bind(document);
  vi.spyOn(document, "createElement").mockImplementation(((tag: string) => {
    if (tag !== "canvas") return realCreateElement(tag);
    return {
      width: 0,
      height: 0,
      getContext: () => ({
        drawImage: vi.fn(),
        // The image is the same at any resolution: a gray function of the relative position.
        getImageData: (_x: number, _y: number, w: number) => ({
          data: makePixels(w, (row, col) => gray(row / w, col / w)),
        }),
      }),
    };
  }) as typeof document.createElement);

  Object.assign(URL, {
    createObjectURL: vi.fn(() => "blob:photo"),
    revokeObjectURL: vi.fn(),
  });
};

const leftWhite = (_row: number, col: number) => (col < 0.5 ? 255 : 0);
const leftBlack = (_row: number, col: number) => (col < 0.5 ? 0 : 255);

afterEach(() => {
  FakeImage.fail = false;
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

/* ------------------------------------------------------------------ */
/* Tests                                                               */
/* ------------------------------------------------------------------ */

describe("hammingDistance", () => {
  test("is 0 for identical hashes", () => {
    expect(hammingDistance("10110", "10110")).toBe(0);
  });

  test("counts the differing bits", () => {
    expect(hammingDistance("10110", "10011")).toBe(2);
  });

  test("is the length when every bit differs", () => {
    expect(hammingDistance("0000", "1111")).toBe(4);
  });

  test("is 0 for empty hashes", () => {
    expect(hammingDistance("", "")).toBe(0);
  });
});

describe("combinedDistance", () => {
  test("is 0 for identical hashes", () => {
    const h = hashes("0101", "01", "1");
    expect(combinedDistance(h, h)).toBe(0);
  });

  test("weights pHash 0.5, dHash 0.3 and aHash 0.2", () => {
    const photo = hashes("0000", "00", "0");
    const stored = hashes("1111", "11", "1");
    // 1 * 0.5 + 2 * 0.3 + 4 * 0.2
    expect(combinedDistance(photo, stored)).toBeCloseTo(1.9);
  });

  test("counts each hash on its own", () => {
    const base = hashes("0000", "00", "0");
    expect(combinedDistance(base, hashes("1000", "00", "0"))).toBeCloseTo(0.2);
    expect(combinedDistance(base, hashes("0000", "10", "0"))).toBeCloseTo(0.3);
    expect(combinedDistance(base, hashes("0000", "00", "1"))).toBeCloseTo(0.5);
  });

  test("is symmetric", () => {
    const a = hashes("0011", "01", "1");
    const b = hashes("1010", "11", "0");
    expect(combinedDistance(a, b)).toBeCloseTo(combinedDistance(b, a));
  });
});

describe("computeHashes", () => {
  test("returns binary hashes of the expected length", async () => {
    stubBrowser(leftWhite);
    const result = await computeHashes("/images/card.jpg");
    expect(result.ahash).toMatch(/^[01]{256}$/); // 16 x 16
    expect(result.dhash).toMatch(/^[01]{240}$/); // 16 rows x 15 comparisons
    expect(result.phash).toMatch(/^[01]{63}$/); // 8 x 8 DCT without the DC term
  });

  test("aHash marks the pixels brighter than the average", async () => {
    stubBrowser(leftWhite);
    const { ahash } = await computeHashes("/images/card.jpg");
    const row = "1".repeat(8) + "0".repeat(8);
    expect(ahash).toBe(row.repeat(16));
  });

  test("dHash marks the pixels brighter than their right neighbour", async () => {
    stubBrowser(leftWhite);
    const { dhash } = await computeHashes("/images/card.jpg");
    // only the white -> black boundary (between columns 7 and 8) gives a 1
    const row = "0".repeat(7) + "1" + "0".repeat(7);
    expect(dhash).toBe(row.repeat(16));
  });

  test("dHash is all 0 when the brightness only grows to the right", async () => {
    stubBrowser(leftBlack);
    const { dhash } = await computeHashes("/images/card.jpg");
    expect(dhash).toBe("0".repeat(240));
  });

  test("a uniform image gives an all-0 aHash and dHash", async () => {
    stubBrowser(() => 128);
    const { ahash, dhash } = await computeHashes("/images/card.jpg");
    expect(ahash).toBe("0".repeat(256));
    expect(dhash).toBe("0".repeat(240));
  });

  test("gives the same hashes for the same image", async () => {
    stubBrowser(leftWhite);
    const first = await computeHashes("/images/card.jpg");
    const second = await computeHashes("/images/card.jpg");
    expect(second).toEqual(first);
  });

  test("gives different hashes for different images", async () => {
    stubBrowser(leftWhite);
    const white = await computeHashes("/images/card.jpg");
    vi.restoreAllMocks();
    stubBrowser(leftBlack);
    const black = await computeHashes("/images/card.jpg");
    expect(combinedDistance(white, black)).toBeGreaterThan(25);
  });

  test("a remote image is loaded with crossOrigin=anonymous", async () => {
    stubBrowser(leftWhite);
    await computeHashes("https://example.com/card.jpg");
    expect(FakeImage.instances[0].crossOrigin).toBe("anonymous");
    expect(URL.createObjectURL).not.toHaveBeenCalled();
  });

  test("a file is read through an object URL that is released afterwards", async () => {
    stubBrowser(leftWhite);
    const file = new File(["x"], "photo.jpg", { type: "image/jpeg" });
    await computeHashes(file);
    expect(URL.createObjectURL).toHaveBeenCalledWith(file);
    expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:photo");
    expect(FakeImage.instances[0].crossOrigin).toBe("");
  });

  test("a photo and its reference image get (almost) the same hashes", async () => {
    stubBrowser(leftWhite);
    const reference = await computeHashes("/images/card.jpg");
    const photo = await computeHashes(new File(["x"], "photo.jpg"));
    expect(combinedDistance(photo, reference)).toBeLessThan(25);
  });

  test("rejects when the image cannot be loaded", async () => {
    stubBrowser(leftWhite);
    FakeImage.fail = true;
    await expect(computeHashes("/images/missing.jpg")).rejects.toThrow();
  });
});
