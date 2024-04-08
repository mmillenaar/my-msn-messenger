import { useState } from 'react'
import { ReactComponent as ChevronRightIcon } from '../../assets/icons/double-chevron-right.svg'
import plusIconImg from '../../assets/icons/plus-icon.png'
import startChatImg from '../../assets/icons/start-chat.png'
import ActionLink from '../ActionLink/ActionLink'
import './HomeFooter.scss'

const HomeFooter = () => {
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
                            url='' // TODO: fill url
                            imgSource={plusIconImg}
                        />
                        <ActionLink
                            text='Send an Instant Message'
                            url='' // TODO: fill url
                            imgSource={startChatImg}
                        />
                    </div>
                }
            </div>
        </div>
    )
}

export default HomeFooter