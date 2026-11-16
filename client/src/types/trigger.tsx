import { ReadOnlyProps } from "./readOnly"

type TriggerProps = {
    rule: string,
    target?: string[],
    match: number 
}

export type TTriggerProps = ReadOnlyProps<TriggerProps>;