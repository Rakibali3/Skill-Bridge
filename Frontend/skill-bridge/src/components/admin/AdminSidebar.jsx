import {
    LayoutDashboard,
    Sparkles,
    Route,
    Users,
    UsersRound,
    X,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const menuItems = [
    {
        name: "Dashboard",
        path: "/admin",
        icon: LayoutDashboard,
        end: true,
    },
    {
        name: "Skills",
        path: "/admin/skills",
        icon: Sparkles,
    },
    {
        name: "Learning Paths",
        path: "/admin/learning-paths",
        icon: Route,
    },
    {
        name: "Users",
        path: "/admin/users",
        icon: Users,
    },
    {
        name: "Communities",
        path: "/admin/communities",
        icon: UsersRound,
    },
];

export default function AdminSidebar({ mobileOpen, onClose }) {
    return (
        <>
            {mobileOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/40 lg:hidden"
                    onClick={onClose}
                />
            )}

            <aside
                className={`
                    fixed left-0 top-0 z-50
                    flex h-screen w-64 flex-col
                    border-r border-slate-200 bg-white
                    transition-transform duration-300
                    lg:translate-x-0
                    ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
                `}
            >
                {/* Logo */}
                <div className="flex h-16 items-center justify-between border-b border-slate-200 px-5">
                    <div>
                        <h1 className="text-xl font-bold text-slate-900">
                            Skill<span className="text-indigo-600">Bridge</span>
                        </h1>

                        <p className="text-xs font-medium text-slate-400">
                            Admin Panel
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 space-y-1 p-4">
                    {menuItems.map((item) => {
                        const Icon = item.icon;

                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                end={item.end}
                                onClick={onClose}
                                className={({ isActive }) =>
                                    `
                                    flex items-center gap-3 rounded-xl
                                    px-4 py-3 text-sm font-medium
                                    transition
                                    ${
                                        isActive
                                            ? "bg-indigo-50 text-indigo-600"
                                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                    }
                                    `
                                }
                            >
                                <Icon size={19} />
                                <span>{item.name}</span>
                            </NavLink>
                        );
                    })}
                </nav>

                {/* Bottom */}
                <div className="border-t border-slate-200 p-4">
                    <div className="rounded-xl bg-slate-50 p-4">
                        <p className="text-xs font-medium text-slate-400">
                            ADMIN ACCESS
                        </p>

                        <p className="mt-1 text-sm font-semibold text-slate-700">
                            Content Management
                        </p>
                    </div>
                </div>
            </aside>
        </>
    );
}