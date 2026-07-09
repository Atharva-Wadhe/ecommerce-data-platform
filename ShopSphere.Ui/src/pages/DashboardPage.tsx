import React, { useState, useEffect, useCallback } from 'react';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import DashboardSummary from '../components/dashboard/DashboardSummary';
import RevenueTrendChart from '../components/dashboard/RevenueTrendChart';
import CategorySalesChart from '../components/dashboard/CategorySalesChart';
import OrderStatusChart from '../components/dashboard/OrderStatusChart';
import TopSellersTable from '../components/dashboard/TopSellersTable';
import GeographyChart from '../components/dashboard/GeographyChart';
import DeliveryMetrics from '../components/dashboard/DeliveryMetrics';
import ReviewMetrics from '../components/dashboard/ReviewMetrics';
import { DashboardService } from '../services/DashboardService';
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

export default function DashboardPage() {
    // Default date range based on warehouse data range (2017-10-01 to 2017-10-02)
    const [fromDate, setFromDate] = useState('2017-10-01');
    const [toDate, setToDate] = useState('2017-10-02');
    const [appliedFromDate, setAppliedFromDate] = useState('2017-10-01');
    const [appliedToDate, setAppliedToDate] = useState('2017-10-02');

    const [topSellersLimit, setTopSellersLimit] = useState(10);

    // Data states
    const [summary, setSummary] = useState<DashboardSummaryResponse | null>(null);
    const [revenueTrend, setRevenueTrend] = useState<RevenueTrendResponse[]>([]);
    const [categorySales, setCategorySales] = useState<CategorySalesResponse[]>([]);
    const [orderStatus, setOrderStatus] = useState<OrderStatusResponse[]>([]);
    const [topSellers, setTopSellers] = useState<TopSellerResponse[]>([]);
    const [geography, setGeography] = useState<GeographyResponse[]>([]);
    const [delivery, setDelivery] = useState<DeliveryMetricsResponse | null>(null);
    const [reviews, setReviews] = useState<ReviewMetricsResponse | null>(null);

    // Independent loading states
    const [loadingStates, setLoadingStates] = useState({
        summary: false,
        revenueTrend: false,
        categorySales: false,
        orderStatus: false,
        topSellers: false,
        geography: false,
        delivery: false,
        reviews: false
    });

    // Fetch functions
    const fetchSummary = useCallback(async (from: string, to: string) => {
        setLoadingStates(prev => ({ ...prev, summary: true }));
        try {
            const data = await DashboardService.getSummary(from, to);
            setSummary(data);
        } catch (err) {
            console.error('Error fetching summary:', err);
        } finally {
            setLoadingStates(prev => ({ ...prev, summary: false }));
        }
    }, []);

    const fetchRevenueTrend = useCallback(async (from: string, to: string) => {
        setLoadingStates(prev => ({ ...prev, revenueTrend: true }));
        try {
            const data = await DashboardService.getRevenueTrend(from, to);
            setRevenueTrend(data);
        } catch (err) {
            console.error('Error fetching revenue trend:', err);
        } finally {
            setLoadingStates(prev => ({ ...prev, revenueTrend: false }));
        }
    }, []);

    const fetchCategorySales = useCallback(async (from: string, to: string) => {
        setLoadingStates(prev => ({ ...prev, categorySales: true }));
        try {
            const data = await DashboardService.getCategorySales(from, to);
            setCategorySales(data);
        } catch (err) {
            console.error('Error fetching category sales:', err);
        } finally {
            setLoadingStates(prev => ({ ...prev, categorySales: false }));
        }
    }, []);

    const fetchOrderStatus = useCallback(async (from: string, to: string) => {
        setLoadingStates(prev => ({ ...prev, orderStatus: true }));
        try {
            const data = await DashboardService.getOrderStatus(from, to);
            setOrderStatus(data);
        } catch (err) {
            console.error('Error fetching order status:', err);
        } finally {
            setLoadingStates(prev => ({ ...prev, orderStatus: false }));
        }
    }, []);

    const fetchTopSellers = useCallback(async (from: string, to: string, limit: number) => {
        setLoadingStates(prev => ({ ...prev, topSellers: true }));
        try {
            const data = await DashboardService.getTopSellers(from, to, limit);
            setTopSellers(data);
        } catch (err) {
            console.error('Error fetching top sellers:', err);
        } finally {
            setLoadingStates(prev => ({ ...prev, topSellers: false }));
        }
    }, []);

    const fetchGeography = useCallback(async (from: string, to: string) => {
        setLoadingStates(prev => ({ ...prev, geography: true }));
        try {
            const data = await DashboardService.getGeography(from, to);
            setGeography(data);
        } catch (err) {
            console.error('Error fetching geography sales:', err);
        } finally {
            setLoadingStates(prev => ({ ...prev, geography: false }));
        }
    }, []);

    const fetchDelivery = useCallback(async (from: string, to: string) => {
        setLoadingStates(prev => ({ ...prev, delivery: true }));
        try {
            const data = await DashboardService.getDelivery(from, to);
            setDelivery(data);
        } catch (err) {
            console.error('Error fetching delivery metrics:', err);
        } finally {
            setLoadingStates(prev => ({ ...prev, delivery: false }));
        }
    }, []);

    const fetchReviews = useCallback(async (from: string, to: string) => {
        setLoadingStates(prev => ({ ...prev, reviews: true }));
        try {
            const data = await DashboardService.getReviews(from, to);
            setReviews(data);
        } catch (err) {
            console.error('Error fetching review metrics:', err);
        } finally {
            setLoadingStates(prev => ({ ...prev, reviews: false }));
        }
    }, []);

    // Load all data
    const loadAllData = useCallback((from: string, to: string, sellerLimit: number) => {
        fetchSummary(from, to);
        fetchRevenueTrend(from, to);
        fetchCategorySales(from, to);
        fetchOrderStatus(from, to);
        fetchTopSellers(from, to, sellerLimit);
        fetchGeography(from, to);
        fetchDelivery(from, to);
        fetchReviews(from, to);
    }, [
        fetchSummary,
        fetchRevenueTrend,
        fetchCategorySales,
        fetchOrderStatus,
        fetchTopSellers,
        fetchGeography,
        fetchDelivery,
        fetchReviews
    ]);

    // Initial load
    useEffect(() => {
        loadAllData(appliedFromDate, appliedToDate, topSellersLimit);
    }, [appliedFromDate, appliedToDate, topSellersLimit, loadAllData]);

    const handleApply = () => {
        setAppliedFromDate(fromDate);
        setAppliedToDate(toDate);
    };

    const handleRefresh = () => {
        loadAllData(appliedFromDate, appliedToDate, topSellersLimit);
    };

    const isAnyLoading = Object.values(loadingStates).some(state => state);

    return (
        <div style={{ padding: '24px 24px 48px 24px', maxWidth: 1400, margin: '0 auto' }}>
            {/* Header */}
            <DashboardHeader
                fromDate={fromDate}
                toDate={toDate}
                onFromDateChange={setFromDate}
                onToDateChange={setToDate}
                onApply={handleApply}
                onRefresh={handleRefresh}
                isLoading={isAnyLoading}
            />

            {/* KPI Summary Cards */}
            <DashboardSummary
                summary={summary}
                isLoading={loadingStates.summary}
            />

            {/* Row 1: Revenue Trend */}
            <div style={{ marginBottom: 24 }}>
                <RevenueTrendChart
                    data={revenueTrend}
                    isLoading={loadingStates.revenueTrend}
                />
            </div>

            {/* Row 2: Category Sales & Order Status */}
            <div className="charts-grid-2">
                <CategorySalesChart
                    data={categorySales}
                    isLoading={loadingStates.categorySales}
                />
                <OrderStatusChart
                    data={orderStatus}
                    isLoading={loadingStates.orderStatus}
                />
            </div>

            {/* Row 3: Top Sellers & Geography Sales */}
            <div className="charts-grid-2">
                <TopSellersTable
                    data={topSellers}
                    limit={topSellersLimit}
                    onLimitChange={setTopSellersLimit}
                    isLoading={loadingStates.topSellers}
                />
                <GeographyChart
                    data={geography}
                    isLoading={loadingStates.geography}
                />
            </div>

            {/* Row 4: Delivery Metrics & Review Distribution */}
            <div className="charts-grid-2">
                <DeliveryMetrics
                    data={delivery}
                    isLoading={loadingStates.delivery}
                />
                <ReviewMetrics
                    data={reviews}
                    isLoading={loadingStates.reviews}
                />
            </div>
        </div>
    );
}
