import React from 'react';
import { DollarSign, ShoppingBag, Users, Package, Store, CreditCard, Truck, Star } from 'lucide-react';
import { DashboardSummaryResponse } from '../../models/DashboardModels';

interface DashboardSummaryProps {
    summary: DashboardSummaryResponse | null;
    isLoading: boolean;
}

export default function DashboardSummary({ summary, isLoading }: DashboardSummaryProps) {
    const formatCurrency = (val?: number) => {
        if (val === undefined) return '$0.00';
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
    };

    const formatNumber = (val?: number) => {
        if (val === undefined) return '0';
        return new Intl.NumberFormat('en-US').format(val);
    };

    const kpis = [
        {
            title: 'Total Revenue',
            value: formatCurrency(summary?.totalRevenue),
            icon: DollarSign,
            color: 'var(--accent-emerald)',
            glow: 'var(--accent-emerald-glow)'
        },
        {
            title: 'Total Orders',
            value: formatNumber(summary?.totalOrders),
            icon: ShoppingBag,
            color: 'var(--accent-purple)',
            glow: 'var(--accent-purple-glow)'
        },
        {
            title: 'Total Customers',
            value: formatNumber(summary?.totalCustomers),
            icon: Users,
            color: 'var(--accent-cyan)',
            glow: 'var(--accent-cyan-glow)'
        },
        {
            title: 'Total Products',
            value: formatNumber(summary?.totalProducts),
            icon: Package,
            color: 'var(--accent-amber)',
            glow: 'var(--accent-amber-glow)'
        },
        {
            title: 'Active Sellers',
            value: formatNumber(summary?.totalSellers),
            icon: Store,
            color: 'var(--accent-rose)',
            glow: 'var(--accent-rose-glow)'
        },
        {
            title: 'Avg Order Value',
            value: formatCurrency(summary?.averageOrderValue),
            icon: CreditCard,
            color: 'var(--accent-cyan)',
            glow: 'var(--accent-cyan-glow)'
        },
        {
            title: 'Avg Delivery Time',
            value: summary ? `${summary.averageDeliveryDays.toFixed(1)} days` : '0 days',
            icon: Truck,
            color: 'var(--accent-purple)',
            glow: 'var(--accent-purple-glow)'
        },
        {
            title: 'Avg Review Rating',
            value: summary ? `${summary.averageReviewScore.toFixed(2)} ★` : '0.00 ★',
            icon: Star,
            color: 'var(--accent-amber)',
            glow: 'var(--accent-amber-glow)'
        }
    ];

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
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
                                {kpi.title}
                            </p>
                            {isLoading ? (
                                <div style={{ height: 28, width: 100, background: 'rgba(255, 255, 255, 0.05)', borderRadius: 4, animation: 'pulse 1.5s infinite ease-in-out' }} />
                            ) : (
                                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff', letterSpacing: '-0.02em' }}>
                                    {kpi.value}
                                </h3>
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
