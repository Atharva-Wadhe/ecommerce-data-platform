import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { RevenueTrendResponse } from '../../models/DashboardModels';

interface RevenueTrendChartProps {
    data: RevenueTrendResponse[];
    isLoading: boolean;
}

export default function RevenueTrendChart({ data, isLoading }: RevenueTrendChartProps) {
    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
    };

    const formatDate = (dateStr: string) => {
        try {
            const d = new Date(dateStr);
            return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });
        } catch {
            return dateStr;
        }
    };

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const item = payload[0].payload;
            return (
                <div className="glass-card" style={{ padding: '10px 14px', border: '1px solid rgba(255, 255, 255, 0.1)', background: 'rgba(10, 15, 25, 0.9)' }}>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: 4, fontWeight: 600 }}>
                        {formatDate(item.date)}
                    </p>
                    <p style={{ fontSize: '0.9rem', color: 'var(--accent-emerald)', fontWeight: 700, display: 'flex', justifyContent: 'space-between', gap: 16 }}>
                        <span>Revenue:</span>
                        <span>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(item.revenue)}</span>
                    </p>
                    <p style={{ fontSize: '0.85rem', color: 'var(--accent-purple)', fontWeight: 600, display: 'flex', justifyContent: 'space-between', gap: 16, marginTop: 2 }}>
                        <span>Orders:</span>
                        <span>{item.orders}</span>
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="glass-card animate-fade-in" style={{ animationDelay: '0.2s', height: 400, display: 'flex', flexDirection: 'column' }}>
            <div style={{ marginBottom: 16 }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff' }}>Revenue & Order Trend</h3>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Daily sales volume and revenue generation</p>
            </div>

            <div style={{ flex: 1, width: '100%', minHeight: 0 }}>
                {isLoading ? (
                    <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
                        Loading chart...
                    </div>
                ) : data.length === 0 ? (
                    <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
                        No data available for this range
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="revenueGlow" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="var(--accent-purple)" stopOpacity={0.4} />
                                    <stop offset="95%" stopColor="var(--accent-purple)" stopOpacity={0.0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.03)" vertical={false} />
                            <XAxis
                                dataKey="date"
                                tickFormatter={formatDate}
                                stroke="var(--text-muted)"
                                fontSize={11}
                                tickLine={false}
                                axisLine={false}
                                dy={10}
                            />
                            <YAxis
                                tickFormatter={formatCurrency}
                                stroke="var(--text-muted)"
                                fontSize={11}
                                tickLine={false}
                                axisLine={false}
                                dx={-5}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Area
                                type="monotone"
                                dataKey="revenue"
                                stroke="var(--accent-purple)"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#revenueGlow)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
}
