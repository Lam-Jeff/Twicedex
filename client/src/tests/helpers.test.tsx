import * as helpers from '../helpers';
import { ICardsProps } from '../collection';
import { TAchievementProps } from '../types/achievement';
import { TAlbumsProps } from '../types/albums';
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
        const expected: Record<string, { percent: number, acquired: number, total: number }> = { "The Story Begins": { percent: 0, acquired: 0, total: 2 }, "With You-th": { percent: 0, acquired: 0, total: 1 } };
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

        const expected: Record<string, { percent: number, acquired: number, total: number }> = { "The Story Begins": { percent: 100, acquired: 2, total: 2 }, "With You-th": { percent: 0, acquired: 0, total: 1 } };
        expect(helpers.computeProgressionPercentByEra([1, 2], array)).toEqual(expected);
    });
});

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
        const percentEras: Record<string, { percent: number; acquired: number; total: number; }> = helpers.computeProgressionPercentByEra(userCollection, cards);
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
        const percentEras: Record<string, { percent: number; acquired: number; total: number; }> = helpers.computeProgressionPercentByEra(userCollection, cards);
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
        const percentEras: Record<string, { percent: number; acquired: number; total: number; }> = helpers.computeProgressionPercentByEra(userCollection, cards);
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
        const percentEras: Record<string, { percent: number; acquired: number; total: number; }> = helpers.computeProgressionPercentByEra(userCollection, cards);
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
        const percentEras: Record<string, { percent: number; acquired: number; total: number; }> = helpers.computeProgressionPercentByEra(userCollection, cards);
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
        const percentEras: Record<string, { percent: number; acquired: number; total: number; }> = { "The Story Begins": { percent: 100, acquired: 33, total: 33 }, "With You-th": { percent: 0, acquired: 0, total: 281 } }
        const percentCategories: Record<string, { percent: number, acquired: number, total: number }> = {
            "Korean Albums": { percent: 100, acquired: 2, total: 2 },
            "Japanese Albums": { percent: 0, acquired: 0, total: 1 },
            "Solo/Subunit": { percent: 0, acquired: 0, total: 1 }
        };
        expect(helpers.checkAchievement(achievement, userAchievements, cards, userCollection, percentEras, percentCategories)).toBeFalsy();
    });
});

describe('getLengthSetsDisplayed', () => {
    test('empty array: 0', () => {
        const array: TAlbumsProps[] = []
        expect(helpers.getLengthSetsDisplayed(array)).toBe(0);
    })

    test('array: 1 displayed', () => {
        const array: TAlbumsProps[] = [{
            "name": "MISAMO Masterpiece Showcase",
            "checked": false,
            "categories": [
                "DVDs/Blu-rays"
            ],
            "members": [
                "Momo",
                "Sana",
                "Mina"
            ],
            "benefits": [
                "Original"
            ],
            "display": true,
            "code": "Masterpiece_showcase_dvd",
            "release": "2023-12-20T00:00:00.000Z",
            "image":""
        }]
        expect(helpers.getLengthSetsDisplayed(array)).toBe(1);
    })
});

