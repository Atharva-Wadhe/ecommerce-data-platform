export interface DashboardSummaryResponse {
    totalRevenue: number;
    totalOrders: number;
    totalCustomers: number;
    totalProducts: number;
    totalSellers: number;
    averageOrderValue: number;
    averageDeliveryDays: number;
    averageReviewScore: number;
}

export interface RevenueTrendResponse {
    date: string;
    revenue: number;
    orders: number;
}

export interface OrderStatusResponse {
    status: string;
    orders: number;
}

export interface CategorySalesResponse {
    category: string;
    revenue: number;
    orders: number;
}

export interface TopSellerResponse {
    seller: string;
    revenue: number;
    orders: number;
    averageRating: number;
}

export interface GeographyResponse {
    state: string;
    revenue: number;
    orders: number;
    customers: number;
}

export interface DeliveryMetricsResponse {
    averageDelivery: number;
    minimumDelivery: number;
    maximumDelivery: number;
}

export interface ReviewMetricsResponse {
    averageRating: number;
    stars1: number;
    stars2: number;
    stars3: number;
    stars4: number;
    stars5: number;
}
