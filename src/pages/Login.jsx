import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { LogIn, Mail, LockKeyhole } from "lucide-react";
import AuthFormCard from "../components/auth/AuthFormCard";
import InputField from "../components/auth/InputField";
import SubmitButton from "../components/auth/SubmitButton";
import Alert from "../components/auth/Alert";
import { validateEmail, validatePassword } from "../utils/validation";
import { handleAuthError } from "../utils/errorHandler";
import { useNotification } from "../utils/notification";

export default function LoginPage() {
  const navigate = useNavigate();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Field errors for instant validation
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const { success, showSuccess } = useNotification(2000);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (emailError) setEmailError(validateEmail(e.target.value));
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (passwordError) setPasswordError(validatePassword(e.target.value));
  };

  const handleEmailBlur = () => setEmailError(validateEmail(email));
  const handlePasswordBlur = () => setPasswordError(validatePassword(password));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate all fields
    const eErr = validateEmail(email);
    const pErr = validatePassword(password);
    
    setEmailError(eErr);
    setPasswordError(pErr);

    if (eErr || pErr) {
      return; // Prevent form submission
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Store the JWT token securely (adjust according to your backend response structure)
      if (data.token) {
        localStorage.setItem("accessToken", data.token);
      }

      showSuccess("Welcome back! Login successful.");
      
      // Redirect to Dashboard
      setTimeout(() => {
        navigate("/");
      }, 1000);
      
    } catch (err) {
      setError(handleAuthError(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <AuthFormCard
        title="Welcome Back"
        subtitle="Log in to access your profile and saved blogs."
        icon={<LogIn size={20} className="text-violet-600" />}
      >
        <form onSubmit={handleSubmit}>
          <Alert type="error" message={error} />
          <Alert type="success" message={success} />

          <InputField
            label="Email Address"
            type="email"
            value={email}
            onChange={handleEmailChange}
            onBlur={handleEmailBlur}
            error={emailError}
            placeholder="you@example.com"
            icon={<Mail size={16} />}
            disabled={isLoading || !!success}
          />

          <InputField
            label="Password"
            type="password"
            value={password}
            onChange={handlePasswordChange}
            onBlur={handlePasswordBlur}
            error={passwordError}
            placeholder="••••••••"
            icon={<LockKeyhole size={16} />}
            disabled={isLoading || !!success}
          />

          <div className="mt-6 mb-5">
            <SubmitButton
              text="Sign In"
              loadingText="Signing In..."
              isLoading={isLoading}
              disabled={!!success}
            />
          </div>

          <div className="text-center text-sm text-slate-500">
            Don't have an account?{" "}
            <Link to="/signup" className="text-violet-600 font-semibold hover:text-violet-700 transition-colors">
              Create an account
            </Link>
          </div>
        </form>
      </AuthFormCard>
    </div>
  );
}
