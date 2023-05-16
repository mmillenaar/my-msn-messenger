import { ReactNode } from "react";
import { Navigate, Routes } from "react-router-dom";

interface ProtectedRoutesProps {
    isLoggedIn: boolean | undefined;
    children: ReactNode;
}

const ProtectedRoutes = ({ isLoggedIn, children }: ProtectedRoutesProps) => {
    if (isLoggedIn) {
        console.log('Logged in, rendering protected routes.');

        return <Routes>{children}</Routes>;
    } else {
        console.log('Not logged in, redirecting to login page.');

        return <Navigate to='/login' />;
    }
}

export default ProtectedRoutes;