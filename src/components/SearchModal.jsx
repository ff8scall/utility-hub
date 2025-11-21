import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ChevronRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { tools } from '../data/tools';

const SearchModal = ({ isOpen, onClose }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 50);
            setQuery('');
            setResults([]);
        }
    }, [isOpen]);

    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            return;
        }

        const filtered = tools.filter(tool =>
            tool.title.toLowerCase().includes(query.toLowerCase()) ||
            (tool.description && tool.description.toLowerCase().includes(query.toLowerCase())) ||
            (tool.keywords && tool.keywords.some(k => k.toLowerCase().includes(query.toLowerCase())))
        ).slice(0, 5); // Limit to 5 results

        setResults(filtered);
        setSelectedIndex(0);
    }, [query]);

    const handleKeyDown = (e) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(prev => (prev + 1) % results.length);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(prev => (prev - 1 + results.length) % results.length);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (results[selectedIndex]) {
                handleSelect(results[selectedIndex]);
            }
        } else if (e.key === 'Escape') {
            onClose();
        }
    };

    const handleSelect = (tool) => {
        navigate(tool.path);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                    <Search className="w-5 h-5 text-gray-400 mr-3" />
                    <input
                        ref={inputRef}
                        type="text"
                        className="flex-1 bg-transparent border-none outline-none text-lg placeholder-gray-400 text-gray-900 dark:text-gray-100"
                        placeholder="도구 검색... (예: 로또, 환율)"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    <button onClick={onClose} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md text-gray-500">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {results.length > 0 && (
                    <div className="py-2 max-h-[60vh] overflow-y-auto">
                        <div className="px-3 pb-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            검색 결과
                        </div>
                        {results.map((tool, index) => (
                            <div
                                key={tool.id}
                                onClick={() => handleSelect(tool)}
                                className={`mx-2 px-3 py-2.5 rounded-lg flex items-center justify-between cursor-pointer transition-colors ${index === selectedIndex
                                        ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
                                        : 'hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-md ${tool.color} bg-opacity-10 text-opacity-100`}>
                                        <tool.icon className={`w-5 h-5 ${tool.color.replace('bg-', 'text-')}`} />
                                    </div>
                                    <span className="font-medium">{tool.title}</span>
                                </div>
                                <ChevronRight className="w-4 h-4 opacity-50" />
                            </div>
                        ))}
                    </div>
                )}

                {query && results.length === 0 && (
                    <div className="py-8 text-center text-gray-500 dark:text-gray-400">
                        검색 결과가 없습니다.
                    </div>
                )}

                {!query && (
                    <div className="py-8 text-center text-gray-400 dark:text-gray-500 text-sm">
                        찾고 싶은 도구의 이름을 입력하세요.
                    </div>
                )}

                <div className="px-4 py-2 bg-gray-50 dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-500 flex justify-between">
                    <span>선택: ↵</span>
                    <span>이동: ↑↓</span>
                    <span>닫기: ESC</span>
                </div>
            </div>
        </div>
    );
};

export default SearchModal;
