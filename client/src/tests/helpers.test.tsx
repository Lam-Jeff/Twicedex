import { expect, test, describe } from 'vitest'
import * as helpers from '../helpers';
import { ICardsProps } from '../collection';
import { TAchievementProps } from '../types/achievement';
describe('FILTER', () => {

    afterEach(() => {
        localStorage.removeItem('TEST')
    })

    describe('getLocalStoragePreferences', () => {
        test('get names with checked=true in LocalStorage when setted : ["1"]', () => {
            const preferences: { 'name': string, 'checked': boolean }[] = [
                {
                    "name": '1',
                    checked: true
                },
                {
                    "name": '2',
                    checked: false
                }
            ]

            const expected = ['1']

            localStorage.setItem('TEST', JSON.stringify(preferences))
            expect(helpers.getLocalStoragePreferences('TEST')).toEqual(expected)
        })

        test('get Preferences in LocalStorage when not setted : []', () => {
            const expected: string[] = []
            expect(helpers.getLocalStoragePreferences('TEST')).toEqual(expected)
        })
    })

    describe('getValuesArrayFromUrl', () => {
        const testArray = [
            {
                "name": '1',
                checked: true,
                display: true
            },
            {
                "name": '2',
                checked: true,
                display: true
            },
            {
                "name": '3',
                checked: false,
                display: true
            }, {
                "name": '4',
                checked: true,
                display: true
            }
        ]
        test('get values when no query string in url: same array given', () => {
            expect(helpers.getValuesArrayFromUrl(null, testArray)).toEqual(testArray)
        })

        test('get values when query string in url is empty: all cheked=false', () => {
            const params: string[] = []
            let temp = JSON.stringify(params)
            const expected = [
                {
                    "name": '1',
                    checked: false,
                    display: true
                },
                {
                    "name": '2',
                    checked: false,
                    display: true
                },
                {
                    "name": '3',
                    checked: false,
                    display: true
                }, {
                    "name": '4',
                    checked: false,
                    display: true
                }]
            expect(helpers.getValuesArrayFromUrl(temp, testArray)).toEqual(expected)
        })

        test('get values when query string in url: 1 2 with checked=true', () => {
            const params = ['1', '2']
            let temp = JSON.stringify(params)
            const expected = [
                {
                    "name": '1',
                    checked: true,
                    display: true
                },
                {
                    "name": '2',
                    checked: true,
                    display: true
                },
                {
                    "name": '3',
                    checked: false,
                    display: true
                }, {
                    "name": '4',
                    checked: false,
                    display: true
                }]
            expect(helpers.getValuesArrayFromUrl(temp, testArray)).toEqual(expected)
        })

    })

    describe('filterValues', () => {
        test('return only names with checked=true : 1 2 4', () => {
            const testArray = [
                {
                    "name": '1',
                    checked: true
                },
                {
                    "name": '2',
                    checked: true
                },
                {
                    "name": '3',
                    checked: false
                }, {
                    "name": '4',
                    checked: true
                }
            ]

            expect(helpers.filterValues(testArray)).toEqual(['1', '2', '4'])
        })
    })
})

describe('PAGINATION', () => {
    describe('getPages', () => {
        test('array.length=0 : []', () => {
            const array: any = []
            expect(helpers.getPages(array, 5)).toEqual([])
        })

        test('array.length>0: [1, 2]', () => {
            const array: any = [1, 2, 3, 4, 5, 6]
            expect(helpers.getPages(array, 5)).toEqual([1, 2])
        })
    })
})

