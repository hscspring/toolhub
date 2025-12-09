import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Info } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const ToolCard = ({ tool }) => {
    const { t } = useLanguage();

    return (
        <div className="glass-panel" style={{
            display: 'flex',
            flexDirection: 'column',
            padding: '1.5rem',
            height: '100%',
            transition: 'transform 0.2s, box-shadow 0.2s'
        }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    {tool.icon && (
                        <img
                            src={tool.icon}
                            alt={tool.name}
                            style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }}
                            onError={(e) => { e.target.style.display = 'none' }}
                        />
                    )}
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: 'var(--text-primary)' }}>{tool.name}</h3>
                </div>
                <span style={{
                    fontSize: '0.75rem',
                    background: 'rgba(14, 165, 233, 0.1)',
                    color: 'var(--accent-primary)',
                    padding: '0.25rem 0.5rem',
                    borderRadius: 'var(--radius-full)'
                }}>
                    {tool.category}
                </span>
            </div>

            <p style={{
                color: 'var(--text-secondary)',
                fontSize: '0.9rem',
                marginBottom: 'auto',
                lineHeight: '1.5'
            }}>
                {t(tool.description, tool.description)}
            </p>

            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem' }}>
                <a
                    href={tool.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary"
                    style={{ flex: 1, padding: '0.5rem' }}
                >
                    <ExternalLink size={16} />
                    {t('btn.visit')}
                </a>
                <Link
                    to={`/tool/${tool.id}`}
                    className="btn btn-secondary"
                    style={{ flex: 1, padding: '0.5rem' }}
                >
                    <Info size={16} />
                    {t('btn.details')}
                </Link>
            </div>
        </div>
    );
};

export default ToolCard;
