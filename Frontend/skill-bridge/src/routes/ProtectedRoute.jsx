import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../API/axios";

export default function ProtectedRoute() {
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const location = useLocation();

    useEffect(() => {
        const checkAuthentication = async () => {
            try {
                await api.get("/authenticated");

                setIsAuthenticated(true);
            // eslint-disable-next-line no-unused-vars
            } catch (error) {
                setIsAuthenticated(false);
            }
        };

        checkAuthentication();
    }, []);

    if (isAuthenticated === null) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600" />
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <Navigate
                to="/login"
                replace
                state={{ from: location }}
            />
        );
    }

    return <Outlet />;
}