describe('filterAlbumsbyRadioButtonType', () => {
    test('ALL - wrong category: 0', () => {
        const percentEras: Record<string, { percent: number; acquired: number; total: number; }> = { "The Story Begins": { percent: 100, acquired: 33, total: 33 }, "With You-th": { percent: 0, acquired: 0, total: 281 } }
        const array: TAlbumsProps[] = [{
            "name": "MISAMO Masterpiece Showcase",
            "checked": false,
            "categories": [
                "DVDs/Blu-rays"
            ],
            "members": [
                "Momo",
                "Sana",
                "Mina"
            ],
            "benefits": [
                "Original"
            ],
            "display": false,
            "code": "Masterpiece_showcase_dvd",
            "release": "2023-12-20T00:00:00.000Z"
            ,
            "image":""
        }]

        const result = helpers.filterAlbumsbyRadioButtonType(array, "All", percentEras, "Korean Albums").filter(album => album.display);
        expect(result.length).toBe(0);
    })

    test('ALL - right category: 1', () => {
        const percentEras: Record<string, { percent: number; acquired: number; total: number; }> = { "The Story Begins": { percent: 100, acquired: 33, total: 33 }, "With You-th": { percent: 0, acquired: 0, total: 281 } }
        const array: TAlbumsProps[] = [{
            "name": "MISAMO Masterpiece Showcase",
            "checked": false,
            "categories": [
                "DVDs/Blu-rays"
            ],
            "members": [
                "Momo",
                "Sana",
                "Mina"
            ],
            "benefits": [
                "Original"
            ],
            "display": false,
            "code": "Masterpiece_showcase_dvd",
            "release": "2023-12-20T00:00:00.000Z",
            "image":""
        }];
        const result = helpers.filterAlbumsbyRadioButtonType(array, "All", percentEras, "DVDs/Blu-rays").filter(album => album.display);
        expect(result.length).toBe(1);
    })

    test('IN PROGRESS - wrong category: 0', () => {
        const percentEras: Record<string, { percent: number; acquired: number; total: number; }> = { "MISAMO Masterpiece Showcase": { percent: 50, acquired: 10, total: 20 }, "With You-th": { percent: 0, acquired: 0, total: 281 } }
        const array: TAlbumsProps[] = [{
            "name": "MISAMO Masterpiece Showcase",
            "checked": false,
            "categories": [
                "DVDs/Blu-rays"
            ],
            "members": [
                "Momo",
                "Sana",
                "Mina"
            ],
            "benefits": [
                "Original"
            ],
            "display": false,
            "code": "Masterpiece_showcase_dvd",
            "release": "2023-12-20T00:00:00.000Z",
            "image":""
        }]

        const result = helpers.filterAlbumsbyRadioButtonType(array, "In progress", percentEras, "Korean Albums").filter(album => album.display);
        expect(result.length).toBe(0);
    })

    test('IN PROGRESS - right category: 1', () => {
        const percentEras: Record<string, { percent: number; acquired: number; total: number; }> = { "MISAMO Masterpiece Showcase": { percent: 50, acquired: 10, total: 20 }, "With You-th": { percent: 0, acquired: 0, total: 281 } }
        const array: TAlbumsProps[] = [{
            "name": "MISAMO Masterpiece Showcase",
            "checked": false,
            "categories": [
                "DVDs/Blu-rays"
            ],
            "members": [
                "Momo",
                "Sana",
                "Mina"
            ],
            "benefits": [
                "Original"
            ],
            "display": false,
            "code": "Masterpiece_showcase_dvd",
            "release": "2023-12-20T00:00:00.000Z",
            "image":""
        }]
        const result = helpers.filterAlbumsbyRadioButtonType(array, "In progress", percentEras, "DVDs/Blu-rays").filter(album => album.display);
        expect(result.length).toBe(1);
    })

    test('COMPLETED - wrong category: 0', () => {
        const percentEras: Record<string, { percent: number; acquired: number; total: number; }> = { "MISAMO Masterpiece Showcase": { percent: 100, acquired: 20, total: 20 }, "With You-th": { percent: 0, acquired: 0, total: 281 } }
        const array: TAlbumsProps[] = [{
            "name": "MISAMO Masterpiece Showcase",
            "checked": false,
            "categories": [
                "DVDs/Blu-rays"
            ],
            "members": [
                "Momo",
                "Sana",
                "Mina"
            ],
            "benefits": [
                "Original"
            ],
            "display": false,
            "code": "Masterpiece_showcase_dvd",
            "release": "2023-12-20T00:00:00.000Z",
            "image":""
        }]

        const result = helpers.filterAlbumsbyRadioButtonType(array, "Completed", percentEras, "Korean Albums").filter(album => album.display);
        expect(result.length).toBe(0);
    })

    test('COMPLETED - right category: 0', () => {
        const percentEras: Record<string, { percent: number; acquired: number; total: number; }> = { "MISAMO Masterpiece Showcase": { percent: 100, acquired: 20, total: 20 }, "With You-th": { percent: 0, acquired: 0, total: 281 } }
        const array: TAlbumsProps[] = [{
            "name": "MISAMO Masterpiece Showcase",
            "checked": false,
            "categories": [
                "DVDs/Blu-rays"
            ],
            "members": [
                "Momo",
                "Sana",
                "Mina"
            ],
            "benefits": [
                "Original"
            ],
            "display": false,
            "code": "Masterpiece_showcase_dvd",
            "release": "2023-12-20T00:00:00.000Z",
            "image":""
        }]
        const result = helpers.filterAlbumsbyRadioButtonType(array, "Completed", percentEras, "DVDs/Blu-rays").filter(album => album.display);
        expect(result.length).toBe(1);
    })
});