describe('COLLECTION', () => {
    describe('filterCardsToDisplay', () => {
        test('no cards to display: []', () => {
            const array: ICardsProps[] = [
                {
                    "id": 1,
                    "name": "Nayeon_TSB_1",
                    "checked": false,
                    "thumbnail": "",
                    "categories": [
                        "Korean Albums"
                    ],
                    "members": [
                        "Nayeon"
                    ],
                    "era": "The Story Begins",
                    "benefit": "Original",
                    "display": false
                },
                {
                    "id": 2,
                    "name": "Jeongyeon_TSB_1",
                    "checked": false,
                    "thumbnail": "",
                    "categories": [
                        "Korean Albums"
                    ],
                    "members": [
                        "Jeongyeon"
                    ],
                    "era": "The Story Begins",
                    "benefit": "Original",
                    "display": false
                }
            ]
            expect(helpers.filterCardsToDisplay(array)).toEqual([])
        })

        test('cards to display: [2]', () => {
            const array: ICardsProps[] = [
                {
                    "id": 1,
                    "name": "Nayeon_TSB_1",
                    "checked": false,
                    "thumbnail": "",
                    "categories": [
                        "Korean Albums"
                    ],
                    "members": [
                        "Nayeon"
                    ],
                    "era": "The Story Begins",
                    "benefit": "Original",
                    "display": false
                },
                {
                    "id": 2,
                    "name": "Jeongyeon_TSB_1",
                    "checked": false,
                    "thumbnail": "",
                    "categories": [
                        "Korean Albums"
                    ],
                    "members": [
                        "Jeongyeon"
                    ],
                    "era": "The Story Begins",
                    "benefit": "Original",
                    "display": true
                }
            ]

            const expected = [{
                "id": 2,
                "name": "Jeongyeon_TSB_1",
                "checked": false,
                "thumbnail": "",
                "categories": [
                    "Korean Albums"
                ],
                "members": [
                    "Jeongyeon"
                ],
                "era": "The Story Begins",
                "benefit": "Original",
                "display": true
            }
            ]
            expect(helpers.filterCardsToDisplay(array)).toEqual(expected)
        })
    })

    describe('getLengthCardsDisplayed', () => {
        test('empty array: 0', () => {
            const array: ICardsProps[] = []
            expect(helpers.getLengthCardsDisplayed(array, 'The Story Begins', 'Korean Albums')).toBe(0)
        })

        test('no matches for album: 0', () => {
            const array: ICardsProps[] = [
                {
                    "id": 1,
                    "name": "Nayeon_TSB_1",
                    "checked": false,
                    "thumbnail": "",
                    "categories": [
                        "Korean Albums"
                    ],
                    "members": [
                        "Nayeon"
                    ],
                    "era": "The Story Begins",
                    "benefit": "Original",
                    "display": false
                },
                {
                    "id": 2,
                    "name": "Jeongyeon_TSB_1",
                    "checked": false,
                    "thumbnail": "",
                    "categories": [
                        "Korean Albums"
                    ],
                    "members": [
                        "Jeongyeon"
                    ],
                    "era": "The Story Begins",
                    "benefit": "Original",
                    "display": true
                }
            ]
            expect(helpers.getLengthCardsDisplayed(array, 'Fancy', 'Korean Albums')).toBe(0)
        })

        test('matches: 2', () => {
            const array: ICardsProps[] = [
                {
                    "id": 1,
                    "name": "Nayeon_TSB_1",
                    "checked": false,
                    "thumbnail": "",
                    "categories": [
                        "Korean Albums"
                    ],
                    "members": [
                        "Nayeon"
                    ],
                    "era": "The Story Begins",
                    "benefit": "Original",
                    "display": true
                },
                {
                    "id": 2,
                    "name": "Jeongyeon_TSB_1",
                    "checked": false,
                    "thumbnail": "",
                    "categories": [
                        "Korean Albums"
                    ],
                    "members": [
                        "Jeongyeon"
                    ],
                    "era": "The Story Begins",
                    "benefit": "Original",
                    "display": true
                }
            ]
            expect(helpers.getLengthCardsDisplayed(array, 'The Story Begins', 'Korean Albums')).toBe(2)
        })
    })

    describe('filterByAlbumAndCategory', () => {
        test('empty array: []', () => {
            const array: ICardsProps[] = []
            expect(helpers.filterByAlbumAndCategory(array, 'The Story Begins', 'Korean Albums')).toEqual([])
        })

        test('no matches: []', () => {
            const array: ICardsProps[] = [
                {
                    "id": 1,
                    "name": "Nayeon_TSB_1",
                    "checked": false,
                    "thumbnail": "",
                    "categories": [
                        "Korean Albums"
                    ],
                    "members": [
                        "Nayeon"
                    ],
                    "era": "The Story Begins",
                    "benefit": "Original",
                    "display": true
                },
                {
                    "id": 2,
                    "name": "Jeongyeon_TSB_1",
                    "checked": false,
                    "thumbnail": "",
                    "categories": [
                        "Korean Albums"
                    ],
                    "members": [
                        "Jeongyeon"
                    ],
                    "era": "The Story Begins",
                    "benefit": "Original",
                    "display": true
                }
            ]
            expect(helpers.filterByAlbumAndCategory(array, 'Fancy', 'Korean Albums')).toEqual([])
        })

        test('matches: [1, 2]', () => {
            const array: ICardsProps[] = [
                {
                    "id": 1,
                    "name": "Nayeon_TSB_1",
                    "checked": false,
                    "thumbnail": "",
                    "categories": [
                        "Korean Albums"
                    ],
                    "members": [
                        "Nayeon"
                    ],
                    "era": "The Story Begins",
                    "benefit": "Original",
                    "display": false
                },
                {
                    "id": 2,
                    "name": "Jeongyeon_TSB_1",
                    "checked": false,
                    "thumbnail": "",
                    "categories": [
                        "Korean Albums"
                    ],
                    "members": [
                        "Jeongyeon"
                    ],
                    "era": "The Story Begins",
                    "benefit": "Original",
                    "display": true
                }
            ]
            expect(helpers.filterByAlbumAndCategory(array, 'The Story Begins', 'Korean Albums')).toEqual(array)
        })
    })
})

