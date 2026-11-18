import * as helpers from "../helpers";
import { ICardsProps } from "../collection";
import { TAlbumsProps } from "../types/albums";
import { firstElementOfCategory } from "../helpers";

type Progress = { percent: number; acquired: number; total: number };

const categoryNames = Object.keys(firstElementOfCategory);
const [catA, catB] = categoryNames;

const makeCard = (overrides: Partial<ICardsProps> = {}): ICardsProps => ({
  id: 1,
  name: "MemberA_E1_1",
  checked: false,
  thumbnail: "",
  categories: [catA],
  members: ["MemberA"],
  era: "Era One",
  benefit: "Original",
  display: true,
  ...overrides,
});

const makeAlbum = (overrides: Partial<TAlbumsProps> = {}): TAlbumsProps => ({
  name: "Album Alpha",
  checked: false,
  categories: ["Cat1"],
  members: ["MemberA", "MemberB"],
  benefits: ["Original"],
  display: true,
  code: "ALPHA",
  release: "2024-01-01T00:00:00.000Z",
  image: "",
  ...overrides,
});

afterEach(() => {
  sessionStorage.removeItem("TEST");
});

/* ------------------------------------------------------------------ */
/* Tests                                                               */
/* ------------------------------------------------------------------ */

describe("getSessionStoragePreferences", () => {
  test("returns the names with checked=true when set", () => {
    const preferences = [
      { name: "1", checked: true },
      { name: "2", checked: false },
    ];
    sessionStorage.setItem("TEST", JSON.stringify(preferences));
    expect(helpers.getSessionStoragePreferences("TEST")).toEqual(["1"]);
  });

  test("returns [] when nothing is stored", () => {
    expect(helpers.getSessionStoragePreferences("TEST")).toEqual([]);
  });
});

describe("filterValues", () => {
  test("returns only the names with checked=true", () => {
    const values = [
      { name: "1", checked: true },
      { name: "2", checked: true },
      { name: "3", checked: false },
      { name: "4", checked: true },
    ];
    expect(helpers.filterValues(values)).toEqual(["1", "2", "4"]);
  });
});

describe("getPages", () => {
  test("returns [] for an empty array", () => {
    expect(helpers.getPages([], 5)).toEqual([]);
  });

  test("returns one page number per chunk of 5 items", () => {
    expect(helpers.getPages([1, 2, 3, 4, 5, 6], 5)).toEqual([1, 2]);
  });
});

describe("filterCardsToDisplay", () => {
  test("returns [] when no card has display=true", () => {
    const cards = [
      makeCard({ id: 1, display: false }),
      makeCard({ id: 2, display: false }),
    ];
    expect(helpers.filterCardsToDisplay(cards)).toEqual([]);
  });

  test("keeps only the cards with display=true", () => {
    const cards = [
      makeCard({ id: 1, display: false }),
      makeCard({ id: 2, display: true }),
    ];
    expect(helpers.filterCardsToDisplay(cards).map((c) => c.id)).toEqual([2]);
  });
});

describe("getLengthCardsDisplayed", () => {
  const cards = [makeCard({ id: 1 }), makeCard({ id: 2 })];

  test("returns 0 for an empty array", () => {
    expect(helpers.getLengthCardsDisplayed([], "Era One", catA)).toBe(0);
  });

  test("returns 0 when no card matches the album", () => {
    expect(helpers.getLengthCardsDisplayed(cards, "Unknown era", catA)).toBe(0);
  });

  test("counts the displayed cards matching the album and category", () => {
    expect(helpers.getLengthCardsDisplayed(cards, "Era One", catA)).toBe(2);
  });
});

describe("filterByAlbumAndCategory", () => {
  test("returns [] for an empty array", () => {
    expect(helpers.filterByAlbumAndCategory([], "Era One", catA)).toEqual([]);
  });

  test("returns [] when no card matches the album", () => {
    const cards = [makeCard({ id: 1 }), makeCard({ id: 2 })];
    expect(
      helpers.filterByAlbumAndCategory(cards, "Unknown era", catA),
    ).toEqual([]);
  });

  test("returns the cards matching the album and category, whatever their display value", () => {
    const cards = [
      makeCard({ id: 1, display: false }),
      makeCard({ id: 2, display: true }),
    ];
    expect(helpers.filterByAlbumAndCategory(cards, "Era One", catA)).toEqual(
      cards,
    );
  });
});

