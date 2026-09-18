import { useEffect, useState, useMemo } from "react";
import { X, Plus, Save, AlertCircle, RefreshCw } from "lucide-react";
import Select from "react-select";
import { useAvailableSkills } from "../hooks/useSkillsData";

const INITIAL_FORM = {
  skillId: "",
  skillType: "TEACH",
  level: "BEGINNER",
  experience: "",
  description: "",
  learningGoal: "",
};

// React Select Base Styling Config
const customSelectStyles = {
  control: (base, state) => ({
    ...base,
    minHeight: "48px",
    borderRadius: "12px",
    borderColor: state.isFocused ? "#6366f1" : "#e2e8f0",
    boxShadow: state.isFocused ? "0 0 0 2px rgba(99,102,241,0.1)" : "none",
    "&:hover": { borderColor: "#6366f1" },
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected
      ? "#4f46e5"
      : state.isFocused
      ? "#eef2ff"
      : "white",
    color: state.isSelected ? "white" : "#334155",
    cursor: "pointer",
  }),
};

// Helper: Safely parse server-side error responses
function parseServerError(serverError) {
  if (!serverError) return "";
  const responseData = serverError.response?.data;

  if (responseData?.message) return responseData.message;
  if (responseData?.general) return responseData.general;

  if (responseData && typeof responseData === "object") {
    const firstVal = Object.values(responseData)[0];
    if (typeof firstVal === "string") return firstVal;
  }

  return serverError.message || "Something went wrong. Please try again.";
}

