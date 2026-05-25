"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [token, setToken] = useState("");

  async function handleResetPassword() {
    const res = await fetch("http://localhost:8000/auth/reset-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
  email: email.trim().toLowerCase(),
  token: token.trim(),
  new_password: newPassword.trim(),
}),
    });

    const data = await res.json();

    if (res.ok) {
      alert("Password reset successful");
      router.push("/login");
    } else {
      alert(data.detail || "Reset failed");
    }
  }

  return (
    <div className="h-screen flex items-center justify-center bg-black text-white">
      <div className="bg-zinc-900 p-8 rounded-xl w-96 space-y-4">
        <h1 className="text-3xl font-bold">Reset Password</h1>

        <input
  type="email"
  placeholder="Enter your email"
  className="w-full p-3 rounded bg-zinc-800"
  onChange={(e) => setEmail(e.target.value)}
/>

        <input
  type="text"
  placeholder="Paste reset token"
  className="w-full p-3 rounded bg-zinc-800"
  onChange={(e) => setToken(e.target.value)}
/>

<input
  type="password"
  placeholder="New password"
  className="w-full p-3 rounded bg-zinc-800"
  onChange={(e) => setNewPassword(e.target.value)}
/>

        <button
          onClick={handleResetPassword}
          className="w-full bg-cyan-500 p-3 rounded"
        >
          Reset Password
        </button>
      </div>
    </div>
  );
}