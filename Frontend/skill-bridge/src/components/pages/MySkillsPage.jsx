import { useState } from "react";
import {
  Plus,
  Edit3,
  Trash2,
  BookOpen,
  GraduationCap,
  Sparkles,
  Clock3,
} from "lucide-react";

import DashboardLayout from "../../components/dashboard/DashboardLayout";

export default function MySkillsPage() {
  const [activeTab, setActiveTab] = useState("teaching");

  const teachingSkills = [
    {
      id: 1,
      name: "Java",
      level: "Advanced",
      experience: "3 years",
      description: "Core Java, OOP, Collections, Streams and Multithreading.",
    },
    {
      id: 2,
      name: "Spring Boot",
      level: "Intermediate",
      experience: "2 years",
      description: "REST APIs, Spring Security, JPA and backend development.",
    },
    {
      id: 3,
      name: "REST API Development",
      level: "Advanced",
      experience: "3 years",
      description: "Designing and developing scalable RESTful APIs.",
    },
  ];

  const learningSkills = [
    {
      id: 1,
      name: "React",
      level: "Intermediate",
      goal: "Build production-ready frontend applications.",
    },
    {
      id: 2,
      name: "Docker",
      level: "Beginner",
      goal: "Learn containerization and deployment workflows.",
    },
    {
      id: 3,
      name: "System Design",
      level: "Beginner",
      goal: "Understand scalable distributed system architecture.",
    },
  ];

  const skills =
    activeTab === "teaching" ? teachingSkills : learningSkills;

  return (
    <DashboardLayout>
      {/* Header */}
      <section className="mb-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
              Skills
            </p>

            <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              My Skills
            </h1>

            <p className="mt-1 text-sm text-slate-500 sm:text-base">
              Manage what you can teach and what you want to learn.
            </p>
          </div>

          <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-100 transition hover:bg-indigo-700">
            <Plus size={18} />
            Add Skill
          </button>
        </div>
      </section>

      {/* Summary */}
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
        <SummaryCard
          icon={BookOpen}
          title="Teaching"
          value={teachingSkills.length}
          bg="bg-emerald-50"
          color="text-emerald-600"
        />

        <SummaryCard
          icon={GraduationCap}
          title="Learning"
          value={learningSkills.length}
          bg="bg-purple-50"
          color="text-purple-600"
        />

        <SummaryCard
          icon={Sparkles}
          title="Total Skills"
          value={teachingSkills.length + learningSkills.length}
          bg="bg-indigo-50"
          color="text-indigo-600"
        />
      </section>

      {/* Tabs */}
      <section className="mt-6">
        <div className="flex rounded-xl border border-slate-200 bg-white p-1.5 shadow-sm sm:w-fit">
          <button
            onClick={() => setActiveTab("teaching")}
            className={`
              flex flex-1 items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition sm:flex-none
              ${
                activeTab === "teaching"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
              }
            `}
          >
            <BookOpen size={16} />
            Skills I Teach
          </button>

          <button
            onClick={() => setActiveTab("learning")}
            className={`
              flex flex-1 items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition sm:flex-none
              ${
                activeTab === "learning"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
              }
            `}
          >
            <GraduationCap size={16} />
            Skills I Want to Learn
          </button>
        </div>
      </section>

      {/* Skill Cards */}
      <section className="mt-6">
        {skills.length === 0 ? (
          <EmptyState type={activeTab} />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {skills.map((skill) => (
              <SkillCard
                key={skill.id}
                skill={skill}
                learning={activeTab === "learning"}
              />
            ))}
          </div>
        )}
      </section>

      {/* Bottom CTA */}
      <section className="mt-8">
        <div className="relative overflow-hidden rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50 via-purple-50 to-white p-5 sm:p-7">
          <div className="relative z-10 max-w-2xl">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-100">
                <Sparkles size={18} className="text-indigo-600" />
              </div>

              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                Smart Matching
              </span>
            </div>

            <h3 className="mt-3 text-xl font-bold text-slate-900 sm:text-2xl">
              Keep your skills updated
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              The more accurate your skills are, the better SkillBridge can
              find people who complement your learning goals.
            </p>
          </div>

          <div className="absolute -right-10 -top-16 h-48 w-48 rounded-full bg-indigo-100/60" />
          <div className="absolute -bottom-20 right-20 h-40 w-40 rounded-full bg-purple-100/50" />
        </div>
      </section>
    </DashboardLayout>
  );
}

function SummaryCard({
  icon: Icon,
  title,
  value,
  bg,
  color,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex items-center gap-3">
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${bg}`}
        >
          <Icon size={21} className={color} />
        </div>

        <div>
          <p className="text-xl font-bold text-slate-900">
            {value}
          </p>

          <p className="text-xs font-medium text-slate-400 sm:text-sm">
            {title}
          </p>
        </div>
      </div>
    </div>
  );
}

function SkillCard({ skill, learning }) {
  return (
    <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div
            className={`
              flex h-12 w-12 shrink-0 items-center justify-center rounded-xl
              ${
                learning
                  ? "bg-purple-50 text-purple-600"
                  : "bg-emerald-50 text-emerald-600"
              }
            `}
          >
            {learning ? (
              <GraduationCap size={23} />
            ) : (
              <BookOpen size={23} />
            )}
          </div>

          <div className="min-w-0">
            <h3 className="truncate font-bold text-slate-800">
              {skill.name}
            </h3>

            <span className="mt-1 inline-block rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-500">
              {skill.level}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex shrink-0 items-center gap-1">
          <button className="rounded-lg p-2 text-slate-400 transition hover:bg-indigo-50 hover:text-indigo-600">
            <Edit3 size={16} />
          </button>

          <button className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600">
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <p className="mt-5 text-sm leading-6 text-slate-500">
        {learning ? skill.goal : skill.description}
      </p>

      <div className="mt-5 flex items-center gap-2 border-t border-slate-100 pt-4 text-xs text-slate-400">
        <Clock3 size={14} />

        {learning ? "Learning goal" : `${skill.experience} experience`}
      </div>
    </div>
  );
}

function EmptyState({ type }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50">
        {type === "teaching" ? (
          <BookOpen size={25} className="text-indigo-600" />
        ) : (
          <GraduationCap size={25} className="text-indigo-600" />
        )}
      </div>

      <h3 className="mt-4 text-lg font-bold text-slate-800">
        No skills added yet
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">
        Add skills to your profile so SkillBridge can help you find better
        learning and teaching opportunities.
      </p>

      <button className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700">
        <Plus size={17} />
        Add Skill
      </button>
    </div>
  );
}