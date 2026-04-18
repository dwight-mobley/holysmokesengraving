'use client';
import { ProductCard } from '@/components/ProductCard';
import { Button, Card, Input } from '@/components/ui';

// Dummy Products
const products = [
  {
    id: 'prod_hat_001',
    name: 'Custom Logo Leather Patch Hat',
    slug: 'custom-logo-leather-patch-hat',
    price: 4500,
    image: '/logo.png',
    description:
      'Premium Richardson 112 hat featuring a hand‑engraved leather patch with your logo or ranch brand.',
  },
  {
    id: 'prod_sign_001',
    name: 'Engraved Wooden Logo Sign',
    slug: 'engraved-wooden-logo-sign',
    price: 12000,
    image: '/logo.png',
    description:
      'Solid hardwood sign engraved with your business logo. Perfect for booths, shops, or home décor.',
  },
  {
    id: 'prod_tumbler_001',
    name: 'Stainless Steel Logo Tumbler',
    slug: 'stainless-steel-logo-tumbler',
    price: 3500,
    image: '/logo.png',
    description:
      'Durable powder‑coated tumbler laser‑engraved with your custom logo. Keeps drinks hot or cold for hours.',
  },
  {
    id: 'prod_board_001',
    name: 'Engraved Cutting Board',
    slug: 'engraved-cutting-board',
    price: 6000,
    image:'/logo.png',
    description:
      'Beautiful hardwood cutting board engraved with your logo. Ideal for gifts, events, or kitchen décor.',
  },
];
export default function Home() {
  return (
    <div className="p-3">
      <Card
        shadow="lg"
        padding="lg"
        className="max-w-50 hover:shadow-accent-400"
      >
        <h1 className="text-brand-400 font-heading">Holy Smokes Engraving</h1>
        <Button onClick={() => alert('clicked')}>Click Me</Button>
        <p className="text-surface-400">Welcome to our website!</p>
        <Input />
      </Card>

      <div className=" mt-5 flex justify-around gap-6">
        {products.map((p) => (
          <ProductCard
            key={p.id}
            id={p.id}
            name={p.name}
            image={p.image}
            slug={p.slug}
            description={p.description}
            price={p.price}
          />
        ))}
      </div>
    </div>
  );
}
