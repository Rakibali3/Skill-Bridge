import { useParams, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, MapPin, Briefcase, CheckCircle2, GraduationCap, BookOpen } from "lucide-react";

import DashboardLayout from "../dashboard/DashboardLayout";
import { useProfileById } from "../../assets/hooks/useProfileData";

export default function UserProfilePage() {
    const location = useLocation();
    const canTeach = location.state?.canTeach ?? user.canTeach ?? [];
    const wantsToLearn = location.state?.wantsToLearn ?? user.wantsToLearn ?? [];

    const { userId } = useParams();
    const navigate = useNavigate();

    const { data: user, isLoading, error } = useProfileById(userId);

    if (isLoading) {
        return (
            <DashboardLayout>
                <div className="flex min-h-[400px] items-center justify-center">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600" />
                </div>
            </DashboardLayout>
        );
    }

    if (error || !user) {
        return (
            <DashboardLayout>
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                    Unable to load this profile.
                </div>
                <button
                    onClick={() => navigate(-1)}
                    className="mt-4 text-sm font-semibold text-indigo-600 hover:underline"
                >
                    Go back
                </button>
            </DashboardLayout>
        );
    }

    const avatar =
        user.avatarUrl ||
        user.profileUrl ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(
            user.userName || "User"
        )}&background=6366f1&color=fff`;

    return (
        <DashboardLayout>
            <button
                onClick={() => navigate(-1)}
                className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-indigo-600"
            >
                <ArrowLeft size={16} />
                Back to matches
            </button>

            {/* Banner */}
            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="h-32 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-500 sm:h-40" />
                <div className="px-5 pb-6 sm:px-8">
                    <div className="-mt-16 flex flex-col gap-5 sm:-mt-20 sm:flex-row sm:items-end">
                        <img
                            src={avatar}
                            alt={user.userName}
                            className="h-32 w-32 rounded-3xl border-4 border-white object-cover shadow-lg sm:h-36 sm:w-36"
                        />
                        <div className="flex-1 sm:pb-1">
                            <div className="flex flex-wrap items-center gap-2">
                                <h1 className="text-2xl font-bold text-slate-900">
                                    {user.userName || "User"}
                                </h1>
                                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-600">
                                    <CheckCircle2 size={13} /> Active
                                </span>
                            </div>
                        </div>
                    </div>

                    <p className="mt-6 max-w-3xl text-sm leading-6 text-slate-600">
                        {user.bio || "This user hasn't added a bio yet."}
                    </p>

                    <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-500">
                        <div className="flex items-center gap-2">
                            <MapPin size={16} className="text-slate-400" />
                            {user.email || "email not added"}
                        </div>
                        <div className="flex items-center gap-2">
                            <MapPin size={16} className="text-slate-400" />
                            {user.location || "Location not added"}
                        </div>
                    </div>
                </div>
            </section>

            {/* Info */}
            <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50">
                        <Briefcase size={19} className="text-indigo-600" />
                    </div>
                    <h3 className="font-bold text-slate-900">About</h3>
                </div>

                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                    <InfoItem label="Experience" value={user.experience || "Not added"} />
                    <InfoItem label="Learning Style" value={user.learningStyle || "Not added"} />
                    <InfoItem label="Preferred Format" value={user.preferredFormat || "Not added"} />
                    <InfoItem label="Availability" value={user.availability || "Not added"} />
                </div>
            </section>

            {/* Skills */}
            <section className="mt-6 grid gap-6 md:grid-cols-2">
                <SkillCard
                    title="Can Teach"
                    subtitle="Skills this person can help you with"
                    icon={<GraduationCap size={19} className="text-emerald-600" />}
                    iconBg="bg-emerald-50"
                    skills={canTeach}
                    tagClass="bg-emerald-50 text-emerald-700 border border-emerald-100"
                    emptyText="No teaching skills added yet."
                />
                <SkillCard
                    title="Wants to Learn"
                    subtitle="Skills this person is looking for"
                    icon={<BookOpen size={19} className="text-indigo-600" />}
                    iconBg="bg-indigo-50"
                    skills={wantsToLearn}
                    tagClass="bg-indigo-50 text-indigo-700 border border-indigo-100"
                    emptyText="No learning goals added yet."
                />
            </section>
        </DashboardLayout>
    );
}

function InfoItem({ label, value }) {
    return (
        <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-xs font-medium text-slate-400">{label}</p>
            <p className="mt-1 text-sm font-semibold text-slate-700">{value}</p>
        </div>
    );
}

function SkillCard({ title, subtitle, icon, iconBg, skills, tagClass, emptyText }) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconBg}`}>
                    {icon}
                </div>
                <div>
                    <h3 className="font-bold text-slate-900">{title}</h3>
                    <p className="text-xs text-slate-400">{subtitle}</p>
                </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
                {skills.length > 0 ? (
                    skills.map((skill) => (
                        <span
                            key={skill}
                            className={`rounded-lg px-3 py-1.5 text-xs font-medium ${tagClass}`}
                        >
                            {skill}
                        </span>
                    ))
                ) : (
                    <p className="text-sm text-slate-400">{emptyText}</p>
                )}
            </div>
        </div>
    );
}