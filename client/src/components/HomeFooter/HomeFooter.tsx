import { useState } from 'react'
import { ReactComponent as ChevronRightIcon } from '../../assets/icons/double-chevron-right.svg'
import plusIconImg from '../../assets/icons/plus-icon.png'
import startChatImg from '../../assets/icons/start-chat.png'
import logoutIcon from '../../assets/icons/logout.png'
import ActionLink from '../ActionLink/ActionLink'
import { addContactTab, newConversationTab } from '../../utils/constants'
import { TabType } from '../../utils/types'
import './HomeFooter.scss'

interface HomeFooterProps {
    handleActionLinkClick: (tab: TabType) => void;
    handleLogout: () => void;
}

const HomeFooter = ({ handleActionLinkClick, handleLogout }: HomeFooterProps) => {
    const [isTitleBarOpen, setIsTitleBarOpen] = useState<boolean>(true)

    const handleTitleBarClick = () => {
        setIsTitleBarOpen(prevState => !prevState)
    }

    return (
        <div className="home-footer">
            <div className="home-footer__wrapper">
                <div className="home-footer__title-bar" onClick={handleTitleBarClick}>
                    <div
                        className={`home-footer__title-bar-icon home-footer__title-bar-icon${isTitleBarOpen ? '--open' : ''}`}
                    >
                        <ChevronRightIcon />
                    </div>
                    <p className="home-footer__title-bar-text">I want to...</p>
                </div>
                {isTitleBarOpen &&
                    <div className="home-footer__content">
                        <ActionLink
                            text='Add a Contact'
                            imgSource={plusIconImg}
                            handleClick={() => handleActionLinkClick(addContactTab)}
                        />
                        <ActionLink
                            text='Send an Instant Message'
                            imgSource={startChatImg}
                            handleClick={() => handleActionLinkClick(newConversationTab)}
                        />
                        <ActionLink
                            text='Logout'
                            imgSource={logoutIcon}
                            handleClick={handleLogout}
                        />
                    </div>
                }
            </div>
        </div>
    )
}

export default HomeFooter