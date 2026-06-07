"use client"

import { useStore } from "@/app/store/store"
import ShoppingCartItem from "./ShoppingCartItem"

import CouponForm from "./CouponForm"
import Amount from "./Amount"
import SubmitOrderForm from "./SubmitOrderForm"

export const ShoppingCart = () => {
    const content = useStore((state) => state.content)
    const total = useStore((state) => state.total)
    const discount = useStore((state) => state.discount)
    return (
        <>
            {content.length ? (
                <>
                    <h2 className='text-4xl font-bold text-gray-900'>Resumen de venta</h2>
                    <ul role="list" className="mt-6 divide-y divide-gray-200 border-t
        border-gray-200 text-sm font-medium text-gray-500">
                        {content.map(item => (
                            <ShoppingCartItem key={item.productId}
                                item={item} />
                        ))}
                    </ul>

                    <dl className="spcae-y-6 border-t border-gray-300 py-6
                    text-sm font-medium text-gray-500">
                        {discount > 0 && (
                            <Amount label="Descuento" amount={discount} discount={true} />
                        )}
                        <Amount label="Total" amount={total} />
                    </dl>

                    <CouponForm />

                    <SubmitOrderForm />
                </>
            ) : (
                <p className="text-gray-900 text-center text-xl">No hay productos en el carrito</p>
            )}

        </>
    )
}
