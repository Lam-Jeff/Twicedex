import albums from "./files/albums.json";
import { ICardsProps } from "./collection";
import {
  isThresholdAchievementsReached,
  isThresholdCategoryReached,
  isThresholdCollectionReached,
  isThresholdEraReached,
  isThresholdMembersReached,
  isUserCreated,
} from "./predicates";
import { TAchievementProps } from "./types/achievement";
import { TAlbumsProps } from "./types/albums";

export const firstElementOfCategory: Record<string, number> = {
  "Korean Albums": albums.findIndex((object) =>
    object.categories.includes("Korean Albums"),
  ),
  "Japanese Albums": albums.findIndex((object) =>
    object.categories.includes("Japanese Albums"),
  ),
  "Thai Albums": albums.findIndex((object) =>
    object.categories.includes("Thai Albums"),
  ),
  "Solo/Subunit": albums.findIndex((object) =>
    object.categories.includes("Solo/Subunit"),
  ),
  Memberships: albums.findIndex((object) =>
    object.categories.includes("Memberships"),
  ),
  Greetings: albums.findIndex((object) =>
    object.categories.includes("Greetings"),
  ),
  "DVDs/Blu-rays": albums.findIndex((object) =>
    object.categories.includes("DVDs/Blu-rays"),
  ),
  "Stores/Merch": albums.findIndex((object) =>
    object.categories.includes("Stores/Merch"),
  ),
  Promos: albums.findIndex((object) => object.categories.includes("Promos")),
  Events: albums.findIndex((object) => object.categories.includes("Events")),
};

/**
 * Retrieve data from the sessionStorage.
 *
 * @param {string} name - name of the session storage
 *
 * @return {{ name: string, checked: boolean }}
 */
export function getSessionStoragePreferences(name: string): string[] {
  const pref = sessionStorage.getItem(name);
  if (pref) {
    const object = JSON.parse(pref);
    return object
      .filter((obj: { name: string; checked: boolean }) => obj.checked)
      .map((obj: { name: string; checked: boolean }) => obj.name);
  }
  return [];
}

/**
 * Filter values.
 *
 * @param {{ name: string, checked: boolean }[]} data - array to filter
 *
 * @returns {string[]}
 */
export function filterValues(
  data: { name: string; checked: boolean }[],
): string[] {
  let filteredData = data
    .filter((object) => {
      return object.checked;
    })
    .map((object) => object.name);
  if (filteredData.length == 0) {
    filteredData = data.map((_object) => _object.name);
  }
  return filteredData;
}

/**
 * Filter array according to display attribute.
 *
 * @param {ICardsProps[]} cards - array of cards
 *
 * @returns { ICardsProps[]}
 */
export function filterCardsToDisplay(cards: ICardsProps[]): ICardsProps[] {
  return cards.filter((card) => card.display);
}

/**
 * Get length of an array according to album and category.
 *
 * @param {ICardsProps[]} array : array to filter
 * @param {string} album - album's name
 * @param {string} category - category's name
 *
 * @returns {number}
 */
export function getLengthCardsDisplayed(
  array: ICardsProps[],
  album: string,
  category: string,
): number {
  return array.filter(
    (card) =>
      card.era === album && card.categories.includes(category) && card.display,
  ).length;
}

/**
 * Filter an array according to album and category.
 *
 * @param {ICardsProps[]} array : array to filter
 * @param {string} album - album's name
 * @param {string} category - category's name
 *
 * @returns {ICardsProps[]}
 */
export function filterByAlbumAndCategory(
  array: ICardsProps[],
  album: string,
  category: string,
): ICardsProps[] {
  return array.filter(
    (card) => card.era === album && card.categories.includes(category),
  );
}

/**
 * Get pages number.
 *
 * @param {T[]} array - an array
 * @param {number} numberElementsPerPage - number of elements per page
 *
 * @returns {number[]}
 */
export function getPages<T>(
  array: T[],
  numberElementsPerPage: number,
): number[] {
  let pages = [];
  for (let i = 1; i <= Math.ceil(array.length / numberElementsPerPage); i++) {
    pages.push(i);
  }
  return pages;
}

