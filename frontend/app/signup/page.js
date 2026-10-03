'use client';

import { Suspense, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import GoogleLoginButton from "@/components/GoogleLoginButton";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

function SignupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { signup, loginWithGoogle } = useAuth();

  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Signup sets the session cookie, so the user is logged in immediately
      await signup(name, email, password);
      router.push(callbackUrl);
    } catch (err) {
      setError(err?.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  // Google has no separate "sign up" — the backend creates the account
  // on first sign-in, so this is the same call as on the login page.
  const handleGoogleCredential = async (credential) => {
    setError("");
    try {
      await loginWithGoogle(credential);
      router.push(callbackUrl);
    } catch (err) {
      setError(err?.response?.data?.message || "Google signup failed. Please try again.");
    }
  };

  const inputClass =
    "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/40";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 px-4 py-10">
      <Link
        href="/"
        className="mb-6 text-3xl font-extrabold tracking-wide bg-[#339999] text-transparent bg-clip-text"
      >
        CareerPath
      </Link>

      <form
        onSubmit={handleSignup}
        className="w-full max-w-sm rounded-2xl border border-gray-100 bg-white p-6 shadow-lg sm:p-8"
      >
        <h2 className="text-2xl font-bold text-center text-gray-900">Sign Up</h2>
        <p className="mt-1 mb-6 text-center text-sm text-gray-500">
          Create your account and start learning.
        </p>

        {error && (
          <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
            {error}
          </p>
        )}

        <label htmlFor="signup-name" className="mb-1 block text-sm font-medium text-gray-700">
          Name
        </label>
        <input
          id="signup-name"
          placeholder="Your name"
          autoComplete="name"
          onChange={(e) => setName(e.target.value)}
          required
          className={`${inputClass} mb-4`}
        />

        <label htmlFor="signup-email" className="mb-1 block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          id="signup-email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          onChange={(e) => setEmail(e.target.value)}
          required
          className={`${inputClass} mb-4`}
        />

        <label htmlFor="signup-password" className="mb-1 block text-sm font-medium text-gray-700">
          Password
        </label>
        <div className="relative mb-5">
          <input
            id="signup-password"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            autoComplete="new-password"
            onChange={(e) => setPassword(e.target.value)}
            required
            className={`${inputClass} pr-10`}
          />
          <button
            type="button"
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <button
          disabled={loading}
          className="w-full rounded-lg bg-[#008080] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#006666] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? "Signing up..." : "Sign Up"}
        </button>

        <div className="flex items-center my-5">
          <div className="flex-grow h-px bg-gray-200"></div>
          <span className="mx-3 text-xs uppercase tracking-wide text-gray-400">or</span>
          <div className="flex-grow h-px bg-gray-200"></div>
        </div>

        <GoogleLoginButton text="signup_with" onCredential={handleGoogleCredential} />

        <p className="mt-6 text-sm text-center text-gray-600">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-[#008080] hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-gray-500">Loading...</div>}>
      <SignupContent />
    </Suspense>
  );
}
