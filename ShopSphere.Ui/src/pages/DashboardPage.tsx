import React, { useState, useEffect, useCallback } from 'react';
import { Bell, User, ChevronDown } from 'lucide-react';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import DashboardSummary from '../components/dashboard/DashboardSummary';
import RevenueTrendChart from '../components/dashboard/RevenueTrendChart';
import CategorySalesChart from '../components/dashboard/CategorySalesChart';
import OrderStatusChart from '../components/dashboard/OrderStatusChart';
import TopSellersTable from '../components/dashboard/TopSellersTable';
import GeographyChart from '../components/dashboard/GeographyChart';
import DeliveryMetrics from '../components/dashboard/DeliveryMetrics';
import ReviewMetrics from '../components/dashboard/ReviewMetrics';
import InsightsPanel from '../components/dashboard/InsightsPanel';
import AdminDashboard from '../components/dashboard/AdminDashboard';
import { DashboardService } from '../services/DashboardService';
import { DASHBOARD_CONFIGS, UserRole, WidgetConfig } from '../config/dashboardConfig';
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
    // Active role state
    const [role, setRole] = useState<UserRole>('MANAGEMENT');

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

    const renderWidget = (widget: WidgetConfig) => {
        switch (widget.id) {
            case 'kpi-summary':
            case 'kpi-sales':
            case 'kpi-product':
            case 'kpi-support':
            case 'kpi-seller':
            case 'kpi-logistics':
                return (
                    <DashboardSummary
                        key={widget.id}
                        role={role}
                        summary={summary}
                        categorySales={categorySales}
                        topSellers={topSellers}
                        reviews={reviews}
                        delivery={delivery}
                        isLoading={loadingStates.summary}
                    />
                );
            case 'revenue-trend':
                return (
                    <RevenueTrendChart
                        key={widget.id}
                        data={revenueTrend}
                        isLoading={loadingStates.revenueTrend}
                    />
                );
            case 'category-sales':
                return (
                    <CategorySalesChart
                        key={widget.id}
                        data={categorySales}
                        isLoading={loadingStates.categorySales}
                    />
                );
            case 'order-status':
                return (
                    <OrderStatusChart
                        key={widget.id}
                        data={orderStatus}
                        isLoading={loadingStates.orderStatus}
                    />
                );
            case 'top-sellers':
                return (
                    <TopSellersTable
                        key={widget.id}
                        data={topSellers}
                        limit={topSellersLimit}
                        onLimitChange={setTopSellersLimit}
                        isLoading={loadingStates.topSellers}
                    />
                );
            case 'geography':
                return (
                    <GeographyChart
                        key={widget.id}
                        data={geography}
                        isLoading={loadingStates.geography}
                    />
                );
            case 'delivery-summary':
                return (
                    <DeliveryMetrics
                        key={widget.id}
                        data={delivery}
                        isLoading={loadingStates.delivery}
                    />
                );
            case 'reviews-summary':
                return (
                    <ReviewMetrics
                        key={widget.id}
                        data={reviews}
                        isLoading={loadingStates.reviews}
                    />
                );
            case 'insights-executive':
            case 'insights-sales':
            case 'insights-product':
            case 'insights-support':
            case 'insights-seller':
            case 'insights-logistics':
                return (
                    <InsightsPanel
                        key={widget.id}
                        role={role}
                        summary={summary}
                        categorySales={categorySales}
                        topSellers={topSellers}
                        reviews={reviews}
                        delivery={delivery}
                        geography={geography}
                        revenueTrend={revenueTrend}
                        isLoading={isAnyLoading}
                    />
                );
            case 'admin-status':
                return <AdminDashboard key={widget.id} />;
            default:
                return null;
        }
    };

    const renderWidgets = () => {
        const widgets = DASHBOARD_CONFIGS[role].widgets;
        const elements: React.ReactNode[] = [];
        let i = 0;

        while (i < widgets.length) {
            const current = widgets[i];
            if (current.gridArea === 'half' && i + 1 < widgets.length && widgets[i + 1].gridArea === 'half') {
                const next = widgets[i + 1];
                elements.push(
                    <div className="charts-grid-2" key={`${current.id}-${next.id}`} style={{ marginBottom: 24 }}>
                        {renderWidget(current)}
                        {renderWidget(next)}
                    </div>
                );
                i += 2;
            } else {
                elements.push(
                    <div key={current.id} style={{ marginBottom: 24 }}>
                        {renderWidget(current)}
                    </div>
                );
                i += 1;
            }
        }

        return elements;
    };

    const activeConfig = DASHBOARD_CONFIGS[role];

    return (
        <div style={{ padding: '24px 24px 48px 24px', maxWidth: 1400, margin: '0 auto' }}>
            {/* Top Navbar */}
            <div className="glass-card animate-fade-in" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, padding: '12px 24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Department View:
                    </span>
                    <div style={{ position: 'relative', display: 'inline-block' }}>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value as UserRole)}
                            style={{
                                background: 'linear-gradient(135deg, var(--accent-purple), var(--accent-cyan))',
                                color: '#fff',
                                border: 'none',
                                padding: '8px 16px',
                                paddingRight: 32,
                                borderRadius: 10,
                                fontSize: '0.85rem',
                                fontWeight: 700,
                                outline: 'none',
                                cursor: 'pointer',
                                appearance: 'none',
                                boxShadow: '0 4px 12px var(--accent-purple-glow)'
                            }}
                        >
                            {Object.values(DASHBOARD_CONFIGS).map((cfg) => (
                                <option key={cfg.role} value={cfg.role} style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>
                                    {cfg.displayName}
                                </option>
                            ))}
                        </select>
                        <ChevronDown size={14} color="#fff" style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                    </div>
                </div>

                {/* Profile & Notifications */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <button style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--card-border)', color: 'var(--text-primary)', padding: 8, borderRadius: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Bell size={16} />
                    </button>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--card-border)', padding: '6px 12px', borderRadius: 10 }}>
                        <User size={16} color="var(--accent-cyan)" />
                        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff' }}>Admin User</span>
                    </div>
                </div>
            </div>

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

            {/* Dashboard Description */}
            <div className="glass-card animate-fade-in" style={{ animationDelay: '0.05s', marginBottom: 24, padding: '16px 24px' }}>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff', marginBottom: 4 }}>
                    {activeConfig.displayName}
                </h2>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    {activeConfig.description}
                </p>
            </div>

            {/* Render Dynamic Widgets */}
            {renderWidgets()}
        </div>
    );
}
