import { Meta, StoryObj } from '@storybook/nextjs-vite';
import { within, userEvent, expect } from 'storybook/test';
import { ProductCard } from '@/components/ProductCard';
import '../app/globals.css';


//Product Data
const product = {
  id: 'prod_board_001',
  name: 'Engraved Cutting Board',
  slug: 'engraved-cutting-board',
  price: 6000,
  image: '/logo.png',
  description:
    'Beautiful hardwood cutting board engraved with your logo. Ideal for gifts, events, or kitchen décor.',
};

const meta: Meta<typeof ProductCard> = {
  title: 'Component/ProductCard',
  component: ProductCard,
  tags: ['autodocs'],
   parameters: {
    docs: {
      description: {
        component:
          "Displays a product image, name, price, and CTA. Used in the product listing grid.",
      },
    },
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof ProductCard>;

export const ProductWithImage: Story = {
  args: {
    ...product,
  },  
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Link renders with correct href
    const link = canvas.getByRole('link', {
      name: /view engraved cutting board/i,
    });
    await expect(link).toHaveAttribute('href', '/shop/engraved-cutting-board');

    // Click Add to Cart → quantity controls appear
    const addBtn = canvas.getByRole('button', { name: /add to cart/i });
    await userEvent.click(addBtn);
    await expect(
      canvas.getByLabelText(/decrease quantity/i),
    ).toBeInTheDocument();
    await expect(
      canvas.getByLabelText(/increase quantity/i),
    ).toBeInTheDocument();
  },
};

const { image, ...productNoImage } = product;
export const ProductWithoutImage: Story = {
  args: { ...productNoImage },
  parameters:{
    description:{
      component: "Display all product card properties except image."
    }
  },
};

const { description, ...productNoDescription } = product;
export const ProductWithoutDescription: Story = {
  args: { ...productNoDescription },
  parameters:{
    description:{
      component: "Display all product card properties except description"
    }
  },
};

const { image:i, ...productNoImageNoDescription } = productNoDescription;
export const ProductWithoutImageAndDescription: Story = {
  args: { ...productNoImageNoDescription },
  parameters:{
    description:{
      component: "Display all product card properties except image and description."
    }
  },
};
