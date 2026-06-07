import { formatCurrency, getImagePath } from "@/app/config/utils";
import { Product } from "@/app/schema/schema";
import Image from "next/image";
import { AddProductButton } from "./AddProductButton";

export function ProductCard({ product }: { product: Product }) {
    return (
        <div
            className='rounded bg-white shadow relative p-5'
        >
            <div>
                <Image
                    src={getImagePath(product.image)}
                    alt={product.name}
                    width={400}
                    height={400}

                />

                <div className="p-3 space-y-2">
                    <h3 className="text-xl font-bold text-gray-600">{product.name}</h3>
                    <p className="text-gray-500">Disponibles: {product.inventory}</p>
                    <p className="text-2xl font-extrabold  text-gray-900">{formatCurrency(product.price)}</p>
                </div>
            </div>
            <AddProductButton product={product} />
        </div>
    )
}
