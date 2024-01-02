import { ReactNode, createContext, useState } from "react";
import { useNavigate } from "react-router-dom";

interface MessageTypes {
    text: string;
    sender: string;
    recipient: string;
    timestamp: string;
}

interface ConversationTypes {
    participants: string[];
    messages: MessageTypes[];
}

interface UserTypes {
    username: string;
    email: string;
    conversations: ConversationTypes[];
}

interface AuthDataTypes {
    isAuthenticated: boolean
    user: UserTypes
}

interface ContextTypes {
    checkUserLogin: () => Promise<boolean | null>;
    isUserLoggedIn: boolean | null;
    setIsUserLoggedIn: (value: boolean | null) => void;
    logout: () => void;
    userData: UserTypes | null;
}

interface AppContextProviderProps {
    children: ReactNode
}

const Context = createContext<ContextTypes | null>(null)

export const AppContextProvider = ({ children }: AppContextProviderProps) => {
    const [isUserLoggedIn, setIsUserLoggedIn] = useState<boolean | null>(null)
    const [userData, setUserData] = useState<UserTypes | null>(null)

    const navigate = useNavigate()

    const checkUserLogin = async () => {
        try {
            const res = await fetch('/api/auth/user-auth')
            const data: AuthDataTypes = await res.json()
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
            const response = await fetch('/logout')
            const data = await response.json()

            if (response.status === 200) {
                setIsUserLoggedIn(null)
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
            userData
        }}>
            {children}
        </Context.Provider>
    )
}

export default Context