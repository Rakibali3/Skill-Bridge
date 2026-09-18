import { useEffect, useState } from "react";
import { X, Plus, Save } from "lucide-react";

const initialForm = {
  skillName: "",
  skillType: "TEACH",
  level: "BEGINNER",
  experience: "",
  description: "",
  learningGoal: "",
};

export default function SkillModal({
  isOpen,
  onClose,
  onSubmit,
  skill,
  isSubmitting,
}) {
  const [formData, setFormData] = useState(initialForm);
  const [error, setError] = useState("");

  const isEditMode = Boolean(skill);
  const isTeaching = formData.skillType === "TEACH";
  const isLearning = formData.skillType === "LEARN";

  /* -------------------------------------------------------
     Load data
  ------------------------------------------------------- */

  useEffect(() => {
    if (!isOpen) return;

    if (skill) {
      setFormData({
        skillName: skill.skillName || "",
        skillType: skill.skillType || "TEACH",
        level: skill.level || "BEGINNER",
        experience: skill.experience || "",
        description: skill.description || "",
        learningGoal: skill.learningGoal || "",
      });
    } else {
      setFormData(initialForm);
    }

    setError("");
  }, [isOpen, skill]);


  /* -------------------------------------------------------
     Handle input
  ------------------------------------------------------- */

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  };


  /* -------------------------------------------------------
     Handle skill type change
  ------------------------------------------------------- */

  const handleSkillTypeChange = (event) => {
    const skillType = event.target.value;

    setFormData((previous) => ({
      ...previous,
      skillType,

      // Clear fields that don't belong to selected type
      experience:
        skillType === "TEACH"
          ? previous.experience
          : "",

      description:
        skillType === "TEACH"
          ? previous.description
          : "",

      learningGoal:
        skillType === "LEARN"
          ? previous.learningGoal
          : "",
    }));

    setError("");
  };


  /* -------------------------------------------------------
     Submit
  ------------------------------------------------------- */

  const handleSubmit = (event) => {
    event.preventDefault();

    const skillName = formData.skillName.trim();

    if (!skillName) {
      setError("Skill name is required.");
      return;
    }

    if (!formData.skillType) {
      setError("Please select a skill type.");
      return;
    }

    if (!formData.level) {
      setError("Please select your skill level.");
      return;
    }

    // Teaching validation
    if (isTeaching && !formData.experience.trim()) {
      setError("Please enter your experience.");
      return;
    }

    // Learning validation
    if (isLearning && !formData.learningGoal.trim()) {
      setError("Please enter your learning goal.");
      return;
    }

    const data = {
      skillName,
      skillType: formData.skillType,
      level: formData.level,

      // Only send relevant fields
      ...(isTeaching && {
        experience: formData.experience.trim(),
        description: formData.description.trim(),
      }),

      ...(isLearning && {
        learningGoal: formData.learningGoal.trim(),
      }),
    };

    onSubmit(data);
  };


  /* -------------------------------------------------------
     Don't render
  ------------------------------------------------------- */

  if (!isOpen) {
    return null;
  }


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">

      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">

        {/* Header */}
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
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
          >
            <X size={20} />
          </button>

        </div>


        {/* Form */}
        <form onSubmit={handleSubmit}>

          <div className="space-y-5 p-5 sm:p-6">

            {/* Error */}
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}


            {/* Skill Name */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Skill Name
              </label>

              <input
                type="text"
                name="skillName"
                value={formData.skillName}
                onChange={handleChange}
                placeholder="e.g. React.js"
                maxLength={100}
                disabled={isSubmitting}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-50"
              />
            </div>


            {/* Skill Type + Level */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

              {/* Skill Type */}
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
                  <option value="TEACH">
                    I can teach this
                  </option>

                  <option value="LEARN">
                    I want to learn this
                  </option>
                </select>
              </div>


              {/* Level */}
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
                  <option value="BEGINNER">
                    Beginner
                  </option>

                  <option value="INTERMEDIATE">
                    Intermediate
                  </option>

                  <option value="ADVANCED">
                    Advanced
                  </option>
                </select>
              </div>

            </div>


            {/* =================================================
                TEACHING FIELDS
            ================================================= */}

            {isTeaching && (
              <>
                {/* Experience */}
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


                {/* Description */}
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


            {/* =================================================
                LEARNING FIELDS
            ================================================= */}

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


          {/* Footer */}
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
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Saving...
                </>
              ) : (
                <>
                  {isEditMode ? (
                    <Save size={17} />
                  ) : (
                    <Plus size={17} />
                  )}

                  {isEditMode
                    ? "Save Changes"
                    : "Add Skill"}
                </>
              )}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
}