import { StrictMode } from "react";
import { act, renderHook } from "@testing-library/react";
import { useCollection } from "../useOwned";

/* ------------------------------------------------------------------ */
/* Fake PocketBase: an in-memory server behind a mocked fetch          */
/* ------------------------------------------------------------------ */

type RecordData = { owned: unknown; wished: unknown };

const createFakePocketBase = (initial?: RecordData) => {
  const records: Array<{ id: string } & RecordData> = initial
    ? [{ id: "rec1", ...initial }]
    : [];
  const calls = {
    get: 0,
    post: [] as RecordData[],
    patch: [] as Array<{
      url: string;
      body: { owned: number[]; wished: number[] };
    }>,
  };
  let failing: "all" | "patch" | null = null;

  const reply = (body: unknown, ok = true) => ({
    ok,
    status: ok ? 200 : 500,
    json: async () => body,
  });

  const fetchMock = vi.fn(async (url: string, init?: RequestInit) => {
    await Promise.resolve();
    const method = init?.method ?? "GET";
    if (failing === "all" || (failing === "patch" && method === "PATCH")) {
      return reply({}, false);
    }
    if (method === "GET") {
      calls.get += 1;
      return reply({ items: records.slice(0, 1) });
    }
    if (method === "POST") {
      const body = JSON.parse(init!.body as string);
      const record = { id: `rec${records.length + 1}`, ...body };
      records.push(record);
      calls.post.push(body);
      return reply(record);
    }
    // PATCH
    calls.patch.push({ url, body: JSON.parse(init!.body as string) });
    return reply({});
  });

  return {
    fetchMock,
    calls,
    records,
    failWith: (mode: "all" | "patch" | null) => {
      failing = mode;
    },
  };
};

// Lets the pending promises and timers run.
const advance = (ms = 0) =>
  act(async () => {
    await vi.advanceTimersByTimeAsync(ms);
  });

const SAVE_DELAY = 600;

let server: ReturnType<typeof createFakePocketBase>;

const setup = async (
  initial?: RecordData,
  options: { strict?: boolean } = {},
) => {
  server = createFakePocketBase(initial);
  vi.stubGlobal("fetch", server.fetchMock);
  const hook = renderHook(() => useCollection(), {
    wrapper: options.strict ? StrictMode : undefined,
  });
  await advance();
  return hook;
};

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

/* ------------------------------------------------------------------ */
/* Tests                                                               */
/* ------------------------------------------------------------------ */

describe("useCollection - initial loading", () => {
  test("starts in loading state", async () => {
    server = createFakePocketBase({ owned: [], wished: [] });
    vi.stubGlobal("fetch", server.fetchMock);
    const { result } = renderHook(() => useCollection());
    expect(result.current.isLoading).toBe(true);
    expect(result.current.syncStatus).toBe("loading");
    await advance(); // let the loading finish inside act()
  });

  test("loads owned and wished from the existing record", async () => {
    const { result } = await setup({ owned: [1, 2], wished: [3] });
    expect([...result.current.owned]).toEqual([1, 2]);
    expect([...result.current.wished]).toEqual([3]);
    expect(result.current.syncStatus).toBe("synced");
    expect(result.current.isLoading).toBe(false);
  });

  test("accepts fields stored as JSON strings", async () => {
    const { result } = await setup({ owned: "[4,5]", wished: "[6]" });
    expect([...result.current.owned]).toEqual([4, 5]);
    expect([...result.current.wished]).toEqual([6]);
  });

  test("accepts empty or null fields", async () => {
    const { result } = await setup({ owned: null, wished: "" });
    expect([...result.current.owned]).toEqual([]);
    expect([...result.current.wished]).toEqual([]);
  });

  test("creates the record when none exists", async () => {
    const { result } = await setup();
    expect(server.calls.post).toEqual([{ owned: [], wished: [] }]);
    expect(result.current.syncStatus).toBe("synced");
  });

  test("creates only one record under StrictMode (double effect)", async () => {
    await setup(undefined, { strict: true });
    expect(server.records).toHaveLength(1);
  });

  test("goes to the error state when the server fails", async () => {
    server = createFakePocketBase();
    server.failWith("all");
    vi.stubGlobal("fetch", server.fetchMock);
    const { result } = renderHook(() => useCollection());
    await advance();
    expect(result.current.syncStatus).toBe("error");
  });
});

