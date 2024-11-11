import albums from './files/albums.json';
import { ICardsProps } from './collection';
import { isThresholdAchievementsReached, isThresholdCategoryReached, isThresholdCollectionReached, isThresholdEraReached, isThresholdMembersReached, isUserCreated } from './predicates';
import { TAchievementProps } from './types/achievement';

export const firstElementOfCategory: Record<string, number> = {
    'Korean Albums': albums.findIndex(object => object.categories.includes('Korean Albums')),
    'Japanese Albums': albums.findIndex(object => object.categories.includes('Japanese Albums')),
    'Thai Albums': albums.findIndex(object => object.categories.includes('Thai Albums')),
    'Solo/Subunit': albums.findIndex(object => object.categories.includes('Solo/Subunit')),
    'Memberships': albums.findIndex(object => object.categories.includes('Memberships')),
    'Greetings': albums.findIndex(object => object.categories.includes('Greetings')),
    'DVDs/Blu-rays': albums.findIndex(object => object.categories.includes('DVDs/Blu-rays')),
    'Stores/Merch': albums.findIndex(object => object.categories.includes('Stores/Merch')),
    'Promos': albums.findIndex(object => object.categories.includes('Promos')),
    'Events': albums.findIndex(object => object.categories.includes('Events'))
}

/* FILTER */

/**
 * Retrieve data from the LocalStorage.
 * 
 * @param {string} name - name of the local storage
 * 
 * @return {{ name: string, checked: boolean }}
 */
export function getLocalStoragePreferences(name: string): string[] {
    const pref = localStorage.getItem(name)
    if (pref) {
        const object = JSON.parse(pref)
        return object.filter((obj: { name: string, checked: boolean }) => obj.checked).map((obj: { name: string, checked: boolean }) => obj.name)
    }
    return []
}

/**
 * Retrieves values from the URL
 * 
 * @param {string} UrlParams - parameters in the url
 * @param {{ name: string, checked: boolean, display: boolean }[]} array - array to update with the url parameters
 * 
 * @returns {{ name: string, checked: boolean, display: boolean }[]}
 */
export function getValuesArrayFromUrl(urlParams: string | null, array: { name: string, checked: boolean, display: boolean }[]): { name: string, checked: boolean, display: boolean }[] {
    let params: string[] = []
    let newArray = []
    if (urlParams) params = JSON.parse(urlParams);
    else return array;

    if (!params) {
        newArray = array.map(object => object.display ? { ...object, checked: false } : object);
        return newArray;
    }
    else {
        newArray = array.map(object => params.includes(object.name) && object.display ? { ...object, checked: true } : { ...object, checked: false });
        return newArray;
    }
}

/**
 * Filter values.
 * 
 * @param {{ name: string, checked: boolean }[]} data - array to filter
 * 
 * @returns {string[]}
 */
export function filterValues(data: { name: string, checked: boolean }[]): string[] {
    const filteredData = data.filter(object => {
        return object.checked
    }).map(object => object.name)

    return filteredData
}

/* COLLECTION */

/**
 * Filter array according to display attribute.
 * 
 * @param {ICardsProps[]} cards - array of cards
 * 
 * @returns { ICardsProps[]}
 */
