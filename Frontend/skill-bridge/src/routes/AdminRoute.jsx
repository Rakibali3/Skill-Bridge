import  { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import api from "../API/axios";

export default function AdminRoute() {
    const [status, setStatus] = useState("checking");

    useEffect(() => {
        let mounted = true;

        const checkAdmin = async () => {
            try {
                const { data } = await api.get("/profile");

                if (!mounted) return;

                if (data?.role === "ADMIN") {
                    setStatus("allowed");
                } else {
                    setStatus("denied");
                }
            } catch (error) {
                if (!mounted) return;
                setStatus("denied");
            }
        };

        checkAdmin();

        return () => {
            mounted = false;
        };
    }, []);

    if (status === "checking") {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-indigo-600" />
            </div>
        );
    }

    if (status === "denied") {
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
}