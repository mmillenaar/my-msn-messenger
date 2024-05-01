import { useLocation, useParams } from 'react-router-dom';
import { useTabs } from '../../context/TabContext';
import './WindowTitleBar.scss'

interface WindowTitleBarProps {
    title: string;
    icon?: string;
    hasControls?: boolean;
}

const WindowTitleBar = ({ title, icon, hasControls }: WindowTitleBarProps) => {
    const { goToHomeTab, removeTab } = useTabs()

    const url = useLocation().pathname

    const onClose = () => {
        removeTab(url)
    }

    return (
        <div className="window-title-bar">
            <div className="window-title-bar__wrapper title-bar">
                <div className="title-bar__text title-bar-text">
                    {icon && <img className="title-bar__img" src={icon} alt='' />}
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