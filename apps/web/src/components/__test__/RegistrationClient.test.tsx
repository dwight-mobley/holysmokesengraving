import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import RegisterClient from '../RegisterClient';
import { useRouter } from 'next/navigation';


// Mock the entire next/navigation module
vi.mock('next/navigation', () => ({
    useRouter: vi.fn(),
    usePathname: vi.fn(() => '/'),
    useSearchParams: vi.fn(() => new URLSearchParams()),
}));

describe('Registration Client', () => {
    const user = userEvent.setup()
    
    beforeEach(() => {
        vi.mocked(useRouter).mockReturnValue({ push: vi.fn() } as any);
    });

    it('renders the registration form', () => {
        render(<RegisterClient />);
        expect(screen.getByRole('textbox', { name: /first name/i })).toBeVisible();
        expect(screen.getByRole('textbox', { name: /last name/i })).toBeVisible();
        expect(screen.getByRole('textbox', { name: /email/i })).toBeVisible();
        expect(screen.getByLabelText(/^password$/i)).toBeVisible();
        expect(screen.getByLabelText(/^confirm password/i)).toBeVisible();
        expect(screen.getByRole('button', { name: /register/i })).toBeVisible();
    })

    it('displays validation errors', async () => {
        render(<RegisterClient />);

        //Enter invalid phone number
        await user.type(screen.getByRole('textbox', { name: /phone number/i }), 'Phone Number')

        //Click submit to trigger validation errors
        await user.click(screen.getByRole('button', { name: /register/i }));
        
        expect(await screen.findByText(/first name is required/i)).toBeInTheDocument();
        expect(await screen.findByText(/last name is required/i)).toBeInTheDocument();
        expect(await screen.findByText(/enter a valid email/i)).toBeInTheDocument();
        expect(await screen.findByText(/password is required/i)).toBeInTheDocument();
        expect(await screen.findByText(/enter a valid phone number/i)).toBeInTheDocument();
    });

    it('clears validation errors when valid data is entered', async () => {
        render(<RegisterClient />);
        const emailInput = screen.getByRole('textbox', { name: /email/i });
        const phoneInput = screen.getByRole('textbox', { name: /phone number/i })
        //Enter invalid email
        await user.type(emailInput, 'invalid email');

        //Enter invalid phone number
        await user.type(phoneInput, 'Phone Number');

        //Click submit to trigger validation errors
        await user.click(screen.getByRole('button', { name: /register/i }));
        expect(await screen.findByText(/enter a valid email/i)).toBeInTheDocument();
        expect(await screen.findByText(/enter a valid phone number/i)).toBeInTheDocument();


        //Clear inputs
        await user.clear(emailInput);
        await user.clear(phoneInput);

        //Enter valid data
        await user.type(emailInput, "test@email.com");
        await user.type(phoneInput, "0123457890");

        await waitFor(() => {
            expect(screen.queryByText(/enter a valid email/i)).not.toBeInTheDocument();
            expect(screen.queryByText(/enter a valid phone number/i)).not.toBeInTheDocument();
        })

    });

    it('succesfully redirects on successful submit', async()=>{
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true }))
        const pushMock = vi.fn()
        vi.mocked(useRouter).mockReturnValue({push:pushMock} as any);

        render(<RegisterClient/>)

        //Fill out form
        await user.type(screen.getByRole('textbox', {name:/first name/i}), 'John');
        await user.type(screen.getByRole('textbox', {name:/last name/i}), 'Doe');
        await user.type(screen.getByRole('textbox', {name:/email/i}), 'test@email.com');
        await user.type(screen.getByLabelText(/^password$/i), '123');
        await user.type(screen.getByLabelText(/^confirm password$/i), '123');

        //Click submit
        await user.click(screen.getByRole('button',{name:/register/i}));

        await waitFor(() => {
            expect(pushMock).toHaveBeenCalledWith('/');
        });

        vi.unstubAllGlobals();
    });
});