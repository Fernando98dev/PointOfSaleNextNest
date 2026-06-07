import { TransactionsResponseSchema } from "@/app/schema/schema"


export async function getSalesByDate(date: string) {
    const isServer = typeof window === 'undefined'
    const baseUrl = isServer ? process.env.API_URL : ''
    const path = isServer ? '/transactions' : '/admin/sales/api'

    const url = `${baseUrl}${path}?transactionDate=${date}`
    const req = await fetch(url)
    const json = await req.json()
    const transactions = TransactionsResponseSchema.parse(json)
    return transactions
}