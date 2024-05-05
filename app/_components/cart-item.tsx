
import Image from 'next/image';
import {CartContext, CartProduct} from '../_context/cart'
import { calculateProductTotalPrice, formatCurrency } from '../_helpers/price';
import { Button } from './ui/button';
import { ChevronLeftIcon, ChevronRightIcon, TrashIcon } from 'lucide-react';
import { useContext } from 'react';

interface CartItemProps {
    cartProduct: CartProduct
}

const CartItem = ({cartProduct}: CartItemProps) => {
    const {removeProductFromCart, increaseProductQuantity ,decreaseProductQuantity} = useContext(CartContext);

    const handleIncreaseQuantityClick = () => {
        increaseProductQuantity(cartProduct.id)
    }

    const handleDecreaseQuantityClick = () => {
        decreaseProductQuantity(cartProduct.id)
    }

    const handleRemoveProductFromCart = () => {
        removeProductFromCart(cartProduct.id)
    }

    return (
        <div className="flex items-center justify-between">
            {/* IMAGEM E INFO */}
            <div className="flex items-center space-x-3">
                <div className="w-20 h-20 relative">
                    <Image 
                        src={cartProduct.imageUrl} 
                        alt={cartProduct.name} 
                        fill 
                        className="rounded-lg object-cover"
                    />
                </div>

                <div className="space-y-1">
                    <h3 className="text-xs">{cartProduct.name}</h3>

                    <div className="flex items-center gap-1">
                        <h4 className="text-sm font-semibold">{ formatCurrency(calculateProductTotalPrice(cartProduct) * cartProduct.quantity) }</h4>
                        {cartProduct.discountPercentage > 0 && (
                            <span className="text-xs text-muted-foreground line-through">
                                {formatCurrency(Number(cartProduct.price) * cartProduct.quantity)}
                            </span>
                        )}
                    </div>

                    {/* QUANTIDADE */}
                    <div className="flex gap-2 items-center text-center">
                        <Button 
                            size="icon" 
                            variant="ghost" 
                            className="h-7 w-7 border border-solid border-muted-foreground"
                            onClick={handleDecreaseQuantityClick}
                        >
                            <ChevronLeftIcon size={18} />
                        </Button>
                        
                        <span className="w-3 text-sm block">
                            { cartProduct.quantity }
                        </span>
                        

                        <Button
                            size="icon"
                            className="h-7 w-7"
                            onClick={handleIncreaseQuantityClick}
                        >
                            <ChevronRightIcon size={18} />
                        </Button>
                    </div>
                </div>

                

            </div>

            {/* BOTÃO DE DELETAR */}
            <Button 
                size="icon"
                variant="ghost"
                className="h-8 w-8 border border-solid border-muted-foreground"
                onClick={handleRemoveProductFromCart}
            >
                <TrashIcon size={18} />
            </Button>
        </div>

    );
}
 
export default CartItem;