describe('filterAlbumsBySearchValue', () => {
    test('empty search text: everything returned', () => {
        const array: TAlbumsProps[] = [{
            "name": "MISAMO Masterpiece Showcase",
            "checked": false,
            "categories": [
                "DVDs/Blu-rays"
            ],
            "members": [
                "Momo",
                "Sana",
                "Mina"
            ],
            "benefits": [
                "Original"
            ],
            "display": true,
            "code": "Masterpiece_showcase_dvd",
            "release": "2023-12-20T00:00:00.000Z",
            "image":""
        }, {
            "name": "SKI BAR Twice JYP Japan Pop Up Store 2024",
            "checked": false,
            "categories": [
                "Stores/Merch"
            ],
            "members": [
                "Nayeon",
                "Jeongyeon",
                "Momo",
                "Sana",
                "Jihyo",
                "Mina",
                "Dahyun",
                "Chaeyoung",
                "Tzuyu"
            ],
            "benefits": [
                "Original"
            ],
            "display": true,
            "code": "SKIBAR_JYP_Japan_Pop-up_Store_2024",
            "release": "2024-11-30T00:00:00.000Z",
            "image":""
        }]
        const result = helpers.filterAlbumsBySearchValue(array, "").filter(album => album.display);
        expect(result.length).toBe(2);
    });

    test('MISAMO: return 1 element', () => {
        const array: TAlbumsProps[] = [{
            "name": "MISAMO Masterpiece Showcase",
            "checked": false,
            "categories": [
                "DVDs/Blu-rays"
            ],
            "members": [
                "Momo",
                "Sana",
                "Mina"
            ],
            "benefits": [
                "Original"
            ],
            "display": true,
            "code": "Masterpiece_showcase_dvd",
            "release": "2023-12-20T00:00:00.000Z",
            "image":""
        }, {
            "name": "SKI BAR Twice JYP Japan Pop Up Store 2024",
            "checked": false,
            "categories": [
                "Stores/Merch"
            ],
            "members": [
                "Nayeon",
                "Jeongyeon",
                "Momo",
                "Sana",
                "Jihyo",
                "Mina",
                "Dahyun",
                "Chaeyoung",
                "Tzuyu"
            ],
            "benefits": [
                "Original"
            ],
            "display": true,
            "code": "SKIBAR_JYP_Japan_Pop-up_Store_2024",
            "release": "2024-11-30T00:00:00.000Z",
            "image":""
        }]
        const result = helpers.filterAlbumsBySearchValue(array, "MISAMO").filter(album => album.display);
        expect(result.length > 0 && result[0].name === "MISAMO Masterpiece Showcase").toBeTruthy();
    });

    test('The Story Begins: return 0 element', () => {
        const array: TAlbumsProps[] = [{
            "name": "MISAMO Masterpiece Showcase",
            "checked": false,
            "categories": [
                "DVDs/Blu-rays"
            ],
            "members": [
                "Momo",
                "Sana",
                "Mina"
            ],
            "benefits": [
                "Original"
            ],
            "display": true,
            "code": "Masterpiece_showcase_dvd",
            "release": "2023-12-20T00:00:00.000Z",
            "image":""
        }, {
            "name": "SKI BAR Twice JYP Japan Pop Up Store 2024",
            "checked": false,
            "categories": [
                "Stores/Merch"
            ],
            "members": [
                "Nayeon",
                "Jeongyeon",
                "Momo",
                "Sana",
                "Jihyo",
                "Mina",
                "Dahyun",
                "Chaeyoung",
                "Tzuyu"
            ],
            "benefits": [
                "Original"
            ],
            "display": true,
            "code": "SKIBAR_JYP_Japan_Pop-up_Store_2024",
            "release": "2024-11-30T00:00:00.000Z",
            "image":""
        }]
        const result = helpers.filterAlbumsBySearchValue(array, "The Story Begins").filter(album => album.display);
        expect(result.length).toBe(0);
    });
});

