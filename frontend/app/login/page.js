'use client';

import { useState, Suspense } from "react";
import { useAuth } from "@/context/AuthContext";
import GoogleLoginButton from "@/components/GoogleLoginButton";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";


function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { login, loginWithGoogle } = useAuth();

  const callbackUrl =
  searchParams.get("callbackUrl") || "/";
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      router.push(callbackUrl);
    } catch (err) {
      setError(err?.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleCredential = async (credential) => {
    setError("");
    try {
      await loginWithGoogle(credential);
      router.push(callbackUrl);
    } catch (err) {
      setError(err?.response?.data?.message || "Google login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 px-4 py-10">
      <Link
        href="/"
        className="mb-6 text-3xl font-extrabold tracking-wide bg-[#339999] text-transparent bg-clip-text"
      >
        CareerPath
      </Link>

      <form
        onSubmit={handleLogin}
        className="w-full max-w-sm rounded-2xl border border-gray-100 bg-white p-6 shadow-lg sm:p-8"
      >
        <h2 className="text-2xl font-bold text-center text-gray-900">Login</h2>
        <p className="mt-1 mb-6 text-center text-sm text-gray-500">
          Welcome back! Continue your learning journey.
        </p>

        {error && (
          <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
            {error}
          </p>
        )}

        <label htmlFor="login-email" className="mb-1 block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          id="login-email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          className="w-full mb-4 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/40"
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label htmlFor="login-password" className="mb-1 block text-sm font-medium text-gray-700">
          Password
        </label>
        <div className="relative mb-5">
          <input
            id="login-password"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            autoComplete="current-password"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 pr-10 text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/40"
            onChange={(e) => setPassword(e.target.value)}
            required
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
          {loading ? "Logging in..." : "Login"}
        </button>

        <div className="flex items-center my-5">
          <div className="flex-grow h-px bg-gray-200"></div>
          <span className="mx-3 text-xs uppercase tracking-wide text-gray-400">or</span>
          <div className="flex-grow h-px bg-gray-200"></div>
        </div>

        <GoogleLoginButton text="signin_with" onCredential={handleGoogleCredential} />

        <p className="mt-6 text-sm text-center text-gray-600">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-medium text-[#008080] hover:underline">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );

}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-gray-500">Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}
