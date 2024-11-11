import { TCriteriaProps } from "./criteria"

export type TAchievementProps = {
    /**
    * ID of the achievement.
    */
    id: number,

    /**
     * Name of the achievement.
     */
    name: string,

    /**
     * Description of the achievement.
     */
    description: string,

    /**
     * Type of the achievement.
     */
    group: string,

    /**
    * Criterias to validate the achievement.
    */
    criteria: TCriteriaProps,

    /**
     * Boolean: True if achievement succeed, otherwise false.
     */
    checked: boolean,

    /**
     * Icon.
     */
    icon: string

    icon_animated: string
}