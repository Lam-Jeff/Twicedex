import { useContext } from "react";
import { AuthContext } from "./authProvider";

/**
 * Check whether number of cards in user collection for a specific era has reached an achievement threshold.
 * 
 * @param {number} threshold - a number representing the value to reached
 * @param {number} percentEra - a number representing the percent progression for a era
 * 
 * @returns {boolean}
 */
export function isThresholdEraReached(threshold: number, percentEra: number): boolean {
    return percentEra >= threshold;
}

/**
 * Check whether number of cards in user collection for a specific era has reached an achievement threshold.
 * 
 * @param {number} threshold - a number representing the value to reached
 * @param {number} percentCategory - a number representing the percent progression for a category
 * 
 * @returns {boolean}
 */
export function isThresholdCategoryReached(threshold: number, percentCategory: number): boolean {
    return percentCategory >= threshold;
}

/**
 * Check whether number of cards in user collection for specific members has reached an achievement threshold.
 * 
 * @param {number} threshold - a number representing the value to reached
 * @param {number} numberCardsAcquired - a number representing the cards acquired
 * 
 * @returns {boolean}
 */
export function isThresholdMembersReached(threshold: number, numberCardsAcquired: number): boolean {
    return numberCardsAcquired >= threshold;
}

/**
 * Check whether number of cards in user collection has reached an achievement threshold.
 * 
 * @param {number} threshold - a number representing the value to reached
 * @param {number[]} userCollection - an array representing the cards acquired
 * 
 * @returns {boolean}
 */
export function isThresholdCollectionReached( threshold: number, userCollection: number[]): boolean {
    return userCollection.length >= threshold;
}

/**
 * Check whether number of cards in user collection has reached an achievement threshold.
 * 
 * @param {number} threshold - a number representing the value to reached
 * @param {number[]} userAchievements - an array representing the achievements acquired
 * 
 * @returns {boolean}
 */
export function isThresholdAchievementsReached(threshold: number, userAchievements: number[]): boolean {
    return userAchievements.length >= threshold;
}

/**
 * Check whether the user exists.
 *
 * @returns {boolean}
 */
export function isUserCreated(): boolean {
    const { user } = useContext(AuthContext);
    return user ? true : false;

}

