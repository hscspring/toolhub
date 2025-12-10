import React from 'react';
import ToolCard from './ToolCard';

const ToolGrid = ({ tools }) => {
    if (tools.length === 0) {
        return (
            <div style={{
                textAlign: 'center',
                padding: '4rem',
                color: 'var(--text-secondary)'
            }}>
                <p>No tools found matching your criteria.</p>
            </div>
        );
    }

    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: '1.25rem',
            paddingBottom: '2rem'
        }}>
            {tools.map(tool => (
                <ToolCard key={tool.id} tool={tool} />
            ))}
        </div>
    );
};

export default ToolGrid;
