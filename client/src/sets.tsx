import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import {
  computeProgressionByEraAndCategory,
  filterAlbumsByCategory,
  filterAlbumsBySearchValue,
  filterAlbumsbyRadioButtonType,
  getLengthSetsDisplayed,
  sortAlbums,
  getInitialValue,
} from "./helpers";
import { TAlbumsProps } from "./types/albums";
import { ModalSetDetails } from "./ModalSetDetails";

import albumsFile from "./files/albums.json";
import benefitsFile from "./files/benefits.json";
import membersFile from "./files/members.json";
import categoriesFile from "./files/categories.json";
import cardsFile from "./files/cards.json";
import { StatsInfo } from "./stats";
import { UrlContext } from "./urlProvider";
import { RxCross2 } from "react-icons/rx";
import { useCollection } from "./useOwned";

export const Sets = () => {
  const SORT_DEFAULT_VALUE = "Release date (New to old)";
  const CATEGORY_DEFAULT_VALUE = "Korean Albums";
  const SEARCH_TYPE_DEFAULT_VALUE = "All";
  const sortSessionStorage = getInitialValue(
    "sortValue",
    SORT_DEFAULT_VALUE,
    null,
  );
  const categorySetsSessionStorage = getInitialValue(
    "categorySets",
    CATEGORY_DEFAULT_VALUE,
    null,
  );

  const searchTypeSessionStorage = getInitialValue(
    "searchType",
    SEARCH_TYPE_DEFAULT_VALUE,
    null,
  );
  const ALBUMS_DEFAULT_STATE = filterAlbumsByCategory(
    albumsFile,
    CATEGORY_DEFAULT_VALUE,
  );

  const SORT_OPTIONS = [
    "Collection progress (Ascending)",
    "Collection progress (Descending)",
    "Name (A - Z)",
    "Name (Z - A)",
    "Release date (Old to new)",
    "Release date (New to old)",
  ];
  const SEARCH_VALUES = ["All", "In progress", "Completed"];
  const { owned } = useCollection();
  const {
    setCodeUrl,
    setCategoryUrl,
    setDisplayUrl,
    updateParams,
    optionParam,
  } = useContext(UrlContext);

  const [category, setCategory] = useState(
    decodeURIComponent(categorySetsSessionStorage) ?? CATEGORY_DEFAULT_VALUE,
  );
  const [searchType, setSearchType] = useState(
    searchTypeSessionStorage ?? SEARCH_TYPE_DEFAULT_VALUE,
  );
  const progression = computeProgressionByEraAndCategory(
    [...owned],
    cardsFile,
    category,
  );

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchText, setSearchText] = useState<string>("");
  const [sortValue, setSortValue] = useState<string>(
    sortSessionStorage ?? SORT_DEFAULT_VALUE,
  );
  const [albums, setAlbums] = useState<TAlbumsProps[]>(
    sortAlbums(
      filterAlbumsByCategory(albumsFile, category),
      sortValue,
      progression,
    ),
  );
  const [isModalSetDetailsOpen, setIsModalSetDetailsOpen] = useState(false);
  const [albumInViewDetails, SetAlbumInViewDetails] = useState<{
    name: string;
    code: string;
    image: string;
  }>({ name: "", code: "", image: "" });

  /**
   * Filter the collection by the text input.
   *
   * @param {string} value - string representing the text input used for filtering
   */
  const handleSearchTextChange = (value: string) => {
    let newAlbums: TAlbumsProps[] = filterAlbumsByCategory(
      ALBUMS_DEFAULT_STATE,
      category,
    );
    newAlbums = filterAlbumsbyRadioButtonType(
      newAlbums,
      searchType,
      progression,
      category,
    );
    newAlbums = filterAlbumsBySearchValue(newAlbums, value);
    newAlbums = sortAlbums(newAlbums, sortValue, progression);
    setSearchText(value);
    setAlbums(newAlbums);
  };

  /**
   * Update the search type.
   *
   * @param {string} value - string representing the search type.
   */
  const handleSearchTypeChange = (value: string) => {
    let newAlbums: TAlbumsProps[] = filterAlbumsByCategory(albums, category);
    newAlbums = filterAlbumsbyRadioButtonType(
      newAlbums,
      value,
      progression,
      category,
    );
    newAlbums = filterAlbumsBySearchValue(newAlbums, searchText);
    newAlbums = sortAlbums(newAlbums, sortValue, progression);

    setSearchType(value);
    setAlbums(newAlbums);
    const searchTypeStringify = JSON.stringify(value);
    sessionStorage.setItem("searchType", searchTypeStringify);
  };

  const handleClickOnOverlay = () => {
    handleClickOnFilter();
  };

  /**
   * Open or close the filter window.
   *
   */
  const handleClickOnFilter = () => {
    const newValue = isFilterOpen ? false : true;
    setIsFilterOpen(newValue);
    if (newValue) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }
  };

  /**
   * Update the category.
   *
   * @param {string} value - string representing the category
   */
  const handleClickOnCategory = (value: string) => {
    let newAlbums: TAlbumsProps[] = filterAlbumsByCategory(
      ALBUMS_DEFAULT_STATE,
      value,
    );
    newAlbums = filterAlbumsbyRadioButtonType(
      newAlbums,
      SEARCH_TYPE_DEFAULT_VALUE,
      progression,
      value,
    );
    newAlbums = sortAlbums(newAlbums, SORT_DEFAULT_VALUE, progression);
    setSearchText("");
    setSortValue(SORT_DEFAULT_VALUE);
    setSearchType(SEARCH_TYPE_DEFAULT_VALUE);
    setCategory(value);
    setAlbums(newAlbums);
    const categoryStringify = JSON.stringify(value);
    sessionStorage.setItem("categorySets", categoryStringify);
  };

  /**
   * Handle select category.
   *
   * @param {React.ChangeEvent<HTMLSelectElement>} event - select event
   */
  const handleChangeSort = (event: React.ChangeEvent<HTMLSelectElement>) => {
    let newAlbums = sortAlbums(albums, event.target.value, progression);
    setSortValue(event.target.value);
    setAlbums(newAlbums);
    const sortValueStringify = JSON.stringify(event.target.value);
    sessionStorage.setItem("sortValue", sortValueStringify);
  };

  /**
   * Open the details window.
   *
   * @param {{name:string, code:string, image:string}} album - object representing an album
   */
  const handleClickOnViewDetails = (album: {
    name: string;
    code: string;
    image: string;
  }) => {
    SetAlbumInViewDetails(album);
    setIsModalSetDetailsOpen(true);
    document.body.classList.add("modal-open");
  };

  /**
   * Update parameters to access the album page.
   *
   * @param {string} code - string representing an album code
   */
  const handleClickLinkToAlbum = (code: string) => {
    const currentAlbum = albums.filter((_album) => _album.code === code);
    const currentMembers = membersFile.map((_member) =>
      currentAlbum[0].members.includes(_member.name)
        ? { ..._member, display: true, checked: true }
        : { ..._member, display: false, checked: false },
    );
    const currentBenefits = benefitsFile.map((_benefit) =>
      currentAlbum[0].benefits.includes(_benefit.name)
        ? { ..._benefit, display: true, checked: true }
        : { ..._benefit, display: false, checked: false },
    );
    setCodeUrl(code);
    setCategoryUrl(category);
    setDisplayUrl("0");
    updateParams(currentBenefits, currentMembers, optionParam);
  };

  return (
    <div className="sets-container">
      <ModalSetDetails
        album={albumInViewDetails}
        category={category}
        isModalSetDetailsOpen={isModalSetDetailsOpen}
        setIsModalSetDetailsOpen={setIsModalSetDetailsOpen}
        progression={progression}
      />
      <div
        className={`overlay ${isFilterOpen ? "active" : ""}`}
        onClick={handleClickOnOverlay}
      ></div>
      <div
        className={`sets-container__filter-box ${isFilterOpen ? "open" : "close"}`}
      >
        <div className="sets-container__filter-box__header__container">
          FILTER
          <button
            onClick={handleClickOnFilter}
            aria-label={isFilterOpen ? "Close filter box" : "Open filter box"}
          >
            <RxCross2 />
          </button>
        </div>
        <div className="sets-container__filter-box__main">
          <div className="sets-container__filter-box__main-category">
            {categoriesFile.map((object) => {
              return (
                <button
                  className={category === object.name ? "selected" : ""}
                  key={`option_${object.name}`}
                  onClick={() => handleClickOnCategory(object.name)}
                >
                  {object.name}
                </button>
              );
            })}
          </div>
          <div className="sets-container__filter-box__main-search">
            <input
              className="sets-container__filter-box__main-search-input"
              type="search"
              autoComplete="off"
              placeholder="Search sets..."
              value={searchText}
              onChange={(e) => handleSearchTextChange(e.target.value)}
            />
            <div className="sets-container__filter-box__main-search-type__container">
              {SEARCH_VALUES.map((value) => {
                return (
                  <div
                    className={`sets-container__filter-box__search-type__container__radio`}
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
            <div className="sets-container__filter-box__main-sort-filter">
              <select
                name=""
                id=""
                value={sortValue}
                onChange={handleChangeSort}
              >
                {SORT_OPTIONS.map((sort_option) => {
                  return (
                    <option
                      value={sort_option}
                      key={`filter-options-${sort_option}`}
                    >
                      {sort_option}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
        </div>
        <div className={`sets-container__filter-box__footer__container `}>
          <button onClick={handleClickOnFilter}> APPLY FILTER </button>
        </div>
      </div>
      <div className="sets-container__main">
        <div className="sets-container__main__header">
          <p className="sets-container__main__header-text">{`${getLengthSetsDisplayed(albums)} sets found`}</p>
          <button
            onClick={handleClickOnFilter}
            className="sets-container__main__header-filter__button"
          >
            {" "}
            FILTER{" "}
          </button>
        </div>
        <div className="sets-container__main__set">
          {albums.map((album) => {
            return album.display ? (
              <div
                className={`sets-container__main__set-box ${!cardsFile.find((card) => card.era === album.name) ? "disabled" : ""}`}
                key={`sets-container__main__set-box-${album.name}`}
              >
                <Link
                  to={`/collection/${encodeURIComponent(category)}/${encodeURIComponent(album.code)}`}
                  className="sets-container__main__set-box-link sets-container__main__set-box-overlay"
                  aria-label={`Go to ${album.name}`}
                  onClick={() => handleClickLinkToAlbum(album.code)}
                />
                <div className={"sets-container__main__set-box__header"}>
                  <h3
                    key={`sets-container__main__set-box__header-${album.name}`}
                  >
                    {album.name}
                  </h3>
                  <span
                    className="sets-container__main__set-box__header-code"
                    key={`sets-container__main__set-box-code-${album.name}`}
                  >
                    {album.code}
                  </span>
                </div>
                <div className="sets-container__main__set-box__image">
                  <img src={album.image} alt={album.name} />
                </div>
                <div
                  className="sets-container__main__set-box__body"
                  key={`sets-container__main__set-box-body-${album.name}`}
                >
                  <p className="sets-container__main__set-box__body-date">
                    {new Date(album.release).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                  <p
                    className="sets-container__main__set-box__body-count"
                    key={`status-total-${album.code}`}
                  >
                    {progression[album.name]
                      ? `${progression[album.name].acquired}/${progression[album.name].total}`
                      : ""}
                  </p>
                  <p
                    className="sets-container__main__set-box__body-percent"
                    key={`status-percent-${album.code}`}
                  >
                    {progression[album.name]
                      ? progression[album.name].percent
                      : 0}
                    %
                  </p>
                </div>
                <div
                  className="sets-container__main__set-box__footer"
                  key={`sets-container__main__set-box-footer-${album.name}`}
                >
                  <StatsInfo
                    album={album}
                    progression={progression[album.name]}
                  />
                  <button
                    onClick={() =>
                      handleClickOnViewDetails({
                        name: album.name,
                        code: album.code,
                        image: album.image,
                      })
                    }
                  >
                    View details
                  </button>
                </div>
              </div>
            ) : null;
          })}
        </div>
      </div>
    </div>
  );
};
