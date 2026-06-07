import { ProductCard } from "@/app/components/products/ProductCard";
import { CategoryWithProductsResponseSchema } from "@/app/schema/schema";
import { notFound } from "next/navigation";

type Params = Promise<{ categoryId: string }>;

async function getProductsByCategory(categoryId: string) {
    const url = `${process.env.API_URL}/categories/${categoryId}?products=true`;
    const res = await fetch(url, {
        cache: 'no-store',
        next: {
            tags: ['products-by-category']
        }
    });
    const data = await res.json();
    if (!res.ok) {
        notFound();
    }
    const products = CategoryWithProductsResponseSchema.parse(data);
    return products;
}

export default async function CategoryPage({ params }: { params: Params }) {

    const { categoryId } = await params;

    const category = await getProductsByCategory(categoryId);
    return (

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {
                category.products.map((product) => (
                    <ProductCard key={product.id}
                        product={product}
                    />
                ))
            }
        </div>

    );
}