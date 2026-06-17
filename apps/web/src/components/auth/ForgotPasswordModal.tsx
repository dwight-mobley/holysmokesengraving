import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { FormField } from "@/components/ui/FormField";

export const ForgotPasswordModal = ({ onClose }: { onClose: () => void }) => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState<string | null>(null);

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();
        setMessage(null);
        const res = await fetch('/api/auth/forgot-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email:email, url: `${window.location.origin}/reset-password` }),
        });
        
        if (res.ok) {
            setMessage('If an account with that email exists, a password reset link has been sent.');
        } else {
            setMessage('An error occurred. Please try again later.');
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white border border-surface-200 rounded-lg p-8 w-full max-w-md shadow-sm relative">
                <Button variant="accent" size="sm" className="absolute top-2 right-2" onClick={onClose}>
                   X
                </Button>
                <h2 className="text-2xl font-bold text-brand-800 mb-6 text-center">Forgot Password</h2>
                {message && <p className="mb-4 text-center text-surface-600">{message}</p>}
                {!message && (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <FormField label="Email">
                            <Input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                autoComplete="email"
                                className="bg-surface-50 border-surface-300 focus:ring-brand-400"
                            />
                        </FormField>
                        <div className="flex justify-end space-x-2">
                            <Button type="button" variant="secondary" onClick={onClose}>
                                Cancel
                            </Button>
                            <Button type="submit">
                                Send Reset Link
                            </Button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};