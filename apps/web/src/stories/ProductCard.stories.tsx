import {Meta, StoryObj} from '@storybook/nextjs-vite'
import {ProductCard} from '@/components/ProductCard';
import '../app/globals.css';


//Product Data
 const product = {
    id: 'prod_board_001',
    name: 'Engraved Cutting Board',
    slug: 'engraved-cutting-board',
    price: 6000,
    image:'/logo.png',
    description:
      'Beautiful hardwood cutting board engraved with your logo. Ideal for gifts, events, or kitchen décor.',
  }

const meta: Meta<typeof ProductCard> = {
    title: 'UI/ProductCard',
    component: ProductCard,
    tags: ['autodocs'],
}

export default meta;
type Story = StoryObj<typeof ProductCard>

export const ProductWithImage: Story = {
    args: {
       ...product
    }
}

const {image, ...productNoImage} = product;
export const ProductWithoutImage: Story = {
    args: {...productNoImage,}
}

const {description, ...productNoDescription} = product;
export const ProductWithoutDescription: Story = {
    args: {...productNoDescription}
}

const {image: i, ...productNoImageNoDescription} = productNoDescription;
export const ProductWithoutImageAndDescription: Story = {
    args: {...productNoImageNoDescription}
}


