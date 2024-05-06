"use client"

import { Avatar } from "@/app/_components/ui/avatar";
import { Button } from "@/app/_components/ui/button";
import { Card, CardContent } from "@/app/_components/ui/card";
import { Separator } from "@/app/_components/ui/separator";
import { formatCurrency } from "@/app/_helpers/price";
import { OrderStatus, Prisma } from "@prisma/client";
import { AvatarImage } from "@radix-ui/react-avatar";
import { ChevronRightIcon } from "lucide-react";
import Link from "next/link";

interface OrderItemProps {

    order: Prisma.OrderGetPayload<{
        include: {
            restaurant: true,
            products: {
                include: {
                    product: true,
                }
            }
        }
    }>
}

const getOrderStatusLabel = (status: OrderStatus) => {
    switch (status) {
        case 'CANCELED':
            return 'Cancelado';
        case 'COMPLETED':
            return 'Completo';
        case 'CONFIRMED':
            return 'Confirmado';
        case 'DELIVERING':
            return 'Em transporte';
        case 'PREPARING':
            return 'Preparando';
    }
}

const OrderItem = ({order}: OrderItemProps) => {
    return (
        <Card>
            <CardContent className="p-5">
                <div className={`w-fit bg-[#eeeeee] text-muted-foreground rounded-full px-2 py-1 ${order.status != 'COMPLETED' && 'bg-green-500 text-white'}`}>
                    <span className="block text-xs font-semibold">{getOrderStatusLabel(order.status)}</span>
                </div>

                <div className="flex justify-between items-center pt-3">
                    <div className="flex items-center gap-2">
                        <Avatar className="w-6 h-6">
                            <AvatarImage src={ order.restaurant.imageUrl } />
                        </Avatar>

                        <span className="text-sm font-semibold">{order.restaurant.name}</span>
                    </div>
                    
                    <Button variant="link" size="icon" className="h-5 w-5 text-black">
                        <Link href={`/restaurants/${order.restaurantId}`}>
                            <ChevronRightIcon  />
                        </Link>
                    </Button>
                </div>

                <div className="py-3">
                    <Separator />
                </div>

                <div className="space-y-2">
                    {
                        order.products.map((product) => (
                            <div key={product.id} className="flex gap-2 items-center">
                                <div className="flex w-5 h-5 items-center justify-center rounded-full bg-muted-foreground">
                                    <span className="block text-xs text-white">{ product.quantity }</span>
                                </div>
                                <span className="text-muted-foreground text-xs block">{product.product.name}</span>
                            </div>
                        ))
                    }
                </div>

                <div className="py-3">
                    <Separator />
                </div>

                <div className="flex items-center justify-between">
                    <p className="text-sm">{formatCurrency(Number(order.totalPrice))}</p>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs text-primary" 
                        disabled={order.status != "COMPLETED"}
                    >
                        Refazer pedido
                    </Button>
                </div>
                
                
            </CardContent>
        </Card>
    );
}
 
export default OrderItem;