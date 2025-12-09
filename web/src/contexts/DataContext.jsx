import React, { createContext, useContext, useState, useEffect } from 'react';
import initialData from '../data/tools.json';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
    const [tools, setTools] = useState([]);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        // In a real app, this might fetch from an API
        // Here we load from JSON
        setTools(initialData);

        // Extract unique categories
        const uniqueCategories = [...new Set(initialData.map(tool => tool.category))];
        setCategories(uniqueCategories);
    }, []);

    return (
        <DataContext.Provider value={{ tools, categories }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => useContext(DataContext);
