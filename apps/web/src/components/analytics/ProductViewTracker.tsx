"use client"

import { Product } from "@/types/product";
import { analytics } from "@/utils/analytics";
import { useEffect } from "react"

export const ProductViewTracker =({product}: {product:Product})=>{

    useEffect(()=>{
        //Analytics
  analytics.productViewed(product.id, product.name, product.price);
},[product])
    return null;
}