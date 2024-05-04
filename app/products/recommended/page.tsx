import Header from "@/app/_components/header";
import ProductItem from "@/app/_components/product-item";
import { db } from "@/app/_lib/prisma";

const RecommendedProductsPage = async () => {
    const products = await db.product.findMany({
        where: {
            // discountPercentage: 0
        },
        take: 25,
        include: {
            // restaurant: true
            restaurant: {
                select: {
                    name: true,
                }
            }
        }
    });
    // TODO: pegar produtos com mais pedidos
    return (
        <>
            <Header />
            <div className="py-6 px-5">
                <h2 className="mb-6 text-lg font-semibold">Pedidos Recomendados</h2>
                <div className="grid grid-cols-2 gap-6">
                    {products.map((product) => (
                        <ProductItem
                            key={product.id}
                            product={product}
                            className="min-w-full"
                        />
                    ))}
                </div>
            </div>
        </>
    );
}
 
export default RecommendedProductsPage;