export type TAlbumsProps = {
    /**
     * Name of the album.
     */
    name: string;

    /**
     * boolean to check wether the album is selected or not.
     */
    checked: boolean;

    /**
     * Category array of the album.
     */
    categories: string[];

    /**
     * Member array of the album.
     */
    members: string[];

    /**
     * Benefit array of the album.
     */
    benefits: string[];

    /**
     * boolean to check wether the album is displayed or not.
     */
    display: boolean;

    /**
     * Code of the album.
     */
    code: string;

    /**
     * Release date of the album.
     */
    release: string;

    /**
     * Image of the album.
     */
    image: string;
}