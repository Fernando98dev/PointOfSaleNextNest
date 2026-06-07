"use client"


import { addProduct } from "@/app/actions/add-product-action"
import { useRouter } from "next/navigation"
import { JSXElementConstructor, ReactElement, ReactNode, ReactPortal, useActionState, useEffect } from "react"
import { toast, ToastContentProps } from "react-toastify"

export default function AddProductForm({ children }: { children: React.ReactNode }) {

    const router = useRouter()

    const [state, dispatch] = useActionState(addProduct, {
        errors: [],
        success: ''
    })

    useEffect(() => {
        if (state.errors) {
            state.errors.forEach((error: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | ((props: ToastContentProps<unknown>) => ReactNode) | null | undefined) => toast.error(error))
        }
        if (state.success) {
            toast.success(state.success)
            router.push('/admin/products')
        }
    }, [state])

    return (
        <form
            className="space-y-5"
            action={dispatch}
        >
            {children}
            <input
                type="submit"
                className="rounded bg-green-400 font-bold py-2 w-full cursor-pointer"
                value="Agregar Producto"
            />
        </form>
    )
}