/**
 * Get progression by era.
 *
 * @param {number[]} userCollection - an array representing the cards acquired
 * @param {ICardsProps[]} cards - list of cards in the database
 *
 * @returns  {Record<string, { percent: number, acquired: number, total: number }>}
 */
export function computeProgressionPercentByEra(
  userCollection: number[],
  cards: ICardsProps[],
): Record<string, { percent: number; acquired: number; total: number }> {
  let acquiredList: Record<string, number> = {};
  let totalList: Record<string, number> = {};
  let progression: Record<
    string,
    { percent: number; acquired: number; total: number }
  > = {};

  cards.forEach(
    (card) => (totalList[card.era] = (totalList[card.era] || 0) + 1),
  );
  userCollection.forEach((value) => {
    let _index = cards.find((card) => card.id === value)?.era;
    if (_index) acquiredList[_index] = (acquiredList[_index] || 0) + 1;
  });

  for (const key in totalList) {
    if (acquiredList[key])
      progression[key] = {
        percent: Math.round((acquiredList[key] / totalList[key]) * 100),
        acquired: acquiredList[key],
        total: totalList[key],
      };
    else progression[key] = { percent: 0, acquired: 0, total: totalList[key] };
  }
  return progression;
}

/**
 * Get progression by category.
 *
 * @param {number[]} userCollection - an array representing the cards acquired
 * @param {ICardsProps[]} cards - list of cards in the database
 *
 * @returns {Record<string, { percent: number, acquired: number, total: number }>}
 */
export function computeProgressionPercentByCategory(
  userCollection: number[],
  cards: ICardsProps[],
): Record<string, { percent: number; acquired: number; total: number }> {
  let acquiredList: Record<string, number> = {};
  let totalList: Record<string, number> = {};
  let progression: Record<
    string,
    { percent: number; acquired: number; total: number }
  > = {};

  for (let _cat in firstElementOfCategory) {
    acquiredList[_cat] = 0;
    totalList[_cat] = 0;
  }

  cards.forEach((value) => {
    let _categories = value.categories;
    if (userCollection.includes(value.id)) {
      _categories.forEach((cat) => {
        acquiredList[cat] += 1;
      });
    }
    _categories.forEach((cat) => (totalList[cat] += 1));
  });

  for (let _cat in firstElementOfCategory) {
    progression[_cat] = {
      percent: Math.round((acquiredList[_cat] / totalList[_cat]) * 100) ?? 0,
      acquired: acquiredList[_cat],
      total: totalList[_cat],
    };
  }
  return progression;
}

/**
 * Get progression by members.
 * 
 * @param {ICardsProps[]} cards - list of cards in the database
 * @param {number[]} userCollection - an array representing the cards acquired
 * @param {string[]} members - an array representing the members

 * 
 * @returns {number}
 */
export function computeProgressionByMembers(
  userCollection: number[],
  cards: ICardsProps[],
  members: string[],
): number {
  let collectionFiltered: ICardsProps[] = [];
  if (members.length == 0) return 0;
  if (members.length == 1) {
    let member = members[0];
    collectionFiltered = cards.filter(
      (card) =>
        userCollection.includes(card.id) &&
        card.members.length == 1 &&
        card.members.includes(member),
    );
  } else {
    collectionFiltered = cards.filter(
      (card) =>
        userCollection.includes(card.id) &&
        members.every((member) => card.members.includes(member)),
    );
  }
  return collectionFiltered.length;
}

/**
 * Check whether achievement is successful.
 *
 * @param {TAchievementProps} achievement - an array representing the cards acquired
 * @param {number[]} userAchievements - an array representing the achievements acquired
 * @param {ICardsProps[]} cards - list of cards in the database
 * @param {number[]} userCollection - an array representing the cards acquired
 * @param {Record<string, number>} percentEras - an array representing the progression of all eras
 * @param {Record<string, { percent: number, acquired: number, total: number }>} percentCategories - an array representing the progression of all categories
 *
 * @returns {boolean}
 */