export function filterCardsToDisplay(cards: ICardsProps[]): ICardsProps[] {
    return cards.filter(card => card.display)
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
export function getLengthCardsDisplayed(array: ICardsProps[], album: string, category: string): number {
    return array.filter(card => card.era === album && card.categories.includes(category) && card.display).length
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
export function filterByAlbumAndCategory(array: ICardsProps[], album: string, category: string): ICardsProps[] {
    return array.filter(card => card.era === album && card.categories.includes(category))
}

/* PAGINATION */

/**
 * Get pages number.
 * 
 * @param {T[]} array - an array
 * @param {number} numberElementsPerPage - number of elements per page
 * 
 * @returns {number[]}
 */
export function getPages<T>(array: T[], numberElementsPerPage: number): number[] {
    let pages = []
    for (let i = 1; i <= Math.ceil(array.length / numberElementsPerPage); i++) {
        pages.push(i);
    }
    return pages;
}

/* PROFILE */

/**
 * Get progression by era.
 * 
 * @param {number[]} userCollection - an array representing the cards acquired
 * @param {ICardsProps[]} cards - list of cards in the database
 * 
 * @returns {Record<string, number>}
 */
export function computeProgressionPercentByEra(userCollection: number[], cards: ICardsProps[]): Record<string, number> {
    let acquiredList: Record<string, number> = {};
    let totalList: Record<string, number> = {};
    let progression: Record<string, number> = {};

    cards.forEach(card => totalList[card.era] = (totalList[card.era] || 0) + 1);
    userCollection.forEach((value) => {
        let _index = cards.find(card => card.id === value)?.era;
        if (_index) acquiredList[_index] = (acquiredList[_index] || 0) + 1;
    });

    for (const key in totalList) {
        if (acquiredList[key]) progression[key] = Math.round(acquiredList[key] / totalList[key] * 100);
        else progression[key] = 0;
    };
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
export function computeProgressionPercentByCategory(userCollection: number[], cards: ICardsProps[]): Record<string, { percent: number, acquired: number, total: number }> {
    let acquiredList: Record<string, number> = {}
    let totalList: Record<string, number> = {}
    let progression: Record<string, { percent: number, acquired: number, total: number }> = {}

    for (let _cat in firstElementOfCategory) {
        acquiredList[_cat] = 0;
        totalList[_cat] = 0;
    }

    cards.forEach((value) => {
        let _categories = value.categories
        if (userCollection.includes(value.id)) {
            _categories.forEach(cat => { acquiredList[cat] += 1; })
        }
        _categories.forEach(cat => totalList[cat] += 1)
    })

    for (let _cat in firstElementOfCategory) {
        progression[_cat] = { percent: Math.round(acquiredList[_cat] / totalList[_cat] * 100), acquired: acquiredList[_cat], total: totalList[_cat] }
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
export function computeProgressionByMembers(userCollection: number[], cards: ICardsProps[], members: string[]): number {
    let collectionFiltered: ICardsProps[] = []
    if(members.length== 0) return 0;
    if (members.length == 1) {
        let member = members[0];
        collectionFiltered = cards.filter(card => userCollection.includes(card.id) && card.members.length == 1 && card.members.includes(member));
    } else {
        collectionFiltered = cards.filter(card => userCollection.includes(card.id) && members.every(member => card.members.includes(member)));
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
export function checkAchievement(achievement: TAchievementProps, userAchievements: number[], cards: ICardsProps[], userCollection: number[], percentEras: Record<string, number>, percentCategories: Record<string, { percent: number, acquired: number, total: number }>): boolean {
    let criteria = achievement.criteria;
    let rule = criteria.trigger.rule;
    let conditions = criteria.conditions;
    let target = criteria.trigger.target ? criteria.trigger.target : [];
    let threshold = criteria.trigger.match;
    if (conditions) {
        conditions.forEach(condition => {
            if (!userAchievements.includes(condition)) return false;
        });
    }

    switch (rule) {
        case "user_created":
            return isUserCreated();
        case "threshold_era":
            let era = target[0];
            return isThresholdEraReached(threshold, percentEras[era]);
        case "threshold_category":
            let category = target[0];
            return isThresholdCategoryReached(threshold, percentCategories[category].percent);
        case "threshold_members":
            let numberCardsAcquired = computeProgressionByMembers(userCollection, cards, target);
            return isThresholdMembersReached(threshold, numberCardsAcquired);
        case "threshold_collection_size":
            return isThresholdCollectionReached(threshold, userCollection);
        case "threshold_achievements":
            return isThresholdAchievementsReached(threshold, userAchievements);
        default:
            return false;
    }
}