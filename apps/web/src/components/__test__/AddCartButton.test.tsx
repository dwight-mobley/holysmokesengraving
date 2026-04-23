import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AddToCartButton } from '../AddToCartButton'
import { useCart } from '@/store/cart'
import { vi } from 'vitest';

//Analytic Mock
vi.mock('@utils/analytics', () => ({
    analytics: { addedToCart: vi.fn() }
}));

describe('AddToCartButton', () => {
    //Mock User
    const user = userEvent.setup();

    //Product Data
    const product = {
        productId: 'test_product_id',
        name: " Test Product",
        price: 999
    }

    //Reset cart between tests
    beforeEach(() => useCart.setState({ items: [] }));

    it('adds item to cart on click', async () => {
        render(<AddToCartButton {...product} />)
        const addToCartButton = screen.getByRole('button', { name: /add to cart/i })

        await user.click(addToCartButton);

        const { items } = useCart.getState();
        expect(items).toHaveLength(1);
        expect(items[0]).toMatchObject({ ...product, quantity: 1 });
        expect(screen.getByRole('button', { name: /increase quantity/i })).toBeVisible();
        expect(screen.getByRole('button', { name: /decrease quantity/i })).toBeVisible();

    });

    it('increases cart item quantity', async () => {
        render(<AddToCartButton {...product} />)
        const addToCartButton = screen.getByRole('button', { name: /add to cart/i });
        await user.click(addToCartButton);
        const increaseQuantityButton = screen.getByRole('button', { name: /increase quantity/i });
        expect(increaseQuantityButton).toBeVisible();
        expect(addToCartButton).not.toBeVisible();
        await user.click(increaseQuantityButton);
        const { items } = useCart.getState();
        expect(items[0]).toMatchObject({ ...product, quantity: 2 });

    })

    it('decreases cart item quantity', async () => {
        render(<AddToCartButton {...product} />)
        const addToCartButton = screen.getByRole('button', { name: /add to cart/i });

        await user.click(addToCartButton);
        expect(addToCartButton).not.toBeVisible();
        const decreaseQuantityButton = screen.getByRole('button', { name: /decrease quantity/i });
        expect(decreaseQuantityButton).toBeVisible();

        await user.click(decreaseQuantityButton);
        const { items } = useCart.getState();
        expect(items).toHaveLength(0);
        
        expect(screen.getByRole('button', { name: /add to cart/i })).toBeVisible();
    })
});

