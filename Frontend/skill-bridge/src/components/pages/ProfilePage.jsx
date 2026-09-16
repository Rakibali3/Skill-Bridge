import { useEffect, useState } from "react";
import {
  Camera,
  Edit3,
  Mail,
  MapPin,
  Briefcase,
  Award,
  CheckCircle2,
  X,
  Save,
} from "lucide-react";

import DashboardLayout from "../../components/dashboard/DashboardLayout";
import api from "../../API/axios";
import { uploadImage } from "../../services/cloudinaryService";

const INITIAL_PROFILE = {
  id: null,
  userName: "",
  email: "",
  bio: "",
  location: "",
  experience: "",
  learningStyle: "",
  preferredFormat: "",
  availability: "",
  avatarUrl: "",
};

export default function ProfilePage() {
  const [profileData, setProfileData] = useState(INITIAL_PROFILE);
  const [formData, setFormData] = useState(INITIAL_PROFILE);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError("");
      const { data } = await api.get("/profile");
      setProfileData(data);
    } catch (err) {
      console.error("Failed to fetch profile:", err);
      setError(err.response?.data?.message || "Unable to load your profile.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProfile();
  }, []);

  const handleEditProfile = () => {
    setFormData({
      bio: profileData.bio || "",
      location: profileData.location || "",
      experience: profileData.experience || "",
      learningStyle: profileData.learningStyle || "",
      preferredFormat: profileData.preferredFormat || "",
      availability: profileData.availability || "",
    });
    setImagePreview(profileData.avatarUrl || "");
    setSelectedImage(null);
    setError("");
    setSuccess("");
    setIsEditing(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setError("Please select a JPG, PNG, or WEBP image.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("Image size must be less than 10 MB.");
      return;
    }

    setError("");
    setSelectedImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      if (selectedImage) {
        const imageUrl = await uploadImage(selectedImage);
        await api.put("/profile/avatar", { avatarUrl: imageUrl });
      }

      await api.put("/profile", formData);
      await fetchProfile();

      resetFormState();
      setSuccess("Profile updated successfully.");
    } catch (err) {
      console.error("Failed to update profile:", err);
      setError(
        err.response?.data?.message || err.message || "Unable to update profile."
      );
    } finally {
      setSaving(false);
    }
  };

  const resetFormState = () => {
    setIsEditing(false);
    setSelectedImage(null);
    setImagePreview("");
    setError("");
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Header */}
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
          {!isEditing && (
            <button
              onClick={handleEditProfile}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-100 transition hover:bg-indigo-700"
            >
              <Edit3 size={17} />
              Edit Profile
            </button>
          )}
        </div>
      </section>

      {/* Notifications */}
      {success && (
        <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
          {success}
        </div>
      )}
      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
          {error}
        </div>
      )}

      {/* Profile Banner */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="h-32 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-500 sm:h-40" />
        <div className="px-5 pb-6 sm:px-8">
          <div className="-mt-16 flex flex-col gap-5 sm:-mt-20 sm:flex-row sm:items-end sm:justify-between">
            <div className="relative w-fit">
              <img
                src={
                  imagePreview ||
                  profileData.avatarUrl ||
                  "https://ui-avatars.com/api/?name=User&background=6366f1&color=fff"
                }
                alt={profileData.userName || "Profile"}
                className="h-32 w-32 rounded-3xl border-4 border-white object-cover shadow-lg sm:h-36 sm:w-36"
              />
              {isEditing && (
                <label className="absolute bottom-2 right-2 flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border-2 border-white bg-indigo-600 text-white shadow-md transition hover:bg-indigo-700">
                  <input
                    type="file"
                    className="hidden"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={handleImageChange}
                  />
                  <Camera size={16} />
                </label>
              )}
            </div>

            <div className="flex-1 sm:pb-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-2xl font-bold text-slate-900">
                  {profileData.userName || "Your Name"}
                </h2>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-600">
                  <CheckCircle2 size={13} /> Active
                </span>
              </div>
              <p className="mt-1 text-sm text-slate-400">{profileData.email}</p>
            </div>

            <div className="rounded-xl bg-indigo-50 px-4 py-2.5 text-center sm:mb-1">
              <p className="text-[11px] font-medium uppercase tracking-wide text-indigo-400">
                Account Type
              </p>
              <p className="mt-0.5 text-sm font-bold text-indigo-600">
                Skill Explorer
              </p>
            </div>
          </div>

          <p className="mt-6 max-w-3xl text-sm leading-6 text-slate-600">
            {profileData.bio || "Add a short introduction about yourself."}
          </p>

          <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <Mail size={16} className="text-slate-400" />
              {profileData.email || "No email"}
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={16} className="text-slate-400" />
              {profileData.location || "Location not added"}
            </div>
          </div>
        </div>
      </section>

      {/* Form Edit Section */}
      {isEditing && (
        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900">Edit Profile</h3>
              <p className="mt-1 text-xs text-slate-400">
                Update your personal and learning information.
              </p>
            </div>
            <button
              onClick={resetFormState}
              disabled={saving}
              className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            >
              <X size={20} />
            </button>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-700">Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={4}
                maxLength={500}
                placeholder="Tell others a little about yourself..."
                className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                maxLength={100}
                placeholder="e.g. Hyderabad, India"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Experience</label>
              <input
                type="text"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                maxLength={50}
                placeholder="e.g. 2 years"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Learning Style</label>
              <select
                name="learningStyle"
                value={formData.learningStyle}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              >
                <option value="">Select learning style</option>
                <option value="Hands-on">Hands-on</option>
                <option value="Visual">Visual</option>
                <option value="Reading">Reading</option>
                <option value="Discussion">Discussion</option>
                <option value="Mixed">Mixed</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Preferred Format</label>
              <select
                name="preferredFormat"
                value={formData.preferredFormat}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              >
                <option value="">Select format</option>
                <option value="Online Sessions">Online Sessions</option>
                <option value="In Person">In Person</option>
                <option value="Both">Both</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Availability</label>
              <select
                name="availability"
                value={formData.availability}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              >
                <option value="">Select availability</option>
                <option value="Weekdays">Weekdays</option>
                <option value="Weekends">Weekends</option>
                <option value="Evenings">Evenings</option>
                <option value="Flexible">Flexible</option>
              </select>
            </div>
          </div>

          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              onClick={resetFormState}
              disabled={saving}
              className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveProfile}
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Save size={17} />
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </section>
      )}

      {/* Info & Stats Grid */}
      <section className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50">
              <Briefcase size={19} className="text-indigo-600" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">About Me</h3>
              <p className="text-xs text-slate-400">
                A little more about your professional journey
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <InfoItem label="Experience" value={profileData.experience || "Not added"} />
            <InfoItem label="Learning Style" value={profileData.learningStyle || "Not added"} />
            <InfoItem label="Preferred Format" value={profileData.preferredFormat || "Not added"} />
            <InfoItem label="Availability" value={profileData.availability || "Not added"} />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50">
              <Award size={19} className="text-amber-600" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">Learning Stats</h3>
              <p className="text-xs text-slate-400">Your SkillBridge journey</p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <StatRow label="Skills Teaching" value="0" />
            <StatRow label="Skills Learning" value="0" />
            <StatRow label="Exchanges Completed" value="0" />
            <StatRow label="People Helped" value="0" />
          </div>
        </div>
      </section>
    </DashboardLayout>
  );
}

function InfoItem({ label, value }) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">
      <p className="text-xs font-medium text-slate-400">{label}</p>
      <p className="mt-1 text-sm font-semibold text-slate-700">{value}</p>
    </div>
  );
}

function StatRow({ label, value }) {
  return (
    <div className="flex items-center justify-between border-b border-slate-100 pb-3 last:border-0 last:pb-0">
      <span className="text-sm text-slate-500">{label}</span>
      <span className="font-bold text-slate-800">{value}</span>
    </div>
  );
}