import { useEffect, useMemo, useState } from 'react';
import { useLocation, useParams, useSearchParams } from 'react-router-dom';
import { Cards } from './cards';
import { Filter } from './filter';
import { ModalCardDetails } from './ModalCardDetails';
import { ModalOptions } from './ModalOptions';
import { Carousel } from './carousel';
import { getLengthCardsDisplayed, filterByAlbumAndCategory, filterCardsToDisplay } from './helpers'

import { PiSquaresFourFill, PiSquareSplitVerticalFill } from 'react-icons/pi'
import { MdPhotoCamera } from "react-icons/md";

import cardsCollection from './files/cards.json';
import albums from './files/albums.json';

export interface ICardsProps {
    /**
     * ID of the card.
     */
    id: number;

    /**
     * Name of the card.
     */
    name: string;

    /**
     * Boolean: True if in collection list, otherwise false.
     */
    checked: boolean;

    /**
     * image url.
     */
    thumbnail: string;

    /**
     * Categories.
     */
    categories: string[];

    /**
     * Members
     */
    members: string[];

    /**
     * Equivalent of album attribute.
     */
    era: string;

    /**
     * Benefit.
     */
    benefit: string;

    /**
     * Boolean: True if displayed, otherwise false.
     */
    display: boolean;
}

export const Collection = () => {

    const { categoryParam, eraParam } = useParams();
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();
    const display = searchParams.get('display');

    const [filter, setFilter] = useState(true);
    const [displayMode, setDisplayMode] = useState(false);
    const [album, setAlbum] = useState<string>(albums.filter(album => album.code === eraParam)[0].name ?? "The Story Begins");
    const [category, setCategory] = useState<string>(categoryParam?.replace('&', '/') ?? "Korean Albums");
    const [modal, setModal] = useState(false)
    const [isCardDetailsOpen, setIsCardDetailsOpen] = useState(false);
    const [isOptionsOpen, setIsOptionsOpen] = useState(false);
    const [indexCardModal, setIndexCardModal] = useState<number>(0)
    const [wishesList, setWishesList] = useState<number[]>(() => {
        const wishes = localStorage.getItem('wishes');
        if (wishes) return JSON.parse(wishes)
        return []
    })
    const [cardsList, setCardsList] = useState<number[]>(() => {
        const collection = localStorage.getItem('cards-collection');
        if (collection) return JSON.parse(collection)
        return []
    })
    const [cards, setCards] = useState<ICardsProps[]>(cardsCollection.map(card => cardsList.includes(card.id) ? { ...card, checked: true } : { ...card, checked: false }));

    const cardsToDiplay = useMemo(() => filterCardsToDisplay(cards), [cards])

    useEffect(() => {
        if (display) {
            const displayParam = JSON.parse(display)
            setDisplayMode(Number(displayParam) ? true : false)
            searchParams.set('display', displayParam ? "1" : "0")
            setSearchParams(searchParams)
        }
    }, []);

    useEffect(() => {
        window.history.pushState(window.history.state, '', `/collection/${location.state.category.replace('/', '&')}/${location.state.era}${location.search}`)
    }, [location]);

    useEffect(() => {
        localStorage.setItem('wishes', JSON.stringify(wishesList));

    }, [wishesList])

    useEffect(() => {
        localStorage.setItem('cards-collection', JSON.stringify(cardsList));
    }, [cardsList])


    /**
     * Handle open/close card details modal.
     * 
     * @param {boolean} isOpen - boolean representing whether the modal is open or not
     * @param {number} index - index of the card selected
     */
    const handleCardModal = (isOpen: boolean, index: number) => {
        setIndexCardModal(index);
        setIsCardDetailsOpen(isOpen);
    }


    /**
     * Handle open/close the filter box.
     */
    const handleFilterBox = () => {
        setFilter(prevState => !prevState)
    }


    /**
     * Add a card to the collection list.
     * 
     * @param {number} id - Id of the card to add
     * @param {React.MouseEvent<HTMLElement>} event - event clicker
     */
    const handleCardCheck = (id: number, event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation()
        const newWishes = wishesList.filter(wish => wish !== id)
        const indexOfCard = cards.findIndex(card => card.id === id)
        if (cardsList.includes(id)) {
            const newArray = cardsList.filter((value) => value !== id)
            setCardsList(newArray)
        }
        else setCardsList([...cardsList, cards[indexOfCard].id])

        setCards(prevState => {
            const newCard = { ...prevState[indexOfCard], checked: !(prevState[indexOfCard].checked) }
            const newCards = [...prevState]
            newCards[indexOfCard] = newCard;
            return newCards;
        })
        setWishesList(newWishes)
    }

    /**
     * Add a card to the wish list.
     * 
     * @param {number} id - Id of the card to add
     * @param {React.MouseEvent<HTMLElement>} event - event clicker
     */
    const handleCardWish = (id: number, event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation()
        const indexCard = cards.findIndex(card => card.id === id)
        if (wishesList.includes(id)) {
            const newArray = wishesList.filter((value) => value !== id)
            setWishesList(newArray)
        } else if (!cards[indexCard].checked) {
            setWishesList([...wishesList, id])
        }
    }

    /**
     * Zoom on the card.
     * 
     * @param {number} index - index of the card to zoom
     * @param {React.MouseEvent<HTMLElement>} event - event clicker
     */
    const handleCardZoom = (index: number, event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation()
        setIndexCardModal(index)
        setModal(true);
    }


    /**
     * Change display mode.
     */
    const handleDisplayMode = () => {
        setDisplayMode(prevState => !prevState)
        searchParams.set('display', displayMode ? "0" : "1")
        setSearchParams(searchParams)
    }

    /**
     * Add all diplayed elements to the wish list.
     */
    const wishesAll = () => {
        const newList = [...cards.filter(card => card.display && !cardsList.includes(card.id) && !wishesList.includes(card.id)).map(card => card.id)]
        setWishesList([...wishesList, ...newList]);
    }

    /**
     * Add all diplayed elements to the collection list.
     */
    const collectionAll = () => {
        const newList = [...cards.filter(card => card.display).map(card => card.id)]
        const newWhishes = [...wishesList.filter(wish => !newList.includes(wish))]
        setCards(
            cards.map((object) =>
                (object.display ? { ...object, checked: true } : object)
            )
        )
        setCardsList([...cardsList, ...newList])
        setWishesList(newWhishes);
    }

    /**
     * Remove all diplayed elements from the wish list.
     */
    const wishesNone = () => {
        if (window.confirm('Are you sure you want to REMOVE ALL the displayed cards from your WISHLIST ?')) {
            const newWhishes = [...wishesList.filter(id => !cards.filter(card => card.id === id)[0].display)]
            setWishesList(newWhishes);
        }
    }

    /**
     * Remove all diplayed elements from the collection list.
     */
    const collectionNone = () => {
        if (window.confirm('Are you sure you want to REMOVE ALL the displayed cards from your COLLECTION ?')) {
            const newList = [...cardsList.filter(id => !cards.filter(card => card.id === id)[0].display)]
            setCards(
                cards.map((object) =>
                    (object.era === album && object.categories.includes(category) ? { ...object, checked: false } : object)
                )
            )
            setCardsList(newList)
        }
    }

    /**
     * Display only elements present in the collection list.
     */
    const displayOnlyChecked = () => {
        const newCards: ICardsProps[] = cards.map(card => {
            cardsList.includes(card.id)
                && card.categories.includes(category)
                && card.era === album ? card.display = true : card.display = false;
            return card;
        })
        setCards(newCards)
    }

    /**
     * Display only elements present in the wish list.
     */
    const displayOnlyWished = () => {
        const newCards: ICardsProps[] = cards.map(card => {
            wishesList.includes(card.id)
                && card.categories.includes(category)
                && card.era === album ? card.display = true : card.display = false;
            return card;
        })
        setCards(newCards)
    }

    return (
        <div className="collection-content">
            <div className="collection-content__option-modal">
                {isOptionsOpen && <ModalOptions setIsOpen={setIsOptionsOpen}
                    wishesAll={wishesAll}
                    collectionAll={collectionAll}
                    wishesNone={wishesNone}
                    collectionNone={collectionNone}
                    displayOnlyChecked={displayOnlyChecked}
                    displayOnlyWished={displayOnlyWished} />}

            </div>
            <div className="collection-content__card-details-modal">
                {isCardDetailsOpen && <ModalCardDetails setIsOpen={setIsCardDetailsOpen}
                    handleCardZoom={handleCardZoom}
                    handleCardCheck={handleCardCheck}
                    setIndexCardModal={setIndexCardModal}
                    handleCardWish={handleCardWish}
                    object={filterByAlbumAndCategory(cards, album, category)}
                    indexCard={indexCardModal}
                    wishes={wishesList}
                    length={filterByAlbumAndCategory(cards, album, category).length}
                />}
            </div>
            <Filter
                setCards={setCards}
                cards={cards}
                filter={filter}
                album={album}
                setAlbum={setAlbum}
                category={category}
                setCategory={setCategory}
                handleFilterBox={handleFilterBox} />
            <div className='utility-bar'>
                <div className='utility-bar__button__display'>
                    <button onClick={handleDisplayMode} disabled={!displayMode} aria-label='Grid display'>
                        <span className="display-span"><PiSquaresFourFill />GRID</span>
                    </button>
                    <button onClick={handleDisplayMode} disabled={displayMode} aria-label='List display'>
                        <span className="display-span"><PiSquareSplitVerticalFill />LIST</span>
                    </button>

                </div>
                <div className='utility-bar__info-set'>
                    <p>{getLengthCardsDisplayed(cards, album, category)} cards</p>
                </div>
                <div className='utility-bar__options'>
                    <button onClick={() => setIsOptionsOpen(prevState => !prevState)} aria-label='Open Options'> &hellip;</button>
                </div>
            </div>

            <div className='card-modal__container'>
                {modal && <Carousel data={cardsToDiplay}
                    currentCardIndex={indexCardModal}
                    setCurrentCardIndex={setIndexCardModal}
                    setModal={setModal}
                    isCardModalDetailsOpen={isCardDetailsOpen}
                />}
            </div>

            {
                displayMode ? (<>
                    <div className='cards__container-1'>
                        <div className='cards__container-1__info-bar'>
                            <div className='card__number'>#</div>
                            <div className='card__serie'>Benefit</div>
                            <div className='card__picture'><MdPhotoCamera className='card__picture__icon' /></div>
                            <div className='card__name'>
                                Name
                            </div>
                        </div>
                        {cardsToDiplay.map((object, index) => {
                            return (
                                <Cards type={"display-1"}
                                    key={`card_${object.name}`}
                                    index={index}
                                    object={object}
                                    wishes={wishesList}
                                    length={filterByAlbumAndCategory(cards, album, category).length}
                                    position={filterByAlbumAndCategory(cards, album, category).indexOf(object)}
                                    handleCardCheck={handleCardCheck}
                                    handleCardZoom={handleCardZoom}
                                    handleCardModal={handleCardModal}
                                    handleCardWish={handleCardWish}
                                />
                            )
                        })}
                    </div>
                </>)
                    :
                    (<>
                        <div className='cards__container-2'>
                            {cardsToDiplay.map((object, index) => {
                                return (
                                    <Cards type={"display-2"}
                                        key={`card_${object.name}`}
                                        index={index}
                                        object={object}
                                        wishes={wishesList}
                                        length={filterByAlbumAndCategory(cards, album, category).length}
                                        position={filterByAlbumAndCategory(cards, album, category).indexOf(object)}
                                        handleCardCheck={handleCardCheck}
                                        handleCardZoom={handleCardZoom}
                                        handleCardModal={handleCardModal}
                                        handleCardWish={handleCardWish}
                                    />
                                )
                            })}
                        </div>
                    </>)
            }
            <style>
                {`
                div.collection-content > .card-modal__container{
                    opacity: ${modal ? '1' : '0'};
                    visibility: ${modal ? 'visible' : 'hidden'};
                    transform: ${modal ? 'scale(1)' : 'scale(0)'};
                }

                div.collection-content > div.collection-content__card-details-modal {
                    opacity: ${isCardDetailsOpen ? '1' : '0'};
                    visibility: ${isCardDetailsOpen ? 'visible' : 'hidden'};
                }
                body {
                    overflow: ${isCardDetailsOpen || modal || isOptionsOpen ? "hidden" : "auto"};
                    padding-right: ${isCardDetailsOpen || modal || isOptionsOpen ? "15px" : "0"};
                }
                
                `}
            </style>
        </div >
    )
}