describe("computeProgressionPercentByEra", () => {
  const cards = [
    makeCard({ id: 1, display: false }),
    makeCard({ id: 2 }),
    makeCard({ id: 3, era: "Era Two", members: ["MemberC"] }),
  ];

  test("returns 0% for every era when nothing is owned", () => {
    const expected: Record<string, Progress> = {
      "Era One": { percent: 0, acquired: 0, total: 2 },
      "Era Two": { percent: 0, acquired: 0, total: 1 },
    };
    expect(helpers.computeProgressionPercentByEra([], cards)).toEqual(expected);
  });

  test("returns 100% for the era whose cards are all owned", () => {
    const expected: Record<string, Progress> = {
      "Era One": { percent: 100, acquired: 2, total: 2 },
      "Era Two": { percent: 0, acquired: 0, total: 1 },
    };
    expect(helpers.computeProgressionPercentByEra([1, 2], cards)).toEqual(
      expected,
    );
  });
});

describe("computeProgressionPercentByCategory", () => {
  // Cards 1 and 2 are in catA, card 3 is in both catA and catB.
  const cards = [
    makeCard({ id: 1, display: false }),
    makeCard({ id: 2 }),
    makeCard({ id: 3, categories: [catA, catB], members: ["MemberB"] }),
  ];

  const expectedFor = (
    overrides: Record<string, Progress>,
  ): Record<string, Progress> => ({
    ...Object.fromEntries(
      categoryNames.map((name) => [
        name,
        { acquired: 0, percent: NaN, total: 0 },
      ]),
    ),
    ...overrides,
  });

  test("returns 0% for the categories with cards when nothing is owned", () => {
    expect(helpers.computeProgressionPercentByCategory([], cards)).toEqual(
      expectedFor({
        [catA]: { acquired: 0, percent: 0, total: 3 },
        [catB]: { acquired: 0, percent: 0, total: 1 },
      }),
    );
  });

  test("counts a card in each of its categories and rounds the percent", () => {
    // owned: cards 1 and 2 (both only in catA); card 3 (catA and catB) is not owned
    expect(helpers.computeProgressionPercentByCategory([1, 2], cards)).toEqual(
      expectedFor({
        [catA]: { acquired: 2, percent: 67, total: 3 }, // Math.round(2 / 3 * 100)
        [catB]: { acquired: 0, percent: 0, total: 1 },
      }),
    );
  });
});

describe("computeProgressionByMembers", () => {
  test("returns 0 when no member is requested", () => {
    const cards = [
      makeCard({ id: 1 }),
      makeCard({ id: 2, members: ["MemberB"] }),
    ];
    expect(helpers.computeProgressionByMembers([1, 2], cards, [])).toBe(0);
  });

  test("counts the owned cards of the requested member", () => {
    const cards = [
      makeCard({ id: 1, members: ["MemberA"] }),
      makeCard({ id: 2, members: ["MemberB"] }),
      makeCard({ id: 3, members: ["MemberC"] }),
    ];
    expect(
      helpers.computeProgressionByMembers([1, 2, 3], cards, ["MemberC"]),
    ).toBe(1);
  });

  test("counts only the cards containing all the requested members", () => {
    const cards = [
      makeCard({ id: 1, members: ["MemberA"] }),
      makeCard({ id: 2, members: ["MemberA", "MemberC"] }),
      makeCard({ id: 3, members: ["MemberC"] }),
    ];
    expect(
      helpers.computeProgressionByMembers([1, 2, 3], cards, [
        "MemberC",
        "MemberA",
      ]),
    ).toBe(1);
  });
});

describe("getLengthSetsDisplayed", () => {
  test("returns 0 for an empty array", () => {
    expect(helpers.getLengthSetsDisplayed([])).toBe(0);
  });

  test("counts the sets with display=true", () => {
    const albums = [
      makeAlbum({ display: true }),
      makeAlbum({ name: "Album Bravo", display: false }),
    ];
    expect(helpers.getLengthSetsDisplayed(albums)).toBe(1);
  });
});

