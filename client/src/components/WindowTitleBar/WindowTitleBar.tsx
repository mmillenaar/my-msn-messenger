import { useTabs } from '../../context/TabContext';
import './WindowTitleBar.scss'

interface WindowTitleBarProps {
    title: string;
    icon?: string;
    hasControls?: boolean;
    onClose?: () => void;
}

const WindowTitleBar = ({ title, icon, hasControls, onClose }: WindowTitleBarProps) => {
    const {goToHomeTab} = useTabs()

    return (
        <div className="window-title-bar">
            <div className="window-title-bar__wrapper title-bar">
                <div className="title-bar__text title-bar-text">
                    <img className="title-bar__img" src={icon} alt="MSN logo" />
                    <h1 className="title-bar__text">{title}</h1>
                </div>
                {hasControls &&
                    <div className="title-bar__controls title-bar-controls">
                        <button aria-label="Minimize" onClick={goToHomeTab}></button>
                        <button aria-label="Close" onClick={onClose}></button>
                    </div>
                }
            </div>
        </div>
    )
}

export default WindowTitleBar