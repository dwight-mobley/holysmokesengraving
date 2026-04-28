import { render, screen, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, beforeEach, afterEach } from 'vitest';
import { ShopClient } from '../ShopClient';
import { useCart } from '@/store/cart';
import { Product } from '@/types/product';

// Mock Next Image
vi.mock('next/image', () => ({
    default: (props: { alt: string }) => <img {...props} />,
}));

// Controlled product set for predictable assertions
const mockProducts: Product[] = [
    {
        id: '1', name: 'Wood Sign', slug: 'wood-sign', price: 1000,
        description: 'A handcrafted wood sign', tags: ['wood'],
        quantity: 10, createdAt: '', updatedAt: '',
    },
    {
        id: '2', name: 'Cutting Board', slug: 'cutting-board', price: 2000,
        description: 'Custom cutting board', tags: ['custom'],
        quantity: 5, createdAt: '', updatedAt: '',
    },
    {
        id: '3', name: 'Metal Plate', slug: 'metal-plate', price: 3000,
        description: 'Engraved metal plate', tags: ['metal', 'custom'],
        quantity: 8, createdAt: '', updatedAt: '',
    },
];

describe('ShopClient', () => {
    let user: ReturnType<typeof userEvent.setup>;

    beforeEach(() => {
       vi.useFakeTimers({ shouldAdvanceTime: true });
        user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
        useCart.setState({ items: [] });
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('renders all products and tag filters on load', () => {
        render(<ShopClient products={mockProducts} />);

        expect(screen.getByText('Wood Sign')).toBeVisible();
        expect(screen.getByText('Cutting Board')).toBeVisible();
        expect(screen.getByText('Metal Plate')).toBeVisible();

        // Tag buttons derived from products
        expect(screen.getByRole('button', { name: /^all$/i })).toBeVisible();
        expect(screen.getByRole('button', { name: /^wood$/i })).toBeVisible();
        expect(screen.getByRole('button', { name: /^custom$/i })).toBeVisible();
        expect(screen.getByRole('button', { name: /^metal$/i })).toBeVisible();

        expect(screen.getAllByText('3 products')).toHaveLength(2);
    });

    it('filters products by search query after debounce', async () => {
        render(<ShopClient products={mockProducts} />);

        const searchInput = screen.getByRole('textbox', { name: /search products/i });
        await user.type(searchInput, 'wood');

        // Before debounce resolves — all still visible
        expect(screen.getByText('Wood Sign')).toBeVisible();
        expect(screen.getByText('Cutting Board')).toBeVisible();

        // Advance past the 300ms debounce
        vi.advanceTimersByTime(300);

        await waitFor(() => {
            expect(screen.getByText('Wood Sign')).toBeVisible();
            expect(screen.queryByText('Cutting Board')).not.toBeInTheDocument();
            expect(screen.queryByText('Metal Plate')).not.toBeInTheDocument();
        });
    });

    it('filters products by description', async () => {
        render(<ShopClient products={mockProducts} />);

        await user.type(screen.getByRole('textbox', { name: /search products/i }), 'engraved');
        vi.advanceTimersByTime(300);

        await waitFor(() => {
            expect(screen.getByText('Metal Plate')).toBeVisible();
            expect(screen.queryByText('Wood Sign')).not.toBeInTheDocument();
            expect(screen.queryByText('Cutting Board')).not.toBeInTheDocument();
        });
    });

    it('shows empty state when no products match search', async () => {
        render(<ShopClient products={mockProducts} />);

        await user.type(screen.getByRole('textbox', { name: /search products/i }), 'xyznotaproduct');
        vi.advanceTimersByTime(300);

        await waitFor(() => {
            expect(screen.getByText(/no products match your search/i)).toBeVisible();
        });
    });

    it('filters products by tag', async () => {
        render(<ShopClient products={mockProducts} />);

        await user.click(screen.getByRole('button', { name: /^custom$/i }));

        expect(screen.getByText('Cutting Board')).toBeVisible();
        expect(screen.getByText('Metal Plate')).toBeVisible();
        expect(screen.queryByText('Wood Sign')).not.toBeInTheDocument();
    });

    it('updates heading to show active tag', async () => {
        render(<ShopClient products={mockProducts} />);

        expect(screen.getByRole('heading', { name: /shop all products/i })).toBeVisible();

        await user.click(screen.getByRole('button', { name: /^wood$/i }));

        expect(screen.getByRole('heading', { name: /^wood$/i })).toBeVisible();
    });

    it('deselects tag when clicked again', async () => {
        render(<ShopClient products={mockProducts} />);

        await user.click(screen.getByRole('button', { name: /^wood$/i }));
        expect(screen.queryByText('Cutting Board')).not.toBeInTheDocument();

        await user.click(screen.getByRole('button', { name: /^wood$/i }));

        expect(screen.getByText('Cutting Board')).toBeVisible();
        expect(screen.getByText('Metal Plate')).toBeVisible();
    });

    it('resets tag filter when All is clicked', async () => {
        render(<ShopClient products={mockProducts} />);

        await user.click(screen.getByRole('button', { name: /^wood$/i }));
        expect(screen.queryByText('Cutting Board')).not.toBeInTheDocument();

        await user.click(screen.getByRole('button', { name: /^all$/i }));

        expect(screen.getByText('Wood Sign')).toBeVisible();
        expect(screen.getByText('Cutting Board')).toBeVisible();
        expect(screen.getByText('Metal Plate')).toBeVisible();
    });
});