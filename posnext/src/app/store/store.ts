import { create } from "zustand";
import { Coupon, CouponResponseSchema, ErrorCouponSchema, Product, ShoppingCart, SuccessCouponSchema } from "../schema/schema";

interface StoreState {
    total: number;
    discount: number;
    content: ShoppingCart;
    coupon: Coupon;
    addToCart: (product: Product) => void;
    updateQuantity: (id: Product['id'], quantity: number) => void;
    removeFromCart: (id: Product['id']) => void;
    calculateTotal: () => void;
    applyCoupon: (couponName: string) => Promise<void>;
    applyDiscount: () => void
    clearOrder: () => void
}

const initialState = {
    total: 0,
    discount: 0,
    content: [],
    coupon: {
        percentage: 0,
        name: '',
        message: ''
    },
}

export const useStore = create<StoreState>()((set, get) => ({
    ...initialState,
    addToCart: (product) => {
        const { id: productId, categoryId, ...data } = product

        let content: ShoppingCart = [];
        const existingProduct = get().content.findIndex(item => item.productId === productId);

        if (existingProduct !== -1) {
            if (get().content[existingProduct].quantity >= get().content[existingProduct].inventory) {
                return;
            }
            content = get().content.map((item) => item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item);

        } else {

            content = [...get().content, { ...data, productId, quantity: 1 }];
            console.log('add to cart', product);
        }

        set({ content });

        get().calculateTotal();
    },

    updateQuantity: (id, quantity) => {
        const content = get().content.map(item => item.productId === id ? { ...item, quantity } : item);
        set({ content });
        get().calculateTotal();
    },

    removeFromCart: (id) => {
        const content = get().content.filter(item => item.productId !== id);
        set({ content });
        if (!get().content.length) {
            get().clearOrder()
        }
        get().calculateTotal();

    },

    calculateTotal: () => {
        const total = get().content.reduce((acc, item) => acc + item.price * item.quantity, 0);
        set({ total });

        if (get().coupon.percentage) {
            get().applyDiscount()
        }
    },

    applyCoupon: async (couponName) => {
        const req = await fetch('/coupons/api', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: couponName
            })
        })
        const json = await req.json();

        if (req.ok) {
            const successCoupon = SuccessCouponSchema.parse(json)
            set({
                coupon: {
                    name: successCoupon.coupon.name,
                    percentage: successCoupon.coupon.percentage,
                    message: successCoupon.message
                }
            })
            get().applyDiscount()
        } else {
            const errorCoupon = ErrorCouponSchema.parse(json)
            set({
                coupon: {
                    name: '',
                    percentage: 0,
                    message: errorCoupon.message
                }
            })
            get().calculateTotal()
        }
    },

    applyDiscount: () => {
        const subtotalAmount = get().content.reduce((total, item) => total + (item.quantity * item.price), 0)
        const discount = (get().coupon.percentage / 100) * subtotalAmount
        const total = subtotalAmount - discount

        set(() => ({
            discount,
            total
        }))
    },
    clearOrder: () => {
        set(() => ({
            ...initialState
        }))
    }

}));