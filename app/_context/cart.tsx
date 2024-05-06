"use client"

import { Prisma, Product } from "@prisma/client";
import { ReactNode, createContext, useMemo, useState } from "react";
import { calculateProductTotalPrice } from "../_helpers/price";

// export interface CartProduct extends Product {
export interface CartProduct extends Prisma.ProductGetPayload<{include: {
    restaurant: {
        select: {
            id: true,
            deliveryFee: true,
            deliveryTimeMinutes: true
        }
    }
}}> {

    quantity: number
}

interface ICartContext {
    products: CartProduct[];
    subtotalPrice: number;
    totalPrice: number;
    totalQuantity: number;
    totalDiscounts: number;
    // addProductToCart: (product: Product, quantity: number) => void;
    addProductToCart: ({ product, quantity, emptyCart }: {
        product: Prisma.ProductGetPayload<{include: {
            restaurant: {
                select: {
                    id: true,
                    deliveryFee: true,
                    deliveryTimeMinutes: true
                }
            }
        }}>;
        quantity: number;
        emptyCart?: boolean;
    }) => void
    removeProductFromCart: (productId: string) => void;
    increaseProductQuantity: (productId: string) => void;
    decreaseProductQuantity: (productId: string) => void;
    clearCart: () => void;
}

export const CartContext = createContext<ICartContext>({
    products: [],
    subtotalPrice: 0,
    totalPrice: 0,
    totalQuantity: 0,
    totalDiscounts: 0,
    addProductToCart: () => {},
    removeProductFromCart: () => {},
    increaseProductQuantity: () => {},
    decreaseProductQuantity: () => {},
    clearCart: () => {},
})

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [products, setProducts] = useState<CartProduct[]>([]);

    const clearCart = () => {
        return setProducts([]);
    }

    const subtotalPrice = useMemo(() => {
        // acc = accumulator
        return products.reduce((acc, product) =>{
            return acc + Number(product.price) * product.quantity;
        }, 0)
    }, [products])

    const totalPrice = useMemo(() => {
        // acc = accumulator
        return products.reduce((acc, product) =>{
            return acc + calculateProductTotalPrice(product) * product.quantity;
        }, 0) + Number(products?.[0]?.restaurant?.deliveryFee)
    }, [products])

    const totalQuantity = useMemo (() => {
        return products.reduce((acc, product) => {
            return acc + product.quantity;
        }, 0)
    }, [products])

    const totalDiscounts = subtotalPrice - totalPrice + Number(products?.[0]?.restaurant?.deliveryFee);

    // ADICIONAR PRODUTO
    const addProductToCart = ({
        product,
        quantity,
        emptyCart
    }: {
        product: Prisma.ProductGetPayload<{
            include: {
                restaurant: { 
                    select: { 
                        deliveryFee: true 
                    }
                }
            }
        }>, 
        quantity: number,
        emptyCart?: boolean,
    }) => {
        // VERIFICARSE H´A ALGUM PRODUTO DE OUTRO RESTAURANTE NO CARRINHO
        /*
        const hasDifferentRestaurantProduct = products.some(
            (cartProduct) => cartProduct.restaurantId != product.restaurantId
        )
        */
        if (emptyCart) {
            setProducts([]);
        }
        
        // VERIFICAR SE O PRODUTO J´A ESTA NO CARRINHO
        const isProductAlreadyOnCart = products.some(
            cartProduct => cartProduct.id == product.id
        )

         // SE ELE ESTIVER, AUMENTAR A SUA QUANTIDADE
        if (isProductAlreadyOnCart) {
            return setProducts((prev) => prev.map( (cartProduct) => {
                if (cartProduct.id == product.id) {
                    return {
                        ...cartProduct,
                        quantity : cartProduct.quantity + quantity
                    };
                }

                return cartProduct;
            }))
        }

        // SE NAO, ADICIONA-LO COM A QUANTIDADE RECEBIDA
        setProducts((prev) => [...prev, {...product, quantity: quantity}])
    }


    // REMOVER PRODUTO
    const removeProductFromCart = (productId: string) => {
        return setProducts((prev) => prev.filter((product) => product.id != productId))
    }



    // AUMENAR QUANTIDADE
    const increaseProductQuantity = (productId: string) => {
        return setProducts((prev) => {
            return prev.map((cartProduct) => {
                if (cartProduct.id == productId) {
                    return {
                        ...cartProduct,
                        quantity: cartProduct.quantity + 1
                    };
                }
                return cartProduct;
            })
        })
    }

    // DIMINUIR QUANTIDADE
    const decreaseProductQuantity = (productId: string) => {
        return setProducts((prev) => {
            return prev.map((cartProduct) => {
                if (cartProduct.id == productId) {
                    if (cartProduct.quantity == 1) {
                        return cartProduct;
                    }
                    return {
                        ...cartProduct,
                        quantity: cartProduct.quantity - 1
                    };
                }
                return cartProduct;
            })
        })
    }

    return (
        <CartContext.Provider value={{ 
            products,
            subtotalPrice,
            totalPrice,
            totalQuantity,
            totalDiscounts,
            clearCart,
            addProductToCart,
            removeProductFromCart,
            decreaseProductQuantity,
            increaseProductQuantity 
        }}>
            {children}
        </CartContext.Provider>
    )
}