describe("filterAlbumsbyRadioButtonType", () => {
  const albumName = "Album Alpha";

  test.each([
    // [filter, percent of the album, category requested, displayed albums]
    ["All", 50, "Cat2", 0],
    ["All", 50, "Cat1", 1],
    ["In progress", 50, "Cat2", 0],
    ["In progress", 50, "Cat1", 1],
    ["Completed", 100, "Cat2", 0],
    ["Completed", 100, "Cat1", 1],
  ])(
    "%s (album at %i%%) with category %s: %i displayed",
    (type, percent, category, expectedLength) => {
      const albums = [
        makeAlbum({ name: albumName, categories: ["Cat1"], display: false }),
      ];
      const percentEras: Record<string, Progress> = {
        [albumName]: { percent, acquired: percent, total: 100 },
        "Other album": { percent: 0, acquired: 0, total: 281 },
      };
      const result = helpers
        .filterAlbumsbyRadioButtonType(albums, type, percentEras, category)
        .filter((album) => album.display);
      expect(result).toHaveLength(expectedLength);
    },
  );
});

describe("filterAlbumsBySearchValue", () => {
  const albums = [
    makeAlbum({ name: "Album Bravo", code: "BRAVO" }),
    makeAlbum({ name: "Album Charlie", code: "CHARLIE" }),
  ];

  test("returns everything for an empty search", () => {
    const result = helpers
      .filterAlbumsBySearchValue(albums, "")
      .filter((album) => album.display);
    expect(result).toHaveLength(2);
  });

  test("returns the albums whose name matches the search", () => {
    const result = helpers
      .filterAlbumsBySearchValue(albums, "Bravo")
      .filter((album) => album.display);
    expect(result.map((album) => album.name)).toEqual(["Album Bravo"]);
  });

  test("returns nothing when no album matches", () => {
    const result = helpers
      .filterAlbumsBySearchValue(albums, "Zulu")
      .filter((album) => album.display);
    expect(result).toHaveLength(0);
  });
});

describe("filterAlbumsByCategory", () => {
  test("returns only the albums of the requested category", () => {
    const albums = [
      makeAlbum({ name: "Album Bravo", categories: ["Cat1"] }),
      makeAlbum({ name: "Album Charlie", categories: ["Cat2"] }),
    ];
    const result = helpers
      .filterAlbumsByCategory(albums, "Cat2")
      .filter((album) => album.display);
    expect(result.map((album) => album.name)).toEqual(["Album Charlie"]);
  });
});

describe("computeProgressionByEraAndCategory", () => {
  const cards = [
    makeCard({ id: 1, display: false }),
    makeCard({ id: 2 }),
    makeCard({ id: 3, era: "Era Two", members: ["MemberC"] }),
  ];

  test("returns {} when no card belongs to the category", () => {
    expect(helpers.computeProgressionByEraAndCategory([], cards, catB)).toEqual(
      {},
    );
  });

  test("returns the progression of each era of the category", () => {
    const expected: Record<string, Progress> = {
      "Era One": { percent: 100, acquired: 2, total: 2 },
      "Era Two": { percent: 0, acquired: 0, total: 1 },
    };
    expect(
      helpers.computeProgressionByEraAndCategory([1, 2], cards, catA),
    ).toEqual(expected);
  });
});

describe("sortAlbums", () => {
  // Alphabetical order is Alpha < Bravo < Charlie < Delta.
  // Release order is Bravo < Alpha < Delta < Charlie.
  // Progress order is Bravo (0) < Delta (25) < Alpha (35) < Charlie (100).
  const makeAlbums = (): TAlbumsProps[] => [
    makeAlbum({ name: "Album Bravo", release: "2023-12-20T00:00:00.000Z" }),
    makeAlbum({ name: "Album Charlie", release: "2024-11-30T00:00:00.000Z" }),
    makeAlbum({ name: "Album Delta", release: "2024-11-23T00:00:00.000Z" }),
    makeAlbum({ name: "Album Alpha", release: "2024-11-02T00:00:00.000Z" }),
  ];
  const progression: Record<string, Progress> = {
    "Album Charlie": { percent: 100, acquired: 2, total: 2 },
    "Album Bravo": { percent: 0, acquired: 0, total: 2 },
    "Album Delta": { percent: 25, acquired: 1, total: 4 },
    "Album Alpha": { percent: 35, acquired: 7, total: 20 },
  };

  test.each([
    [
      "Collection progress (Ascending)",
      ["Album Bravo", "Album Delta", "Album Alpha", "Album Charlie"],
    ],
    [
      "Collection progress (Descending)",
      ["Album Charlie", "Album Alpha", "Album Delta", "Album Bravo"],
    ],
    [
      "Name (A - Z)",
      ["Album Alpha", "Album Bravo", "Album Charlie", "Album Delta"],
    ],
    [
      "Name (Z - A)",
      ["Album Delta", "Album Charlie", "Album Bravo", "Album Alpha"],
    ],
    [
      "Release date (Old to new)",
      ["Album Bravo", "Album Alpha", "Album Delta", "Album Charlie"],
    ],
    [
      "Release date (New to old)",
      ["Album Charlie", "Album Delta", "Album Alpha", "Album Bravo"],
    ],
  ])("%s", (sortType, expectedNames) => {
    const result = helpers.sortAlbums(makeAlbums(), sortType, progression);
    expect(result.map((album) => album.name)).toEqual(expectedNames);
  });
});

