import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const Sidebar = ({ categories, selectedCategory, onSelectCategory }) => {
    const { t } = useLanguage();

    return (
        <aside style={{ width: '250px', flexShrink: 0 }}>
            {/* Categories */}
            <div className="glass-panel" style={{ padding: '1rem' }}>
                <h3 style={{
                    marginBottom: '1rem',
                    fontSize: '0.9rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    color: 'var(--text-secondary)'
                }}>
                    Categories
                </h3>
                <ul style={{ listStyle: 'none' }}>
                    <li style={{ marginBottom: '0.5rem' }}>
                        <button
                            onClick={() => onSelectCategory(null)}
                            style={{
                                width: '100%',
                                textAlign: 'left',
                                padding: '0.75rem 1rem',
                                borderRadius: 'var(--radius-md)',
                                backgroundColor: selectedCategory === null ? 'rgba(14, 165, 233, 0.15)' : 'transparent',
                                color: selectedCategory === null ? 'var(--accent-primary)' : 'var(--text-primary)',
                                border: 'none',
                                cursor: 'pointer',
                                transition: 'all var(--transition-fast)',
                                fontWeight: selectedCategory === null ? '600' : '400'
                            }}
                        >
                            {t('category.all')}
                        </button>
                    </li>
                    {categories.map(cat => (
                        <li key={cat} style={{ marginBottom: '0.5rem' }}>
                            <button
                                onClick={() => onSelectCategory(cat)}
                                style={{
                                    width: '100%',
                                    textAlign: 'left',
                                    padding: '0.75rem 1rem',
                                    borderRadius: 'var(--radius-md)',
                                    backgroundColor: selectedCategory === cat ? 'rgba(14, 165, 233, 0.15)' : 'transparent',
                                    color: selectedCategory === cat ? 'var(--accent-primary)' : 'var(--text-primary)',
                                    border: 'none',
                                    cursor: 'pointer',
                                    transition: 'all var(--transition-fast)',
                                    fontWeight: selectedCategory === cat ? '600' : '400'
                                }}
                            >
                                {cat}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </aside>
    );
};

export default Sidebar;
