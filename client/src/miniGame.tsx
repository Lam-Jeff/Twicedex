import { useState, useRef, useEffect } from 'react';
import { RiInformationLine, RiBarChart2Fill, RiQuestionLine } from 'react-icons/ri';

import {ModalTutorial} from './ModalTutorial';
import {ModalInfo} from './ModalInfo';
import {ModalScore} from './ModalScore';
import {ModalNewGame} from './ModalNewGame';
import {AutoComplete} from './autocomplete';
import { imageOfTheDay, findWinStreak } from './helpers';
import { Timer } from './timer';
import { Loading } from './loading';

import { TScoreProps } from './types/scores';

import titles from './files/titles.json';
import game from './files/game.json'

export interface IStatsProps {
    /**
     * Id of the round.
     */
    id: number,

    /**
     * Answer of the round.
     */
    solution: string,

    /**
     * Date of the round.
     */
    date: string,

    /**
     * Boolean: True if user found the answer, otherwise false.
     */
    findAnswer: boolean,

    /**
     * Number of tries.
     */
    numberTries: number,

    /**
     * Answers details.
     */
    guessList: { answer: string, isSkipped: boolean, isCorrect: boolean }[]

    /**
     * Boolean: True if user started the round, otherwise false.
     */
    hasStarted: boolean,

    /**
     * Boolean: True if user finished the round, otherwise false.
     */
    hasFinished: boolean
}

