"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";


type RegistrationForm={
    firstName: string,
    lastName: string,
    email: string,
    phone?: string
    password: string,
    confirmPassword: string
}

const initialForm: RegistrationForm = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone:undefined
}
export default function RegisterClient() {
  const [form, setForm] = useState<RegistrationForm>(initialForm);

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<RegistrationForm>>({});

 const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear error on change
    if (errors[name as keyof RegistrationForm]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = (): boolean => {
    const next: Partial<RegistrationForm> = {};
    if (!form.email.trim()) next.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      next.email = 'Enter a valid email';
    if (!form.firstName.trim()) next.firstName = 'First Name is required';
    if (!form.lastName.trim()) next.lastName = 'Last Name is required';

    if (!form.password.trim()) next.password = 'Password is required';
    if (!form.confirmPassword.trim()) next.confirmPassword = 'Passwords Must Match';
    if (form.password !== form.confirmPassword) next.password = 'Passwords Must Match'

    // Phone validation
    if(form.phone){
    const phoneRegex = /^\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/
    const isValidPhoneNumber = phoneRegex.test(form.phone)
    if(!isValidPhoneNumber) next.phone = 'Please enter a valid phone number'
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleRegister = async (e: React.SubmitEvent) => {
    e.preventDefault();

    if(!validate()) return;

    setLoading(true);

    try {
      //TODO replace with actual api call
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form }),
      });
      const data = await res.json();
      alert(JSON.stringify(data))
      //Login User on success
      // Clear Form
      setForm(initialForm)
    } catch (err) {
      alert(err)
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-150 mx-auto mt-20 bg-white border border-surface-200 rounded-lg p-8 shadow-sm">
      <h1 className="text-3xl font-bold text-brand-800 mb-6 text-center">
        Create Account
      </h1>

      <form onSubmit={handleRegister} className="space-y-6">
  {/* First Name */}
  <div className="space-y-2">
    <label htmlFor="firstName" className="text-sm font-medium text-surface-700">
      First Name
    </label>
    <Input
      id="firstName"
      type="text"
      name="firstName"
      placeholder="John"
      value={form.firstName}
      onChange={handleChange}
      invalid={!!errors.firstName}
      className="bg-surface-50 border-surface-300 focus:ring-brand-400"
    />
    {errors.firstName && (
      <p className="text-red-600 text-sm mt-1">{errors.firstName}</p>
    )}
  </div>

  {/* Last Name */}
  <div className="space-y-2">
    <label htmlFor="lastName" className="text-sm font-medium text-surface-700">
      Last Name
    </label>
    <Input
      id="lastName"
      type="text"
      name="lastName"
      placeholder="Doe"
      value={form.lastName}
      onChange={handleChange}
      invalid={!!errors.lastName}
      className="bg-surface-50 border-surface-300 focus:ring-brand-400"
    />
    {errors.lastName && (
      <p className="text-red-600 text-sm mt-1">{errors.lastName}</p>
    )}
  </div>

  {/* Email */}
  <div className="space-y-2">
    <label htmlFor="email" className="text-sm font-medium text-surface-700">
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

  {/* Phone (optional) */}
  <div className="space-y-2">
    <label htmlFor="phone" className="text-sm font-medium text-surface-700">
      Phone (optional)
    </label>
    <Input
      id="phone"
      type="tel"
      name="phone"
      placeholder="555-123-4567"
      value={form.phone}
      onChange={handleChange}
      invalid={!!errors.phone}
      className="bg-surface-50 border-surface-300 focus:ring-brand-400"
    />
    {errors.phone && (
      <p className="text-red-600 text-sm mt-1">{errors.phone}</p>
    )}
  </div>

  {/* Password */}
  <div className="space-y-2">
    <label htmlFor="password" className="text-sm font-medium text-surface-700">
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
    {(errors.password || errors.confirmPassword) && (
      <p className="text-red-600 text-sm mt-1">{errors.password}</p>
    )}
  </div>

  {/* Confirm Password */}
  <div className="space-y-2">
    <label htmlFor="confirmPassword" className="text-sm font-medium text-surface-700">
      Confirm Password
    </label>
    <Input
      id="confirmPassword"
      type="password"
      name="confirmPassword"
      placeholder="••••••••••"
      value={form.confirmPassword}
      onChange={handleChange}
      invalid={!!errors.confirmPassword}
      className="bg-surface-50 border-surface-300 focus:ring-brand-400"
    />
  </div>

  {/* Submit */}
  <Button
    type="submit"
    disabled={loading}
    className="w-full bg-brand-600 hover:bg-brand-700 text-white"
  >
    {loading ? "Creating account..." : "Register"}
  </Button>
</form>

      {/* Footer */}
      <p className="text-center text-sm text-surface-600 mt-6">
        Already have an account?{" "}
        <a
          href="/login"
          className="text-accent-600 hover:text-accent-700 font-medium"
        >
          Login
        </a>
      </p>
    </div>
  );
}
