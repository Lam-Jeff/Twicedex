import { useEffect, useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"

import members from "./files/members.json"

export const Settings = () => {
    const [membersSettings, setMembersSettings] = useState(members.map(member => ({ 'name': member.name, 'checked': true })))
    const [selectAllMembers, setSelectAllMembers] = useState(true)
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const preferencesMembers = localStorage.getItem('preferences-members');
        if (preferencesMembers) {
            const members: { 'name': string, 'checked': boolean }[] = JSON.parse(preferencesMembers)
            if (members.find(member => !member.checked)) {
                setSelectAllMembers(false)
            } else {
                setSelectAllMembers(true)

            }
            setMembersSettings(members)
        }

    }, [])

    /**
     * Change members settings.
     * 
     * @param {number} index - Index of the member to udpate
     */
    const handleMembersSettings = (index: number) => {
        const newArray = membersSettings.map((object, currentIndex) => currentIndex === index ? { ...object, checked: !object.checked } : object)
        if (newArray.find(member => !member.checked)) {
            setSelectAllMembers(false)
        } else {
            setSelectAllMembers(true)

        }
        setMembersSettings(newArray)
    }

    /**
     * Select all members.
     */
    const handleSelectAllMembers = () => {
        if (!selectAllMembers) {
            const newArray = membersSettings.map((object) => ({ ...object, checked: true }))
            setMembersSettings(newArray)
        } else {
            const newArray = membersSettings.map((object) => ({ ...object, checked: false }))
            setMembersSettings(newArray)
        }
        setSelectAllMembers(prevState => !prevState)
    }

    /**
     * Save the settings and return to collection page.
     */
    const handleSaveSettings = () => {
        localStorage.setItem('preferences-members', JSON.stringify(membersSettings));
        navigate('../', { state: location.state });
    }

    return (
        <div className="settings-box">
            <h2>Settings</h2>
            <div className="settings-box__stats-box">
                <div className="settings-box__stats-box__members">
                    <h3>Members</h3>
                    <p> Select the members you are collecting :</p>
                    <ul>
                        <li>
                            <label htmlFor={`member-ot9`}
                                key={`label-member-ot9`}>
                                <div className="switch">
                                    <input type="checkbox"
                                        id={`member-ot9`}
                                        key={`input-member-ot9`}
                                        value='ot9'
                                        checked={selectAllMembers}
                                        onChange={handleSelectAllMembers}
                                        aria-label='Select all members' />
                                    <span></span>
                                </div>

                                OT9
                            </label>
                        </li>
                        {membersSettings.map((object, index) => {
                            return (<li key={`list-element-member-${object.name}`}>
                                <label htmlFor={`member-${object.name}`}
                                    key={`label-member-${object.name}`}>
                                    <div className="switch" key={`switch-${object.name}`}>
                                        <input type="checkbox"
                                            id={`member-${object.name}`}
                                            key={`input-member-${object.name}`}
                                            value={object.name}
                                            checked={object.checked}
                                            onChange={() => handleMembersSettings(index)}
                                            aria-label={`Select member ${object.name}`} />
                                        <span key={`span-${object.name}`}></span>
                                    </div>
                                    {object.name}
                                </label>
                            </li>)
                        })}
                    </ul>
                </div>
                <button onClick={handleSaveSettings} aria-label={`Save preferences and go back to collection page`}>
                    SAVE
                </button>
            </div>
        </div>
    )
}