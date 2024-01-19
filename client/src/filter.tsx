import { useState, useEffect, useMemo } from 'react';
import { Checkbox } from './checkbox';
import { ICardsProps } from './collection';
import { getLocalStoragePreferences, getValuesArrayFromUrl, filterValues, firstElementOfCategory } from './helpers';
import { useLocation, useSearchParams } from 'react-router-dom';

import albumsList from './files/albums.json'
import benefitsList from './files/benefits.json'
import categoriesList from './files/categories.json'
import membersList from './files/members.json'

interface IFilterProps {
    /**
     * A method to update the cards.
     */
    setCards: (value: ICardsProps[]) => void;

    /**
     * An object representing the cards.
     */
    cards: ICardsProps[];

    /**
     * A boolean to check if the filter box is open or not
     */
    filter: boolean;

    /**
     * Current album name.
     */
    album: string;

    /**
     * A method to update the album.
     */
    setAlbum: (value: string) => void;

    /**
     * Current category name.
     */
    category: string;

    /**
     * A method to update the category.
     */
    setCategory: (value: string) => void;

    /**
     * Handle open/close the filter box.
     */
    handleFilterBox: () => void;
}

interface IAlbumsProps {
    /**
     * Name of the album.
     */
    name: string;

    /**
     * boolean to check wether the album is selected or not.
     */
    checked: boolean;

    /**
     * Category array of the album.
     */
    categories: string[];

    /**
     * Member array of the album.
     */
    members: string[];

    /**
     * Benefit array of the album.
     */
    benefits: string[];

    /**
     * boolean to check wether the album is displayed or not.
     */
    display: boolean;

    /**
     * Code of the album.
     */
    code: string;
}

