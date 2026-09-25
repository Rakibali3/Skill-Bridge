import {
    Repeat2,
    Users,
    GraduationCap,
    BookOpen,
    Clock,
    CheckCircle2,
    PauseCircle,
    XCircle,
} from "lucide-react";

import DashboardLayout from "../dashboard/DashboardLayout";
import { useMyExchanges } from "../../assets/hooks/useExchangeData";
import { useNavigate } from "react-router-dom";

export default function MyExchangesPage() {

    const {
        data: exchanges = [],
        isLoading,
        error,
    } = useMyExchanges();
    
    if (isLoading) {
        return (
            <DashboardLayout>
                <div className="flex min-h-[400px] items-center justify-center">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600" />
                </div>
            </DashboardLayout>
        );
    }

    if (error) {
        return (
            <DashboardLayout>
                <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
                    <p className="font-semibold text-red-600">
                        Unable to load your exchanges.
                    </p>

                    <p className="mt-1 text-sm text-red-500">
                        Please try again later.
                    </p>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="space-y-8">

                {/* Header */}
                <section>
                    <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50">
                            <Repeat2
                                size={24}
                                className="text-indigo-600"
                            />
                        </div>

                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">
                                My Exchanges
                            </h1>

                            <p className="mt-1 text-sm text-slate-500">
                                Manage your active skill exchanges.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Empty state */}
                {exchanges.length === 0 ? (
                    <EmptyState />
                ) : (
                    <div className="grid gap-6 xl:grid-cols-2">
                        {exchanges.map((exchange) => (
                            <ExchangeCard
                                key={exchange.id}
                                exchange={exchange}
                            />
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}

function ExchangeCard({ exchange }) {
    const status = exchange.status;
        const navigate = useNavigate();

    const statusConfig = getStatusConfig(status);

    const user1Skills = exchange.skills?.filter(
        (skill) =>
            Number(skill.userId) === Number(exchange.user1Id)
    ) || [];

    const user2Skills = exchange.skills?.filter(
        (skill) =>
            Number(skill.userId) === Number(exchange.user2Id)
    ) || [];

    const user1Teaching = user1Skills.filter(
        (skill) => skill.direction === "TEACH"
    );

    const user1Learning = user1Skills.filter(
        (skill) => skill.direction === "LEARN"
    );

    const user2Teaching = user2Skills.filter(
        (skill) => skill.direction === "TEACH"
    );

    const user2Learning = user2Skills.filter(
        (skill) => skill.direction === "LEARN"
    );

    return (
        <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            {/* Top */}
            <div className="border-b border-slate-100 p-5 sm:p-6">

                <div className="flex flex-wrap items-start justify-between gap-4">

                    <div className="flex items-center gap-3">

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50">
                            <Users
                                size={21}
                                className="text-indigo-600"
                            />
                        </div>

                        <div>
                            <p className="text-xs font-medium text-slate-400">
                                Skill Exchange
                            </p>

                            <h2 className="mt-0.5 text-lg font-bold text-slate-900">
                                {exchange.user1Name}
                                {" "}
                                <span className="font-normal text-slate-400">
                                    &
                                </span>
                                {" "}
                                {exchange.user2Name}
                            </h2>
                        </div>

                    </div>

                    <StatusBadge
                        status={status}
                        config={statusConfig}
                    />

                </div>

            </div>

            {/* Exchange details */}
            <div className="p-5 sm:p-6">

                <div className="grid gap-4 md:grid-cols-2">

                    <SkillGroup
                        title={exchange.user1Name}
                        subtitle="Skills"
                        teaching={user1Teaching}
                        learning={user1Learning}
                        icon={<GraduationCap size={18} />}
                    />

                    <SkillGroup
                        title={exchange.user2Name}
                        subtitle="Skills"
                        teaching={user2Teaching}
                        learning={user2Learning}
                        icon={<BookOpen size={18} />}
                    />

                </div>

                {/* Created date */}
                <div className="mt-6 flex items-center gap-2 text-xs text-slate-400">
                    <Clock size={14} />

                    Started{" "}
                    {formatDate(exchange.createdAt)}
                </div>

            </div>

            {/* Footer */}
            <div className="border-t border-slate-100 bg-slate-50 px-5 py-4 sm:px-6">

                <button
                    disabled={status !== "ACTIVE"}
                    className={`
                        w-full rounded-xl px-4 py-3 text-sm font-semibold transition
                        ${
                            status === "ACTIVE"
                                ? "bg-indigo-600 text-white hover:bg-indigo-700"
                                : "cursor-not-allowed bg-slate-200 text-slate-400"
                        }
                    `}
                    onClick={() => { navigate(`/exchanges/${exchange.id}`);}}
                >
                    {status === "ACTIVE"
                        ? "Open Exchange"
                        : statusConfig.label}
                </button>

            </div>

        </article>
    );
}

function SkillGroup({
    title,
    teaching,
    learning,
    icon,
}) {
    return (
        <div className="rounded-xl border border-slate-200 p-4">

            <div className="flex items-center gap-2">
                <div className="text-indigo-600">
                    {icon}
                </div>

                <div>
                    <h3 className="text-sm font-bold text-slate-800">
                        {title}
                    </h3>

                    <p className="text-xs text-slate-400">
                        Exchange skills
                    </p>
                </div>
            </div>

            {/* Teaching */}
            <div className="mt-5">

                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-emerald-600">
                    Teaches
                </p>

                {teaching.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                        {teaching.map((skill) => (
                            <span
                                key={`${skill.userId}-${skill.skillId}-teach`}
                                className="rounded-lg border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700"
                            >
                                {skill.skillName}
                            </span>
                        ))}
                    </div>
                ) : (
                    <p className="text-xs text-slate-400">
                        No teaching skill
                    </p>
                )}

            </div>

            {/* Learning */}
            <div className="mt-5">

                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-indigo-600">
                    Wants to Learn
                </p>

                {learning.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                        {learning.map((skill) => (
                            <span
                                key={`${skill.userId}-${skill.skillId}-learn`}
                                className="rounded-lg border border-indigo-100 bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-700"
                            >
                                {skill.skillName}
                            </span>
                        ))}
                    </div>
                ) : (
                    <p className="text-xs text-slate-400">
                        No learning skill
                    </p>
                )}

            </div>

        </div>
    );
}

function StatusBadge({ status, config }) {
    const Icon = config.icon;

    return (
        <span
            className={`
                inline-flex items-center gap-1.5
                rounded-full px-3 py-1.5
                text-xs font-semibold
                ${config.className}
            `}
        >
            <Icon size={14} />
            {status}
        </span>
    );
}

function getStatusConfig(status) {
    switch (status) {
        case "ACTIVE":
            return {
                label: "Active",
                icon: CheckCircle2,
                className:
                    "bg-emerald-50 text-emerald-600",
            };

        case "PAUSED":
            return {
                label: "Paused",
                icon: PauseCircle,
                className:
                    "bg-amber-50 text-amber-600",
            };

        case "COMPLETED":
            return {
                label: "Completed",
                icon: CheckCircle2,
                className:
                    "bg-blue-50 text-blue-600",
            };

        case "CANCELLED":
            return {
                label: "Cancelled",
                icon: XCircle,
                className:
                    "bg-red-50 text-red-600",
            };

        default:
            return {
                label: status || "Unknown",
                icon: Clock,
                className:
                    "bg-slate-100 text-slate-600",
            };
    }
}

function EmptyState() {
    return (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50">
                <Repeat2
                    size={28}
                    className="text-indigo-600"
                />
            </div>

            <h2 className="mt-5 text-lg font-bold text-slate-900">
                No exchanges yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                Connect with someone who has complementary skills
                and start your first skill exchange.
            </p>
        </div>
    );
}

function formatDate(date) {
    if (!date) {
        return "recently";
    }

    return new Date(date).toLocaleDateString(
        "en-IN",
        {
            day: "numeric",
            month: "short",
            year: "numeric",
        }
    );
}