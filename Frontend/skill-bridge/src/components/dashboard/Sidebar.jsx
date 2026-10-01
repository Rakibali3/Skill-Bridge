import { NavLink } from "react-router-dom";
import {
  X,
  Repeat2,
  Home,
  User,
  BookOpen,
  Users,
  MessageSquare,
  UsersRound,
  Route,
  Bell,
  Settings,
} from "lucide-react";

export default function Sidebar({ isOpen, onClose }) {
  const menuItems = [
    {
      label: "Dashboard",
      icon: Home,
      path: "/dashboard",
    },
    {
      label: "My Profile",
      icon: User,
      path: "/profile",
    },
    {
      label: "My Skills",
      icon: BookOpen,
      path: "/my-skills",
    },
    {
      label: "Find Matches",
      icon: Users,
      path: "/matches",
    },
    {
      label: "My Exchanges",
      icon: Repeat2,
      path: "/exchanges",
    },
    {
      label: "Messages",
      icon: MessageSquare,
      path: "/messages",
    },
    {
      label: "Communities",
      icon: UsersRound,
      path: "/communities",
    },
    {
      label: "Learning Paths",
      icon: Route,
      path: "/learning-paths",
    },
    {
      label: "Notifications",
      icon: Bell,
      path: "/notifications",
    },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed
          left-0
          top-0
          z-50
          flex
          h-screen
          w-72
          flex-col
          border-r
          border-slate-200
          bg-white
          transition-transform
          duration-300
          lg:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Logo */}
        <div className="flex h-20 items-center justify-between border-b border-slate-100 px-6">
          <NavLink to="/dashboard" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 shadow-lg shadow-indigo-200">
              <Repeat2 size={22} className="text-white" />
            </div>

            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900">
                SkillBridge
              </h1>

              <p className="text-[11px] font-medium text-slate-400">
                Learn • Share • Grow
              </p>
            </div>
          </NavLink>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
          >
            <X size={21} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 py-6">
          <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Workspace
          </p>

          <div className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.label}
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `
                    group
                    flex
                    w-full
                    items-center
                    gap-3
                    rounded-xl
                    px-4
                    py-3
                    text-sm
                    font-medium
                    transition
                    ${isActive
                      ? "bg-indigo-50 text-indigo-600"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }
                  `
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        size={19}
                        className={
                          isActive
                            ? "text-indigo-600"
                            : "text-slate-400 group-hover:text-slate-600"
                        }
                      />

                      <span>{item.label}</span>

                      {item.label === "Notifications" && (
                        <span className="ml-auto h-2 w-2 rounded-full bg-red-500" />
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>
        </nav>

        {/* Settings */}
        <div className="border-t border-slate-100 p-4">
          <button className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left hover:bg-slate-50">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100">
              <Settings size={18} className="text-slate-500" />
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-700">
                Settings
              </p>

              <p className="text-xs text-slate-400">
                Manage account
              </p>
            </div>
          </button>
        </div>
      </aside>
    </>
  );
}