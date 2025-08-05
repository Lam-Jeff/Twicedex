import { useContext, useEffect } from 'react';
import { RxCheckCircled } from 'react-icons/rx'
import { BsFillCircleFill } from 'react-icons/bs'
import { MdOutlineFavorite } from 'react-icons/md'
import { AuthContext } from './authProvider';
import { filterByAlbumAndCategory } from './helpers';
import { useParams } from 'react-router-dom';
import cardsFile from "./files/cards.json";
import albumsFile from "./files/albums.json";
import { UrlContext } from './urlProvider';


export const CardDetails = () => {
    const { cardID } = useParams();
    const decodedCardID = decodeURIComponent(cardID ?? "");
    const { computeNewPath, categoryParam, codeParam, displayParam } = useContext(UrlContext);
    const album = albumsFile.find(album => album.code === cardID?.split("_")[1]);
    const cardsToDisplay = filterByAlbumAndCategory(cardsFile, album?.name ?? "The Story Begins", decodeURIComponent(categoryParam) ?? "Korean Albums");
    const indexCard = cardsToDisplay.findIndex(card => card.name === decodedCardID);
    const { user, cardsData, wishesData, updateWishlist, updateCollection } = useContext(AuthContext);

    useEffect(() => {
        computeNewPath(decodeURIComponent(categoryParam), decodeURIComponent(codeParam), decodedCardID, displayParam);
    }, [])

    return (<div className="card-details-container">
        <div className="card-details-container__card">
            <div className="card-details-container__card-image">
                <img src={cardsToDisplay[indexCard]?.thumbnail}
                    alt={cardsToDisplay[indexCard]?.name} />
            </div>
            <div className='card-details-container__edit-container'>
                {user ? <>  <div className='collection_div'>
                    <h3>Collection</h3>
                    <div className='check__icon'
                        onClick={(e) => { updateCollection(cardsToDisplay[indexCard]?.id, user.uid); e.stopPropagation() }}
                        aria-label='Add card to collection'>
                        {cardsData.includes(indexCard) ? <RxCheckCircled className='check obtained' /> : <RxCheckCircled className='check' />}
                    </div>
                </div>
                    <div className='wishlist_div'>
                        <h3>Wishlist</h3>
                        <div className='wish__icon'
                            onClick={(e) => { updateWishlist(cardsToDisplay[indexCard]?.id, user.uid); e.stopPropagation() }} aria-label='Add card to wishlish'>
                            {wishesData.includes(cardsToDisplay[indexCard]?.id) ? <MdOutlineFavorite className='wish obtained' /> : <MdOutlineFavorite className='wish' />}
                        </div>
                    </div> </> : null}
            </div>
            <div className='card-details-container__card-info'>
                <div className='card-details-container__card-info__header'>
                    <div className='card-details-container__card-info__header-title'>
                        <h2>{cardsToDisplay[indexCard]?.name}</h2>
                        <div className='card-details-container__card-info__header-title__badge'>
                            <span className='card-details-container__card-info__header-title__badge-number'>{cardsToDisplay[indexCard]?.id}</span>
                        </div>
                    </div>

                    <h4>{cardsToDisplay[indexCard]?.era}</h4>
                </div>
                <div className='card-details-container__card-info__body'>
                    <div className='card-details-container__card-info__body-number'>
                        <div className='card-details-container__card-info__body-number-title'>#</div>
                        <div><p>{indexCard + 1}/{cardsToDisplay.length}</p></div>
                    </div>
                    <div className='card-details-container__card-info__body-members'>
                        <div className='card-details-container__card-info__body-members-title'>Member(s)</div>
                        <div className='card-details-container__card-info__body-members-box'>
                            {
                                cardsToDisplay[indexCard]?.members.map((member, index) => {
                                    return (<p key={`p_members_${index}`}><BsFillCircleFill className={`circle_${member}`} key={`circle_member_${index}`} />{member}</p>)
                                })
                            }
                        </div>
                    </div>
                    <div className='card-details-container__card-info__body-categories'>
                        <div className='card-details-container__card-info__body-categories-title'>Categories</div>
                        <div>{
                            cardsToDisplay[indexCard]?.categories.map((category, index) => {
                                return (<p key={`p_category_${index}`}>{category}</p>)
                            })}</div>
                    </div>
                    <div className='card-details-container__card-info__body-benefit'>
                        <div className='card-details-container__card-info__body-benefit-title'>Benefit</div>
                        <div><p>{cardsToDisplay[indexCard]?.benefit}</p></div>
                    </div>
                </div>

            </div>
        </div>
    </div>
    )
}