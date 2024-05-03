import { Product } from "@prisma/client";
import { ArrowDownIcon } from "lucide-react";

interface DiscountPercentageProps {
    product: Pick<Product, "discountPercentage">,
    /* discountPercentage: number, */
}

const DiscountBadge = ({product}: DiscountPercentageProps) => {
    return (
        <div className="top-2 left-2 bg-primary py-[2px] px-2 rounded-full text-white flex items-center gap-[2px]">
            <ArrowDownIcon size={12} />
            <span className="font-semibold text-xs">{product.discountPercentage}%</span>
        </div>
    );
}
 
export default DiscountBadge;