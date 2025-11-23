import React, { useState } from 'react';
import { Utensils, RefreshCw, Share2, Check } from 'lucide-react';
import SEO from '../components/SEO';

const foodCategories = {
    korean: {
        name: '한식',
        items: [
            '김치찌개', '된장찌개', '비빔밥', '제육볶음', '불고기', '국밥', '순두부찌개', '칼국수', '수제비', '떡만두국',
            '갈비탕', '설렁탕', '부대찌개', '김밥', '라면', '떡볶이', '돌솥비빔밥', '낙지볶음', '오징어덮밥', '육개장',
            '삼계탕', '닭갈비', '보쌈정식', '생선구이', '청국장', '콩국수', '냉면', '비빔국수', '잔치국수', '쌈밥'
        ]
    },
    chinese: {
        name: '중식',
        items: [
            '짜장면', '짬뽕', '탕수육', '볶음밥', '마파두부', '잡채밥', '유산슬', '깐풍기', '양장피', '고추잡채',
            '울면', '기스면', '중화비빔밥', '쟁반짜장', '사천탕면', '마라탕', '마라샹궈', '꿔바로우', '동파육', '멘보샤'
        ]
    },
    japanese: {
        name: '일식',
        items: [
            '초밥', '돈가스', '우동', '라멘', '메밀소바', '가츠동', '규동', '텐동', '사케동', '오코노미야키',
            '타코야키', '회덮밥', '카레라이스', '나베', '야키소바', '오니기리', '스키야키', '장어덮밥'
        ]
    },
    western: {
        name: '양식',
        items: [
            '파스타', '피자', '스테이크', '햄버거', '샌드위치', '리조또', '샐러드', '그라탕', '오므라이스', '스프',
            '토스트', '브런치', '바비큐', '타코', '부리또', '퀘사디아', '라자냐', '뇨끼'
        ]
    },
    snack: {
        name: '분식/기타',
        items: [
            '떡볶이', '순대', '튀김', '김밥', '라면', '쫄면', '오뎅', '핫도그', '토스트', '도시락',
            '편의점', '샐러드', '포케', '서브웨이', '이삭토스트', '봉구스밥버거', '한솥도시락'
        ]
    }
};

const LunchRecommender = () => {
    const [selectedCategories, setSelectedCategories] = useState(['korean', 'chinese', 'japanese', 'western', 'snack']);
    const [result, setResult] = useState(null);
    const [isSpinning, setIsSpinning] = useState(false);
    const [displayMenu, setDisplayMenu] = useState('오늘 뭐 먹지?');
    const [showCopied, setShowCopied] = useState(false);

    const toggleCategory = (category) => {
        if (selectedCategories.includes(category)) {
            if (selectedCategories.length === 1) return; // Prevent empty selection
            setSelectedCategories(selectedCategories.filter(c => c !== category));
        } else {
            setSelectedCategories([...selectedCategories, category]);
        }
    };

    const selectAll = () => {
        if (selectedCategories.length === Object.keys(foodCategories).length) {
            setSelectedCategories(['korean']); // Default to one if unselecting all
        } else {
            setSelectedCategories(Object.keys(foodCategories));
        }
    };

    const recommendMenu = () => {
        if (isSpinning) return;

        setIsSpinning(true);
        setResult(null);

        // Collect all candidate items
        let candidates = [];
        selectedCategories.forEach(cat => {
            candidates = [...candidates, ...foodCategories[cat].items];
        });

        // Animation loop
        let count = 0;
        const maxCount = 20; // Number of shuffles
        const interval = setInterval(() => {
            const randomIdx = Math.floor(Math.random() * candidates.length);
            setDisplayMenu(candidates[randomIdx]);
            count++;

            if (count >= maxCount) {
                clearInterval(interval);
                const finalChoice = candidates[Math.floor(Math.random() * candidates.length)];
                setDisplayMenu(finalChoice);
                setResult(finalChoice);
                setIsSpinning(false);
            }
        }, 100);
    };

    const copyToClipboard = () => {
        if (!result) return;
        navigator.clipboard.writeText(`오늘 점심 메뉴는 [${result}] 어때요?`);
        setShowCopied(true);
        setTimeout(() => setShowCopied(false), 2000);
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <SEO
                title="점심 메뉴 추천기 - 오늘 뭐 먹지?"
                description="한식, 중식, 일식, 양식 등 다양한 카테고리에서 점심 메뉴를 랜덤으로 추천해드립니다."
                keywords="점심메뉴, 메뉴추천, 오늘뭐먹지, 점심추천, 랜덤메뉴, 식사추천"
            />

            <div className="text-center space-y-4">
                <h1 className="text-3xl font-bold text-text-primary flex items-center justify-center gap-3">
                    <Utensils className="w-8 h-8 text-primary" />
                    점심 메뉴 추천기
                </h1>
                <p className="text-text-secondary">
                    오늘 점심 뭐 먹을지 고민되시나요? 랜덤으로 골라드릴게요!
                </p>
            </div>

            <div className="card p-6 space-y-6">
                {/* Category Selection */}
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <label className="text-sm font-medium text-text-secondary">카테고리 선택</label>
                        <button
                            onClick={selectAll}
                            className="text-xs text-primary hover:underline"
                        >
                            {selectedCategories.length === Object.keys(foodCategories).length ? '전체 해제' : '전체 선택'}
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {Object.entries(foodCategories).map(([key, value]) => (
                            <button
                                key={key}
                                onClick={() => toggleCategory(key)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedCategories.includes(key)
                                        ? 'bg-primary text-primary-foreground shadow-md'
                                        : 'bg-bg-card border border-border-color text-text-secondary hover:bg-bg-card-hover'
                                    }`}
                            >
                                {value.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Display Area */}
                <div className="relative h-48 flex items-center justify-center bg-bg-card border-2 border-dashed border-border-color rounded-2xl overflow-hidden">
                    <div className={`text-4xl font-bold text-center transition-all ${result ? 'text-primary scale-110' : 'text-text-tertiary'
                        }`}>
                        {displayMenu}
                    </div>
                    {result && (
                        <div className="absolute top-4 right-4">
                            <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full">
                                추천 완료!
                            </span>
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                    <button
                        onClick={recommendMenu}
                        disabled={isSpinning}
                        className="flex-1 btn btn-primary py-4 text-lg flex items-center justify-center gap-2"
                    >
                        <RefreshCw className={`w-5 h-5 ${isSpinning ? 'animate-spin' : ''}`} />
                        {isSpinning ? '고르는 중...' : '메뉴 추천받기'}
                    </button>

                    {result && (
                        <button
                            onClick={copyToClipboard}
                            className="px-6 rounded-xl border border-border-color hover:bg-bg-card-hover flex items-center justify-center gap-2 transition-colors"
                            title="결과 복사하기"
                        >
                            {showCopied ? (
                                <Check className="w-5 h-5 text-green-500" />
                            ) : (
                                <Share2 className="w-5 h-5 text-text-secondary" />
                            )}
                        </button>
                    )}
                </div>
            </div>

            {/* Tip Section */}
            <div className="bg-primary/5 rounded-xl p-6 text-center">
                <p className="text-sm text-text-secondary">
                    💡 마음에 들지 않는다면 다시 한 번 버튼을 눌러보세요!<br />
                    여러 번 돌리다 보면 딱 꽂히는 메뉴가 나올 거예요.
                </p>
            </div>
        </div>
    );
};

export default LunchRecommender;
