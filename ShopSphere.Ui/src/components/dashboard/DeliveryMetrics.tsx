import React from 'react';
import { Truck, Zap, AlertTriangle } from 'lucide-react';
import { DeliveryMetricsResponse } from '../../models/DashboardModels';

interface DeliveryMetricsProps {
    data: DeliveryMetricsResponse | null;
    isLoading: boolean;
}

export default function DeliveryMetrics({ data, isLoading }: DeliveryMetricsProps) {
    const metrics = [
        {
            title: 'Average Delivery',
            value: data ? `${data.averageDelivery.toFixed(1)} Days` : '0 Days',
            desc: 'Average transit time for orders',
            icon: Truck,
            color: 'var(--accent-purple)',
            glow: 'var(--accent-purple-glow)'
        },
        {
            title: 'Fastest Delivery',
            value: data ? `${data.minimumDelivery} Days` : '0 Days',
            desc: 'Minimum transit time recorded',
            icon: Zap,
            color: 'var(--accent-emerald)',
            glow: 'var(--accent-emerald-glow)'
        },
        {
            title: 'Slowest Delivery',
            value: data ? `${data.maximumDelivery} Days` : '0 Days',
            desc: 'Maximum transit time recorded',
            icon: AlertTriangle,
            color: 'var(--accent-rose)',
            glow: 'var(--accent-rose-glow)'
        }
    ];

    return (
        <div className="glass-card animate-fade-in" style={{ animationDelay: '0.7s', height: 400, display: 'flex', flexDirection: 'column' }}>
            <div style={{ marginBottom: 24 }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff' }}>Delivery Performance</h3>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Logistics and fulfillment efficiency</p>
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16, justifyContent: 'center' }}>
                {isLoading ? (
                    <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>Loading metrics...</div>
                ) : !data ? (
                    <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>No data available for this range</div>
                ) : (
                    metrics.map((metric, idx) => {
                        const Icon = metric.icon;
                        return (
                            <div
                                key={idx}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 16,
                                    padding: 16,
                                    borderRadius: 12,
                                    background: 'rgba(255, 255, 255, 0.02)',
                                    border: '1px solid rgba(255, 255, 255, 0.04)',
                                    transition: 'var(--transition-smooth)'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)'}
                                onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.04)'}
                            >
                                <div style={{
                                    background: metric.glow,
                                    padding: 10,
                                    borderRadius: 10,
                                    color: metric.color,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <Icon size={18} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                                        {metric.title}
                                    </p>
                                    <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                                        {metric.desc}
                                    </p>
                                </div>
                                <div>
                                    <h4 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff' }}>
                                        {metric.value}
                                    </h4>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
