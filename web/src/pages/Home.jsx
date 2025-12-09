import React, { useState, useMemo } from 'react';
import Sidebar from '../components/Sidebar';
import ToolGrid from '../components/ToolGrid';
import { useData } from '../contexts/DataContext';

const Home = ({ searchQuery }) => {
    const { tools, categories } = useData();
    const [selectedCategory, setSelectedCategory] = useState(null);

    const filteredTools = useMemo(() => {
        return tools.filter(tool => {
            // Filter by Category
            if (selectedCategory && tool.category !== selectedCategory) {
                return false;
            }

            // Filter by Search
            if (searchQuery) {
                const q = searchQuery.toLowerCase();
                const titleMatch = (tool.name || '').toLowerCase().includes(q);
                // Handle localized description or simple string
                const descMatch = typeof tool.description === 'object'
                    ? Object.values(tool.description).some(val => val.toLowerCase().includes(q))
                    : tool.description.toLowerCase().includes(q);
                const tagMatch = tool.tags.some(tag => tag.toLowerCase().includes(q));

                return titleMatch || descMatch || tagMatch;
            }

            return true;
        });
    }, [tools, selectedCategory, searchQuery]);

    return (
        <div className="container" style={{ paddingTop: '2rem', display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'none', flexDirection: 'column', gap: '2rem', width: '250px' }} className="desktop-sidebar">
                {/* We will handle responsive layout in global css ideally, but for now inline simple check */}
                <Sidebar
                    categories={categories}
                    selectedCategory={selectedCategory}
                    onSelectCategory={setSelectedCategory}
                />
            </div>
            {/* Mobile Category Filter (Simple horizontal scroll) - Optional enhancement */}

            {/* Responsive Wrapper */}
            <style>{`
        @media (min-width: 768px) {
          .desktop-sidebar { display: flex !important; }
        }
      `}</style>

            <main style={{ flex: 1, minWidth: '0' }}>
                <div style={{ marginBottom: '1.5rem' }}>
                    <h1 className="text-gradient" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
                        {selectedCategory || 'Discover Tools'}
                    </h1>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        {filteredTools.length} tools available
                    </p>
                </div>

                <ToolGrid tools={filteredTools} />
            </main>
        </div>
    );
};

export default Home;
