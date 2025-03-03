import { useContext } from 'react';
import { RxCross2 } from 'react-icons/rx';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from './authProvider';


export interface setOptionsProps {
    /**
     * Open/close modal.
     */
    setIsOpen: (value: boolean) => void;

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
}

export const ModalOptions = ({ setIsOpen, wishesAll, collectionAll, wishesNone, collectionNone }: setOptionsProps) => {

    const navigate = useNavigate();
    const location = useLocation();
    const {user} = useContext(AuthContext);

    /**
     * Go to settings page.
     */
    const handleClickPreferences = () => {
        navigate(`/collection/${location.state.category}/${location.state.era}/settings`, { state: location.state });
    }
    
    return (<div className="modal_options">
        <div className="modal__content">
            <div className="modal__topDiv">
                <h3>Options</h3>
                <RxCross2 className='modal__close_button' onClick={() => setIsOpen(false)} aria-label='Close option window' />
            </div>
            <div className='divers'>
                <h3>DIVERS</h3>
            </div>
            <div className='additions'>
                <h3>ADDITIONS</h3>
                <button onClick={wishesAll} aria-label='Add all displayed cards to the wishlist'>Add ALL displayed cards to WISHLIST</button>
                <button onClick={collectionAll} aria-label='Add all displayed cards to the collection'>Add ALL displayed cards to COLLECTION</button>
            </div>
            <div className='deletions'>
                <h3>DELETIONS</h3>
                <button onClick={wishesNone} aria-label='Delete all displayed cards from the wishlist'>Remove ALL displayed cards from WISHLIST</button>
                <button onClick={collectionNone} aria-label='Delete all displayed cards from the collection'>Remove ALL displayed cards from COLLECTION</button>
            </div>

            <div className='preferences'>
                <button onClick={handleClickPreferences} aria-label='Go to preferences page'>Preferences</button>
            </div>

        </div>
    </div>
    )
}