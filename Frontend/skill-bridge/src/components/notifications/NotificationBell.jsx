
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  CheckCheck,
  Clock,
  GraduationCap,
  Handshake,
  ListTodo,
  Sparkles,
  X,
} from "lucide-react";

import {
  useNotifications,
  useUnreadNotificationCount,
  useMarkNotificationAsRead,
  useMarkAllNotificationsAsRead,
} from "../../assets/hooks/useNotifications";

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

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const {
    data: notificationData,
    isLoading,
    isError,
  } = useNotifications(0, 5, isOpen);

  const { data: unreadCount = 0 } =
    useUnreadNotificationCount();

  const markRead = useMarkNotificationAsRead();
  const markAllRead = useMarkAllNotificationsAsRead();

  const notifications = getNotifications(notificationData);

  useEffect(() => {
    function handlePointerDown(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  async function openNotification(notification) {
    try {
      if (!notification.read) {
        await markRead.mutateAsync(notification.id);
      }

      setIsOpen(false);

      // Use the destination stored by your backend.
      const link = notification.link;

      if (
        typeof link === "string" &&
        link.startsWith("/") &&
        !link.startsWith("//")
      ) {
        navigate(link);
      } else {
        navigate("/notifications");
      }
    } catch (error) {
      console.error(
        "Could not open notification:",
        error
      );
    }
  }

  async function handleMarkAllRead() {
    try {
      await markAllRead.mutateAsync();
    } catch (error) {
      console.error(
        "Could not mark all notifications as read:",
        error
      );
    }
  }

  return (
    <div className="relative shrink-0" ref={dropdownRef}>
      {/* Notification bell */}
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-label={`Notifications${
          unreadCount > 0 ? `, ${unreadCount} unread` : ""
        }`}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        className="
          relative flex h-10 w-10 shrink-0 items-center
          justify-center rounded-xl text-slate-600
          transition-colors hover:bg-slate-100
          hover:text-indigo-600
          focus:outline-none focus-visible:ring-2
          focus-visible:ring-indigo-500
          sm:h-11 sm:w-11
        "
      >
        <Bell size={21} />

        {unreadCount > 0 && (
          <span
            className="
              absolute right-0.5 top-0.5 flex
              min-h-5 min-w-5 items-center justify-center
              rounded-full bg-red-500 px-1 text-[10px]
              font-bold text-white ring-2 ring-white
            "
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          role="dialog"
          aria-label="Recent notifications"
          className="
            fixed right-2 top-[4.5rem] z-50
            flex w-[calc(100vw-1rem)] max-w-[360px]
            flex-col overflow-hidden rounded-2xl
            border border-slate-200 bg-white shadow-2xl

            sm:absolute sm:right-0 sm:top-auto sm:mt-3
            sm:w-[360px] sm:max-w-[calc(100vw-2rem)]
          "
          style={{
            maxHeight: "calc(100dvh - 5.5rem)",
          }}
        >
          {/* Header */}
          <div
            className="
              flex shrink-0 items-center justify-between
              gap-3 border-b border-slate-100
              px-3 py-3 sm:px-4 sm:py-4
            "
          >
            <div className="min-w-0">
              <h2 className="text-base font-semibold text-slate-900">
                Notifications
              </h2>

              <p className="mt-0.5 text-xs text-slate-500">
                {unreadCount} unread
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-1">
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={handleMarkAllRead}
                  disabled={markAllRead.isPending}
                  title="Mark all as read"
                  aria-label="Mark all as read"
                  className="
                    flex h-10 w-10 items-center
                    justify-center rounded-lg
                    text-slate-500 hover:bg-indigo-50
                    hover:text-indigo-600
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                >
                  <CheckCheck size={19} />
                </button>
              )}

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close notifications"
                className="
                  flex h-10 w-10 items-center
                  justify-center rounded-lg
                  text-slate-500 hover:bg-slate-100
                "
              >
                <X size={19} />
              </button>
            </div>
          </div>

          {/* Scrollable notification list */}
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
            {isLoading ? (
              <div className="px-4 py-10 text-center text-sm text-slate-500">
                Loading notifications...
              </div>
            ) : isError ? (
              <div className="px-4 py-10 text-center">
                <p className="text-sm text-red-500">
                  Could not load notifications.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    navigate("/notifications");
                  }}
                  className="
                    mt-3 rounded-lg px-3 py-2
                    text-sm font-medium text-indigo-600
                    hover:bg-indigo-50
                  "
                >
                  Open notifications page
                </button>
              </div>
            ) : notifications.length === 0 ? (
              <div className="px-4 py-10 text-center">
                <Bell
                  className="mx-auto mb-3 text-slate-300"
                  size={30}
                />

                <p className="font-medium text-slate-700">
                  You're all caught up!
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  New updates will appear here.
                </p>
              </div>
            ) : (
              notifications.map((notification) => {
                const Icon = getNotificationIcon(
                  notification.type
                );

                return (
                  <button
                    type="button"
                    key={notification.id}
                    onClick={() => openNotification(notification)}
                    disabled={
                      markRead.isPending &&
                      markRead.variables === notification.id
                    }
                    className={`
                      flex w-full min-w-0 items-start gap-3
                      border-b border-slate-100
                      px-3 py-3 text-left transition
                      hover:bg-slate-50
                      disabled:opacity-60
                      sm:px-4 sm:py-3.5
                      ${
                        !notification.read
                          ? "bg-indigo-50/60"
                          : "bg-white"
                      }
                    `}
                  >
                    <span
                      className="
                        flex h-10 w-10 shrink-0
                        items-center justify-center
                        rounded-xl bg-indigo-100
                        text-indigo-600
                      "
                    >
                      <Icon size={19} />
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="flex min-w-0 items-start gap-2">
                        <span
                          className="
                            min-w-0 flex-1 break-words
                            text-sm font-semibold
                            leading-5 text-slate-800
                          "
                        >
                          {notification.title}
                        </span>

                        {!notification.read && (
                          <span
                            className="
                              mt-1.5 h-2 w-2 shrink-0
                              rounded-full bg-indigo-600
                            "
                            aria-label="Unread"
                          />
                        )}
                      </span>

                      <span
                        className="
                          mt-1 block break-words
                          text-sm leading-5 text-slate-600
                        "
                      >
                        {notification.message}
                      </span>

                      <span
                        className="
                          mt-2 flex flex-wrap items-center
                          gap-1 text-xs text-slate-400
                        "
                      >
                        <Clock size={12} />
                        <span>
                          {formatTime(notification.createdAt)}
                        </span>
                      </span>
                    </span>
                  </button>
                );
              })
            )}
          </div>

          {/* Footer */}
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              navigate("/notifications");
            }}
            className="
              min-h-11 shrink-0 border-t
              border-slate-100 px-4 py-3
              text-sm font-semibold text-indigo-600
              transition hover:bg-indigo-50
            "
          >
            View all notifications
          </button>
        </div>
      )}
    </div>
  );
}