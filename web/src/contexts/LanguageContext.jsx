import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    const [lang, setLang] = useState('zh'); // Default to Chinese as per prompt implication

    const toggleLang = () => {
        setLang(prev => prev === 'zh' ? 'en' : 'zh');
    };

    const t = (key, obj = null) => {
        // If obj is provided (like description object), return the value for current lang
        if (obj && typeof obj === 'object') {
            return obj[lang] || obj['en'] || '';
        }

        // Simple translation dictionary
        const translations = {
            zh: {
                'nav.home': '首页',
                'nav.admin': '管理',
                'search.placeholder': '搜索工具...',
                'category.all': '全部',
                'btn.visit': '访问',
                'btn.details': '详情',
                'admin.title': '工具管理',
                'admin.add': '添加工具',
                'admin.export': '导出数据',
                'admin.save_instruction': '点击导出下载 data.json，然后替换源代码中的文件以保存更改。',
                'footer.text': 'Toolhub 资源收纳',
                'comments.title': '评论',
                'comments.placeholder': '写下你的评论...',
                'comments.submit': '提交',
                'comments.no_comments': '暂无评论',
                'tool.added': '添加于',
            },
            en: {
                'nav.home': 'Home',
                'nav.admin': 'Admin',
                'search.placeholder': 'Search tools...',
                'category.all': 'All',
                'btn.visit': 'Visit',
                'btn.details': 'Details',
                'admin.title': 'Tool Management',
                'admin.add': 'Add Tool',
                'admin.export': 'Export Data',
                'admin.save_instruction': 'Click Export to download data.json, then replace the file in source code to save changes.',
                'footer.text': 'Toolhub Collection',
                'comments.title': 'Comments',
                'comments.placeholder': 'Write a comment...',
                'comments.submit': 'Submit',
                'comments.no_comments': 'No comments yet',
                'tool.added': 'Added',
            }
        };

        return translations[lang][key] || key;
    };

    return (
        <LanguageContext.Provider value={{ lang, setLang, toggleLang, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => useContext(LanguageContext);
