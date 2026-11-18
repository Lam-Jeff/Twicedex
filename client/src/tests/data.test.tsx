import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

/* ------------------------------------------------------------------ */
/* Data consistency checks                                             */
/*                                                                     */
/* Reads cards / albums / members / benefits / categories / news.      */
/* Uses "<name>.json" when it exists (your real data), otherwise       */
/* "<name>.sample.json" (the data shipped in the repository).          */
/* ------------------------------------------------------------------ */

const here = dirname(fileURLToPath(import.meta.url));
const filesDir = resolve(here, "../files");
const stylesDir = resolve(here, "../styles");
const publicDir = resolve(here, "../../public");

const readJson = <T,>(name: string): T => {
  const real = resolve(filesDir, `${name}.json`);
  const sample = resolve(filesDir, `${name}.sample.json`);
  return JSON.parse(readFileSync(existsSync(real) ? real : sample, "utf-8"));
};

type Card = {
  id: number;
  name: string;
  thumbnail: string;
  categories: string[];
  members: string[];
  era: string;
  benefit: string;
};
type Album = {
  name: string;
  code: string;
  categories: string[];
  members: string[];
  benefits: string[];
  release: string;
  image: string;
};
type Named = { name: string; code?: string };
type News = { id: number; thumbnail: string; era: string; category: string };

const cards = readJson<Card[]>("cards");
const albums = readJson<Album[]>("albums");
const members = readJson<Named[]>("members");
const benefits = readJson<Named[]>("benefits");
const categories = readJson<Named[]>("categories");
const news = readJson<News[]>("news");

const memberNames = new Set(members.map((m) => m.name));
const benefitNames = new Set(benefits.map((b) => b.name));
const categoryNames = new Set(categories.map((c) => c.name));
const albumNames = new Set(albums.map((a) => a.name));
const albumCodes = new Set(albums.map((a) => a.code));

const duplicates = (values: (string | number)[]) =>
  values.filter((value, index) => values.indexOf(value) !== index);

// Only local paths ("/images/...") are checked, remote URLs are skipped.
const missingLocalFiles = (paths: string[]) =>
  paths.filter(
    (path) =>
      path.startsWith("/") && !existsSync(resolve(publicDir, `.${path}`)),
  );

const notIn = (values: string[], allowed: Set<string>) =>
  values.filter((value) => !allowed.has(value));

describe("cards", () => {
  test("ids are unique", () => {
    expect(duplicates(cards.map((c) => c.id))).toEqual([]);
  });

  test("every era is the name of an album", () => {
    expect(notIn(cards.map((c) => c.era), albumNames)).toEqual([]);
  });

  test("every member exists in members", () => {
    expect(notIn(cards.flatMap((c) => c.members), memberNames)).toEqual([]);
  });

  test("every category exists in categories", () => {
    expect(notIn(cards.flatMap((c) => c.categories), categoryNames)).toEqual(
      [],
    );
  });

  test("every benefit exists in benefits", () => {
    expect(notIn(cards.map((c) => c.benefit), benefitNames)).toEqual([]);
  });

  test("every local thumbnail file exists", () => {
    expect(missingLocalFiles(cards.map((c) => c.thumbnail))).toEqual([]);
  });
});

describe("albums", () => {
  test("names and codes are unique", () => {
    expect(duplicates(albums.map((a) => a.name))).toEqual([]);
    expect(duplicates(albums.map((a) => a.code))).toEqual([]);
  });

  test("every category exists in categories", () => {
    expect(notIn(albums.flatMap((a) => a.categories), categoryNames)).toEqual(
      [],
    );
  });

  test("every member exists in members", () => {
    expect(notIn(albums.flatMap((a) => a.members), memberNames)).toEqual([]);
  });

  test("every benefit exists in benefits", () => {
    expect(notIn(albums.flatMap((a) => a.benefits), benefitNames)).toEqual([]);
  });

  test("release is a valid date", () => {
    expect(
      albums.filter((a) => Number.isNaN(Date.parse(a.release))).map((a) => a.name),
    ).toEqual([]);
  });

  test("every local image file exists", () => {
    expect(missingLocalFiles(albums.map((a) => a.image))).toEqual([]);
  });
});

describe("categories, members and benefits", () => {
  test("categories have unique names and codes", () => {
    expect(duplicates(categories.map((c) => c.name))).toEqual([]);
    expect(duplicates(categories.map((c) => c.code ?? c.name))).toEqual([]);
  });

  test("members and benefits have unique names", () => {
    expect(duplicates(members.map((m) => m.name))).toEqual([]);
    expect(duplicates(benefits.map((b) => b.name))).toEqual([]);
  });

  test("member names can be used in a CSS class (no space or special character)", () => {
    // The SCSS mixins build selectors like .circle_<name> and .member-chip--<name>
    expect(members.map((m) => m.name).filter((n) => !/^[A-Za-z0-9_-]+$/.test(n))).toEqual([]);
  });
});

describe("news", () => {
  test("ids are unique", () => {
    expect(duplicates(news.map((n) => n.id))).toEqual([]);
  });

  test("every era is the code of an album", () => {
    expect(notIn(news.map((n) => n.era), albumCodes)).toEqual([]);
  });

  test("every category exists in categories", () => {
    expect(notIn(news.map((n) => n.category), categoryNames)).toEqual([]);
  });

  test("every local thumbnail file exists", () => {
    expect(missingLocalFiles(news.map((n) => n.thumbnail))).toEqual([]);
  });
});

describe("SCSS member colors", () => {
  const real = resolve(stylesDir, "_members.scss");
  const sample = resolve(stylesDir, "_members.sample.scss");
  const scss = readFileSync(existsSync(real) ? real : sample, "utf-8");
  const mapText = scss.slice(scss.indexOf("$members"));
  const scssMembers = [
    ...mapText.matchAll(/["']?([\w-]+)["']?\s*:\s*\(\s*color\s*:/g),
  ].map((match) => match[1]);

  test("the $members map is found", () => {
    expect(scssMembers.length).toBeGreaterThan(0);
  });

  test("every member has a color in the SCSS map", () => {
    expect(notIn([...memberNames], new Set(scssMembers))).toEqual([]);
  });

  test("every color in the SCSS map belongs to a member", () => {
    expect(notIn(scssMembers, memberNames)).toEqual([]);
  });
});
