import React, { ReactNode, createContext, useContext, useEffect, useRef, useState } from 'react'
import { TabType } from '../utils/types'
import { defaultTab } from '../utils/constants';
import { useNavigate } from 'react-router-dom';

interface TabContextType {
    tabs: TabType[];
    currentTab: string | null;
    addTab: (tab: TabType, active: boolean) => void;
    removeTab: (tabId: string) => void;
    setCurrentTab: (tabId: string) => void;
    goToHomeTab: () => void;
    clearTabs: () => void;
    navigateToTab: (tabId: string) => void;
    addNotification: (tabId: string) => void;
}

interface TabProviderProps {
    children: ReactNode;
}

const defaultState: TabContextType = {
    tabs: [],
    currentTab: null,
    addTab: () => {},
    removeTab: () => { },
    setCurrentTab: () => { },
    goToHomeTab: () => { },
    clearTabs: () => { },
    navigateToTab: () => { },
    addNotification: () => { }
}

const TabContext = createContext<TabContextType>(defaultState)

export const useTabs = () => useContext(TabContext)

export const TabProvider = ({ children }: TabProviderProps) => {
    const [tabs, setTabs] = useState<TabType[]>([defaultTab])
    const [currentTab, setCurrentTab] = useState<string | null>(defaultTab.id)

    const navigate = useNavigate()

    // Navigate to home on page refresh
    useEffect(() => {
        navigate(defaultTab.path)
    }, [])

    const addTab = (tab: TabType, active: boolean) => {
        setTabs(prevTabs => {

            if (!prevTabs.find(t => t.id === tab.id)) { // Prevent adding duplicate tabs
                const newTabs = [...prevTabs, tab]

                return newTabs
            } else {
                return prevTabs
            }
        })

        if (active) navigateToTab(tab.id)
    }

    const goToHomeTab = () => {
        navigate('/')
        setCurrentTab('/')
    }

    const navigateToTab = (tabId: string) => {
        setCurrentTab(tabId)
        navigate(tabId)

        const tab = tabs.find(t => t.id === tabId)
        if (tab?.hasNotification) {
            removeNotification(tabId)
        }
    }

    const removeTab = (tabId: string) => {
        setTabs(prevTabs => {
            const newTabs = prevTabs.filter(t => t.id !== tabId)

            return newTabs
        })
        if (currentTab === tabId) {
            goToHomeTab()
        }
    }

    const clearTabs = () => {
        setTabs([defaultTab])
        goToHomeTab()
    }

    const removeNotification = (tabId: string) => {
        setTabs(prevTabs => {
            const newTabs = prevTabs.map(t => {
                if (t.id === tabId) {
                    t.hasNotification = false
                }
                return t
            })

            return newTabs
        })
    }

    const addNotification = (tabId: string) => {
        setTabs(prevTabs => {
            const newTabs = prevTabs.map(t => {
                if (t.id === tabId) {
                    t.hasNotification = true
                }
                return t
            })

            return newTabs
        })
    }

    return (
        <TabContext.Provider value={{
            tabs,
            currentTab,
            addTab,
            removeTab,
            setCurrentTab,
            goToHomeTab,
            clearTabs,
            navigateToTab,
            addNotification
        }}>
            {children}
        </TabContext.Provider>
    )
}

export default TabContext