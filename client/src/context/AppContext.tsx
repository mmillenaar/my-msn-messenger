import { Dispatch, ReactNode, SetStateAction, createContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthDataType, ContactRequestResponseType, ContactType, FormUserType, UserType } from "../utils/types";
import { closeSocketConnection } from "../utils/websocket";
import { ContactRequestActions, tokenExpiration } from "../utils/constants";
import { fetchWithAuth } from "../utils/utilityFunctions";


interface ContextTypes {
    userFormHandler: (action: string, method: string, user: FormUserType) => Promise<null | undefined>;
    checkUserLogin: () => Promise<boolean | null>;
    isUserLoggedIn: boolean | null;
    setIsUserLoggedIn: (value: boolean | null) => void;
    logout: () => void;
    userData: UserType | null;
    setUserData: Dispatch<SetStateAction<UserType | null>>;
    isSocketConnected: boolean | null;
    setIsSocketConnected: Dispatch<SetStateAction<boolean | null>>;
    fetchContactRequest: (contactEmail: string, action: ContactRequestActions) => Promise<ContactRequestResponseType>;
    isPageLoading: boolean;
    updateUsernameInDb: (newUsername: string) => Promise<void>;
    fetchContactSearch: (query: string) => Promise<ContactType[]>;
}

interface AppContextProviderProps {
    children: ReactNode
}

const defaultContext: ContextTypes = {
    userFormHandler: async () => null,
    checkUserLogin: async () => null,
    isUserLoggedIn: null,
    setIsUserLoggedIn: () => {},
    logout: () => {},
    userData: null,
    setUserData: () => { },
    isSocketConnected: null,
    setIsSocketConnected: () => { },
    fetchContactRequest: async () => ({} as ContactRequestResponseType),
    isPageLoading: true,
    updateUsernameInDb: async () => { },
    fetchContactSearch: async () => ({ } as ContactType[])
}

const Context = createContext<ContextTypes>(defaultContext)

export const AppContextProvider = ({ children }: AppContextProviderProps) => {
    const [isUserLoggedIn, setIsUserLoggedIn] = useState<boolean | null>(null)
    const [userData, setUserData] = useState<UserType | null>(null)
    const [isSocketConnected, setIsSocketConnected] = useState<boolean | null>(null)
    const [isPageLoading, setIsPageLoading] = useState<boolean>(true)
    const timeoutIdRef = useRef<number | null>(null)

    const navigate = useNavigate()

    // manage session persistence with setTimeout
    // TODO: change to jwt exp with refreshToken
    useEffect(() => {
        const setNewTimeout = () => {
            if (timeoutIdRef.current) {
                clearTimeout(timeoutIdRef.current)
            }
            const newTimeoutId = setTimeout(async () => {
                await logout()
                navigate('/')
            }, tokenExpiration) as unknown as number

            timeoutIdRef.current = newTimeoutId
        }

        if (isUserLoggedIn) {
            setNewTimeout()

            window.addEventListener('click', setNewTimeout)
            window.addEventListener('keydown', setNewTimeout)
        }

        return () => {
            if (timeoutIdRef.current) {
                clearTimeout(timeoutIdRef.current)
            }
            window.removeEventListener('click', setNewTimeout)
            window.removeEventListener('keydown', setNewTimeout)
        }
    }, [isUserLoggedIn])

    const userFormHandler = async (action: string, method: string, user: FormUserType) => {
        setIsPageLoading(true)
        try {
            const res = await fetch(
                `${process.env.REACT_APP_BACKEND_URL}/user/${action}`,
                {
                    method: method,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(user)
                }
            )
            const data = await res.json()

            if (res.status === 200) {
                setIsUserLoggedIn(true)
                setUserData(data.user)
                sessionStorage.setItem('token', data.token)
                navigate('/')
            }
            else {
                alert(data.message)

                return null
            }
        }
        catch (err) {
            console.error(err)

            return null
        }
        // No need to use a 'finally' statement with 'setIsPageLoaing(false)' because the 'checkUserLogin' function protecting the routes will do it
    }

    const checkUserLogin = async () => {
        setIsPageLoading(true)
        try {
            const response = await fetchWithAuth(`${process.env.REACT_APP_BACKEND_URL}/user/auth`)
            const data: AuthDataType = await response?.json()

            setIsUserLoggedIn(data.isAuthenticated)

            if (data.isAuthenticated && data.user) {
                setUserData(data.user)
            } else {
                setUserData(null)
            }

            return data.isAuthenticated
        }
        catch (err) {
            console.error(err)

            return null
        }
        finally {
            setIsPageLoading(false)
        }
    }

    const logout = async () => {
        setIsPageLoading(true)
        try {
            const response = await fetchWithAuth(`${process.env.REACT_APP_BACKEND_URL}/user/logout`)
            const data = await response?.json()

            if (response?.status === 200) {
                sessionStorage.removeItem('token')
                sessionStorage.removeItem('isServerLoaded')
                setIsUserLoggedIn(null)
                closeSocketConnection(userData?.id)
                setUserData(null)
                setIsSocketConnected(null)
            } else {
                console.error(data.message)
            }
        }
        catch (error) {
            console.error('Error during logout', error)

            return null
        }
        finally {
            setIsPageLoading(false)
        }
    };

    const fetchContactRequest = async (contactEmail: string, action: ContactRequestActions) => {
        setIsPageLoading(true)
        try {
            const response = await fetchWithAuth(
                `${process.env.REACT_APP_BACKEND_URL}/user/contact-request/${action}`,
                {
                    method: 'POST',
                    body: JSON.stringify({
                        contactEmail: contactEmail
                    })
                }
            )
            const data = await response?.json()

            if (data.user) {
                setUserData(data.user)
            }

            return data
        }
        catch (err) {
            console.error(err)
        }
        finally {
            setIsPageLoading(false)
        }
    }

    const updateUsernameInDb = async (newUsername: string) => {
        try {
            const response = await fetchWithAuth(
                `${process.env.REACT_APP_BACKEND_URL}/user/update/username`,
                {
                    method: 'PUT',
                    body: JSON.stringify({
                        newUsername: newUsername
                    })
                }
            )
            const data = await response.json()
            console.log(data)
        } catch (error) {
            console.error(error)
        }
    }

    const fetchContactSearch = async (searchTerm: string) => {
        try {
            const result = await fetchWithAuth(
                `${process.env.REACT_APP_BACKEND_URL}/user//search-contact`,
                {
                    method: 'POST',
                    body: JSON.stringify({ searchTerm: searchTerm })
                }
            )
            const data = await result.json()

            return data
        }
        catch (err) {
            console.error(err)
        }
    }

    return (
        <Context.Provider value={{
            userFormHandler,
            checkUserLogin,
            isUserLoggedIn,
            setIsUserLoggedIn,
            logout,
            userData,
            setUserData,
            isSocketConnected,
            setIsSocketConnected,
            fetchContactRequest,
            isPageLoading,
            updateUsernameInDb,
            fetchContactSearch
        }}>
            {children}
        </Context.Provider>
    )
}

export default Context