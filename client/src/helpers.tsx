import game from './files/game.json'
import albums from './files/albums.json'
import { ICardsProps } from './collection'
import { IStatsProps } from './miniGame'

const now = new Date()
export const imageOfTheDay = game[(now.getFullYear() * now.getDate() * (now.getMonth() + 1)) % game.length]
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
export function filterValues(data: { name: string, checked: boolean }[]) :  string[]{
    const filteredData = data.filter(object => {
        return object.checked
    }).map(object => object.name)

    return filteredData
}

/* MINIGAME */

/**
 * Find longest streak and current streak in an array of stats.
 * 
 * @param {IStatsProps[]} array - an array with user's stats
 * 
 * @returns {{ longestStreak: number, currentStreak: number } }
 */
export function findWinStreak(array: IStatsProps[]): { longestStreak: number, currentStreak: number } {
    let longestStreak = 0;
    let streakCount = 0;
    let streakList = []
    let currentStreak = 0;

    if (array.length === 1) {
        longestStreak = array[0].findAnswer ? 1 : 0
        currentStreak = array[0].findAnswer ? 1 : 0
        return { longestStreak, currentStreak }
    } else if (array.length === 0) { return { longestStreak, currentStreak } }

    for (let i = 0; i < array.length; i++) {
        if (array[i].findAnswer) {
            streakCount++;
            if (i === array.length - 1) {
                if (streakCount > longestStreak) {
                    longestStreak = streakCount;
                }
                streakList.push(streakCount)
            }
        } else {
            if (streakCount > longestStreak) {
                longestStreak = streakCount;
            }
            if (i !== array.length - 1) {
                streakList.push(streakCount)
                streakCount = 0;
            } else {
                streakList.push(0)
            }
        }
    }
    currentStreak = streakList[streakList.length - 1]
    return { longestStreak, currentStreak };
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