export function checkAchievement(
  achievement: TAchievementProps,
  userAchievements: number[],
  cards: ICardsProps[],
  userCollection: number[],
  percentEras: Record<
    string,
    { percent: number; acquired: number; total: number }
  >,
  percentCategories: Record<
    string,
    { percent: number; acquired: number; total: number }
  >,
): boolean {
  let criteria = achievement.criteria;
  let rule = criteria.trigger.rule;
  let conditions = criteria.conditions;
  let target = criteria.trigger.target ? criteria.trigger.target : [];
  let threshold = criteria.trigger.match;
  if (conditions) {
    conditions.forEach((condition) => {
      if (!userAchievements.includes(condition)) return false;
    });
  }
  if (rule === "threshold_era" && !percentEras[target[0]]) return false;
  if (rule === "threshold_category" && !percentCategories[target[0]])
    return false;
  switch (rule) {
    case "user_created":
      return isUserCreated();
    case "threshold_era":
      return isThresholdEraReached(threshold, percentEras[target[0]].percent);
    case "threshold_category":
      return isThresholdCategoryReached(
        threshold,
        percentCategories[target[0]].percent,
      );
    case "threshold_members":
      let numberCardsAcquired = computeProgressionByMembers(
        userCollection,
        cards,
        target,
      );
      return isThresholdMembersReached(threshold, numberCardsAcquired);
    case "threshold_collection_size":
      return isThresholdCollectionReached(threshold, userCollection);
    case "threshold_achievements":
      return isThresholdAchievementsReached(threshold, userAchievements);
    default:
      return false;
  }
}

/**
 * Get number of albums displayed.
 *
 * @param {TAlbumsProps[]} array : array to filter
 *
 * @returns {number}
 */
export function getLengthSetsDisplayed(array: TAlbumsProps[]): number {
  return array.filter((album) => album.display).length;
}

/**
 * Filter albums array according to radio button's value : All / In Progress / Completed.
 *
 * @param {TAlbumsProps[]} albums : array to filter
 * @param {string} type : radio button's value
 * @param {Record<string, { percent: number, acquired: number, total: number }>} progressionByEra : a record with the progression of each era (aka set)
 * @param {string} category : category
 *
 * @returns {TAlbumsProps[]}
 */
export function filterAlbumsbyRadioButtonType(
  albums: TAlbumsProps[],
  type: string,
  progressionByEra: Record<
    string,
    { percent: number; acquired: number; total: number }
  >,
  category: string,
): TAlbumsProps[] {
  let newAlbums: TAlbumsProps[] = [];

  if (type === "All") {
    newAlbums = albums.map((album) =>
      album.categories.includes(category)
        ? { ...album, display: true }
        : { ...album, display: false },
    );
  } else if (type === "In progress") {
    newAlbums = albums.map((album) => {
      if (
        !progressionByEra[album.name] ||
        !album.categories.includes(category)
      ) {
        return { ...album, display: false };
      }
      if (
        progressionByEra[album.name].percent > 0 &&
        progressionByEra[album.name].percent != 100
      ) {
        return { ...album, display: true };
      }
      return { ...album, display: false };
    });
  } else {
    newAlbums = albums.map((album) => {
      if (
        !progressionByEra[album.name] ||
        !album.categories.includes(category)
      ) {
        return { ...album, display: false };
      }
      if (progressionByEra[album.name].percent == 100) {
        return { ...album, display: true };
      }
      return { ...album, display: false };
    });
  }
  return newAlbums;
}

/**
 * Filter albums array according to search text.
 *
 * @param {TAlbumsProps[]} albums : array to filter
 * @param {string} searchText : search's value
 *
 * @returns {TAlbumsProps[]}
 */
export function filterAlbumsBySearchValue(
  albums: TAlbumsProps[],
  searchText: string,
): TAlbumsProps[] {
  let newAlbums: TAlbumsProps[] = [];

  const regex = new RegExp(searchText, "i");
  if (searchText.length > 0) {
    newAlbums = albums.map((album) => {
      if (regex.test(album.name) && album.display) {
        return { ...album, display: true };
      }
      return { ...album, display: false };
    });
  } else if (searchText.length === 0) {
    newAlbums = albums;
  }
  return newAlbums;
}

