import { StrictMode } from "react";
import { act, renderHook, waitFor } from "@testing-library/react";
import { useImageSearch } from "../useImageSearch";
import { computeHashes } from "../hashUtils";
import type { Hashes } from "../hashUtils";
import { loadHashesFromIDB, saveHashesToIDB } from "../idbUtils";
import {
  getBestConfirmedDistance,
  loadConfirmedHashes,
  saveConfirmedHash,
} from "../confirmedHashes";
import { ICardsProps } from "../collection";

// Only computeHashes is replaced: the real distance functions are used.
vi.mock("../hashUtils", async (importOriginal) => ({
  ...(await importOriginal<typeof import("../hashUtils")>()),
  computeHashes: vi.fn(),
}));
vi.mock("../idbUtils", () => ({
  loadHashesFromIDB: vi.fn(),
  saveHashesToIDB: vi.fn(),
}));
vi.mock("../confirmedHashes", () => ({
  loadConfirmedHashes: vi.fn(),
  saveConfirmedHash: vi.fn(),
  getBestConfirmedDistance: vi.fn(),
}));

/* ------------------------------------------------------------------ */
/* Fixtures                                                            */
/* ------------------------------------------------------------------ */

const makeCard = (id: number): ICardsProps => ({
  id,
  name: `MemberA_E1_${id}`,
  checked: false,
  thumbnail: `/thumbnails/${id}.jpg`,
  categories: ["Albums"],
  members: ["MemberA"],
  era: "Era One",
  benefit: "Original",
  display: true,
});

const makeCards = (count: number) =>
  Array.from({ length: count }, (_, i) => makeCard(i + 1));

const ZERO: Hashes = {
  ahash: "0".repeat(256),
  dhash: "0".repeat(240),
  phash: "0".repeat(63),
};

// Only the aHash differs, 0.2 per bit: hashAt(d) is at distance d from ZERO.
const hashAt = (distance: number): Hashes => {
  const ones = Math.round(distance * 5);
  return { ...ZERO, ahash: "1".repeat(ones) + "0".repeat(256 - ones) };
};

// A hash with only the bit `i` set: distance 0 to itself, 0.4 to any other one.
const bit = (i: number): Hashes => ({
  ...ZERO,
  ahash: "0".repeat(i) + "1" + "0".repeat(255 - i),
});

const toMap = (entries: Record<number, Hashes>) =>
  new Map<number, Hashes>(
    Object.entries(entries).map(([id, h]) => [Number(id), h]),
  );

const photo = () => new File(["x"], "photo.jpg", { type: "image/jpeg" });

const mockCamera = (devices: unknown) => {
  Object.defineProperty(navigator, "mediaDevices", {
    configurable: true,
    value: { enumerateDevices: vi.fn(() => devices) },
  });
};

beforeEach(() => {
  vi.resetAllMocks();
  vi.mocked(computeHashes).mockResolvedValue(ZERO);
  vi.mocked(loadHashesFromIDB).mockResolvedValue(new Map());
  vi.mocked(saveHashesToIDB).mockResolvedValue(undefined);
  vi.mocked(loadConfirmedHashes).mockResolvedValue(new Map());
  vi.mocked(saveConfirmedHash).mockResolvedValue(undefined);
  vi.mocked(getBestConfirmedDistance).mockReturnValue(Infinity);
  Object.assign(URL, { createObjectURL: vi.fn(() => "blob:preview") });
});

afterEach(() => {
  Reflect.deleteProperty(navigator, "mediaDevices");
});

// Renders the hook once the index is ready (every card is in the cache).
const setupIndexed = async (
  cards: ICardsProps[],
  stored: Record<number, Hashes>,
) => {
  vi.mocked(loadHashesFromIDB).mockResolvedValue(toMap(stored));
  const hook = renderHook(() => useImageSearch(cards));
  await waitFor(() => expect(hook.result.current.status).toBe("idle"));
  return hook;
};

const search = (hook: ReturnType<typeof renderHook<ReturnType<typeof useImageSearch>, unknown>>) =>
  act(async () => {
    await hook.result.current.searchByImage(photo());
  });

/* ------------------------------------------------------------------ */
/* Tests                                                               */
/* ------------------------------------------------------------------ */

