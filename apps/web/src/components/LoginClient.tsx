"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

type LoginForm = {
  email: string;
  password: string;
};

const initialForm: LoginForm = {
  email: "",
  password: "",
};

export default function LoginClient() {
  const [form, setForm] = useState<LoginForm>(initialForm);
  const [errors, setErrors] = useState<Partial<LoginForm>>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setForm((prev) => ({ ...prev, [name]: value }));

    // Clear error on change
    if (errors[name as keyof LoginForm]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = (): boolean => {
    const next: Partial<LoginForm> = {};

    // Email validation
    if (!form.email.trim()) next.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      next.email = "Enter a valid email";

    // Password validation
    if (!form.password.trim()) next.password = "Password is required";

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleLogin = async (e: React.SubmitEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);

    try {
      // TODO: Replace with actual login API call
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      alert(JSON.stringify(data));

      // Clear form on success
      setForm(initialForm);
    } catch (err) {
      alert("Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-150 mx-auto mt-20 bg-white border border-surface-200 rounded-lg p-8 shadow-sm">
      <h1 className="text-3xl font-bold text-brand-800 mb-6 text-center">
        Login
      </h1>

      <form onSubmit={handleLogin} className="space-y-6">
        {/* Email */}
        <div className="space-y-2">
          <label
            htmlFor="email"
            className="text-sm font-medium text-surface-700"
          >
            Email
          </label>
          <Input
            id="email"
            type="email"
            name="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange}
            invalid={!!errors.email}
            className="bg-surface-50 border-surface-300 focus:ring-brand-400"
          />
          {errors.email && (
            <p className="text-red-600 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-2">
          <label
            htmlFor="password"
            className="text-sm font-medium text-surface-700"
          >
            Password
          </label>
          <Input
            id="password"
            type="password"
            name="password"
            placeholder="••••••••••"
            value={form.password}
            onChange={handleChange}
            invalid={!!errors.password}
            className="bg-surface-50 border-surface-300 focus:ring-brand-400"
          />
          {errors.password && (
            <p className="text-red-600 text-sm mt-1">{errors.password}</p>
          )}
        </div>

        {/* Submit */}
        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-brand-600 hover:bg-brand-700 text-white"
        >
          {loading ? "Logging in..." : "Login"}
        </Button>
      </form>

      {/* Footer */}
      <p className="text-center text-sm text-surface-600 mt-6">
        Don’t have an account?{" "}
        <a
          href="/register"
          className="text-accent-600 hover:text-accent-700 font-medium"
        >
          Create Account
        </a>
      </p>
    </div>
  );
}
