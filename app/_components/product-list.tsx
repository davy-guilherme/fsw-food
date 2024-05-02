import {db} from '../_lib/prisma';
import Product from './product-item'

const ProductList = async () => {
    const products = await db.product.findMany({
        where: {
            // discountPercentage: 0
        },
        take: 20,
        include: {
            // restaurant: true
            restaurant: {
                select: {
                    name: true,
                }
            }
        }
    });

    return ( 
        <div className="flex overflow-x-scroll [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] gap-4 px-5">
            {
                products.map((product) => (
                    <Product product={product} key={product.id} />
                ))
            }
        </div>
    );
}
 
export default ProductList;