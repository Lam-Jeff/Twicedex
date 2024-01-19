import { useEffect, useState } from 'react';
import { RxCross2, RxCheckCircled } from 'react-icons/rx'
import { BsFillCircleFill } from 'react-icons/bs'
import { MdOutlineArrowLeft, MdOutlineArrowRight, MdOutlineFavorite } from 'react-icons/md'
import { ICardsProps } from './collection';

export interface ICardDetailsProps {
    /**
     * A method to open/close the card details modal.
     */
    setIsOpen: (value: boolean) => void

    /**
     * A method to zoom on a card.
     */
    handleCardZoom: (index: number, event: React.MouseEvent<HTMLElement>) => void

    /**
     * A method to add the card to the collection list.
     */
    handleCardCheck: (cardName: number, event: React.MouseEvent<HTMLElement>) => void

    /**
     * A method to change the card visualized.
     */
    setIndexCardModal: (value: number) => void

    /**
     * A method to add the card to the wish list.
     */
    handleCardWish: (name: number, event: React.MouseEvent<HTMLElement>) => void;
    
    /**
     * An object that represents the cards.
     */
    object: ICardsProps[]

    /**
     * Index of the card selected.
     */
    indexCard: number

    /**
     * Wish list.
     */
    wishes: number[]

    /**
     * length of the card array displayed.
     */
    length: number
}


export const ModalCardDetails: React.FunctionComponent<ICardDetailsProps> = ({ setIsOpen, handleCardZoom, handleCardCheck, setIndexCardModal, handleCardWish, object, indexCard, wishes, length }) => {
    const cardToDisplay = object.filter(card => card.display)
    const [checked, setChecked] = useState(cardToDisplay[indexCard].checked)
    const [currentIndex, setCurrentIndex] = useState(indexCard)


    /**
     * Get the previous card.
     */
    const previousCard = () => {
        if (currentIndex - 1 < 0) {
            setCurrentIndex(cardToDisplay.length - 1)
        }

        else {
            setCurrentIndex(prevState => prevState - 1)
        }
    }

    /**
     * Get the next card.
     */
    const nextCard = () => {
        if (currentIndex + 1 >= cardToDisplay.length) {
            setCurrentIndex(0)
        }

        else {
            setCurrentIndex(prevState => prevState + 1)
        }
    }

    useEffect(() => {
        setChecked(cardToDisplay[currentIndex].checked)
    }, [cardToDisplay, currentIndex])


    /**
     * Add card to collection list.
     * 
     * @param {React.MouseEvent<HTMLElement>} event - click event
     */
    const handleCardCheckModal = (event: React.MouseEvent<HTMLElement>) => {
        handleCardCheck(cardToDisplay[indexCard].id, event)
        setChecked(prevState => !prevState)
    }


    /**
     * Close card details modal.
     */
    const handleCloseCardModal = () => {
        setIsOpen(false)
        setIndexCardModal(-1)
    }
    return (<div className="modal_cardDetails">
        <div className="modal__content">
            <div className="modal__topDiv">
                <h3>Details</h3>
                <RxCross2 className='modal__close_button' onClick={handleCloseCardModal} aria-label='Close card details'/>
            </div>

            <div className="card">
                <div className="card__image">
                    <div className="card__image__container">
                        <img src={cardToDisplay[currentIndex].thumbnail}
                            alt={cardToDisplay[currentIndex].name}
                            onClick={(e) => handleCardZoom(currentIndex, e)}
                            aria-label='Open preview window' />
                    </div>

                </div>
                <div className='card__info'>
                    <table>
                        <thead>
                            <tr>
                                <td className='card__info__title'>Name</td>
                                <td><p>{cardToDisplay[currentIndex].name}</p></td>
                            </tr>
                            <tr>
                                <td className='card__info__number'>#</td>
                                <td><p>{object.indexOf(cardToDisplay[currentIndex]) + 1}/{length}</p></td>
                            </tr>
                            <tr>
                                <td className='card__info__members'>Member(s)</td>
                                <td > <div className='card-info-members__container'>
                                    {
                                        cardToDisplay[currentIndex].members.map((member, index) => {
                                            return (<p key={`p_members_${index}`}><BsFillCircleFill className={`circle_${member}`} key={`circle_member_${index}`} />{member}</p>)
                                        })
                                    }</div></td>
                            </tr>
                            <tr>
                                <td className='card__info__serie'>Serie</td>
                                <td><p>{cardToDisplay[currentIndex].era}</p></td>
                            </tr>
                            <tr>
                                <td className='card__info__categories'>Categories</td>
                                <td>{
                                    cardToDisplay[currentIndex].categories.map((category, index) => {
                                        return (<p key={`p_category_${index}`}>{category}</p>)
                                    })}</td>
                            </tr>
                            <tr>
                                <td className='card__info__benefit'>Benefit</td>
                                <td><p>{cardToDisplay[currentIndex].benefit}</p></td>
                            </tr>
                        </thead>

                    </table>
                    <div className='card__badge__container'>
                        <span className='card__badge'>{cardToDisplay[currentIndex].id}</span>
                    </div>

                </div>
            </div>
            <div className='collection_edit__container'>
                <div className='collection_div'>
                    <h3>Collection</h3>
                    <div className='check__icon'
                        onClick={handleCardCheckModal}
                        aria-label='Add card to collection'>
                        {checked ? <RxCheckCircled className='check obtained' /> : <RxCheckCircled className='check' />}
                    </div>
                </div>
                <div className='wishlist_div'>
                    <h3>Wishlist</h3>
                    <div className='wish__icon'
                        onClick={(e) => handleCardWish(cardToDisplay[currentIndex].id, e)} aria-label='Add card to wishlish'>
                        {wishes.includes(cardToDisplay[currentIndex].id) ? <MdOutlineFavorite className='wish obtained' /> : <MdOutlineFavorite className='wish' />}
                    </div>
                </div>
            </div>
            <div className='navigation_buttons__container'>
                <button onClick={previousCard} className='button_previous' aria-label='Previous image'> <MdOutlineArrowLeft className='previous__icon' />Previous card</button>
                <button onClick={nextCard} className='button_next' aria-label='Next image'>Next card<MdOutlineArrowRight className='next__icon' /></button>
            </div>
        </div>

    </div>

    )
}