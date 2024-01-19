import { ReadOnlyProps } from "./readOnly"

type NewsProps = {
    id: number;
    subject: string;
    title: string;
    date: string;
    thumbnail: string;
    alt: string;
    era: string;
    category: string;
}

export type TNewsProps = ReadOnlyProps<NewsProps>;
