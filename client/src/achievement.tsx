import { useState } from "react"
import { TAchievementProps } from "./types/achievement"
import { Loading } from "./loading"

interface IAchievementProps {
    handleClickOnAchievement: (value: number) => void,
    achievement: TAchievementProps | null,
    currentAchievement: TAchievementProps,
    currentIndex: number
    userAchievementsList: number[]
}
export const Achievement = ({ handleClickOnAchievement, achievement, currentAchievement, currentIndex, userAchievementsList }: IAchievementProps) => {
    const [isLoading, setIsLoading] = useState(true);
    return (  
            <div onClick={() => handleClickOnAchievement(currentIndex)}
                className={`profile-container__achievements__main__item ${achievement?.id == currentAchievement.id ? "selected" : ""}`}
                key={`achievement-container-${currentIndex}`}
                role='button'
                aria-label={`Button for achievement ${currentAchievement.name}`}>
                <Loading isLoading={isLoading}
                    borderColor='white' 
                    keyIndex={currentIndex}/>
                {userAchievementsList.includes(currentAchievement.id) ? <img src={currentAchievement.icon_animated}
                    alt="plant-achievement-animated"
                    className="profile-container__achievements__main__item__icon-animated"
                    key={`achievement_icon-animated_${currentIndex}`}
                    onLoad={() => setIsLoading(false)}
                    style={{
                        display: isLoading ? 'none' : 'inline'
                    }} />
                    :
                    <img src={currentAchievement.icon}
                        alt="plant-achievement"
                        className="profile-container__achievements__main__item__icon"
                        key={`achievement_icon_${currentIndex}`}
                        onLoad={() => setIsLoading(false)}
                        style={{
                            display: isLoading ? 'none' : 'inline'
                        }} />}
            </div>     
    )
}