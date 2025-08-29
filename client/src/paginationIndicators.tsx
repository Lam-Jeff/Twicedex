import { useState, useEffect } from "react";
import { PiAlignRightSimple } from "react-icons/pi";

interface PaginationIndicatorProps {
  /**
   * Set Current page with the page's number.
   */
  setCurrentPage: (index: number) => void;

  /**
   * Array of pages number.
   */
  pages: number[];

  /**
   * Current page.
   */
  currentPage: number;

  /**
   * Smallest indicator number to display.
   */
  numberIndicatorsToDisplayMin: number;

  /**
   * Biggest indicator number to display.
   */
  numberIndicatorsToDisplayMax: number;

  /**
   * Number of indicators to display.
   */
  maxPageIndicatorsToDisplay: number;
}
export const PaginationIndicator = ({
  setCurrentPage,
  pages,
  currentPage,
  numberIndicatorsToDisplayMin,
  numberIndicatorsToDisplayMax,
  maxPageIndicatorsToDisplay,
}: PaginationIndicatorProps) => {
  const [min, setMin] = useState(numberIndicatorsToDisplayMin);
  const [max, setMax] = useState(numberIndicatorsToDisplayMax);

  /**
   * Change page when user click on an indicator.
   *
   * @param {number} page - page's number indicator
   */
  const handleClickIndicator = (page: number): void => {
    setCurrentPage(page);
  };

  /**
   * Go to previous page.
   */
  const handleClickPrevious = () => {
    if (currentPage > 0) setCurrentPage(currentPage - 1);
    if ((currentPage - 1) % maxPageIndicatorsToDisplay === 0) {
      setMin(min - maxPageIndicatorsToDisplay);
      setMax(max - maxPageIndicatorsToDisplay);
    }
  };

  /**
   * Go to next page.
   */
  const handleClickNext = () => {
    if (currentPage < pages.length) setCurrentPage(currentPage + 1);
    if (currentPage + 1 > max) {
      setMin(min + maxPageIndicatorsToDisplay);
      setMax(max + maxPageIndicatorsToDisplay);
    }
  };

  return (
    <div className="pagination-box-indicators">
      <div className="pagination-box-indicators__info">
        <button disabled>{`Page ${currentPage} of ${pages.length}`}</button>
      </div>
      <div className="pagination-box-indicators__previous-button">
        <button
          onClick={handleClickPrevious}
          disabled={currentPage === 1 || !pages.length}
        >
          &laquo;
        </button>
      </div>
      <ul className="pagination-box-indicators__page-number">
        {pages.map((object) => {
          if (object >= min && object <= max) {
            return (
              <li
                key={`page_${object}`}
                aria-label={`Go to page ${object}`}
                onClick={() => handleClickIndicator(object)}
              >
                <button className={currentPage === object ? "active" : ""}>
                  {object}
                </button>
              </li>
            );
          } else {
            return null;
          }
        })}
      </ul>
      <div className="pagination-box-indicators__next-button">
        <button
          onClick={handleClickNext}
          disabled={currentPage === pages.length || !pages.length}
        >
          &raquo;
        </button>
      </div>
    </div>
  );
};

