import { useRef } from 'react'
import { useTabs } from '../../context/TabContext'
import './TabNavigation.scss'

const TabNavigation = () => {
    const { tabs, currentTab, navigateToTab } = useTabs()
    const activeTabRef = useRef<HTMLDivElement>(null)

    const handleClick = (url: string) => {
        navigateToTab(url)
    }

    const scrollToTab = () => {
        if (activeTabRef.current) {
            activeTabRef.current.scrollIntoView({ behavior: 'smooth'})
        }
    }

    return (
        <div className="tab-navigation title-bar">
            <div className="tab-navigation__wrapper">
                {tabs.map((tab) => {
                    const isActive = currentTab === tab.id
                    if (isActive) scrollToTab()

                    return (
                        <div
                            key={tab.id}
                            ref={isActive ? activeTabRef : null}
                            className={
                                `tab-navigation__tab ${
                                    tab.hasNotification ? 'tab-navigation__tab--notification' :
                                    isActive ? 'tab-navigation__tab--active' : ''}`
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