export const Filter = ({ setCards, cards, filter, album, setAlbum, category, setCategory, handleFilterBox }: IFilterProps) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const location = useLocation()
    const preferences: string[] = getLocalStoragePreferences('preferences-members')
    const benefitsParams = searchParams.get('benefits')
    const membersParams = searchParams.get('members')
    const displayParams = searchParams.get('display')
    const categories: { name: string, checked: boolean }[] = categoriesList;

    const [prevAlbum, setPrevAlbum] = useState(album)
    const [prevCategory, setPrevCategory] = useState(category)
    const [focusCategory, setFocusCategory] = useState(false)
    const [focusAlbum, setFocusAlbum] = useState(false);
    const [albums, setAlbums] = useState<IAlbumsProps[]>(albumsList)
    const [members, setMembers] = useState<{ name: string, checked: boolean, display: boolean }[]>(() => {
        let newMembers = membersList;
        if (preferences) {
            newMembers = newMembers.map(member => preferences.includes(member.name) ?
                { ...member, checked: true } : { ...member, checked: false })
        }
        return newMembers
    });

    const [benefits, setBenefits] = useState<{ name: string, checked: boolean, display: boolean }[]>(benefitsList);
    useEffect(() => {
        updateCategories(category);
        updateAlbums(album);
    }, [])

    useEffect(() => {
        location.state = {
            from: '/collection',
            era: albums.filter(object => object.name === album)[0].code,
            category: category
        };
    }, [location]);


    const filterMembers = useMemo(() => filterValues(members), [members])
    const filterBenefits = useMemo(() => filterValues(benefits), [benefits])
    const filterAlbums = useMemo(() => filterValues(albums), [albums])

    /**
     * Update the member array.
     * 
     * @param {number} index - number representing the member to update in the array
     */
    const updateMembers = (index: number) => {
        const newMembers = members.map((object, currentIndex) => currentIndex === index ? { ...object, checked: !object.checked } : object)
        const filteredMembers = filterValues(newMembers)
        const filteredBenefits = filterBenefits
        const filteredAlbums = filterAlbums
        const newCards = cards.map((object) => {
            object.members.some(member => filteredMembers.includes(member)
                && filteredAlbums.includes(object.era)
                && object.categories.includes(category)
                && filteredBenefits.includes(object.benefit)) ? object.display = true : object.display = false;
            return object
        })

        let params = {}

        if (newMembers.filter(member => member.checked).length) {
            params = {
                benefits: JSON.stringify(benefits.filter(benefit => benefit.checked).map(benefit => benefit.name)),
                members: JSON.stringify(newMembers.filter(member => member.checked).map(member => member.name)),
                display: displayParams ? JSON.parse(displayParams) : 0
            }
        } else {
            params = {
                benefits: JSON.stringify(benefits.filter(benefit => benefit.checked).map(benefit => benefit.name)),
                display: displayParams ? JSON.parse(displayParams) : 0
            }
        }

        setSearchParams(params)
        setCards(newCards)
        setMembers(newMembers)

    }

    /**
     * Update the benefit array.
     * 
     * @param {number} index - number representing the benefit to update in the array
     */
    const updateBenefits = (index: number) => {
        const newBenefits = benefits.map((object, currentIndex) => currentIndex === index ? { ...object, checked: !object.checked } : object)
        const filteredBenefits = filterValues(newBenefits)
        const filteredMembers = filterMembers
        const filteredAlbums = filterAlbums
        const newCards = cards.map((object) => {
            filteredBenefits.includes(object.benefit)
                && filteredAlbums.includes(object.era)
                && object.categories.includes(category)
                && filteredMembers.some(member => object.members.includes(member)) ? object.display = true : object.display = false;
            return object;
        })

        let params = {}

        if (newBenefits.filter(benefit => benefit.checked).length) {
            params = {
                benefits: JSON.stringify(newBenefits.filter(benefit => benefit.checked).map(benefit => benefit.name)),
                members: JSON.stringify(members.filter(member => member.checked).map(member => member.name)),
                display: displayParams ? JSON.parse(displayParams) : 0
            }
        } else {
            params = {
                members: JSON.stringify(members.filter(member => member.checked).map(member => member.name)),
                display: displayParams ? JSON.parse(displayParams) : 0
            }
        }

        setSearchParams(params)
        setCards(newCards);
        setBenefits(newBenefits);

    }

    /**
     * Update the album array.
     * 
     * @param {string} [newAlbum="The Story Begins"] - number representing the album to update in the array
     */
    const updateAlbums = (newAlbum: string = 'The Story Begins') => {
        const newAlbums = albums.map((object) => object.name === newAlbum ? { ...object, checked: true } : { ...object, checked: false })
        const checkedMembers = newAlbums.filter(object => object.checked)[0].members.some(member => preferences.includes(member))

        let newMembers = members.map((object) =>
            albums.some(album => album.name === newAlbum && album.members.includes(object.name)) ?
                { ...object, display: true, checked: preferences.includes(object.name) ? true : !checkedMembers ? true : false }
                :
                { ...object, display: false, checked: false }
        )

        const filteredAlbums = filterValues(newAlbums)
        const benefitsCards = newAlbums.filter(album => album.checked)[0].benefits
        let newBenefits = benefits.map((object) => {
            if (albums.some(album => album.name === newAlbum
                && album.benefits.includes(object.name)
                && benefitsCards.includes(object.name))) {
                object.display = true;
                object.checked = true;
            }
            else {
                object.display = false;
                object.checked = false;
            }
            return object
        })
        if (prevAlbum === newAlbum) {
            newMembers = getValuesArrayFromUrl(membersParams, newMembers)
            newBenefits = getValuesArrayFromUrl(benefitsParams, newBenefits)
        } else {
            setPrevAlbum(newAlbum)
        }

        const params = {
            benefits: JSON.stringify(newBenefits.filter(benefit => benefit.checked).map(benefit => benefit.name)),
            members: JSON.stringify(newMembers.filter(member => member.checked).map(member => member.name)),
            display: displayParams ? JSON.parse(displayParams) : 0
        }

        const filteredMembers = filterValues(newMembers)

        const newCards = cards.map((object) => {
            object.members.some(member => filteredMembers.includes(member))
                && filteredAlbums.includes(object.era)
                && object.categories.includes(category)
                && newBenefits.filter(benefit => benefit.checked).map(benefit => benefit.name).includes(object.benefit) ? object.display = true : object.display = false;
            return object;
        })

        setSearchParams(params);
        setMembers(newMembers);
        setBenefits(newBenefits);
        setCards(newCards);
        setAlbums(newAlbums);
        setAlbum(newAlbum);
    }

    /**
     * Update the category array.
     * 
     * @param {string} [newCategory="Korean Albums"] - number representing the category to update in the array
     */
    const updateCategories = (newCategory: string = 'Korean Albums') => {
        const newAlbums = albums.map((object, currentIndex) => {
            if (object.categories.some(categoryObject => newCategory === categoryObject)) {
                object.display = true;
                object.checked = currentIndex === firstElementOfCategory[newCategory];
            } else {
                object.display = false;
                object.checked = false;
            }
            return object
        })
        const filteredAlbums = filterValues(newAlbums)
        const checkedMembers = albums[firstElementOfCategory[newCategory]].members.some(member => preferences.includes(member))

        let newBenefits = benefits.map((object) => {
            if (albums[firstElementOfCategory[newCategory]].benefits.includes(object.name)
                && albums[firstElementOfCategory[newCategory]].categories.some(categoryObject => newCategory === categoryObject)) {
                object.display = true;
                object.checked = true
            }
            else {
                object.display = false;
                object.checked = false;
            }

            return object
        })

        let newMembers = members.map((object) =>
            albums.some(album => album.members.includes(object.name)
                && album.checked) ?
                { ...object, display: true, checked: preferences.includes(object.name) ? true : !checkedMembers ? true : false }
                :
                { ...object, display: false, checked: false }
        )

        if (prevCategory === newCategory) {
            newMembers = getValuesArrayFromUrl(membersParams, newMembers)
            newBenefits = getValuesArrayFromUrl(benefitsParams, newBenefits)
        }
        else {
            setPrevCategory(newCategory)
        }


        const params = {
            benefits: JSON.stringify(newBenefits.filter(benefit => benefit.checked).map(benefit => benefit.name)),
            members: JSON.stringify(newMembers.filter(member => member.checked).map(member => member.name)),
            display: displayParams ? JSON.parse(displayParams) : 0
        }
        const filteredMembers = filterValues(newMembers)
        const newCards = cards.map((object) => {
            object.members.some(member => filteredMembers.includes(member))
                && filteredAlbums.includes(object.era)
                && object.categories.includes(newCategory)
                && newBenefits.filter(benefit => benefit.checked).map(benefit => benefit.name).includes(object.benefit) ? object.display = true : object.display = false;
            return object;
        })

        setSearchParams(params)
        setMembers(newMembers);
        setBenefits(newBenefits);
        setCards(newCards)
        setPrevAlbum(filteredAlbums[0])
        setAlbum(filteredAlbums[0])
        setAlbums(newAlbums)
        setCategory(newCategory)
    }

    /**
     * Select all elements.
     * 
     * @param {string} filter - name of the filter
     */
    const selectAll = (filter: string) => {
        const newCards: ICardsProps[] = []
        let newMembers: { name: string, checked: boolean, display: boolean }[] = members
        let newBenefits: { name: string, checked: boolean, display: boolean }[] = benefits
        if (filter === "members") {
            newMembers = members.map((object) => object.display && !object.checked ? ({ ...object, checked: true }) : object)
            setMembers(newMembers)
        }
        else if (filter === "benefits") {
            newBenefits = benefits.map((object) => object.display && !object.checked ? ({ ...object, checked: true }) : object)
            setBenefits(newBenefits)
        }

        const filteredMembers = filterValues(newMembers)
        const filteredBenefits = filterValues(newBenefits)
        cards.forEach(card => {
            filteredMembers.some(member => card.members.includes(member))
                && album == card.era
                && filteredBenefits.includes(card.benefit)
                && card.categories.includes(category) ?
                newCards.push({ ...card, display: true }) :
                newCards.push(card)
        })
        const params = {
            benefits: JSON.stringify(newBenefits.filter(benefit => benefit.checked).map(benefit => benefit.name)),
            members: JSON.stringify(newMembers.filter(member => member.checked).map(member => member.name)),
            display: displayParams ? JSON.parse(displayParams) : 0
        }
        setSearchParams(params)
        setCards(newCards)

    }

    /**
     * Unselect all elements.
     * 
     * @param {string} filter - name of the filter
     */
    const unSelectAll = (filter: string) => {
        if (filter === "members") {
            setMembers(
                members.map((object) =>
                    object.checked ? ({ ...object, checked: false }) : object
                )

            )
            setCards(
                cards.map((object) =>
                    ({ ...object, display: false })
                )
            )

            if (searchParams.has('members')) {
                searchParams.set('members', "false")
                setSearchParams(searchParams)
            }
        }
        else if (filter === "benefits") {
            setBenefits(
                benefits.map((object) =>
                    object.checked ? ({ ...object, checked: false }) : object
                )
            )
            setCards(
                cards.map((object) =>
                    ({ ...object, display: false })
                )
            )

            if (searchParams.has('benefits')) {
                searchParams.set('benefits', "false")
                setSearchParams(searchParams)
            }
        }
    }

    /**
     * Reset filter box
     */
    const reset = () => {
        updateCategories()
    }

    /**
     * Handle select category.
     * 
     * @param {React.ChangeEvent<HTMLSelectElement>} event - select event
     */
    const handleChangeCategory = (event: React.ChangeEvent<HTMLSelectElement>) => {
        updateCategories(event.target.value)
    }

    /**
     * Handle select album.
     * 
     * @param {React.ChangeEvent<HTMLSelectElement>} event - select event
     */
    const handleChangeAlbum = (event: React.ChangeEvent<HTMLSelectElement>) => {
        updateAlbums(event.target.value)
    }

    /**
     * Disable select all button or not
     * 
     * @param {{ name: string, checked: boolean, display: boolean }[]} data - array representing elements of a filter
     * 
     * @returns {boolean}
     */
    const checkDisabledSelectAllButton = (data: { name: string, checked: boolean, display: boolean }[]) => {
        const numberElementsSelected = data.filter(element => element.checked).length
        return numberElementsSelected === data.filter(element => element.display).length
    }

        /**
     * Disable unselect all button or not
     * 
     * @param {{ name: string, checked: boolean}[]} data - array representing elements of a filter
     * 
     * @returns {boolean}
     */
    const checkDisabledUnselectAllButton = (data: { name: string, checked: boolean }[]) => {
        const numberElementsSelected = data.filter(element => element.checked).length
        return numberElementsSelected === 0;
    }

    return (<>
        <div className='filter-button-box'>
            <button onClick={handleFilterBox} className='filter__button' aria-label={filter ? 'Close filter box' : 'Open filter box'}>FILTER</button>
        </div>
        <div className="filter__container"
            style={{
                maxHeight: filter ? '100rem' : '0'
            }} >
            <div className='inputs__container'>
                <div className='select__container'>
                    <div className={focusCategory ? 'input__container active' : 'input__container'}>
                        <div className='checkboxes__container'>
                            <select name="select-category"
                                id="select-category" value={category}
                                onChange={handleChangeCategory}
                                onClick={() => setFocusCategory(prevState => !prevState)}
                                onBlur={() => setFocusCategory(false)}>
                                {categories.map((object) => {
                                    return (
                                        <option value={object.name} key={`option_${object.name}`}>{object.name}</option>
                                    )
                                })}
                            </select>
                        </div>
                    </div>
                    <div className={focusAlbum ? 'input__container active' : 'input__container'}>
                        <select name="select-album" id="select-album" value={album}
                            onChange={handleChangeAlbum}
                            onClick={() => setFocusAlbum(prevState => !prevState)}
                            onBlur={() => setFocusAlbum(false)}>
                            {albums.map((object) => {
                                if (object.display)
                                    return (
                                        <option value={object.name} key={`option_${object.name}`}>{object.name}</option>
                                    )
                            })}
                        </select>
                    </div>

                </div>
                <div className='input__container'>
                    <h3>Benefits</h3>
                    <div className='buttons__container'>
                        <button onClick={() => selectAll("benefits")}
                            disabled={checkDisabledSelectAllButton(benefits)}
                            aria-label='Select all benefits'
                        >
                            Select All
                        </button>
                        <button onClick={() => unSelectAll("benefits")}
                            disabled={checkDisabledUnselectAllButton(benefits)}
                            aria-label='Unselect all benefits'
                        >
                            Unselect All
                        </button>
                    </div>
                    <div className='checkboxes__container'>
                        {benefits.map((object, index) => {
                            return (
                                <Checkbox
                                    key={`benefit_${object.name}`}
                                    type={"benefits"}
                                    object={object}
                                    displayValue={object.display}
                                    index={index}
                                    update={updateBenefits}
                                />
                            )
                        })}
                    </div>
                </div>

                <div className='input__container'>
                    <h3>Members</h3>
                    <div className='buttons__container'>
                        <button onClick={() => selectAll("members")}
                            disabled={checkDisabledSelectAllButton(members)}
                            aria-label='Select all members'>
                            Select All
                        </button>
                        <button onClick={() => unSelectAll("members")}
                            disabled={checkDisabledUnselectAllButton(members)}
                            aria-label='Unselect all members'>
                            Unselect All
                        </button>
                    </div>
                    <div className='checkboxes__container members'>
                        {members.map((object, index) => {
                            return (
                                <Checkbox
                                    key={`member_${object.name}`}
                                    type={"members"}
                                    object={object}
                                    displayValue={object.display}
                                    index={index}
                                    update={updateMembers}
                                />
                            )
                        })}
                    </div>

                </div>
                <div className='input__container'>
                    <div className='buttons__container'>
                        <button onClick={reset} aria-label='Reset filters'>Reset</button>
                    </div>
                </div>
            </div>
        </div>
    </>

    )
}