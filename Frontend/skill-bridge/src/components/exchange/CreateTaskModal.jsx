import  { useState } from "react";
import {
    ClipboardPlus,
    X,
} from "lucide-react";

import { useCreateTask } from "../../assets/hooks/useTaskData";


export default function CreateTaskModal({
    isOpen,
    onClose,
    exchangeId,
    partner,
}) {

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const createTask = useCreateTask();


    if (!isOpen) {
        return null;
    }


    const handleSubmit = (e) => {
        e.preventDefault();

        if (!title.trim()) {
            return;
        }

        createTask.mutate(
            {
                exchangeId: Number(exchangeId),

                assignedToId: Number(partner.id),

                title: title.trim(),

                description: description.trim(),
            },

            {
                onSuccess: () => {
                    setTitle("");
                    setDescription("");

                    onClose();
                },
            }
        );
    };


    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

            <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">

                {/* Header */}

                <div className="flex items-center justify-between border-b px-6 py-4">

                    <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50">

                            <ClipboardPlus
                                className="h-5 w-5 text-indigo-600"
                            />

                        </div>

                        <div>

                            <h2 className="text-lg font-semibold text-slate-900">
                                Create Task
                            </h2>

                            <p className="text-sm text-slate-500">
                                Assign a task to {partner?.userName}
                            </p>

                        </div>

                    </div>


                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                    >
                        <X className="h-5 w-5" />
                    </button>

                </div>


                {/* Form */}

                <form
                    onSubmit={handleSubmit}
                    className="space-y-5 p-6"
                >

                    {/* Title */}

                    <div>

                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Task title
                        </label>

                        <input
                            type="text"
                            value={title}
                            onChange={(e) =>
                                setTitle(e.target.value)
                            }
                            placeholder="Example: Build Login Page"
                            maxLength={150}
                            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                        />

                    </div>


                    {/* Description */}

                    <div>

                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Description
                        </label>

                        <textarea
                            value={description}
                            onChange={(e) =>
                                setDescription(e.target.value)
                            }
                            placeholder="Explain what needs to be completed..."
                            maxLength={1000}
                            rows={5}
                            className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                        />

                        <p className="mt-1 text-right text-xs text-slate-400">
                            {description.length}/1000
                        </p>

                    </div>


                    {/* Error */}

                    {createTask.isError && (
                        <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                            {createTask.error?.response?.data?.message ||
                                "Failed to create task"}
                        </div>
                    )}


                    {/* Buttons */}

                    <div className="flex justify-end gap-3">

                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                        >
                            Cancel
                        </button>


                        <button
                            type="submit"
                            disabled={
                                !title.trim() ||
                                createTask.isPending
                            }
                            className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {createTask.isPending
                                ? "Creating..."
                                : "Create Task"}
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}