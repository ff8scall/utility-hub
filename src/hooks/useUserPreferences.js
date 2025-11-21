import { useState, useEffect } from 'react';

const useUserPreferences = () => {
    const [favorites, setFavorites] = useState(() => {
        const saved = localStorage.getItem('utility-hub-favorites');
        return saved ? JSON.parse(saved) : [];
    });

    const [recentTools, setRecentTools] = useState(() => {
        const saved = localStorage.getItem('utility-hub-recents');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('utility-hub-favorites', JSON.stringify(favorites));
    }, [favorites]);

    useEffect(() => {
        localStorage.setItem('utility-hub-recents', JSON.stringify(recentTools));
    }, [recentTools]);

    const toggleFavorite = (toolId) => {
        setFavorites(prev => {
            if (prev.includes(toolId)) {
                return prev.filter(id => id !== toolId);
            } else {
                return [...prev, toolId];
            }
        });
    };

    const addRecentTool = (toolId) => {
        setRecentTools(prev => {
            // Remove if already exists to move it to the front
            const filtered = prev.filter(id => id !== toolId);
            // Add to front, keep max 5
            return [toolId, ...filtered].slice(0, 5);
        });
    };

    return {
        favorites,
        toggleFavorite,
        recentTools,
        addRecentTool
    };
};

export default useUserPreferences;