describe("useCollection - toggles", () => {
  test("toggleOwned adds then removes a card", async () => {
    const { result } = await setup({ owned: [], wished: [] });
    act(() => result.current.toggleOwned(7));
    expect(result.current.owned.has(7)).toBe(true);
    act(() => result.current.toggleOwned(7));
    expect(result.current.owned.has(7)).toBe(false);
  });

  test("toggleWished adds then removes a card", async () => {
    const { result } = await setup({ owned: [], wished: [] });
    act(() => result.current.toggleWished(7));
    expect(result.current.wished.has(7)).toBe(true);
    act(() => result.current.toggleWished(7));
    expect(result.current.wished.has(7)).toBe(false);
  });

  test("marking a wished card as owned removes it from wished", async () => {
    const { result } = await setup({ owned: [], wished: [7, 8] });
    act(() => result.current.toggleOwned(7));
    expect([...result.current.owned]).toEqual([7]);
    expect([...result.current.wished]).toEqual([8]);
  });

  test("keeps every card when several are toggled in a row", async () => {
    const { result } = await setup({ owned: [], wished: [] });
    act(() => {
      result.current.toggleOwned(1);
      result.current.toggleOwned(2);
      result.current.toggleOwned(3);
    });
    expect([...result.current.owned]).toEqual([1, 2, 3]);
  });
});

describe("useCollection - saving", () => {
  test("does not save anything just after the loading", async () => {
    await setup({ owned: [1], wished: [] });
    await advance(SAVE_DELAY * 2);
    expect(server.calls.patch).toHaveLength(0);
  });

  test("saves once, after the delay, with the final values", async () => {
    const { result } = await setup({ owned: [], wished: [] });
    act(() => result.current.toggleOwned(1));
    await advance(SAVE_DELAY - 1);
    expect(server.calls.patch).toHaveLength(0);
    await advance(1);
    expect(server.calls.patch).toHaveLength(1);
    expect(server.calls.patch[0].body).toEqual({ owned: [1], wished: [] });
  });

  test("saves to the loaded record", async () => {
    const { result } = await setup({ owned: [], wished: [] });
    act(() => result.current.toggleOwned(1));
    await advance(SAVE_DELAY);
    expect(server.calls.patch[0].url).toContain("/records/rec1");
  });

  test("groups quick toggles into one save with all the cards", async () => {
    const { result } = await setup({ owned: [], wished: [] });
    act(() => result.current.toggleOwned(1));
    await advance(200);
    act(() => result.current.toggleOwned(2));
    await advance(200);
    act(() => result.current.toggleOwned(3));
    await advance(SAVE_DELAY);
    expect(server.calls.patch).toHaveLength(1);
    expect(server.calls.patch[0].body.owned).toEqual([1, 2, 3]);
  });

  test("sends the wished list without the card just marked as owned", async () => {
    const { result } = await setup({ owned: [], wished: [7, 8] });
    act(() => result.current.toggleOwned(7));
    await advance(SAVE_DELAY);
    expect(server.calls.patch[0].body).toEqual({ owned: [7], wished: [8] });
  });

  test("goes through saving then synced", async () => {
    const { result } = await setup({ owned: [], wished: [] });
    act(() => result.current.toggleOwned(1));
    await advance(SAVE_DELAY);
    expect(result.current.syncStatus).toBe("synced");
  });

  test("goes to the error state when the save fails", async () => {
    const { result } = await setup({ owned: [], wished: [] });
    server.failWith("patch");
    act(() => result.current.toggleOwned(1));
    await advance(SAVE_DELAY);
    expect(result.current.syncStatus).toBe("error");
  });
});
