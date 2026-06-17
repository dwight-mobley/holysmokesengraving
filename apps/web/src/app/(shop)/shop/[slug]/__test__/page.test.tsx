import { render, screen } from '@testing-library/react';
import ProductDetailsPage from '../page';

test('renders product name and price', async () => {
  const page = await ProductDetailsPage({
    params: Promise.resolve({ slug: 'vintage-dog-tag' })
  });
  render(page);

  expect(screen.getByRole('heading', { name: /vintage dog tag/i })).toBeInTheDocument();
  expect(screen.getByText('$58.32')).toBeInTheDocument();
});