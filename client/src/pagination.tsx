import { useState, useEffect, useRef } from "react"
import { Link, useLocation } from 'react-router-dom';

import { TNewsProps } from "./types/news";
import { PaginationIndicator } from "./paginationIndicators";

import { MdOutlineKeyboardDoubleArrowRight } from 'react-icons/md'
import { getPages } from "./helpers";
import { Loading } from "./loading";

interface PaginationProps {
    /**
     * Number elements on a page.
     */
    sizePage: number,

    /**
     * Data to display.
     */
    data: TNewsProps[]
}
export const Pagination = ({ sizePage, data }: PaginationProps) => {
    const { pathname } = useLocation()
    const [currentPage, setCurrentPage] = useState(1)
    const [isLoadingThumbnail, setIsLoadingThumbnail] = useState(true)
    const [numberElementPerPage, setNumberElementPerPage] = useState(sizePage)
    const lastIndex = currentPage * numberElementPerPage;
    const firstIndex = lastIndex - numberElementPerPage;
    const itemsToDisplay = data.slice(firstIndex, lastIndex)
    const pages: number[] = getPages(data, numberElementPerPage)

    const countThumbnailRef = useRef<number>(0)

    useEffect (()=>{
        countThumbnailRef.current = 0;
        setIsLoadingThumbnail(true);
    },[currentPage])
    
    useEffect(() => {
        if (numberElementPerPage !== sizePage) {
            window.scrollTo({
                top: document.documentElement.scrollHeight,
                behavior: 'smooth'
            });
        }
    }, [numberElementPerPage]);

    /**
     * Handle image loading. Wait for all images to load before displaying them.
     */
    const handleLoadingImages = () => {
        countThumbnailRef.current += 1;
        if (countThumbnailRef.current >= itemsToDisplay.length) {
            setIsLoadingThumbnail(false);
        }
    }

    /**
     * Increase number of elements per page.
     */
    const handleLoadMore = () => {
        setNumberElementPerPage((prevState: number) => prevState + 5)
    }

    return (
        <div className="pagination-box">
            {itemsToDisplay.map((object, index) => {
                return (
                    <article className={`article_${index}`}
                        key={`article_${index}`} >
                        <div className='thumbnail'
                            key={`article_thumbnail_${index}`} >
                            <Link to={`/collection/${object.category}/${object.era}`}
                                state={{ from: pathname }}
                                className='article__link'
                                key={`article_link_thumbnail_${index}`}
                                aria-label='Go to Collection page'>
                                <Loading isLoading={isLoadingThumbnail}
                                    borderColor='transparent'/>
                                <img src={object.thumbnail}
                                    alt={object.alt}
                                    key={`article_thumbnail_image_${index}`}
                                    onLoad={handleLoadingImages}
                                    style={{
                                        display: isLoadingThumbnail ? 'none' : 'flex'
                                    }} />
                            </Link>
                        </div>
                        <div className='article__content'
                            key={`article_content${index}`}>
                            <Link to={`/collection/${object.category}/${object.era}`}
                                state={{ from: pathname }}
                                key={`article_link_${index}`}
                                aria-label='Go to Collection page'>
                                <span className='article__category'
                                    key={`article_link_collection_${index}`}>{object.subject}</span>
                            </Link>
                            <Link to={`/collection/${object.category}/${object.era}`}
                                state={{ from: pathname }}
                                key={`article_link_title_${index}`}
                                aria-label='Go to Collection page'>
                                <h3 className='article__title'
                                    key={`article_title_${index}`}>{object.title}</h3>
                            </Link>
                            <time dateTime=''
                                className='article__date'
                                key={`article_date_${index}`}>{object.date}</time>
                            <div className='article__button'
                                key={`article_button_${index}`}>
                                <Link to={`/collection/${object.category}/${object.era}`}
                                    state={{ from: pathname }}
                                    className='article__link' key={`article_link_button_${index}`}
                                    aria-label='Go to Collection page'>
                                    Go to {object.subject}
                                    <MdOutlineKeyboardDoubleArrowRight className='article__button__icon'
                                        key={`article_button_icon_${index}`} />
                                </Link>
                            </div>
                        </div>
                    </article>)
            })}
            <PaginationIndicator
                setCurrentPage={setCurrentPage}
                pages={pages}
                currentPage={currentPage}
                numberIndicatorsToDisplayMin={1}
                numberIndicatorsToDisplayMax={5}
                maxPageIndicatorsToDisplay={5}
            />
            <button className="pagination-box-indicators__load-more-button"
                onClick={handleLoadMore}
                style={{
                    display: pages.length === 1
                        || !pages.length
                        || currentPage !== 1 ? 'none' : 'block'
                }}>
                Load More...
            </button>
        </div >
    )
}