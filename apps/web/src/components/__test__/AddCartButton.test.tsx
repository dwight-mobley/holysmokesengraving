import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AddToCartButton } from '../AddToCartButton'
import { useCart } from '@/store/cart'


//Product Data
const product= {
     productId: 'test_product_id',
    name: " Test Product",
    price: 999
}

//Reset cart between tests
beforeEach(()=> useCart.setState({items:[]}));

test('add item to cart on click', async ()=>{
    render(<AddToCartButton {...product} />)

    await userEvent.click(screen.getByRole('button', {name: /add to cart/i}));

    const {items} = useCart.getState();
    expect(items).toHaveLength(1);
    expect(items[0]).toMatchObject(product);
});