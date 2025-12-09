import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import { DataProvider } from './contexts/DataContext';

import Header from './components/Header';
import Home from './pages/Home';
import ToolDetail from './pages/ToolDetail';

function App() {
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <LanguageProvider>
            <DataProvider>
                <div className="app">
                    <Header onSearch={setSearchQuery} />

                    <main>
                        <Routes>
                            <Route path="/" element={<Home searchQuery={searchQuery} />} />
                            <Route path="/tool/:id" element={<ToolDetail />} />
                        </Routes>
                    </main>

                    <footer style={{
                        textAlign: 'center',
                        padding: '2rem',
                        borderTop: '1px solid var(--glass-border)',
                        marginTop: 'auto',
                        color: 'var(--text-secondary)',
                        background: 'var(--bg-secondary)'
                    }}>
                        <p>&copy; {new Date().getFullYear()} Toolhub. Built with @Yam</p>
                    </footer>
                </div>
            </DataProvider>
        </LanguageProvider>
    );
}

export default App;
