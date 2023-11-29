import { createContext, useState } from "react";
import { AppContextProviderProps, AuthDataTypes, ContextTypes } from "../utils/types";


const Context = createContext<ContextTypes | null>(null)

export const AppContextProvider = ({ children }: AppContextProviderProps) => {
    const [isUserLoggedIn, setIsUserLoggedIn] = useState<boolean | null>(null)

    const checkUserLogin = async () => {
        try {
            const res = await fetch('/api/auth/user-auth')
            const data: AuthDataTypes = await res.json()
            setIsUserLoggedIn(data.isAuthenticated)

            return data.isAuthenticated
        }
        catch (err) {
            console.error(err)

            return null
        }
    }

    const logout = async () => {
        try {
            const response = await fetch('/logout');
            if (response.ok) {
                setIsUserLoggedIn(null);
                window.location.href = '/logout';
            } else {
                console.error('Logout failed');
            }
        } catch (error) {
            console.error('Error during logout', error);
        }
    };


    return (
        <Context.Provider value={{
            checkUserLogin,
            isUserLoggedIn,
            logout
        }}>
            {children}
        </Context.Provider>
    )
}

export default Context