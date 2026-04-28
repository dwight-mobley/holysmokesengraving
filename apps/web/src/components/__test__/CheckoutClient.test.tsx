import userEvent from "@testing-library/user-event";
import { render, screen, waitFor } from "@testing-library/react";
import { CheckoutClient } from "../CheckoutClient";
import { useCart } from "@/store/cart";
import { products } from "@/data/products";
import { useRouter } from 'next/navigation';
import { vi } from "vitest";
import { formatMoney } from "@/utils/formatMoney";


// Mock the entire next/navigation module
vi.mock('next/navigation', () => ({
    useRouter: vi.fn(),
    usePathname: vi.fn(() => '/'),
    useSearchParams: vi.fn(() => new URLSearchParams()),
}));

vi.mock('@/utils/analytics', () => ({
    analytics: { checkoutStarted: vi.fn(), addedToCart: vi.fn() }
}));

describe('Checkout Client', () => {

    const cartItems = products.slice(0, 5).map(p => ({ productId: p.id, price: p.price, name: p.name, quantity: 1 }))
    const user = userEvent.setup();

    // Set Cart State before each test
    beforeEach(() => {
        useCart.setState({ items: cartItems });
        vi.mocked(useRouter).mockReturnValue({ push: vi.fn() } as any)
    });

    //Empty cart after checkout test
    afterEach(() => {
        useCart.setState({ items: [] });
        vi.unstubAllGlobals();
    });

    it('loads all appropriate totals, form, and checkout button', () => {
        render(<CheckoutClient />)

        const total = useCart.getState().total();
        const shipping = 999;
        const tax = Math.round(total * .07); //TODO MAKE DYNAMIC
        const grandTotal = tax + total + shipping;

        expect(screen.getByRole('textbox', { name: /email/i })).toBeVisible();
        expect(screen.getByRole('textbox', { name: /name/i })).toBeVisible();
        expect(screen.getByRole('textbox', { name: /street address/i })).toBeVisible();
        expect(screen.getByRole('button', { name: /pay with stripe/i })).toBeVisible();

        expect(screen.getByText(formatMoney(total))).toBeVisible();
        expect(screen.getByText(formatMoney(shipping))).toBeVisible();
        expect(screen.getByText(formatMoney(tax))).toBeVisible();
        expect(screen.getByText(formatMoney(grandTotal))).toBeVisible();

    });

    it('shows error message when form is not valid', async () => {
        render(<CheckoutClient />)

        const payWithStripe = screen.getByRole('button', { name: /pay with stripe/i });
       
        // Click to trigger validation erros
        await user.click(payWithStripe);

        expect(await screen.findByText(/please enter a valid email address/i)).toBeInTheDocument();
        expect(await screen.findByText(/name is required/i)).toBeInTheDocument();
        expect(await screen.findByText(/address is required/i)).toBeInTheDocument();
        expect(await screen.findByText(/city is required/i)).toBeInTheDocument();
        expect(await screen.findByText(/state is required/i)).toBeInTheDocument();
        expect(await screen.findByText(/enter a valid zip code/i)).toBeInTheDocument();
    });

    it('shows zip code error for invalid format', async () => {
        render(<CheckoutClient />)

        const payWithStripe = screen.getByRole('button', { name: /pay with stripe/i });
        const zipcodeInput = screen.getByRole('textbox', { name: /zip/i })

        //Enter invalid zip code
        await user.type(zipcodeInput, 'GA');

        //Click to trigger validation errors
        await user.click(payWithStripe);
        expect(await screen.findByText(/enter a valid zip/i)).toBeInTheDocument();

        //Clear the invalid zip
        await user.clear(zipcodeInput)
        //Enter valid zip
        await user.type(zipcodeInput, '30598');       

        await waitFor(() => {
            expect(screen.queryByText(/enter a valid zip/i)).not.toBeInTheDocument();
        })
    })

    it('clears error message when user enters valid data', async () => {
        render(<CheckoutClient />)
        
        const payWithStripe = screen.getByRole('button', { name: /pay with stripe/i });
       
        //Trigger validation errors
        await user.click(payWithStripe);
        expect(await screen.findByText(/please enter a valid email address/i)).toBeInTheDocument();

        const emailInput = screen.getByRole('textbox', { name: /email/i })
        //Type valid email
        await user.type(emailInput, "test@email.com")

        await waitFor(() => {
            expect(screen.queryByText(/please enter a valid email address/i)).not.toBeInTheDocument();
        });
    });

    it('redirects on submit', async () => {


        vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true }))
        const pushMock = vi.fn();
        vi.mocked(useRouter).mockReturnValue({ push: pushMock } as any)

        render(<CheckoutClient />);

        const payWithStripe = screen.getByRole('button', { name: /pay with stripe/i });
        //Fill out Form
        const emailInput = screen.getByRole('textbox', { name: /email/i });
        await user.type(emailInput, 'test@test.com');
        const nameInput = screen.getByRole('textbox', { name: /name/i });
        await user.type(nameInput, 'John Doe');
        const addressInput = screen.getByRole('textbox', { name: /street address/i });
        await user.type(addressInput, '123 Elm Street')
        const cityInput = screen.getByRole('textbox', { name: /city/i });
        await user.type(cityInput, 'Atlanta');
        const stateInput = screen.getByRole('textbox', { name: /state/i });
        await user.type(stateInput, 'GA');
        const zipInput = screen.getByRole('textbox', { name: /zip/i });
        await user.type(zipInput, '30589');

        //Click submit
        await user.click(payWithStripe)

        await waitFor(() => {
            expect(pushMock).toHaveBeenCalledWith('/checkout/success')
        })

        
    });

    it('show empty cart message when cart is empty', () => {
        useCart.setState({ items: [] });
        render(<CheckoutClient />)
        expect(screen.getByText(/your cart is empty/i)).toBeVisible();
        expect(screen.getByRole('link', { name: /continue shopping/i })).toBeVisible();

    })
});
