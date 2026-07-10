import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Database, Table, Sparkles, AlertCircle } from 'lucide-react';
import api from '../../services/api';

interface Message {
    id: string;
    sender: 'user' | 'ai';
    text: string;
    sql?: string;
    data?: {
        columns: string[];
        rows: any[][];
    };
    error?: boolean;
}

export default function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 'welcome',
            sender: 'ai',
            text: 'Hello! I am your ShopSphere Analytics Copilot. Ask me any question about sales, categories, sellers, delivery, or reviews, and I will query the warehouse to find the answer!'
        }
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const [showSqlId, setShowSqlId] = useState<string | null>(null);
    const [showTableId, setShowTableId] = useState<string | null>(null);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isOpen]);

    const handleSend = async (textToSend?: string) => {
        const query = textToSend || input;
        if (!query.trim()) return;

        if (!textToSend) {
            setInput('');
        }

        const userMessageId = `user-${Date.now()}`;
        const aiMessageId = `ai-${Date.now()}`;

        setMessages(prev => [
            ...prev,
            { id: userMessageId, sender: 'user', text: query }
        ]);

        setIsLoading(true);

        try {
            const res = await api.post('/api/copilot/chat', { question: query });
            const data = res.data;

            setMessages(prev => [
                ...prev,
                {
                    id: aiMessageId,
                    sender: 'ai',
                    text: data.response?.answer || data.response?.summary || 'No response generated.',
                    sql: data.generatedSql,
                    data: data.data
                }
            ]);
        } catch (err: any) {
            console.error(err);
            const errMsg = err.response?.data?.message || 'Failed to connect to the Copilot service.';
            setMessages(prev => [
                ...prev,
                {
                    id: aiMessageId,
                    sender: 'ai',
                    text: errMsg,
                    error: true
                }
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const suggestions = [
        'What is the total revenue for the state of SP?',
        'Which product category generates the most revenue?',
        'What is the average delivery time and rating?'
    ];

    return (
        <>
            {/* Floating Button */}
            <button
                onClick={() => setIsOpen(prev => !prev)}
                style={{
                    position: 'fixed',
                    bottom: 24,
                    right: 24,
                    background: 'linear-gradient(135deg, var(--accent-purple), var(--accent-cyan))',
                    color: '#fff',
                    border: 'none',
                    width: 56,
                    height: 56,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 8px 24px rgba(139, 92, 246, 0.4)',
                    zIndex: 1000,
                    transition: 'var(--transition-smooth)'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
                {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div
                    className="glass-card animate-fade-in"
                    style={{
                        position: 'fixed',
                        bottom: 96,
                        right: 24,
                        width: 400,
                        height: 550,
                        zIndex: 1000,
                        display: 'flex',
                        flexDirection: 'column',
                        padding: 0,
                        overflow: 'hidden',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)'
                    }}
                >
                    {/* Header */}
                    <div
                        style={{
                            padding: '16px 20px',
                            background: 'linear-gradient(to right, rgba(139, 92, 246, 0.1), rgba(6, 182, 212, 0.1))',
                            borderBottom: '1px solid var(--card-border)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{
                                background: 'linear-gradient(135deg, var(--accent-purple), var(--accent-cyan))',
                                padding: 6,
                                borderRadius: 8,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <Sparkles size={16} color="#fff" />
                            </div>
                            <div>
                                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff' }}>ShopSphere Copilot</h4>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-emerald)', display: 'inline-block' }} />
                                    <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Online</span>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
                        >
                            <X size={16} />
                        </button>
                    </div>

                    {/* Messages List */}
                    <div
                        style={{
                            flex: 1,
                            padding: 20,
                            overflowY: 'auto',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 16
                        }}
                    >
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                                    gap: 6
                                }}
                            >
                                <div style={{ display: 'flex', gap: 8, maxWidth: '85%', flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row' }}>
                                    {/* Avatar */}
                                    <div style={{
                                        width: 28,
                                        height: 28,
                                        borderRadius: '50%',
                                        background: msg.sender === 'user' ? 'var(--accent-cyan-glow)' : 'var(--accent-purple-glow)',
                                        border: `1px solid ${msg.sender === 'user' ? 'var(--accent-cyan)' : 'var(--accent-purple)'}`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: msg.sender === 'user' ? 'var(--accent-cyan)' : 'var(--accent-purple)',
                                        flexShrink: 0
                                    }}>
                                        {msg.sender === 'user' ? <User size={14} /> : <Bot size={14} />}
                                    </div>

                                    {/* Bubble */}
                                    <div style={{
                                        padding: '10px 14px',
                                        borderRadius: 12,
                                        background: msg.sender === 'user' ? 'rgba(6, 182, 212, 0.1)' : 'rgba(255, 255, 255, 0.03)',
                                        border: `1px solid ${msg.sender === 'user' ? 'rgba(6, 182, 212, 0.2)' : 'var(--card-border)'}`,
                                        color: msg.error ? 'var(--accent-rose)' : 'var(--text-primary)',
                                        fontSize: '0.8rem',
                                        lineHeight: 1.4,
                                        wordBreak: 'break-word'
                                    }}>
                                        {msg.error && <AlertCircle size={14} style={{ marginRight: 6, verticalAlign: 'middle', display: 'inline' }} />}
                                        {msg.text}

                                        {/* SQL & Table Toggles */}
                                        {msg.sender === 'ai' && !msg.error && (msg.sql || msg.data) && (
                                            <div style={{ display: 'flex', gap: 8, marginTop: 8, borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: 8 }}>
                                                {msg.sql && (
                                                    <button
                                                        onClick={() => setShowSqlId(prev => prev === msg.id ? null : msg.id)}
                                                        style={{
                                                            background: 'transparent',
                                                            border: 'none',
                                                            color: 'var(--accent-purple)',
                                                            fontSize: '0.7rem',
                                                            fontWeight: 600,
                                                            cursor: 'pointer',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: 4
                                                        }}
                                                    >
                                                        <Database size={10} /> {showSqlId === msg.id ? 'Hide SQL' : 'View SQL'}
                                                    </button>
                                                )}
                                                {msg.data && msg.data.rows.length > 0 && (
                                                    <button
                                                        onClick={() => setShowTableId(prev => prev === msg.id ? null : msg.id)}
                                                        style={{
                                                            background: 'transparent',
                                                            border: 'none',
                                                            color: 'var(--accent-cyan)',
                                                            fontSize: '0.7rem',
                                                            fontWeight: 600,
                                                            cursor: 'pointer',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: 4
                                                        }}
                                                    >
                                                        <Table size={10} /> {showTableId === msg.id ? 'Hide Data' : 'View Data'}
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* SQL Code Block */}
                                {showSqlId === msg.id && msg.sql && (
                                    <pre style={{
                                        width: '85%',
                                        marginLeft: 36,
                                        background: '#05070c',
                                        border: '1px solid var(--card-border)',
                                        borderRadius: 8,
                                        padding: 10,
                                        fontFamily: 'monospace',
                                        fontSize: '0.7rem',
                                        color: 'var(--text-secondary)',
                                        overflowX: 'auto',
                                        whiteSpace: 'pre-wrap'
                                    }}>
                                        {msg.sql}
                                    </pre>
                                )}

                                {/* Data Table */}
                                {showTableId === msg.id && msg.data && (
                                    <div style={{
                                        width: '85%',
                                        marginLeft: 36,
                                        maxHeight: 150,
                                        overflow: 'auto',
                                        border: '1px solid var(--card-border)',
                                        borderRadius: 8,
                                        background: '#05070c'
                                    }}>
                                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.7rem', textAlign: 'left' }}>
                                            <thead>
                                                <tr style={{ borderBottom: '1px solid var(--card-border)', background: 'rgba(255,255,255,0.02)' }}>
                                                    {msg.data.columns.map((col, i) => (
                                                        <th key={i} style={{ padding: '6px 8px', fontWeight: 600, color: 'var(--text-muted)' }}>{col}</th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {msg.data.rows.map((row, ri) => (
                                                    <tr key={ri} style={{ borderBottom: '1px solid rgba(255,255,255,0.01)' }}>
                                                        {row.map((val, vi) => (
                                                            <td key={vi} style={{ padding: '6px 8px', color: 'var(--text-secondary)' }}>
                                                                {typeof val === 'number' ? val.toLocaleString() : String(val ?? '')}
                                                            </td>
                                                        ))}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Loading Indicator */}
                        {isLoading && (
                            <div style={{ display: 'flex', gap: 8, alignSelf: 'flex-start' }}>
                                <div style={{
                                    width: 28,
                                    height: 28,
                                    borderRadius: '50%',
                                    background: 'var(--accent-purple-glow)',
                                    border: '1px solid var(--accent-purple)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'var(--accent-purple)'
                                }}>
                                    <Bot size={14} />
                                </div>
                                <div style={{
                                    padding: '10px 14px',
                                    borderRadius: 12,
                                    background: 'rgba(255, 255, 255, 0.03)',
                                    border: '1px solid var(--card-border)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 4
                                }}>
                                    <span className="dot" style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--text-secondary)', animation: 'bounce 1.4s infinite ease-in-out both' }} />
                                    <span className="dot" style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--text-secondary)', animation: 'bounce 1.4s infinite ease-in-out both', animationDelay: '0.2s' }} />
                                    <span className="dot" style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--text-secondary)', animation: 'bounce 1.4s infinite ease-in-out both', animationDelay: '0.4s' }} />
                                </div>
                            </div>
                        )}

                        {/* Suggestions */}
                        {messages.length === 1 && !isLoading && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
                                <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Suggestions</p>
                                {suggestions.map((s, i) => (
                                    <button
                                        key={i}
                                        onClick={() => handleSend(s)}
                                        style={{
                                            background: 'rgba(255, 255, 255, 0.02)',
                                            border: '1px solid var(--card-border)',
                                            color: 'var(--text-secondary)',
                                            padding: '8px 12px',
                                            borderRadius: 8,
                                            fontSize: '0.75rem',
                                            textAlign: 'left',
                                            cursor: 'pointer',
                                            transition: 'var(--transition-smooth)'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                                            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
                                            e.currentTarget.style.borderColor = 'var(--card-border)';
                                        }}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Form */}
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleSend();
                        }}
                        style={{
                            padding: 16,
                            borderTop: '1px solid var(--card-border)',
                            display: 'flex',
                            gap: 8,
                            background: 'rgba(10, 15, 25, 0.3)'
                        }}
                    >
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask a question..."
                            disabled={isLoading}
                            style={{
                                flex: 1,
                                background: 'rgba(255, 255, 255, 0.03)',
                                border: '1px solid var(--card-border)',
                                borderRadius: 10,
                                padding: '8px 14px',
                                color: 'var(--text-primary)',
                                fontFamily: 'inherit',
                                fontSize: '0.8rem',
                                outline: 'none'
                            }}
                        />
                        <button
                            type="submit"
                            disabled={isLoading || !input.trim()}
                            style={{
                                background: 'linear-gradient(135deg, var(--accent-purple), var(--accent-cyan))',
                                color: '#fff',
                                border: 'none',
                                padding: 10,
                                borderRadius: 10,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'var(--transition-smooth)',
                                opacity: isLoading || !input.trim() ? 0.5 : 1
                            }}
                        >
                            <Send size={14} />
                        </button>
                    </form>
                    <style>{`
            @keyframes bounce {
              0%, 80%, 100% { transform: scale(0); }
              40% { transform: scale(1.0); }
            }
          `}</style>
                </div>
            )}
        </>
    );
}
