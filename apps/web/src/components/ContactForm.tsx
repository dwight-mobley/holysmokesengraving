'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';

const ContactSchema = z.object({
  firstName: z.string().min(1, 'Required'),
  lastName: z.string().min(1, 'Required'),
  email: z.string().email('Invalid email'),
  subject: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactFormValues = z.infer<typeof ContactSchema>;

const SUBJECTS = ['General Question', 'Order Inquiry', 'Custom Order', 'Other'];

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({ resolver: zodResolver(ContactSchema) });

  const onSubmit = async (data: ContactFormValues) => {
    setError(null);
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      setError('Something went wrong. Please email us directly at dwight@holysmokesengraving.com.');
      return;
    }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center space-y-3">
        <p className="text-2xl">✓</p>
        <h3 className="text-lg font-semibold text-green-800">Message Sent!</h3>
        <p className="text-green-700 text-sm">
          Thanks for reaching out. We&apos;ll get back to you as soon as possible.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="block text-sm font-medium text-surface-700">First Name</label>
          <input
            {...register('firstName')}
            className="block w-full rounded-md bg-surface-50 border border-surface-300 px-4 py-2 text-surface-900 focus:outline-none focus:ring-2 focus:ring-brand-400"
          />
          {errors.firstName && <p className="text-red-600 text-sm">{errors.firstName.message}</p>}
        </div>
        <div className="space-y-1">
          <label className="block text-sm font-medium text-surface-700">Last Name</label>
          <input
            {...register('lastName')}
            className="block w-full rounded-md bg-surface-50 border border-surface-300 px-4 py-2 text-surface-900 focus:outline-none focus:ring-2 focus:ring-brand-400"
          />
          {errors.lastName && <p className="text-red-600 text-sm">{errors.lastName.message}</p>}
        </div>
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-medium text-surface-700">Email</label>
        <input
          type="email"
          {...register('email')}
          className="block w-full rounded-md bg-surface-50 border border-surface-300 px-4 py-2 text-surface-900 focus:outline-none focus:ring-2 focus:ring-brand-400"
        />
        {errors.email && <p className="text-red-600 text-sm">{errors.email.message}</p>}
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-medium text-surface-700">
          Subject <span className="text-surface-400">(optional)</span>
        </label>
        <select
          {...register('subject')}
          className="block w-full rounded-md bg-surface-50 border border-surface-300 px-4 py-2 text-surface-900 focus:outline-none focus:ring-2 focus:ring-brand-400"
        >
          <option value="">Select a subject…</option>
          {SUBJECTS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-medium text-surface-700">Message</label>
        <textarea
          {...register('message')}
          rows={5}
          placeholder="How can we help?"
          className="block w-full rounded-md bg-surface-50 border border-surface-300 px-4 py-2 text-surface-900 placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-brand-400 resize-none"
        />
        {errors.message && <p className="text-red-600 text-sm">{errors.message.message}</p>}
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-accent-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-accent-700 transition-colors disabled:opacity-50"
      >
        {isSubmitting ? 'Sending…' : 'Send Message'}
      </button>
    </form>
  );
}