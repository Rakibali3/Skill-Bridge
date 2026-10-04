import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useProfileData } from "../assets/hooks/useProfileData";

export default function ProtectedRoute() {
    const location = useLocation();
    const {
        isPending,
        isError,
        error,
        refetch,
        isFetching,
    } = useProfileData();

    // Show loading while checking authentication
    if (isPending) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600" />
                <p className="text-sm text-slate-600">
                    Checking authentication...
                </p>
            </div>
        );
    }

    // Missing or expired JWT: redirect to login
    if (isError && error?.response?.status === 401) {
        return (
            <Navigate
                to="/login"
                replace
                state={{ from: location }}
            />
        );
    }

    // Network, timeout, or server errors: show recovery options
    if (isError) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50 px-4 text-center">
                <h2 className="text-xl font-semibold text-slate-900">
                    Unable to verify your session
                </h2>

                <p className="max-w-md text-sm text-slate-600">
                    The server may be starting up or temporarily unavailable.
                    Please try again.
                </p>

                <button
                    type="button"
                    onClick={() => refetch()}
                    disabled={isFetching}
                    className="rounded-lg bg-indigo-600 px-5 py-2.5 text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {isFetching ? "Retrying..." : "Try again"}
                </button>

                <button
                    type="button"
                    onClick={() => {
                        window.location.href = "/login";
                    }}
                    className="text-sm text-indigo-600 hover:underline"
                >
                    Go to login
                </button>
            </div>
        );
    }

    return <Outlet />;
}

