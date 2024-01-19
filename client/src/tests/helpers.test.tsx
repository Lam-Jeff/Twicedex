import { expect, test, describe } from 'vitest'
import { getLocalStoragePreferences, filterValues, findWinStreak, getValuesArrayFromUrl, getPages, filterCardsToDisplay, getLengthCardsDisplayed, filterByAlbumAndCategory } from '../helpers';
import { ICardsProps } from '../collection';
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
            expect(getLocalStoragePreferences('TEST')).toEqual(expected)
        })

        test('get Preferences in LocalStorage when not setted : []', () => {
            const expected: string[] = []
            expect(getLocalStoragePreferences('TEST')).toEqual(expected)
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
            expect(getValuesArrayFromUrl(null, testArray)).toEqual(testArray)
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
            expect(getValuesArrayFromUrl(temp, testArray)).toEqual(expected)
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
            expect(getValuesArrayFromUrl(temp, testArray)).toEqual(expected)
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

            expect(filterValues(testArray)).toEqual(['1', '2', '4'])
        })
    })
})

describe('MINIGAME', () => {
    describe('findWinStreak', () => {
        test('get score when no stats: 0 0', () => {
            const expected = { longestStreak: 0, currentStreak: 0 }
            expect(findWinStreak([])).toEqual(expected)
        })

        test('get score: 3 3', () => {
            const userStats = [
                {
                    "id": 1018, "solution": "Wake Me Up",
                    "date": "14/12/2023",
                    "findAnswer": true,
                    "numberTries": 2,
                    "guessList": [{ "answer": "Candy Pop", "isSkipped": false, "isCorrect": false },
                    { "answer": "Wake Me Up", "isSkipped": false, "isCorrect": true },
                    { "answer": "", "isSkipped": true, "isCorrect": false },
                    { "answer": "", "isSkipped": true, "isCorrect": false },
                    { "answer": "", "isSkipped": true, "isCorrect": false },
                    { "answer": "", "isSkipped": true, "isCorrect": false }],
                    "hasStarted": true,
                    "hasFinished": true
                },
                {
                    "id": 1579, "solution": "TT",
                    "date": "18/12/2023",
                    "findAnswer": true,
                    "numberTries": 1,
                    "guessList": [{ "answer": "TT", "isSkipped": false, "isCorrect": true },
                    { "answer": "", "isSkipped": true, "isCorrect": false },
                    { "answer": "", "isSkipped": true, "isCorrect": false },
                    { "answer": "", "isSkipped": true, "isCorrect": false },
                    { "answer": "", "isSkipped": true, "isCorrect": false },
                    { "answer": "", "isSkipped": true, "isCorrect": false }],
                    "hasStarted": true,
                    "hasFinished": true
                },
                {
                    "id": 1246,
                    "solution": "Heart Shaker",
                    "date": "19/12/2023",
                    "findAnswer": true,
                    "numberTries": 2,
                    "guessList": [{ "answer": "Scientist", "isSkipped": false, "isCorrect": false },
                    { "answer": "Heart Shaker", "isSkipped": false, "isCorrect": true },
                    { "answer": "", "isSkipped": true, "isCorrect": false },
                    { "answer": "", "isSkipped": true, "isCorrect": false },
                    { "answer": "", "isSkipped": true, "isCorrect": false },
                    { "answer": "", "isSkipped": true, "isCorrect": false }],
                    "hasStarted": true, "hasFinished": true
                }]
            const expected = { longestStreak: 3, currentStreak: 3 }
            expect(findWinStreak(userStats)).toEqual(expected)
        })
    })
})

describe('PAGINATION', () => {
    describe('getPages', () => {
        test('array.length=0 : []', () => {
            const array: any = []
            expect(getPages(array, 5)).toEqual([])
        })

        test('array.length>0: [1, 2]', () => {
            const array: any = [1, 2, 3, 4, 5, 6]
            expect(getPages(array, 5)).toEqual([1, 2])
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
            expect(filterCardsToDisplay(array)).toEqual([])
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
            expect(filterCardsToDisplay(array)).toEqual(expected)
        })
    })

    describe('getLengthCardsDisplayed', () => {
        test('empty array: 0', () => {
            const array : ICardsProps[] = []
            expect(getLengthCardsDisplayed(array, 'The Story Begins', 'Korean Albums')).toBe(0)
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
            expect(getLengthCardsDisplayed(array, 'Fancy', 'Korean Albums')).toBe(0)
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
            expect(getLengthCardsDisplayed(array, 'The Story Begins', 'Korean Albums')).toBe(2)
        })
    })

    describe ('filterByAlbumAndCategory', ()=>{
        test('empty array: []', () => {
            const array : ICardsProps[] = []
            expect(filterByAlbumAndCategory(array, 'The Story Begins', 'Korean Albums')).toEqual([])
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
            expect(filterByAlbumAndCategory(array, 'Fancy', 'Korean Albums')).toEqual([])
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
            expect(filterByAlbumAndCategory(array, 'The Story Begins', 'Korean Albums')).toEqual(array)
        })
    })

})