describe("computeProgressionByMemberAndEra", () => {
  const cards = [
    makeCard({ id: 1, display: false, members: ["MemberA"] }),
    makeCard({ id: 2, members: ["MemberB"] }),
    makeCard({ id: 3, era: "Era Two", members: ["MemberC"] }),
  ];

  test("returns 0% for every member when nothing is owned", () => {
    const expected: Record<string, Progress> = {
      MemberA: { acquired: 0, percent: 0, total: 1 },
      MemberB: { acquired: 0, percent: 0, total: 1 },
      MemberC: { acquired: 0, percent: 0, total: 1 },
    };
    expect(helpers.computeProgressionByMemberAndEra([], cards)).toEqual(
      expected,
    );
  });

  test("returns 100% for the members whose card is owned", () => {
    const expected: Record<string, Progress> = {
      MemberA: { acquired: 1, percent: 100, total: 1 },
      MemberB: { acquired: 1, percent: 100, total: 1 },
      MemberC: { acquired: 0, percent: 0, total: 1 },
    };
    expect(helpers.computeProgressionByMemberAndEra([1, 2], cards)).toEqual(
      expected,
    );
  });
});

describe("computeProgressionByBenefitsAndEra", () => {
  test("returns 0% for the benefit when nothing is owned", () => {
    const cards = [
      makeCard({ id: 1, display: false }),
      makeCard({ id: 2, members: ["MemberB"] }),
    ];
    const expected: Record<string, Progress> = {
      Original: { acquired: 0, percent: 0, total: 2 },
    };
    expect(helpers.computeProgressionByBenefitsAndEra([], cards)).toEqual(
      expected,
    );
  });

  test("computes the progression of each benefit", () => {
    const cards = [
      makeCard({ id: 1, display: false }),
      makeCard({ id: 2, members: ["MemberB"] }),
      makeCard({ id: 3, members: ["MemberC"], benefit: "Pre-order" }),
    ];
    const expected: Record<string, Progress> = {
      Original: { acquired: 1, percent: 50, total: 2 },
      "Pre-order": { acquired: 1, percent: 100, total: 1 },
    };
    expect(helpers.computeProgressionByBenefitsAndEra([1, 3], cards)).toEqual(
      expected,
    );
  });
});

describe("getInitialValue", () => {
  test("returns the url value when it exists", () => {
    expect(helpers.getInitialValue("TEST", "fallback", "urlValue")).toBe(
      "urlValue",
    );
  });

  test("returns the fallback when neither the url nor the session has a value", () => {
    expect(helpers.getInitialValue("TEST", "fallback", null)).toBe("fallback");
  });

  test("returns the sessionStorage value when there is no url value", () => {
    sessionStorage.setItem("TEST", JSON.stringify("session"));
    expect(helpers.getInitialValue("TEST", "fallback", null)).toBe("session");
  });

  test("gives priority to the url value over sessionStorage", () => {
    sessionStorage.setItem("TEST", JSON.stringify("session"));
    expect(helpers.getInitialValue("TEST", "fallback", "urlValue")).toBe(
      "urlValue",
    );
  });
});

describe("optionToCode", () => {
  test("returns the default code 'all' for an unknown option", () => {
    expect(helpers.optionToCode("TEST")).toBe("all");
  });

  test("returns 'inc' for 'In collection'", () => {
    expect(helpers.optionToCode("In collection")).toBe("inc");
  });
});

describe("codeToOption", () => {
  test("returns the default option 'All' for an unknown code", () => {
    expect(helpers.codeToOption("TEST")).toBe("All");
  });

  test("returns 'Not in collection' for 'notin'", () => {
    expect(helpers.codeToOption("notin")).toBe("Not in collection");
  });
});
