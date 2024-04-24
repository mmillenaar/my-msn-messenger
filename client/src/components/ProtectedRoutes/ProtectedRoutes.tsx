import React, { useContext, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import Context from "../../context/AppContext";
import { initializeSocketConnection } from "../../utils/websocket";
import { TabProvider } from "../../context/TabContext";
import TabNavigation from "../TabNavigation/TabNavigation";

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
    }, [isUserLoggedIn, userData, isSocketConnected, setIsSocketConnected])

    if (isUserLoggedIn === null) {
        return <div>Loading...</div>;
    }

    return isUserLoggedIn
        ? <>
            <Outlet />
            <TabNavigation />
        </>
        : <Navigate to='/login' />;
};

export default ProtectedRoutes;
