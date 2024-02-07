import { Dispatch, ReactNode, SetStateAction, createContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { closeSocketConnection } from "../utils/websocket";
import { AuthDataType, UserType } from "../utils/types";


interface ContextTypes {
    checkUserLogin: () => Promise<boolean | null>;
    isUserLoggedIn: boolean | null;
    setIsUserLoggedIn: (value: boolean | null) => void;
    logout: () => void;
    userData: UserType | null;
    setUserData: Dispatch<SetStateAction<UserType | null>>;
    isSocketConnected: boolean;
    setIsSocketConnected: Dispatch<SetStateAction<boolean>>;
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
    isSocketConnected: false,
    setIsSocketConnected: () => {}
}

const Context = createContext<ContextTypes>(defaultContext)

export const AppContextProvider = ({ children }: AppContextProviderProps) => {
    const [isUserLoggedIn, setIsUserLoggedIn] = useState<boolean | null>(null)
    const [userData, setUserData] = useState<UserType | null>(null)
    const [isSocketConnected, setIsSocketConnected] = useState(false)

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


    return (
        <Context.Provider value={{
            checkUserLogin,
            isUserLoggedIn,
            setIsUserLoggedIn,
            logout,
            userData,
            setUserData,
            isSocketConnected,
            setIsSocketConnected
        }}>
            {children}
        </Context.Provider>
    )
}

export default Context