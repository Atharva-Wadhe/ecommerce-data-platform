import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { OrderStatusResponse } from '../../models/DashboardModels';

interface OrderStatusChartProps {
    data: OrderStatusResponse[];
    isLoading: boolean;
}

export default function OrderStatusChart({ data, isLoading }: OrderStatusChartProps) {
    const formatStatusName = (status: string) => {
        return status.charAt(0).toUpperCase() + status.slice(1);
    };

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const item = payload[0].payload;
            return (
                <div className="glass-card" style={{ padding: '10px 14px', border: '1px solid rgba(255, 255, 255, 0.1)', background: 'rgba(10, 15, 25, 0.9)' }}>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: 4, fontWeight: 600 }}>
                        {formatStatusName(item.status)}
                    </p>
                    <p style={{ fontSize: '0.9rem', color: payload[0].color, fontWeight: 700, display: 'flex', justifyContent: 'space-between', gap: 16 }}>
                        <span>Orders:</span>
                        <span>{new Intl.NumberFormat('en-US').format(item.orders)}</span>
                    </p>
                </div>
            );
        }
        return null;
    };

    // Color mapping for statuses
    const statusColors: { [key: string]: string } = {
        delivered: '#10b981',   // Emerald
        shipped: '#3b82f6',     // Blue
        approved: '#06b6d4',    // Cyan
        canceled: '#f43f5e',    // Rose
        processing: '#8b5cf6',  // Purple
        unavailable: '#6b7280', // Gray
        created: '#f59e0b',     // Amber
        invoiced: '#ec4899'     // Pink
    };

    const defaultColor = '#a855f7';

    return (
        <div className="glass-card animate-fade-in" style={{ animationDelay: '0.4s', height: 400, display: 'flex', flexDirection: 'column' }}>
            <div style={{ marginBottom: 16 }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff' }}>Order Status Distribution</h3>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Breakdown of order statuses</p>
            </div>

            <div style={{ flex: 1, width: '100%', minHeight: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {isLoading ? (
                    <div style={{ color: 'var(--text-secondary)' }}>Loading chart...</div>
                ) : data.length === 0 ? (
                    <div style={{ color: 'var(--text-secondary)' }}>No data available for this range</div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="45%"
                                innerRadius={60}
                                outerRadius={90}
                                paddingAngle={4}
                                dataKey="orders"
                                nameKey="status"
                            >
                                {data.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={statusColors[entry.status.toLowerCase()] || defaultColor}
                                        stroke="rgba(17, 24, 39, 0.8)"
                                        strokeWidth={2}
                                    />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                            <Legend
                                formatter={(value) => <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'capitalize' }}>{value}</span>}
                                layout="horizontal"
                                verticalAlign="bottom"
                                align="center"
                                iconSize={10}
                                iconType="circle"
                            />
                        </PieChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
}
