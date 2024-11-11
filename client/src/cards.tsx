import { useContext, useState } from 'react';
import { ICardsProps } from './collection';
import { Loading } from './loading';

import { RxCheckCircled, RxZoomIn } from 'react-icons/rx'
import { MdOutlineFavorite } from 'react-icons/md'
import { AuthContext } from './authProvider';


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
     * An object representing the card.
     */
    object: ICardsProps;

    /**
     * Array of indexes wished cards.
     */
    wishes: number[];

    /**
     * Length of the array currently displayed on the page.
     */
    length: number;

    /**
     * Position of the card in the array.
     */
    position: number

    /** 
     * A method that add  the card to the collection list.
     */
    handleCardCheck: (id: number, event: React.MouseEvent<HTMLElement>) => void;

    /**
     * A method that open the zoom modal.
     */
    handleCardZoom: (index: number, event: React.MouseEvent<HTMLElement>) => void;

    /**
     * A method that open the card details modal.
     */
    handleCardModal: (isOpen: boolean, index: number) => void;

    /**
     * A method that add  the card to the wish list.
     */
    handleCardWish: (id: number, event: React.MouseEvent<HTMLElement>) => void;
}

export const Cards = ({ type, index, object, wishes, length, position, handleCardCheck, handleCardZoom, handleCardModal, handleCardWish }: ICardsContainerProps) => {
    const [isLoading, setIsLoading] = useState(true);
    const { user } = useContext(AuthContext);
    if (type === "display-1") {
        return (
            <div
                className='card__container-1'
                onClick={() => handleCardModal(true, index)}
                aria-label={`Open details window for card ${object.name}`}
                key={`card__container-1_${index}`}
            >
                <div className='card__number'>{position + 1}/{length}</div>
                <div className='card__serie'>{object.benefit}</div>
                <div className='card__picture'>
                    <img src={object.thumbnail}
                        alt={object.thumbnail}
                        className='card'
                        key={`card_${index}`}
                        loading='lazy'
                        onClick={(e) => handleCardZoom(index, e)}
                        aria-label={`Zoom on card ${object.name}`} />
                </div>
                <div className='card__name'>
                    <p>{object.name}</p>
                </div>
                <div className='card__icons'>
                    {user ? <><div className='card__check__icon'
                        onClick={(e) => handleCardCheck(object.id, e)}
                        aria-label={`Add card ${object.name} to the collection`}>
                        {object.checked ? <RxCheckCircled className='check obtained' /> : <RxCheckCircled className='check' />}
                    </div>
                        <div className='card__wish__icon'
                            onClick={(e) => handleCardWish(object.id, e)}
                            aria-label={`Add card ${object.name} to the wishlist`}>
                            {wishes.includes(object.id) ? <MdOutlineFavorite className='wish obtained' /> : <MdOutlineFavorite className='wish' />}
                        </div>
                    </> : null}

                </div>
            </div>)
    }
    else {
        return (
            <div
                className='card__container-2'
                key={`card__container-2_${index}`}>
                <div className='card__picture'>
                    <Loading isLoading={isLoading}
                        borderColor='white' />
                    <img src={object.thumbnail}
                        alt={object.thumbnail}
                        className={`card_${index}`}
                        key={`card_${index}`}
                        onClick={() => handleCardModal(true, index)}
                        onLoad={() => setIsLoading(false)}
                        aria-label={`Open details window for card ${object.name}`}
                        style={{
                            opacity: object.checked ? 1 : 0.7,
                            display: isLoading ? 'none' : 'block'
                        }} />
                </div>
                <div className='card__number'>{position + 1}/{length}</div>
                <span className='card__line-separator'></span>
                <div className='card__icons'>
                    {user ? <>
                        <div className='card__check__icon'
                            onClick={(e) => handleCardCheck(object.id, e)}
                            aria-label={`Add card ${object.name} to the collection`}>
                            {object.checked ? <RxCheckCircled className='check obtained' /> : <RxCheckCircled className='check' />}
                        </div>
                        <div className='card__wish__icon'
                            onClick={(e) => handleCardWish(object.id, e)}
                            aria-label={`Add card ${object.name} to the wishlist`}>
                            {wishes.includes(object.id) ? <MdOutlineFavorite className='wish obtained' /> : <MdOutlineFavorite className='wish' />}
                        </div>
                    </> : null}
                    <div className='card__zoom__icon'
                        onClick={(e) => handleCardZoom(index, e)}
                        aria-label={`Zoom on card ${object.name}`}>
                        <RxZoomIn className='zoom' />
                    </div>
                </div>
            </div>

        )
    }
}
