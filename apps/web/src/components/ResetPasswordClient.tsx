"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { FormField } from '@/components/ui/FormField';
import { resetPasswordSchema, type ResetPasswordForm } from '@/schemas/reset-password.schema';
import Link from 'next/link';

export default function ResetPasswordClient({ token }: { token: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
  });

  if (!token) {
    return (
      <div className="w-150 mx-auto mt-20 bg-white border border-surface-200 rounded-lg p-8 shadow-sm text-center">
        <h1 className="text-3xl font-bold text-brand-800 mb-4">Invalid Link</h1>
        <p className="text-surface-600 mb-6">
          This password reset link is missing or invalid.
        </p>
        <Link href="/login" className="text-accent-600 hover:text-accent-700 font-medium text-sm">
          Back to Login
        </Link>
      </div>
    );
  }

  const handleReset = async (data: ResetPasswordForm) => {
    setError(null);
    const res = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password: data.password }),
    });
    console.log('Reset response:', res);
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body?.error ?? 'An error occurred. Please try again or request a new reset link.');
      return;
    }

    router.push('/login?reset=success');
  };

  return (
    <div className="w-150 mx-auto mt-20 bg-white border border-surface-200 rounded-lg p-8 shadow-sm">
      <h1 className="text-3xl font-bold text-brand-800 mb-6 text-center">
        Reset Password
      </h1>
      {error && (
        <p className="text-center text-red-600 mb-4">{error}</p>
      )}
      <form onSubmit={handleSubmit(handleReset)} className="space-y-6">
        <FormField label="New Password" error={errors.password?.message}>
          <Input
            {...register('password')}
            type="password"
            autoComplete="new-password"
            placeholder="••••••••••"
            invalid={!!errors.password}
            className="bg-surface-50 border-surface-300 focus:ring-brand-400"
          />
        </FormField>

        <FormField label="Confirm New Password" error={errors.confirmPassword?.message}>
          <Input
            {...register('confirmPassword')}
            type="password"
            autoComplete="new-password"
            placeholder="••••••••••"
            invalid={!!errors.confirmPassword}
            className="bg-surface-50 border-surface-300 focus:ring-brand-400"
          />
        </FormField>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-brand-600 hover:bg-brand-700 text-white"
        >
          {isSubmitting ? 'Resetting...' : 'Reset Password'}
        </Button>
      </form>

      <p className="text-center text-sm text-surface-600 mt-6">
        <Link href="/login" className="text-accent-600 hover:text-accent-700 font-medium">
          Back to Login
        </Link>
      </p>
    </div>
  );
}