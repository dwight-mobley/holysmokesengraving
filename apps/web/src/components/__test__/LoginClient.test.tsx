import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import LoginClient from '../LoginClient';
import { useRouter } from 'next/navigation';

vi.mock('next/navigation', () => ({
    useRouter: vi.fn(),
    usePathname: vi.fn(() => '/'),
    useSearchParams: vi.fn(() => new URLSearchParams()),
}));

describe('LoginClient', () => {
    const user = userEvent.setup();

    beforeEach(() => {
        vi.mocked(useRouter).mockReturnValue({ push: vi.fn() } as any);
    });

    it('renders the login form', () => {
        render(<LoginClient />);
        expect(screen.getByRole('textbox', { name: /email/i })).toBeVisible();
        expect(screen.getByLabelText(/^password$/i)).toBeVisible();
        expect(screen.getByRole('button', { name: /login/i })).toBeVisible();
        expect(screen.getByRole('link', { name: /create account/i })).toBeVisible();
    });

    it('displays validation errors on empty submit', async () => {
        render(<LoginClient />);

        await user.click(screen.getByRole('button', { name: /login/i }));

        expect(await screen.findByText(/enter a valid email/i)).toBeInTheDocument();
        expect(await screen.findByText(/password is required/i)).toBeInTheDocument();
    });

    it('clears validation errors when valid data is entered', async () => {
        render(<LoginClient />);

        await user.click(screen.getByRole('button', { name: /login/i }));
        expect(await screen.findByText(/enter a valid email/i)).toBeInTheDocument();

        await user.type(screen.getByRole('textbox', { name: /email/i }), 'test@email.com');

        await waitFor(() => {
            expect(screen.queryByText(/enter a valid email/i)).not.toBeInTheDocument();
        });
    });

    it('redirects to home on successful login', async () => {
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true }));
        const pushMock = vi.fn();
        vi.mocked(useRouter).mockReturnValue({ push: pushMock } as any);

        render(<LoginClient />);

        await user.type(screen.getByRole('textbox', { name: /email/i }), 'test@email.com');
        await user.type(screen.getByLabelText(/^password$/i), 'password123');
        await user.click(screen.getByRole('button', { name: /login/i }));

        await waitFor(() => {
            expect(pushMock).toHaveBeenCalledWith('/');
        });

        vi.unstubAllGlobals();
    });
});