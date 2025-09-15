import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { ICardsProps } from "./collection";
import { Loading } from "./loading";
import { RxCheckCircled, RxZoomIn } from "react-icons/rx";
import { MdOutlineFavorite } from "react-icons/md";
import { UrlContext } from "./urlProvider";
import { IndexedDBContext } from "./indexedDBProvider";

interface ICardsContainerProps {
  /**
   * Type of display : 1 or 2.
   */
  type: string;

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

export const Cards = ({
  type,
  index,
  cards,
  cardInAlbum,
  handleCardZoom,
}: ICardsContainerProps) => {
  const { categoryParam, codeParam } = useContext(UrlContext);
  const { database, wishlist, collection, addData, deleteData } =
    useContext(IndexedDBContext);
  const cardIndex = cards.findIndex((_card) => _card.name === cardInAlbum.name);
  const [isLoading, setIsLoading] = useState(true);

  const clickOnWish = async (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (database) {
      if (
        !wishlist.includes(cardInAlbum.id) &&
        !collection.includes(cardInAlbum.id)
      ) {
        await addData(database, cardInAlbum.id, "wishlist");
      } else {
        await deleteData(database, cardInAlbum.id, "wishlist");
      }
    }
  };

  const clickOnCheck = async (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (database) {
      if (!collection.includes(cardInAlbum.id)) {
        await addData(database, cardInAlbum.id, "collection");
      } else {
        await deleteData(database, cardInAlbum.id, "collection");
      }

      if (wishlist.includes(cardInAlbum.id)) {
        await deleteData(database, cardInAlbum.id, "wishlist");
      }
    }
  };

  if (type === "display-1") {
    return (
      <Link
        className="card__container-1"
        to={`/collection/${categoryParam}/${codeParam}/${encodeURIComponent(cardInAlbum.name)}`}
        aria-label={`Go to details page for card ${cardInAlbum.name}`}
        key={`card__container-1_${index}`}
      >
        <div className="card__number">
          {cardIndex + 1}/{cards.length}
        </div>
        <div className="card__serie">{decodeURIComponent(codeParam)}</div>
        <div className="card__benefit">{cardInAlbum.benefit}</div>
        <div className="card__name">
          <p>{cardInAlbum.name}</p>
        </div>
        <div className="card__icons">
          <div
            className={`card__check__icon`}
            onClick={(e) => clickOnCheck(e)}
            aria-label={`Add card ${cardInAlbum.name} to the collection`}
          >
            {collection.includes(cardInAlbum.id) ? (
              <RxCheckCircled className="check obtained" />
            ) : (
              <RxCheckCircled className="check" />
            )}
          </div>
          <div
            className={`card__wish__icon`}
            onClick={(e) => clickOnWish(e)}
            aria-label={`Add card ${cardInAlbum.name} to the wishlist`}
          >
            {wishlist.includes(cardInAlbum.id) ? (
              <MdOutlineFavorite className="wish obtained" />
            ) : (
              <MdOutlineFavorite className="wish" />
            )}
          </div>
        </div>
      </Link>
    );
  } else {
    return (
      <Link
        className="card__container-2"
        to={`/collection/${categoryParam}/${codeParam}/${cardInAlbum.name}`}
        key={`card__container-2_${index}`}
      >
        <div className="card__picture">
          <Loading isLoading={isLoading} borderColor="white" keyIndex={index} />
          <img
            src={cardInAlbum.thumbnail}
            alt={cardInAlbum.thumbnail}
            className={`card_${index} ${collection.includes(cardInAlbum.id) ? "in-collection" : ""}`}
            key={`card_${index}`}
            onLoad={() => setIsLoading(false)}
            aria-label={`Go to details page for card ${cardInAlbum.name}`}
            style={{
              display: isLoading ? "none" : "block",
            }}
          />
        </div>
        <div className="card__number">
          {cardIndex + 1}/{cards.length}
        </div>
        <span className="card__line-separator"></span>
        <div className="card__icons">
          <div
            className={`card__check__icon`}
            onClick={(e) => clickOnCheck(e)}
            aria-label={`Add card ${cardInAlbum.name} to the collection`}
          >
            {collection.includes(cardInAlbum.id) ? (
              <RxCheckCircled className="check obtained" />
            ) : (
              <RxCheckCircled className="check" />
            )}
          </div>
          <div
            className={`card__wish__icon`}
            onClick={(e) => clickOnWish(e)}
            aria-label={`Add card ${cardInAlbum.name} to the wishlist`}
          >
            {wishlist.includes(cardInAlbum.id) ? (
              <MdOutlineFavorite className="wish obtained" />
            ) : (
              <MdOutlineFavorite className="wish" />
            )}
          </div>
          <div
            className="card__zoom__icon"
            onClick={(e) => handleCardZoom(index, e)}
            aria-label={`Zoom on card ${cardInAlbum.name}`}
          >
            <RxZoomIn className="zoom" />
          </div>
        </div>
      </Link>
    );
  }
};
