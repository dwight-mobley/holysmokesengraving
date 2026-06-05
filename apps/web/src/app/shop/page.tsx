

import { ShopClient } from '@/components/ShopClient';
import {type Product} from '@/types/product'
export const revalidate = 3600;

const getTags = async (): Promise<string[]> => {
  const res = await fetch(`${process.env.API_URL}/products/tags`);
  if (!res.ok) return [];
  const data = await res.json();
  return data.tags ?? [];
};

const getProducts = async(page=1, search='',tag='', limit=50) =>{
  const res = await fetch(`${process.env.API_URL}/products?page=${page}&search=${search}&tag=${tag}&limit=${limit}`);
  if(!res.ok) return {products:[], totalPages:1};
  const data = await res.json();
  return data;
}

export default async function ProductPage({searchParams}:{searchParams:Promise<{page?: string, search?:string, tag?:string, limit?:string}>}) {
  const {page: pageParam, search, tag} = await searchParams;
  const page = Math.max(1, parseInt(pageParam ?? '1'));

  const [{products, totalPages}, tags] = await Promise.all([
    getProducts(page, search, tag),
    getTags()
  ]);

  return (
    <div>
      {/* Products */}
        <ShopClient products={products.filter((p: Product) => p.quantity > 0)} page={page} totalPages={totalPages} search={search} tags={tags} tag={tag} />
    </div>
  );
}