describe("useImageSearch - index", () => {
  test("is idle with a full progress when every card is cached", async () => {
    const cards = makeCards(3);
    const { result } = await setupIndexed(cards, { 1: ZERO, 2: ZERO, 3: ZERO });
    expect(result.current.indexProgress).toBe(3);
    expect(result.current.totalCards).toBe(3);
    expect(computeHashes).not.toHaveBeenCalled();
  });

  test("computes only the missing hashes, then saves the index", async () => {
    const cards = makeCards(3);
    vi.mocked(loadHashesFromIDB).mockResolvedValue(toMap({ 1: ZERO }));
    const { result } = renderHook(() => useImageSearch(cards));
    await waitFor(() => expect(result.current.status).toBe("idle"));

    expect(vi.mocked(computeHashes).mock.calls.map(([src]) => src)).toEqual([
      "/thumbnails/2.jpg",
      "/thumbnails/3.jpg",
    ]);
    expect(saveHashesToIDB).toHaveBeenCalledTimes(1);
    expect([...vi.mocked(saveHashesToIDB).mock.calls[0][0].keys()].sort()).toEqual([1, 2, 3]);
    expect(result.current.indexProgress).toBe(3);
  });

  test("goes on when the image of a card cannot be loaded", async () => {
    const cards = makeCards(3);
    vi.mocked(computeHashes).mockImplementation(async (src) => {
      if (src === "/thumbnails/2.jpg") throw new Error("404");
      return ZERO;
    });
    const { result } = renderHook(() => useImageSearch(cards));
    await waitFor(() => expect(result.current.status).toBe("idle"));
    expect(result.current.indexProgress).toBe(2);
  });

  test("does nothing while there are no cards", async () => {
    renderHook(() => useImageSearch([]));
    await act(async () => {});
    expect(loadHashesFromIDB).not.toHaveBeenCalled();
  });

  test("computes each thumbnail only once under StrictMode", async () => {
    const cards = makeCards(4);
    const { result } = renderHook(() => useImageSearch(cards), {
      wrapper: StrictMode,
    });
    await waitFor(() => expect(result.current.status).toBe("idle"));
    expect(computeHashes).toHaveBeenCalledTimes(4);
    expect(result.current.indexProgress).toBe(4);
  });

  test("never reports more progress than cards when the cache holds old cards", async () => {
    const cards = makeCards(3);
    // ids 10 and 11 do not exist anymore
    const { result } = await setupIndexed(cards, { 1: ZERO, 2: ZERO, 10: ZERO, 11: ZERO });
    expect(result.current.indexProgress).toBeLessThanOrEqual(result.current.totalCards);
  });
});

describe("useImageSearch - search", () => {
  const cards = makeCards(2);

  test("keeps the preview of the photo", async () => {
    const hook = await setupIndexed(cards, { 1: hashAt(0), 2: hashAt(50) });
    await search(hook);
    expect(hook.result.current.previewUrl).toBe("blob:preview");
  });

  test("finds the card when the distance is under the certain threshold", async () => {
    const hook = await setupIndexed(cards, { 1: hashAt(20), 2: hashAt(51) });
    await search(hook);
    expect(hook.result.current.status).toBe("found");
    expect(hook.result.current.result?.id).toBe(1);
  });

  test("asks for a confirmation between the two thresholds", async () => {
    const hook = await setupIndexed(cards, { 1: hashAt(30), 2: hashAt(51) });
    await search(hook);
    expect(hook.result.current.status).toBe("found_uncertain");
    expect(hook.result.current.result?.id).toBe(1);
  });

  test("finds nothing above the uncertain threshold", async () => {
    const hook = await setupIndexed(cards, { 1: hashAt(50), 2: hashAt(51) });
    await search(hook);
    expect(hook.result.current.status).toBe("not_found");
    expect(hook.result.current.result).toBeNull();
  });

  test("switches from found to uncertain around 25 (24.8 and 25.2)", async () => {
    const near = await setupIndexed([makeCard(1)], { 1: hashAt(24.8) });
    await search(near);
    expect(near.result.current.status).toBe("found");

    const far = await setupIndexed([makeCard(1)], { 1: hashAt(25.2) });
    await search(far);
    expect(far.result.current.status).toBe("found_uncertain");
  });

  test("switches from uncertain to not found around 45 (44.8 and 45.2)", async () => {
    const near = await setupIndexed([makeCard(1)], { 1: hashAt(44.8) });
    await search(near);
    expect(near.result.current.status).toBe("found_uncertain");

    const far = await setupIndexed([makeCard(1)], { 1: hashAt(45.2) });
    await search(far);
    expect(far.result.current.status).toBe("not_found");
  });

  test("picks the closest card", async () => {
    const three = makeCards(3);
    const hook = await setupIndexed(three, { 1: hashAt(20), 2: hashAt(5), 3: hashAt(12) });
    await search(hook);
    expect(hook.result.current.result?.id).toBe(2);
  });

  test("uses the confirmed photos when they are closer than the reference image", async () => {
    vi.mocked(getBestConfirmedDistance).mockImplementation((_h, id) =>
      id === 2 ? 10 : Infinity,
    );
    const hook = await setupIndexed(cards, { 1: hashAt(51), 2: hashAt(51) });
    await search(hook);
    expect(hook.result.current.status).toBe("found");
    expect(hook.result.current.result?.id).toBe(2);
  });

  test("ignores the cards whose stored hashes have another length", async () => {
    const short: Hashes = { ...ZERO, ahash: "0".repeat(64) };
    const hook = await setupIndexed(cards, { 1: short, 2: hashAt(50) });
    await search(hook);
    expect(hook.result.current.status).toBe("not_found");
  });

  test("goes to the error state when the photo cannot be read", async () => {
    const hook = await setupIndexed(cards, { 1: hashAt(0), 2: hashAt(0) });
    vi.mocked(computeHashes).mockRejectedValue(new Error("bad image"));
    vi.spyOn(console, "error").mockImplementation(() => {});
    await search(hook);
    expect(hook.result.current.status).toBe("error");
  });
});

