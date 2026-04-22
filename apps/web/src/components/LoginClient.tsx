"use client";

import {useForm} from 'react-hook-form'
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { loginSchema, type LoginForm } from "@/schemas/login.schema";
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { FormField } from './ui/FormField';
import Link from 'next/link';

export default function LoginClient() {
  const router = useRouter();

  const {register, handleSubmit, formState:{errors, isSubmitting}} = useForm<LoginForm>({
    resolver: zodResolver(loginSchema)
  });  

  const handleLogin = async (data: LoginForm) => {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    router.push('/');
  };

  return (
    <div className="w-150 mx-auto mt-20 bg-white border border-surface-200 rounded-lg p-8 shadow-sm">
      <h1 className="text-3xl font-bold text-brand-800 mb-6 text-center">
        Login
      </h1>

      <form onSubmit={handleSubmit(handleLogin)} className="space-y-6">
        {/* Email */}
        <FormField label='Email' error={errors.email?.message} >         
          <Input
            {...register('email')}
            autoComplete='email'
            invalid={!!errors.email}
            className="bg-surface-50 border-surface-300 focus:ring-brand-400"
          />          
        </FormField>

        {/* Password */}
        <FormField label='Password' error={errors.password?.message}>
         
          <Input
           {...register('password')}
            placeholder="••••••••••"     
            type='password'
            autoComplete='current-password'      
            invalid={!!errors.password}
            className="bg-surface-50 border-surface-300 focus:ring-brand-400"
          />          
        </FormField>

        {/* Submit */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-brand-600 hover:bg-brand-700 text-white"
        >
          {isSubmitting ? "Logging in..." : "Login"}
        </Button>
      </form>

      {/* Footer */}
      <p className="text-center text-sm text-surface-600 mt-6">
        Don’t have an account?{" "}
        <Link
          href="/register"
          className="text-accent-600 hover:text-accent-700 font-medium"
        >
          Create Account
        </Link>
      </p>
    </div>
  );
}
