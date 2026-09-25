import { useState } from "react";
import { ArrowLeft, MessageCircle, Search, User } from "lucide-react";

import { useMyExchanges } from "../../assets/hooks/useExchangeData";
import { useProfileData } from "../../assets/hooks/useProfileData";
import ChatBox from "../features/chat/ChatBox";
import DashboardLayout from "../../components/dashboard/DashboardLayout";

export default function ChatPage() {
    const [selectedExchange, setSelectedExchange] = useState(null);

    const {
        data: exchanges = [],
        isLoading: exchangesLoading,
        isError: exchangesError,
    } = useMyExchanges();

    const { data: currentUser, isLoading: profileLoading } = useProfileData();

    const activeExchanges = exchanges.filter(
        (exchange) => exchange.status === "ACTIVE",
    );

    const getPartner = (exchange) => {
        if (!currentUser?.id) {
            return null;
        }

        if (Number(exchange.user1Id) === Number(currentUser.id)) {
            return {
                id: exchange.user2Id,
                name: exchange.user2Name,
                avatarUrl: exchange.user2AvatarUrl,
            };
        }

        return {
            id: exchange.user1Id,
            name: exchange.user1Name,
            avatarUrl: exchange.user1AvatarUrl,
        };
    };

    const getExchangeSkills = (exchange) => {
        if (!currentUser?.id || !exchange.skills) {
            return "";
        }

        const mySkills = exchange.skills.filter(
            (skill) => Number(skill.userId) === Number(currentUser.id),
        );

        return mySkills.map((skill) => skill.skillName).join(" ↔ ");
    };

    const isLoading = exchangesLoading || profileLoading;

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-slate-50 p-3 sm:p-6 lg:p-8">
                <div className="mx-auto max-w-7xl">
                    {/* PAGE HEADER */}
                    <div className="mb-4 sm:mb-6">
                        <h1 className="text-xl font-bold text-slate-900 sm:text-2xl lg:text-3xl">
                            Chat
                        </h1>

                        <p className="mt-1 text-sm text-slate-500">
                            Chat with your active exchange partners.
                        </p>
                    </div>

                    {/* CHAT CONTAINER */}
                    <div className="grid h-[calc(100vh-160px)] min-h-[500px] grid-cols-1 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm sm:h-[calc(100vh-180px)] sm:min-h-[550px] md:grid-cols-[280px_1fr] lg:grid-cols-[320px_1fr]">
                        {/* ============================= */}
                        {/* CONVERSATION SIDEBAR */}
                        {/* On mobile: shown only when no chat is selected */}
                        {/* On md+: always shown alongside chat */}
                        {/* ============================= */}

                        <div
                            className={`min-h-0 flex-col border-slate-200 md:flex md:border-b-0 md:border-r ${selectedExchange ? "hidden md:flex" : "flex"
                                }`}
                        >
                            {/* SEARCH */}
                            <div className="border-b border-slate-200 p-3 sm:p-4">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                                    <input
                                        type="text"
                                        placeholder="Search conversations..."
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                    />
                                </div>
                            </div>

                            {/* CONVERSATION LIST */}
                            <div className="min-h-0 flex-1 overflow-y-auto">
                                {isLoading && (
                                    <div className="p-5 text-center text-sm text-slate-500">
                                        Loading conversations...
                                    </div>
                                )}

                                {exchangesError && (
                                    <div className="p-5 text-center text-sm text-red-500">
                                        Failed to load conversations.
                                    </div>
                                )}

                                {!isLoading &&
                                    !exchangesError &&
                                    activeExchanges.length === 0 && (
                                        <div className="flex h-full flex-col items-center justify-center p-6 text-center">
                                            <MessageCircle className="mb-3 h-10 w-10 text-slate-300" />

                                            <p className="font-medium text-slate-600">
                                                No active exchanges
                                            </p>

                                            <p className="mt-1 text-sm text-slate-400">
                                                Start an exchange to begin chatting.
                                            </p>
                                        </div>
                                    )}

                                {activeExchanges.map((exchange) => {
                                    const partner = getPartner(exchange);

                                    if (!partner) {
                                        return null;
                                    }

                                    const isSelected = selectedExchange?.id === exchange.id;

                                    return (
                                        <button
                                            key={exchange.id}
                                            type="button"
                                            onClick={() => setSelectedExchange(exchange)}
                                            className={`flex w-full items-center gap-3 border-b border-slate-100 p-3 text-left transition sm:p-4 ${isSelected ? "bg-indigo-50" : "hover:bg-slate-50"
                                                }`}
                                        >
                                            {/* AVATAR */}
                                            <div className="h-11 w-11 shrink-0 overflow-hidden rounded-full bg-indigo-100">
                                                {partner.avatarUrl ? (
                                                    <img
                                                        src={partner.avatarUrl}
                                                        alt={partner.name}
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex h-full w-full items-center justify-center">
                                                        <User className="h-5 w-5 text-indigo-600" />
                                                    </div>
                                                )}
                                            </div>

                                            {/* USER INFO */}
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center justify-between gap-2">
                                                    <p className="truncate font-semibold text-slate-900">
                                                        {partner.name}
                                                    </p>
                                                </div>

                                                <p className="mt-0.5 truncate text-xs text-slate-500">
                                                    {getExchangeSkills(exchange) || "Active exchange"}
                                                </p>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div
                            className={`min-h-0 flex-col md:flex ${selectedExchange ? "flex" : "hidden"
                                }`}
                        >
                            {!selectedExchange ? (
                                <div className="flex h-full w-full flex-col items-center justify-center p-6 text-center">
                                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-50">
                                        <MessageCircle className="h-7 w-7 text-indigo-500" />
                                    </div>

                                    <h2 className="text-lg font-semibold text-slate-800">
                                        Select a conversation
                                    </h2>

                                    <p className="mt-1 max-w-sm text-sm text-slate-500">
                                        Choose one of your active exchange partners to start
                                        chatting.
                                    </p>
                                </div>
                            ) : (
                                <div className="flex h-full w-full min-h-0 flex-col">
                                    {/* MOBILE-ONLY BACK BAR */}
                                    <div className="flex items-center gap-2 border-b border-slate-200 p-3 md:hidden">
                                        <button
                                            type="button"
                                            onClick={() => setSelectedExchange(null)}
                                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100"
                                            aria-label="Back to conversations"
                                        >
                                            <ArrowLeft className="h-5 w-5" />
                                        </button>

                                        <div className="h-11 w-11 shrink-0 overflow-hidden rounded-full bg-indigo-100">
                                            {getPartner(selectedExchange)?.avatarUrl ? (
                                                <img
                                                    src={getPartner(selectedExchange)?.avatarUrl}
                                                    alt={getPartner(selectedExchange)?.name}
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center">
                                                    <User className="h-5 w-5 text-indigo-600" />
                                                </div>
                                            )}
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-semibold text-slate-900">
                                                {getPartner(selectedExchange)?.name}
                                            </p>
                                            <p className="truncate text-xs text-slate-500">
                                                {getExchangeSkills(selectedExchange) ||
                                                    "Active exchange"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="min-h-0 flex-1">
                                        <ChatBox
                                            exchangeId={selectedExchange.id}
                                            currentUserId={currentUser?.id}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
