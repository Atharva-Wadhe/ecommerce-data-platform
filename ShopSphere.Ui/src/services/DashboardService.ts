import api from './api';
import {
    DashboardSummaryResponse,
    RevenueTrendResponse,
    OrderStatusResponse,
    CategorySalesResponse,
    TopSellerResponse,
    GeographyResponse,
    DeliveryMetricsResponse,
    ReviewMetricsResponse
} from '../models/DashboardModels';

export const DashboardService = {
    async getSummary(fromDate: string, toDate: string): Promise<DashboardSummaryResponse> {
        const res = await api.get<DashboardSummaryResponse>('/api/dashboard/summary', {
            params: { fromDate, toDate }
        });
        return res.data;
    },

    async getRevenueTrend(fromDate: string, toDate: string): Promise<RevenueTrendResponse[]> {
        const res = await api.get<RevenueTrendResponse[]>('/api/dashboard/revenue-trend', {
            params: { fromDate, toDate }
        });
        return res.data;
    },

    async getOrderStatus(fromDate: string, toDate: string): Promise<OrderStatusResponse[]> {
        const res = await api.get<OrderStatusResponse[]>('/api/dashboard/order-status', {
            params: { fromDate, toDate }
        });
        return res.data;
    },

    async getCategorySales(fromDate: string, toDate: string): Promise<CategorySalesResponse[]> {
        const res = await api.get<CategorySalesResponse[]>('/api/dashboard/category-sales', {
            params: { fromDate, toDate }
        });
        return res.data;
    },

    async getTopSellers(fromDate: string, toDate: string, limit: number = 10): Promise<TopSellerResponse[]> {
        const res = await api.get<TopSellerResponse[]>('/api/dashboard/top-sellers', {
            params: { fromDate, toDate, limit }
        });
        return res.data;
    },

    async getGeography(fromDate: string, toDate: string): Promise<GeographyResponse[]> {
        const res = await api.get<GeographyResponse[]>('/api/dashboard/geography', {
            params: { fromDate, toDate }
        });
        return res.data;
    },

    async getDelivery(fromDate: string, toDate: string): Promise<DeliveryMetricsResponse> {
        const res = await api.get<DeliveryMetricsResponse>('/api/dashboard/delivery', {
            params: { fromDate, toDate }
        });
        return res.data;
    },

    async getReviews(fromDate: string, toDate: string): Promise<ReviewMetricsResponse> {
        const res = await api.get<ReviewMetricsResponse>('/api/dashboard/reviews', {
            params: { fromDate, toDate }
        });
        return res.data;
    }
};
