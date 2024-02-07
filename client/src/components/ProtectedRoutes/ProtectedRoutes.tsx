import React, { useContext, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import Context from "../../Context/AppContext";
import { closeSocketConnection, initializeSocketConnection } from "../../utils/websocket";

const ProtectedRoutes = () => {
    const { isUserLoggedIn, userData, isSocketConnected, checkUserLogin, setIsSocketConnected } = useContext(Context)

    useEffect(() => {
        if (isUserLoggedIn === null) {
            checkUserLogin();
        }
    }, [isUserLoggedIn, checkUserLogin]);

    useEffect(() => {
        if (isUserLoggedIn && userData && !isSocketConnected) {
            initializeSocketConnection(userData.id)
            setIsSocketConnected(true)
        }

        return () => {
            if (userData && isSocketConnected) {
                console.log('disconnecting socket')
                setIsSocketConnected(false)
                closeSocketConnection(userData.id)
            }
        }
    }, [isUserLoggedIn, userData, isSocketConnected, setIsSocketConnected])

    if (isUserLoggedIn === null) {
        return <div>Loading...</div>;
    }

    return isUserLoggedIn ? <Outlet /> : <Navigate to='/login' />;
};

export default ProtectedRoutes;
