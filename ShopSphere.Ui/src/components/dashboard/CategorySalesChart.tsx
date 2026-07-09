import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { CategorySalesResponse } from '../../models/DashboardModels';

interface CategorySalesChartProps {
    data: CategorySalesResponse[];
    isLoading: boolean;
}

export default function CategorySalesChart({ data, isLoading }: CategorySalesChartProps) {
    // Sort by revenue descending and take top 10
    const sortedData = [...data]
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 8);

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
    };

    const formatCategoryName = (name: string) => {
        return name.replace(/_/g, ' ');
    };

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const item = payload[0].payload;
            return (
                <div className="glass-card" style={{ padding: '10px 14px', border: '1px solid rgba(255, 255, 255, 0.1)', background: 'rgba(10, 15, 25, 0.9)' }}>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: 4, fontWeight: 600, textTransform: 'capitalize' }}>
                        {formatCategoryName(item.category)}
                    </p>
                    <p style={{ fontSize: '0.9rem', color: 'var(--accent-cyan)', fontWeight: 700, display: 'flex', justifyContent: 'space-between', gap: 16 }}>
                        <span>Revenue:</span>
                        <span>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(item.revenue)}</span>
                    </p>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 600, display: 'flex', justifyContent: 'space-between', gap: 16, marginTop: 2 }}>
                        <span>Orders:</span>
                        <span>{item.orders}</span>
                    </p>
                </div>
            );
        }
        return null;
    };

    // Color palette for bars
    const colors = [
        '#8b5cf6', '#06b6d4', '#10b981', '#f43f5e', '#f59e0b',
        '#3b82f6', '#ec4899', '#14b8a6', '#f97316', '#a855f7'
    ];

    return (
        <div className="glass-card animate-fade-in" style={{ animationDelay: '0.3s', height: 400, display: 'flex', flexDirection: 'column' }}>
            <div style={{ marginBottom: 16 }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff' }}>Top Categories by Revenue</h3>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Highest performing product categories</p>
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
                        <BarChart
                            data={sortedData}
                            layout="vertical"
                            margin={{ top: 5, right: 10, left: 30, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.03)" horizontal={false} />
                            <XAxis
                                type="number"
                                tickFormatter={formatCurrency}
                                stroke="var(--text-muted)"
                                fontSize={11}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis
                                type="category"
                                dataKey="category"
                                tickFormatter={formatCategoryName}
                                stroke="var(--text-secondary)"
                                fontSize={11}
                                tickLine={false}
                                axisLine={false}
                                width={100}
                                style={{ textTransform: 'capitalize' }}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar dataKey="revenue" radius={[0, 4, 4, 0]} barSize={16}>
                                {sortedData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
}
