import { Dispatch, ReactNode, SetStateAction, createContext, useState } from "react";
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

    const navigate = useNavigate()

    const checkUserLogin = async () => {
        try {
            const response = await fetch('/user/auth')
            const data: AuthDataType = await response.json()
            setIsUserLoggedIn(data.isAuthenticated)

            if (data.isAuthenticated) {
                setUserData(data.user)
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
            const response = await fetch('/user/logout')
            const data = await response.json()

            if (response.status === 200) {
                setIsUserLoggedIn(null)
                closeSocketConnection(userData?.id)
                setUserData(null)
                navigate('/login')
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
            const response = await fetch(`/user/contact-request/${action}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contactEmail: contactEmail
                })
            })

            return await response.json()
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
            fetchContactRequest
        }}>
            {children}
        </Context.Provider>
    )
}

export default Context