describe("useImageSearch - history and confirmation", () => {
  const cards = makeCards(12);
  const stored = Object.fromEntries(cards.map((c, i) => [c.id, bit(i)]));

  // Each card is found by a photo that looks exactly like its own reference.
  const searchCard = async (
    hook: Awaited<ReturnType<typeof setupIndexed>>,
    index: number,
  ) => {
    vi.mocked(computeHashes).mockResolvedValue(bit(index));
    await search(hook);
  };

  test("a certain result goes straight to the history", async () => {
    const hook = await setupIndexed(cards, stored);
    await searchCard(hook, 0);
    expect(hook.result.current.history.map((h) => h.card.id)).toEqual([1]);
  });

  test("an uncertain result is not in the history before it is confirmed", async () => {
    const hook = await setupIndexed([makeCard(1)], { 1: hashAt(30) });
    await search(hook);
    expect(hook.result.current.status).toBe("found_uncertain");
    expect(hook.result.current.history).toEqual([]);
  });

  test("confirming adds the card to the history and saves the photo hashes", async () => {
    const hook = await setupIndexed([makeCard(1)], { 1: hashAt(30) });
    await search(hook);
    await act(async () => {
      await hook.result.current.confirmResult();
    });
    expect(hook.result.current.status).toBe("found");
    expect(hook.result.current.history.map((h) => h.card.id)).toEqual([1]);
    expect(saveConfirmedHash).toHaveBeenCalledWith(1, ZERO, expect.any(Map));
  });

  test("still goes to found when the confirmed hash cannot be saved", async () => {
    vi.mocked(saveConfirmedHash).mockRejectedValue(new Error("offline"));
    vi.spyOn(console, "error").mockImplementation(() => {});
    const hook = await setupIndexed([makeCard(1)], { 1: hashAt(30) });
    await search(hook);
    await act(async () => {
      await hook.result.current.confirmResult().catch(() => {});
    });
    expect(hook.result.current.status).toBe("found");
  });

  test("rejecting clears the result", async () => {
    const hook = await setupIndexed([makeCard(1)], { 1: hashAt(30) });
    await search(hook);
    act(() => hook.result.current.rejectResult());
    expect(hook.result.current.status).toBe("not_found");
    expect(hook.result.current.result).toBeNull();
    expect(saveConfirmedHash).not.toHaveBeenCalled();
  });

  test("the same card found twice in a row is added once", async () => {
    const hook = await setupIndexed(cards, stored);
    await searchCard(hook, 0);
    await searchCard(hook, 0);
    expect(hook.result.current.history).toHaveLength(1);
  });

  test("the latest card comes first and only 10 are kept", async () => {
    const hook = await setupIndexed(cards, stored);
    for (let i = 0; i < 12; i++) await searchCard(hook, i);
    const ids = hook.result.current.history.map((h) => h.card.id);
    expect(ids).toHaveLength(10);
    expect(ids[0]).toBe(12);
    expect(ids[9]).toBe(3);
  });

  test("reset goes back to idle but keeps the history", async () => {
    const hook = await setupIndexed(cards, stored);
    await searchCard(hook, 0);
    act(() => hook.result.current.reset());
    expect(hook.result.current.status).toBe("idle");
    expect(hook.result.current.result).toBeNull();
    expect(hook.result.current.previewUrl).toBeNull();
    expect(hook.result.current.history).toHaveLength(1);
  });
});

describe("useImageSearch - camera", () => {
  const run = async () => {
    const { result } = renderHook(() => useImageSearch([]));
    await act(async () => {});
    return result;
  };

  test("is available when a video input exists", async () => {
    mockCamera(Promise.resolve([{ kind: "audioinput" }, { kind: "videoinput" }]));
    expect((await run()).current.cameraAvailable).toBe(true);
  });

  test("is not available without a video input", async () => {
    mockCamera(Promise.resolve([{ kind: "audioinput" }]));
    expect((await run()).current.cameraAvailable).toBe(false);
  });

  test("is not available when the devices cannot be listed", async () => {
    mockCamera(Promise.reject(new Error("denied")));
    expect((await run()).current.cameraAvailable).toBe(false);
  });

  test("is not available when the browser has no media devices", async () => {
    expect((await run()).current.cameraAvailable).toBe(false);
  });
});
