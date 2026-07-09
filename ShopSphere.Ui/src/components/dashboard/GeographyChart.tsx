import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { GeographyResponse } from '../../models/DashboardModels';

interface GeographyChartProps {
    data: GeographyResponse[];
    isLoading: boolean;
}

export default function GeographyChart({ data, isLoading }: GeographyChartProps) {
    // Sort by revenue descending and take top 10
    const sortedData = [...data]
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 10);

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
    };

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const item = payload[0].payload;
            return (
                <div className="glass-card" style={{ padding: '10px 14px', border: '1px solid rgba(255, 255, 255, 0.1)', background: 'rgba(10, 15, 25, 0.9)' }}>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: 4, fontWeight: 600 }}>
                        State: {item.state}
                    </p>
                    <p style={{ fontSize: '0.9rem', color: 'var(--accent-emerald)', fontWeight: 700, display: 'flex', justifyContent: 'space-between', gap: 16 }}>
                        <span>Revenue:</span>
                        <span>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(item.revenue)}</span>
                    </p>
                    <p style={{ fontSize: '0.85rem', color: 'var(--accent-purple)', fontWeight: 600, display: 'flex', justifyContent: 'space-between', gap: 16, marginTop: 2 }}>
                        <span>Orders:</span>
                        <span>{item.orders}</span>
                    </p>
                    <p style={{ fontSize: '0.85rem', color: 'var(--accent-cyan)', fontWeight: 600, display: 'flex', justifyContent: 'space-between', gap: 16, marginTop: 2 }}>
                        <span>Customers:</span>
                        <span>{item.customers}</span>
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="glass-card animate-fade-in" style={{ animationDelay: '0.6s', height: 400, display: 'flex', flexDirection: 'column' }}>
            <div style={{ marginBottom: 16 }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff' }}>Geographic Sales Distribution</h3>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Top 10 states by revenue generation</p>
            </div>

            <div style={{ flex: 1, width: '100%', minHeight: 0 }}>
                {isLoading ? (
                    <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
                        Loading chart...
                    </div>
                ) : sortedData.length === 0 ? (
                    <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
                        No data available for this range
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={sortedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.03)" vertical={false} />
                            <XAxis
                                dataKey="state"
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
                            <Bar dataKey="revenue" fill="var(--accent-cyan)" radius={[4, 4, 0, 0]} barSize={24} />
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
}
