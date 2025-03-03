import { useContext, useState, useEffect } from "react";
import { AuthContext } from "./authProvider";
import { useNavigate } from "react-router-dom";
import { computeProgressionPercentByEra, computeProgressionPercentByCategory, checkAchievement } from "./helpers";
import albums from './files/albums.json';
import achievements from './files/achievements.json';
import cardsFile from './files/cards.json';
import categories from './files/categories.json';
import { TAchievementProps } from './types/achievement';
import { Achievement } from "./achievement";

export const Profile = () => {
    const navigate = useNavigate();
    const { signOut, cardsData, removeUser } = useContext(AuthContext);
    const [achievement, setAchievement] = useState<TAchievementProps | null>(null);
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const cardsList: number[] = cardsData ? cardsData : [];
    const progressionByEra = computeProgressionPercentByEra(cardsList, cardsFile);
    const progressionByCategory = computeProgressionPercentByCategory(cardsList, cardsFile);
    const achievementsList: number[] = [];
    achievements.map(achievement => {
        let result = checkAchievement(achievement, [], cardsFile, cardsList, progressionByEra, progressionByCategory);
        if (result) achievementsList.push(achievement.id);
    });

    useEffect(() => {
        const timeout = setInterval(() => {
            setIsVisible(true);
        }, 500)

        return () => { clearInterval(timeout) }
    }, [achievement]);

    /**
     * Handle log out.
     */
    const handleLogOut = () => {
        signOut();
    }

    /**
     * Handle settings button. Go to settings page.
     */
    const handleSettings = () => {
        navigate("/profile/settings");
    }

    /**
     * Handle delete account. Delete user account from database.
     */
    const handleDelete = () => {
        if (window.confirm('Are you sure you want to DELETE your account ? All your progress will be lost.'))
            removeUser();
    }

    /**
     * Handle click on achievement. set description of the achievement in state.
     * 
     * @param {number} index - Id of the achievement
     */
    const handleClickOnAchievement = (index: number) => {
        setAchievement(achievements[index])
        if (achievement?.id != achievements[index].id) setIsVisible(false);
    }

    return (
        <div className="profile-container">
            <div className="profile-container__buttons-container">
                <button className="profile-container__buttons-container__logout"
                    onClick={handleLogOut}
                    aria-label='Log Out button'>
                    <span className="logout-span">Log Out</span>
                </button>
                <button className="profile-container__buttons-container__delete"
                    onClick={handleDelete}
                    aria-label='Delete button'>
                    <span className="delete-span">Delete</span>
                </button>
                <button className="profile-container__buttons-container__settings"
                    onClick={handleSettings}
                    aria-label='Settings button'>
                    <span className="delete-span">Settings</span>
                </button>
            </div>
            <div className="profile-container__details">
                <div className="profile-container__details__categories">
                    <ul className="profile-container__details__categories__list">
                        {
                            categories.map((category) => {
                                return (
                                    <li className="profile-container__details__categories__list__item"
                                        key={`category_progression_${category.code}`}>
                                        <span className="profile-container__details__categories__list__item__name"
                                            key={`category_progression_name_${category.code}`}>
                                            {category.name}:
                                        </span>
                                        <span className="profile-container__details__categories__list__item__stats"
                                            key={`category_progression_stats_${category.code}`}>
                                            {`${progressionByCategory[category.name].acquired}/${progressionByCategory[category.name].total}`}
                                        </span>
                                        <div className={`profile-container__details__categories__list__item__progressionbar-${progressionByCategory[category.name] ? progressionByCategory[category.name].percent : 0}`}
                                            key={`category_progression_progressionbar_${category.code}`}>
                                        </div>
                                    </li>
                                )
                            })
                        }
                    </ul>

                </div>
            </div>
            <div className="profile-container__achievements">
                <div className="profile-container__achievements__main">
                    {
                        achievements.map((object, index) => {
                            return (
                                <Achievement handleClickOnAchievement={handleClickOnAchievement}
                                    achievement={achievement}
                                    currentAchievement={object}
                                    currentIndex={index}
                                    userAchievementsList={achievementsList}
                                    key={`achievement-component-${object.name}`} />
                            )
                        })
                    }
                </div>
                <div className="profile-container__achievements__textbox">
                    {<>
                        <h3 className={
                            `${isVisible ? "visible" : "hidden"}`
                        }>{achievement?.name}</h3>
                        <p className={
                            `${isVisible ? "visible" : "hidden"}`
                        }>{achievement?.description}</p>
                    </>}
                </div>
            </div>
        </div >
    )
}