import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { tools, toolCategories, toolCategoryData } from '../data/tools';
import SEO from '../components/SEO';
import { Sparkles, TrendingUp, Zap, Star, Wand2, Moon, Clock, Search, X } from 'lucide-react';
import useUserPreferences from '../hooks/useUserPreferences';
import useToolAnalytics from '../hooks/useToolAnalytics';


const Home = () => {
    // Featured tools configuration
    const featuredTools = [
        {
            id: 'horoscope',
            title: '별자리 운세',
            description: '오늘의 운세와 성격, 궁합 분석',
            path: '/horoscope',
            color: 'from-indigo-500 to-purple-500',
            icon: Moon,
            badges: ['NEW', '인기']
        },
        {
            id: 'zodiac',
            title: '2025년 띠별 운세',
            description: '을사년 나의 신년운세 확인하기',
            path: '/zodiac-fortune',
            color: 'from-purple-500 to-indigo-500',
            icon: Star,
            badges: ['NEW']
        },
        {
            id: 'tarot',
            title: '타로 카드',
            description: '오늘의 운세와 연애운 점치기',
            path: '/tarot',
            color: 'from-pink-500 to-rose-500',
            icon: Wand2,
            badges: ['추천']
        },
        {
            id: 'saju',
            title: '사주팔자',

            description: '정통 명리학 기반 운세 분석',
            path: '/saju',
            color: 'from-blue-500 to-cyan-500',
            icon: Sparkles,
            badges: ['BEST']
        }
    ];

    // User preferences
    const { favorites, recentTools, toggleFavorite, addRecentTool } = useUserPreferences();

    // Analytics
    const { trackToolClick } = useToolAnalytics();

    // Search state
    const [searchQuery, setSearchQuery] = useState('');

    // Filter tools based on search query
    const filteredTools = useMemo(() => {
        if (!searchQuery.trim()) return tools;

        const query = searchQuery.toLowerCase();
        return tools.filter(tool =>
            tool.title.toLowerCase().includes(query) ||
            tool.description.toLowerCase().includes(query) ||
            tool.keywords?.some(keyword => keyword.toLowerCase().includes(query))
        );
    }, [searchQuery]);

    // Get favorite and recent tools
    const favoriteToolsList = tools.filter(tool => favorites.includes(tool.id));
    const recentToolsList = recentTools
        .map(id => tools.find(tool => tool.id === id))
        .filter(Boolean);

    // ToolCard component
    const ToolCard = ({ tool, isFavorite, onToggleFavorite }) => {
        const Icon = tool.icon;
        return (
            <Link
                to={tool.path}
                onClick={() => {
                    addRecentTool(tool.id);
                    trackToolClick(tool.id);
                }}
                className="group relative bg-card border border-border rounded-xl p-4 hover:shadow-lg hover:border-primary/50 transition-all duration-300 hover:-translate-y-1"
            >
                <div className="absolute top-2 right-2">
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            onToggleFavorite(tool.id);
                        }}
                        className="p-1 rounded-full hover:bg-accent transition-colors"
                        aria-label={isFavorite ? "즐겨찾기 해제" : "즐겨찾기 추가"}
                    >
                        <Star
                            className={`w-4 h-4 ${isFavorite ? 'fill-yellow-500 text-yellow-500' : 'text-muted-foreground'}`}
                        />
                    </button>
                </div>
                <div className={`w-12 h-12 rounded-lg ${tool.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-sm mb-1 group-hover:text-primary transition-colors">
                    {tool.title}
                </h3>
                <p className="text-xs text-muted-foreground line-clamp-2">
                    {tool.description}
                </p>
            </Link>
        );
    };

    return (
        <div className="space-y-8">
            <SEO
                title="Tool Hive | 무료 온라인 도구 모음 - 계산기, 변환기, 운세, 게임"
                description={`별도의 설치 없이 브라우저에서 즉시 사용하는 ${tools.length}가지 이상의 무료 온라인 유틸리티. 단위 변환기, 환율 계산기, 사주팔자, MBTI 성격 테스트, 로또 번호 생성, 스네이크 게임 등 모든 도구를 한곳에서 만나보세요.`}
                keywords="무료온라인도구, 유틸리티모음, 단위변환기, 환율계산기, 사주팔자무료, MBTI테스트, 로또번호생성기, 미니게임사이트, 텍스트도구, 개발자도구"
                schema={{
                    "@context": "https://schema.org",
                    "@type": "WebSite",
                    "url": "https://tool-hive.vercel.app/",
                    "name": "Tool Hive (툴 하이브)",
                    "description": "88개 이상의 무료 온라인 도구 모음 및 유틸리티 서비스",
                    "potentialAction": {
                        "@type": "SearchAction",
                        "target": "https://tool-hive.vercel.app/#/search?q={search_term_string}",
                        "query-input": "required name=search_term_string"
                    }
                }}
            />

            {/* Hero Section */}
            <section className="text-center space-y-4 py-12">
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                    온라인 도구 모음
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    일상생활과 업무에 필요한 {tools.length}가지 이상의 유용한 도구를 한곳에서 만나보세요
                </p>

                {/* Search Bar */}
                <div className="max-w-2xl mx-auto pt-4 pb-8">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="도구 이름 또는 키워드로 검색... (예: 계산기, 변환, JSON)"
                            className="w-full pl-12 pr-12 py-4 rounded-2xl border-2 border-border bg-card text-lg focus:border-primary focus:outline-none transition-colors"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded-full transition-colors"
                                aria-label="검색어 지우기"
                            >
                                <X className="w-5 h-5 text-muted-foreground" />
                            </button>
                        )}
                    </div>
                    {searchQuery && (
                        <p className="text-sm text-muted-foreground mt-2">
                            {filteredTools.length}개의 도구를 찾았습니다
                        </p>
                    )}
                </div>

                {/* Category Quick Access */}
                <div className="max-w-6xl mx-auto px-4">
                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
                        {Object.entries(toolCategories).map(([id, name]) => {
                            const info = toolCategoryData[id];
                            const Icon = info.icon;
                            return (
                                <Link
                                    key={id}
                                    to={`/category/${id}`}
                                    className="group flex flex-col items-center p-4 rounded-2xl bg-card border border-border hover:border-primary/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                                >
                                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${info.color} text-white flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}>
                                        <Icon size={24} />
                                    </div>
                                    <span className="text-xs font-bold text-center group-hover:text-primary transition-colors">{name}</span>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Favorites Section */}
            {favoriteToolsList.length > 0 && (
                <section className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                        즐겨찾기
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                        {favoriteToolsList.map(tool => (
                            <ToolCard
                                key={tool.id}
                                tool={tool}
                                isFavorite={true}
                                onToggleFavorite={toggleFavorite}
                            />
                        ))}
                    </div>
                </section>
            )}

            {/* Recent Tools Section */}
            {recentToolsList.length > 0 && (
                <section className="space-y-4 animate-in fade-in slide-in-from-bottom-4 delay-100">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <Clock className="w-6 h-6 text-blue-500" />
                        최근 사용
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                        {recentToolsList.map(tool => (
                            <ToolCard
                                key={tool.id}
                                tool={tool}
                                isFavorite={favorites.includes(tool.id)}
                                onToggleFavorite={toggleFavorite}
                            />
                        ))}
                    </div>
                </section>
            )}

            {/* Featured Tools Section */}
            <section className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <Sparkles className="w-6 h-6 text-primary" />
                        주요 기능
                    </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

                    {featuredTools.map((tool) => {
                        const Icon = tool.icon;
                        return (
                            <Link
                                key={tool.id}
                                to={tool.path}
                                className="group relative bg-card border border-border rounded-2xl p-6 hover:shadow-xl transition-all hover:scale-[1.02] focus:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-primary/50"
                            >
                                {/* Gradient Background */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${tool.color} opacity-5 rounded-2xl group-hover:opacity-10 transition-opacity`} />

                                {/* Content */}
                                <div className="relative space-y-3">
                                    <div className="flex items-start justify-between">
                                        <div className={`p-3 rounded-xl bg-gradient-to-br ${tool.color} text-white`}>
                                            <Icon className="w-6 h-6" />
                                        </div>
                                        <div className="flex flex-wrap gap-1 justify-end">
                                            {tool.badges.map((badge) => (
                                                <span
                                                    key={badge}
                                                    className={`text-xs px-2 py-1 rounded-full font-bold ${badge === 'NEW'
                                                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                        : badge === '인기'
                                                            ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                                                            : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                                        }`}
                                                >
                                                    {badge}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold mb-1">{tool.title}</h3>
                                        <p className="text-sm text-muted-foreground">{tool.description}</p>
                                    </div>
                                    <div className="flex items-center text-sm text-primary font-medium group-hover:gap-2 transition-all">
                                        자세히 보기
                                        <span className="inline-block group-hover:translate-x-1 transition-transform">→</span>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </section>

            {/* Divider */}
            <div className="border-t border-border" />

            {/* All Tools Section */}
            <section className="space-y-4">
                <h2 className="text-xl font-bold">
                    {searchQuery ? '검색 결과' : '모든 도구'}
                </h2>
                {filteredTools.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                        {filteredTools.map((tool) => (
                            <ToolCard
                                key={tool.id}
                                tool={tool}
                                isFavorite={favorites.includes(tool.id)}
                                onToggleFavorite={toggleFavorite}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 space-y-4">
                        <Search className="w-16 h-16 mx-auto text-muted-foreground opacity-50" />
                        <p className="text-lg text-muted-foreground">
                            '{searchQuery}' 검색 결과가 없습니다
                        </p>
                        <p className="text-sm text-muted-foreground">
                            다른 키워드로 검색해보세요
                        </p>
                    </div>
                )}
            </section>

            {/* SEO Keyword-Rich Content Section */}
            <section className="mt-20 py-16 border-t border-border space-y-16">
                <div className="max-w-4xl mx-auto space-y-8">
                    <div className="text-center space-y-4">
                        <h2 className="text-3xl font-black">당신을 위한 모든 온라인 도구, Tool Hive</h2>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            복잡한 계산, 번거로운 변환, 무료한 시간... 이 모든 것을 한 번에 해결할 수 있는 <strong>Tool Hive</strong>에 오신 것을 환영합니다.
                            별도의 회원가입이나 설치 없이 모든 기능을 100% 무료로 이용할 수 있습니다.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
                        <div className="space-y-4">
                            <h3 className="text-xl font-bold flex items-center gap-2 text-primary">
                                <Zap className="w-5 h-5" /> 똑똑한 생활 및 금융 도구
                            </h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                <strong>대출 계산기</strong>, <strong>연봉 실수령액 계산기</strong>, <strong>퇴직금 계산기</strong> 등 생활에 밀접한 금융 도구부터
                                <strong>BMI 계산기</strong>, <strong>BMR 계산기</strong>와 같은 건강 도구까지 일상에 꼭 필요한 기능을 제공합니다.
                                정확한 수식과 최신 데이터를 기반으로 믿을 수 있는 결과를 드립니다.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-xl font-bold flex items-center gap-2 text-purple-600">
                                <TrendingUp className="w-5 h-5" /> 강력한 변환 및 개발 도구
                            </h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                <strong>단위 변환기</strong>(길이, 무게, 온도), <strong>실시간 환율 계산기</strong>뿐만 아니라
                                개발자를 위한 <strong>JSON 포매터</strong>, <strong>Base64 변환기</strong>, <strong>해시 생성기</strong>, <strong>URL 인코더</strong> 등
                                생산성을 극대화해 줄 다양한 전문 도구들이 준비되어 있습니다.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-xl font-bold flex items-center gap-2 text-pink-600">
                                <Sparkles className="w-5 h-5" /> 재미있는 운세와 심리 테스트
                            </h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                정통 명리학 기반의 <strong>무료 만세력(사주팔자)</strong>, <strong>오늘의 운세</strong>, <strong>타로 카드</strong>,
                                그리고 자신의 성향을 파악하는 <strong>MBTI 테스트</strong>와 <strong>혈액형 성격 분석</strong>까지!
                                심심할 때 즐기는 다양한 콘텐츠로 하루의 재미를 더해보세요.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-xl font-bold flex items-center gap-2 text-orange-600">
                                <Wand2 className="w-5 h-5" /> 가벼운 즐거움, 미니 게임
                            </h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                <strong>수박 게임</strong>, <strong>2048</strong>, <strong>스도쿠</strong>, <strong>스네이크 게임</strong>과 같은 고전적인 퍼즐부터
                                <strong>반응속도 테스트</strong>, <strong>타자 속도 테스트</strong> 등 나의 실력을 측정할 수 있는 게임들을
                                바로 시작할 수 있습니다. 랭킹을 확인하고 자신의 한계에 도전해보세요.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-card border border-border rounded-3xl p-8 md:p-12 text-center space-y-6 max-w-4xl mx-auto shadow-sm">
                    <h2 className="text-2xl font-bold">왜 Tool Hive를 선택해야 하나요?</h2>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="space-y-2">
                            <div className="text-3xl">🚀</div>
                            <h4 className="font-bold">광속 실행</h4>
                            <p className="text-xs text-muted-foreground">설치 없이 브라우저에서 1초 만에 실행</p>
                        </div>
                        <div className="space-y-2">
                            <div className="text-3xl">📱</div>
                            <h4 className="font-bold">모바일 최적화</h4>
                            <p className="text-xs text-muted-foreground">언제 어디서나 스마트폰으로 접속</p>
                        </div>
                        <div className="space-y-2">
                            <div className="text-3xl">🔒</div>
                            <h4 className="font-bold">안전한 데이터</h4>
                            <p className="text-xs text-muted-foreground">사용자 데이터를 서버에 남기지 않아 안전</p>
                        </div>
                        <div className="space-y-2">
                            <div className="text-3xl">🆕</div>
                            <h4 className="font-bold">지속적 업데이트</h4>
                            <p className="text-xs text-muted-foreground">매주 새로운 유용한 도구 추가</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
