import { Restaurant } from "@prisma/client";
import { BikeIcon, HeartIcon, StarIcon, TimerIcon } from "lucide-react";
import Image from "next/image";
import { formatCurrency } from "../_helpers/price";
import { Button } from "./ui/button";
import Link from "next/link";

interface RestaurantItemProps {
    restaurant: Restaurant
}

const RestaurantItem = ({restaurant}: RestaurantItemProps) => {

    return ( 
        <Link 
            href={`/restaurants/${restaurant.id}`}
            className="min-w-[266px] max-w-[266px]"
        >
            <div className="w-full space-y-3">
                <div className="w-full h-[136px] relative">
                    <Image 
                        src={restaurant.imageUrl} 
                        fill className="object-cover rounded-lg" 
                        alt={restaurant.name} 
                    />

                    <div className="absolute top-2 left-2 bg-white py-[2px] px-2 rounded-full text-black flex items-center gap-[2px]">
                        <StarIcon size={12} className="fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold text-xs">5,0</span>
                    </div>

                </div>
                <div>
                    <h3 className="text-sm font-semibold">{restaurant.name}</h3>
                    {/* INFORMACOES DA ENTREGA */}
                    <div className="flex gap-3">
                        {/* CUSTO DE ENTREGA */}
                        <div className="flex gap-1 items-center">
                            <BikeIcon className="text-primary" size={14} />
                            <span className="text-xs text-muted-foreground">
                                {Number(restaurant.deliveryFee) == 0 ? "Entrega grátis" : formatCurrency(Number(restaurant.deliveryFee))}
                            </span>
                        </div>

                        {/* TEMPO DE ENTREGA */}
                        <div className="flex items-center gap-1">
                            <TimerIcon className="text-primary" size={14} />
                            <span className="text-xs text-muted-foreground">
                                {restaurant.deliveryTimeMinutes} min
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
        
    );
}
 
export default RestaurantItem;