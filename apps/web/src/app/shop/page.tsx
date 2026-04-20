

import { ShopClient } from '@/components/ShopClient';
import { Product } from '@/types/product';



export default async function ProductPage() {
  const res = await fetch('http://localhost:3000/api/products')
  const data = await res.json();
  const {products} = data


  return (
    <div>
      {/* Products */}
        <ShopClient products={products} />
    </div>
  );
}
