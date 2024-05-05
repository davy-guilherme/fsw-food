import { db } from "@/app/_lib/prisma";
import { notFound } from "next/navigation";
import RestaurantImage from "./_components/restaurant-image";
import Image from "next/image";
import { StarIcon } from "lucide-react";
import DeliveryInfo from "@/app/_components/delivery-info";
import ProductList from "@/app/_components/product-list";
import CartBanner from "./_components/cart-banner";

interface RestaurantPageProps {
    params: {
        id
    }
}
const ResaurantPage = async ({ params: {id}}: RestaurantPageProps) => {
    const restaurant = await db.restaurant.findUnique({
        where: {
            id
        },
        include: {
            categories: {
                orderBy: {
                    createdAt: 'desc',
                },
                include: {
                    products: {
                        where: {
                            restaurantId: id
                        },
                        include: {
                            restaurant: {
                                select: {
                                    name: true
                                }
                            }
                        }
                    },
                }
            },
            products: {
                take: 10,
                include: {
                    restaurant: {
                        select: {
                            name: true
                        }
                    }
                }
            }
        }
    })


    if (!restaurant) return notFound();

    return (
        <div className="bg-white">
            {/* IMAGE */}
            <RestaurantImage restaurant={restaurant} />

            <div className="flex justify-between items-center px-5 pt-5 py-5 z-50 relative rounded-tr-3xl rounded-tl-3xl mt-[-1.5rem] bg-white">
                {/* TITULO */}
                <div className="flex items-center gap-[0.375rem]">
                    <div className="relative h-8 w-8">
                        <Image 
                            src={restaurant.imageUrl}
                            alt={restaurant.name}
                            fill
                            className="rounded-full object-cover"
                        />
                    </div>
                    <h1 className="text-xl font-semibold">{ restaurant.name }</h1>
                </div>

                <div className="bg-foreground py-[2px] px-2 rounded-full text-white flex items-center gap-[3px]">
                        <StarIcon size={12} className="fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold text-xs">5,0</span>
                </div>
            </div>


            <div className="px-5">
                <DeliveryInfo restaurant={restaurant} />
            </div>

            <div className="flex overflow-x-scroll [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] px-5 mt-3 gap-4">
                {restaurant.categories.map(category => (
                    <div key={category.id} className="bg-[#f4f4f4] min-w-[167px] text-center rounded-lg">
                        <span className="text-xs text-muted-foreground">
                            {category.name}
                        </span>
                    </div>
                ))}
            </div>
            

            <div className="mt-6 space-y-4">
                {/* TODO: mostrar produtos mais pedidos quando implementarmos realizaçao de pedido */}
                <h2 className="font-semibold px-5">Mais Pedidos</h2>
                <ProductList products={restaurant.products} />
            </div>

            {restaurant.categories.map( (category) => (
                <div key={category.id} className="mt-6 space-y-4">
                    {/* TODO: mostrar produtos mais pedidos quando implementarmos realizaçao de pedido */}
                    <h2 className="font-semibold px-5">{category.name}</h2>
                    <ProductList products={category.products} />
                </div>
            ))}

            <CartBanner restaurant={restaurant} />

        </div>
        
    );
}
 
export default ResaurantPage;