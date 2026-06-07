import { z } from 'zod'

export const ProductSchema = z.object({
    id: z.number(),
    name: z.string(),
    image: z.string(),
    price: z.coerce.number(),
    inventory: z.number(),
    categoryId: z.coerce.number().nullable().optional()
})

export const ProductsResponseSchema = z.object({
    data: z.array(ProductSchema),
    total: z.number()
})

export const ShoppingCartContentSchema = ProductSchema.pick({
    name: true,
    image: true,
    price: true,
    inventory: true
}).extend({
    productId: z.number(),
    quantity: z.number()
});

export const ShoppingCartSchema = z.array(ShoppingCartContentSchema);

export const CategorySchema = z.object({
    id: z.number(),
    name: z.string()
})

export const CategoriesResponseSchema = z.array(CategorySchema);


export const CategoryWithProductsResponseSchema = CategorySchema.extend({
    products: z.array(ProductSchema)
});

export const CouponResponseSchema = z.object({
    name: z.string().default(''),
    message: z.string(),
    percentage: z.coerce.number().min(0).max(100).default(0)
})
const OrderContentSchema = z.object({
    productId: z.number(),
    quantity: z.number(),
    price: z.number()
})

export const SuccessCouponSchema = z.object({
    status: z.number(),
    message: z.string(),
    coupon: z.object({
        name: z.string(),
        percentage: z.coerce.number()
    })
})

export const ErrorCouponSchema = z.object({
    status: z.number(),
    message: z.string(),
})

export const OrderSchema = z.object({
    total: z.number(),
    coupon: z.string(),
    contents: z.array(OrderContentSchema).min(1, { message: 'El Carrito no puede ir vacio' })
})

/** Success / Error Response */
export const SuccessResponseSchema = z.object({
    message: z.string()
})
export const ErrorResponseSchema = z.object({
    message: z.array(z.string()),
    error: z.string(),
    statusCode: z.number()
})

export const ContentsSchema = z.object({
    id: z.number(),
    quantity: z.number(),
    price: z.coerce.number(),
    product: ProductSchema
})

export const TransactionResponseSchema = z.object({
    id: z.number(),
    total: z.coerce.number(),
    transactionDate: z.string(),
    discount: z.coerce.number(),
    coupon: z.string().nullable(),
    contents: z.array(ContentsSchema)
})

export const ProductFormSchema = z.object({
    name: z.string()
        .min(1, { message: 'El Nombre del Producto no puede ir vacio' }),
    price: z.coerce.number({ message: 'Precio no válido' })
        .min(1, { message: 'El Precio debe ser mayor a 0' }),
    image: z.string({ message: 'La imagen es obligatoria' }),
    inventory: z.coerce.number({ message: 'Inventario no válido' })
        .min(1, { message: 'El inventario debe ser mayor a 0' }),
    categoryId: z.coerce.number({ message: 'La Categoria no es válida' })
        .min(1, { message: 'La Categoria no es válida' })
})

export const TransactionsResponseSchema = z.array(TransactionResponseSchema)

export type ShoppingCart = z.infer<typeof ShoppingCartSchema>;

export type Product = z.infer<typeof ProductSchema>;

export type CartItem = z.infer<typeof ShoppingCartContentSchema>;

export type Coupon = z.infer<typeof CouponResponseSchema>

export type Transaction = z.infer<typeof TransactionResponseSchema>