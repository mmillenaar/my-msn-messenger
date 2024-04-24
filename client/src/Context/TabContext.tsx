import React, { ReactNode, createContext, useContext, useState } from 'react'
import { TabType } from '../utils/types'
import { defaultTab } from '../utils/constants';
import { useNavigate } from 'react-router-dom';

interface TabContextType {
    tabs: TabType[];
    currentTab: string | null;
    addTab: (tab: TabType) => void;
    removeTab: (tabId: string) => void;
    setActiveTab: (tabId: string) => void;
    goToHomeTab: () => void;
}

interface TabProviderProps {
    children: ReactNode;
}

const defaultState: TabContextType = {
    tabs: [],
    currentTab: null,
    setActiveTab: () => {},
    addTab: () => {},
    removeTab: () => { },
    goToHomeTab: () => { }
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

    const setActiveTab = (tabId: string) => {
        setCurrentTab(tabId)
        localStorage.setItem('currentTab', tabId)
    }

    const setOpenedTabs = (tabs: TabType[]) => {
        setTabs(tabs)
        localStorage.setItem('openedTabs', JSON.stringify(tabs))
    }

    const addTab = (tab: TabType) => {
        if (!tabs.find(t => t.id === tab.id)) { // Prevent adding duplicate tabs
            setOpenedTabs([...tabs, tab])
            setActiveTab(tab.id)
        }
    }

    const goToHomeTab = () => {
        navigate('/')
        setActiveTab('/')
    }

    const removeTab = (tabId: string) => {
        setOpenedTabs(tabs.filter(t => t.id !== tabId))
        if (currentTab === tabId) {
            goToHomeTab()
        }
    }

    return (
        <TabContext.Provider value={{
            tabs,
            currentTab,
            addTab,
            removeTab,
            setActiveTab,
            goToHomeTab
        }}>
            {children}
        </TabContext.Provider>
    )
}

export default TabContext