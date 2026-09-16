import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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

import api from "../../../../API/axios";
import {
  validateUserName,
  validateEmail,
  validatePassword,
  validateConfirmPassword,
} from "../../../../assets/utils/Validation";

const INITIAL_FORM_STATE = {
  fullName: "",
  email: "",
  password: "",
  confirmPassword: "",
  termsAccepted: false,
};

export default function SignupPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Password rules validation
  const passwordRules = {
    minLength: formData.password.length >= 8,
    maxLength: formData.password.length <= 100,
    uppercase: /[A-Z]/.test(formData.password),
    lowercase: /[a-z]/.test(formData.password),
    number: /\d/.test(formData.password),
    specialCharacter: /[@$!%*?&]/.test(formData.password),
  };

  const passwordsMatch =
    formData.confirmPassword !== "" &&
    formData.password === formData.confirmPassword;

 
  const getFieldError = (field, data = formData) => {
    switch (field) {
      case "fullName":
        return validateUserName(data.fullName);
      case "email":
        return validateEmail(data.email);
      case "password":
        return validatePassword(data.password)[0] || "";
      case "confirmPassword":
        return validateConfirmPassword(data.password, data.confirmPassword);
      case "termsAccepted":
        return !data.termsAccepted ? "You must accept the Terms of Service" : "";
      default:
        return "";
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    setFormData((prev) => ({ ...prev, [name]: newValue }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setGeneralError("");
  };

  const handleBlur = (field) => {
    const errorMessage = getFieldError(field);
    setErrors((prev) => ({ ...prev, [field]: errorMessage }));
  };

  const validateForm = () => {
    const fields = ["fullName", "email", "password", "confirmPassword", "termsAccepted"];
    const newErrors = {};

    fields.forEach((field) => {
      const err = getFieldError(field);
      if (err) newErrors[field] = err;
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError("");

    if (!validateForm()) return;

    try {
      setLoading(true);

      const response = await api.post("/signup", {
        userName: formData.fullName.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      });

      console.log(response.data);
      navigate("/login", {
        state: { message: "Account created successfully. Please login." },
      });
    } catch (error) {
      console.error(error);
      const serverErrors = error.response?.data;

      if (serverErrors && typeof serverErrors === "object") {
        setErrors({
          fullName: serverErrors.userName || "",
          email: serverErrors.email || "",
          password: serverErrors.password || "",
        });
        if (serverErrors.general) setGeneralError(serverErrors.general);
      } else {
        setGeneralError(
          serverErrors
            ? "Something went wrong. Please try again."
            : "Unable to connect to the server. Please check your connection."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-5 py-10 sm:px-8">
      <div className="w-full max-w-md">
        
        {/* LOGO */}
        <Link to="/" className="mb-8 flex items-center justify-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 shadow-lg shadow-blue-600/20">
            <Users className="h-6 w-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-slate-900">
            Skill<span className="text-blue-600">Bridge</span>
          </span>
        </Link>

        {/* HEADING */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
            Create your account
          </h2>
          <p className="mt-3 text-slate-500">
            Start learning, teaching, and growing with others.
          </p>

          {generalError && (
            <div className="mt-4 flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-600">
              <AlertCircle className="h-5 w-5" />
              {generalError}
            </div>
          )}
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
          
          <InputField
            label="Full Name"
            type="text"
            name="fullName"
            placeholder="Enter your full name"
            icon={User}
            value={formData.fullName}
            error={errors.fullName}
            onChange={handleChange}
            onBlur={() => handleBlur("fullName")}
          />

          <InputField
            label="Email Address"
            type="email"
            name="email"
            placeholder="Enter your email"
            icon={Mail}
            value={formData.email}
            error={errors.email}
            onChange={handleChange}
            onBlur={() => handleBlur("email")}
          />

          <div>
            <InputField
              label="Password"
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Create a strong password"
              icon={Lock}
              value={formData.password}
              error={errors.password}
              onChange={handleChange}
              onBlur={() => handleBlur("password")}
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              }
            />

            {/* PASSWORD REQUIREMENTS */}
            {formData.password && (
              <div className="mt-3 space-y-2">
               {passwordRules.minLength ? "": <PasswordRule valid={passwordRules.minLength} text="At least 8 characters" />  }
               {passwordRules.uppercase ?"" : <PasswordRule valid={passwordRules.uppercase} text="At least one uppercase letter" /> }
               {passwordRules.lowercase ?"" : <PasswordRule valid={passwordRules.lowercase} text="At least one lowercase letter" />}
               {passwordRules.number ?"" :  <PasswordRule valid={passwordRules.number} text="At least one number" />}
               {passwordRules.specialCharacter ?"" : <PasswordRule valid={passwordRules.specialCharacter} text="At least one special character" />}
              </div>
            )}
          </div>

          <div>
            <InputField
              label="Confirm Password"
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm your password"
              icon={Lock}
              value={formData.confirmPassword}
              error={errors.confirmPassword}
              onChange={handleChange}
              onBlur={() => handleBlur("confirmPassword")}
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              }
            />

            {passwordsMatch && (
              <p className="mt-2 flex items-center gap-2 text-sm text-green-600">
                <CheckCircle2 className="h-4 w-4" />
                Passwords match
              </p>
            )}
          </div>

          {/* TERMS */}
          <div>
            <label className="flex cursor-pointer items-start gap-3 text-sm text-slate-600">
              <input
                type="checkbox"
                name="termsAccepted"
                checked={formData.termsAccepted}
                onChange={handleChange}
                className="mt-1 h-4 w-4 cursor-pointer"
              />
              <span>
                I agree to the{" "}
                <span className="font-medium text-blue-600">Terms of Service</span> and{" "}
                <span className="font-medium text-blue-600">Privacy Policy</span>.
              </span>
            </label>

            {errors.termsAccepted && (
              <p className="mt-2 flex items-center gap-2 text-sm text-red-500">
                <AlertCircle className="h-4 w-4" />
                {errors.termsAccepted}
              </p>
            )}
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Creating Account..." : "Create Account"}
            {!loading && <ArrowRight className="h-5 w-5" />}
          </button>
        </form>

        {/* LOGIN LINK */}
        <p className="mt-8 text-center text-sm text-slate-600">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-700">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

function InputField({ label, icon: Icon, error, rightElement, ...props }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-700">{label}</label>
      <div className="relative">
        <Icon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
        <input
          {...props}
          className={`w-full rounded-xl border bg-white py-3.5 pl-12 ${
            rightElement ? "pr-12" : "pr-4"
          } outline-none transition focus:ring-4 ${
            error
              ? "border-red-400 focus:border-red-500 focus:ring-red-100"
              : "border-slate-200 focus:border-blue-500 focus:ring-blue-100"
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

function PasswordRule({ valid, text }) {
  return (
    <p className={`flex items-center gap-2 text-sm ${valid ? "text-green-600" : "text-slate-500"}`}>
      {valid ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
      {text}
    </p>
  );
}