export default function SkillModal({
  isOpen,
  onClose,
  onSubmit,
  skill,
  isSubmitting,
  serverError,
}) {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [error, setError] = useState("");

  const isEditMode = Boolean(skill);
  const isTeaching = formData.skillType === "TEACH";
  const isLearning = formData.skillType === "LEARN";

  const {
    data: skillsData = [],
    isLoading: skillsLoading,
    isError: skillsError,
    error: skillsFetchError,
    refetch: refetchSkills,
  } = useAvailableSkills();

  // Memoized Options for React-Select
  const skillOptions = useMemo(
    () =>
      skillsData.map((item) => ({
        value: item.skillId,
        label: item.skillName,
        category: item.category,
      })),
    [skillsData]
  );

  const selectedSkillOption = useMemo(
    () =>
      skillOptions.find(
        (option) => Number(option.value) === Number(formData.skillId)
      ) || null,
    [skillOptions, formData.skillId]
  );

  // Sync state on modal visibility changes
  useEffect(() => {
    if (!isOpen) return;

    if (skill) {
      setFormData({
        skillId: skill.skillId || "",
        skillType: skill.skillType || "TEACH",
        level: skill.level || "BEGINNER",
        experience: skill.experience || "",
        description: skill.description || "",
        learningGoal: skill.learningGoal || "",
      });
    } else {
      setFormData(INITIAL_FORM);
    }

    setError("");
  }, [isOpen, skill]);

  const displayedError = error || parseServerError(serverError);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSkillChange = (option) => {
    setFormData((prev) => ({ ...prev, skillId: option ? option.value : "" }));
    setError("");
  };

  const handleSkillTypeChange = (e) => {
    const skillType = e.target.value;
    setFormData((prev) => ({
      ...prev,
      skillType,
      experience: skillType === "TEACH" ? prev.experience : "",
      description: skillType === "TEACH" ? prev.description : "",
      learningGoal: skillType === "LEARN" ? prev.learningGoal : "",
    }));
    setError("");
  };

  const validateForm = () => {
    if (!formData.skillId) return "Please select a skill.";
    if (!formData.skillType) return "Please select a skill type.";
    if (!formData.level) return "Please select your skill level.";
    if (isTeaching && !formData.experience.trim())
      return "Please enter your experience.";
    if (isLearning && !formData.learningGoal.trim())
      return "Please enter your learning goal.";
    return null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    const payload = {
      skillId: Number(formData.skillId),
      skillType: formData.skillType,
      level: formData.level,
      ...(isTeaching && {
        experience: formData.experience.trim(),
        description: formData.description.trim(),
      }),
      ...(isLearning && {
        learningGoal: formData.learningGoal.trim(),
      }),
    };

    onSubmit(payload);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
        {/* Modal Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4 sm:px-6">
          <div>
            <h2 className="text-lg font-bold text-slate-800 sm:text-xl">
              {isEditMode ? "Edit Skill" : "Add Skill"}
            </h2>
            <p className="mt-1 text-xs text-slate-500 sm:text-sm">
              {isEditMode
                ? "Update your skill information."
                : "Add a skill you can teach or want to learn."}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit}>
          <div className="space-y-5 p-5 sm:p-6">
            {/* Banner Error State */}
            {displayedError && (
              <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                <AlertCircle size={18} className="mt-0.5 shrink-0" />
                <p>{displayedError}</p>
              </div>
            )}

            {/* Skill Selector */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Skill Name
              </label>
              <Select
                options={skillOptions}
                value={selectedSkillOption}
                onChange={handleSkillChange}
                isDisabled={isSubmitting || skillsLoading}
                isLoading={skillsLoading}
                isSearchable
                isClearable
                placeholder={
                  skillsLoading
                    ? "Loading skills..."
                    : "Search or select a skill..."
                }
                noOptionsMessage={() => "No skills found"}
                className="text-sm"
                classNamePrefix="skill-select"
                styles={customSelectStyles}
              />

              {skillsError && (
                <div className="mt-2 flex items-center justify-between gap-3 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">
                  <span>
                    {skillsFetchError?.response?.data?.message ||
                      skillsFetchError?.message ||
                      "Unable to load available skills."}
                  </span>
                  <button
                    type="button"
                    onClick={() => refetchSkills()}
                    disabled={skillsLoading}
                    className="inline-flex shrink-0 items-center gap-1 font-semibold text-red-700 hover:underline"
                  >
                    <RefreshCw size={13} />
                    Retry
                  </button>
                </div>
              )}
            </div>

            {/* Category Field */}
            {selectedSkillOption?.category && (
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Category
                </label>
                <div className="flex min-h-12 items-center rounded-xl border border-slate-200 bg-slate-50 px-4">
                  <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600">
                    {selectedSkillOption.category}
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-400">
                  Category is managed by SkillBridge.
                </p>
              </div>
            )}

            {/* Type & Level Selection */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Skill Type
                </label>
                <select
                  name="skillType"
                  value={formData.skillType}
                  onChange={handleSkillTypeChange}
                  disabled={isSubmitting}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-50"
                >
                  <option value="TEACH">I can teach this</option>
                  <option value="LEARN">I want to learn this</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Skill Level
                </label>
                <select
                  name="level"
                  value={formData.level}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-50"
                >
                  <option value="BEGINNER">Beginner</option>
                  <option value="INTERMEDIATE">Intermediate</option>
                  <option value="ADVANCED">Advanced</option>
                </select>
              </div>
            </div>

            {/* Dynamic Teaching Fields */}
            {isTeaching && (
              <>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Experience
                  </label>
                  <input
                    type="text"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    placeholder="e.g. 2 years"
                    maxLength={50}
                    disabled={isSubmitting}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-50"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Tell others what you know about this skill..."
                    rows={4}
                    maxLength={500}
                    disabled={isSubmitting}
                    className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-50"
                  />
                  <p className="mt-1 text-right text-xs text-slate-400">
                    {formData.description.length}/500
                  </p>
                </div>
              </>
            )}

            {/* Dynamic Learning Fields */}
            {isLearning && (
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Learning Goal
                </label>
                <textarea
                  name="learningGoal"
                  value={formData.learningGoal}
                  onChange={handleChange}
                  placeholder="What do you want to achieve with this skill?"
                  rows={4}
                  maxLength={500}
                  disabled={isSubmitting}
                  className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-50"
                />
                <p className="mt-1 text-right text-xs text-slate-400">
                  {formData.learningGoal.length}/500
                </p>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="flex flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting || skillsLoading || skillsError}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Saving...
                </>
              ) : (
                <>
                  {isEditMode ? <Save size={17} /> : <Plus size={17} />}
                  {isEditMode ? "Save Changes" : "Add Skill"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}