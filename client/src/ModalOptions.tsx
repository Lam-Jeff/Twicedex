import { RxCross2 } from "react-icons/rx";
import { useNavigate, useLocation } from "react-router-dom";

export interface setOptionsProps {
  isOptionsOpen: boolean;
  /**
   * Add all cards to wish list.
   */
  wishesAll: () => void;

  /**
   * Add all cards to collection list.
   */
  collectionAll: () => void;

  /**
   * Remove all cards from wish list.
   */
  wishesNone: () => void;

  /**
   * Remove all cards from collection list.
   */
  collectionNone: () => void;

  /**
   * Open or close the options window.
   */
  handleOptionsBox: () => void;
}

export const ModalOptions = ({
  isOptionsOpen,
  wishesAll,
  collectionAll,
  wishesNone,
  collectionNone,
  handleOptionsBox,
}: setOptionsProps) => {
  return (
    <div className={`modal_options ${isOptionsOpen ? "open" : "close"}`}>
      <div className="modal__content">
        <div className="modal__topDiv">
          Options
          <button className="modal__topDiv__button-close">
            <RxCross2
              className="modal__close_button"
              onClick={handleOptionsBox}
              aria-label="Close option window"
            />
          </button>
        </div>
        <div className="divers">
          <h3>DIVERS</h3>
        </div>
        <div className="additions">
          <h3>ADDITIONS</h3>
          <button
            onClick={wishesAll}
            aria-label="Add all displayed cards to the wishlist"
          >
            Add ALL displayed cards to WISHLIST
          </button>
          <button
            onClick={collectionAll}
            aria-label="Add all displayed cards to the collection"
          >
            Add ALL displayed cards to COLLECTION
          </button>
        </div>
        <div className="deletions">
          <h3>DELETIONS</h3>
          <button
            onClick={wishesNone}
            aria-label="Delete all displayed cards from the wishlist"
          >
            Remove ALL displayed cards from WISHLIST
          </button>
          <button
            onClick={collectionNone}
            aria-label="Delete all displayed cards from the collection"
          >
            Remove ALL displayed cards from COLLECTION
          </button>
        </div>
      </div>
    </div>
  );
};
