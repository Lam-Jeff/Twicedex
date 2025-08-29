import { useState, useEffect, useMemo, useContext } from "react";
import { Checkbox } from "./checkbox";
import { ICardsProps } from "./collection";
import { filterValues, firstElementOfCategory } from "./helpers";

import albumsFile from "./files/albums.json";
import benefitsFile from "./files/benefits.json";
import categoriesFile from "./files/categories.json";
import membersFile from "./files/members.json";
import { TAlbumsProps } from "./types/albums";
import { UrlContext } from "./urlProvider";
import { AuthContext } from "./authProvider";
import { useLocation } from "react-router-dom";
import { RxCross2 } from "react-icons/rx";

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

export const Filter = ({
  setCards,
  cards,
  filter,
  album,
  setAlbum,
  category,
  setCategory,
  handleFilterBox,
}: IFilterProps) => {
  const location = useLocation();
  const SEARCH_TYPE_DEFAULT_VALUE = location.state
    ? location.state.radioType
    : "All";
  const SEARCH_VALUES = [
    "All",
    "In collection",
    "Not in collection",
    "In wishlist",
  ];
  const {
    searchParams,
    setSearchParams,
    updateParams,
    categoryParam,
    codeParam,
  } = useContext(UrlContext);
  const { cardsData, wishesData } = useContext(AuthContext);
  const [searchType, setSearchType] = useState(SEARCH_TYPE_DEFAULT_VALUE);
  const membersLocalStorage = sessionStorage.getItem("members");
  const benefitsLocalStorage = sessionStorage.getItem("benefits");
  const categories: { name: string; checked: boolean }[] = categoriesFile;
  const [focusCategory, setFocusCategory] = useState(false);
  const [focusAlbum, setFocusAlbum] = useState(false);
  const [albums, setAlbums] = useState<TAlbumsProps[]>(albumsFile);
  const [members, setMembers] =
    useState<{ name: string; checked: boolean; display: boolean }[]>(
      membersFile,
    );
  const [benefits, setBenefits] =
    useState<{ name: string; checked: boolean; display: boolean }[]>(
      benefitsFile,
    );

  useEffect(() => {
    updateCategories(category);
    updateAlbums(album);
    applyUpdates();
  }, []);

  useEffect(() => {
    updateParams(benefits, members);
    applyUpdates();
  }, [members, benefits]);

  const filterMembers = useMemo(() => filterValues(members), [members]);
  const filterBenefits = useMemo(() => filterValues(benefits), [benefits]);

  const handleSearchTypeChange = (value: string) => {
    setSearchType(value);
    let currentCards = cards
      .filter(
        (object) =>
          filterBenefits.includes(object.benefit) &&
          album === object.era &&
          object.categories.includes(category) &&
          filterMembers.some((member) => object.members.includes(member)),
      )
      .map((_card) => _card.id);
    let newCards = cards;
    switch (value) {
      case "All":
        newCards = newCards.map((_card) =>
          currentCards.includes(_card.id)
            ? { ..._card, display: true }
            : { ..._card, display: false },
        );
        break;
      case "In collection":
        newCards = newCards.map((_card) =>
          currentCards.includes(_card.id) && cardsData.includes(_card.id)
            ? { ..._card, display: true }
            : { ..._card, display: false },
        );
        break;
      case "Not in collection":
        newCards = newCards.map((_card) =>
          currentCards.includes(_card.id) && !cardsData.includes(_card.id)
            ? { ..._card, display: true }
            : { ..._card, display: false },
        );
        break;
      case "In wishlist":
        newCards = newCards.map((_card) =>
          currentCards.includes(_card.id) && wishesData.includes(_card.id)
            ? { ..._card, display: true }
            : { ..._card, display: false },
        );
        break;
    }
    setCards(newCards);
  };

  const applyUpdates = () => {
    let newCards = cards;

    if (searchType === "All") {
      newCards = cards.map((object) => {
        filterBenefits.includes(object.benefit) &&
        album === object.era &&
        object.categories.includes(category) &&
        filterMembers.some((member) => object.members.includes(member))
          ? (object.display = true)
          : (object.display = false);
        return object;
      });
    } else if (searchType === "In collection") {
      newCards = cards.map((object) => {
        filterBenefits.includes(object.benefit) &&
        album === object.era &&
        object.categories.includes(category) &&
        filterMembers.some((member) => object.members.includes(member)) &&
        cardsData.includes(object.id)
          ? (object.display = true)
          : (object.display = false);
        return object;
      });
    } else if (searchType === "In wishlist") {
      newCards = cards.map((object) => {
        filterBenefits.includes(object.benefit) &&
        album === object.era &&
        object.categories.includes(category) &&
        filterMembers.some((member) => object.members.includes(member)) &&
        wishesData.includes(object.id)
          ? (object.display = true)
          : (object.display = false);
        return object;
      });
    }

    setCards(newCards);
  };

  /**
   * Update the member array.
   *
   * @param {number} index - number representing the member to update in the array
   */
  const updateMembers = (index: number) => {
    const newMembers = members.map((object, currentIndex) =>
      currentIndex === index ? { ...object, checked: !object.checked } : object,
    );
    setMembers(newMembers);
  };

  /**
   * Update the benefit array.
   *
   * @param {number} index - number representing the benefit to update in the array
   */
  const updateBenefits = (index: number) => {
    const newBenefits = benefits.map((object, currentIndex) =>
      currentIndex === index ? { ...object, checked: !object.checked } : object,
    );
    setBenefits(newBenefits);
  };

  /**
   * Update the album array.
   *
   * @param {string} [newAlbum="The Story Begins"] - number representing the album to update in the array
   */
  const updateAlbums = (newAlbum: string = "The Story Begins") => {
    const newAlbums = albums.map((object) =>
      object.name === newAlbum
        ? { ...object, checked: true }
        : { ...object, checked: false },
    );
    const currentMembers = albums.find(
      (_album) => _album.name === newAlbum,
    )!.members;
    const currentBenefits = albums.find(
      (_album) => _album.name === newAlbum,
    )!.benefits;
    const currentCode = albums.find((_album) => _album.name === newAlbum)!.code;

    let newMembers = members.map((_object) =>
      currentMembers.includes(_object.name)
        ? { ..._object, display: true, checked: true }
        : { ..._object, display: false, checked: false },
    );
    let newBenefits = benefits.map((_object) =>
      currentBenefits.includes(_object.name)
        ? { ..._object, display: true, checked: true }
        : { ..._object, display: false, checked: false },
    );
    if (currentCode === codeParam) {
      if (membersLocalStorage) {
        newMembers = newMembers.map((_object) =>
          membersLocalStorage.includes(_object.name)
            ? { ..._object, checked: true }
            : { ..._object, checked: false },
        );
      }

      if (benefitsLocalStorage) {
        newBenefits = newBenefits.map((_object) =>
          benefitsLocalStorage.includes(_object.name)
            ? { ..._object, checked: true }
            : { ..._object, checked: false },
        );
      }
    }
    setMembers(newMembers);
    setBenefits(newBenefits);
    setAlbums(newAlbums);
    setAlbum(newAlbum);
  };

  /**
   * Update the category array.
   *
   * @param {string} [newCategory="Korean Albums"] - number representing the category to update in the array
   */
  const updateCategories = (newCategory: string = "Korean Albums") => {
    const firstElement = firstElementOfCategory[newCategory];
    const newAlbums = albums.map((object, currentIndex) => {
      if (
        object.categories.some(
          (categoryObject) => newCategory === categoryObject,
        )
      ) {
        object.display = true;
        object.checked = currentIndex === firstElement;
      } else {
        object.display = false;
        object.checked = false;
      }
      return object;
    });
    const filteredAlbums = filterValues(newAlbums);
    const currentMembers = albums[firstElement].members;
    const currentBenefits = albums[firstElement].benefits;

    let newMembers = members.map((_object) =>
      currentMembers.includes(_object.name)
        ? { ..._object, display: true, checked: true }
        : { ..._object, display: false, checked: false },
    );
    let newBenefits = benefits.map((_object) =>
      currentBenefits.includes(_object.name)
        ? { ..._object, display: true, checked: true }
        : { ..._object, display: false, checked: false },
    );

    if (newCategory === categoryParam) {
      if (membersLocalStorage) {
        newMembers = newMembers.map((_object) =>
          membersLocalStorage.includes(_object.name)
            ? { ..._object, checked: true }
            : { ..._object, checked: false },
        );
      }

      if (benefitsLocalStorage) {
        newBenefits = newBenefits.map((_object) =>
          benefitsLocalStorage.includes(_object.name)
            ? { ..._object, checked: true }
            : { ..._object, checked: false },
        );
      }
    }

    setMembers(newMembers);
    setBenefits(newBenefits);
    setAlbum(filteredAlbums[0]);
    setAlbums(newAlbums);
    setCategory(newCategory);
  };

  /**
   * Select all elements.
   *
   * @param {string} filter - name of the filter
   */
  const selectAll = (filter: string) => {
    const newCards: ICardsProps[] = [];
    let newMembers: { name: string; checked: boolean; display: boolean }[] =
      members;
    let newBenefits: { name: string; checked: boolean; display: boolean }[] =
      benefits;
    if (filter === "members") {
      newMembers = members.map((object) =>
        object.display && !object.checked
          ? { ...object, checked: true }
          : object,
      );
      setMembers(newMembers);
    } else if (filter === "benefits") {
      newBenefits = benefits.map((object) =>
        object.display && !object.checked
          ? { ...object, checked: true }
          : object,
      );
      setBenefits(newBenefits);
    }

    const filteredMembers = filterValues(newMembers);
    const filteredBenefits = filterValues(newBenefits);
    cards.forEach((card) => {
      filteredMembers.some((member) => card.members.includes(member)) &&
      album == card.era &&
      filteredBenefits.includes(card.benefit) &&
      card.categories.includes(category)
        ? newCards.push({ ...card, display: true })
        : newCards.push(card);
    });

    setCards(newCards);
  };

  /**
   * Unselect all elements.
   *
   * @param {string} filter - name of the filter
   */
  const unSelectAll = (filter: string) => {
    if (filter === "members") {
      setMembers(
        members.map((object) =>
          object.checked ? { ...object, checked: false } : object,
        ),
      );
      setCards(cards.map((object) => ({ ...object, display: false })));

      if (searchParams.has("members")) {
        searchParams.set("members", "false");
        setSearchParams(searchParams, { replace: true });
      }
    } else if (filter === "benefits") {
      setBenefits(
        benefits.map((object) =>
          object.checked ? { ...object, checked: false } : object,
        ),
      );
      setCards(cards.map((object) => ({ ...object, display: false })));

      if (searchParams.has("benefits")) {
        searchParams.set("benefits", "false");
        setSearchParams(searchParams, { replace: true });
      }
    }
  };

  /**
   * Handle select category.
   *
   * @param {React.ChangeEvent<HTMLSelectElement>} event - select event
   */
  const handleChangeCategory = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    updateCategories(event.target.value);
  };

  /**
   * Handle select album.
   *
   * @param {React.ChangeEvent<HTMLSelectElement>} event - select event
   */
  const handleChangeAlbum = (event: React.ChangeEvent<HTMLSelectElement>) => {
    updateAlbums(event.target.value);
  };

  /**
   * Disable select all button or not
   *
   * @param {{ name: string, checked: boolean, display: boolean }[]} data - array representing elements of a filter
   *
   * @returns {boolean}
   */
  const checkDisabledSelectAllButton = (
    data: { name: string; checked: boolean; display: boolean }[],
  ) => {
    const numberElementsSelected = data.filter(
      (element) => element.checked,
    ).length;
    return (
      numberElementsSelected ===
      data.filter((element) => element.display).length
    );
  };

  /**
   * Disable unselect all button or not
   *
   * @param {{ name: string, checked: boolean}[]} data - array representing elements of a filter
   *
   * @returns {boolean}
   */
  const checkDisabledUnselectAllButton = (
    data: { name: string; checked: boolean }[],
  ) => {
    const numberElementsSelected = data.filter(
      (element) => element.checked,
    ).length;
    return numberElementsSelected === 0;
  };

  return (
    <>
      <div className={`filter__container ${filter ? "open" : "close"}`}>
        <div className="header__container">
          FILTER
          <button
            onClick={handleFilterBox}
            aria-label={filter ? "Close filter box" : "Open filter box"}
          >
            <RxCross2 />
          </button>
        </div>
        <div className="inputs__container">
          <div className="select__container">
            <div
              className={
                focusCategory ? "input__container active" : "input__container"
              }
            >
              <select
                name="select-category"
                id="select-category"
                value={category}
                onChange={handleChangeCategory}
                onClick={() => setFocusCategory((prevState) => !prevState)}
                onBlur={() => setFocusCategory(false)}
              >
                {categories.map((object) => {
                  return (
                    <option value={object.name} key={`option_${object.name}`}>
                      {object.name}
                    </option>
                  );
                })}
              </select>
            </div>
            <div
              className={
                focusAlbum ? "input__container active" : "input__container"
              }
            >
              <select
                name="select-album"
                id="select-album"
                value={album}
                onChange={handleChangeAlbum}
                onClick={() => setFocusAlbum((prevState) => !prevState)}
                onBlur={() => setFocusAlbum(false)}
              >
                {albums.map((object) => {
                  if (object.display)
                    return (
                      <option value={object.name} key={`option_${object.name}`}>
                        {object.name}
                      </option>
                    );
                })}
              </select>
            </div>
          </div>
          <div className="input__container">
            <h3>Benefits</h3>
            <div className="buttons__container">
              <button
                onClick={() => selectAll("benefits")}
                disabled={checkDisabledSelectAllButton(benefits)}
                aria-label="Select all benefits"
              >
                Select All
              </button>
              <button
                onClick={() => unSelectAll("benefits")}
                disabled={checkDisabledUnselectAllButton(benefits)}
                aria-label="Unselect all benefits"
              >
                Unselect All
              </button>
            </div>
            <div className="checkboxes__container">
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
                );
              })}
            </div>
          </div>

          <div className="input__container">
            <h3>Members</h3>
            <div className="buttons__container">
              <button
                onClick={() => selectAll("members")}
                disabled={checkDisabledSelectAllButton(members)}
                aria-label="Select all members"
              >
                Select All
              </button>
              <button
                onClick={() => unSelectAll("members")}
                disabled={checkDisabledUnselectAllButton(members)}
                aria-label="Unselect all members"
              >
                Unselect All
              </button>
            </div>
            <div className="checkboxes__container members">
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
                );
              })}
            </div>
          </div>

          <div className="input__container">
            <div className={`radio__container`}>
              {SEARCH_VALUES.map((value) => {
                return (
                  <div
                    className={`radio__container__item-${value}`}
                    key={`search-type-box-${value}`}
                  >
                    <input
                      type="radio"
                      id={value}
                      value={value}
                      checked={searchType === value}
                      onChange={() => handleSearchTypeChange(value)}
                      key={`search-type-input-${value}`}
                    />
                    <label htmlFor={value} key={`search-type-label-${value}`}>
                      {value}
                    </label>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="footer__container">
          <button onClick={handleFilterBox}> APPLY FILTER </button>
        </div>
      </div>
    </>
  );
};