export const MiniGame = () => {
    const today = new Date();
    const suggestions: { name: string, code: string }[] = titles;
    const NUMBER_TRIES = 6
    const [currentImage, setCurrentImage] = useState(imageOfTheDay)
    const [tries, setTries] = useState(0);
    const [blur, setBlur] = useState(0.5);
    const [date, setDate] = useState<string>([today.getDate(), today.getMonth() + 1, today.getFullYear()].join('/'))
    const [score, setScore] = useState<TScoreProps>({
        maxStreak: 0,
        currentStreak: 0,
        wins: 0,
        winRate: 0,
        numberGames: 0,
        numberTries: [0, 0, 0, 0, 0, 0, 0]
    })
    const [stats, setStats] = useState<IStatsProps[]>(() => {
        const stats = localStorage.getItem('userStats');
        return stats ? JSON.parse(stats) : [];
    })
    const [isLoading, setIsLoading] = useState(true)
    const [isScoreOpen, setIsScoreOpen] = useState(false);
    const [isInfoOpen, setIsInfoOpen] = useState(false);
    const [isNewGameOpen, setIsNewGameOpen] = useState(false);
    const [isTutorialOpen, setIsTutorialOpen] = useState(() => {
        const stats = localStorage.getItem('userStats');
        return stats !== null ? false : true;
    });

    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        localStorage.setItem('userStats', JSON.stringify(stats));
    }, [stats]);


    useEffect(() => {
        const todayStats = {
            id: imageOfTheDay.id,
            solution: imageOfTheDay.name,
            date: date,
            findAnswer: false,
            numberTries: 0,
            guessList: Array.from(Array(6), () => {
                return { answer: '', isSkipped: true, isCorrect: false };
            }),
            hasStarted: false,
            hasFinished: false,
        }

        if (stats.length) {
            const visited = stats[stats.length - 1].id === imageOfTheDay.id
            if (!visited) {
                setStats([...stats, todayStats])
            } else if (stats[stats.length - 1].hasFinished) {
                setIsNewGameOpen(true);
            }
            setTries(stats[stats.length - 1].numberTries)
            getScore(stats)
        } else {
            setStats([todayStats])
        }
    }, [])

    useEffect(() => {
        if (!stats.length) { return; }
        if (stats[stats.length - 1].date === date) {
            getScore(stats)
            if (stats[stats.length - 1].hasFinished) setIsNewGameOpen(true);
            else {
                setTries(stats[stats.length - 1].numberTries)
            }
        }
    }, [stats]);

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


    /**
     * Compute score according to the user's stats.
     * 
     * @param {IStatsProps[]} stats - user's stats
     */
    const getScore = (stats: IStatsProps[]) => {
        const winsCount = stats.filter(stat => stat.findAnswer && stat.hasFinished).length
        const gamesCount = stats.filter(stat => stat.hasStarted).length
        const winRate = gamesCount ? winsCount / gamesCount * 100 : 0
        const { longestStreak, currentStreak } = findWinStreak(stats[stats.length - 1].hasFinished ? stats : stats.slice(0, stats.length - 1))
        let numberTries = [0, 0, 0, 0, 0, 0, 0];
        stats.filter(stat => stat.hasFinished)
            .map(stat => stat.findAnswer ? numberTries[stat.numberTries - 1] += 1 : numberTries[numberTries.length - 1] += 1)

        setScore({
            maxStreak: longestStreak,
            currentStreak: currentStreak,
            wins: winsCount,
            winRate: winRate,
            numberGames: gamesCount,
            numberTries: numberTries
        })
    }


    /**
     * Reset the game.
     */
    const reset = () => {
        let newStats = [...stats];
        newStats[newStats.length - 1].hasFinished = true;
        const resetDay = new Date();
        const newDay = [resetDay.getDate(), resetDay.getMonth() + 1, resetDay.getFullYear()].join('/');
        const newImage = game[(resetDay.getFullYear() * resetDay.getDate() * (resetDay.getMonth() + 1)) % game.length]
        const todayStats = {
            id: newImage.id,
            solution: newImage.name,
            date: newDay,
            findAnswer: false,
            numberTries: 0,
            guessList: Array.from(Array(6), () => {
                return { answer: '', isSkipped: true, isCorrect: false };
            }),
            hasStarted: false,
            hasFinished: false,
        }
        setStats([...newStats, todayStats])
        setTries(0);
        setBlur(0.5);
        setCurrentImage(newImage);
        setDate(newDay)
    }

    /**
     * Update the game after each user's answer.
     * 
     * @param {string} answer - user's answer
     */
    const updateGame = (answer: string) => {
        let newStats = [...stats];
        let todayStats = { ...newStats[stats.length - 1] };
        if (answer === "") return;

        if (!tries) {
            todayStats.hasStarted = true;
            newStats[stats.length - 1] = todayStats;
        }

        if (currentImage!.name.toLowerCase() === answer.toLowerCase()) {
            todayStats.guessList[tries].answer = answer
            todayStats.guessList[tries].isSkipped = false;
            todayStats.guessList[tries].isCorrect = true;
            todayStats.findAnswer = true;
            todayStats.hasFinished = true;
            todayStats.numberTries += 1;
            newStats[stats.length - 1] = todayStats;
        }
        else if (tries < NUMBER_TRIES - 1) {
            let guess = { answer: answer, isSkipped: false, isCorrect: false }
            if (answer === 'SKIPPED') guess.isSkipped = true;

            todayStats.guessList[tries] = guess;
            todayStats.numberTries += 1;
            newStats[stats.length - 1] = todayStats;

            setTries((prevState: number) => prevState + 1);
            setBlur((prevState: number) => prevState - 0.1);
        }
        else {
            todayStats.guessList[tries].answer = answer
            todayStats.guessList[tries].isSkipped = false;
            todayStats.guessList[tries].isCorrect = false;
            todayStats.hasFinished = true
            todayStats.numberTries = NUMBER_TRIES + 1
            newStats[stats.length - 1] = todayStats;
        }
        setStats(newStats)
        inputRef.current!.value = "";
    }


    /**
     * Open/close Info modal.
     */
    const toggleInfo = () => {
        setIsInfoOpen(true);
    }

    /**
     * Open/close Score modal.
     */
    const toggleScore = () => {
        setIsScoreOpen(true);

    }

    /**
     * Open/close Tutorial modal.
     */
    const toggleHowToPlay = () => {
        setIsTutorialOpen(true);
    }

    /**
     * Skip button activation.
     */
    const toggleSkip = () => {
        updateGame("SKIPPED");
    }


    if (isNewGameOpen) {
        return (
            <div className="minigame-container">
                {isTutorialOpen && <ModalTutorial setIsOpen={setIsTutorialOpen} />}
                {isInfoOpen && <ModalInfo setIsOpen={setIsInfoOpen} />}
                {isScoreOpen && <ModalScore setIsOpen={setIsScoreOpen}
                    maxStreak={score.maxStreak}
                    currentStreak={score.currentStreak}
                    wins={score.wins}
                    winRate={score.winRate}
                    numberGames={score.numberGames}
                    numberTries={score.numberTries}
                />}
                <div className="menu-bar__container">
                    <ul className='menu-bar'>
                        <li><RiInformationLine className='icon' onClick={toggleInfo} aria-label='Open info window' /></li>
                        <li><RiBarChart2Fill className='icon' onClick={toggleScore} aria-label='Open score window' /></li>
                        <li><RiQuestionLine className='icon' onClick={toggleHowToPlay} aria-label='Open tutorial window' /></li>
                    </ul>
                </div>
                <ModalNewGame indexAnswer={currentImage.id - 1}
                    data={stats[stats.length - 1].guessList.map(guess => guess.answer)}
                    setIsNewGameOpen={setIsNewGameOpen}
                    reset={reset}
                    date={today} />
            </div>
        )
    }

    return (<>
        <div className="minigame-container">
            <span className='minigame-container__hidden-span' aria-hidden ><Timer setIsNewGameOpen={setIsNewGameOpen} reset={reset} date={today} /></span>
            {isTutorialOpen && <ModalTutorial setIsOpen={setIsTutorialOpen} />}
            {isInfoOpen && <ModalInfo setIsOpen={setIsInfoOpen} />}
            {isScoreOpen && <ModalScore setIsOpen={setIsScoreOpen}
                maxStreak={score.maxStreak}
                currentStreak={score.currentStreak}
                wins={score.wins}
                winRate={score.winRate}
                numberGames={score.numberGames}
                numberTries={score.numberTries}
            />}
            <div className="menu-bar__container">
                <ul className='menu-bar'>
                    <li><RiInformationLine className='icon' onClick={toggleInfo} /></li>
                    <li><RiBarChart2Fill className='icon' onClick={toggleScore} /></li>
                    <li><RiQuestionLine className='icon' onClick={toggleHowToPlay} /></li>
                </ul>
            </div>
            <Loading isLoading={isLoading}
                borderColor='rgb(243, 244, 245)' />
            <div className='modal-game'
                style={{
                    display: isLoading ? 'none' : 'flex'
                }}>
                <div className='game'>
                    <img className='image-box'
                        src={currentImage.image}
                        alt='image game '
                        id="image_game"
                        onLoad={() => setIsLoading(false)}
                    />
                </div>
                <div className='answers-box'>
                    <ul className='answers'>
                        {stats.length > 0 && stats[stats.length - 1].guessList.map((object, index) => {
                            return (
                                <li key={index}><div className={`answer_${index}`} key={index}>{object.answer}</div></li>
                            )
                        })}
                    </ul>
                </div>
                <div className='progress-bar'>
                    {[...Array(NUMBER_TRIES)].map((_, index) => {
                        index += 1;
                        return (
                            <div key={index}
                                className={index <= tries ? `progress-bar_${index}` : `progress-bar_${index} off `}
                                aria-label={`attempt number ${index}`}></div>
                        )
                    })}
                </div>
                <AutoComplete data={suggestions}
                    inputRef={inputRef}
                    updateGame={updateGame} />
                <div className='inputs-container'>
                    <div className='skip-button' onClick={toggleSkip} aria-label='Skip one time'>SKIP</div>
                    <div className="submit-button" onClick={() => { updateGame(inputRef.current?.value || "") }} aria-label='Submit the answer'>SUBMIT</div>

                </div>
            </div>
            <style>{`
                    body {
                        overflow: ${isTutorialOpen || isScoreOpen || isInfoOpen ? "hidden" : "auto"};
                    }

                    .minigame-container{
                        .modal-info {
                            display: ${isInfoOpen ? "block" : "none"};
                        }
                        .modal-score {
                            display: ${isScoreOpen ? "block" : "none"};
                        }
                        .modal-tutorial {
                            display: ${isTutorialOpen ? "block" : "none"};
                        }
                        .game {
                            .image-box{
                                filter : blur(${blur}rem)
                            }
                        }
                        
                        .answers-box{
                            .answers {
                                .answer_${tries} {
                                    border : 1px solid #888;
                                }
                                }
                            }
                        }
                    }      
            `}
            </style>
        </div>
    </>


    )
}