import WindowTitleBar from '../WindowTitleBar/WindowTitleBar'
import './WindowLayout.scss'

interface WindowLayoutProps {
    children: React.ReactNode
    title: string;
    titleIcon?: string;
    hasControls?: boolean;
}

const WindowLayout = ({ children, title, titleIcon, hasControls }: WindowLayoutProps) => {

    return (
        <div className="window-layout">
            <div className="window-layout__wrapper window">
                <div className="window-layout__title">
                    <WindowTitleBar
                        title={title}
                        icon={titleIcon}
                        hasControls={hasControls}
                    />
                </div>
                <div className="window-layout__content">
                    {children}
                </div>
            </div>
        </div>
    )
}

export default WindowLayout