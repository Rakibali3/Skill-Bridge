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
import {
  useSkillsData,
  useAddSkill,
  useUpdateSkill,
  useDeleteSkill,
} from "../../assets/hooks/useSkillsData";
import SkillModal from "../../assets/modals/SkillModal";

export default function MySkillsPage() {
  const [activeTab, setActiveTab] = useState("teaching");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState(null);

  const {
    data: skillsData = [],
    isLoading,
    isError,
    error: fetchError,
  } = useSkillsData();

  const addSkill = useAddSkill();
  const updateSkill = useUpdateSkill();
  const deleteSkill = useDeleteSkill();

  const teachingSkills = skillsData.filter((s) => s.skillType === "TEACH");
  const learningSkills = skillsData.filter((s) => s.skillType === "LEARN");
  const isLearningTab = activeTab === "learning";
  const displayedSkills = isLearningTab ? learningSkills : teachingSkills;

  const handleOpenModal = (skill = null) => {
    setSelectedSkill(skill);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    if (addSkill.isPending || updateSkill.isPending) return;

    addSkill.reset();
    updateSkill.reset();
    setIsModalOpen(false);
    setSelectedSkill(null);
  };

  const handleSubmitSkill = (skillData) => {
    const options = {
      onSuccess: () => {
        handleCloseModal();
      },
    };

    if (selectedSkill) {
      updateSkill.mutate({ id: selectedSkill.id, skillData }, options);
    } else {
      addSkill.mutate(skillData, options);
    }
  };

  const handleDeleteSkill = (id) => {
    if (window.confirm("Are you sure you want to delete this skill?")) {
      deleteSkill.mutate(id);
    }
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">
                My Skills
              </h1>
              <p className="mt-1 text-sm text-slate-500 sm:text-base">
                Manage the skills you teach and the skills you want to learn.
              </p>
            </div>

            <button
              type="button"
              onClick={() => handleOpenModal()}
              className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 sm:w-auto"
            >
              <Plus size={18} />
              Add Skill
            </button>
          </div>

          {/* Metrics Overview */}
          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <SummaryCard
              title="Teaching"
              count={teachingSkills.length}
              icon={<BookOpen size={23} />}
              iconClass="bg-emerald-50 text-emerald-600"
            />
            <SummaryCard
              title="Learning"
              count={learningSkills.length}
              icon={<GraduationCap size={23} />}
              iconClass="bg-purple-50 text-purple-600"
            />
            <SummaryCard
              title="Total Skills"
              count={skillsData.length}
              icon={<Sparkles size={23} />}
              iconClass="bg-indigo-50 text-indigo-600"
            />
          </div>

          {/* Filter Tabs */}
          <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
            <div className="grid grid-cols-2 gap-2">
              <TabButton
                active={!isLearningTab}
                onClick={() => setActiveTab("teaching")}
                icon={<BookOpen size={17} />}
                label="Teaching"
                count={teachingSkills.length}
              />
              <TabButton
                active={isLearningTab}
                onClick={() => setActiveTab("learning")}
                icon={<GraduationCap size={17} />}
                label="Learning"
                count={learningSkills.length}
              />
            </div>
          </div>

          {/* Content Area */}
          {isLoading && <LoadingState />}

          {isError && !isLoading && (
            <ErrorState
              message={
                fetchError?.response?.data?.message ||
                fetchError?.message ||
                "Something went wrong while loading your skills."
              }
            />
          )}

          {!isLoading && !isError && (
            <>
              {displayedSkills.length > 0 ? (
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {displayedSkills.map((skill) => (
                    <SkillCard
                      key={skill.id}
                      skill={skill}
                      learning={isLearningTab}
                      onEdit={() => handleOpenModal(skill)}
                      onDelete={handleDeleteSkill}
                      isDeleting={
                        deleteSkill.isPending &&
                        deleteSkill.variables === skill.id
                      }
                    />
                  ))}
                </div>
              ) : (
                <EmptyState
                  learning={isLearningTab}
                  onAdd={() => handleOpenModal()}
                />
              )}
            </>
          )}

          {/* Match Banner */}
          {!isLoading && !isError && skillsData.length > 0 && (
            <div className="mt-8 overflow-hidden rounded-2xl bg-indigo-600 p-6 shadow-sm sm:p-8">
              <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="mb-3 flex items-center gap-2 text-indigo-100">
                    <Sparkles size={18} />
                    <span className="text-sm font-semibold">
                      Smart Matching
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-white sm:text-2xl">
                    Find people who complement your skills
                  </h2>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-indigo-100">
                    Discover users who can teach what you want to learn and learn
                    what you can teach.
                  </p>
                </div>

                <button
                  type="button"
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-indigo-600 transition hover:bg-indigo-50"
                >
                  <Sparkles size={17} />
                  Find Skill Matches
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add / Edit Dialog */}
      <SkillModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitSkill}
        skill={selectedSkill}
        isSubmitting={addSkill.isPending || updateSkill.isPending}
        serverError={addSkill.error || updateSkill.error}
      />
    </DashboardLayout>
  );
}


