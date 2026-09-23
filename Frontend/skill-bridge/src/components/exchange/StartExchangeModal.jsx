import { useMemo, useState } from "react";
import { X, Repeat2, AlertCircle } from "lucide-react";

import { useSkillsData } from "../../assets/hooks/useSkillsData";
import { useCreateExchange } from "../../assets/hooks/useExchangeData";

export default function StartExchangeModal({
    isOpen,
    onClose,
    partner,
    onSuccess,
}) {
    const [formData, setFormData] = useState({
        myTeachingSkillId: "",
        myLearningSkillId: "",
        partnerTeachingSkillId: "",
        partnerLearningSkillId: "",
    });

    const [error, setError] = useState("");

    const {
        data: mySkills = [],
        isLoading: mySkillsLoading,
    } = useSkillsData();

    const createExchangeMutation = useCreateExchange();


    const myTeachingSkills = useMemo(() => {
        return mySkills.filter(
            (skill) => skill.skillType === "TEACH"
        );
    }, [mySkills]);

    const myLearningSkills = useMemo(() => {
        return mySkills.filter(
            (skill) => skill.skillType === "LEARN"
        );
    }, [mySkills]);

    const partnerTeachingSkills = useMemo(() => {
        return (partner?.skills || []).filter(
            (skill) => skill.skillType === "TEACH"
        );
    }, [partner]);

    const partnerLearningSkills = useMemo(() => {
        return (partner?.skills || []).filter(
            (skill) => skill.skillType === "LEARN"
        );
    }, [partner]);

    const handleChange = (field, value) => {
        setFormData((previous) => ({
            ...previous,
            [field]: value,
        }));

        setError("");
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");

        if (!formData.myTeachingSkillId) {
            setError("Please select the skill you will teach.");
            return;
        }

        if (!formData.myLearningSkillId) {
            setError("Please select the skill you want to learn.");
            return;
        }

        if (!formData.partnerTeachingSkillId) {
            setError("Please select the skill your partner will teach.");
            return;
        }

        if (!formData.partnerLearningSkillId) {
            setError("Please select the skill your partner wants to learn.");
            return;
        }

        try {
            await createExchangeMutation.mutateAsync({
                partnerId: Number(partner.id),

                myTeachingSkillId: Number(
                    formData.myTeachingSkillId
                ),

                myLearningSkillId: Number(
                    formData.myLearningSkillId
                ),

                partnerTeachingSkillId: Number(
                    formData.partnerTeachingSkillId
                ),

                partnerLearningSkillId: Number(
                    formData.partnerLearningSkillId
                ),
            });

            setFormData({
                myTeachingSkillId: "",
                myLearningSkillId: "",
                partnerTeachingSkillId: "",
                partnerLearningSkillId: "",
            });

            onSuccess?.();

            onClose();
        } catch (err) {
            console.error(
                "Create exchange error:",
                err
            );

            setError(
                err.response?.data?.message ||
                err.response?.data?.general ||
                "Unable to start the skill exchange."
            );
        }
    };

    if (!isOpen) {
        return null;
    }

    const isSubmitting = createExchangeMutation.isPending;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">

            <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">

                {/* Header */}
                <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4 sm:px-6">

                    <div className="flex items-center gap-3">

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50">
                            <Repeat2
                                size={22}
                                className="text-indigo-600"
                            />
                        </div>

                        <div>
                            <h2 className="text-lg font-bold text-slate-800 sm:text-xl">
                                Start Skill Exchange
                            </h2>

                            <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">
                                Choose what both of you will exchange
                            </p>
                        </div>

                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <X size={21} />
                    </button>

                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>

                    <div className="space-y-6 p-5 sm:p-6">

                        {/* Error */}
                        {error && (
                            <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">

                                <AlertCircle
                                    size={18}
                                    className="mt-0.5 shrink-0"
                                />

                                <p>{error}</p>

                            </div>
                        )}

                        {/* YOUR TEACHING SKILL */}
                        <SkillSelect
                            label="You will teach"
                            value={formData.myTeachingSkillId}
                            onChange={(value) =>
                                handleChange(
                                    "myTeachingSkillId",
                                    value
                                )
                            }
                            skills={myTeachingSkills}
                            getValue={(skill) =>
                                skill.id
                            }
                            getLabel={(skill) =>
                                skill.name ||
                                skill.skillName
                            }
                            disabled={
                                isSubmitting ||
                                mySkillsLoading
                            }
                            placeholder="Select a skill"
                        />

                        {/* YOUR LEARNING SKILL */}
                        <SkillSelect
                            label="You want to learn"
                            value={formData.myLearningSkillId}
                            onChange={(value) =>
                                handleChange(
                                    "myLearningSkillId",
                                    value
                                )
                            }
                            skills={myLearningSkills}
                            getValue={(skill) =>
                                skill.id
                            }
                            getLabel={(skill) =>
                                skill.name ||
                                skill.skillName
                            }
                            disabled={
                                isSubmitting ||
                                mySkillsLoading
                            }
                            placeholder="Select a skill"
                        />

                        <div className="border-t border-slate-100" />

                        {/* PARTNER TEACHING SKILL */}
                        <SkillSelect
                            label={`${partner?.userName || "Partner"} will teach`}
                            value={
                                formData.partnerTeachingSkillId
                            }
                            onChange={(value) =>
                                handleChange(
                                    "partnerTeachingSkillId",
                                    value
                                )
                            }
                            skills={partnerTeachingSkills}

                            getValue={(skill) =>
                                skill.userSkillId
                            }

                            getLabel={(skill) =>
                                skill.skillName
                            }

                            disabled={isSubmitting}
                            placeholder="Select a skill"
                        />

                        {/* PARTNER LEARNING SKILL */}
                        <SkillSelect
                            label={`${partner?.userName || "Partner"} wants to learn`}
                            value={
                                formData.partnerLearningSkillId
                            }
                            onChange={(value) =>
                                handleChange(
                                    "partnerLearningSkillId",
                                    value
                                )
                            }
                            skills={partnerLearningSkills}
                            
                            getValue={(skill) =>
                                skill.userSkillId
                            }

                            getLabel={(skill) =>
                                skill.skillName
                            }

                            disabled={isSubmitting}
                            placeholder="Select a skill"
                        />

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
                            disabled={
                                isSubmitting ||
                                mySkillsLoading
                            }
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isSubmitting ? (
                                <>
                                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                                    Starting...
                                </>
                            ) : (
                                <>
                                    <Repeat2 size={17} />
                                    Start Exchange
                                </>
                            )}
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}


/*
 * Reusable skill dropdown
 */
function SkillSelect({
    label,
    value,
    onChange,
    skills,
    getValue,
    getLabel,
    disabled,
    placeholder,
}) {
    return (
        <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
                {label}
            </label>

            <select
                value={value}
                onChange={(event) =>
                    onChange(event.target.value)
                }
                disabled={disabled}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-50"
            >
                <option value="">
                    {placeholder}
                </option>

                {skills.map((skill) => (
                    <option
                        key={getValue(skill)}
                        value={getValue(skill)}
                    >
                        {getLabel(skill)}
                    </option>
                ))}
            </select>
        </div>
    );
}