import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    Mail,
    Lock,
    Eye,
    EyeOff,
    Users,
    AlertCircle,
    ArrowRight,
} from "lucide-react";

import api from "../../../../API/axios";

const INITIAL_FORM_STATE = {
    email: "",
    password: "",
    rememberMe: false,
};

export default function LoginPage() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState(INITIAL_FORM_STATE);
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [generalError, setGeneralError] = useState("");

    // Validation Logic
    const getFieldError = (field, value) => {
        const trimmedVal = value.trim();
        if (field === "email") {
            if (!trimmedVal) return "Email is required";
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
            if (!emailRegex.test(trimmedVal)) return "Please enter a valid email address";
        }
        if (field === "password") {
            if (!value) return "Password is required";
        }
        return "";
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === "checkbox" ? checked : value;

        setFormData((prev) => ({ ...prev, [name]: newValue }));
        if (name !== "rememberMe") {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
        setGeneralError("");
    };

    const handleBlur = (field) => {
        const errorMessage = getFieldError(field, formData[field]);
        setErrors((prev) => ({ ...prev, [field]: errorMessage }));
    };

    const validateForm = () => {
        const newErrors = {};
        const emailErr = getFieldError("email", formData.email);
        const passwordErr = getFieldError("password", formData.password);

        if (emailErr) newErrors.email = emailErr;
        if (passwordErr) newErrors.password = passwordErr;

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setGeneralError("");

        if (!validateForm()) return;

        try {
            setLoading(true);

            const response = await api.post("/login", {
                email: formData.email.trim().toLowerCase(),
                password: formData.password,
                rememberMe: formData.rememberMe,
            });

            console.log("Login successful:", response.data);
            navigate("/dashboard");
        } catch (error) {
            console.error("Login error:", error);
            const serverErrors = error.response?.data;

            if (serverErrors && typeof serverErrors === "object") {
                setErrors({
                    email: serverErrors.email || "",
                    password: serverErrors.password || "",
                });
                if (serverErrors.general || serverErrors.message) {
                    setGeneralError(serverErrors.general || serverErrors.message);
                }
            } else {
                setGeneralError("Unable to connect to the server. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 px-4 py-6 sm:px-8 lg:flex lg:items-center lg:justify-center">
            <div className="flex min-h-[720px] w-full max-w-7xl overflow-hidden rounded-[32px] bg-white shadow-2xl">

                {/* LEFT SIDE - BRANDING */}
                <div className="relative hidden w-1/2 overflow-hidden bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-800 lg:flex lg:flex-col lg:justify-between">
                    <div
                        className="absolute inset-0 opacity-[0.08]"
                        style={{
                            backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
                            backgroundSize: "28px 28px",
                        }}
                    />
                    <div className="relative z-10 px-16 pt-16">
                        <Link to="/" className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm">
                                <Users className="h-7 w-7 text-white" />
                            </div>
                            <span className="text-3xl font-bold tracking-wide text-white">
                                Skill<span className="text-blue-300">Bridge</span>
                            </span>
                        </Link>
                    </div>

                    <div className="relative z-10 px-16">
                        <div className="max-w-md">
                            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-blue-300">
                                Learn • Share • Grow
                            </p>
                            <h1 className="text-5xl font-bold leading-tight text-white">
                                Unlock Your<br />Learning<br />Potential
                            </h1>
                            <p className="mt-6 text-lg leading-relaxed text-blue-100">
                                Connect with people, exchange skills, learn something new, and grow together with the SkillBridge community.
                            </p>
                        </div>
                    </div>

                    <div className="relative z-10 px-16 pb-16">
                        <div className="flex items-center gap-3 text-sm text-blue-200">
                            <div className="h-2 w-2 rounded-full bg-blue-300" />
                            Build skills. Create connections.
                        </div>
                    </div>
                </div>

                {/* RIGHT SIDE - FORM */}
                <div className="flex flex-1 items-center justify-center px-6 py-12 sm:px-12 lg:px-20">
                    <div className="w-full max-w-md">

                        {/* Mobile Logo */}
                        <Link to="/" className="mb-12 flex items-center justify-center gap-3 lg:hidden">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600">
                                <Users className="h-6 w-6 text-white" />
                            </div>
                            <span className="text-2xl font-bold text-slate-900">
                                Skill<span className="text-blue-600">Bridge</span>
                            </span>
                        </Link>

                        <div>
                            <h2 className="text-3xl font-bold text-slate-900">Welcome back 👋</h2>
                            <p className="mt-2 text-sm text-slate-500">
                                Login to continue your SkillBridge journey.
                            </p>
                        </div>

                        {generalError && (
                            <div className="mt-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                                <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0" />
                                <span>{generalError}</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-6">

                            <InputField
                                id="email"
                                label="Email Address"
                                type="email"
                                name="email"
                                placeholder="Enter your email address"
                                icon={Mail}
                                value={formData.email}
                                error={errors.email}
                                onChange={handleChange}
                                onBlur={() => handleBlur("email")}
                            />

                            <InputField
                                id="password"
                                label="Password"
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Enter your password"
                                icon={Lock}
                                value={formData.password}
                                error={errors.password}
                                onChange={handleChange}
                                onBlur={() => handleBlur("password")}
                                rightElement={
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-blue-600"
                                    >
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                }
                            />
                            <div className="flex items-center justify-between">
                                <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-600">
                                    <input
                                        type="checkbox"
                                        name="rememberMe"
                                        checked={formData.rememberMe}
                                        onChange={handleChange}
                                        className="h-4 w-4 cursor-pointer rounded border-slate-300 accent-blue-600"
                                    />
                                    Remember me
                                </label>

                                <Link
                                    to="/forgot-password"
                                    className="text-sm font-medium text-blue-600 transition hover:text-blue-800"
                                >
                                    Forgot password?
                                </Link>
                            </div>

                            {/* LOGIN BUTTON */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-700 py-3.5 font-semibold text-white shadow-lg shadow-blue-600/20 transition duration-200 hover:bg-blue-800 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
                            >
                                {loading ? "Logging in..." : "Login"}
                                {!loading && <ArrowRight className="h-5 w-5" />}
                            </button>

                            {/* DIVIDER */}
                            <div className="flex items-center gap-4">
                                <div className="h-px flex-1 bg-slate-200" />
                                <span className="text-sm text-slate-400">OR</span>
                                <div className="h-px flex-1 bg-slate-200" />
                            </div>

                            {/* CREATE ACCOUNT LINK */}
                            <Link
                                to="/signup"
                                className="flex w-full items-center justify-center rounded-xl border border-slate-300 py-3.5 font-semibold text-slate-700 transition hover:border-blue-500 hover:bg-blue-50 hover:text-blue-700"
                            >
                                Create Account
                            </Link>
                        </form>

                        <p className="mt-10 text-center text-xs text-slate-400">
                            © 2026 SkillBridge. Learn, connect and grow.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function InputField({ label, icon: Icon, error, rightElement, ...props }) {
    return (
        <div>
            <label htmlFor={props.id} className="mb-2 block text-sm font-semibold text-slate-700">
                {label}
            </label>
            <div className="relative">
                <Icon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                    {...props}
                    className={`w-full rounded-xl border bg-white py-3.5 pl-12 ${rightElement ? "pr-12" : "pr-4"
                        } text-sm text-slate-900 outline-none transition duration-200 placeholder:text-slate-400 focus:ring-4 ${error
                            ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                            : "border-slate-300 focus:border-blue-600 focus:ring-blue-100"
                        }`}
                />
                {rightElement}
            </div>
            {error && (
                <p className="mt-2 flex items-center gap-2 text-sm text-red-500">
                    <AlertCircle className="h-4 w-4" />
                    {error}
                </p>
            )}
        </div>
    );
}