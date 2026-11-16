import React, { useState, useRef, useEffect } from 'react';

export interface IData {
    /**
     * Element that will be displayed in the search bar.
     */
    name: string;

    /**
     * Code for an element.
     */
    code: string;
}

export interface IAutoCompleteProps {

    /**
     * An array of IData.
     */
    data: IData[];

    /**
     * A Reference to the input element.
     */
    inputRef: React.RefObject<HTMLInputElement>;

    /**
     * A method that update the game when the user confirm the input.
     */
    updateGame: (answer: string) => void;
}


export const AutoComplete = ({ data, inputRef, updateGame }: IAutoCompleteProps) => {
    const [search, setSearch] = useState<IData[]>([]);
    const [isComponentVisible, setIsComponentVisible] = useState(false);
    const wrapperRef = useRef<HTMLUListElement>(null);
    const [searchIndex, setSearchIndex] = useState(0);

    useEffect(() => {
        document.addEventListener("click", handleClickOutside, false);
        return () => {
            document.removeEventListener("click", handleClickOutside, false);
        };
    }, []);


    /**
     * Display the suggestions according to the input.
     * 
     * @param {React.ChangeEvent<HTMLInputElement>} e - event representing the user's input
     */
    const onTextChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;

        inputRef.current!.value = value;
        let suggestions: IData[] = [];

        if (value.length > 0) {
            const regex = new RegExp(`^${value}`, "i");
            suggestions = data.sort().filter((v: IData) => regex.test(v.name));
        } else {
            setSearchIndex(0);
        }
        setIsComponentVisible(true);
        setSearch(suggestions);
    };


    /**
     * Handle keyboard inputs.
     * 
     * @param {React.KeyboardEvent<HTMLInputElement>} e - event representing the user's keyboard input
     */
    const handleEnterKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            if (search.length > 0 && searchIndex > 0) {
                suggestionSelected(search[searchIndex - 1]);
            } else {
                updateGame(inputRef.current?.value || "");
            }
            setIsComponentVisible(false);
            setSearchIndex(0)
        }
        else if (e.key === "ArrowDown") {
            e.preventDefault();
            setSearchIndex(prevState => prevState + 1 <= search.length ? prevState + 1 : prevState)
        }
        else if (e.key === "ArrowUp") {
            e.preventDefault();
            setSearchIndex(prevState => prevState - 1 > 0 ? prevState - 1 : 1)
        }
    }


    /**
     * Handle click on the screen.
     * 
     * @param {MouseEvent} e - event representing the user's click
     */
    const handleClickOutside = (e: MouseEvent) => {
        if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
            setIsComponentVisible(false);
        }
    };

    /**
     * Select an element in the suggestion box.
     * 
     * @param {IData} value - the value selected
     */
    const suggestionSelected = (value: IData) => {
        setIsComponentVisible(false);
        inputRef.current!.value = value.name;
        setSearch([]);

    };

    return (
        <>
            <div className='answerBox__container'>
                <input type="text"
                    ref={inputRef}
                    autoComplete='off'
                    onKeyDown={(e) => { handleEnterKey(e) }}
                    onChange={onTextChanged}
                    tabIndex={0}
                />
                {search.length > 0 && isComponentVisible && (

                    <ul className='autoComplete__container'
                        ref={wrapperRef}
                        onMouseOver={() => setSearchIndex(0)}>
                        {search.map((item: IData, index) => (
                            <li key={item.code} className={searchIndex - 1 === index ? `autoComplete__item_${index} selected` : `autoComplete__item_${index}`}>
                                <button
                                    key={item.code}
                                    onClick={() => suggestionSelected(item)}
                                    className='autoComplete__item__button'>
                                    {item.name}
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

        </>

    )
}
