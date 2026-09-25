import { useEffect, useRef, useState } from "react";
import {
    MessageCircle,
    Send,
    Wifi,
    WifiOff,
} from "lucide-react";

import useChat from "../../../assets/hooks/useChat";

export default function ChatBox({
    exchangeId,
    currentUserId,
}) {

    const [message, setMessage] = useState("");

    const messagesEndRef = useRef(null);

    const {
        messages,
        sendMessage,
        connected,
        historyLoading,
        error,
    } = useChat(exchangeId);

    // Scroll to latest message
    useEffect(() => {

        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth",
        });

    }, [messages]);

    const handleSubmit = (event) => {

        event.preventDefault();

        if (!message.trim()) {
            return;
        }

        sendMessage(message);

        setMessage("");
    };

    return (
        <div className="flex h-full flex-col overflow-hidden bg-white">

            {/* ============================= */}
            {/* CHAT HEADER */}
            {/* ============================= */}

            <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-5 py-4">

                <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100">

                        <MessageCircle className="h-5 w-5 text-indigo-600" />

                    </div>

                    <div>

                        <h2 className="font-semibold text-slate-900">
                            Chat
                        </h2>

                        <div className="flex items-center gap-1.5 text-xs">

                            {connected ? (
                                <>
                                    <Wifi className="h-3.5 w-3.5 text-green-500" />

                                    <span className="text-green-600">
                                        Connected
                                    </span>
                                </>
                            ) : (
                                <>
                                    <WifiOff className="h-3.5 w-3.5 text-red-500" />

                                    <span className="text-red-500">
                                        Connecting...
                                    </span>
                                </>
                            )}

                        </div>

                    </div>

                </div>

            </div>

            {/* ============================= */}
            {/* MESSAGES */}
            {/* ============================= */}

            <div className="min-h-0 flex-1 space-y-3 overflow-y-auto bg-slate-50 p-5">

                {historyLoading ? (

                    <div className="flex h-full items-center justify-center">

                        <p className="text-sm text-slate-500">
                            Loading messages...
                        </p>

                    </div>

                ) : messages.length === 0 ? (

                    <div className="flex h-full flex-col items-center justify-center text-center">

                        <MessageCircle className="mb-3 h-10 w-10 text-slate-300" />

                        <p className="font-medium text-slate-600">
                            No messages yet
                        </p>

                        <p className="mt-1 text-sm text-slate-400">
                            Start the conversation.
                        </p>

                    </div>

                ) : (

                    messages.map((item) => {

                        const isMine =
                            Number(item.senderId) ===
                            Number(currentUserId);

                        return (
                            <div
                                key={item.id}
                                className={`flex ${
                                    isMine
                                        ? "justify-end"
                                        : "justify-start"
                                }`}
                            >

                                <div
                                    className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                                        isMine
                                            ? "rounded-br-md bg-indigo-600 text-white"
                                            : "rounded-bl-md bg-white text-slate-800 shadow-sm"
                                    }`}
                                >

                                    {!isMine && (
                                        <p className="mb-1 text-xs font-semibold text-indigo-600">
                                            {item.senderName}
                                        </p>
                                    )}

                                    <p className="break-words text-sm">
                                        {item.message}
                                    </p>

                                    <p
                                        className={`mt-1 text-[10px] ${
                                            isMine
                                                ? "text-indigo-200"
                                                : "text-slate-400"
                                        }`}
                                    >
                                        {new Date(
                                            item.createdAt
                                        ).toLocaleTimeString([], {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </p>

                                </div>

                            </div>
                        );
                    })
                )}

                <div ref={messagesEndRef} />

            </div>

            {/* ============================= */}
            {/* ERROR */}
            {/* ============================= */}

            {error && (
                <div className="shrink-0 border-t border-red-100 bg-red-50 px-4 py-2 text-sm text-red-600">
                    {error}
                </div>
            )}

            {/* ============================= */}
            {/* MESSAGE INPUT */}
            {/* ============================= */}

            <form
                onSubmit={handleSubmit}
                className="flex shrink-0 items-center gap-3 border-t border-slate-200 bg-white p-4"
            >

                <input
                    type="text"
                    value={message}
                    onChange={(event) =>
                        setMessage(event.target.value)
                    }
                    placeholder="Type a message..."
                    maxLength={2000}
                    className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />

                <button
                    type="submit"
                    disabled={
                        !message.trim() ||
                        !connected
                    }
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <Send className="h-4 w-4" />
                </button>

            </form>

        </div>
    );
}