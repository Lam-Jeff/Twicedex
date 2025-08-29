import { useContext, useEffect, useMemo, useState } from "react";
import { Cards } from "./cards";
import { Filter } from "./filter";
import { ModalOptions } from "./ModalOptions";
import { Carousel } from "./carousel";
import {
  getLengthCardsDisplayed,
  filterByAlbumAndCategory,
  filterCardsToDisplay,
} from "./helpers";

import { PiSquaresFourFill, PiSquareSplitVerticalFill } from "react-icons/pi";
import { SlOptions } from "react-icons/sl";

import cardsFile from "./files/cards.json";
import albumsFile from "./files/albums.json";
import { AuthContext } from "./authProvider";
import { UrlContext } from "./urlProvider";

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
  const {
    codeParam,
    categoryParam,
    searchParams,
    displayParam,
    setSearchParams,
    getSearchParams,
    computeNewPath,
  } = useContext(UrlContext);
  const { cardsData, wishesData, updateCollection, updateWishlist, user } =
    useContext(AuthContext);

  const CODE_INIT_VALUE = decodeURIComponent(codeParam);
  const ALBUM_INIT_VALUE = albumsFile.filter(
    (album) => album.code === decodeURIComponent(CODE_INIT_VALUE),
  )[0].name;
  const CATEGORY_INIT_VALUE = decodeURIComponent(categoryParam);
  const DISPLAY_INIT_VALUE = displayParam
    ? Boolean(Number(JSON.parse(displayParam)))
    : false;
  const [album, setAlbum] = useState<string>(ALBUM_INIT_VALUE);
  const [category, setCategory] = useState<string>(CATEGORY_INIT_VALUE);
  const [modal, setModal] = useState(false);
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [indexCardModal, setIndexCardModal] = useState<number>(0);
  const [cards, setCards] = useState<ICardsProps[]>(
    cardsFile.map((card) => {
      return {
        ...card,
        checked: cardsData.includes(card.id),
        display:
          card.era === ALBUM_INIT_VALUE &&
          card.categories.includes(CATEGORY_INIT_VALUE),
      };
    }),
  );
  const [filter, setFilter] = useState(false);
  const [displayMode, setDisplayMode] = useState(DISPLAY_INIT_VALUE);

  const cardsToDisplay = useMemo(() => filterCardsToDisplay(cards), [cards]);

  useEffect(() => {
    const checkSearchParams =
      getSearchParams("benefits") &&
      getSearchParams("members") &&
      getSearchParams("display");
    if (!checkSearchParams || !album || !category) return;
    const albumCode = albumsFile.find((object) => object.name === album)!.code;
    const displayValue = displayMode ? "1" : "0";
    computeNewPath(category, albumCode, undefined, displayValue);
  }, [album, category, searchParams, displayMode]);

  /**
   * Handle open/close the filter box.
   */
  const handleFilterBox = () => {
    const newValue = filter ? false : true;
    setFilter(newValue);
    if (newValue) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }
  };

  const handleOptionsBox = () => {
    const newValue = isOptionsOpen ? false : true;
    setIsOptionsOpen(newValue);
    if (newValue) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }
  };

  const handleclickOnOverlay = () => {
    if (filter) {
      setFilter(false);
    }
    if (isOptionsOpen) {
      setIsOptionsOpen(false);
    }
  };

  /**
   * Zoom on the card.
   *
   * @param {number} index - index of the card to zoom
   * @param {React.MouseEvent<HTMLElement>} event - event clicker
   */
  const handleCardZoom = (
    index: number,
    event: React.MouseEvent<HTMLElement>,
  ) => {
    event.preventDefault();
    setIndexCardModal(index);
    setModal(true);
  };

  /**
   * Change display mode.
   */
  const handleDisplayMode = () => {
    const newDisplayValue = !displayMode;
    setDisplayMode(newDisplayValue);
    searchParams.set("display", newDisplayValue ? "1" : "0");
    sessionStorage.setItem("display", newDisplayValue ? "1" : "0");
    setSearchParams(searchParams, { replace: true });
  };

  /**
   * Add all diplayed elements to the wish list.
   */
  const wishesAll = () => {
    const newList = [
      ...cards
        .filter(
          (card) =>
            card.display &&
            !cardsData.includes(card.id) &&
            !wishesData.includes(card.id),
        )
        .map((card) => card.id),
    ];
    if (user) {
      newList.forEach((_id) => updateWishlist(_id, user.uid));
    }
  };

  /**
   * Add all diplayed elements to the collection list.
   */
  const collectionAll = () => {
    const newList = [
      ...cards.filter((card) => card.display).map((card) => card.id),
    ];
    const newWhishes = [
      ...wishesData.filter((wish) => !newList.includes(wish)),
    ];
    if (user) {
      newWhishes.forEach((_id) => updateWishlist(_id, user.uid));
      newList.forEach((_id) => updateCollection(_id, user.uid));
      setCards(
        cards.map((object) =>
          object.display ? { ...object, checked: true } : object,
        ),
      );
    }
  };

  /**
   * Remove all diplayed elements from the wish list.
   */
  const wishesNone = () => {
    if (
      window.confirm(
        "Are you sure you want to REMOVE ALL the displayed cards from your WISHLIST ?",
      )
    ) {
      const newWhishes = [
        ...wishesData.filter(
          (id) => !cards.filter((card) => card.id === id)[0].display,
        ),
      ];
      if (user) {
        newWhishes.forEach((_id) => updateWishlist(_id, user.uid));
      }
    }
  };

  /**
   * Remove all diplayed elements from the collection list.
   */
  const collectionNone = () => {
    if (
      window.confirm(
        "Are you sure you want to REMOVE ALL the displayed cards from your COLLECTION ?",
      )
    ) {
      const newList = [
        ...cardsData.filter(
          (id) => !cards.filter((card) => card.id === id)[0].display,
        ),
      ];
      if (user) {
        newList.forEach((_id) => updateCollection(_id, user.uid));
        setCards(
          cards.map((object) =>
            object.era === album && object.categories.includes(category)
              ? { ...object, checked: false }
              : object,
          ),
        );
      }
    }
  };

  return (
    <div className="collection-content">
      <ModalOptions
        isOptionsOpen={isOptionsOpen}
        wishesAll={wishesAll}
        collectionAll={collectionAll}
        wishesNone={wishesNone}
        collectionNone={collectionNone}
        handleOptionsBox={handleOptionsBox}
      />
      <Filter
        setCards={setCards}
        cards={cards}
        filter={filter}
        album={album}
        setAlbum={setAlbum}
        category={category}
        setCategory={setCategory}
        handleFilterBox={handleFilterBox}
      />
      <div
        className={`overlay ${filter || isOptionsOpen ? "active" : ""}`}
        onClick={handleclickOnOverlay}
      ></div>
      <div className="utility-bar">
        <div className="utility-bar__left-box">
          <button
            onClick={handleDisplayMode}
            disabled={!displayMode}
            aria-label="Grid display"
          >
            <span className="display-span">
              <PiSquaresFourFill />
              GRID
            </span>
          </button>
          <button
            onClick={handleDisplayMode}
            disabled={displayMode}
            aria-label="List display"
          >
            <span className="display-span">
              <PiSquareSplitVerticalFill />
              LIST
            </span>
          </button>
        </div>
        <div className="utility-bar__info-set">
          <p>{getLengthCardsDisplayed(cards, album, category)} cards</p>
        </div>
        <div className="utility-bar__right-box">
          <button
            onClick={handleFilterBox}
            className="filter__button"
            aria-label={filter ? "Close filter box" : "Open filter box"}
          >
            FILTER
          </button>

          <button
            onClick={handleOptionsBox}
            className="options__button"
            aria-label={filter ? "Close options box" : "Open options box"}
          >
            <SlOptions />
          </button>
        </div>
      </div>

      <div className="card-modal__container">
        {modal && (
          <Carousel
            data={cardsToDisplay}
            currentCardIndex={indexCardModal}
            setCurrentCardIndex={setIndexCardModal}
            setModal={setModal}
          />
        )}
      </div>

      {displayMode ? (
        <>
          <div className="cards__container-1">
            {cardsToDisplay.map((object, index) => {
              return (
                <Cards
                  type={"display-1"}
                  key={`card_${object.name}`}
                  index={index}
                  cards={filterByAlbumAndCategory(cards, album, category)}
                  cardInAlbum={object}
                  handleCardZoom={handleCardZoom}
                />
              );
            })}
          </div>
        </>
      ) : (
        <>
          <div className="cards__container-2">
            {cardsToDisplay.map((object, index) => {
              return (
                <Cards
                  type={"display-2"}
                  key={`card_${object.name}`}
                  index={index}
                  cards={filterByAlbumAndCategory(cards, album, category)}
                  cardInAlbum={object}
                  handleCardZoom={handleCardZoom}
                />
              );
            })}
          </div>
        </>
      )}
      <style>
        {`
                div.collection-content > .card-modal__container{
                    opacity: ${modal ? "1" : "0"};
                    visibility: ${modal ? "visible" : "hidden"};
                    transform: ${modal ? "scale(1)" : "scale(0)"};
                }            
                `}
      </style>
    </div>
  );
};
