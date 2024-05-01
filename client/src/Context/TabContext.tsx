import React, { ReactNode, createContext, useContext, useEffect, useState } from 'react'
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

    useEffect(() => {
        if (currentTab) {
            navigate(currentTab)
        }
    }, [currentTab, navigate])

    useEffect(() => {
        localStorage.setItem('openedTabs', JSON.stringify(tabs))
    }, [tabs])

    useEffect(() => {
        localStorage.setItem('currentTab', currentTab!)
    }, [currentTab])

    const addTab = (tab: TabType) => {
        if (!tabs.find(t => t.id === tab.id)) { // Prevent adding duplicate tabs
            setTabs(prevTabs => [...prevTabs, tab])
            setCurrentTab(tab.id)
        }
    }

    const goToHomeTab = () => {
        navigate('/')
        setCurrentTab('/')
    }

    const removeTab = (tabId: string) => {
        setTabs(prevTabs => prevTabs.filter(t => t.id !== tabId))
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
            setCurrentTab,
            goToHomeTab
        }}>
            {children}
        </TabContext.Provider>
    )
}

export default TabContext