import { createContext } from "react";
import { AppContextProviderProps, AuthDataTypes, ContextTypes } from "../utils/types";


const Context = createContext<ContextTypes | null>(null)

export const AppContextProvider = ({ children }: AppContextProviderProps) => {
    const checkUserLogin = async() => {
        try {
            const res = await fetch('/api/auth/user-auth')
            const data: AuthDataTypes = await res.json()

            return data.isAuthenticated
        }
        catch (err) {
            console.error(err)

            return false
        }
    }

    return (
        <Context.Provider value={{
            checkUserLogin
        }}>
            {children}
        </Context.Provider>
    )
}

export default Context