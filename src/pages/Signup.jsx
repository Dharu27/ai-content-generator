import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserPlus, User, Mail, LockKeyhole, KeyRound } from "lucide-react";
import AuthFormCard from "../components/auth/AuthFormCard";
import InputField from "../components/auth/InputField";
import SubmitButton from "../components/auth/SubmitButton";
import Alert from "../components/auth/Alert";
import { validateEmail, validatePassword, validateRequired, validateMatch } from "../utils/validation";
import { handleAuthError } from "../utils/errorHandler";
import { useNotification } from "../utils/notification";

export default function SignupPage() {
  const navigate = useNavigate();
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { success, showSuccess } = useNotification(3000);

  // Field errors
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  // Handlers
  const handleNameChange = (e) => {
    setName(e.target.value);
    if (nameError) setNameError(validateRequired(e.target.value, "Name"));
  };
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (emailError) setEmailError(validateEmail(e.target.value));
  };
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (passwordError) setPasswordError(validatePassword(e.target.value));
    if (confirmPasswordError && confirmPassword) {
      setConfirmPasswordError(validateMatch(e.target.value, confirmPassword, "Passwords do not match"));
    }
  };
  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    if (confirmPasswordError) setConfirmPasswordError(validateMatch(password, e.target.value, "Passwords do not match"));
  };

  // Blur handlers
  const handleNameBlur = () => setNameError(validateRequired(name, "Name"));
  const handleEmailBlur = () => setEmailError(validateEmail(email));
  const handlePasswordBlur = () => setPasswordError(validatePassword(password));
  const handleConfirmPasswordBlur = () => setConfirmPasswordError(validateMatch(password, confirmPassword, "Passwords do not match"));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate all fields
    const nErr = validateRequired(name, "Name");
    const eErr = validateEmail(email);
    const pErr = validatePassword(password);
    const cpErr = validateMatch(password, confirmPassword, "Passwords do not match");

    setNameError(nErr);
    setEmailError(eErr);
    setPasswordError(pErr);
    setConfirmPasswordError(cpErr);

    if (nErr || eErr || pErr || cpErr) {
      return; // Prevent submission
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Signup failed");
      }

      showSuccess("Account created successfully!");
      
      // Redirect to login after a short delay so the user sees the success message
      setTimeout(() => {
        navigate("/login");
      }, 1500);
      
    } catch (err) {
      setError(handleAuthError(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <AuthFormCard
        title="Create an Account"
        subtitle="Join Continental AI to generate and save your blogs."
        icon={<UserPlus size={20} className="text-violet-600" />}
      >
        <form onSubmit={handleSubmit}>
          <Alert type="error" message={error} />
          <Alert type="success" message={success} />

          <InputField
            label="Name"
            type="text"
            value={name}
            onChange={handleNameChange}
            onBlur={handleNameBlur}
            error={nameError}
            placeholder="John Doe"
            icon={<User size={16} />}
            disabled={isLoading || !!success}
          />

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

          <InputField
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            onBlur={handleConfirmPasswordBlur}
            error={confirmPasswordError}
            placeholder="••••••••"
            icon={<KeyRound size={16} />}
            disabled={isLoading || !!success}
          />

          <div className="mt-6 mb-5">
            <SubmitButton
              text="Create Account"
              loadingText="Creating Account..."
              isLoading={isLoading}
              disabled={!!success}
            />
          </div>

          <div className="text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link to="/login" className="text-violet-600 font-semibold hover:text-violet-700 transition-colors">
              Log in
            </Link>
          </div>
        </form>
      </AuthFormCard>
    </div>
  );
}
