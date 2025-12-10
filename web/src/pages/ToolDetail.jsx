import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ExternalLink, MessageSquare } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { useLanguage } from '../contexts/LanguageContext';

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
        // Don't initialize until tool data is loaded
        if (!tool) {
            return;
        }

        let walineScript = null;
        let cleanedUp = false;

        const loadAndInitWaline = async () => {
            try {
                // Wait for container to be ready
                if (!containerRef.current) {
                    console.log('[Waline] Container not ready yet');
                    return;
                }

                // Check if Waline is already loaded
                if (!window.Waline) {
                    // Create and load the Waline script
                    walineScript = document.createElement('script');
                    walineScript.type = 'module';
                    walineScript.textContent = `
                        import { init } from 'https://unpkg.com/@waline/client@v3/dist/waline.js';
                        window.Waline = { init };
                    `;
                    document.head.appendChild(walineScript);

                    // Wait for Waline to be available
                    let attempts = 0;
                    while (!window.Waline && attempts < 50) {
                        await new Promise(resolve => setTimeout(resolve, 100));
                        attempts++;
                    }

                    if (!window.Waline) {
                        console.error('[Waline] Failed to load Waline script');
                        return;
                    }
                }

                // Don't initialize if already initialized or if cleaned up
                if (walineInstanceRef.current || cleanedUp) {
                    return;
                }

                console.log('[Waline] Initializing with path:', `/tool/${id}`);

                // Initialize Waline
                walineInstanceRef.current = window.Waline.init({
                    el: containerRef.current,
                    serverURL: 'https://toolhub-comment-9w7v.vercel.app',
                    lang: lang === 'zh' ? 'zh-CN' : 'en',
                    path: `/tool/${id}`,
                    dark: 'body.dark-mode',
                    emoji: [
                        'https://unpkg.com/@waline/emojis@1.1.0/weibo',
                        'https://unpkg.com/@waline/emojis@1.1.0/bilibili',
                    ],
                });

                console.log('[Waline] Initialized successfully');
            } catch (error) {
                console.error('[Waline] Error:', error);
            }
        };

        loadAndInitWaline();

        return () => {
            cleanedUp = true;
            if (walineInstanceRef.current) {
                try {
                    walineInstanceRef.current.destroy();
                } catch (e) {
                    console.error('[Waline] Error destroying:', e);
                }
                walineInstanceRef.current = null;
            }
        };
    }, [id, lang, tool]); // Re-init if ID, Lang, or Tool changes

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
