import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Menu, X, ChevronDown, Search, Activity, Sparkles, Code, Calculator, Type, Image, Gamepad2 } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import SearchModal from './SearchModal';
import RelatedTools from './RelatedTools';
import Logo from './Logo';

const Layout = ({ children }) => {
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    // Keyboard shortcut for search (Ctrl+K)
    React.useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                setIsSearchOpen(true);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const navCategories = [
        {
            id: 'unit',
            title: '단위 변환',
            items: [
                { path: '/length', label: '길이 변환기' },
                { path: '/weight', label: '무게 변환기' },
                { path: '/currency', label: '환율 계산기' },
                { path: '/temperature-converter', label: '온도 변환기' },
                { path: '/area-converter', label: '면적 변환기' },
                { path: '/volume-converter', label: '부피 변환기' },
                { path: '/speed-converter', label: '속도 변환기' },
            ]
        },
        {
            id: 'finance',
            title: '생활/금융',
            items: [
                { path: '/loan', label: '대출금 계산기' },
                { path: '/salary-calc', label: '연봉 실수령액' },
                { path: '/severance-calc', label: '퇴직금 계산기' },
                { path: '/minimum-wage', label: '최저임금 계산기' },
                { path: '/compound-interest', label: '복리 계산기' },
                { path: '/discount-calculator', label: '할인율 계산기' },
                { path: '/percent-calculator', label: '퍼센트 계산기' },
                { path: '/work-hours', label: '근무시간 계산기' },
                { path: '/age-calc', label: '나이 계산기' },
                { path: '/date', label: '날짜 계산기' },
            ]
        },
        {
            id: 'health',
            title: '건강',
            items: [
                { path: '/bmi', label: 'BMI 계산기' },
                { path: '/bmr', label: 'BMR 계산기' },
                { path: '/biorhythm', label: '바이오리듬' },
            ]
        },
        {
            id: 'games',
            title: '게임',
            items: [
                { path: '/reaction-test', label: '반응속도 테스트' },
                { path: '/typing-test', label: '타자 속도 테스트' },
                { path: '/1to50', label: '1 to 50' },
                { path: '/cps-test', label: 'CPS 테스트' },
                { path: '/aim-trainer', label: '에임 트레이너' },
                { path: '/number-memory', label: '숫자 기억하기' },
                { path: '/number-baseball', label: '숫자 야구' },
                { path: '/suika-game', label: '수박 게임' },
                { path: '/2048', label: '2048' },
                { path: '/minesweeper', label: '지뢰찾기' },
                { path: '/roulette', label: '돌림판' },
                { path: '/ladder-game', label: '사다리 타기' },
                { path: '/tanghulu-maker', label: '탕후루 만들기' },
                { path: '/missile-dodge', label: '미사일 피하기' },
                { path: '/flappy-bird', label: '파닥파닥 버드' },
                { path: '/snake-game', label: '스네이크 게임' },
                { path: '/sudoku', label: '스도쿠' },
                { path: '/tower-stacker', label: '탑 쌓기' },
                { path: '/dice-roller', label: '주사위 굴리기' },
            ]
        },
        {
            id: 'text',
            title: '텍스트',
            items: [
                { path: '/word-count', label: '글자수 세기' },
                { path: '/string-converter', label: '대소문자 변환' },
                { path: '/unicode', label: '유니코드 변환' },
                { path: '/base64', label: 'Base64 도구' },
                { path: '/html-encoder', label: 'HTML 인코더' },
            ]
        },
        {
            id: 'dev',
            title: '개발자 도구',
            items: [
                { path: '/base-converter', label: '진법 변환기' },
                { path: '/json-formatter', label: 'JSON 포맷터' },
                { path: '/markdown-editor', label: '마크다운 에디터' },
                { path: '/html-view', label: 'HTML 포맷터' },
                { path: '/diff', label: '코드 비교' },
                { path: '/web-editor', label: '웹 에디터' },
                { path: '/hash-gen', label: '해시 생성기' },
                { path: '/uuid-gen', label: 'UUID 생성기' },
                { path: '/url-encoder', label: 'URL 인코더/디코더' },
                { path: '/jwt-decoder', label: 'JWT 디코더' },
                { path: '/regex-tester', label: '정규식 테스터' },
                { path: '/cron-generator', label: 'CRON 생성기' },
                { path: '/csv-json', label: 'CSV ↔ JSON' },
                { path: '/fraction-calculator', label: '분수 계산기' },
                { path: '/encryption-tool', label: '암호화 도구' },
                { path: '/ascii-art', label: '아스키아트' },
                { path: '/ascii-table', label: '아스키 코드표' },
                { path: '/special-char', label: '특수문자표' },
            ]
        },
        {
            id: 'utility',
            title: '유틸리티',
            items: [
                { path: '/qr-gen', label: 'QR코드 생성기' },
                { path: '/barcode-gen', label: '바코드 생성기' },
                { path: '/password-gen', label: '비밀번호 생성기' },
                { path: '/color-picker', label: '색상표' },
                { path: '/color-extractor', label: '색상 추출기' },
                { path: '/ip-address', label: 'IP 주소 확인' },
                { path: '/world-clock', label: '세계 시계' },
                { path: '/flashlight', label: '손전등' },
                { path: '/checklist', label: '체크리스트' },
                { path: '/timer', label: '타이머/스톱워치' },
                { path: '/pomodoro-timer', label: '뽀모도로 타이머' },
                { path: '/image-resize', label: '이미지 리사이저' },
                { path: '/image-base64', label: '이미지 Base64' },
                { path: '/youtube-thumbnail', label: '유튜브 썸네일' },
            ]
        },
        {
            id: 'fun',
            title: '운세/재미',
            items: [
                { path: '/blood-type', label: '혈액형 성격' },
                { path: '/mbti', label: 'MBTI 테스트' },
                { path: '/lunch', label: '점심 메뉴 추천' },
                { path: '/saju', label: '사주팔자' },
                { path: '/gunghap', label: '궁합보기' },
                { path: '/zodiac-fortune', label: '띠별 운세' },
                { path: '/horoscope', label: '별자리 운세' },
                { path: '/dream-interpretation', label: '꿈해몽' },
                { path: '/name-analysis', label: '이름 분석' },
                { path: '/birth-gen', label: '탄생석/탄생화' },
                { path: '/tarot', label: '타로카드' },
                { path: '/lotto', label: '로또 번호 생성기' },
            ]
        }
    ];

    return (
        <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
            {/* Skip to content link for accessibility */}
            <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:shadow-lg"
            >
                본문으로 건너뛰기
            </a>

            {/* Header */}
            <header className="border-b border-border/40 bg-background/80 backdrop-blur-md sticky top-0 z-50 shadow-sm supports-[backdrop-filter]:bg-background/60">

                <div className="container-custom h-16 flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="hover:opacity-90 transition-opacity">
                        <Logo />
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-6">
                        <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">홈</Link>

                        {navCategories.map((category) => (
                            <div key={category.title} className="relative group">
                                <Link
                                    to={`/category/${category.id}`}
                                    className="flex items-center gap-1 text-sm font-medium hover:text-primary transition-colors py-2"
                                >
                                    {category.title}
                                    <ChevronDown className="w-3 h-3" />
                                </Link>
                                {/* Dropdown */}
                                <div className="absolute top-full left-0 w-48 bg-white dark:bg-gray-950 border border-border rounded-md shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 z-50">
                                    <div className="py-1">
                                        {category.items.map((item) => (
                                            <Link
                                                key={item.path}
                                                to={item.path}
                                                className="block px-4 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                                            >
                                                {item.label}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </nav>

                    {/* Right Side Actions */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setIsSearchOpen(true)}
                            className="p-2 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                            aria-label="검색"
                        >
                            <Search className="w-5 h-5" />
                        </button>
                        <ThemeToggle />

                        {/* Mobile Menu Button */}
                        <button
                            className="md:hidden p-2 rounded-md hover:bg-accent"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden border-b border-border bg-background">
                    <div className="container-custom py-4 space-y-4">
                        <Link
                            to="/"
                            className="block text-sm font-medium py-2"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            홈
                        </Link>
                        {navCategories.map((category) => (
                            <div key={category.title} className="space-y-2">
                                <Link
                                    to={`/category/${category.id}`}
                                    className="text-xs font-bold text-muted-foreground uppercase tracking-wider hover:text-primary transition-colors"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {category.title}
                                </Link>
                                <div className="pl-4 space-y-1 border-l-2 border-border">
                                    {category.items.map((item) => (
                                        <Link
                                            key={item.path}
                                            to={item.path}
                                            className="block text-sm py-2 text-muted-foreground hover:text-foreground"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            {item.label}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Main Content */}
            <main id="main-content" className="flex-1 container-custom py-8">
                {children}
                {location.pathname !== '/' && <RelatedTools />}
            </main>

            {/* Footer with SEO Sitemap */}
            <footer className="border-t border-border mt-auto bg-muted/30">
                <div className="container-custom py-12">
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 mb-12">
                        {navCategories.map((category) => (
                            <div key={category.title} className="space-y-4">
                                <h4 className="font-bold text-sm text-foreground uppercase tracking-wider">{category.title}</h4>
                                <ul className="space-y-2">
                                    {category.items.slice(0, 8).map((item) => (
                                        <li key={item.path}>
                                            <Link
                                                to={item.path}
                                                className="text-xs text-muted-foreground hover:text-primary transition-colors"
                                            >
                                                {item.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    <div className="pt-8 border-t border-border/50 text-center space-y-4">
                        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
                            <Link to="/terms" className="text-muted-foreground hover:text-foreground underline-offset-4 hover:underline">이용약관</Link>
                            <Link to="/privacy" className="text-muted-foreground hover:text-foreground underline-offset-4 hover:underline">개인정보처리방침</Link>
                            <Link to="/contact" className="text-muted-foreground hover:text-foreground underline-offset-4 hover:underline">문의하기</Link>
                            <a href="/sitemap.xml" className="text-muted-foreground hover:text-foreground underline-offset-4 hover:underline">사이트맵</a>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-bold text-foreground opacity-80">Tool Hive (툴 하이브)</p>
                            <p className="text-xs text-muted-foreground italic">"당신의 일상을 더 편리하게 만드는 88가지 이상의 무료 온라인 도구 모음"</p>
                        </div>
                        <p className="text-xs text-muted-foreground/60">© {new Date().getFullYear()} Tool Hive. All rights reserved.</p>
                    </div>
                </div>
            </footer>

            <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </div>
    );
};

export default Layout;
