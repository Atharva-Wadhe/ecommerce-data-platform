import React from 'react';
import { Star } from 'lucide-react';
import { ReviewMetricsResponse } from '../../models/DashboardModels';

interface ReviewMetricsProps {
    data: ReviewMetricsResponse | null;
    isLoading: boolean;
}

export default function ReviewMetrics({ data, isLoading }: ReviewMetricsProps) {
    const totalReviews = data
        ? data.stars1 + data.stars2 + data.stars3 + data.stars4 + data.stars5
        : 0;

    const getPercentage = (count: number) => {
        if (totalReviews === 0) return 0;
        return (count / totalReviews) * 100;
    };

    const starDistribution = [
        { stars: 5, count: data?.stars5 ?? 0, pct: getPercentage(data?.stars5 ?? 0) },
        { stars: 4, count: data?.stars4 ?? 0, pct: getPercentage(data?.stars4 ?? 0) },
        { stars: 3, count: data?.stars3 ?? 0, pct: getPercentage(data?.stars3 ?? 0) },
        { stars: 2, count: data?.stars2 ?? 0, pct: getPercentage(data?.stars2 ?? 0) },
        { stars: 1, count: data?.stars1 ?? 0, pct: getPercentage(data?.stars1 ?? 0) }
    ];

    return (
        <div className="glass-card animate-fade-in" style={{ animationDelay: '0.8s', height: 400, display: 'flex', flexDirection: 'column' }}>
            <div style={{ marginBottom: 16 }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff' }}>Customer Satisfaction</h3>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Review rating distribution and score</p>
            </div>

            <div style={{ flex: 1, display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap' }}>
                {isLoading ? (
                    <div style={{ width: '100%', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading reviews...</div>
                ) : !data ? (
                    <div style={{ width: '100%', textAlign: 'center', color: 'var(--text-secondary)' }}>No data available for this range</div>
                ) : (
                    <>
                        {/* Left: Big Rating */}
                        <div style={{ flex: '1 1 120px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 16, background: 'rgba(255, 255, 255, 0.02)', borderRadius: 12, border: '1px solid rgba(255, 255, 255, 0.04)' }}>
                            <h4 style={{ fontSize: '3rem', fontWeight: 800, color: '#fff', lineHeight: 1 }}>
                                {data.averageRating.toFixed(2)}
                            </h4>
                            <div style={{ display: 'flex', gap: 4, margin: '12px 0 8px 0', color: 'var(--accent-amber)' }}>
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                        key={star}
                                        size={16}
                                        fill={star <= Math.round(data.averageRating) ? 'var(--accent-amber)' : 'none'}
                                        color="var(--accent-amber)"
                                    />
                                ))}
                            </div>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                                {new Intl.NumberFormat('en-US').format(totalReviews)} reviews
                            </p>
                        </div>

                        {/* Right: Progress Bars */}
                        <div style={{ flex: '2 1 200px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {starDistribution.map((row) => (
                                <div key={row.stars} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600, width: 12 }}>
                                        {row.stars}
                                    </span>
                                    <Star size={12} fill="var(--accent-amber)" color="var(--accent-amber)" />
                                    <div style={{ flex: 1, height: 8, background: 'rgba(255, 255, 255, 0.05)', borderRadius: 4, overflow: 'hidden' }}>
                                        <div style={{
                                            height: '100%',
                                            width: `${row.pct}%`,
                                            background: 'linear-gradient(to right, var(--accent-amber), #fbbf24)',
                                            borderRadius: 4,
                                            transition: 'width 1s ease-out'
                                        }} />
                                    </div>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500, width: 32, textAlign: 'right' }}>
                                        {row.pct.toFixed(0)}%
                                    </span>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
