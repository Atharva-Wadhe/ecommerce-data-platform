import React, { useState } from 'react';
import { Database, Activity, Terminal, Play, CheckCircle, AlertCircle, Clock, ShieldAlert } from 'lucide-react';

export default function AdminDashboard() {
    const [logs, setLogs] = useState([
        { time: '2026-07-10 04:30:12', level: 'INFO', message: 'Starting Medallion pipeline execution...' },
        { time: '2026-07-10 04:30:15', level: 'INFO', message: 'Bronze Layer: Ingested 1,250 raw order CSV rows.' },
        { time: '2026-07-10 04:30:22', level: 'INFO', message: 'Silver Layer: Validated schemas and cleaned null values.' },
        { time: '2026-07-10 04:30:28', level: 'INFO', message: 'Silver Layer: Deduplicated 12 order records.' },
        { time: '2026-07-10 04:30:35', level: 'INFO', message: 'Gold Layer: Aggregated sales and review metrics.' },
        { time: '2026-07-10 04:30:42', level: 'INFO', message: 'DW Load: Loaded 1,238 records into shopsphere_dw.' },
        { time: '2026-07-10 04:30:45', level: 'SUCCESS', message: 'Pipeline run completed successfully in 33 seconds.' }
    ]);

    const pipelineStages = [
        { name: 'Bronze Ingestion', status: 'SUCCESS', lastRun: '10 mins ago', duration: '8s' },
        { name: 'Silver Validation', status: 'SUCCESS', lastRun: '10 mins ago', duration: '12s' },
        { name: 'Gold Aggregation', status: 'SUCCESS', lastRun: '10 mins ago', duration: '7s' },
        { name: 'DW Load', status: 'SUCCESS', lastRun: '10 mins ago', duration: '6s' }
    ];

    const systemMetrics = [
        { title: 'API Health', value: 'Healthy (99.9%)', icon: Activity, color: 'var(--accent-emerald)', glow: 'var(--accent-emerald-glow)' },
        { title: 'Database Connection', value: 'Connected', icon: Database, color: 'var(--accent-cyan)', glow: 'var(--accent-cyan-glow)' },
        { title: 'Active Users', value: '14 Online', icon: Play, color: 'var(--accent-purple)', glow: 'var(--accent-purple-glow)' },
        { title: 'Quarantine Records', value: '0 Clean', icon: ShieldAlert, color: 'var(--accent-emerald)', glow: 'var(--accent-emerald-glow)' }
    ];

    const triggerPipeline = () => {
        const newLog = {
            time: new Date().toISOString().replace('T', ' ').substring(0, 19),
            level: 'INFO',
            message: 'Manual pipeline trigger received. Re-running warehouse load...'
        };
        setLogs(prev => [...prev, newLog]);
    };

    return (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* System Metrics */}
            <div className="dashboard-grid">
                {systemMetrics.map((metric, idx) => {
                    const Icon = metric.icon;
                    return (
                        <div key={idx} className="glass-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', overflow: 'hidden' }}>
                            <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: 80, height: 80, borderRadius: '50%', background: metric.glow, filter: 'blur(20px)', pointerEvents: 'none' }} />
                            <div>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>{metric.title}</p>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff' }}>{metric.value}</h3>
                            </div>
                            <div style={{ background: metric.glow, border: '1px solid rgba(255, 255, 255, 0.05)', padding: 10, borderRadius: 10, color: metric.color }}>
                                <Icon size={18} />
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Pipeline Stages */}
            <div className="charts-grid-2">
                <div className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                        <div>
                            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff' }}>Medallion Pipeline Status</h3>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Status of ETL stages in the data platform</p>
                        </div>
                        <button
                            onClick={triggerPipeline}
                            style={{
                                background: 'linear-gradient(to right, var(--accent-purple), var(--accent-purple))',
                                color: '#fff',
                                border: 'none',
                                padding: '6px 12px',
                                borderRadius: 8,
                                fontSize: '0.8rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 6
                            }}
                        >
                            <Play size={12} fill="#fff" /> Run Pipeline
                        </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: 1, justifyContent: 'center' }}>
                        {pipelineStages.map((stage, idx) => (
                            <div
                                key={idx}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '12px 16px',
                                    borderRadius: 10,
                                    background: 'rgba(255, 255, 255, 0.01)',
                                    border: '1px solid rgba(255, 255, 255, 0.03)'
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <CheckCircle size={16} color="var(--accent-emerald)" />
                                    <div>
                                        <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff' }}>{stage.name}</p>
                                        <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Duration: {stage.duration}</p>
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--accent-emerald)', fontWeight: 600, background: 'var(--accent-emerald-glow)', padding: '2px 8px', borderRadius: 6 }}>
                                        {stage.status}
                                    </span>
                                    <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 4 }}>{stage.lastRun}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Pipeline Logs */}
                <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <div style={{ marginBottom: 16 }}>
                        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Terminal size={18} color="var(--accent-cyan)" /> Pipeline Execution Logs
                        </h3>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Real-time logs from the serving layer</p>
                    </div>

                    <div
                        style={{
                            flex: 1,
                            background: '#05070c',
                            border: '1px solid var(--card-border)',
                            borderRadius: 10,
                            padding: 12,
                            fontFamily: 'monospace',
                            fontSize: '0.75rem',
                            overflowY: 'auto',
                            maxHeight: 240,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 6
                        }}
                    >
                        {logs.map((log, idx) => (
                            <div key={idx} style={{ display: 'flex', gap: 8, lineHeight: 1.4 }}>
                                <span style={{ color: 'var(--text-muted)' }}>[{log.time}]</span>
                                <span style={{ color: log.level === 'SUCCESS' ? 'var(--accent-emerald)' : 'var(--accent-cyan)', fontWeight: 600 }}>
                                    {log.level}
                                </span>
                                <span style={{ color: 'var(--text-secondary)' }}>{log.message}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
