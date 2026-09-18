import {
  ArrowRight,
  CheckCircle2,
  Code2,
  Cloud,
  Database,
  MessageSquare,
  MoreHorizontal,
  Palette,
  Repeat2,
  Sparkles,
  Trophy,
  Users,
} from "lucide-react";

import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { useProfileData } from "../../assets/hooks/useProfileData";

export default function DashBoard() {

  const { data: profileData, isLoading } = useProfileData();
   const userName = profileData?.userName || profileData?.name || "";
   const firstName = userName ? (userName.trim().split(" ")[0]).toUpperCase() : "";
  const stats = [
    {
      title: "Active Exchanges",
      value: "2",
      icon: Repeat2,
      iconBg: "bg-indigo-100",
      iconColor: "text-indigo-600",
    },
    {
      title: "Tasks in Progress",
      value: "5",
      icon: CheckCircle2,
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
    },
    {
      title: "New Matches",
      value: "3",
      icon: Sparkles,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
    },
    {
      title: "Learning Progress",
      value: "80%",
      icon: Trophy,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
    },
  ];

  const learningItems = [
    {
      title: "Spring Boot",
      person: "with Rahul",
      progress: 70,
      icon: Code2,
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
    },
    {
      title: "Docker",
      person: "with Priya",
      progress: 30,
      icon: Cloud,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "System Design",
      person: "with John",
      progress: 0,
      icon: Database,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
    },
  ];

  const skillMatches = [
    {
      name: "Rahul Sharma",
      skill: "Spring Boot",
      wants: "React",
      avatar: "https://i.pravatar.cc/150?img=11",
      match: "95%",
    },
    {
      name: "Priya Singh",
      skill: "Docker",
      wants: "Java",
      avatar: "https://i.pravatar.cc/150?img=32",
      match: "89%",
    },
    {
      name: "John Mathew",
      skill: "System Design",
      wants: "Spring Boot",
      avatar: "https://i.pravatar.cc/150?img=13",
      match: "84%",
    },
  ];

  return (
    <DashboardLayout>
      {/* Welcome */}
      <section className="mb-7">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Welcome back, {firstName}! 👋
        </h2>

        <p className="mt-1 text-sm text-slate-500 sm:text-base">
          Keep learning. Keep growing.
        </p>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-5"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${stat.iconBg}`}
                >
                  <Icon size={21} className={stat.iconColor} />
                </div>

                <div className="min-w-0">
                  <p className="text-xl font-bold text-slate-900 sm:text-2xl">
                    {stat.value}
                  </p>

                  <p className="truncate text-xs font-medium text-slate-400 sm:text-sm">
                    {stat.title}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* Find Matches */}
      <section className="mt-6">
        <div className="relative overflow-hidden rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50 via-purple-50 to-white p-5 sm:p-7">
          <div className="relative z-10 max-w-xl">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-100">
                <Sparkles size={18} className="text-indigo-600" />
              </div>

              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                Smart Matching
              </span>
            </div>

            <h3 className="text-xl font-bold text-slate-900 sm:text-2xl">
              Find Your Skill Matches
            </h3>

            <p className="mt-2 max-w-lg text-sm leading-6 text-slate-500">
              Connect with people who can teach what you want to learn and
              learn from what you already know.
            </p>

            <button className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700">
              Find Matches
              <ArrowRight size={17} />
            </button>
          </div>

          <div className="absolute -right-10 -top-16 h-56 w-56 rounded-full bg-indigo-100/60" />
          <div className="absolute -bottom-24 right-20 h-48 w-48 rounded-full bg-purple-100/50" />

          <div className="absolute right-10 top-10 hidden lg:block">
            <div className="grid grid-cols-3 gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm">
                <Code2 className="text-indigo-500" />
              </div>

              <div className="mt-7 flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm">
                <Palette className="text-purple-500" />
              </div>

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm">
                <Database className="text-emerald-500" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Continue Learning */}
      <section className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-slate-900">
              Continue Learning
            </h3>

            <p className="mt-1 text-sm text-slate-400">
              Pick up where you left off
            </p>
          </div>

          <button className="flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-700">
            View All
            <ArrowRight size={16} />
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {learningItems.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-xl ${item.iconBg}`}
                    >
                      <Icon size={23} className={item.iconColor} />
                    </div>

                    <div>
                      <h4 className="font-bold text-slate-800">
                        {item.title}
                      </h4>

                      <p className="mt-0.5 text-xs text-slate-400">
                        {item.person}
                      </p>
                    </div>
                  </div>

                  <button className="rounded-lg p-1.5 text-slate-400 opacity-0 transition hover:bg-slate-100 group-hover:opacity-100">
                    <MoreHorizontal size={18} />
                  </button>
                </div>

                <div className="mt-6">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-400">
                      {item.progress}% complete
                    </span>

                    <span className="text-xs font-semibold text-slate-600">
                      {item.progress === 100 ? "Completed" : "In progress"}
                    </span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-indigo-500 transition-all"
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Recommended Matches */}
      <section className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-slate-900">
              Recommended Matches
            </h3>

            <p className="mt-1 text-sm text-slate-400">
              People you might want to learn with
            </p>
          </div>

          <button className="hidden items-center gap-1 text-sm font-semibold text-indigo-600 sm:flex">
            See All
            <ArrowRight size={16} />
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {skillMatches.map((match) => (
            <div
              key={match.name}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={match.avatar}
                    alt={match.name}
                    className="h-11 w-11 rounded-full object-cover"
                  />

                  <div>
                    <h4 className="text-sm font-bold text-slate-800">
                      {match.name}
                    </h4>

                    <p className="text-xs text-slate-400">
                      Skill Match
                    </p>
                  </div>
                </div>

                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-600">
                  {match.match}
                </span>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="text-[11px] font-medium text-slate-400">
                    Can teach
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-700">
                    {match.skill}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="text-[11px] font-medium text-slate-400">
                    Wants to learn
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-700">
                    {match.wants}
                  </p>
                </div>
              </div>

              <button className="mt-4 w-full rounded-xl border border-indigo-200 py-2.5 text-sm font-semibold text-indigo-600 transition hover:bg-indigo-50">
                View Profile
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Activity */}
      <section className="mt-8">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-slate-900">
            Recent Activity
          </h3>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="divide-y divide-slate-100">
            <ActivityItem
              icon={Users}
              title="New skill match found"
              description="Rahul can help you learn Spring Boot."
              time="10 min ago"
            />

            <ActivityItem
              icon={MessageSquare}
              title="New message from Priya"
              description="Let's schedule our next learning session."
              time="1 hour ago"
            />

            <ActivityItem
              icon={CheckCircle2}
              title="Task completed"
              description="Completed Docker fundamentals."
              time="3 hours ago"
            />
          </div>
        </div>
      </section>

      <div className="h-8" />
    </DashboardLayout>
  );
}

function ActivityItem({ icon: Icon, title, description, time }) {
  return (
    <div className="flex items-center gap-4 p-4 sm:p-5">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50">
        <Icon size={18} className="text-indigo-600" />
      </div>

      <div className="min-w-0 flex-1">
        <h4 className="text-sm font-semibold text-slate-800">
          {title}
        </h4>

        <p className="mt-0.5 truncate text-xs text-slate-400 sm:text-sm">
          {description}
        </p>
      </div>

      <span className="hidden shrink-0 text-xs text-slate-400 sm:block">
        {time}
      </span>
    </div>
  );
}