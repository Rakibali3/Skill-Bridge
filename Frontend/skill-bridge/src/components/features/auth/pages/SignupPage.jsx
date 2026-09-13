import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  ArrowRight,
  Users,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import Validation from "../../../../assets/utils/Validation";
import api from "../../../../API/axios";

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const passwordValidation = Validation(formData.password);
  const isPasswordValid = Object.values(passwordValidation).every(Boolean);

  const passwordsMatch =
    formData.confirmPassword !== "" &&
    formData.password === formData.confirmPassword;

  const passwordsDoNotMatch =
    formData.confirmPassword !== "" &&
    formData.password !== formData.confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const ResponseData = await api.post("/signup", {
        userName: formData.fullName,
        email: formData.email,
        password: formData.password,
      });
      console.log(ResponseData);

    } catch (error) {
      console.log(error)
    }

  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-5 py-10 sm:px-8">
      <div className="w-full max-w-md">

        {/* Logo */}
        <Link
          to="/"
          className="mb-8 flex items-center justify-center gap-3"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 shadow-lg shadow-blue-600/20">
            <Users className="h-6 w-6 text-white" />
          </div>

          <span className="text-2xl font-bold text-slate-900">
            Skill<span className="text-blue-600">Bridge</span>
          </span>
        </Link>

        {/* Heading */}
        <div className="text-center">
          <p className="text-sm font-semibold text-blue-600">
            JOIN SKILLBRIDGE
          </p>

          <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
            Create your account
          </h2>

          <p className="mt-3 text-slate-500">
            Start learning, teaching, and growing with others.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-5"
        >

          {/* Full Name */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Full Name
            </label>

            <div className="relative">
              <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

              <input
                type="text"
                name="fullName"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-12 pr-4 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Email Address
            </label>

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-12 pr-4 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Password
            </label>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Create a strong password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full rounded-xl border bg-white py-3.5 pl-12 pr-12 text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-4 ${formData.password === ""
                  ? "border-slate-200 focus:border-blue-500 focus:ring-blue-100"
                  : isPasswordValid
                    ? "border-green-400 focus:border-green-500 focus:ring-green-100"
                    : "border-red-400 focus:border-red-500 focus:ring-red-100"
                  }`}
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-blue-600"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>

            {/* Password Requirements */}
            {formData.password && (
              <div className="mt-3 space-y-2">
                {passwordValidation.minLength ? "" : (
                  <p className="flex items-center gap-2 text-sm text-slate-600">
                    <AlertCircle className="h-4 w-4" />
                    At least 8 characters
                  </p>
                )}

                {passwordValidation.uppercase ? "" : (
                  <p className="flex items-center gap-2 text-sm text-slate-600">
                    <AlertCircle className="h-4 w-4" />
                    At least one uppercase letter
                  </p>
                )}

                {passwordValidation.lowercase ? "" : (
                  <p className="flex items-center gap-2 text-sm text-slate-500">
                    <AlertCircle className="h-4 w-4" />
                    At least one lowercase letter
                  </p>
                )}

                {passwordValidation.number ? "" : (
                  <p className="flex items-center gap-2 text-sm text-slate-500">
                    <AlertCircle className="h-4 w-4" />
                    At least one number
                  </p>
                )}

                {passwordValidation.specialCharacter ? "" : (
                  <p className="flex items-center gap-2 text-sm text-slate-500">
                    <AlertCircle className="h-4 w-4" />
                    At least one special character
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Confirm Password
            </label>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full rounded-xl border bg-white py-3.5 pl-12 pr-12 text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-4 ${passwordsDoNotMatch
                  ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                  : passwordsMatch
                    ? "border-green-400 focus:border-green-500 focus:ring-green-100"
                    : "border-slate-200 focus:border-blue-500 focus:ring-blue-100"
                  }`}
                required
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword((prev) => !prev)
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-blue-600"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>

            {/* Password Match Success Message */}
            {passwordsMatch && (
              <p className="mt-2 flex items-center gap-2 text-sm font-medium text-green-600">
                <CheckCircle2 className="h-4 w-4" />
                Passwords match
              </p>
            )}

            {/* Password Error Message */}
            {passwordsDoNotMatch && (
              <p className="mt-2 flex items-center gap-2 text-sm font-medium text-red-500">
                <AlertCircle className="h-4 w-4" />
                Passwords do not match
              </p>
            )}
          </div>

          {/* Terms and Conditions */}
          <label className="flex cursor-pointer items-start gap-3 text-sm text-slate-600">
            <input
              type="checkbox"
              className="mt-1 h-4 w-4 cursor-pointer rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              required
            />

            <span>
              I agree to the{" "}
              <span className="font-medium text-blue-600">
                Terms of Service
              </span>{" "}
              and{" "}
              <span className="font-medium text-blue-600">
                Privacy Policy
              </span>
              .
            </span>
          </label>

          {/* Signup Button */}
          <button
            type="submit"
            disabled={!passwordsMatch || !isPasswordValid}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/25 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Create Account
            <ArrowRight className="h-5 w-5" />
          </button>

        </form>

        {/* Divider */}
        <div className="my-7 flex items-center gap-4">
          <div className="h-px flex-1 bg-slate-200" />

          <span className="text-sm text-slate-400">
            OR
          </span>

          <div className="h-px flex-1 bg-slate-200" />
        </div>

        {/* Social Login */}
        <div className="grid grid-cols-2 gap-4">

          <button
            type="button"
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-3 font-medium text-slate-700 transition hover:bg-slate-50"
          >
            <span className="text-lg font-bold text-red-500">
              G
            </span>
            Google
          </button>

          <button
            type="button"
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-3 font-medium text-slate-700 transition hover:bg-slate-50"
          >
            <span className="text-lg font-bold text-slate-900">
              ⌘
            </span>
            GitHub
          </button>

        </div>

        {/* Login Link */}
        <p className="mt-8 text-center text-sm text-slate-600">
          Already have an account?{" "}

          <Link
            to="/login"
            className="font-semibold text-blue-600 transition hover:text-blue-700"
          >
            Sign in
          </Link>
        </p>

      </div>
    </div>
  );
}