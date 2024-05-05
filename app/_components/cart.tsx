import { useContext } from "react";
import { CartContext } from "../_context/cart";
import CartItem from "./cart-item";
import { Card, CardContent } from "./ui/card";
import { formatCurrency } from "../_helpers/price";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";

const Cart = () => {
    const {products, subtotalPrice, totalPrice, totalDiscounts} = useContext(CartContext);
    return (
        <div className="py-5">
            <div className="space-y-4">
                {products.map(product => (
                    <CartItem key={product.id} cartProduct={product}/>
                ))}
            </div>

            {/* TOTAIS */}
            <div className="mt-6">
                <Card>
                    <CardContent className="p-5 space-y-2">
                        <div className="justify-between items-center flex text-xs">
                            <span className="text-muted-foreground">Subtotal</span>
                            <span className="">{formatCurrency(subtotalPrice)}</span>
                        </div>

                        <Separator />

                        <div className="justify-between items-center flex text-xs">
                            <span className="text-muted-foreground">Descontos</span>
                            <span className="">- {formatCurrency(totalDiscounts)}</span>
                        </div>

                        <Separator />

                        <div className="justify-between items-center flex text-xs">
                            <span className="text-muted-foreground">Entrega</span>
                            
                                {
                                    Number(products[0].restaurant.deliveryFee) == 0 
                                    ? <span className="uppercase text-primary font-medium">Grátis</span>
                                    : <span>{ formatCurrency(products[0].restaurant.deliveryFee) }</span>
                                }
                        </div>

                        <Separator />

                        <div className="justify-between items-center flex text-xs font-semibold">
                            <span>Total</span>
                            <span className="">- {formatCurrency(totalPrice)}</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* FINALIZAR PEDIDO */}
            <Button className="w-full mt-6">Finalizar pedido</Button>
            
        </div>
    );
}
 
export default Cart;