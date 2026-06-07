import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query"
import { format } from "date-fns"
import { getSalesByDate } from "./api/api"
import Heading from "@/app/components/ui/Heading"
import TransactionFilter from "@/app/components/transactions/TransactionFilter"




export default async function SalesPage() {
    const queryClient = new QueryClient()

    const today = new Date()
    const formattedDate = format(today, 'yyyy-MM-dd')
    await queryClient.prefetchQuery({
        queryKey: ['sales', formattedDate],
        queryFn: () => getSalesByDate(formattedDate)
    })

    return (
        <>
            <Heading>Ventas</Heading>
            <p className="text-lg">En esta sección aparecerán las ventas, utiliza el calendario para filtrar por fecha.</p>

            <HydrationBoundary state={dehydrate(queryClient)}>
                <TransactionFilter />
            </HydrationBoundary>
        </>
    )
}
