import { Navigate, Outlet } from "react-router-dom";
import { useProfileData } from "../assets/hooks/useProfileData";

export default function AdminRoute() {
    const { data: profile, isPending, isError } = useProfileData();

    if (isPending) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-indigo-600" />
            </div>
        );
    }

    if (isError || profile?.role !== "ADMIN") {
        return <Navigate to={isError ? "/login" : "/dashboard"} replace />;
    }

    return <Outlet />;
}
