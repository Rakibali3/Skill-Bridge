import { useState } from "react";
import {
    X,
    Upload,
    Image as ImageIcon,
    UsersRound,
    Loader2,
} from "lucide-react";
import {
    uploadCommunityCover,
    uploadCommunityIcon,
} from "../../services/cloudinaryService";
import { useCreateCommunity } from "../hooks/useCommunityData";

export default function CreateCommunityModal({ isOpen, onClose }) {
    const createCommunity = useCreateCommunity();

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        category: "",
    });

    const [coverFile, setCoverFile] = useState(null);
    const [iconFile, setIconFile] = useState(null);

    const [coverPreview, setCoverPreview] = useState("");
    const [iconPreview, setIconPreview] = useState("");

    const [error, setError] = useState("");

    if (!isOpen) {
        return null;
    }

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const handleCoverChange = (event) => {
        const file = event.target.files?.[0];

        if (!file) return;

        setCoverFile(file);
        setCoverPreview(URL.createObjectURL(file));
    };

    const handleIconChange = (event) => {
        const file = event.target.files?.[0];

        if (!file) return;

        setIconFile(file);
        setIconPreview(URL.createObjectURL(file));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");

        if (!formData.name.trim()) {
            setError("Community name is required.");
            return;
        }

        try {
            let coverImageUrl = "";
            let iconUrl = "";

            if (coverFile) {
                coverImageUrl = await uploadCommunityCover(coverFile);
            }

            if (iconFile) {
                iconUrl = await uploadCommunityIcon(iconFile);
            }

            await createCommunity.mutateAsync({
                name: formData.name.trim(),
                description: formData.description.trim(),
                category: formData.category.trim(),
                coverImageUrl,
                iconUrl,
            });

            // Reset form
            setFormData({
                name: "",
                description: "",
                category: "",
            });

            setCoverFile(null);
            setIconFile(null);
            setCoverPreview("");
            setIconPreview("");

            onClose();
        } catch (err) {
            setError(
                err?.response?.data?.message ||
                err?.message ||
                "Failed to create community."
            );
        }
    };

    const handleClose = () => {
        if (createCommunity.isPending) return;

        setError("");
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl">

                {/* Header */}
                <div className="flex items-center justify-between border-b px-6 py-5">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">
                            Create Community
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Create a space where people can learn and share
                            skills.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={handleClose}
                        className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6 p-6">

                    {/* Error */}
                    {error && (
                        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                            {error}
                        </div>
                    )}

                    {/* Community Name */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Community Name
                        </label>

                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="e.g. React Developers"
                            maxLength={100}
                            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                        />
                    </div>

                    {/* Category */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Category
                        </label>

                        <input
                            type="text"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            placeholder="e.g. Web Development"
                            maxLength={100}
                            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Description
                        </label>

                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Describe what this community is about..."
                            maxLength={1000}
                            rows={4}
                            className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                        />
                    </div>

                    {/* Cover */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Cover Image
                        </label>

                        <label className="block cursor-pointer">
                            <div className="relative flex h-40 items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 transition hover:border-slate-400">

                                {coverPreview ? (
                                    <img
                                        src={coverPreview}
                                        alt="Cover preview"
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="text-center">
                                        <ImageIcon
                                            className="mx-auto text-slate-400"
                                            size={32}
                                        />

                                        <p className="mt-2 text-sm font-medium text-slate-600">
                                            Upload cover image
                                        </p>

                                        <p className="mt-1 text-xs text-slate-400">
                                            Recommended for community banner
                                        </p>
                                    </div>
                                )}

                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleCoverChange}
                                    className="hidden"
                                />
                            </div>
                        </label>
                    </div>

                    {/* Icon */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Community Icon
                        </label>

                        <label className="inline-block cursor-pointer">
                            <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 transition hover:border-slate-400">

                                {iconPreview ? (
                                    <img
                                        src={iconPreview}
                                        alt="Community icon preview"
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="text-center">
                                        <UsersRound
                                            className="mx-auto text-slate-400"
                                            size={28}
                                        />

                                        <p className="mt-1 text-xs text-slate-500">
                                            Upload
                                        </p>
                                    </div>
                                )}

                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleIconChange}
                                    className="hidden"
                                />
                            </div>
                        </label>
                    </div>

                    {/* Buttons */}
                    <div className="flex flex-col-reverse gap-3 border-t pt-5 sm:flex-row sm:justify-end">

                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={createCommunity.isPending}
                            className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={createCommunity.isPending}
                            className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {createCommunity.isPending ? (
                                <>
                                    <Loader2
                                        size={18}
                                        className="animate-spin"
                                    />
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <Upload size={18} />
                                    Create Community
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}