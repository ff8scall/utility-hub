import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { tools, toolCategoryData, toolCategories } from '../data/tools';
import SEO from '../components/SEO';
import { Star } from 'lucide-react';
import useUserPreferences from '../hooks/useUserPreferences';

const CategoryPage = () => {
    const { categoryId } = useParams();
    const { favorites, toggleFavorite } = useUserPreferences();

    const categoryInfo = toolCategoryData[categoryId];
    const categoryName = toolCategories[categoryId];

    const categoryTools = useMemo(() => {
        return tools.filter(tool => tool.category === categoryId);
    }, [categoryId]);

    if (!categoryInfo) {
        return (
            <div className="text-center py-20">
                <h1 className="text-2xl font-bold">카테고리를 찾을 수 없습니다.</h1>
                <Link to="/" className="text-primary hover:underline mt-4 inline-block">홈으로 돌아가기</Link>
            </div>
        );
    }

    const Icon = categoryInfo.icon;

    return (
        <div className="space-y-10 pb-20">
            <SEO
                title={categoryInfo.title}
                description={categoryInfo.description}
                keywords={categoryInfo.keywords}
            />

            {/* Category Header */}
            <header className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-card to-background border border-border p-10 md:p-16 text-center space-y-6">
                <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${categoryInfo.color} opacity-10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl`}></div>

                <div className={`inline-flex items-center justify-center p-5 rounded-2xl bg-gradient-to-br ${categoryInfo.color} text-white shadow-lg mb-4 animate-in zoom-in duration-500`}>
                    <Icon size={48} />
                </div>

                <h1 className="text-4xl md:text-5xl font-black tracking-tight">
                    {categoryName}
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                    {categoryInfo.description}
                </p>

                <div className="flex justify-center gap-4 text-sm font-medium pt-4">
                    <span className="px-4 py-2 bg-primary/5 rounded-full border border-primary/10 text-primary">
                        총 {categoryTools.length}개의 도구
                    </span>
                    <span className="px-4 py-2 bg-secondary/50 rounded-full border border-border">
                        100% 무료 사용
                    </span>
                </div>
            </header>

            {/* Tools Grid */}
            <section className="space-y-6">
                <h2 className="text-2xl font-bold px-2">모든 {categoryName} 도구</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                    {categoryTools.map((tool) => {
                        const ToolIcon = tool.icon;
                        const isFavorite = favorites.includes(tool.id);
                        return (
                            <Link
                                key={tool.id}
                                to={tool.path}
                                className="group relative bg-card border border-border rounded-2xl p-6 hover:shadow-xl hover:border-primary/50 transition-all duration-300 hover:-translate-y-2 flex flex-col items-center text-center"
                            >
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        toggleFavorite(tool.id);
                                    }}
                                    className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-accent transition-colors z-10"
                                >
                                    <Star
                                        className={`w-5 h-5 ${isFavorite ? 'fill-yellow-500 text-yellow-500' : 'text-muted-foreground'}`}
                                    />
                                </button>

                                <div className={`w-16 h-16 rounded-2xl ${tool.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-sm`}>
                                    <ToolIcon className="w-8 h-8 text-white" />
                                </div>

                                <h3 className="font-bold text-base mb-2 group-hover:text-primary transition-colors line-clamp-1">
                                    {tool.title.split('|')[0].trim()}
                                </h3>
                                <p className="text-xs text-muted-foreground line-clamp-2">
                                    {tool.description}
                                </p>
                            </Link>
                        );
                    })}
                </div>
            </section>

            {/* Keyword block for SEO at bottom */}
            <section className="bg-muted/30 rounded-3xl p-10 border border-border/50 text-center space-y-6 max-w-4xl mx-auto mt-20">
                <h3 className="text-xl font-bold">왜 Tool Hive에서 {categoryName}를 사용해야 하나요?</h3>
                <p className="text-muted-foreground leading-relaxed">
                    Tool Hive의 {categoryName} 도구들은 복잡한 설치나 번거로운 광고 없이 웹 브라우저에서 즉시 실행 가능합니다.
                    사용자의 소중한 데이터는 서버에 저장되지 않고 브라우저 내에서만 처리되어 보안 걱정 없이 안심하고 사용할 수 있습니다.
                    매주 업데이트되는 최신 알고리즘과 직관적인 디자인으로 최상의 사용자 경험을 약속드립니다.
                </p>
            </section>
        </div>
    );
};

export default CategoryPage;
