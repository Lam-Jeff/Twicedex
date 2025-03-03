import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "./authProvider";
import { computeProgressionByEraAndCategory, filterAlbumsByCategory, filterAlbumsBySearchValue, filterAlbumsbyRadioButtonType, getLengthSetsDisplayed, sortAlbums } from "./helpers";
import { TAlbumsProps } from "./types/albums";
import { ModalSetDetails } from "./ModalSetDetails";

import albumsFile from './files/albums.json';
import benefitsFile from './files/benefits.json';
import membersFile from './files/members.json';
import categoriesFile from './files/categories.json';
import cardsFile from './files/cards.json';
import { StatsInfo } from "./stats";
import { UrlContext } from "./urlProvider";

export const Sets = () => {
    const SORT_DEFAULT_VALUE = "Release date (New to old)";
    const CATEGORY_DEFAULT_VALUE = "Korean Albums";
    const SEARCH_TYPE_DEFAULT_VALUE = "All";
    const ALBUMS_DEFAULT_STATE = albumsFile.map(album => album.categories.includes(CATEGORY_DEFAULT_VALUE) ? ({ ...album, display: true }) : ({ ...album, display: false }));
    const SORT_OPTIONS = ["Collection progress (Ascending)", "Collection progress (Descending)", "Name (A - Z)", "Name (Z - A)", "Release date (Old to new)", "Release date (New to old)"];
    const SEARCH_VALUES = ["All", "In progress", "Completed"];
    const { cardsData } = useContext(AuthContext);
    const { setCodeUrl, setCategoryUrl, setDisplayUrl, updateParams } = useContext(UrlContext);

    const [category, setCategory] = useState(CATEGORY_DEFAULT_VALUE);
    const [searchType, setSearchType] = useState(SEARCH_TYPE_DEFAULT_VALUE);
    const progression = computeProgressionByEraAndCategory(cardsData, cardsFile, category);
    const [albums, setAlbums] = useState<TAlbumsProps[]>(sortAlbums(ALBUMS_DEFAULT_STATE, SORT_DEFAULT_VALUE, progression));
    const [searchText, setSearchText] = useState<string>("");
    const [sortValue, setSortValue] = useState<string>(SORT_DEFAULT_VALUE);
    const [isModalSetDetailsOpen, setIsModalSetDetailsOpen] = useState(false);
    const [albumInViewDetails, SetAlbumInViewDetails] = useState<{ name: string, code: string, image: string }>({ name: "", code: "", image: "" });
    if (isModalSetDetailsOpen) {
        document.body.style.overflow = "hidden";
        document.body.style.paddingRight = "17px";
    }
    else {
        document.body.style.overflow = "auto";
        document.body.style.paddingRight = "0px";
    }
    const handleSearchTextChange = (value: string) => {
        let newAlbums: TAlbumsProps[] = filterAlbumsByCategory(ALBUMS_DEFAULT_STATE, category);
        newAlbums = filterAlbumsbyRadioButtonType(newAlbums, searchType, progression, category);
        newAlbums = filterAlbumsBySearchValue(newAlbums, value);
        setSearchText(value);
        setAlbums(newAlbums);
    }

    const handleSearchTypeChange = (value: string) => {
        let newAlbums: TAlbumsProps[] = filterAlbumsByCategory(albums, category);
        newAlbums = filterAlbumsbyRadioButtonType(newAlbums, value, progression, category);
        newAlbums = filterAlbumsBySearchValue(newAlbums, searchText);
        setSearchType(value);
        setAlbums(newAlbums);
    }

    const handleClickOnCategory = (value: string) => {
        let newAlbums: TAlbumsProps[] = filterAlbumsByCategory(ALBUMS_DEFAULT_STATE, value);
        newAlbums = filterAlbumsbyRadioButtonType(newAlbums, SEARCH_TYPE_DEFAULT_VALUE, progression, value);
        newAlbums = sortAlbums(newAlbums, SORT_DEFAULT_VALUE, progression);
        setSearchText("");
        setSortValue(SORT_DEFAULT_VALUE);
        setSearchType(SEARCH_TYPE_DEFAULT_VALUE);
        setCategory(value);
        setAlbums(newAlbums);
    }

    /**
     * Handle select category.
     * 
     * @param {React.ChangeEvent<HTMLSelectElement>} event - select event
     */
    const handleChangeSort = (event: React.ChangeEvent<HTMLSelectElement>) => {
        let newAlbums = sortAlbums(albums, event.target.value, progression);
        setSortValue(event.target.value);
        setAlbums(newAlbums);
    }

    const handleClickOnViewDetails = (album: { name: string, code: string, image: string }) => {
        SetAlbumInViewDetails(album);
        setIsModalSetDetailsOpen(true);
    }

    const handleClickLinkToAlbum = (code: string) => {
        const currentAlbum = albums.filter(_album => _album.code === code);
        const currentMembers = membersFile.map(_member => currentAlbum[0].members.includes(_member.name) ? { ..._member, display: true, checked: true } : { ..._member, display: false, checked: false })
        const currentBenefits = benefitsFile.map(_benefit => currentAlbum[0].benefits.includes(_benefit.name) ? { ..._benefit, display: true, checked: true } : { ..._benefit, display: false, checked: false })
        setCodeUrl(code);
        setCategoryUrl(category);
        setDisplayUrl("0");
        updateParams(currentBenefits, currentMembers);
    }

    return (
        <div className="sets-container">
            <ModalSetDetails album={albumInViewDetails}
                category={category}
                isModalSetDetailsOpen={isModalSetDetailsOpen}
                setIsModalSetDetailsOpen={setIsModalSetDetailsOpen}
                progression={progression} />

            <div className="sets-container__filter-box">
                <div className="sets-container__filter-box__category">
                    {categoriesFile.map((object) => {
                        return (
                            <button className={category === object.name ? "selected" : ""}
                                key={`option_${object.name}`}
                                onClick={() => handleClickOnCategory(object.name)}>
                                {object.name}</button>
                        )
                    })}
                </div>
                <div className="sets-container__filter-box__search">
                    <input className="sets-container__filter-box__search-input"
                        type="search"
                        autoComplete="off"
                        placeholder="Search sets..."
                        value={searchText}
                        onChange={e => handleSearchTextChange(e.target.value)}
                    />
                    <div className="sets-container__filter-box__search-type-container">
                        {
                            SEARCH_VALUES.map((value) => {
                                return (<div className={`sets-container__filter-box__search-type-container__radio`} key={`search-type-box-${value}`}>
                                    <input type="radio" id={value} value={value} checked={searchType === value} onChange={() => handleSearchTypeChange(value)} key={`search-type-input-${value}`} />
                                    <label htmlFor={value} key={`search-type-label-${value}`}>{value}</label>
                                </div>)
                            })
                        }
                    </div>
                    <div className="sets-container__filter-box__sort-filter">
                        <select name="" id="" value={sortValue} onChange={handleChangeSort}>
                            {SORT_OPTIONS.map(sort_option => {
                                return (
                                    <option value={sort_option} key={`filter-options-${sort_option}`}>{sort_option}</option>
                                )
                            })}
                        </select>
                    </div>
                </div>
            </div>
            <div className="sets-container__main">
                <div className="sets-container__main__header">
                    <p className="sets-container__main__header-text">{`${getLengthSetsDisplayed(albums)} sets found`}</p>
                </div>
                <div>
                    {
                        albums.map((album) => {
                            return (
                                album.display ? <div className={`sets-container__main__set-box ${!cardsFile.find(card => card.era === album.name) ? "disabled" : ""}`} key={`sets-container__main__set-box-${album.name}`}>
                                    <h3 key={`sets-container__main__set-box__header-${album.name}`}>
                                        <Link to={`/collection/${encodeURIComponent(category)}/${album.code}`}
                                            className="sets-container__main__set-box-link"
                                            aria-label={`Go to Collection page`}
                                            onClick={() => handleClickLinkToAlbum(album.code)}>
                                            {album.name}
                                        </Link>
                                        <span className="sets-container__main__set-box__header-code" key={`sets-container__main__set-box-code-${album.name}`}>{album.code}</span>
                                    </h3>
                                    <div className="sets-container__main__set-box__body" key={`sets-container__main__set-box-body-${album.name}`}>
                                        <Link to={`/collection/${encodeURIComponent(category)}/${album.code}`}
                                            className="sets-container__main__set-box-link"
                                            aria-label={`Go to Collection page`}
                                            onClick={() => handleClickLinkToAlbum(album.code)}
                                        >
                                            <img src={album.image} alt={album.name} />
                                        </Link>
                                        {new Date(album.release).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' })}
                                    </div>
                                    <div className="sets-container__main__set-box__footer" key={`sets-container__main__set-box-footer-${album.name}`}>
                                        <StatsInfo album={album} progression={progression[album.name]} />
                                        <button onClick={() => handleClickOnViewDetails({ name: album.name, code: album.code, image: album.image })}>View details</button>
                                    </div>
                                </div> : null
                            )
                        })
                    }
                </div>
            </div>
        </div>

    )
}