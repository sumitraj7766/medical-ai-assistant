"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";


interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

export default function LoginForm() {

  const router = useRouter();
  const searchParams = useSearchParams();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Signup success message
  useEffect(() => {

    if (searchParams.get("signup") === "success") {

      setSuccessMessage(
        "Account created successfully! Please log in."
      );

      const timer = setTimeout(() => {
        setSuccessMessage("");
      }, 5000);

      return () => clearTimeout(timer);
    }

  }, [searchParams]);

  // Email validation
  const validateEmail = (email: string): boolean => {

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailRegex.test(email);
  };

  // Form validation
  const validateForm = (): boolean => {

    const newErrors: FormErrors = {};

    if (!formData.email.trim()) {

      newErrors.email = "Email is required";

    } else if (!validateEmail(formData.email)) {

      newErrors.email =
        "Please enter a valid email address";
    }

    if (!formData.password) {

      newErrors.password =
        "Password is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // Input change
  const handleChange = useCallback(

    (e: React.ChangeEvent<HTMLInputElement>) => {

      const { name, value } = e.target;

      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));

      // Clear field error
      if (errors[name as keyof FormErrors]) {

        setErrors((prev) => ({
          ...prev,
          [name]: undefined,
        }));
      }
    },

    [errors]
  );

  // Login
  const handleLogin = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {

    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {

      const res = await fetch(
  `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
  {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email: formData.email
              .trim()
              .toLowerCase(),

            password: formData.password,
          }),
        }
      );

      const data = await res.json();

      // SUCCESS
      if (res.ok) {

        if (data.access_token) {

          // Save token
          localStorage.setItem(
            "token",
            data.access_token
          );

          // Save email for memory system
          localStorage.setItem(
            "email",
            formData.email
              .trim()
              .toLowerCase()
          );

          // Optional user data
          if (data.user) {

            localStorage.setItem(
              "user",
              JSON.stringify(data.user)
            );
          }
        }

        // Clear form
        setFormData({
          email: "",
          password: "",
        });

        setSuccessMessage("");

        // Redirect
        router.push("/chat");

      } else {

        setErrors({
          general:
            data.detail ||
            "Invalid email or password.",
        });
      }

    } catch (error) {

      console.error("Login error:", error);

      setErrors({
        general:
          "Server error. Please try again.",
      });

    } finally {

      setIsLoading(false);
    }
  };

  return (

    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-4 py-8">

      <div className="w-full max-w-md">

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-8 shadow-2xl">

          {/* Heading */}
          <div className="mb-8">

            <h1 className="text-4xl font-bold text-white mb-2">
              Welcome Back
            </h1>

            <p className="text-slate-400 text-sm">
              Sign in to continue
            </p>

          </div>

          {/* Success */}
          {successMessage && (

            <div className="mb-4 p-3 rounded bg-emerald-500/10 border border-emerald-500/20">

              <p className="text-emerald-400 text-sm">
                {successMessage}
              </p>

            </div>
          )}

          {/* Error */}
          {errors.general && (

            <div className="mb-4 p-3 rounded bg-red-500/10 border border-red-500/20">

              <p className="text-red-400 text-sm">
                {errors.general}
              </p>

            </div>
          )}

          {/* Form */}
          <form
            onSubmit={handleLogin}
            className="space-y-5"
          >

            {/* Email */}
            <div>

              <label className="block text-sm text-slate-200 mb-2">
                Email
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                disabled={isLoading}
                className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white"
              />

              {errors.email && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.email}
                </p>
              )}

            </div>

            {/* Password */}
            <div>

              <div className="flex justify-between mb-2">

                <label className="block text-sm text-slate-200">
                  Password
                </label>

                <button
                  type="button"
                  onClick={() =>
                    router.push("/forgot-password")
                  }
                  className="text-cyan-400 text-xs hover:underline"
                >
                  Forgot?
                </button>

              </div>

              <div className="relative">

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }

                  name="password"
                  value={formData.password}
                  onChange={handleChange}

                  placeholder="Enter password"

                  disabled={isLoading}

                  className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }

                  className="absolute right-3 top-3 text-slate-400"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>

              </div>

              {errors.password && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.password}
                </p>
              )}

            </div>

            {/* Login button */}
            <button
              type="submit"

              disabled={isLoading}

              className="w-full py-3 rounded-lg bg-cyan-500 hover:bg-cyan-600 text-white font-semibold"
            >

              {isLoading
                ? "Signing In..."
                : "Sign In"}

            </button>

            {/* Signup */}
            <button
              type="button"

              onClick={() =>
                router.push("/signup")
              }

              className="w-full py-3 rounded-lg border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/5"
            >
              Create New Account
            </button>

          </form>

        </div>

      </div>

    </div>
  );
}