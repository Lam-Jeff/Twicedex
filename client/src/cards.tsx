import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { ICardsProps } from './collection';
import { Loading } from './loading';
import { RxCheckCircled, RxZoomIn } from 'react-icons/rx'
import { MdOutlineFavorite } from 'react-icons/md'
import { AuthContext } from './authProvider';
import { formatNameToDisplay } from './helpers';
import { UrlContext } from './urlProvider';

interface ICardsContainerProps {
    /**
     * Type of display : 1 or 2.
     */
    type: string

    /**
     * Index of the card.
     */
    index: number;

    /**
     * An array representing the cards with matching category and album name.
     */
    cards: ICardsProps[];

    /**
    * An cards representing the card to display.
    */
    cardInAlbum: ICardsProps;

    /**
     * A method that open the zoom modal.
     */
    handleCardZoom: (index: number, event: React.MouseEvent<HTMLElement>) => void;
}

export const Cards = ({ type, index, cards, cardInAlbum, handleCardZoom }: ICardsContainerProps) => {
    const { categoryParam, codeParam } = useContext(UrlContext);
    const cardIndex = cards.findIndex(_card => _card.name === cardInAlbum.name);
    const [isLoading, setIsLoading] = useState(true);
    const cardNameToDisplay = formatNameToDisplay(cardInAlbum, cards);
    const { user, wishesData, cardsData, updateWishlist, updateCollection } = useContext(AuthContext);

    const clickOnWish = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault()
        if (user) {
            updateWishlist(cardInAlbum.id, user.uid);
        }
    }

    const clickOnCheck = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault()
        if (user) {
            updateCollection(cardInAlbum.id, user.uid);
        }
    }

    if (type === "display-1") {
        return (
            <Link
                className='card__container-1'
                to={`/collection/${categoryParam}/${codeParam}/${encodeURIComponent(cardInAlbum.name)}`}
                aria-label={`Go to details page for card ${cardInAlbum.name}`}
                key={`card__container-1_${index}`}
            >
                <div className='card__number'>{cardIndex + 1}/{cards.length}</div>
                <div className='card__serie'>{decodeURIComponent(codeParam)}</div>
                <div className='card__benefit'>{cardInAlbum.benefit}</div>
                <div className='card__name'>
                    <p>{cardNameToDisplay}</p>
                </div>
                <div className='card__icons'>
                    <div className={`card__check__icon ${user ? "" : "disabled"}`}
                        onClick={(e) => clickOnCheck(e)}
                        aria-label={`Add card ${cardInAlbum.name} to the collection`}
                    >
                        {cardsData.includes(cardInAlbum.id) ? <RxCheckCircled className='check obtained' /> : <RxCheckCircled className='check' />}
                    </div>
                    <div className={`card__wish__icon ${user ? "" : "disabled"}`}
                        onClick={(e) => clickOnWish(e)}
                        aria-label={`Add card ${cardInAlbum.name} to the wishlist`}>
                        {wishesData.includes(cardInAlbum.id) ? <MdOutlineFavorite className='wish obtained' /> : <MdOutlineFavorite className='wish' />}
                    </div>

                </div>
            </Link>)
    }
    else {
        return (
            <Link
                className='card__container-2'
                to={`/collection/${categoryParam}/${codeParam}/${cardInAlbum.name}`}
                key={`card__container-2_${index}`}>
                <div className='card__picture'>
                    <Loading isLoading={isLoading}
                        borderColor='white'
                        keyIndex={index} />
                    <img src={cardInAlbum.thumbnail}
                        alt={cardInAlbum.thumbnail}
                        className={`card_${index}`}
                        key={`card_${index}`}
                        onLoad={() => setIsLoading(false)}
                        aria-label={`Go to details page for card ${cardInAlbum.name}`}
                        style={{
                            opacity: cardsData.includes(cardInAlbum.id)  ? 1 : 0.7,
                            display: isLoading ? 'none' : 'block'
                        }} />
                </div>
                <div className='card__number'>{cardIndex + 1}/{cards.length}</div>
                <span className='card__line-separator'></span>
                <div className='card__icons'>
                    <div className={`card__check__icon ${user ? "" : "disabled"}`}
                        onClick={(e) => clickOnCheck(e)}
                        aria-label={`Add card ${cardInAlbum.name} to the collection`}>
                        {cardsData.includes(cardInAlbum.id) ? <RxCheckCircled className='check obtained' /> : <RxCheckCircled className='check' />}
                    </div>
                    <div className={`card__wish__icon ${user ? "" : "disabled"}`}
                        onClick={(e) => clickOnWish(e)}
                        aria-label={`Add card ${cardInAlbum.name} to the wishlist`}>
                        {wishesData.includes(cardInAlbum.id) ? <MdOutlineFavorite className='wish obtained' /> : <MdOutlineFavorite className='wish' />}
                    </div>
                    <div className='card__zoom__icon'
                        onClick={(e) => handleCardZoom(index, e)}
                        aria-label={`Zoom on card ${cardInAlbum.name}`}>
                        <RxZoomIn className='zoom' />
                    </div>
                </div>
            </Link>

        )
    }
}
