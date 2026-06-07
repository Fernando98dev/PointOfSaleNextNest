import { ProductCard } from "@/app/components/products/ProductCard";
import { CategoryWithProductsResponseSchema } from "@/app/schema/schema";
import { redirect } from "next/navigation";

type Params = Promise<{ params: { categoryId: string } }>;

async function getProductsByCategory(categoryId: string) {
    const url = `${process.env.API_URL}/categories/${categoryId}?products=true`;
    const res = await fetch(url, {
        next: {
            tags: ['products-by-category']
        }
    });
    const data = await res.json();
    if (!res.ok) {
        redirect("/1");
    }
    const products = CategoryWithProductsResponseSchema.parse(data);
    return products;
}

export default async function CategoryPage({ params }: { params: { categoryId: string } }) {

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