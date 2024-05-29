import dotNetImage from '../../assets/icons/microsoft-net.svg'
import userIcon from '../../assets/icons/avatar-online.png'
import './NotificationPopup.scss'

interface NotificationPopupProps {
    username: string;
    message?: string;
}

const NotificationPopup = ({ username, message}: NotificationPopupProps) => {

    return (
        <div className="notification-popup">
            <div className="notification-popup__wrapper">
                <img src={userIcon} alt="" className="notification-popup__icon" />
                <div className="notification-popup__content">
                    <p className="notification-popup__content-title">
                        { username } { message ? 'says:' : '' }
                    </p>
                    <p className="notification-popup__content-text">
                        { message ? message : 'has just signed in.'}
                    </p>
                </div>
                <img src={dotNetImage} alt="" className="notification-popup__image" />
                <div className="notification-popup__border"/>
            </div>
        </div>
    )
}

export default NotificationPopup