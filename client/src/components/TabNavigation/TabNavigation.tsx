import { useNavigate } from 'react-router-dom'
import { useTabs } from '../../context/TabContext'
import './TabNavigation.scss'

const TabNavigation = () => {
    const { tabs, currentTab, setActiveTab } = useTabs()

    const navigate = useNavigate()

    const handleClick = (url: string) => {
        setActiveTab(url)
        navigate(url)
    }

    return (
        <div className="tab-navigation title-bar">
            <div className="tab-navigation__wrapper">
                {tabs.map((tab) => {
                    const isActive = currentTab === tab.id

                    return (
                        <div
                            key={tab.id}
                            className={
                                `tab-navigation__tab ${isActive ? 'tab-navigation__tab--active' : ''}`
                            }
                            onClick={() => handleClick(tab.path)}
                        >
                            <img className='tab-navigation__tab-image' src={tab.icon} alt={tab.label} />
                            <p className="tab-navigation__tab-label">{tab.label}</p>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default TabNavigation