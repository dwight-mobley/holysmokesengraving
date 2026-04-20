

import { ShopClient } from '@/components/ShopClient';
import { products } from '@/data/products';




export default async function ProductPage() {

  return (
    <div>
      {/* Products */}
        <ShopClient products={products} />
    </div>
  );
}
