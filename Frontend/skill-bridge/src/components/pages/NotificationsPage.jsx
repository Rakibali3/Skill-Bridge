
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Bell,
    Check,
    CheckCheck,
    Clock,
    GraduationCap,
    Handshake,
    ListTodo,
    Sparkles,
    ArrowLeft,
    RefreshCw,
} from "lucide-react";

import {
    useNotifications,
    useUnreadNotificationCount,
    useMarkNotificationAsRead,
    useMarkAllNotificationsAsRead,
} from "../../assets/hooks/useNotifications";
import DashboardLayout from "../dashboard/DashboardLayout";

function getNotifications(data) {
    if (Array.isArray(data)) return data;
    return data?.content ?? data?.notifications ?? data?.items ?? [];
}

function formatTime(dateString) {
    if (!dateString) return "";

    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return "";

    return new Intl.DateTimeFormat("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
    }).format(date);
}

function getNotificationIcon(type) {
    switch (type) {
        case "NEW_SKILL_MATCH":
            return Sparkles;
        case "EXCHANGE_REQUEST":
        case "EXCHANGE_CREATED":
        case "EXCHANGE_ACCEPTED":
        case "EXCHANGE_REJECTED":
        case "EXCHANGE_ACTIVATED":
            return Handshake;
        case "LEARNING_PATH_CREATED":
        case "LEARNING_PATH_UPDATED":
            return GraduationCap;
        case "TASK_ASSIGNED":
        case "TASK_SUBMITTED":
        case "TASK_COMPLETED":
            return ListTodo;
        default:
            return Bell;
    }
}

