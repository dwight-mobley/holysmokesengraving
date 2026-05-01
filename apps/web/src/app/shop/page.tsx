

import { ShopClient } from '@/components/ShopClient';
import { Product } from '@/types/product';


export const revalidate = 3600;

const getProducts = async(): Promise<Product[]> =>{
  const res = await fetch(`${process.env.API_URL}/products?page=1&limit=15`);
  if(!res.ok) return [];
  const data = await res.json();
  console.log(data)
  return data.products ?? [];
}

export default async function ProductPage() {
  const products = await getProducts();
  return (
    <div>
      {/* Products */}
        <ShopClient products={products} />
    </div>
  );
}


