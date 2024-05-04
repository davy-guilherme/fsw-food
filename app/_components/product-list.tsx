import { Prisma } from '@prisma/client';
import Product from './product-item'

interface ProductsListProps {
    products: Prisma.ProductGetPayload<{
        include: {
            restaurant: {
                select: {
                    name: true;
                }
            }
        }
    }>[];
}

const ProductList = ( {products}: ProductsListProps) => {

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