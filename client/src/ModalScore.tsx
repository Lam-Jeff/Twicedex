import { RxCross2 } from 'react-icons/rx';
import { TScoreProps } from './types/scores';

export interface IScoreProps extends TScoreProps {
    /**
     * Open/close modal.
     */
    setIsOpen: (value: boolean) => void;
}

export const ModalScore = ({ setIsOpen, maxStreak, currentStreak, wins, winRate, numberGames, numberTries }: IScoreProps) => {
    return (<div className="modal-score">
        <div className="modal-score__content">
            <RxCross2 className='modal-score__content__close-button' onClick={() => setIsOpen(false)} aria-label='Close score window' />
            <h3>STATS</h3>
            <div className="modal-score__content__graph-score-box">
                {[...Array(7)].map((_, index) => {
                    index += 1;
                    return (
                        <div key={`container_${index}`}>
                            <div key={`bar_key_${index}`} className={`bar-${numberTries[index - 1]}`}>
                                <span>{numberTries[index - 1] ? numberTries[index - 1] : ""}</span>
                            </div>
                            <span key={index}>{index === 7 ? <RxCross2 strokeWidth="1" /> : index}</span>
                        </div>

                    )
                })}
            </div>
            <div className='modal-score__content__scores-box'>
                <div className='modal-score__content__scores-box__stat'>
                    <p>Max streak: </p>
                    <span>{maxStreak}</span>
                </div>
                <div className='modal-score__content__scores-box__stat'>
                    <p>current streak: </p>
                    <span>{currentStreak}</span>
                </div>
                <div className='modal-score__content__scores-box__stat'>
                    <p>Wins: </p>
                    <span>{wins}</span>
                </div>
                <div className='modal-score__content__scores-box__stat'>
                    <p>Win rate: </p>
                    <span>{winRate.toFixed(2)}%</span>
                </div>
                <div className='modal-score__content__scores-box__stat'>
                    <p>Played: </p>
                    <span>{numberGames}</span>
                </div>
            </div>
        </div>
    </div>
    )
}
