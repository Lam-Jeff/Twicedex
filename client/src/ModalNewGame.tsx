import { useEffect, useState } from 'react';
import { RxCross2 } from 'react-icons/rx';
import game from './files/game.json';
import { Timer } from './timer';
import { Loading } from './loading';

interface IIndexesProps {

    /**
     * Index of the answer.
     */
    indexAnswer: number;

    /**
     * list of answers.
     */
    data: string[];

    /**
     * Open/close modal.
     */
    setIsNewGameOpen: (value: boolean) => void;

    /**
     * Reset game.
     */
    reset: () => void;

    /**
     * Date.
     */
    date: Date
}
export const ModalNewGame = ({ indexAnswer, data, setIsNewGameOpen, reset, date }: IIndexesProps) => {
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        function handleContextMenu(e: any): void {
            e.preventDefault();
        }

        const rootElement = document.getElementById('image_game');
        rootElement!.addEventListener('contextmenu', handleContextMenu);


        return () => {
            rootElement!.removeEventListener('contextmenu', handleContextMenu);
        };
    }, []);


    return (<div className="modal-new-game">
        <Loading isLoading={isLoading}
            borderColor='#888' />
        <div className="modal-new-game__content"
            style={{
                display: isLoading ? 'none' : 'flex'
            }}>
            <h3>Remaining time before next round:</h3>
            <Timer setIsNewGameOpen={setIsNewGameOpen} reset={reset} date={date} />
            <div className='recap-image-box'>
                <img className='recap-image-box__image' src={game[indexAnswer].image} alt='' id="image_game" onLoad={() => setIsLoading(false)}></img>
            </div>
            <div className='answers-box'>
                <ul className='answers'>
                    {data.map((object, index) => {
                        return (
                            <li key={index}>
                                <div className={`answerRecap_${index}`}
                                    key={index}
                                    style={{
                                        border: object.toLowerCase() === game[indexAnswer].name.toLowerCase() ? "1px solid green" : "1px solid #444"
                                    }}>
                                    {object === "SKIPPED" || object === "" ? <RxCross2 className='no_answer' /> : object}
                                </div>
                            </li>
                        )
                    })}
                </ul>

            </div>
        </div>
    </div>
    )
}