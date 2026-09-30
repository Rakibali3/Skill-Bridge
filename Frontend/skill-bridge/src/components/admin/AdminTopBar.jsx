import { Menu, ShieldCheck } from "lucide-react";

export default function AdminTopBar({ onMenuClick }) {
    return (
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6">
            <button
                type="button"
                onClick={onMenuClick}
                className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
            >
                <Menu size={22} />
            </button>

            <div className="hidden lg:block">
                <p className="text-sm font-medium text-slate-500">
                    Administration
                </p>
            </div>

            <div className="ml-auto flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                    <ShieldCheck size={19} />
                </div>

                <div className="hidden sm:block">
                    <p className="text-sm font-semibold text-slate-800">
                        Admin
                    </p>

                    <p className="text-xs text-slate-400">
                        Administrator
                    </p>
                </div>
            </div>
        </header>
    );
}