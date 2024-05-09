import React, { ReactNode, createContext, useContext, useState } from 'react'
import { TabType } from '../utils/types'
import { defaultTab } from '../utils/constants';
import { useNavigate } from 'react-router-dom';

interface TabContextType {
    tabs: TabType[];
    currentTab: string | null;
    addTab: (tab: TabType) => void;
    removeTab: (tabId: string) => void;
    setCurrentTab: (tabId: string) => void;
    goToHomeTab: () => void;
    clearTabs: () => void;
    navigateToTab: (tabId: string) => void;
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
    navigateToTab: () => { }
}

const TabContext = createContext<TabContextType>(defaultState)

export const useTabs = () => useContext(TabContext)

export const TabProvider = ({ children }: TabProviderProps) => {
    const [tabs, setTabs] = useState<TabType[]>(
        JSON.parse(localStorage.getItem('openedTabs')!) || [defaultTab]
    )
    const [currentTab, setCurrentTab] = useState<string | null>(
        localStorage.getItem('currentTab') || defaultTab.id
    )

    const navigate = useNavigate()

    const addTab = (tab: TabType) => {
        setTabs(prevTabs => {
            if (!prevTabs.find(t => t.id === tab.id)) { // Prevent adding duplicate tabs
                const newTabs = [...prevTabs, tab]
                localStorage.setItem('openedTabs', JSON.stringify(newTabs))
                navigateToTab(tab.id)

                return newTabs
            }
            return prevTabs
        })
    }

    const goToHomeTab = () => {
        navigate('/')
        setCurrentTab('/')
    }

    const navigateToTab = (tabId: string) => {
        setCurrentTab(tabId)
        localStorage.setItem('currentTab', tabId)
        navigate(tabId)
    }

    const removeTab = (tabId: string) => {
        setTabs(prevTabs => prevTabs.filter(t => t.id !== tabId))
        localStorage.setItem('openedTabs', JSON.stringify(tabs.filter(t => t.id !== tabId)))
        if (currentTab === tabId) {
            goToHomeTab()
        }
    }

    const clearTabs = () => {
        setTabs([])
        goToHomeTab()
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
            navigateToTab
        }}>
            {children}
        </TabContext.Provider>
    )
}

export default TabContext