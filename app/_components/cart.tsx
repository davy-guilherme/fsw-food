import { useContext, useState } from "react";
import { CartContext } from "../_context/cart";
import CartItem from "./cart-item";
import { Card, CardContent } from "./ui/card";
import { formatCurrency } from "../_helpers/price";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { createOrder } from "../_actions/order";
import { useSession } from "next-auth/react";
import { OrderStatus } from "@prisma/client";
import { Loader2 } from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/app/_components/ui/alert-dialog";
import { toast } from "@/app/_components/ui/use-toast"
import { useRouter } from "next/navigation";
import { ToastAction } from "./ui/toast";

interface CartProps {
    setIsOpen: () => void;
}

const Cart = ({setIsOpen} : CartProps) => {
    const router = useRouter();

    const {data} = useSession();

    const [isSubmitLoading, setIsSubmitLoading] = useState(false);
    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

    const {products, subtotalPrice, totalPrice, totalDiscounts, clearCart} = useContext(CartContext);

    

    const handleFinishOrderClick = async () => {
        if(!data?.user) return; 
        
        const restaurant = products[0].restaurant;

        try {


            
            setIsSubmitLoading(true);

            await createOrder({
                subtotalPrice,
                totalDiscounts,
                totalPrice,
                deliveryFee: restaurant.deliveryFee,
                deliveryTimeMinutes: restaurant.deliveryTimeMinutes,
                restaurant: {
                    connect: { id: products?.[0].restaurant.id}
                },
                status: OrderStatus.CONFIRMED,
                user: {
                    connect: { id: data.user.id }
                },
                products: {
                    createMany: {
                        data: products.map(product => ({
                            productId: product.id,
                            quantity: product.quantity,
                        })),
                    },
                },
            });

            clearCart();

            setIsOpen(false);

            toast({
                // variant: "destructive",
                title: "Pedido finalizado com sucesso!",
                description: "Você pode acampanhá-lo na tela dos seus pedidos.",
                action: <ToastAction onClick={() => router.push('/my-orders')} altText="Meus Pedidos">Meus Pedidos</ToastAction>,
              })

        } catch (error) {
            console.error(error);
            alert(error)
        } finally {
            setIsSubmitLoading(false)
        }
        
    }

    return (
        <>
            <AlertDialog 
                open={isConfirmDialogOpen} 
                onOpenChange={setIsConfirmDialogOpen}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>Deseja finalizar seu pedido?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Ao finalizar seu pedido, você concorda com os termos e condições da nossa plataforma.
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction 
                        onClick={handleFinishOrderClick}
                        disabled={isSubmitLoading}
                    >
                        {isSubmitLoading && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Finalizar
                    </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <div className="flex flex-col py-5 h-full">

                {/* TOTAIS */}
                {products.length > 0 ? (
                    <>
                        <div className="space-y-4 flex-auto">
                            {products.map(product => (
                                <CartItem key={product.id} cartProduct={product}/>
                            ))}
                        </div>

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
                                            Number(products?.[0].restaurant.deliveryFee) == 0 
                                            ? <span className="uppercase text-primary font-medium">Grátis</span>
                                            : <span>{ formatCurrency(products?.[0].restaurant.deliveryFee) }</span>
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
                        <Button 
                            className="w-full mt-6"
                            onClick={ () => setIsConfirmDialogOpen(true ) } 
                            disabled={isSubmitLoading}
                        >
                            {isSubmitLoading && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            Finalizar pedido
                        </Button>
                    </>
                ) : <h2 className="text-left">Sua sacola está vazia.</h2>}
                
            </div>


            
        </>
    );
}
 
export default Cart;