describe('PROFILE', () => {
    describe('computeProgressionPercentByEra', () => {
        test('array=[] : 0', () => {
            const array: ICardsProps[] = [
                {
                    "id": 1,
                    "name": "Nayeon_TSB_1",
                    "checked": false,
                    "thumbnail": "",
                    "categories": [
                        "Korean Albums"
                    ],
                    "members": [
                        "Nayeon"
                    ],
                    "era": "The Story Begins",
                    "benefit": "Original",
                    "display": false
                },
                {
                    "id": 2,
                    "name": "Jeongyeon_TSB_1",
                    "checked": false,
                    "thumbnail": "",
                    "categories": [
                        "Korean Albums"
                    ],
                    "members": [
                        "Jeongyeon"
                    ],
                    "era": "The Story Begins",
                    "benefit": "Original",
                    "display": true
                },
                {
                    "id": 3,
                    "name": "Momo_WY_1",
                    "checked": false,
                    "thumbnail": "",
                    "categories": [
                        "Korean Albums"
                    ],
                    "members": [
                        "Momo"
                    ],
                    "era": "With You-th",
                    "benefit": "Original",
                    "display": true
                }
            ]
            const expected: Record<string, number> = { "The Story Begins": 0, "With You-th": 0 };
            expect(helpers.computeProgressionPercentByEra([], array)).toEqual(expected);
        })

        test('array=[1,2]: 100', () => {
            const array: ICardsProps[] = [
                {
                    "id": 1,
                    "name": "Nayeon_TSB_1",
                    "checked": false,
                    "thumbnail": "",
                    "categories": [
                        "Korean Albums"
                    ],
                    "members": [
                        "Nayeon"
                    ],
                    "era": "The Story Begins",
                    "benefit": "Original",
                    "display": false
                },
                {
                    "id": 2,
                    "name": "Jeongyeon_TSB_1",
                    "checked": false,
                    "thumbnail": "",
                    "categories": [
                        "Korean Albums"
                    ],
                    "members": [
                        "Jeongyeon"
                    ],
                    "era": "The Story Begins",
                    "benefit": "Original",
                    "display": true
                },
                {
                    "id": 3,
                    "name": "Momo_WY_1",
                    "checked": false,
                    "thumbnail": "",
                    "categories": [
                        "Korean Albums"
                    ],
                    "members": [
                        "Momo"
                    ],
                    "era": "With You-th",
                    "benefit": "Original",
                    "display": true
                }
            ]

            const expected: Record<string, number> = { "The Story Begins": 100, "With You-th": 0 };
            expect(helpers.computeProgressionPercentByEra([1, 2], array)).toEqual(expected);
        })
    })

    describe('computeProgressionPercentByCategory', () => {
        test('array=[] : {002, 001, 001}', () => {
            const array: ICardsProps[] = [
                {
                    "id": 1,
                    "name": "Nayeon_TSB_1",
                    "checked": false,
                    "thumbnail": "",
                    "categories": [
                        "Korean Albums"
                    ],
                    "members": [
                        "Nayeon"
                    ],
                    "era": "The Story Begins",
                    "benefit": "Original",
                    "display": false
                },
                {
                    "id": 2,
                    "name": "Jeongyeon_TSB_1",
                    "checked": false,
                    "thumbnail": "",
                    "categories": [
                        "Korean Albums"
                    ],
                    "members": [
                        "Jeongyeon"
                    ],
                    "era": "The Story Begins",
                    "benefit": "Original",
                    "display": true
                },
                {
                    "id": 3,
                    "name": "Momo_HC_1",
                    "checked": false,
                    "thumbnail": "",
                    "categories": [
                        "Japanese Albums",
                        "Solo/Subunit"
                    ],
                    "members": [
                        "Momo"
                    ],
                    "era": "Haute Couture",
                    "benefit": "Original",
                    "display": true
                }
            ]

            const expected: Record<string, { percent: number, acquired: number, total: number }> = {
                "DVDs/Blu-rays": {
                    "acquired": 0,
                    "percent": NaN,
                    "total": 0,
                },
                "Events": {
                    "acquired": 0,
                    "percent": NaN,
                    "total": 0,
                },
                "Greetings": {
                    "acquired": 0,
                    "percent": NaN,
                    "total": 0,
                },
                "Japanese Albums": {
                    "acquired": 0,
                    "percent": 0,
                    "total": 1,
                },
                "Korean Albums": {
                    "acquired": 0,
                    "percent": 0,
                    "total": 2,
                },
                "Memberships": {
                    "acquired": 0,
                    "percent": NaN,
                    "total": 0,
                },
                "Promos": {
                    "acquired": 0,
                    "percent": NaN,
                    "total": 0,
                },
                "Solo/Subunit": {
                    "acquired": 0,
                    "percent": 0,
                    "total": 1,
                },
                "Stores/Merch": {
                    "acquired": 0,
                    "percent": NaN,
                    "total": 0,
                },
                "Thai Albums": {
                    "acquired": 0,
                    "percent": NaN,
                    "total": 0,
                }
            };
            expect(helpers.computeProgressionPercentByCategory([], array)).toEqual(expected);
        })

        test('array=[1, 2] : {002, 001, 001}', () => {
            const array: ICardsProps[] = [
                {
                    "id": 1,
                    "name": "Nayeon_TSB_1",
                    "checked": false,
                    "thumbnail": "",
                    "categories": [
                        "Korean Albums"
                    ],
                    "members": [
                        "Nayeon"
                    ],
                    "era": "The Story Begins",
                    "benefit": "Original",
                    "display": false
                },
                {
                    "id": 2,
                    "name": "Jeongyeon_TSB_1",
                    "checked": false,
                    "thumbnail": "",
                    "categories": [
                        "Korean Albums"
                    ],
                    "members": [
                        "Jeongyeon"
                    ],
                    "era": "The Story Begins",
                    "benefit": "Original",
                    "display": true
                },
                {
                    "id": 3,
                    "name": "Momo_HC_1",
                    "checked": false,
                    "thumbnail": "",
                    "categories": [
                        "Japanese Albums",
                        "Solo/Subunit"
                    ],
                    "members": [
                        "Momo"
                    ],
                    "era": "Haute Couture",
                    "benefit": "Original",
                    "display": true
                }
            ]

            const expected: Record<string, { percent: number, acquired: number, total: number }> = {
                "DVDs/Blu-rays": {
                    "acquired": 0,
                    "percent": NaN,
                    "total": 0,
                },
                "Events": {
                    "acquired": 0,
                    "percent": NaN,
                    "total": 0,
                },
                "Greetings": {
                    "acquired": 0,
                    "percent": NaN,
                    "total": 0,
                },
                "Japanese Albums": {
                    "acquired": 0,
                    "percent": 0,
                    "total": 1,
                },
                "Korean Albums": {
                    "acquired": 2,
                    "percent": 100,
                    "total": 2,
                },
                "Memberships": {
                    "acquired": 0,
                    "percent": NaN,
                    "total": 0,
                },
                "Promos": {
                    "acquired": 0,
                    "percent": NaN,
                    "total": 0,
                },
                "Solo/Subunit": {
                    "acquired": 0,
                    "percent": 0,
                    "total": 1,
                },
                "Stores/Merch": {
                    "acquired": 0,
                    "percent": NaN,
                    "total": 0,
                },
                "Thai Albums": {
                    "acquired": 0,
                    "percent": NaN,
                    "total": 0,
                }
            };
            expect(helpers.computeProgressionPercentByCategory([1, 2], array)).toEqual(expected);
        })
    })

    describe('computeProgressionByMembers', () => {
        test('array=[1,2],members=[] : 0', () => {
            const array: ICardsProps[] = [
                {
                    "id": 1,
                    "name": "Nayeon_TSB_1",
                    "checked": false,
                    "thumbnail": "",
                    "categories": [
                        "Korean Albums"
                    ],
                    "members": [
                        "Nayeon"
                    ],
                    "era": "The Story Begins",
                    "benefit": "Original",
                    "display": false
                },
                {
                    "id": 2,
                    "name": "Jeongyeon_TSB_1",
                    "checked": false,
                    "thumbnail": "",
                    "categories": [
                        "Korean Albums"
                    ],
                    "members": [
                        "Jeongyeon"
                    ],
                    "era": "The Story Begins",
                    "benefit": "Original",
                    "display": true
                },
                {
                    "id": 3,
                    "name": "Momo_HC_1",
                    "checked": false,
                    "thumbnail": "",
                    "categories": [
                        "Japanese Albums",
                        "Solo/Subunit"
                    ],
                    "members": [
                        "Momo"
                    ],
                    "era": "Haute Couture",
                    "benefit": "Original",
                    "display": true
                }
            ]
            expect(helpers.computeProgressionByMembers([1, 2], array, [])).toEqual(0);
        })

        test('array=[1,2,3],members=["Momo"] : 1', () => {
            const array: ICardsProps[] = [
                {
                    "id": 1,
                    "name": "Nayeon_TSB_1",
                    "checked": false,
                    "thumbnail": "",
                    "categories": [
                        "Korean Albums"
                    ],
                    "members": [
                        "Nayeon"
                    ],
                    "era": "The Story Begins",
                    "benefit": "Original",
                    "display": false
                },
                {
                    "id": 2,
                    "name": "Jeongyeon_TSB_1",
                    "checked": false,
                    "thumbnail": "",
                    "categories": [
                        "Korean Albums"
                    ],
                    "members": [
                        "Jeongyeon"
                    ],
                    "era": "The Story Begins",
                    "benefit": "Original",
                    "display": true
                },
                {
                    "id": 3,
                    "name": "Momo_HC_1",
                    "checked": false,
                    "thumbnail": "",
                    "categories": [
                        "Japanese Albums",
                        "Solo/Subunit"
                    ],
                    "members": [
                        "Momo"
                    ],
                    "era": "Haute Couture",
                    "benefit": "Original",
                    "display": true
                }
            ]
            expect(helpers.computeProgressionByMembers([1, 2, 3], array, ["Momo"])).toEqual(1);
        })

        test('array=[1,2,3],members=["Momo","Nayeon"] : 1', () => {
            const array: ICardsProps[] = [
                {
                    "id": 1,
                    "name": "Nayeon_TSB_1",
                    "checked": false,
                    "thumbnail": "",
                    "categories": [
                        "Korean Albums"
                    ],
                    "members": [
                        "Nayeon"
                    ],
                    "era": "The Story Begins",
                    "benefit": "Original",
                    "display": false
                },
                {
                    "id": 2,
                    "name": "Group_TSB_1",
                    "checked": false,
                    "thumbnail": "",
                    "categories": [
                        "Korean Albums"
                    ],
                    "members": [
                        "Nayeon",
                        "Momo"
                    ],
                    "era": "The Story Begins",
                    "benefit": "Original",
                    "display": true
                },
                {
                    "id": 3,
                    "name": "Momo_HC_1",
                    "checked": false,
                    "thumbnail": "",
                    "categories": [
                        "Japanese Albums",
                        "Solo/Subunit"
                    ],
                    "members": [
                        "Momo"
                    ],
                    "era": "Haute Couture",
                    "benefit": "Original",
                    "display": true
                }
            ]
            expect(helpers.computeProgressionByMembers([1, 2, 3], array, ["Momo", "Nayeon"])).toEqual(1);
        })
    })

    describe('checkAchievement', () => {
        test('isThresholdEraReached triggered: True', () => {
            const achievement: TAchievementProps = {
                "id": 2,
                "name": "The Story Begins pt1",
                "description": "Get 25% of the cards from The Story Begins collection.",
                "group": "completion",
                "criteria": {
                    "trigger": {
                        "rule": "threshold_era",
                        "target": [
                            "The Story Begins"
                        ],
                        "match": 25
                    },
                    "conditions": []
                },
                "checked": false,
                "icon": "/images/icons/no_animation/celery_12414330.png",
                "icon_animated": "/images/icons/animation/celery_12414330.gif"
            };
            const userAchievements: number[] = [];
            const cards: ICardsProps[] = [
                {
                    "id": 1,
                    "name": "Nayeon_TSB_1",
                    "checked": false,
                    "thumbnail": "",
                    "categories": [
                        "Korean Albums"
                    ],
                    "members": [
                        "Nayeon"
                    ],
                    "era": "The Story Begins",
                    "benefit": "Original",
                    "display": false
                },
                {
                    "id": 2,
                    "name": "Jeongyeon_TSB_1",
                    "checked": false,
                    "thumbnail": "",
                    "categories": [
                        "Korean Albums"
                    ],
                    "members": [
                        "Jeongyeon"
                    ],
                    "era": "The Story Begins",
                    "benefit": "Original",
                    "display": true
                },
                {
                    "id": 3,
                    "name": "Momo_HC_1",
                    "checked": false,
                    "thumbnail": "",
                    "categories": [
                        "Japanese Albums",
                        "Solo/Subunit"
                    ],
                    "members": [
                        "Momo"
                    ],
                    "era": "Haute Couture",
                    "benefit": "Original",
                    "display": true
                }
            ]
            const userCollection: number[] = [1, 2];
            const percentEras: Record<string, number> = helpers.computeProgressionPercentByEra(userCollection, cards);
            const percentCategories: Record<string, { percent: number, acquired: number, total: number }> = helpers.computeProgressionPercentByCategory(userCollection, cards);
            expect(helpers.checkAchievement(achievement, userAchievements, cards, userCollection, percentEras, percentCategories)).toBeTruthy();
        });
        test('isThresholdCategoryReached triggered: True', () => {
            const achievement: TAchievementProps = {
                "id": 2,
                "name": "The Story Begins pt1",
                "description": "Get 25% of the cards from The Story Begins collection.",
                "group": "completion",
                "criteria": {
                    "trigger": {
                        "rule": "threshold_category",
                        "target": [
                            "Korean Albums"
                        ],
                        "match": 50
                    },
                    "conditions": []
                },
                "checked": false,
                "icon": "/images/icons/no_animation/celery_12414330.png",
                "icon_animated": "/images/icons/animation/celery_12414330.gif"
            };
            const userAchievements: number[] = [];
            const cards: ICardsProps[] = [
                {
                    "id": 1,
                    "name": "Nayeon_TSB_1",
                    "checked": false,
                    "thumbnail": "",
                    "categories": [
                        "Korean Albums"
                    ],
                    "members": [
                        "Nayeon"
                    ],
                    "era": "The Story Begins",
                    "benefit": "Original",
                    "display": false
                },
                {
                    "id": 2,
                    "name": "Jeongyeon_TSB_1",
                    "checked": false,
                    "thumbnail": "",
                    "categories": [
                        "Korean Albums"
                    ],
                    "members": [
                        "Jeongyeon"
                    ],
                    "era": "The Story Begins",
                    "benefit": "Original",
                    "display": true
                },
                {
                    "id": 3,
                    "name": "Momo_HC_1",
                    "checked": false,
                    "thumbnail": "",
                    "categories": [
                        "Japanese Albums",
                        "Solo/Subunit"
                    ],
                    "members": [
                        "Momo"
                    ],
                    "era": "Haute Couture",
                    "benefit": "Original",
                    "display": true
                }
            ]
            const userCollection: number[] = [1, 2];
            const percentEras: Record<string, number> = helpers.computeProgressionPercentByEra(userCollection, cards);
            const percentCategories: Record<string, { percent: number, acquired: number, total: number }> = helpers.computeProgressionPercentByCategory(userCollection, cards);
            expect(helpers.checkAchievement(achievement, userAchievements, cards, userCollection, percentEras, percentCategories)).toBeTruthy();
        });
        test('isThresholdMembersReached triggered: True', () => {
            const achievement: TAchievementProps = {
                "id": 1,
                "name": "Baby Once",
                "description": "Create an account.",
                "group": "creation",
                "criteria": {
                    "trigger": {
                        "rule": "threshold_members",
                        "target": [
                            "Nayeon"
                        ],
                        "match": 1
                    },
                    "conditions": []
                },
                "checked": false,
                "icon": "/images/icons/no_animation/marjoram_12414327.png",
                "icon_animated": "/images/icons/animation/marjoram_12414327.gif"
            };
            const userAchievements: number[] = [];
            const cards: ICardsProps[] = [
                {
                    "id": 1,
                    "name": "Nayeon_TSB_1",
                    "checked": false,
                    "thumbnail": "",
                    "categories": [
                        "Korean Albums"
                    ],
                    "members": [
                        "Nayeon"
                    ],
                    "era": "The Story Begins",
                    "benefit": "Original",
                    "display": false
                },
                {
                    "id": 2,
                    "name": "Jeongyeon_TSB_1",
                    "checked": false,
                    "thumbnail": "",
                    "categories": [
                        "Korean Albums"
                    ],
                    "members": [
                        "Jeongyeon"
                    ],
                    "era": "The Story Begins",
                    "benefit": "Original",
                    "display": true
                },
                {
                    "id": 3,
                    "name": "Momo_HC_1",
                    "checked": false,
                    "thumbnail": "",
                    "categories": [
                        "Japanese Albums",
                        "Solo/Subunit"
                    ],
                    "members": [
                        "Momo"
                    ],
                    "era": "Haute Couture",
                    "benefit": "Original",
                    "display": true
                }
            ]
            const userCollection: number[] = [1, 2];
            const percentEras: Record<string, number> = helpers.computeProgressionPercentByEra(userCollection, cards);
            const percentCategories: Record<string, { percent: number, acquired: number, total: number }> = helpers.computeProgressionPercentByCategory(userCollection, cards);
            expect(helpers.checkAchievement(achievement, userAchievements, cards, userCollection, percentEras, percentCategories)).toBeTruthy();
        });
        test('isThresholdCollectionReached triggered: False', () => {
            const achievement: TAchievementProps = {
                "id": 15,
                "name": "Candy",
                "description": "Get 1000 cards.",
                "group": "collection",
                "criteria": {
                    "trigger": {
                        "rule": "threshold_collection_size",
                        "match": 1000
                    },
                },
                "checked": false,
                "icon": "/images/icons/no_animation/leek_12414316.png",
                "icon_animated": "/images/icons/animation/leek_12414316.gif"
            };
            const userAchievements: number[] = [];
            const cards: ICardsProps[] = [
                {
                    "id": 1,
                    "name": "Nayeon_TSB_1",
                    "checked": false,
                    "thumbnail": "",
                    "categories": [
                        "Korean Albums"
                    ],
                    "members": [
                        "Nayeon"
                    ],
                    "era": "The Story Begins",
                    "benefit": "Original",
                    "display": false
                },
                {
                    "id": 2,
                    "name": "Jeongyeon_TSB_1",
                    "checked": false,
                    "thumbnail": "",
                    "categories": [
                        "Korean Albums"
                    ],
                    "members": [
                        "Jeongyeon"
                    ],
                    "era": "The Story Begins",
                    "benefit": "Original",
                    "display": true
                },
                {
                    "id": 3,
                    "name": "Momo_HC_1",
                    "checked": false,
                    "thumbnail": "",
                    "categories": [
                        "Japanese Albums",
                        "Solo/Subunit"
                    ],
                    "members": [
                        "Momo"
                    ],
                    "era": "Haute Couture",
                    "benefit": "Original",
                    "display": true
                }
            ]
            const userCollection: number[] = [1, 2];
            const percentEras: Record<string, number> = helpers.computeProgressionPercentByEra(userCollection, cards);
            const percentCategories: Record<string, { percent: number, acquired: number, total: number }> = helpers.computeProgressionPercentByCategory(userCollection, cards);
            expect(helpers.checkAchievement(achievement, userAchievements, cards, userCollection, percentEras, percentCategories)).toBeFalsy();
        });
        test('isThresholdAchievementsReached triggered: False', () => {
            const achievement: TAchievementProps = {
                "id": 13,
                "name": "Achievement hunter",
                "description": "Get 20 achievements.",
                "group": "success",
                "criteria": {
                    "trigger": {
                        "rule": "threshold_achievements",
                        "match": 20
                    }
                },
                "checked": false,
                "icon": "/images/icons/no_animation/asparagus_12414318.png",
                "icon_animated": "/images/icons/animation/asparagus_12414318.gif"
            };
            const userAchievements: number[] = [1];
            const cards: ICardsProps[] = [
                {
                    "id": 1,
                    "name": "Nayeon_TSB_1",
                    "checked": false,
                    "thumbnail": "",
                    "categories": [
                        "Korean Albums"
                    ],
                    "members": [
                        "Nayeon"
                    ],
                    "era": "The Story Begins",
                    "benefit": "Original",
                    "display": false
                },
                {
                    "id": 2,
                    "name": "Jeongyeon_TSB_1",
                    "checked": false,
                    "thumbnail": "",
                    "categories": [
                        "Korean Albums"
                    ],
                    "members": [
                        "Jeongyeon"
                    ],
                    "era": "The Story Begins",
                    "benefit": "Original",
                    "display": true
                },
                {
                    "id": 3,
                    "name": "Momo_HC_1",
                    "checked": false,
                    "thumbnail": "",
                    "categories": [
                        "Japanese Albums",
                        "Solo/Subunit"
                    ],
                    "members": [
                        "Momo"
                    ],
                    "era": "Haute Couture",
                    "benefit": "Original",
                    "display": true
                }
            ]
            const userCollection: number[] = [1, 2];
            const percentEras: Record<string, number> = helpers.computeProgressionPercentByEra(userCollection, cards);
            const percentCategories: Record<string, { percent: number, acquired: number, total: number }> = helpers.computeProgressionPercentByCategory(userCollection, cards);
            expect(helpers.checkAchievement(achievement, userAchievements, cards, userCollection, percentEras, percentCategories)).toBeFalsy();
        });
        test('default triggered: False', () => {
            const achievement: TAchievementProps = {
                "id": 1,
                "name": "Baby Once",
                "description": "Create an account.",
                "group": "creation",
                "criteria": {
                    "trigger": {
                        "rule": "unknown",
                        "match": 1
                    },
                    "conditions": []
                },
                "checked": false,
                "icon": "/images/icons/no_animation/marjoram_12414327.png",
                "icon_animated": "/images/icons/animation/marjoram_12414327.gif"
            };
            const userAchievements: number[] = [];
            const cards: ICardsProps[] = [
                {
                    "id": 1,
                    "name": "Nayeon_TSB_1",
                    "checked": false,
                    "thumbnail": "",
                    "categories": [
                        "Korean Albums"
                    ],
                    "members": [
                        "Nayeon"
                    ],
                    "era": "The Story Begins",
                    "benefit": "Original",
                    "display": false
                },
                {
                    "id": 2,
                    "name": "Jeongyeon_TSB_1",
                    "checked": false,
                    "thumbnail": "",
                    "categories": [
                        "Korean Albums"
                    ],
                    "members": [
                        "Jeongyeon"
                    ],
                    "era": "The Story Begins",
                    "benefit": "Original",
                    "display": true
                },
                {
                    "id": 3,
                    "name": "Momo_HC_1",
                    "checked": false,
                    "thumbnail": "",
                    "categories": [
                        "Japanese Albums",
                        "Solo/Subunit"
                    ],
                    "members": [
                        "Momo"
                    ],
                    "era": "Haute Couture",
                    "benefit": "Original",
                    "display": true
                }
            ]
            const userCollection: number[] = [];
            const percentEras: Record<string, number> = { "The Story Begins": 100, "With You-th": 0 }
            const percentCategories: Record<string, { percent: number, acquired: number, total: number }> = {
                "Korean Albums": { percent: 100, acquired: 2, total: 2 },
                "Japanese Albums": { percent: 0, acquired: 0, total: 1 },
                "Solo/Subunit": { percent: 0, acquired: 0, total: 1 }
            };
            expect(helpers.checkAchievement(achievement, userAchievements, cards, userCollection, percentEras, percentCategories)).toBeFalsy();
        });
    })

})


