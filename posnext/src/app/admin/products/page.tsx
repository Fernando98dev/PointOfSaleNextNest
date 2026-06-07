

import ProductsTable from "@/app/components/products/ProductsTable";
import Heading from "@/app/components/ui/Heading";
import Pagination from "@/app/components/ui/Pagination";
import { isValidPage } from "@/app/config/utils";
import { ProductsResponseSchema } from "@/app/schema/schema";
import Link from "next/link";
import { notFound } from "next/navigation";

async function getProducts(take: number, skip: number) {
    const url = `${process.env.API_URL}/products?take=${take}&skip=${skip}`
    const req = await fetch(url)
    const json = await req.json()
    const data = ProductsResponseSchema.parse(json)
    return {
        products: data.data,
        total: data.total
    }
}

type SearchParams = Promise<{ page: string }>

export default async function ProductsPage({ searchParams }: { searchParams: SearchParams }) {

    const { page } = await searchParams
    const currentPage = +page || 1
    if (!isValidPage(currentPage)) notFound()
    const productsPerPage = 10
    const skip = (currentPage - 1) * productsPerPage
    const { products, total } = await getProducts(productsPerPage, skip)
    const totalPages = Math.ceil(total / productsPerPage)
    if (currentPage > totalPages && totalPages > 0) notFound()

    return (
        <>
            <Link
                href='/admin/products/new'
                className="rounded bg-green-400 font-bold py-2 px-10 "
            >Nuevo Producto</Link>

            <Heading>Administrar Productos</Heading>

            <ProductsTable
                products={products}
            />

            <Pagination
                page={currentPage}
                totalPages={totalPages}
                baseUrl="/admin/products"
            />
        </>
    )
}

