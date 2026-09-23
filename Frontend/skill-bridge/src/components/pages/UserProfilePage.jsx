import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Briefcase,
  CheckCircle2,
  GraduationCap,
  BookOpen,
  ArrowRightLeft,
  Loader2,
} from "lucide-react";

import DashboardLayout from "../dashboard/DashboardLayout";
import StartExchangeModal from "../exchange/StartExchangeModal";

import {
  useProfileById,
  useProfileData,
} from "../../assets/hooks/useProfileData";
import { useAllExchangeRequests } from "../../assets/hooks/useExchangeRequestData";
import { useMyExchanges } from "../../assets/hooks/useExchangeData";

export default function UserProfilePage() {
  const [showExchangeModal, setShowExchangeModal] = useState(false);
  const { userId } = useParams();
  const navigate = useNavigate();

  // Data Hooks
  const { data: currentUser, isLoading: currentUserLoading } = useProfileData();
  const { data: user, isLoading: profileLoading, error: profileError } = useProfileById(userId);
  const { data: exchanges = [], isLoading: exchangesLoading } = useMyExchanges();
  const { data: requests, isLoading: requestsLoading } = useAllExchangeRequests();

  // Loading State
  if (currentUserLoading || profileLoading || requestsLoading || exchangesLoading) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[500px] items-center justify-center">
          <Loader2 size={34} className="animate-spin text-indigo-600" />
        </div>
      </DashboardLayout>
    );
  }

  // Error State
  if (profileError || !user) {
    return (
      <DashboardLayout>
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
          Unable to load this profile.
        </div>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mt-4 text-sm font-semibold text-indigo-600 hover:underline"
        >
          Go back
        </button>
      </DashboardLayout>
    );
  }

  // Derived Data & Connections
  const currentUserId = Number(currentUser?.id);
  const targetUserId = Number(user.id);

  const skills = user.skills || [];
  const canTeach = skills.filter((s) => s.skillType === "TEACH");
  const wantsToLearn = skills.filter((s) => s.skillType === "LEARN");

  const sentRequests = requests?.sent || [];
  const receivedRequests = requests?.received || [];

  const isConnected =
    sentRequests.some(
      (req) => Number(req.receiverId) === targetUserId && req.status === "ACCEPTED"
    ) ||
    receivedRequests.some(
      (req) => Number(req.senderId) === targetUserId && req.status === "ACCEPTED"
    );

  const existingExchange = exchanges.find((ex) => {
    const user1Id = Number(ex.user1Id);
    const user2Id = Number(ex.user2Id);
    const hasCurrentUser = user1Id === currentUserId || user2Id === currentUserId;
    const hasTargetUser = user1Id === targetUserId || user2Id === targetUserId;

    return hasCurrentUser && hasTargetUser;
  });

  const avatar =
    user.avatarUrl ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      user.userName || "User"
    )}&background=6366f1&color=fff`;

  return (
    <DashboardLayout>
      {/* Back Button */}
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="mb-4 inline-flex cursor-pointer items-center gap-2 text-sm font-semibold text-slate-600 hover:text-indigo-600"
      >
        <ArrowLeft size={16} />
        Back to matches
      </button>

      {/* Profile Header */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="h-32 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-500 sm:h-40" />

        <div className="px-5 pb-6 sm:px-8">
          <div className="-mt-16 flex flex-col gap-5 sm:-mt-20 sm:flex-row sm:items-end">
            <img
              src={avatar}
              alt={user.userName || "User"}
              className="h-32 w-32 rounded-3xl border-4 border-white object-cover shadow-lg sm:h-36 sm:w-36"
            />

            <div className="flex-1 sm:pb-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-bold text-slate-900">
                  {user.userName || "User"}
                </h1>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-600">
                  <CheckCircle2 size={13} />
                  Active
                </span>
              </div>
            </div>

            {/* Exchange Status / Action */}
            {isConnected ? (
              existingExchange ? (
                <ExchangeStatusButton
                  exchange={existingExchange}
                  onClick={() => navigate(`/exchanges/${existingExchange.id}`)}
                />
              ) : (
                <button
                  type="button"
                  onClick={() => setShowExchangeModal(true)}
                  className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
                >
                  Start Skill Exchange
                </button>
              )
            ) : (
              <button
                type="button"
                disabled
                className="cursor-not-allowed rounded-xl bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-400"
              >
                Connect first
              </button>
            )}
          </div>

          {/* Bio */}
          <p className="mt-6 max-w-3xl text-sm leading-6 text-slate-600">
            {user.bio || "This user hasn't added a bio yet."}
          </p>

          {/* Location & Experience Header Badges */}
          <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <MapPin size={16} className="text-slate-400" />
              {user.location || "Location not added"}
            </div>
            <div className="flex items-center gap-2">
              <Briefcase size={16} className="text-slate-400" />
              {user.experience || "Experience not added"}
            </div>
          </div>
        </div>
      </section>

      {/* Connection Notice */}
      {!isConnected && (
        <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-100">
              <ArrowRightLeft size={17} className="text-amber-700" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-amber-900">Connect first</h3>
              <p className="mt-1 text-xs leading-5 text-amber-700">
                You need an accepted connection with this user before starting a skill exchange.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* About Section */}
      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50">
            <Briefcase size={19} className="text-indigo-600" />
          </div>
          <h3 className="font-bold text-slate-900">About</h3>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <InfoItem label="Experience" value={user.experience} />
          <InfoItem label="Learning Style" value={user.learningStyle} />
          <InfoItem label="Preferred Format" value={user.preferredFormat} />
          <InfoItem label="Availability" value={user.availability} />
        </div>
      </section>

      {/* Skills Section */}
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

      {/* Modal */}
      {showExchangeModal && (
        <StartExchangeModal
          isOpen={showExchangeModal}
          partner={user}
          onClose={() => setShowExchangeModal(false)}
          onSuccess={() => setShowExchangeModal(false)}
        />
      )}
    </DashboardLayout>
  );
}

/* =========================================================
 * HELPER COMPONENTS
 * ========================================================= */

function InfoItem({ label, value }) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">
      <p className="text-xs font-medium text-slate-400">{label}</p>
      <p className="mt-1 text-sm font-semibold text-slate-700">
        {value || "Not added"}
      </p>
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
              key={skill.userSkillId || skill.skillId}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium ${tagClass}`}
            >
              {skill.skillName}
            </span>
          ))
        ) : (
          <p className="text-sm text-slate-400">{emptyText}</p>
        )}
      </div>
    </div>
  );
}

function ExchangeStatusButton({ exchange, onClick }) {
  const config = {
    ACTIVE: {
      label: "Exchange Active",
      className: "bg-emerald-50 text-emerald-700 border-emerald-200",
      dot: "bg-emerald-500",
    },
    PAUSED: {
      label: "Exchange Paused",
      className: "bg-amber-50 text-amber-700 border-amber-200",
      dot: "bg-amber-500",
    },
    COMPLETED: {
      label: "Exchange Completed",
      className: "bg-blue-50 text-blue-700 border-blue-200",
      dot: "bg-blue-500",
    },
    CANCELLED: {
      label: "Exchange Cancelled",
      className: "bg-red-50 text-red-700 border-red-200",
      dot: "bg-red-500",
    },
  };

  const current = config[exchange.status] || {
    label: exchange.status || "Exchange",
    className: "bg-slate-50 text-slate-700 border-slate-200",
    dot: "bg-slate-400",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-xl border px-5 py-3 text-sm font-semibold transition hover:shadow-sm ${current.className}`}
    >
      <span className={`h-2.5 w-2.5 rounded-full ${current.dot}`} />
      {current.label}
    </button>
  );
}