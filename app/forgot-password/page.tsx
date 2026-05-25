"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [resetToken, setResetToken] = useState("");

  async function handleForgotPassword() {
    const res = await fetch("http://127.0.0.1:8000/auth/forgot-password",  {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();

    if (res.ok) {
      setResetToken(data.reset_token);
      alert("Reset token generated");
    } else {
      alert(data.detail || "Something went wrong");
    }
  }

  return (
    <div className="h-screen flex items-center justify-center bg-black text-white">
      <div className="bg-zinc-900 p-8 rounded-xl w-96 space-y-4">
        <h1 className="text-3xl font-bold">Forgot Password</h1>

        <input
          type="email"
          placeholder="Enter your email"
          className="w-full p-3 rounded bg-zinc-800"
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          onClick={handleForgotPassword}
          className="w-full bg-emerald-500 p-3 rounded"
        >
          Generate Reset Token
        </button>

        {resetToken && (
          <div className="bg-zinc-800 p-3 rounded text-sm break-all">
            <p className="mb-2">Copy this token:</p>
            <p>{resetToken}</p>

            <button
              onClick={() => router.push("/reset-password")}
              className="w-full mt-3 bg-cyan-500 p-2 rounded"
            >
              Reset Password
            </button>
          </div>
        )}
      </div>
    </div>
  );
}