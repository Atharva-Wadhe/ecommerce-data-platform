import React from 'react';
import { Calendar, RefreshCw, ShoppingBag } from 'lucide-react';

interface DashboardHeaderProps {
    fromDate: string;
    toDate: string;
    onFromDateChange: (date: string) => void;
    onToDateChange: (date: string) => void;
    onApply: () => void;
    onRefresh: () => void;
    isLoading: boolean;
}

export default function DashboardHeader({
    fromDate,
    toDate,
    onFromDateChange,
    onToDateChange,
    onApply,
    onRefresh,
    isLoading
}: DashboardHeaderProps) {
    return (
        <header className="glass-card animate-fade-in" style={{ marginBottom: 24, padding: '16px 24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
                {/* Branding */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                        background: 'linear-gradient(135deg, var(--accent-purple), var(--accent-cyan))',
                        padding: 10,
                        borderRadius: 12,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 0 15px rgba(139, 92, 246, 0.4)'
                    }}>
                        <ShoppingBag size={24} color="#fff" />
                    </div>
                    <div>
                        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.025em', background: 'linear-gradient(to right, #fff, #9ca3af)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                            ShopSphere
                        </h1>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                            Analytics Dashboard
                        </p>
                    </div>
                </div>

                {/* Controls */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                    {/* Date Picker */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--card-border)', padding: '6px 12px', borderRadius: 10 }}>
                        <Calendar size={16} color="var(--text-secondary)" />
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>From:</span>
                        <input
                            type="date"
                            value={fromDate}
                            onChange={(e) => onFromDateChange(e.target.value)}
                            style={{
                                background: 'transparent',
                                border: 'none',
                                color: 'var(--text-primary)',
                                fontFamily: 'inherit',
                                fontSize: '0.85rem',
                                outline: 'none',
                                cursor: 'pointer'
                            }}
                        />
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500, marginLeft: 8 }}>To:</span>
                        <input
                            type="date"
                            value={toDate}
                            onChange={(e) => onToDateChange(e.target.value)}
                            style={{
                                background: 'transparent',
                                border: 'none',
                                color: 'var(--text-primary)',
                                fontFamily: 'inherit',
                                fontSize: '0.85rem',
                                outline: 'none',
                                cursor: 'pointer'
                            }}
                        />
                    </div>

                    {/* Buttons */}
                    <div style={{ display: 'flex', gap: 8 }}>
                        <button
                            onClick={onApply}
                            style={{
                                background: 'linear-gradient(to right, var(--accent-purple), var(--accent-purple))',
                                color: '#fff',
                                border: 'none',
                                padding: '8px 16px',
                                borderRadius: 10,
                                fontSize: '0.85rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                transition: 'var(--transition-smooth)',
                                boxShadow: '0 4px 12px var(--accent-purple-glow)'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.filter = 'brightness(1.1)'}
                            onMouseLeave={(e) => e.currentTarget.style.filter = 'none'}
                        >
                            Apply
                        </button>
                        <button
                            onClick={onRefresh}
                            disabled={isLoading}
                            style={{
                                background: 'rgba(255, 255, 255, 0.05)',
                                border: '1px solid var(--card-border)',
                                color: 'var(--text-primary)',
                                padding: '8px',
                                borderRadius: 10,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'var(--transition-smooth)'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'}
                        >
                            <RefreshCw size={16} className={isLoading ? 'spin' : ''} style={{ animation: isLoading ? 'spin 1s linear infinite' : 'none' }} />
                        </button>
                    </div>
                </div>
            </div>
            <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
        </header>
    );
}
