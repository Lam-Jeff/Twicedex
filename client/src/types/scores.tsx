import { ReadOnlyProps } from "./readOnly"
type ScoreProps = {
    maxStreak: number;
    currentStreak: number;
    wins: number;
    winRate: number;
    numberGames: number;
    numberTries: number[]
}

export type TScoreProps = ReadOnlyProps<ScoreProps>
