import { useEffect, useState, useCallback } from "react"
import type {
    AnalyticsData,
    DateRange,
    RevenuePoint,
    CategoryBreakdown,
} from "../types/analytics"

type useAnalyticsDataResult = {
    data: AnalyticsData | null
    loading: boolean
    error: string | null
    refetch: () => void
}

type FakeStoreProduct = {
    id: number
    title: string
    price: number
    category: string
}

type FakeStoreCartProduct ={
    productId: number
    quantity: number 
}

type FakeStoreCart = {
    id: number
    userId: number
    date: string // 2020-03-02T00:00:00.00Z
    products: FakeStoreCartProduct[]
}

function isWithinRange(date: Date, range: DateRange) {
    return date >= range.from && date <= range.to
}

function formatDateKey(date: Date): string {
    return date.toISOString().slice(0, 10) // "YYYY-MM-DD"
}

export function useAnalyticsData(dateRange: DateRange): useAnalyticsDataResult {
    const [data, setData] = useState<AnalyticsData | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)
    const [reloadToken, setReloadToken] = useState<number>(0)

    const refetch = useCallback(() => {
        setReloadToken((t) => t + 1)
    }, [])

    useEffect(() => {
        let cancelled = false

        async function fetchData() {
            setLoading(true)
            setError(null)

            try {
                const [productsRes, cartsRes] = await Promise.all ([
                    fetch("https://fakestoreapi.com/products"),
                    fetch("https://fakestoreapi.com/carts"),  
                ])

                if (!productsRes.ok || !cartsRes.ok) {
                    throw new Error("Network response was not ok")
                }

                const products: FakeStoreProduct[] = await productsRes.json()
                const carts: FakeStoreCart[] = await cartsRes.json()

                if (cancelled) return

                const analytics = transformToAnalytics(products, carts, dateRange)
                setData(analytics)
            } catch (err) {
                console.error(err)
                if (!cancelled) {
                    setError("Unable to load analytics data.")
                }
            } finally {
                if (!cancelled) {
                    setLoading(false)
                }
            }
        }

        fetchData()

        return () => {
            cancelled = true
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        // eslint-disable-next-line react-hooks/exhaustive-deps
        dateRange.from.getTime(),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        dateRange.to.getTime(),
        reloadToken,
    ])

    return {data, loading, error, refetch}
}

/**
 * Core transformation logic:
 * - Joins carts with products to compute revenue per order
 * - Filters by date range
 * - Aggregates:
 *   - totalRevenue
 *   - totalAppointments
 *   - avgOrderValue
 *   - revenue per day (for time series)
 *   - revenue per category
 */
function transformToAnalytics(
    products: FakeStoreProduct[],
    carts: FakeStoreCart[],
    dateRange: DateRange
): AnalyticsData {
    // Build product lookup map
    const productMap = new Map<number, FakeStoreProduct>()
    for (const p of products) {
        productMap.set(p.id, p)
    }

    let totalRevenue = 0
    let totalAppointments = 0

    const dateRevenueMap = new Map<string, number>() //dateKey -> revenue
    const categoryRevenueMap = new Map<string, number>() // category -> revenue

    for (const cart of carts) {
        const cartDate = new Date(cart.date)
        if (!isWithinRange(cartDate, dateRange)) continue

        let orderRevenue = 0

        for (const line of cart.products) {
            const product = productMap.get(line.productId)
            if (!product) continue

            const lineRevenue = product.price * line.quantity
            orderRevenue += lineRevenue

            const prevCatRevenue = categoryRevenueMap.get(product.category) ?? 0
            categoryRevenueMap.set(product.category, prevCatRevenue + lineRevenue)
        }

        if (orderRevenue > 0) {
            totalRevenue += orderRevenue
            totalAppointments +=1

            const dayKey = formatDateKey(cartDate)
            const prevDayRevenue = dateRevenueMap.get(dayKey) ?? 0
            dateRevenueMap.set(dayKey, prevDayRevenue + orderRevenue)
        }
    }

    const avgOrderValue =
    totalAppointments > 0 ? totalRevenue / totalAppointments : 0

    const series: RevenuePoint[] = Array.from(dateRevenueMap.entries())
    .map(([date, revenue]) => ({ date, revenue }))
    .sort((a, b) => (a.date < b.date ? -1 : 1))

    const byCategory: CategoryBreakdown[] = Array.from(
        categoryRevenueMap.entries()
    )
    .map(([category, revenue]) => ({ category, revenue }))
    .sort((a, b) => b.revenue - a.revenue);

    return {
        kpis: {
            totalRevenue,
            totalAppointments,
            avgOrderValue,
        },
        series,
        byCategory
    }
}