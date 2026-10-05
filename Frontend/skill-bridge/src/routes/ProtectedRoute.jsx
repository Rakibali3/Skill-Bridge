import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAuthentication } from "../assets/hooks/useProfileData";

export default function ProtectedRoute() {
    const location = useLocation();

    const {
        isPending,
        isError,
        error,
        refetch,
        isFetching,
    } = useAuthentication();


    if (isPending) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50">

                <div
                    className="
                        h-10
                        w-10
                        animate-spin
                        rounded-full
                        border-4
                        border-slate-200
                        border-t-indigo-600
                    "
                />

                <p className="text-sm text-slate-600">
                    Checking your session...
                </p>

            </div>
        );
    }


    if (
        isError &&
        error?.response?.status === 401
    ) {
        return (
            <Navigate
                to="/login"
                replace
                state={{
                    from: location,
                }}
            />
        );
    }

    if (isError) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-6 text-center">

                <div className="w-full max-w-md">

                    <div className="mb-5 flex justify-center">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-100">
                            <span className="text-2xl">
                                !
                            </span>
                        </div>
                    </div>


                    <h2 className="text-xl font-semibold text-slate-900">
                        Unable to verify your session
                    </h2>


                    <p className="mt-2 text-sm leading-6 text-slate-600">
                        The server is taking longer than usual
                        to respond. Your session may still be active.
                    </p>


                    <button
                        type="button"
                        onClick={() => refetch()}
                        disabled={isFetching}
                        className="
                            mt-6
                            rounded-lg
                            bg-indigo-600
                            px-5
                            py-2.5
                            text-sm
                            font-semibold
                            text-white
                            transition
                            hover:bg-indigo-700
                            disabled:cursor-not-allowed
                            disabled:opacity-60
                        "
                    >
                        {isFetching
                            ? "Connecting..."
                            : "Try again"}
                    </button>


                    <button
                        type="button"
                        onClick={() => {
                            window.location.href = "/login";
                        }}
                        className="
                            mt-3
                            block
                            w-full
                            text-sm
                            text-indigo-600
                            hover:underline
                        "
                    >
                        Go to login
                    </button>

                </div>

            </div>
        );
    }

    return <Outlet />;
}