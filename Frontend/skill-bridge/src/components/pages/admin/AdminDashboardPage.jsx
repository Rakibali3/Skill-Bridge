import {
    Sparkles,
    Route,
    Users,
    UsersRound,
} from "lucide-react";
import AdminLayout from "../../admin/AdminLayout";

const stats = [
    {
        title: "Master Skills",
        value: "—",
        icon: Sparkles,
    },
    {
        title: "Learning Paths",
        value: "—",
        icon: Route,
    },
    {
        title: "Users",
        value: "—",
        icon: Users,
    },
    {
        title: "Communities",
        value: "—",
        icon: UsersRound,
    },
];

export default function AdminDashboardPage() {
    return (
        <AdminLayout>
            <div className="mx-auto max-w-7xl">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                        Admin Dashboard
                    </h1>

                    <p className="mt-2 text-sm text-slate-500">
                        Manage SkillBridge content and platform data.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {stats.map((stat) => {
                        const Icon = stat.icon;

                        return (
                            <div
                                key={stat.title}
                                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-slate-500">
                                            {stat.title}
                                        </p>

                                        <p className="mt-2 text-2xl font-bold text-slate-900">
                                            {stat.value}
                                        </p>
                                    </div>

                                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                                        <Icon size={21} />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
                    <h2 className="text-lg font-semibold text-slate-900">
                        Content Management
                    </h2>

                    <p className="mt-2 text-sm text-slate-500">
                        Create master skills and build learning paths that
                        users can follow through their Learning Journey.
                    </p>
                </div>
            </div>
        </AdminLayout>
    );
}