import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Inbox,
    Check,
    X,
    Loader2,
    Clock,
} from "lucide-react";

import DashboardLayout from "../../components/dashboard/DashboardLayout";
import {
    useReceivedExchangeRequests,
    useAcceptExchangeRequest,
    useRejectExchangeRequest,
} from "../../assets/hooks/useExchangeRequestData";

export default function IncomingRequestsPage() {
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState("PENDING");
    const [actionError, setActionError] = useState("");

    const { data: requests = [], isLoading } = useReceivedExchangeRequests();

    const acceptMutation = useAcceptExchangeRequest();
    const rejectMutation = useRejectExchangeRequest();

    const filteredRequests = useMemo(() => {
        return requests
            .filter((r) => activeTab === "ALL" || r.status === activeTab)
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }, [requests, activeTab]);

    const pendingCount = useMemo(
        () => requests.filter((r) => r.status === "PENDING").length,
        [requests]
    );

    const handleAccept = async (requestId) => {
        setActionError("");
        try {
            await acceptMutation.mutateAsync(requestId);
        } catch (error) {
            setActionError(
                error?.response?.data?.message || "Unable to accept request. Please try again."
            );
        }
    };

    const handleReject = async (requestId) => {
        setActionError("");
        try {
            await rejectMutation.mutateAsync(requestId);
        } catch (error) {
            setActionError(
                error?.response?.data?.message || "Unable to reject request. Please try again."
            );
        }
    };

    if (isLoading) {
        return (
            <DashboardLayout>
                <div className="flex min-h-125 items-center justify-center">
                    <Loader2 size={36} className="animate-spin text-indigo-600" />
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-4xl">
                    {/* Header */}
                    <header className="mb-6">
                        <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-600">
                            <Inbox size={14} className="shrink-0" />
                            <span>Skill Exchange Requests</span>
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                            Incoming Requests
                        </h1>
                        <p className="mt-1 text-sm text-slate-500">
                            Review requests from people who want to exchange skills with you.
                        </p>
                    </header>

                    {actionError && (
                        <div className="mb-5 flex items-center justify-between rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                            <span>{actionError}</span>
                            <button
                                type="button"
                                onClick={() => setActionError("")}
                                className="font-semibold hover:underline"
                            >
                                Dismiss
                            </button>
                        </div>
                    )}

                    {/* Tabs */}
                    <nav aria-label="Request status tabs" className="mb-5 flex gap-2">
                        {[
                            { id: "PENDING", label: `Pending${pendingCount ? ` (${pendingCount})` : ""}` },
                            { id: "ACCEPTED", label: "Accepted" },
                            { id: "REJECTED", label: "Rejected" },
                            { id: "ALL", label: "All" },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => setActiveTab(tab.id)}
                                className={`shrink-0 rounded-xl px-4 py-2 text-xs font-semibold transition ${
                                    activeTab === tab.id
                                        ? "bg-indigo-600 text-white shadow-sm"
                                        : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </nav>

                    {/* Request List */}
                    {filteredRequests.length > 0 ? (
                        <section className="space-y-3">
                            {filteredRequests.map((request) => (
                                <RequestCard
                                    key={request.id}
                                    request={request}
                                    isAccepting={
                                        acceptMutation.isPending &&
                                        acceptMutation.variables === request.id
                                    }
                                    isRejecting={
                                        rejectMutation.isPending &&
                                        rejectMutation.variables === request.id
                                    }
                                    onAccept={handleAccept}
                                    onReject={handleReject}
                                    onViewProfile={() =>
                                        navigate(`/profile/${request.senderId}`)
                                    }
                                />
                            ))}
                        </section>
                    ) : (
                        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                                <Inbox size={22} />
                            </div>
                            <h3 className="mt-4 text-base font-bold text-slate-800">
                                No requests here
                            </h3>
                            <p className="mt-1 text-sm text-slate-500">
                                {activeTab === "PENDING"
                                    ? "You're all caught up — no pending requests right now."
                                    : "Nothing to show in this tab yet."}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}


function RequestCard({
    request,
    isAccepting,
    isRejecting,
    onAccept,
    onReject,
    onViewProfile,
}) {
    const isPending = request.status === "PENDING";
    const isBusy = isAccepting || isRejecting;

    return (
        <article className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <div className="flex items-center gap-3.5">
                <img
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                        request.senderName || "User"
                    )}&background=6366f1&color=fff`}
                    alt={request.senderName}
                    className="h-12 w-12 shrink-0 rounded-full bg-slate-100 object-cover"
                />
                <div className="min-w-0">
                    <button
                        type="button"
                        onClick={onViewProfile}
                        className="truncate text-sm font-bold text-slate-800 hover:text-indigo-600"
                    >
                        {request.senderName || "Anonymous User"}
                    </button>
                    <div className="mt-1 flex items-center gap-1 text-xs text-slate-400">
                        <Clock size={12} className="shrink-0" />
                        <span>
                            {new Date(request.createdAt).toLocaleDateString(undefined, {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                            })}
                        </span>
                    </div>
                </div>
            </div>

            {isPending ? (
                <div className="flex shrink-0 gap-2">
                    <button
                        type="button"
                        disabled={isBusy}
                        onClick={() => onReject(request.id)}
                        className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isRejecting ? (
                            <Loader2 size={14} className="animate-spin" />
                        ) : (
                            <X size={14} />
                        )}
                        <span>Reject</span>
                    </button>
                    <button
                        type="button"
                        disabled={isBusy}
                        onClick={() => onAccept(request.id)}
                        className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isAccepting ? (
                            <Loader2 size={14} className="animate-spin" />
                        ) : (
                            <Check size={14} />
                        )}
                        <span>Accept</span>
                    </button>
                </div>
            ) : (
                <StatusBadge status={request.status} />
            )}
        </article>
    );
}

function StatusBadge({ status }) {
    const styles = {
        ACCEPTED: "border-emerald-200 bg-emerald-50 text-emerald-700",
        REJECTED: "border-red-200 bg-red-50 text-red-600",
    };

    return (
        <span
            className={`inline-flex w-fit shrink-0 items-center rounded-lg border px-3 py-1.5 text-xs font-semibold ${
                styles[status] || "border-slate-200 bg-slate-50 text-slate-600"
            }`}
        >
            {status}
        </span>
    );
}