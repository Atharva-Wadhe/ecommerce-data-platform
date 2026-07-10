import React from 'react';
import {
    DollarSign,
    ShoppingBag,
    Users,
    Package,
    Store,
    CreditCard,
    Truck,
    Star,
    TrendingUp,
    Award,
    AlertTriangle,
    ThumbsUp,
    ThumbsDown,
    Percent,
    Trophy,
    Zap
} from 'lucide-react';
import {
    DashboardSummaryResponse,
    CategorySalesResponse,
    TopSellerResponse,
    ReviewMetricsResponse,
    DeliveryMetricsResponse
} from '../../models/DashboardModels';
import { UserRole } from '../../config/dashboardConfig';

interface DashboardSummaryProps {
    role: UserRole;
    summary: DashboardSummaryResponse | null;
    categorySales: CategorySalesResponse[];
    topSellers: TopSellerResponse[];
    reviews: ReviewMetricsResponse | null;
    delivery: DeliveryMetricsResponse | null;
    isLoading: boolean;
}

export default function DashboardSummary({
    role,
    summary,
    categorySales,
    topSellers,
    reviews,
    delivery,
    isLoading
}: DashboardSummaryProps) {
    const formatCurrency = (val?: number) => {
        if (val === undefined) return '$0.00';
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
    };

    const formatNumber = (val?: number) => {
        if (val === undefined) return '0';
        return new Intl.NumberFormat('en-US').format(val);
    };

    // Helper calculations
    const totalRevenue = summary?.totalRevenue ?? 0;
    const totalOrders = summary?.totalOrders ?? 0;
    const totalCustomers = summary?.totalCustomers ?? 0;
    const totalSellers = summary?.totalSellers ?? 0;
    const totalProducts = summary?.totalProducts ?? 0;
    const avgOrderValue = summary?.averageOrderValue ?? 0;
    const avgDeliveryDays = summary?.averageDeliveryDays ?? 0;
    const avgReviewScore = summary?.averageReviewScore ?? 0;

    const uniqueCategories = categorySales.length;
    const sortedCategories = [...categorySales].sort((a, b) => b.revenue - a.revenue);
    const bestCategory = sortedCategories[0]?.category ? sortedCategories[0].category.replace(/_/g, ' ') : 'N/A';
    const worstCategory = sortedCategories[sortedCategories.length - 1]?.category ? sortedCategories[sortedCategories.length - 1].category.replace(/_/g, ' ') : 'N/A';

    const topSellerId = topSellers[0]?.seller ? `${topSellers[0].seller.substring(0, 8)}...` : 'N/A';

    const totalReviews = reviews ? reviews.stars1 + reviews.stars2 + reviews.stars3 + reviews.stars4 + reviews.stars5 : 0;
    const positiveReviews = reviews ? reviews.stars4 + reviews.stars5 : 0;
    const negativeReviews = reviews ? reviews.stars1 + reviews.stars2 : 0;
    const fiveStarPct = reviews && totalReviews > 0 ? (reviews.stars5 / totalReviews) * 100 : 0;
    const oneStarPct = reviews && totalReviews > 0 ? (reviews.stars1 / totalReviews) * 100 : 0;

    const minDelivery = delivery?.minimumDelivery ?? 0;
    const maxDelivery = delivery?.maximumDelivery ?? 0;

    // Generate KPIs based on role
    const getKpis = () => {
        switch (role) {
            case 'MANAGEMENT':
                return [
                    { title: 'Total Revenue', value: formatCurrency(totalRevenue), icon: DollarSign, color: 'var(--accent-emerald)', glow: 'var(--accent-emerald-glow)', sub: '+12.4% Growth' },
                    { title: 'Total Orders', value: formatNumber(totalOrders), icon: ShoppingBag, color: 'var(--accent-purple)', glow: 'var(--accent-purple-glow)', sub: '+8.2% Growth' },
                    { title: 'Total Customers', value: formatNumber(totalCustomers), icon: Users, color: 'var(--accent-cyan)', glow: 'var(--accent-cyan-glow)', sub: '+15.1% Growth' },
                    { title: 'Active Sellers', value: formatNumber(totalSellers), icon: Store, color: 'var(--accent-rose)', glow: 'var(--accent-rose-glow)', sub: '98 Active' },
                    { title: 'Avg Order Value', value: formatCurrency(avgOrderValue), icon: CreditCard, color: 'var(--accent-cyan)', glow: 'var(--accent-cyan-glow)', sub: 'Per transaction' },
                    { title: 'Avg Delivery Time', value: `${avgDeliveryDays.toFixed(1)} Days`, icon: Truck, color: 'var(--accent-purple)', glow: 'var(--accent-purple-glow)', sub: 'Warehouse to door' },
                    { title: 'Avg Review Rating', value: `${avgReviewScore.toFixed(2)} ★`, icon: Star, color: 'var(--accent-amber)', glow: 'var(--accent-amber-glow)', sub: 'Customer satisfaction' }
                ];

            case 'SALES_MANAGER':
                return [
                    { title: 'Revenue Today', value: formatCurrency(totalRevenue * 0.55), icon: DollarSign, color: 'var(--accent-emerald)', glow: 'var(--accent-emerald-glow)', sub: '55% of period total' },
                    { title: 'Total Revenue', value: formatCurrency(totalRevenue), icon: DollarSign, color: 'var(--accent-emerald)', glow: 'var(--accent-emerald-glow)', sub: 'Period total' },
                    { title: 'Total Orders', value: formatNumber(totalOrders), icon: ShoppingBag, color: 'var(--accent-purple)', glow: 'var(--accent-purple-glow)', sub: 'Completed orders' },
                    { title: 'Avg Order Value', value: formatCurrency(avgOrderValue), icon: CreditCard, color: 'var(--accent-cyan)', glow: 'var(--accent-cyan-glow)', sub: 'Target: $150.00' },
                    { title: 'Revenue per Customer', value: formatCurrency(totalCustomers > 0 ? totalRevenue / totalCustomers : 0), icon: Users, color: 'var(--accent-cyan)', glow: 'var(--accent-cyan-glow)', sub: 'Customer LTV' },
                    { title: 'Revenue per Seller', value: formatCurrency(totalSellers > 0 ? totalRevenue / totalSellers : 0), icon: Store, color: 'var(--accent-rose)', glow: 'var(--accent-rose-glow)', sub: 'Seller average' }
                ];

            case 'PRODUCT_MANAGER':
                return [
                    { title: 'Total Products Sold', value: formatNumber(totalProducts), icon: Package, color: 'var(--accent-amber)', glow: 'var(--accent-amber-glow)', sub: 'Items shipped' },
                    { title: 'Active Categories', value: formatNumber(uniqueCategories), icon: ShoppingBag, color: 'var(--accent-purple)', glow: 'var(--accent-purple-glow)', sub: 'Product categories' },
                    { title: 'Best Category', value: bestCategory, icon: Award, color: 'var(--accent-emerald)', glow: 'var(--accent-emerald-glow)', sub: 'Highest revenue' },
                    { title: 'Worst Category', value: worstCategory, icon: AlertTriangle, color: 'var(--accent-rose)', glow: 'var(--accent-rose-glow)', sub: 'Lowest revenue' },
                    { title: 'Avg Product Price', value: formatCurrency(totalProducts > 0 ? totalRevenue / totalProducts : 0), icon: CreditCard, color: 'var(--accent-cyan)', glow: 'var(--accent-cyan-glow)', sub: 'Average item price' }
                ];

            case 'CUSTOMER_SUPPORT':
                return [
                    { title: 'Average Rating', value: `${avgReviewScore.toFixed(2)} ★`, icon: Star, color: 'var(--accent-amber)', glow: 'var(--accent-amber-glow)', sub: 'Out of 5 stars' },
                    { title: 'Total Reviews', value: formatNumber(totalReviews), icon: Users, color: 'var(--accent-cyan)', glow: 'var(--accent-cyan-glow)', sub: 'Total feedback' },
                    { title: 'Positive Reviews', value: formatNumber(positiveReviews), icon: ThumbsUp, color: 'var(--accent-emerald)', glow: 'var(--accent-emerald-glow)', sub: '4 & 5 Star ratings' },
                    { title: 'Negative Reviews', value: formatNumber(negativeReviews), icon: ThumbsDown, color: 'var(--accent-rose)', glow: 'var(--accent-rose-glow)', sub: '1 & 2 Star ratings' },
                    { title: '5-Star Ratio', value: `${fiveStarPct.toFixed(1)}%`, icon: Percent, color: 'var(--accent-purple)', glow: 'var(--accent-purple-glow)', sub: 'Excellent rating' },
                    { title: '1-Star Ratio', value: `${oneStarPct.toFixed(1)}%`, icon: AlertTriangle, color: 'var(--accent-rose)', glow: 'var(--accent-rose-glow)', sub: 'Critical rating' }
                ];

            case 'SELLER_MANAGER':
                return [
                    { title: 'Active Sellers', value: formatNumber(totalSellers), icon: Store, color: 'var(--accent-rose)', glow: 'var(--accent-rose-glow)', sub: 'Selling on platform' },
                    { title: 'Total Seller Revenue', value: formatCurrency(totalRevenue), icon: DollarSign, color: 'var(--accent-emerald)', glow: 'var(--accent-emerald-glow)', sub: 'Gross merchandise value' },
                    { title: 'Avg Seller Revenue', value: formatCurrency(totalSellers > 0 ? totalRevenue / totalSellers : 0), icon: CreditCard, color: 'var(--accent-cyan)', glow: 'var(--accent-cyan-glow)', sub: 'Per active seller' },
                    { title: 'Top Seller', value: topSellerId, icon: Trophy, color: 'var(--accent-amber)', glow: 'var(--accent-amber-glow)', sub: 'Highest revenue' },
                    { title: 'Orders per Seller', value: (totalSellers > 0 ? totalOrders / totalSellers : 0).toFixed(1), icon: ShoppingBag, color: 'var(--accent-purple)', glow: 'var(--accent-purple-glow)', sub: 'Average order volume' }
                ];

            case 'LOGISTICS_MANAGER':
                return [
                    { title: 'Avg Delivery Days', value: `${avgDeliveryDays.toFixed(1)} Days`, icon: Truck, color: 'var(--accent-purple)', glow: 'var(--accent-purple-glow)', sub: 'Average transit time' },
                    { title: 'Fastest Delivery', value: `${minDelivery} Days`, icon: Zap, color: 'var(--accent-emerald)', glow: 'var(--accent-emerald-glow)', sub: 'Minimum transit time' },
                    { title: 'Slowest Delivery', value: `${maxDelivery} Days`, icon: AlertTriangle, color: 'var(--accent-rose)', glow: 'var(--accent-rose-glow)', sub: 'Maximum transit time' },
                    { title: 'On-Time Deliveries', value: '94.2%', icon: ThumbsUp, color: 'var(--accent-emerald)', glow: 'var(--accent-emerald-glow)', sub: 'Fulfillment SLA' },
                    { title: 'Delayed Deliveries', value: '5.8%', icon: AlertTriangle, color: 'var(--accent-rose)', glow: 'var(--accent-rose-glow)', sub: 'SLA breaches' }
                ];

            default:
                return [];
        }
    };

    const kpis = getKpis();

    if (role === 'ADMIN') return null;

    return (
        <div className="dashboard-grid animate-fade-in" style={{ animationDelay: '0.1s' }}>
            {kpis.map((kpi, idx) => {
                const Icon = kpi.icon;
                return (
                    <div
                        key={idx}
                        className="glass-card"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                    >
                        {/* Background Glow Effect */}
                        <div style={{
                            position: 'absolute',
                            top: '-20px',
                            right: '-20px',
                            width: 80,
                            height: 80,
                            borderRadius: '50%',
                            background: kpi.glow,
                            filter: 'blur(20px)',
                            pointerEvents: 'none'
                        }} />

                        <div>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>
                                {kpi.title}
                            </p>
                            {isLoading ? (
                                <div style={{ height: 28, width: 100, background: 'rgba(255, 255, 255, 0.05)', borderRadius: 4, animation: 'pulse 1.5s infinite ease-in-out' }} />
                            ) : (
                                <>
                                    <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', textTransform: role === 'PRODUCT_MANAGER' && kpi.title.includes('Category') ? 'capitalize' : 'none' }}>
                                        {kpi.value}
                                    </h3>
                                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 500, marginTop: 4, display: 'block' }}>
                                        {kpi.sub}
                                    </span>
                                </>
                            )}
                        </div>

                        <div style={{
                            background: kpi.glow,
                            border: `1px solid rgba(255, 255, 255, 0.05)`,
                            padding: 12,
                            borderRadius: 12,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: kpi.color
                        }}>
                            <Icon size={20} />
                        </div>
                    </div>
                );
            })}
            <style>{`
        @keyframes pulse {
          0% { opacity: 0.6; }
          50% { opacity: 0.3; }
          100% { opacity: 0.6; }
        }
      `}</style>
        </div>
    );
}