export default function NotificationsPage() {
    const [filter, setFilter] = useState("all");
    const navigate = useNavigate();

    const {
        data,
        isLoading,
        isError,
        refetch,
        isFetching,
    } = useNotifications(0, 20);

    const { data: unreadCount = 0 } =
        useUnreadNotificationCount();

    const markRead = useMarkNotificationAsRead();
    const markAllRead = useMarkAllNotificationsAsRead();

    const notifications = getNotifications(data);

    const filteredNotifications =
        filter === "unread"
            ? notifications.filter((notification) => !notification.read)
            : notifications;

    async function handleNotificationClick(notification) {
        try {
            if (!notification.read) {
                await markRead.mutateAsync(notification.id);
            }

            if (notification.link) {
                navigate(notification.link);
            }
        } catch (error) {
            console.error("Could not mark notification as read:", error);
        }
    }

    async function handleMarkAllRead() {
        try {
            await markAllRead.mutateAsync();
        } catch (error) {
            console.error("Could not mark all notifications as read:", error);
        }
    }

    return (
        <DashboardLayout>
            <main className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-6xl">
                    {/* Page heading */}
                    <div className="mb-6 flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            aria-label="Go back"
                            className="rounded-xl border border-slate-200 bg-white p-2.5
              text-slate-600 transition hover:bg-slate-100"
                        >
                            <ArrowLeft size={20} />
                        </button>

                        <div className="flex-1">
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900
              sm:text-3xl">
                                Notifications
                            </h1>
                            <p className="mt-1 text-sm text-slate-500">
                                Stay updated on your SkillBridge activities.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() => refetch()}
                            disabled={isFetching}
                            aria-label="Refresh notifications"
                            title="Refresh notifications"
                            className="rounded-xl border border-slate-200 bg-white p-2.5
              text-slate-600 transition hover:bg-slate-100
              disabled:opacity-50"
                        >
                            <RefreshCw
                                size={19}
                                className={isFetching ? "animate-spin" : ""}
                            />
                        </button>
                    </div>

                    {/* Summary */}
                    <div className="mb-6 rounded-2xl border border-slate-200
          bg-white p-5 shadow-sm sm:p-6">
                        <div className="flex items-center gap-4">
                            <div className="flex h-14 w-14 shrink-0 items-center
              justify-center rounded-2xl bg-indigo-100 text-indigo-600">
                                <Bell size={26} />
                            </div>

                            <div className="flex-1">
                                <p className="text-sm font-medium text-slate-500">
                                    Unread notifications
                                </p>
                                <p className="mt-1 text-3xl font-bold text-slate-900">
                                    {unreadCount}
                                </p>
                            </div>

                            {unreadCount > 0 && (
                                <button
                                    type="button"
                                    onClick={handleMarkAllRead}
                                    disabled={markAllRead.isPending}
                                    className="hidden items-center gap-2 rounded-xl
                  bg-indigo-600 px-4 py-2.5 text-sm font-semibold
                  text-white transition hover:bg-indigo-700
                  disabled:opacity-50 sm:inline-flex"
                                >
                                    <CheckCheck size={17} />
                                    {markAllRead.isPending ? "Updating..." : "Mark all as read"}
                                </button>
                            )}
                        </div>

                        {unreadCount > 0 && (
                            <button
                                type="button"
                                onClick={handleMarkAllRead}
                                disabled={markAllRead.isPending}
                                className="mt-4 flex w-full items-center justify-center
                gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm
                font-semibold text-white hover:bg-indigo-700
                disabled:opacity-50 sm:hidden"
                            >
                                <CheckCheck size={17} />
                                Mark all as read
                            </button>
                        )}
                    </div>

                    {/* Filters */}
                    <div className="mb-4 flex items-center justify-between gap-3">
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => setFilter("all")}
                                className={`rounded-xl px-4 py-2 text-sm font-semibold
                transition ${filter === "all"
                                        ? "bg-indigo-600 text-white"
                                        : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
                                    }`}
                            >
                                All
                            </button>

                            <button
                                type="button"
                                onClick={() => setFilter("unread")}
                                className={`rounded-xl px-4 py-2 text-sm font-semibold
                transition ${filter === "unread"
                                        ? "bg-indigo-600 text-white"
                                        : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
                                    }`}
                            >
                                Unread
                                {unreadCount > 0 && (
                                    <span className="ml-2">{unreadCount}</span>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Notification list */}
                    <section className="overflow-hidden rounded-2xl border
          border-slate-200 bg-white shadow-sm">
                        {isLoading ? (
                            <div className="px-6 py-16 text-center">
                                <RefreshCw className="mx-auto animate-spin text-indigo-600" />
                                <p className="mt-3 text-sm text-slate-500">
                                    Loading notifications...
                                </p>
                            </div>
                        ) : isError ? (
                            <div className="px-6 py-16 text-center">
                                <p className="font-medium text-slate-800">
                                    Unable to load notifications
                                </p>
                                <p className="mt-1 text-sm text-slate-500">
                                    Please check your connection and try again.
                                </p>
                                <button
                                    type="button"
                                    onClick={() => refetch()}
                                    className="mt-4 rounded-xl bg-indigo-600 px-4 py-2
                  text-sm font-semibold text-white hover:bg-indigo-700"
                                >
                                    Try again
                                </button>
                            </div>
                        ) : filteredNotifications.length === 0 ? (
                            <div className="px-6 py-16 text-center">
                                <div className="mx-auto flex h-16 w-16 items-center
                justify-center rounded-full bg-slate-100 text-slate-400">
                                    <Bell size={28} />
                                </div>
                                <h2 className="mt-4 font-semibold text-slate-800">
                                    {filter === "unread"
                                        ? "No unread notifications"
                                        : "No notifications yet"}
                                </h2>
                                <p className="mx-auto mt-2 max-w-sm text-sm text-slate-500">
                                    {filter === "unread"
                                        ? "You're all caught up. Check back when there are new updates."
                                        : "When you receive a match, exchange request, task update, or learning path update, it will appear here."}
                                </p>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-100">
                                {filteredNotifications.map((notification) => {
                                    const Icon = getNotificationIcon(notification.type);

                                    return (
                                        <article
                                            key={notification.id}
                                            className={`flex gap-3 p-4 transition sm:gap-4 sm:p-5 ${!notification.read ? "bg-indigo-50/50" : "bg-white"
                                                }`}
                                        >
                                            <div className="flex h-11 w-11 shrink-0
                      items-center justify-center rounded-xl
                      bg-indigo-100 text-indigo-600 sm:h-12 sm:w-12">
                                                <Icon size={21} />
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <h2 className="font-semibold text-slate-900">
                                                        {notification.title}
                                                    </h2>

                                                    {!notification.read && (
                                                        <span className="rounded-full bg-indigo-100
                            px-2 py-0.5 text-xs font-medium text-indigo-700">
                                                            New
                                                        </span>
                                                    )}
                                                </div>

                                                <p className="mt-1 text-sm leading-6 text-slate-600">
                                                    {notification.message}
                                                </p>

                                                <p className="mt-2 flex items-center gap-1.5
                        text-xs text-slate-400">
                                                    <Clock size={13} />
                                                    {formatTime(notification.createdAt)}
                                                </p>

                                                <div className="mt-3 flex flex-wrap gap-3">
                                                    {notification.link && (
                                                        <button
                                                            type="button"
                                                            onClick={() => handleNotificationClick(notification)}
                                                            disabled={markRead.isPending}
                                                            className="text-sm font-semibold text-indigo-600
                              hover:text-indigo-800 disabled:opacity-50"
                                                        >
                                                            View details
                                                        </button>
                                                    )}

                                                    {!notification.read && (
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                markRead.mutate(notification.id)
                                                            }
                                                            disabled={markRead.isPending}
                                                            className="inline-flex items-center gap-1.5
                              text-sm font-medium text-slate-500
                              hover:text-indigo-600 disabled:opacity-50"
                                                        >
                                                            <Check size={15} />
                                                            Mark as read
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </article>
                                    );
                                })}
                            </div>
                        )}
                    </section>

                    <p className="mt-4 text-center text-xs text-slate-400">
                        Showing up to 20 notifications.
                    </p>
                </div>
            </main>
        </DashboardLayout>
    );
}