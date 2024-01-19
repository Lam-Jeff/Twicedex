import { BsFillCircleFill } from 'react-icons/bs'

export interface ICheckBoxProps {
    /**
     * Type of checkbox. Either members or others.
     */
    type: string

    /**
     * Object representing a value and whether the object is selected or not.
     */
    object: { name: string, checked: boolean }

    /**
     * Boolean to tell if a value has to be disabled or not.
     */
    displayValue?: boolean

    /**
     * Index of the object
     */
    index: number,

    /**
     * A method to update the object.
     */
    update: (value: number) => void;
}

export const Checkbox: React.FunctionComponent<ICheckBoxProps> = ({ type, object, index, displayValue, update }) => {
    if (type === "members") {
        return (<>
            <div>
                <label key={`label_${index}`}
                    className={`label_member_${object.name}`}
                    htmlFor={`choice_${object.name}`}>
                    <input type="checkbox"
                        key={`checkbox_${index}`}
                        value={object.name}
                        checked={object.checked}
                        onChange={() => update(index)}
                        disabled={!displayValue}
                        id={`choice_${object.name}`}
                        aria-label={`Select member ${object.name}`}
                    />
                    <BsFillCircleFill className={`circle_${object.name}`} />{object.name}
                </label>
            </div>
        </>)
    }
    else {
        return (<>

            <div>
                <label key={`label_${index}`}
                    className={`label_${object.name}`}
                    htmlFor={`choice_${object.name}`}>
                    <input type="checkbox"
                        key={`checkbox_${index}`}
                        value={object.name}
                        checked={object.checked}
                        onChange={() => update(index)}
                        disabled={!displayValue}
                        id={`choice_${object.name}`}
                        aria-label={`Select benefit ${object.name}`}
                    />
                    {object.name}
                </label>
            </div>
        </>)

    }

}
