import React, { useState, useMemo } from 'react';
import SEO from '../components/SEO';
import { Search, Cloud, Sparkles, BookOpen, ThumbsUp, ThumbsDown, Minus } from 'lucide-react';
import { dreamData, dreamCategories } from '../data/DreamData';
import ShareButtons from '../components/ShareButtons';

const DreamInterpretation = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');

    const filteredDreams = useMemo(() => {
        return dreamData.filter(dream => {
            const matchesSearch = dream.keyword.includes(searchTerm) || dream.description.includes(searchTerm);
            const matchesCategory = selectedCategory === 'all' || dream.category === selectedCategory;
            return matchesSearch && matchesCategory;
        });
    }, [searchTerm, selectedCategory]);

    const getGoodOrBadIcon = (type) => {
        switch (type) {
            case 'good': return <ThumbsUp className="w-5 h-5 text-blue-500" />;
            case 'bad': return <ThumbsDown className="w-5 h-5 text-red-500" />;
            default: return <Minus className="w-5 h-5 text-gray-500" />;
        }
    };

    const getGoodOrBadLabel = (type) => {
        switch (type) {
            case 'good': return <span className="text-xs font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded-full">길몽</span>;
            case 'bad': return <span className="text-xs font-bold text-red-600 bg-red-100 px-2 py-1 rounded-full">흉몽</span>;
            default: return <span className="text-xs font-bold text-gray-600 bg-gray-100 px-2 py-1 rounded-full">보통</span>;
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <SEO
                title="무료 꿈해몽 - 꿈풀이 검색 | Utility Hub"
                description="간밤에 꾼 꿈의 의미가 궁금하신가요? 뱀, 이빨, 똥, 조상님 등 다양한 키워드로 꿈해몽을 무료로 검색해보세요."
                keywords="꿈해몽, 꿈풀이, 무료꿈해몽, 태몽, 길몽, 흉몽, 로또꿈, 뱀꿈, 이빨빠지는꿈, 똥꿈"
            />

            <div className="text-center space-y-4 py-6">
                <div className="inline-flex items-center justify-center p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-full mb-2">
                    <Cloud className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">꿈해몽</h1>
                <p className="text-muted-foreground">
                    간밤에 꾼 꿈, 어떤 의미가 있을까요? 키워드로 검색해보세요.
                </p>
            </div>

            {/* 검색 및 필터 */}
            <div className="space-y-4 sticky top-4 z-10 bg-background/95 backdrop-blur-sm p-4 rounded-xl border border-border shadow-sm">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                    <input
                        type="text"
                        placeholder="꿈 내용을 검색해보세요 (예: 뱀, 이빨, 날다)"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-muted/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    />
                </div>

                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {dreamCategories.map(category => (
                        <button
                            key={category.id}
                            onClick={() => setSelectedCategory(category.id)}
                            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${selectedCategory === category.id
                                    ? 'bg-indigo-600 text-white shadow-md'
                                    : 'bg-card border border-border hover:bg-muted text-muted-foreground'
                                }`}
                        >
                            <span>{category.icon}</span>
                            {category.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* 결과 목록 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {filteredDreams.length > 0 ? (
                    filteredDreams.map((dream) => (
                        <div key={dream.id} className="bg-card border border-border rounded-xl p-6 hover:shadow-md transition-all group">
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center gap-2">
                                    <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                                        {dream.keyword}
                                    </span>
                                    {getGoodOrBadLabel(dream.goodOrBad)}
                                </div>
                                <div className="p-2 bg-muted rounded-full group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/20 transition-colors">
                                    {getGoodOrBadIcon(dream.goodOrBad)}
                                </div>
                            </div>
                            <p className="text-muted-foreground leading-relaxed">
                                {dream.description}
                            </p>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full text-center py-12 text-muted-foreground">
                        <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-20" />
                        <p>검색 결과가 없습니다.</p>
                        <p className="text-sm">다른 키워드로 검색해보세요.</p>
                    </div>
                )}
            </div>

            <div className="mt-8">
                <ShareButtons
                    title="무료 꿈해몽 검색"
                    description="다양한 꿈의 의미를 무료로 확인해보세요!"
                />
            </div>
        </div>
    );
};

export default DreamInterpretation;
