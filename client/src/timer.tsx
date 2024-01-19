import { useEffect, useState } from "react"

interface TimerProps {

    /**
     * Open/close modal.
     */
    setIsNewGameOpen: (value: boolean) => void;

    /**
     * Reset the game.
     */
    reset: () => void;

    /**
     * Date.
     */
    date: Date
}

export const Timer = ({ setIsNewGameOpen, reset, date }: TimerProps) => {
    /**
     * Get tomorrow's date according to current date.
     * 
     * @returns {Date}
     */
    const getTomorrowsDay = (): Date => {
        let tomorrow = date
        tomorrow.setDate(tomorrow.getDate() + 1)
        tomorrow.setHours(0, 0, 0, 0)
        return tomorrow;
    }

    const tomorrow = getTomorrowsDay()
    const [day, setDay] = useState(() => {
        const time = tomorrow.getTime() - Date.now()
        const hours = Math.floor((time / (1000 * 60 * 60)) % 24)
        const minutes = Math.floor((time / 1000 / 60) % 60)
        const seconds = Math.floor((time / 1000) % 60)
        return {
            hours: hours.toString().length < 2 ? '0' + hours.toString() : hours.toString(),
            minutes: minutes.toString().length < 2 ? '0' + minutes.toString() : minutes.toString(),
            seconds: seconds.toString().length < 2 ? '0' + seconds.toString() : seconds.toString()
        }
    })


    useEffect(() => {
        if (day.hours === '00' && day.minutes === '00' && day.seconds === '00') { reset(); setIsNewGameOpen(false);}
    }, [day])

    useEffect(() => {
        const interval = setInterval(() => getTimeRemaining(), 1000);

        return () => clearInterval(interval);
    }, []);


    /**
     * Get remaining time before auto reset.
     */
    const getTimeRemaining = () => {
        const time = tomorrow.getTime() - Date.now();
        const hours = Math.floor((time / (1000 * 60 * 60)) % 24)
        const minutes = Math.floor((time / 1000 / 60) % 60)
        const seconds = Math.floor((time / 1000) % 60)
        setDay({
            hours: hours.toString().length < 2 ? '0' + hours.toString() : hours.toString(),
            minutes: minutes.toString().length < 2 ? '0' + minutes.toString() : minutes.toString(),
            seconds: seconds.toString().length < 2 ? '0' + seconds.toString() : seconds.toString()
        })
    };

    return (
        <div className="timer-container">
            <div>
                {day.hours}:
            </div>
            <div>
                {day.minutes}:
            </div>
            <div>
                {day.seconds}
            </div>

        </div>
    )
}