import React, { useContext, useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import Context from "../../Context/AppContext";

const ProtectedRoutes = () => {
    const [isUserLoggedIn, setIsUserLoggedIn] = useState<boolean | null>(null);
    const { checkUserLogin } = useContext(Context)!;

    useEffect(() => {
        const verifyUser = async () => {
            const isLoggedIn = await checkUserLogin();
            setIsUserLoggedIn(isLoggedIn);
        };

        verifyUser();
    }, [checkUserLogin]);

    if (isUserLoggedIn === null) {

        return <div>Loading...</div>;
    }

    return isUserLoggedIn ? <Outlet /> : <Navigate to='/login' />;
};

export default ProtectedRoutes;
