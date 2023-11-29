import React, { useContext, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import Context from "../../Context/AppContext";

const ProtectedRoutes = () => {
    const { isUserLoggedIn, checkUserLogin } = useContext(Context)!;

    useEffect(() => {
        if (isUserLoggedIn === null) {
            checkUserLogin();
        }
    }, [isUserLoggedIn, checkUserLogin]);

    if (isUserLoggedIn === null) {
        return <div>Loading...</div>;
    }

    return isUserLoggedIn ? <Outlet /> : <Navigate to='/login' />;
};

export default ProtectedRoutes;
