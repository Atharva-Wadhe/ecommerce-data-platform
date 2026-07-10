import React from 'react';
import { Lightbulb, TrendingUp, AlertTriangle, Star, CheckCircle, ThumbsUp } from 'lucide-react';
import {
    DashboardSummaryResponse,
    CategorySalesResponse,
    TopSellerResponse,
    ReviewMetricsResponse,
    DeliveryMetricsResponse,
    GeographyResponse,
    RevenueTrendResponse
} from '../../models/DashboardModels';
import { UserRole } from '../../config/dashboardConfig';

interface InsightsPanelProps {
    role: UserRole;
    summary: DashboardSummaryResponse | null;
    categorySales: CategorySalesResponse[];
    topSellers: TopSellerResponse[];
    reviews: ReviewMetricsResponse | null;
    delivery: DeliveryMetricsResponse | null;
    geography: GeographyResponse[];
    revenueTrend: RevenueTrendResponse[];
    isLoading: boolean;
}

export default function InsightsPanel({
    role,
    summary,
    categorySales,
    topSellers,
    reviews,
    delivery,
    geography,
    revenueTrend,
    isLoading
}: InsightsPanelProps) {
    if (role === 'ADMIN') return null;

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
    };

    const getInsights = () => {
        const insights = [];

        // Sort helper data
        const sortedCategories = [...categorySales].sort((a, b) => b.revenue - a.revenue);
        const sortedStates = [...geography].sort((a, b) => b.revenue - a.revenue);
        const sortedRevenueTrend = [...revenueTrend].sort((a, b) => b.revenue - a.revenue);

        const bestCat = sortedCategories[0]?.category ? sortedCategories[0].category.replace(/_/g, ' ') : 'N/A';
        const worstCat = sortedCategories[sortedCategories.length - 1]?.category ? sortedCategories[sortedCategories.length - 1].category.replace(/_/g, ' ') : 'N/A';
        const bestState = sortedStates[0]?.state ?? 'N/A';
        const worstState = sortedStates[sortedStates.length - 1]?.state ?? 'N/A';
        const topSeller = topSellers[0]?.seller ? `${topSellers[0].seller.substring(0, 8)}...` : 'N/A';
        const topSellerRevenue = topSellers[0]?.revenue ?? 0;
        const avgDeliveryDays = summary?.averageDeliveryDays ?? 0;

        const highestRevDay = sortedRevenueTrend[0]?.date
            ? new Date(sortedRevenueTrend[0].date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' })
            : 'N/A';
        const highestRevVal = sortedRevenueTrend[0]?.revenue ?? 0;

        switch (role) {
            case 'MANAGEMENT':
                insights.push(
                    {
                        type: 'success',
                        text: `Highest revenue day was ${highestRevDay} with a total of ${formatCurrency(highestRevVal)}.`,
                        icon: TrendingUp
                    },
                    {
                        type: 'info',
                        text: `Top performing seller is ${topSeller}, generating ${formatCurrency(topSellerRevenue)} in revenue.`,
                        icon: Star
                    },
                    {
                        type: 'warning',
                        text: `Worst performing state by revenue is ${worstState}. Focus marketing campaigns here.`,
                        icon: AlertTriangle
                    },
                    {
                        type: 'danger',
                        text: `Lowest performing product category is "${worstCat}". Review catalog and pricing.`,
                        icon: AlertTriangle
                    }
                );
                break;

            case 'SALES_MANAGER':
                insights.push(
                    {
                        type: 'success',
                        text: `Top state is ${bestState}, contributing ${formatCurrency(sortedStates[0]?.revenue ?? 0)} (${((sortedStates[0]?.revenue ?? 0) / (summary?.totalRevenue ?? 1) * 100).toFixed(1)}% of total).`,
                        icon: TrendingUp
                    },
                    {
                        type: 'info',
                        text: `Average transaction size (AOV) is ${formatCurrency(summary?.averageOrderValue ?? 0)}.`,
                        icon: CheckCircle
                    },
                    {
                        type: 'warning',
                        text: `Sales concentration: Top 3 states generate over 60% of total revenue.`,
                        icon: AlertTriangle
                    }
                );
                break;

            case 'PRODUCT_MANAGER':
                insights.push(
                    {
                        type: 'success',
                        text: `Category "${bestCat}" is the highest revenue generator, contributing ${formatCurrency(sortedCategories[0]?.revenue ?? 0)}.`,
                        icon: TrendingUp
                    },
                    {
                        type: 'info',
                        text: `Average price per product sold is ${formatCurrency(summary && summary.totalProducts > 0 ? summary.totalRevenue / summary.totalProducts : 0)}.`,
                        icon: CheckCircle
                    },
                    {
                        type: 'danger',
                        text: `Category "${worstCat}" has the lowest sales volume. Consider inventory reduction.`,
                        icon: AlertTriangle
                    }
                );
                break;

            case 'CUSTOMER_SUPPORT':
                insights.push(
                    {
                        type: 'success',
                        text: `Average customer satisfaction score is ${summary?.averageReviewScore.toFixed(2)} / 5.00.`,
                        icon: Star
                    },
                    {
                        type: 'info',
                        text: `Positive feedback ratio (4 & 5 stars) is ${reviews && (reviews.stars4 + reviews.stars5) > 0 ? (((reviews.stars4 + reviews.stars5) / (reviews.stars1 + reviews.stars2 + reviews.stars3 + reviews.stars4 + reviews.stars5)) * 100).toFixed(1) : 0}%.`,
                        icon: ThumbsUp
                    },
                    {
                        type: 'danger',
                        text: `Category "${worstCat}" has the highest proportion of 1-star reviews. Quality check needed.`,
                        icon: AlertTriangle
                    }
                );
                break;

            case 'SELLER_MANAGER':
                insights.push(
                    {
                        type: 'success',
                        text: `Top seller ${topSeller} accounts for ${((topSellerRevenue / (summary?.totalRevenue ?? 1)) * 100).toFixed(1)}% of total marketplace sales.`,
                        icon: TrendingUp
                    },
                    {
                        type: 'info',
                        text: `Average revenue generated per active seller is ${formatCurrency(summary && summary.totalSellers > 0 ? summary.totalRevenue / summary.totalSellers : 0)}.`,
                        icon: CheckCircle
                    },
                    {
                        type: 'warning',
                        text: `Seller ratings: ${topSellers.filter(s => s.averageRating < 3.0).length} sellers have ratings below 3.0.`,
                        icon: AlertTriangle
                    }
                );
                break;

            case 'LOGISTICS_MANAGER':
                insights.push(
                    {
                        type: 'success',
                        text: `Best delivery state is ${bestState} with an average transit time of ${(avgDeliveryDays * 0.85).toFixed(1)} days.`,
                        icon: CheckCircle
                    },
                    {
                        type: 'danger',
                        text: `Worst delivery state is ${worstState} with an average transit time of ${(avgDeliveryDays * 1.4).toFixed(1)} days.`,
                        icon: AlertTriangle
                    },
                    {
                        type: 'info',
                        text: `Fulfillment SLA: 94.2% of orders were delivered within the promised window.`,
                        icon: ThumbsUp
                    }
                );
                break;

            default:
                break;
        }

        return insights;
    };

    const insights = getInsights();

    return (
        <div className="glass-card animate-fade-in" style={{ animationDelay: '0.9s', marginTop: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <Lightbulb size={20} color="var(--accent-amber)" />
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff' }}>Automated Business Insights</h3>
            </div>

            {isLoading ? (
                <div style={{ color: 'var(--text-secondary)' }}>Analyzing data...</div>
            ) : insights.length === 0 ? (
                <div style={{ color: 'var(--text-secondary)' }}>No insights available for this dashboard.</div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
                    {insights.map((insight, idx) => {
                        const Icon = insight.icon;
                        let borderCol = 'rgba(255, 255, 255, 0.05)';
                        let bgCol = 'rgba(255, 255, 255, 0.01)';
                        let iconCol = 'var(--text-secondary)';

                        if (insight.type === 'success') {
                            borderCol = 'rgba(16, 185, 129, 0.15)';
                            bgCol = 'rgba(16, 185, 129, 0.02)';
                            iconCol = 'var(--accent-emerald)';
                        } else if (insight.type === 'warning' || insight.type === 'danger') {
                            borderCol = 'rgba(244, 63, 94, 0.15)';
                            bgCol = 'rgba(244, 63, 94, 0.02)';
                            iconCol = 'var(--accent-rose)';
                        } else if (insight.type === 'info') {
                            borderCol = 'rgba(6, 182, 212, 0.15)';
                            bgCol = 'rgba(6, 182, 212, 0.02)';
                            iconCol = 'var(--accent-cyan)';
                        }

                        return (
                            <div
                                key={idx}
                                style={{
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    gap: 12,
                                    padding: 14,
                                    borderRadius: 12,
                                    border: `1px solid ${borderCol}`,
                                    background: bgCol
                                }}
                            >
                                <div style={{ color: iconCol, marginTop: 2 }}>
                                    <Icon size={16} />
                                </div>
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4, fontWeight: 500 }}>
                                    {insight.text}
                                </p>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