/**
 * Filter albums array by category.
 *
 * @param {TAlbumsProps[]} albums : array to filter
 * @param {string} category : category
 *
 * @returns {TAlbumsProps[]}
 */
export function filterAlbumsByCategory(
  albums: TAlbumsProps[],
  category: string,
): TAlbumsProps[] {
  let newAlbums: TAlbumsProps[] = [];

  newAlbums = albums.map((album) => {
    if (album.categories.includes(category)) {
      return { ...album, display: true };
    }
    return { ...album, display: false };
  });
  return newAlbums;
}

/**
 * Get progression by era and category.
 *
 * @param {number[]} userCollection - an array representing the cards acquired
 * @param {ICardsProps[]} cards - list of cards in the database
 * @param {string} category - category
 *
 * @returns {Record<string, { percent: number, acquired: number, total: number }>}
 */
export function computeProgressionByEraAndCategory(
  userCollection: number[],
  cards: ICardsProps[],
  category: string,
): Record<string, { percent: number; acquired: number; total: number }> {
  let acquiredList: Record<string, number> = {};
  let totalList: Record<string, number> = {};
  let progression: Record<
    string,
    { percent: number; acquired: number; total: number }
  > = {};

  cards.forEach((card) => {
    if (card.categories.includes(category))
      totalList[card.era] = (totalList[card.era] || 0) + 1;
  });
  userCollection.forEach((value) => {
    let _index = cards.find(
      (card) => card.id === value && card.categories.includes(category),
    )?.era;
    if (_index) acquiredList[_index] = (acquiredList[_index] || 0) + 1;
  });

  for (const key in totalList) {
    if (acquiredList[key])
      progression[key] = {
        percent: Math.round((acquiredList[key] / totalList[key]) * 100),
        acquired: acquiredList[key],
        total: totalList[key],
      };
    else progression[key] = { percent: 0, acquired: 0, total: totalList[key] };
  }
  return progression;
}

/**
 * Sort Albums.
 *
 * @param {TAlbumsProps[]} albums : array to filter
 * @param {string} sort : sort type
 *
 * @returns {TAlbumsProps[]}
 */
export function sortAlbums(
  albums: TAlbumsProps[],
  sort: string,
  progressionByEra: Record<
    string,
    { percent: number; acquired: number; total: number }
  >,
): TAlbumsProps[] {
  if (albums.length === 0) return albums;
  let newAlbums = albums.filter((album) => album.display);
  switch (sort) {
    case "Collection progress (Ascending)":
      newAlbums.sort((a, b) => {
        if (!progressionByEra[a.name])
          return 0 - progressionByEra[b.name].percent;
        else if (!progressionByEra[b.name])
          return progressionByEra[a.name].percent;
        return (
          progressionByEra[a.name].percent - progressionByEra[b.name].percent
        );
      });
      break;
    case "Collection progress (Descending)":
      newAlbums.sort((a, b) => {
        if (!progressionByEra[a.name]) return progressionByEra[b.name].percent;
        else if (!progressionByEra[b.name])
          return 0 - progressionByEra[a.name].percent;
        return (
          progressionByEra[b.name].percent - progressionByEra[a.name].percent
        );
      });
      break;
    case "Name (A - Z)":
      newAlbums.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "Name (Z - A)":
      newAlbums.sort((a, b) => b.name.localeCompare(a.name));
      break;
    case "Release date (Old to new)":
      newAlbums.sort((a, b) => {
        const date_1 = new Date(a.release).getTime();
        const date_2 = new Date(b.release).getTime();
        return date_1 - date_2;
      });
      break;
    case "Release date (New to old)":
      newAlbums.sort((a, b) => {
        const date_1 = new Date(a.release).getTime();
        const date_2 = new Date(b.release).getTime();
        return date_2 - date_1;
      });
      break;
    default:
      break;
  }
  return newAlbums;
}

