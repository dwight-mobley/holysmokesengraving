import { NextResponse } from "next/server";



export async function GET(request: Request){
    const res = await fetch('https://holysmokesengraving.onrender.com/products');
    if(res.status === 200){
        const data = await res.json()
        return NextResponse.json({products:[...data]});
    }
    return NextResponse.json([]);
}