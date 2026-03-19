'use client';

import { useState } from "react";
import { signIn } from "next-auth/react";
import api from "@/utils/api";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.post("/auth/signup", { name, email, password });

      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Signup successful, but login failed");
      } else {
        router.push("/");
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100">
      <form
        onSubmit={handleSignup}
        className="bg-white p-6 w-96 rounded-xl shadow-md mb-20"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Sign up</h2>

        {error && <p className="text-red-500 mb-3 text-sm">{error}</p>}

        <input
          placeholder="Name"
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full mb-3 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
        />

        <input
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full mb-3 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
        />

        <input
          placeholder="Password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full mb-3 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
        />

        <button
          disabled={loading}
          className="w-full bg-[#008080] text-white p-2 rounded hover:opacity-90 transition"
        >
          {loading ? "Signing up..." : "Sign Up"}
        </button>

        <div className="flex items-center my-4">
          <div className="flex-grow h-px bg-gray-300"></div>
          <span className="mx-3 text-sm text-gray-500">or</span>
          <div className="flex-grow h-px bg-gray-300"></div>
        </div>

        <button
          type="button"
          onClick={() => signIn("google", { callbackUrl: "/" })}
          className="w-full flex items-center justify-center gap-3 border border-gray-300 bg-white text-gray-700 p-2 rounded hover:bg-gray-50 transition"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            className="w-5 h-5"
          />
          <span className="font-medium">Sign up with Google</span>
        </button>

        <p className="mt-4 text-sm text-center">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-600 underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );

}
