import { RxCross2 } from 'react-icons/rx';
import { Link } from 'react-router-dom';

export interface setOpenProps {
    /**
     * Open/close modal.
     */
    setIsOpen: (value: boolean) => void;
}

export const ModalInfo = ({ setIsOpen }: setOpenProps) => {
    return (<div className="modal-info">
        <div className="modal-info__content">
            <RxCross2 className='modal-info__content__close-button' onClick={() => setIsOpen(false)} aria-label='Close info window' />
            <h3>About</h3>
            <div className="modal-info__content__text-box">
                <p>
                    Inspired by <Link to='https://framed.wtf' className='link' aria-label='Go to Framed Game website'>Framed</Link>, <Link to='https://twice-heardle.glitch.me' className='link' aria-label='Go to Twice Heardle Game website'>Heardle</Link> and all the other spinoffs.
                </p>
                <p>
                    The images have been taken from Twice official music videos.
                </p>
                <p>
                    Images included are OT9, sub-units and solos.
                </p>
                <p>
                    All copyright goes to JYP Entertainment.
                </p>
                <p>
                    Find more information <Link to='/about' className='link' aria-label='Go to About page'>here</Link>.
                </p>
            </div>

        </div>
    </div>
    )
}