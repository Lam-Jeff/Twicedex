import { RxCross2 } from 'react-icons/rx';
import {RiVideoLine, RiSkipForwardLine, RiThumbUpLine} from 'react-icons/ri'

export interface setOpenProps {
    /**
     * Open/close modal.
     */
    setIsOpen: (value: boolean) => void;
}

export const ModalTutorial = ({setIsOpen} : setOpenProps) => {
    return(<div className="modal-tutorial">
                <div className="modal-tutorial__content">
                    <RxCross2 className='modal-tutorial__content__close-button' onClick={() => setIsOpen(false)} aria-label='Close tutorial window'/>
                    <h3>How to Play ?</h3>
                    <ul>
                        <li><RiVideoLine className='modal-tutorial__content__video-icon'/><p> Try to guess the music video.</p></li>
                        <li><RiSkipForwardLine className='modal-tutorial__content__skip-icon'/><p>Skipped or incorrect answers unblur the image.</p></li>
                        <li><RiThumbUpLine className='modal-tutorial__content__thumb-icon'/><p>Answer in as few tries as possible. You have 6 tries.</p></li>
                    </ul>

                </div>
            </div>
            )
}