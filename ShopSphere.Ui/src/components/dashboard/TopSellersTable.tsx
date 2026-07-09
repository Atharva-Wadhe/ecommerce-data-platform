import React from 'react';
import { Star, Trophy, Award, Medal } from 'lucide-react';
import { TopSellerResponse } from '../../models/DashboardModels';

interface TopSellersTableProps {
    data: TopSellerResponse[];
    limit: number;
    onLimitChange: (limit: number) => void;
    isLoading: boolean;
}

export default function TopSellersTable({ data, limit, onLimitChange, isLoading }: TopSellersTableProps) {
    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
    };

    const getRankIcon = (index: number) => {
        if (index === 0) return <Trophy size={18} color="var(--accent-amber)" style={{ filter: 'drop-shadow(0 0 4px rgba(245, 158, 11, 0.4))' }} />;
        if (index === 1) return <Award size={18} color="#cbd5e1" />;
        if (index === 2) return <Medal size={18} color="#b45309" />;
        return <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', width: 18, textAlign: 'center' }}>{index + 1}</span>;
    };

    return (
        <div className="glass-card animate-fade-in" style={{ animationDelay: '0.5s', height: 400, display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff' }}>Top Sellers Leaderboard</h3>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Highest performing sellers by revenue</p>
                </div>
                <select
                    value={limit}
                    onChange={(e) => onLimitChange(Number(e.target.value))}
                    style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid var(--card-border)',
                        color: 'var(--text-primary)',
                        padding: '4px 8px',
                        borderRadius: 8,
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        outline: 'none',
                        cursor: 'pointer'
                    }}
                >
                    <option value={5} style={{ background: 'var(--bg-secondary)' }}>Top 5</option>
                    <option value={10} style={{ background: 'var(--bg-secondary)' }}>Top 10</option>
                    <option value={20} style={{ background: 'var(--bg-secondary)' }}>Top 20</option>
                </select>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
                {isLoading ? (
                    <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
                        Loading leaderboard...
                    </div>
                ) : data.length === 0 ? (
                    <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
                        No data available for this range
                    </div>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--card-border)' }}>
                                <th style={{ padding: '8px 12px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', width: 60 }}>Rank</th>
                                <th style={{ padding: '8px 12px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Seller ID</th>
                                <th style={{ padding: '8px 12px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', textAlign: 'right' }}>Orders</th>
                                <th style={{ padding: '8px 12px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', textAlign: 'right' }}>Rating</th>
                                <th style={{ padding: '8px 12px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', textAlign: 'right' }}>Revenue</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((seller, idx) => (
                                <tr
                                    key={seller.seller}
                                    style={{
                                        borderBottom: '1px solid rgba(255, 255, 255, 0.02)',
                                        transition: 'var(--transition-smooth)'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)'}
                                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                >
                                    <td style={{ padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        {getRankIcon(idx)}
                                    </td>
                                    <td style={{ padding: '12px', fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-primary)', fontFamily: 'monospace' }}>
                                        {seller.seller.substring(0, 8)}...
                                    </td>
                                    <td style={{ padding: '12px', fontSize: '0.85rem', color: 'var(--text-secondary)', textAlign: 'right', fontWeight: 600 }}>
                                        {seller.orders}
                                    </td>
                                    <td style={{ padding: '12px', fontSize: '0.85rem', color: 'var(--accent-amber)', textAlign: 'right', fontWeight: 600 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 4 }}>
                                            <span>{seller.averageRating.toFixed(1)}</span>
                                            <Star size={12} fill="var(--accent-amber)" color="var(--accent-amber)" />
                                        </div>
                                    </td>
                                    <td style={{ padding: '12px', fontSize: '0.85rem', color: 'var(--accent-emerald)', textAlign: 'right', fontWeight: 700 }}>
                                        {formatCurrency(seller.revenue)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
