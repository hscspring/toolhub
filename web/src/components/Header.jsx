import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Globe, Menu, X, Settings } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Header = ({ onSearch }) => {
    const { lang, toggleLang, t } = useLanguage();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();

    const handleSearch = (e) => {
        onSearch && onSearch(e.target.value);
    };

    const isAdmin = location.pathname === '/admin';

    return (
        <nav className="glass-panel" style={{
            position: 'sticky',
            top: 0,
            zIndex: 50,
            borderRadius: 0,
            borderTop: 'none',
            borderLeft: 'none',
            borderRight: 'none'
        }}>
            <div className="container" style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                height: '4rem'
            }}>
                {/* Logo */}
                <Link to="/" className="text-gradient" style={{
                    fontSize: '1.5rem',
                    fontWeight: '800',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                }}>
                    Toolhub
                </Link>

                {/* Desktop Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }} className="desktop-actions">
                    <div className="search-bar" style={{
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center'
                    }}>
                        <Search size={18} style={{ position: 'absolute', left: '0.75rem', color: 'var(--text-secondary)' }} />
                        <input
                            type="text"
                            placeholder={t('search.placeholder')}
                            onChange={handleSearch}
                            style={{
                                background: 'var(--bg-secondary)',
                                border: '1px solid var(--glass-border)',
                                color: 'var(--text-primary)',
                                padding: '0.5rem 1rem 0.5rem 2.5rem',
                                borderRadius: 'var(--radius-md)',
                                width: '240px',
                                outline: 'none',
                                fontSize: '0.9rem'
                            }}
                        />
                    </div>

                    <button onClick={toggleLang} className="btn btn-secondary" style={{ padding: '0.5rem' }}>
                        <Globe size={18} />
                        <span style={{ textTransform: 'uppercase', fontSize: '0.8rem' }}>{lang}</span>
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Header;