describe('filterAlbumsByCategory', () => {
    test('Stores/Merch : 1 returned', () => {
        const array: TAlbumsProps[] = [{
            "name": "MISAMO Masterpiece Showcase",
            "checked": false,
            "categories": [
                "DVDs/Blu-rays"
            ],
            "members": [
                "Momo",
                "Sana",
                "Mina"
            ],
            "benefits": [
                "Original"
            ],
            "display": true,
            "code": "Masterpiece_showcase_dvd",
            "release": "2023-12-20T00:00:00.000Z",
            "image":""
        }, {
            "name": "SKI BAR Twice JYP Japan Pop Up Store 2024",
            "checked": false,
            "categories": [
                "Stores/Merch"
            ],
            "members": [
                "Nayeon",
                "Jeongyeon",
                "Momo",
                "Sana",
                "Jihyo",
                "Mina",
                "Dahyun",
                "Chaeyoung",
                "Tzuyu"
            ],
            "benefits": [
                "Original"
            ],
            "display": true,
            "code": "SKIBAR_JYP_Japan_Pop-up_Store_2024",
            "release": "2024-11-30T00:00:00.000Z",
            "image":""
        }]
        const result = helpers.filterAlbumsByCategory(array, "Stores/Merch").filter(album => album.display);
        expect(result.length).toBe(1);
    });
});

describe('computeProgressionByEraAndCategory', () => {
    test('Japanese Albums : empty', () => {
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
        const expected: Record<string, { percent: number, acquired: number, total: number }> = {};
        expect(helpers.computeProgressionByEraAndCategory([], array, "Japanese Albums")).toEqual(expected);
    })

    test('Korean Albums: everything returned', () => {
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

        const expected: Record<string, { percent: number, acquired: number, total: number }> = { "The Story Begins": { percent: 100, acquired: 2, total: 2 }, "With You-th": { percent: 0, acquired: 0, total: 1 } };
        expect(helpers.computeProgressionByEraAndCategory([1, 2], array, "Korean Albums")).toEqual(expected);
    });
});

