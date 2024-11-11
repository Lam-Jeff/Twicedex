import { expect, test, describe } from 'vitest';
import { useContext } from 'react';
import * as predicates from '../predicates';
import { AuthContext } from "../authProvider";
describe('PREDICATES', () => {

    describe('isThresholdEraReached', () => {
        test('testValue<threshold: False', () => {
            const testValue = 10;
            const threshold = 20;
            expect(predicates.isThresholdEraReached(threshold, testValue)).toBeFalsy();
        });

        test('testValue>threshold: True', () => {
            const testValue = 30;
            const threshold = 20;
            expect(predicates.isThresholdEraReached(threshold, testValue)).toBeTruthy();
        });

        test('testValue==threshold: True', () => {
            const testValue = 20;
            const threshold = 20;
            expect(predicates.isThresholdEraReached(threshold, testValue)).toBeTruthy();
        });

    })

    describe('isThresholdCategoryReached', () => {
        test('testValue<threshold: False', () => {
            const testValue = 10;
            const threshold = 20;
            expect(predicates.isThresholdCategoryReached(threshold, testValue)).toBeFalsy();
        });

        test('testValue>threshold: True', () => {
            const testValue = 30;
            const threshold = 20;
            expect(predicates.isThresholdCategoryReached(threshold, testValue)).toBeTruthy();
        });

        test('testValue==threshold: True', () => {
            const testValue = 20;
            const threshold = 20;
            expect(predicates.isThresholdCategoryReached(threshold, testValue)).toBeTruthy();
        });
    })

    describe('isThresholdMembersReached', () => {
        test('testValue<threshold: False', () => {
            const testValue = 10;
            const threshold = 20;
            expect(predicates.isThresholdMembersReached(threshold, testValue)).toBeFalsy();
        });

        test('testValue>threshold: True', () => {
            const testValue = 30;
            const threshold = 20;
            expect(predicates.isThresholdMembersReached(threshold, testValue)).toBeTruthy();
        });


        test('testValue==threshold: True', () => {
            const testValue = 20;
            const threshold = 20;
            expect(predicates.isThresholdMembersReached(threshold, testValue)).toBeTruthy();
        });
    })

    describe('isThresholdCollectionReached', () => {
        test('testValue<threshold: False', () => {
            const testValue: number[] = [];
            const threshold = 2;
            expect(predicates.isThresholdCollectionReached(threshold, testValue)).toBeFalsy();
        });

        test('testValue>threshold: True', () => {
            const testValue: number[] = [2, 3, 4];
            const threshold = 2;
            expect(predicates.isThresholdCollectionReached(threshold, testValue)).toBeTruthy();
        });


        test('testValue==threshold: True', () => {
            const testValue: number[] = [1, 2];
            const threshold = 2;
            expect(predicates.isThresholdCollectionReached(threshold, testValue)).toBeTruthy();
        });
    });

    describe('isThresholdAchievementsReached', () => {
        test('testValue<threshold: False', () => {
            const testValue: number[] = [1];
            const threshold = 2;
            expect(predicates.isThresholdAchievementsReached(threshold, testValue)).toBeFalsy();
        });

        test('testValue>threshold: True', () => {
            const testValue: number[] = [1, 2, 3, 4];
            const threshold = 2;
            expect(predicates.isThresholdAchievementsReached(threshold, testValue)).toBeTruthy();
        });


        test('testValue==threshold: True', () => {
            const testValue: number[] = [1, 2];
            const threshold = 2;
            expect(predicates.isThresholdAchievementsReached(threshold, testValue)).toBeTruthy();
        });

    })

})


