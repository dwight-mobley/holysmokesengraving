"use client";

import { useRouter } from 'next/navigation'
import { registerSchema, type RegisterForm } from '@/schemas/register.schema';
import { Input, Button } from "@/components/ui";
import { FormField } from './ui/FormField';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';




export default function RegisterClient() {
  const router = useRouter();
  const { register, handleSubmit, formState: { isSubmitting, errors } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema)
  })

  const handleRegister = async (data: RegisterForm) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data }),
    });
    router.push('/')
  };

  return (
    <div className="w-150 mx-auto mt-20 bg-white border border-surface-200 rounded-lg p-8 shadow-sm">
      <h1 className="text-3xl font-bold text-brand-800 mb-6 text-center">
        Create Account
      </h1>

      <form onSubmit={handleSubmit(handleRegister)} className="space-y-6">
        {/* First Name */}
        <FormField label='First Name' error={errors.firstName?.message}>
          <Input
            {...register('firstName')}
            autoComplete='given-name'
            invalid={!!errors.firstName}
            className="bg-surface-50 border-surface-300 focus:ring-brand-400"
          />         
        </FormField>

        {/* Last Name */}
       <FormField label='Last Name' error={errors.lastName?.message}>
          <Input
            {...register('lastName')}
            autoComplete='family-name'
            invalid={!!errors.lastName}
            className="bg-surface-50 border-surface-300 focus:ring-brand-400"
          />         
        </FormField>

        {/* Email */}
        <FormField label='Email' error={errors.email?.message}>
          <Input
            {...register('email')}
            autoComplete='email'
            invalid={!!errors.email}
            className="bg-surface-50 border-surface-300 focus:ring-brand-400"
          />         
        </FormField>

        {/* Phone (optional) */}
       <FormField label='Phone Number (Optional)' error={errors.phone?.message}>
          <Input
            {...register('phone')}
            autoComplete='tel'
            invalid={!!errors.phone}
            className="bg-surface-50 border-surface-300 focus:ring-brand-400"
          />         
        </FormField>

        {/* Password */}
        <FormField label='Password' error={errors.password?.message}>
          <Input
            {...register('password')}
            invalid={!!errors.password}
            type='password'
            autoComplete='new-password'
            className="bg-surface-50 border-surface-300 focus:ring-brand-400"
          />         
        </FormField>

        {/* Confirm Password */}
        <FormField label='Confirm Password' error={errors.confirmPassword?.message}>
          <Input
            {...register('confirmPassword')}
            invalid={!!errors.confirmPassword}
            type='password'
            autoComplete='new-password'
            className="bg-surface-50 border-surface-300 focus:ring-brand-400"
          />         
        </FormField>

        {/* Submit */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-brand-600 hover:bg-brand-700 text-white"
        >
          {isSubmitting ? "Creating account..." : "Register"}
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
