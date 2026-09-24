import { useState } from "react";

import {
    FileText,
    Loader2,
    Upload,
    X,
} from "lucide-react";

import { useSubmitTask } from "../../assets/hooks/useTaskData";
import { uploadFile } from "../../services/cloudinaryService";

export default function SubmitTaskModal({
    isOpen,
    onClose,
    task,
}) {
    const [githubUrl, setGithubUrl] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [error, setError] = useState("");

    const submitTask = useSubmitTask();

    if (!isOpen || !task) {
        return null;
    }

    const handleFileChange = (event) => {
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        setError("");
        setSelectedFile(file);
    };

    const handleRemoveFile = () => {
        setSelectedFile(null);
        setError("");
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");

        if (!githubUrl.trim() && !selectedFile) {
            setError(
                "Please provide a GitHub URL or upload a file."
            );
            return;
        }

        try {
            let submittedFileUrl = null;
            let submittedFileName = null;

            // Upload file to Cloudinary
            if (selectedFile) {
                const uploadedFile = await uploadFile(selectedFile);

                submittedFileUrl = uploadedFile.url;
                submittedFileName = uploadedFile.fileName;
            }

            console.log("File URL:", submittedFileUrl);
            console.log("File Name:", submittedFileName);

            // Send data to Spring Boot
            submitTask.mutate(
                {
                    taskId: task.id,

                    submissionData: {
                        githubUrl: githubUrl.trim() || null,
                        submittedFileUrl: submittedFileUrl,
                        submittedFileName: submittedFileName,
                    },
                },
                {
                    onSuccess: () => {
                        setGithubUrl("");
                        setSelectedFile(null);
                        setError("");

                        onClose();
                    },

                    onError: (error) => {
                        setError(
                            error?.response?.data?.message ||
                            "Failed to submit task."
                        );
                    },
                }
            );

        } catch (error) {
            setError(
                error?.message ||
                "File upload failed."
            );
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">

                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                    <div>
                        <h2 className="text-lg font-semibold text-slate-900">
                            Submit Task
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            {task.title}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={submitTask.isPending}
                        className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Form */}
                <form
                    onSubmit={handleSubmit}
                    className="space-y-5 p-6"
                >

                    {/* GitHub URL */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            GitHub Repository URL
                        </label>

                        <div className="relative">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                                aria-hidden="true"
                            >
                                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                                <path d="M9 18c-4.51 2-5-2-7-2" />
                            </svg>

                            <input
                                type="url"
                                value={githubUrl}
                                onChange={(event) =>
                                    setGithubUrl(
                                        event.target.value
                                    )
                                }
                                placeholder="https://github.com/username/project"
                                className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                            />
                        </div>
                    </div>

                    {/* OR */}
                    <div className="flex items-center gap-3">
                        <div className="h-px flex-1 bg-slate-200" />

                        <span className="text-xs font-medium text-slate-400">
                            OR
                        </span>

                        <div className="h-px flex-1 bg-slate-200" />
                    </div>

                    {/* File Upload */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Upload File
                        </label>

                        <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 px-6 py-8 text-center transition hover:border-indigo-300 hover:bg-indigo-50/30">

                            {selectedFile ? (
                                <>
                                    <FileText className="h-8 w-8 text-indigo-500" />

                                    <p className="mt-2 max-w-full truncate px-4 text-sm font-medium text-slate-700">
                                        {selectedFile.name}
                                    </p>

                                    <p className="mt-1 text-xs text-slate-400">
                                        File selected
                                    </p>
                                </>
                            ) : (
                                <>
                                    <Upload className="h-8 w-8 text-slate-400" />

                                    <p className="mt-2 text-sm font-medium text-slate-700">
                                        Choose a file
                                    </p>

                                    <p className="mt-1 text-xs text-slate-400">
                                        JavaScript, Java, Python, PDF, ZIP,
                                        DOCX or other files
                                    </p>
                                </>
                            )}

                            <input
                                type="file"
                                className="hidden"
                                onChange={handleFileChange}
                                disabled={submitTask.isPending}
                            />
                        </label>
                    </div>

                    {/* Selected File */}
                    {selectedFile && (
                        <div className="rounded-xl bg-slate-50 px-4 py-3">
                            <div className="flex items-center justify-between">

                                <div className="min-w-0">
                                    <p className="truncate text-sm font-medium text-slate-700">
                                        {selectedFile.name}
                                    </p>

                                    <p className="text-xs text-slate-400">
                                        {(
                                            selectedFile.size /
                                            1024 /
                                            1024
                                        ).toFixed(2)}{" "}
                                        MB
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={handleRemoveFile}
                                    disabled={
                                        submitTask.isPending
                                    }
                                    className="ml-3 text-xs font-medium text-red-500 hover:text-red-700"
                                >
                                    Remove
                                </button>

                            </div>
                        </div>
                    )}

                    {/* Error */}
                    {error && (
                        <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                            {error}
                        </div>
                    )}

                    {/* Buttons */}
                    <div className="flex justify-end gap-3">

                        <button
                            type="button"
                            onClick={onClose}
                            disabled={submitTask.isPending}
                            className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={submitTask.isPending}
                            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {submitTask.isPending ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Submitting...
                                </>
                            ) : (
                                <>
                                    <Upload className="h-4 w-4" />
                                    Submit Task
                                </>
                            )}
                        </button>

                    </div>
                </form>
            </div>
        </div>
    );
}