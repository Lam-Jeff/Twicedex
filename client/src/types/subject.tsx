import { ReadOnlyProps } from "./readOnly"
type SubjectProps = 'All' | 'Game' | 'Collection'

export type TSubjectProps = ReadOnlyProps<SubjectProps>