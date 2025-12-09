import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ExternalLink, MessageSquare } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { useLanguage } from '../contexts/LanguageContext';
import { init } from '@waline/client';
import '@waline/client/style';

const ToolDetail = () => {
    const { id } = useParams();
    const { tools } = useData();
    const { t, lang } = useLanguage(); // Get current lang
    const navigate = useNavigate();
    const [tool, setTool] = useState(null);

    // Waline Ref
    const walineInstanceRef = useRef(null);
    const containerRef = useRef(null);

    useEffect(() => {
        const found = tools.find(t => t.id === id);
        if (found) {
            setTool(found);
        }
    }, [id, tools]);

    // Initialize Waline
    useEffect(() => {
        if (containerRef.current && !walineInstanceRef.current) {
            walineInstanceRef.current = init({
                el: containerRef.current,
                serverURL: 'https://toolhub-comment-jonowrcte-hugging-ai-team.vercel.app', // User needs to replace this
                lang: lang === 'zh' ? 'zh-CN' : 'en',
                path: `/tool/${id}`, // Unique path for each tool
                dark: 'body.dark-mode', // Auto dark mode
                emoji: [
                    'https://unpkg.com/@waline/emojis@1.1.0/weibo',
                    'https://unpkg.com/@waline/emojis@1.1.0/bilibili',
                ],
            });
        }

        return () => {
            if (walineInstanceRef.current) {
                walineInstanceRef.current.destroy();
                walineInstanceRef.current = null;
            }
        }
    }, [id, lang]); // Re-init if ID or Lang changes

    if (!tool) {
        return <div className="container" style={{ paddingTop: '4rem' }}>Loading...</div>;
    }

    return (
        <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem', maxWidth: '800px' }}>
            <button
                onClick={() => navigate(-1)}
                className="btn btn-secondary"
                style={{ marginBottom: '2rem', padding: '0.5rem 1rem' }}
            >
                <ArrowLeft size={16} /> Back
            </button>

            {/* Tool Header */}
            <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem' }}>
                    {tool.icon && (
                        <img
                            src={tool.icon}
                            alt={tool.name}
                            style={{ width: '80px', height: '80px', borderRadius: '16px', objectFit: 'cover', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}
                            onError={(e) => { e.target.style.display = 'none' }}
                        />
                    )}
                    <div>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', lineHeight: 1.1, marginBottom: '0.5rem' }} className="text-gradient">
                            {tool.name}
                        </h1>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                            <span style={{ background: 'var(--bg-tertiary)', padding: '0.25rem 0.75rem', borderRadius: '100px', fontSize: '0.85rem' }}>
                                {tool.category}
                            </span>
                            {tool.tags.map(tag => (
                                <span key={tag} style={{ background: 'rgba(255,255,255,0.05)', padding: '0.25rem 0.75rem', borderRadius: '100px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: '1.7', marginBottom: '2rem' }}>
                    {t(tool.description, tool.description)}
                </p>

                <a
                    href={tool.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary"
                    style={{ width: '100%', justifyContent: 'center' }}
                >
                    <ExternalLink size={20} />
                    {t('btn.visit')} Website
                </a>
            </div>

            {/* Waline Comments Section */}
            <div className="glass-panel" style={{ padding: '2rem' }}>
                <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                    <MessageSquare /> {t('comments.title')}
                </h2>
                <div ref={containerRef} />
            </div>
        </div>
    );
};

export default ToolDetail;
