import React, { useContext, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import Context from "../../Context/AppContext";
import { initializeSocketConnection } from "../../utils/websocket";

const ProtectedRoutes = () => {
    const { isUserLoggedIn, userData, checkUserLogin } = useContext(Context)

    useEffect(() => {
        if (isUserLoggedIn === null) {
            checkUserLogin();
        }
    }, [isUserLoggedIn, checkUserLogin]);

    useEffect(() => {
        if (isUserLoggedIn && userData) {
            initializeSocketConnection(userData.id)
        }
    }, [isUserLoggedIn, userData])

    if (isUserLoggedIn === null) {
        return <div>Loading...</div>;
    }

    return isUserLoggedIn ? <Outlet /> : <Navigate to='/login' />;
};

export default ProtectedRoutes;