describe('sortAlbums', () => {
    test("Collection progress (Ascending)", () => {
        const array: TAlbumsProps[] = [{
            "name": "MISAMO Masterpiece Showcase",
            "checked": false,
            "categories": [
                "DVDs/Blu-rays"
            ],
            "members": [
                "Momo",
                "Sana",
                "Mina"
            ],
            "benefits": [
                "Original"
            ],
            "display": true,
            "code": "Masterpiece_showcase_dvd",
            "release": "2023-12-20T00:00:00.000Z",
            "image":""
        },
        {
            "name": "SKI BAR Twice JYP Japan Pop Up Store 2024",
            "checked": false,
            "categories": [
                "Stores/Merch"
            ],
            "members": [
                "Nayeon",
                "Jeongyeon",
                "Momo",
                "Sana",
                "Jihyo",
                "Mina",
                "Dahyun",
                "Chaeyoung",
                "Tzuyu"
            ],
            "benefits": [
                "Original"
            ],
            "display": true,
            "code": "SKIBAR_JYP_Japan_Pop-up_Store_2024",
            "release": "2024-11-30T00:00:00.000Z",
            "image":""
        },
        {
            "name": "TWICE “STRATEGY” Pop Up In LA",
            "checked": false,
            "categories": [
                "Stores/Merch"
            ],
            "members": [
                "Nayeon",
                "Jeongyeon",
                "Momo",
                "Sana",
                "Jihyo",
                "Mina",
                "Dahyun",
                "Chaeyoung",
                "Tzuyu"
            ],
            "benefits": [
                "Original"
            ],
            "display": true,
            "code": "TWICE_STRATEGY_POP-UP_In_LA",
            "release": "2024-11-23T00:00:00.000Z",
            "image":""
        },
        {
            "name": "HAUTE COUTURE Japan Dome Tour 2024",
            "checked": false,
            "categories": [
                "Events"
            ],
            "members": [
                "Momo",
                "Sana",
                "Mina"
            ],
            "benefits": [
                "Original"
            ],
            "display": true,
            "code": "HC_DT",
            "release": "2024-11-02T00:00:00.000Z",
            "image":""
        }]

        const mockProgression: Record<string, { percent: number, acquired: number, total: number }> = { "SKI BAR Twice JYP Japan Pop Up Store 2024": { percent: 100, acquired: 2, total: 2 }, "MISAMO Masterpiece Showcase": { percent: 0, acquired: 2, total: 2 }, "TWICE “STRATEGY” Pop Up In LA": { percent: 25, acquired: 2, total: 2 }, "HAUTE COUTURE Japan Dome Tour 2024": { percent: 35, acquired: 0, total: 1 } };
        const result: TAlbumsProps[] = helpers.sortAlbums(array, "Collection progress (Ascending)", mockProgression);
        expect(result[0].name === "MISAMO Masterpiece Showcase"
            && result[1].name === "TWICE “STRATEGY” Pop Up In LA"
            && result[2].name === "HAUTE COUTURE Japan Dome Tour 2024"
            && result[3].name === "SKI BAR Twice JYP Japan Pop Up Store 2024"
        ).toBeTruthy();
    })

    test("Collection progress (Descending)", () => {
        const array: TAlbumsProps[] = [{
            "name": "MISAMO Masterpiece Showcase",
            "checked": false,
            "categories": [
                "DVDs/Blu-rays"
            ],
            "members": [
                "Momo",
                "Sana",
                "Mina"
            ],
            "benefits": [
                "Original"
            ],
            "display": true,
            "code": "Masterpiece_showcase_dvd",
            "release": "2023-12-20T00:00:00.000Z",
            "image":""
        },
        {
            "name": "SKI BAR Twice JYP Japan Pop Up Store 2024",
            "checked": false,
            "categories": [
                "Stores/Merch"
            ],
            "members": [
                "Nayeon",
                "Jeongyeon",
                "Momo",
                "Sana",
                "Jihyo",
                "Mina",
                "Dahyun",
                "Chaeyoung",
                "Tzuyu"
            ],
            "benefits": [
                "Original"
            ],
            "display": true,
            "code": "SKIBAR_JYP_Japan_Pop-up_Store_2024",
            "release": "2024-11-30T00:00:00.000Z",
            "image":""
        },
        {
            "name": "TWICE “STRATEGY” Pop Up In LA",
            "checked": false,
            "categories": [
                "Stores/Merch"
            ],
            "members": [
                "Nayeon",
                "Jeongyeon",
                "Momo",
                "Sana",
                "Jihyo",
                "Mina",
                "Dahyun",
                "Chaeyoung",
                "Tzuyu"
            ],
            "benefits": [
                "Original"
            ],
            "display": true,
            "code": "TWICE_STRATEGY_POP-UP_In_LA",
            "release": "2024-11-23T00:00:00.000Z",
            "image":""
        },
        {
            "name": "HAUTE COUTURE Japan Dome Tour 2024",
            "checked": false,
            "categories": [
                "Events"
            ],
            "members": [
                "Momo",
                "Sana",
                "Mina"
            ],
            "benefits": [
                "Original"
            ],
            "display": true,
            "code": "HC_DT",
            "release": "2024-11-02T00:00:00.000Z",
            "image":""
        }]
        const mockProgression: Record<string, { percent: number, acquired: number, total: number }> = { "SKI BAR Twice JYP Japan Pop Up Store 2024": { percent: 100, acquired: 2, total: 2 }, "MISAMO Masterpiece Showcase": { percent: 0, acquired: 2, total: 2 }, "TWICE “STRATEGY” Pop Up In LA": { percent: 25, acquired: 2, total: 2 }, "HAUTE COUTURE Japan Dome Tour 2024": { percent: 35, acquired: 0, total: 1 } };
        const result: TAlbumsProps[] = helpers.sortAlbums(array, "Collection progress (Descending)", mockProgression);
        expect(result[0].name === "SKI BAR Twice JYP Japan Pop Up Store 2024"
            && result[1].name === "HAUTE COUTURE Japan Dome Tour 2024"
            && result[2].name === "TWICE “STRATEGY” Pop Up In LA"
            && result[3].name === "MISAMO Masterpiece Showcase"
        ).toBeTruthy();
    });

    test("Name (A - Z)", () => {
        const array: TAlbumsProps[] = [{
            "name": "MISAMO Masterpiece Showcase",
            "checked": false,
            "categories": [
                "DVDs/Blu-rays"
            ],
            "members": [
                "Momo",
                "Sana",
                "Mina"
            ],
            "benefits": [
                "Original"
            ],
            "display": true,
            "code": "Masterpiece_showcase_dvd",
            "release": "2023-12-20T00:00:00.000Z",
            "image":""
        },
        {
            "name": "SKI BAR Twice JYP Japan Pop Up Store 2024",
            "checked": false,
            "categories": [
                "Stores/Merch"
            ],
            "members": [
                "Nayeon",
                "Jeongyeon",
                "Momo",
                "Sana",
                "Jihyo",
                "Mina",
                "Dahyun",
                "Chaeyoung",
                "Tzuyu"
            ],
            "benefits": [
                "Original"
            ],
            "display": true,
            "code": "SKIBAR_JYP_Japan_Pop-up_Store_2024",
            "release": "2024-11-30T00:00:00.000Z",
            "image":""
        },
        {
            "name": "TWICE “STRATEGY” Pop Up In LA",
            "checked": false,
            "categories": [
                "Stores/Merch"
            ],
            "members": [
                "Nayeon",
                "Jeongyeon",
                "Momo",
                "Sana",
                "Jihyo",
                "Mina",
                "Dahyun",
                "Chaeyoung",
                "Tzuyu"
            ],
            "benefits": [
                "Original"
            ],
            "display": true,
            "code": "TWICE_STRATEGY_POP-UP_In_LA",
            "release": "2024-11-23T00:00:00.000Z",
            "image":""
        },
        {
            "name": "HAUTE COUTURE Japan Dome Tour 2024",
            "checked": false,
            "categories": [
                "Events"
            ],
            "members": [
                "Momo",
                "Sana",
                "Mina"
            ],
            "benefits": [
                "Original"
            ],
            "display": true,
            "code": "HC_DT",
            "release": "2024-11-02T00:00:00.000Z",
            "image":""
        }]
        const mockProgression: Record<string, { percent: number, acquired: number, total: number }> = { "SKI BAR Twice JYP Japan Pop Up Store 2024": { percent: 100, acquired: 2, total: 2 }, "MISAMO Masterpiece Showcase": { percent: 0, acquired: 2, total: 2 }, "TWICE “STRATEGY” Pop Up In LA": { percent: 25, acquired: 2, total: 2 }, "HAUTE COUTURE Japan Dome Tour 2024": { percent: 35, acquired: 0, total: 1 } };
        const result: TAlbumsProps[] = helpers.sortAlbums(array, "Name (A - Z)", mockProgression);
        expect(result[0].name === "HAUTE COUTURE Japan Dome Tour 2024"
            && result[1].name === "MISAMO Masterpiece Showcase"
            && result[2].name === "SKI BAR Twice JYP Japan Pop Up Store 2024"
            && result[3].name === "TWICE “STRATEGY” Pop Up In LA"
        ).toBeTruthy();
    });

    test("Name (Z - A)", () => {
        const array: TAlbumsProps[] = [{
            "name": "MISAMO Masterpiece Showcase",
            "checked": false,
            "categories": [
                "DVDs/Blu-rays"
            ],
            "members": [
                "Momo",
                "Sana",
                "Mina"
            ],
            "benefits": [
                "Original"
            ],
            "display": true,
            "code": "Masterpiece_showcase_dvd",
            "release": "2023-12-20T00:00:00.000Z",
            "image":""
        },
        {
            "name": "SKI BAR Twice JYP Japan Pop Up Store 2024",
            "checked": false,
            "categories": [
                "Stores/Merch"
            ],
            "members": [
                "Nayeon",
                "Jeongyeon",
                "Momo",
                "Sana",
                "Jihyo",
                "Mina",
                "Dahyun",
                "Chaeyoung",
                "Tzuyu"
            ],
            "benefits": [
                "Original"
            ],
            "display": true,
            "code": "SKIBAR_JYP_Japan_Pop-up_Store_2024",
            "release": "2024-11-30T00:00:00.000Z",
            "image":""
        },
        {
            "name": "TWICE “STRATEGY” Pop Up In LA",
            "checked": false,
            "categories": [
                "Stores/Merch"
            ],
            "members": [
                "Nayeon",
                "Jeongyeon",
                "Momo",
                "Sana",
                "Jihyo",
                "Mina",
                "Dahyun",
                "Chaeyoung",
                "Tzuyu"
            ],
            "benefits": [
                "Original"
            ],
            "display": true,
            "code": "TWICE_STRATEGY_POP-UP_In_LA",
            "release": "2024-11-23T00:00:00.000Z",
            "image":""
        },
        {
            "name": "HAUTE COUTURE Japan Dome Tour 2024",
            "checked": false,
            "categories": [
                "Events"
            ],
            "members": [
                "Momo",
                "Sana",
                "Mina"
            ],
            "benefits": [
                "Original"
            ],
            "display": true,
            "code": "HC_DT",
            "release": "2024-11-02T00:00:00.000Z",
            "image":""
        }]
        const mockProgression: Record<string, { percent: number, acquired: number, total: number }> = { "SKI BAR Twice JYP Japan Pop Up Store 2024": { percent: 100, acquired: 2, total: 2 }, "MISAMO Masterpiece Showcase": { percent: 0, acquired: 2, total: 2 }, "TWICE “STRATEGY” Pop Up In LA": { percent: 25, acquired: 2, total: 2 }, "HAUTE COUTURE Japan Dome Tour 2024": { percent: 35, acquired: 0, total: 1 } };
        const result: TAlbumsProps[] = helpers.sortAlbums(array, "Name (Z - A)", mockProgression);
        expect(result[0].name === "TWICE “STRATEGY” Pop Up In LA"
            && result[1].name === "SKI BAR Twice JYP Japan Pop Up Store 2024"
            && result[2].name === "MISAMO Masterpiece Showcase"
            && result[3].name === "HAUTE COUTURE Japan Dome Tour 2024"
        ).toBeTruthy();
    });
    test("Release date (Old to new)", () => {
        const array: TAlbumsProps[] = [{
            "name": "MISAMO Masterpiece Showcase",
            "checked": false,
            "categories": [
                "DVDs/Blu-rays"
            ],
            "members": [
                "Momo",
                "Sana",
                "Mina"
            ],
            "benefits": [
                "Original"
            ],
            "display": true,
            "code": "Masterpiece_showcase_dvd",
            "release": "2023-12-20T00:00:00.000Z",
            "image":""
        },
        {
            "name": "SKI BAR Twice JYP Japan Pop Up Store 2024",
            "checked": false,
            "categories": [
                "Stores/Merch"
            ],
            "members": [
                "Nayeon",
                "Jeongyeon",
                "Momo",
                "Sana",
                "Jihyo",
                "Mina",
                "Dahyun",
                "Chaeyoung",
                "Tzuyu"
            ],
            "benefits": [
                "Original"
            ],
            "display": true,
            "code": "SKIBAR_JYP_Japan_Pop-up_Store_2024",
            "release": "2024-11-30T00:00:00.000Z",
            "image":""
        },
        {
            "name": "TWICE “STRATEGY” Pop Up In LA",
            "checked": false,
            "categories": [
                "Stores/Merch"
            ],
            "members": [
                "Nayeon",
                "Jeongyeon",
                "Momo",
                "Sana",
                "Jihyo",
                "Mina",
                "Dahyun",
                "Chaeyoung",
                "Tzuyu"
            ],
            "benefits": [
                "Original"
            ],
            "display": true,
            "code": "TWICE_STRATEGY_POP-UP_In_LA",
            "release": "2024-11-23T00:00:00.000Z",
            "image":""
        },
        {
            "name": "HAUTE COUTURE Japan Dome Tour 2024",
            "checked": false,
            "categories": [
                "Events"
            ],
            "members": [
                "Momo",
                "Sana",
                "Mina"
            ],
            "benefits": [
                "Original"
            ],
            "display": true,
            "code": "HC_DT",
            "release": "2024-11-02T00:00:00.000Z",
            "image":""
        }]
        const mockProgression: Record<string, { percent: number, acquired: number, total: number }> = { "SKI BAR Twice JYP Japan Pop Up Store 2024": { percent: 100, acquired: 2, total: 2 }, "MISAMO Masterpiece Showcase": { percent: 0, acquired: 2, total: 2 }, "TWICE “STRATEGY” Pop Up In LA": { percent: 25, acquired: 2, total: 2 }, "HAUTE COUTURE Japan Dome Tour 2024": { percent: 35, acquired: 0, total: 1 } };
        const result: TAlbumsProps[] = helpers.sortAlbums(array, "Release date (Old to new)", mockProgression);
        expect(result[0].name === "MISAMO Masterpiece Showcase"
            && result[1].name === "HAUTE COUTURE Japan Dome Tour 2024"
            && result[2].name === "TWICE “STRATEGY” Pop Up In LA"
            && result[3].name === "SKI BAR Twice JYP Japan Pop Up Store 2024"
        ).toBeTruthy();
    });
    test("Release date (New to old)", () => {
        const array: TAlbumsProps[] = [{
            "name": "MISAMO Masterpiece Showcase",
            "checked": false,
            "categories": [
                "DVDs/Blu-rays"
            ],
            "members": [
                "Momo",
                "Sana",
                "Mina"
            ],
            "benefits": [
                "Original"
            ],
            "display": true,
            "code": "Masterpiece_showcase_dvd",
            "release": "2023-12-20T00:00:00.000Z",
            "image":""
        },
        {
            "name": "SKI BAR Twice JYP Japan Pop Up Store 2024",
            "checked": false,
            "categories": [
                "Stores/Merch"
            ],
            "members": [
                "Nayeon",
                "Jeongyeon",
                "Momo",
                "Sana",
                "Jihyo",
                "Mina",
                "Dahyun",
                "Chaeyoung",
                "Tzuyu"
            ],
            "benefits": [
                "Original"
            ],
            "display": true,
            "code": "SKIBAR_JYP_Japan_Pop-up_Store_2024",
            "release": "2024-11-30T00:00:00.000Z",
            "image":""
        },
        {
            "name": "TWICE “STRATEGY” Pop Up In LA",
            "checked": false,
            "categories": [
                "Stores/Merch"
            ],
            "members": [
                "Nayeon",
                "Jeongyeon",
                "Momo",
                "Sana",
                "Jihyo",
                "Mina",
                "Dahyun",
                "Chaeyoung",
                "Tzuyu"
            ],
            "benefits": [
                "Original"
            ],
            "display": true,
            "code": "TWICE_STRATEGY_POP-UP_In_LA",
            "release": "2024-11-23T00:00:00.000Z",
            "image":""
        },
        {
            "name": "HAUTE COUTURE Japan Dome Tour 2024",
            "checked": false,
            "categories": [
                "Events"
            ],
            "members": [
                "Momo",
                "Sana",
                "Mina"
            ],
            "benefits": [
                "Original"
            ],
            "display": true,
            "code": "HC_DT",
            "release": "2024-11-02T00:00:00.000Z",
            "image":""
        }]
        const mockProgression: Record<string, { percent: number, acquired: number, total: number }> = { "SKI BAR Twice JYP Japan Pop Up Store 2024": { percent: 100, acquired: 2, total: 2 }, "MISAMO Masterpiece Showcase": { percent: 0, acquired: 2, total: 2 }, "TWICE “STRATEGY” Pop Up In LA": { percent: 25, acquired: 2, total: 2 }, "HAUTE COUTURE Japan Dome Tour 2024": { percent: 35, acquired: 0, total: 1 } };
        const result: TAlbumsProps[] = helpers.sortAlbums(array, "Release date (New to old)", mockProgression);
        expect(result[0].name === "SKI BAR Twice JYP Japan Pop Up Store 2024"
            && result[1].name === "TWICE “STRATEGY” Pop Up In LA"
            && result[2].name === "HAUTE COUTURE Japan Dome Tour 2024"
            && result[3].name === "MISAMO Masterpiece Showcase"
        ).toBeTruthy();
    })
});