function SummaryCard({ title, count, icon, iconClass }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-800">{count}</h2>
        </div>
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl ${iconClass}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon, label, count }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition ${
        active
          ? "bg-indigo-50 text-indigo-700"
          : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
      }`}
    >
      {icon}
      <span>{label}</span>
      <span className="rounded-full bg-white px-2 py-0.5 text-xs shadow-sm">
        {count}
      </span>
    </button>
  );
}

function SkillCard({ skill, learning, onEdit, onDelete, isDeleting }) {
  return (
    <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
              learning
                ? "bg-purple-50 text-purple-600"
                : "bg-emerald-50 text-emerald-600"
            }`}
          >
            {learning ? <GraduationCap size={23} /> : <BookOpen size={23} />}
          </div>

          <div className="min-w-0">
            <h3 className="truncate font-bold text-slate-800">
              {skill.skillName}
            </h3>
            <span className="mt-1 inline-block rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-500">
              {skill.level}
            </span>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            title="Edit skill"
            onClick={onEdit}
            disabled={isDeleting}
            className="cursor-pointer rounded-lg p-2 text-slate-400 transition hover:bg-indigo-50 hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Edit3 size={16} />
          </button>

          <button
            type="button"
            title="Delete skill"
            onClick={() => onDelete(skill.id)}
            disabled={isDeleting}
            className="cursor-pointer rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isDeleting ? (
              <span className="block h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-red-500" />
            ) : (
              <Trash2 size={16} />
            )}
          </button>
        </div>
      </div>

      <p className="mt-5 min-h-[48px] text-sm leading-6 text-slate-500">
        {learning
          ? skill.learningGoal || "No learning goal added."
          : skill.description || "No description added."}
      </p>

      <div className="mt-5 flex items-center gap-2 border-t border-slate-100 pt-4 text-xs text-slate-400">
        <Clock3 size={14} />
        {learning
          ? "Learning goal"
          : `${skill.experience || "No"} experience`}
      </div>

      {skill.category && (
        <div className="mt-3">
          <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-[11px] font-semibold text-indigo-600">
            {skill.category}
          </span>
        </div>
      )}
    </div>
  );
}

function EmptyState({ learning, onAdd }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
      <div
        className={`mx-auto flex h-14 w-14 items-center justify-center rounded-2xl ${
          learning
            ? "bg-purple-50 text-purple-600"
            : "bg-emerald-50 text-emerald-600"
        }`}
      >
        {learning ? <GraduationCap size={27} /> : <BookOpen size={27} />}
      </div>

      <h3 className="mt-5 text-lg font-bold text-slate-800">
        {learning ? "No learning skills yet" : "No teaching skills yet"}
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        {learning
          ? "Add skills you would like to learn from other people."
          : "Add skills that you are confident enough to teach others."}
      </p>

      <button
        type="button"
        onClick={onAdd}
        className="mt-5 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
      >
        <Plus size={17} />
        Add Skill
      </button>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
      <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600" />
      <p className="text-sm font-medium text-slate-500">
        Loading your skills...
      </p>
    </div>
  );
}

function ErrorState({ message }) {
  return (
    <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
      <h3 className="font-semibold text-red-700">Unable to load your skills</h3>
      <p className="mt-1 text-sm text-red-600">{message}</p>
    </div>
  );
}