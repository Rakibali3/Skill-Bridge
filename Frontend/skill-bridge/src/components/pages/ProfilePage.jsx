import {
  Camera,
  Edit3,
  Mail,
  MapPin,
  Calendar,
  Briefcase,
  BookOpen,
  Award,
  CheckCircle2,
} from "lucide-react";

import DashboardLayout from "../../components/dashboard/DashboardLayout";

export default function ProfilePage() {
  const profile = {
    name: "Ali Khan",
    username: "@alikhan",
    email: "ali.khan@example.com",
    location: "Hyderabad, India",
    joined: "September 2026",
    bio: "Full-stack developer passionate about building useful products, learning new technologies, and sharing knowledge with others.",
    role: "Skill Explorer",
    avatar: "https://i.pravatar.cc/300?img=12",
  };

  const teachingSkills = [
    {
      name: "Java",
      level: "Advanced",
      experience: "3 years",
    },
    {
      name: "Spring Boot",
      level: "Intermediate",
      experience: "2 years",
    },
    {
      name: "REST APIs",
      level: "Advanced",
      experience: "3 years",
    },
  ];

  const learningSkills = [
    {
      name: "React",
      level: "Intermediate",
    },
    {
      name: "Docker",
      level: "Beginner",
    },
    {
      name: "System Design",
      level: "Beginner",
    },
  ];

  return (
    <DashboardLayout>
      {/* Page Header */}
      <section className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
          Account
        </p>

        <div className="mt-2 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              My Profile
            </h1>

            <p className="mt-1 text-sm text-slate-500 sm:text-base">
              Manage your personal information and learning identity.
            </p>
          </div>

          <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-100 transition hover:bg-indigo-700">
            <Edit3 size={17} />
            Edit Profile
          </button>
        </div>
      </section>

      {/* Profile Hero */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {/* Cover */}
        <div className="h-32 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-500 sm:h-40" />

        <div className="px-5 pb-6 sm:px-8">
          <div className="-mt-16 flex flex-col gap-5 sm:-mt-20 sm:flex-row sm:items-end sm:justify-between">
            {/* Avatar */}
            <div className="relative w-fit">
              <img
                src={profile.avatar}
                alt={profile.name}
                className="h-32 w-32 rounded-3xl border-4 border-white object-cover shadow-lg sm:h-36 sm:w-36"
              />

              <button className="absolute bottom-2 right-2 flex h-9 w-9 items-center justify-center rounded-xl border-2 border-white bg-indigo-600 text-white shadow-md hover:bg-indigo-700">
                <Camera size={16} />
              </button>
            </div>

            {/* Basic Info */}
            <div className="flex-1 sm:pb-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-2xl font-bold text-slate-900">
                  {profile.name}
                </h2>

                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-600">
                  <CheckCircle2 size={13} />
                  Active
                </span>
              </div>

              <p className="mt-1 text-sm text-slate-400">
                {profile.username}
              </p>
            </div>

            {/* Role */}
            <div className="rounded-xl bg-indigo-50 px-4 py-2.5 text-center sm:mb-1">
              <p className="text-[11px] font-medium uppercase tracking-wide text-indigo-400">
                Account Type
              </p>

              <p className="mt-0.5 text-sm font-bold text-indigo-600">
                {profile.role}
              </p>
            </div>
          </div>

          {/* Bio */}
          <p className="mt-6 max-w-3xl text-sm leading-6 text-slate-600">
            {profile.bio}
          </p>

          {/* Meta */}
          <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <Mail size={16} className="text-slate-400" />
              {profile.email}
            </div>

            <div className="flex items-center gap-2">
              <MapPin size={16} className="text-slate-400" />
              {profile.location}
            </div>

            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-slate-400" />
              Joined {profile.joined}
            </div>
          </div>
        </div>
      </section>

      {/* Profile Information */}
      <section className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* About */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50">
              <Briefcase size={19} className="text-indigo-600" />
            </div>

            <div>
              <h3 className="font-bold text-slate-900">
                About Me
              </h3>

              <p className="text-xs text-slate-400">
                A little more about your professional journey
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <InfoItem
              label="Experience"
              value="3+ Years"
            />

            <InfoItem
              label="Learning Style"
              value="Hands-on"
            />

            <InfoItem
              label="Preferred Format"
              value="Online Sessions"
            />

            <InfoItem
              label="Availability"
              value="Weekends"
            />
          </div>
        </div>

        {/* Learning Stats */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50">
              <Award size={19} className="text-amber-600" />
            </div>

            <div>
              <h3 className="font-bold text-slate-900">
                Learning Stats
              </h3>

              <p className="text-xs text-slate-400">
                Your SkillBridge journey
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <StatRow label="Skills Teaching" value="3" />
            <StatRow label="Skills Learning" value="3" />
            <StatRow label="Exchanges Completed" value="8" />
            <StatRow label="People Helped" value="14" />
          </div>
        </div>
      </section>

      {/* Skills */}
      <section className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Teaching */}
        <SkillSection
          title="Skills I Can Teach"
          subtitle="Knowledge you can share with others"
          icon={BookOpen}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-600"
          skills={teachingSkills}
        />

        {/* Learning */}
        <SkillSection
          title="Skills I Want to Learn"
          subtitle="Technologies you want to improve"
          icon={Award}
          iconBg="bg-purple-50"
          iconColor="text-purple-600"
          skills={learningSkills}
          learning
        />
      </section>
    </DashboardLayout>
  );
}

function InfoItem({ label, value }) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">
      <p className="text-xs font-medium text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-sm font-semibold text-slate-700">
        {value}
      </p>
    </div>
  );
}

function StatRow({ label, value }) {
  return (
    <div className="flex items-center justify-between border-b border-slate-100 pb-3 last:border-0 last:pb-0">
      <span className="text-sm text-slate-500">
        {label}
      </span>

      <span className="font-bold text-slate-800">
        {value}
      </span>
    </div>
  );
}

function SkillSection({
  title,
  subtitle,
  icon: Icon,
  iconBg,
  iconColor,
  skills,
  learning = false,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-center gap-3">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconBg}`}
        >
          <Icon size={19} className={iconColor} />
        </div>

        <div>
          <h3 className="font-bold text-slate-900">
            {title}
          </h3>

          <p className="text-xs text-slate-400">
            {subtitle}
          </p>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        {skills.map((skill) => (
          <div
            key={skill.name}
            className="flex items-center justify-between rounded-xl bg-slate-50 p-4"
          >
            <div>
              <p className="text-sm font-semibold text-slate-800">
                {skill.name}
              </p>

              {!learning && (
                <p className="mt-1 text-xs text-slate-400">
                  {skill.experience}
                </p>
              )}
            </div>

            <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600 shadow-sm">
              {skill.level}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}