/**
 * Get progression by members and era.
 * @param {number[]} userCollection - an array representing the cards acquired
 * @param {ICardsProps[]} cards - list of cards in the database
 *
 * @returns {Record<string, { percent: number, acquired: number, total: number }>}
 */
export function computeProgressionByMemberAndEra(
  userCollection: number[],
  cards: ICardsProps[],
): Record<string, { percent: number; acquired: number; total: number }> {
  let progression: Record<
    string,
    { percent: number; acquired: number; total: number }
  > = {};
  let acquiredList: Record<string, number> = {};
  let totalList: Record<string, number> = {};

  cards.forEach((card) => {
    card.members.forEach(
      (member) => (totalList[member] = (totalList[member] || 0) + 1),
    );
  });
  userCollection.forEach((value) => {
    let members = cards.find((card) => card.id === value)?.members;
    if (members)
      members.forEach(
        (_member) => (acquiredList[_member] = (acquiredList[_member] || 0) + 1),
      );
  });

  for (const key in totalList) {
    if (acquiredList[key])
      progression[key] = {
        percent: Math.round((acquiredList[key] / totalList[key]) * 100),
        acquired: acquiredList[key],
        total: totalList[key],
      };
    else progression[key] = { percent: 0, acquired: 0, total: totalList[key] };
  }
  return progression;
}

/**
 * Get progression by benefits and era.
 *
 * @param {number[]} userCollection - an array representing the cards acquired
 * @param {ICardsProps[]} cards - list of cards in the database
 *
 * @returns {Record<string, { percent: number, acquired: number, total: number }>}
 */
export function computeProgressionByBenefitsAndEra(
  userCollection: number[],
  cards: ICardsProps[],
): Record<string, { percent: number; acquired: number; total: number }> {
  let progression: Record<
    string,
    { percent: number; acquired: number; total: number }
  > = {};
  let acquiredList: Record<string, number> = {};
  let totalList: Record<string, number> = {};

  cards.forEach((card) => {
    totalList[card.benefit] = (totalList[card.benefit] || 0) + 1;
  });
  userCollection.forEach((value) => {
    let _index = cards.find((card) => card.id === value)?.benefit;
    if (_index) acquiredList[_index] = (acquiredList[_index] || 0) + 1;
  });

  for (const key in totalList) {
    if (acquiredList[key])
      progression[key] = {
        percent: Math.round((acquiredList[key] / totalList[key]) * 100),
        acquired: acquiredList[key],
        total: totalList[key],
      };
    else progression[key] = { percent: 0, acquired: 0, total: totalList[key] };
  }
  return progression;
}

/**
 * Get value in sesstionStorage or in url if its exist.
 *
 * @param {string} key - string representing a key in sessionStorage
 * @param {T} fallback - fallback value if value in sessionStorage is null
 * @param {string|null} urlValue - value in url
 *
 * @returns {T}
 */
export function getInitialValue<T>(
  key: string,
  fallback: T,
  urlValue?: string | null,
): T {
  if (urlValue !== undefined && urlValue !== null)
    return urlValue as unknown as T;
  const stored = sessionStorage.getItem(key);
  if (!stored) return fallback;
  return JSON.parse(stored) as T;
}

/**
 * Convert option string to its code.
 *
 * @param {string} option - Filter option
 *
 * @return {string}
 */
export function optionToCode(option: string): string {
  switch (option) {
    case "All":
      return "all";
    case "In collection":
      return "inc";
    case "Not in collection":
      return "notin";
    case "In wishlist":
      return "inw";
    default:
      return "all";
  }
}

/**
 * Convert code to its option string.
 *
 * @param {string} code - Code representing a filter option
 *
 * @return {string}
 */
export function codeToOption(code: string): string {
  switch (code) {
    case "all":
      return "All";
    case "inc":
      return "In collection";
    case "notin":
      return "Not in collection";
    case "inw":
      return "In wishlist";
    default:
      return "All";
  }
}
