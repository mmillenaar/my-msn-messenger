import { ChangeEvent, useEffect, useRef, useState } from "react";
import arrowDown from '../../assets/icons/arrow-down.png'
import { ReactComponent as MicrosoftNetIcon } from '../../assets/icons/microsoft-net.svg'
import SelectionPopover from "../SelectionPopover/SelectionPopover";
import { userStatusItems } from "../../utils/constants";
import { changeUserStatus } from "../../utils/websocket";
import './StatusHeader.scss'

interface StatusHeaderProps {
    username?: string
    status?: string
    id?: string
}

const StatusHeader = ({username, status, id}: StatusHeaderProps) => {
    const [usernameInputValue, setUsernameInputValue] = useState<string | undefined>(username);
    const [isStatusPopoverOpen, setIsStatusPopoverOpen] = useState<boolean>(false)
    const inputRef = useRef<HTMLSpanElement>(null)
    const popoverRef = useRef<HTMLDivElement>(null)
    const statusImageRef = useRef<HTMLDivElement>(null)

    const handleInputBlur = (e: ChangeEvent<HTMLSpanElement>) => {
        setUsernameInputValue(e.currentTarget.textContent!);
        updateUsernameInDb(e.currentTarget.textContent!);
    }

    const updateUsernameInDb = async (newUsername: string) => {
        try {
            const response = await fetch(
                `${process.env.REACT_APP_BACKEND_URL}/user/update/username`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include',
                    body: JSON.stringify({ newUsername: newUsername })
                }
            );
            const data = await response.json();
            console.log(data);
        } catch (error) {
            console.error(error);
        }
    }

    const handlePopoverItemClick = (status: string) => {
        if (id) {
            changeUserStatus(id, status)
            setIsStatusPopoverOpen(false)
        }
    }

    const handleStatusImageClick = () => {
        setIsStatusPopoverOpen(prevState => !prevState)
    }

    const findStatusImage = () => {
        const statusImage = userStatusItems.find(item => item.text === status)
        return statusImage?.icon
    }

    // Close the status selection popover when clicking outside of it or the status image itself
    useEffect(() => {
        const handleStatusImageClickOutside = (e: MouseEvent) => {
            if (popoverRef.current && !popoverRef.current.contains(e.target as Node)
                && statusImageRef.current && !statusImageRef.current.contains(e.target as Node)) {
                setIsStatusPopoverOpen(false)
            }
        }

        if (isStatusPopoverOpen) {
            document.addEventListener('click', handleStatusImageClickOutside)
        }

        return () => {
            document.removeEventListener('click', handleStatusImageClickOutside)
        }
    }, [isStatusPopoverOpen])


    return (
        <div className="status-header">
            <div className="status-header__wrapper">
                <div className="status-header__status-image status-image" onClick={handleStatusImageClick} ref={statusImageRef}>
                    <img src={findStatusImage()} alt="MSN avatar" className="status-image__image" />
                    <img src={arrowDown} alt="Arrow down" className="status-image__arrow-down-icon" />
                </div>
                <div className="status-header__status-selection-popover" ref={popoverRef}>
                    { isStatusPopoverOpen &&
                        <SelectionPopover
                            items={userStatusItems}
                            onItemClick={handlePopoverItemClick}
                        />
                    }
                </div>
                <div className="status-header__user-status user-status">
                    <div className="user-status__controls">
                        <p className="user-status__text">My Status:</p>
                        <span
                            className="user-status__username-input"
                            ref={inputRef}
                            role="textbox"
                            contentEditable={true}
                            onBlur={handleInputBlur}
                            // React warns about modifying the DOM directly, but we are catching the changes properly here
                            suppressContentEditableWarning={true}
                        >
                            {usernameInputValue}
                        </span>
                        <span className="user-status__status">
                            {`(${status})`}
                        </span>
                    </div>
                    <div className="user-status__microsoft-icon">
                        <MicrosoftNetIcon />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default StatusHeader;