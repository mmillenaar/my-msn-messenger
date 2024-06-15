import { Dispatch, ReactNode, SetStateAction, createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthDataType, ContactRequestResponseType, UserType } from "../utils/types";
import { closeSocketConnection } from "../utils/websocket";
import { ContactRequestActions } from "../utils/constants";


interface ContextTypes {
    checkUserLogin: () => Promise<boolean | null>;
    isUserLoggedIn: boolean | null;
    setIsUserLoggedIn: (value: boolean | null) => void;
    logout: () => void;
    userData: UserType | null;
    setUserData: Dispatch<SetStateAction<UserType | null>>;
    isSocketConnected: boolean | null;
    setIsSocketConnected: Dispatch<SetStateAction<boolean | null>>;
    fetchContactRequest: (contactEmail: string, action: ContactRequestActions) => Promise<ContactRequestResponseType>;
}

interface AppContextProviderProps {
    children: ReactNode
}

const defaultContext: ContextTypes = {
    checkUserLogin: async () => null,
    isUserLoggedIn: null,
    setIsUserLoggedIn: () => {},
    logout: () => {},
    userData: null,
    setUserData: () => { },
    isSocketConnected: null,
    setIsSocketConnected: () => { },
    fetchContactRequest: async () => ({} as ContactRequestResponseType)
}

const Context = createContext<ContextTypes>(defaultContext)

export const AppContextProvider = ({ children }: AppContextProviderProps) => {
    const [isUserLoggedIn, setIsUserLoggedIn] = useState<boolean | null>(null)
    const [userData, setUserData] = useState<UserType | null>(null)
    const [isSocketConnected, setIsSocketConnected] = useState<boolean | null>(null)
    const [sessionExpiration, setSessionExpiration] = useState<number | null>(null)

    const navigate = useNavigate()

    useEffect(() => {
        let timeoutId: ReturnType<typeof setTimeout> | null = null

        if (sessionExpiration) {
            timeoutId = setTimeout(async () => {
                await logout()
                navigate('/')
            }, sessionExpiration)
        }

        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId)
            }
        }
    }, [sessionExpiration])

    const checkUserLogin = async () => {
        try {
            const response = await fetch(
                `${process.env.REACT_APP_BACKEND_URL}/user/auth`,
                {
                    credentials: 'include'
                }
            )
            const data: AuthDataType = await response.json()
            setIsUserLoggedIn(data.isAuthenticated)

            if (data.isAuthenticated && data.user) {
                setUserData(data.user)
                setSessionExpiration(data.sessionExpiration)
            } else {
                setUserData(null)
                setSessionExpiration(null)
            }

            return data.isAuthenticated
        }
        catch (err) {
            console.error(err)

            return null
        }
    }

    const logout = async () => {
        try {
            const response = await fetch(
                `${process.env.REACT_APP_BACKEND_URL}/user/logout`,
                {
                    credentials: 'include'
                }
            )
            const data = await response.json()

            if (response.status === 200) {
                setIsUserLoggedIn(null)
                closeSocketConnection(userData?.id)
                setUserData(null)
                setIsSocketConnected(null)

                // manage tabs
                localStorage.removeItem('openedTabs')
                localStorage.removeItem('currentTab')
            } else {
                console.error(data.message)
            }
        } catch (error) {
            console.error('Error during logout', error)

            return null
        }
    };

    const fetchContactRequest = async (contactEmail: string, action: ContactRequestActions) => {
        try {
            const response = await fetch(
                `${process.env.REACT_APP_BACKEND_URL}/user/contact-request/${action}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify({
                        contactEmail: contactEmail
                    })
                }
            )
            const data = await response.json()

            if (data.user) {
                setUserData(data.user)
            }

            return data
        }
        catch (err) {
            console.error(err)
        }
    }

    return (
        <Context.Provider value={{
            checkUserLogin,
            isUserLoggedIn,
            setIsUserLoggedIn,
            logout,
            userData,
            setUserData,
            isSocketConnected,
            setIsSocketConnected,
            fetchContactRequest,
        }}>
            {children}
        </Context.Provider>
    )
}

export default Context