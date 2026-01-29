import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Share2, RefreshCw, Globe, Flag, MapPin, Trophy } from 'lucide-react';

const CapitalQuiz = () => {
    const [gameState, setGameState] = useState('start'); // start, playing, gameover
    const [score, setScore] = useState(0);
    const [streak, setStreak] = useState(0); // Consecutive correct answers
    const [question, setQuestion] = useState(null);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [isCorrect, setIsCorrect] = useState(null);

    // Initial database of ~50 countries
    const countries = [
        { name: "South Korea", nameKr: "대한민국", capital: "서울", flag: "🇰🇷" },
        { name: "USA", nameKr: "미국", capital: "워싱턴 D.C.", flag: "🇺🇸" },
        { name: "Japan", nameKr: "일본", capital: "도쿄", flag: "🇯🇵" },
        { name: "China", nameKr: "중국", capital: "베이징", flag: "🇨🇳" },
        { name: "UK", nameKr: "영국", capital: "런던", flag: "🇬🇧" },
        { name: "France", nameKr: "프랑스", capital: "파리", flag: "🇫🇷" },
        { name: "Germany", nameKr: "독일", capital: "베를린", flag: "🇩🇪" },
        { name: "Italy", nameKr: "이탈리아", capital: "로마", flag: "🇮🇹" },
        { name: "Canada", nameKr: "캐나다", capital: "오타와", flag: "🇨🇦" },
        { name: "Australia", nameKr: "호주", capital: "캔버라", flag: "🇦🇺" },
        { name: "Russia", nameKr: "러시아", capital: "모스크바", flag: "🇷🇺" },
        { name: "India", nameKr: "인도", capital: "뉴델리", flag: "🇮🇳" },
        { name: "Brazil", nameKr: "브라질", capital: "브라질리아", flag: "🇧🇷" },
        { name: "Spain", nameKr: "스페인", capital: "마드리드", flag: "🇪🇸" },
        { name: "Vietnam", nameKr: "베트남", capital: "하노이", flag: "🇻🇳" },
        { name: "Thailand", nameKr: "태국", capital: "방콕", flag: "🇹🇭" },
        { name: "Turkey", nameKr: "터키", capital: "앙카라", flag: "🇹🇷" },
        { name: "Egypt", nameKr: "이집트", capital: "카이로", flag: "🇪🇬" },
        { name: "Argentina", nameKr: "아르헨티나", capital: "부에노스아이레스", flag: "🇦🇷" },
        { name: "Mexico", nameKr: "멕시코", capital: "멕시코시티", flag: "🇲🇽" },
        { name: "Indonesia", nameKr: "인도네시아", capital: "자카르타", flag: "🇮🇩" },
        { name: "Switzerland", nameKr: "스위스", capital: "베른", flag: "🇨🇭" },
        { name: "Netherlands", nameKr: "네덜란드", capital: "암스테르담", flag: "🇳🇱" },
        { name: "Belgium", nameKr: "벨기에", capital: "브뤼셀", flag: "🇧🇪" },
        { name: "Sweden", nameKr: "스웨덴", capital: "스톡홀름", flag: "🇸🇪" },
        { name: "Norway", nameKr: "노르웨이", capital: "오슬로", flag: "🇳🇴" },
        { name: "Finland", nameKr: "핀란드", capital: "헬싱키", flag: "🇫🇮" },
        { name: "Denmark", nameKr: "덴마크", capital: "코펜하겐", flag: "🇩🇰" },
        { name: "Poland", nameKr: "폴란드", capital: "바르샤바", flag: "🇵🇱" },
        { name: "Ukraine", nameKr: "우크라이나", capital: "키이우", flag: "🇺🇦" },
        { name: "Greece", nameKr: "그리스", capital: "아테네", flag: "🇬🇷" },
        { name: "Portugal", nameKr: "포르투갈", capital: "리스본", flag: "🇵🇹" },
        { name: "Austria", nameKr: "오스트리아", capital: "빈", flag: "🇦🇹" },
        { name: "Hungary", nameKr: "헝가리", capital: "부다페스트", flag: "🇭🇺" },
        { name: "Czech Republic", nameKr: "체코", capital: "프라하", flag: "🇨🇿" },
        { name: "Taiwan", nameKr: "대만", capital: "타이베이", flag: "🇹🇼" },
        { name: "Singapore", nameKr: "싱가포르", capital: "싱가포르", flag: "🇸🇬" },
        { name: "Malaysia", nameKr: "말레이시아", capital: "쿠알라룸푸르", flag: "🇲🇾" },
        { name: "Philippines", nameKr: "필리핀", capital: "마닐라", flag: "🇵🇭" },
        { name: "Saudi Arabia", nameKr: "사우디아라비아", capital: "리야드", flag: "🇸🇦" },
        { name: "UAE", nameKr: "아랍에미리트", capital: "아부다비", flag: "🇦🇪" },
        { name: "South Africa", nameKr: "남아공", capital: "프리토리아", flag: "🇿🇦" }, // Has 3 capitals, usually Pretoria is administrative
        { name: "Kenya", nameKr: "케냐", capital: "나이로비", flag: "🇰🇪" },
        { name: "New Zealand", nameKr: "뉴질랜드", capital: "웰링턴", flag: "🇳🇿" },
        { name: "Chile", nameKr: "칠레", capital: "산티아고", flag: "🇨🇱" },
        { name: "Peru", nameKr: "페루", capital: "리마", flag: "🇵🇪" },
        { name: "Colombia", nameKr: "콜롬비아", capital: "보고타", flag: "🇨🇴" },
        { name: "Mongolia", nameKr: "몽골", capital: "울란바토르", flag: "🇲🇳" },
        { name: "Nepal", nameKr: "네팔", capital: "카트만두", flag: "🇳🇵" },
        { name: "Uzbekistan", nameKr: "우즈베키스탄", capital: "타슈켄트", flag: "🇺🇿" },
    ];

    const generateQuestion = () => {
        const target = countries[Math.floor(Math.random() * countries.length)];
        // Generate 3 distractors
        const distractors = [];
        while (distractors.length < 3) {
            const random = countries[Math.floor(Math.random() * countries.length)];
            if (random.name !== target.name && !distractors.includes(random)) {
                distractors.push(random);
            }
        }

        // Shuffle options
        const options = [...distractors, target].sort(() => Math.random() - 0.5);

        return {
            target,
            options
        };
    };

    const startGame = () => {
        setGameState('playing');
        setScore(0);
        setStreak(0);
        setSelectedAnswer(null);
        setIsCorrect(null);
        setQuestion(generateQuestion());
    };

    const handleAnswer = (option) => {
        if (selectedAnswer) return;

        setSelectedAnswer(option);
        const correct = option.name === question.target.name;
        setIsCorrect(correct);

        if (correct) {
            setScore(prev => prev + 10 + (streak * 2)); // Bonus for streak
            setStreak(prev => prev + 1);
            setTimeout(() => {
                setSelectedAnswer(null);
                setIsCorrect(null);
                setQuestion(generateQuestion());
            }, 1000);
        } else {
            // Game Over on wrong answer? or Just continue?
            // Let's make it "Game Over" for viral tension, or penalty?
            // "Survival Mode" usually is better for viral. Score attack.
            setTimeout(() => {
                setGameState('gameover');
            }, 1000);
        }
    };

    const getRank = (finalScore) => {
        if (finalScore >= 300) return { title: "외교관", desc: "전 세계를 내 집처럼! 완벽한 지리 지식.", color: "text-purple-600" };
        if (finalScore >= 200) return { title: "세계 여행가", desc: "여권에 도장이 가득하겠군요!", color: "text-blue-600" };
        if (finalScore >= 100) return { title: "지리 선생님", desc: "꽤 박식하시네요.", color: "text-green-600" };
        if (finalScore >= 50) return { title: "관광객", desc: "유명한 나라는 다 아시는군요.", color: "text-orange-500" };
        return { title: "집돌이", desc: "해외 여행 좀 다녀오셔야겠어요!", color: "text-gray-500" };
    };

    const shareResult = () => {
        const rank = getRank(score);
        if (navigator.share) {
            navigator.share({
                title: '세계 수도 퀴즈',
                text: `나의 점수는 ${score}점 (연속 ${streak}문제 성공)! 등급: ${rank.title} - 유틸리티 허브`,
                url: window.location.href,
            });
        } else {
            alert('링크가 복사되었습니다!');
            navigator.clipboard.writeText(window.location.href);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <Helmet>
                <title>세계 수도 퀴즈 | 나라는 알지만 수도는? - Utility Hub</title>
                <meta name="description" content="미국의 수도는 뉴욕이 아닙니다! 헷갈리는 세계 각국의 수도를 맞춰보세요. 당신의 상식 레벨을 테스트하는 수도 맞추기 퀴즈." />
                <meta name="keywords" content="수도퀴즈, 국기퀴즈, 세계지리, 상식퀴즈, 나라수도, capital city quiz" />
            </Helmet>

            <div className="text-center mb-10">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4 animate-fade-in">
                    🌏 세계 수도 퀴즈
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300">
                    틀리는 순간 게임 오버! 당신은 몇 문제나 맞출 수 있을까요?
                </p>
            </div>

            <div className="max-w-xl mx-auto bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden p-8 transition-all duration-300 min-h-[400px] flex flex-col justify-center items-center">

                {gameState === 'start' && (
                    <div className="text-center animate-fade-in w-full">
                        <Globe className="w-32 h-32 text-blue-500 mx-auto mb-6 animate-pulse" />
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-8">도전할 준비가 되셨나요?</h2>

                        <div className="space-y-4 mb-8">
                            <div className="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                                <Flag className="w-6 h-6 text-red-500 mr-4" />
                                <span className="text-gray-600 dark:text-gray-300 text-left">국기를 보고 수도를 맞춰보세요.</span>
                            </div>
                            <div className="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                                <Trophy className="w-6 h-6 text-yellow-500 mr-4" />
                                <span className="text-gray-600 dark:text-gray-300 text-left">연속으로 맞추면 점수가 올라갑니다.</span>
                            </div>
                        </div>

                        <button
                            onClick={startGame}
                            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white text-xl font-bold rounded-2xl shadow-lg transition-all transform hover:-translate-y-1"
                        >
                            퀴즈 시작
                        </button>
                    </div>
                )}

                {gameState === 'playing' && question && (
                    <div className="w-full animate-fade-in">
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center text-orange-500 font-bold">
                                <span className="mr-1">🔥</span> Streak: {streak}
                            </div>
                            <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
                                {score} 점
                            </div>
                        </div>

                        <div className="text-center mb-8">
                            <div className="text-8xl mb-4 animate-bounce-short">{question.target.flag}</div>
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                                <span className="text-gray-500 text-lg block mb-1">이 나라의 수도는?</span>
                                {question.target.nameKr}
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 gap-3">
                            {question.options.map((option, index) => {
                                const isSelected = selectedAnswer === option;
                                const isTarget = option.name === question.target.name;

                                let btnClass = "bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white";

                                if (selectedAnswer) {
                                    if (isTarget) {
                                        btnClass = "bg-green-500 text-white ring-4 ring-green-200 dark:ring-green-900";
                                    } else if (isSelected && !isTarget) {
                                        btnClass = "bg-red-500 text-white";
                                    } else {
                                        btnClass = "opacity-40 bg-gray-100 dark:bg-gray-700";
                                    }
                                }

                                return (
                                    <button
                                        key={index}
                                        onClick={() => handleAnswer(option)}
                                        disabled={selectedAnswer !== null}
                                        className={`w-full py-4 rounded-xl text-lg font-bold transition-all shadow-sm ${btnClass}`}
                                    >
                                        {option.capital}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {gameState === 'gameover' && (
                    <div className="text-center animate-scale-in w-full">
                        <MapPin className="w-20 h-20 text-red-500 mx-auto mb-6" />
                        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Game Over!</h2>

                        <div className="mb-8">
                            <span className="text-gray-500 dark:text-gray-400">최종 점수</span>
                            <div className="text-6xl font-black text-blue-600 dark:text-blue-400 my-2">
                                {score}
                            </div>
                            <div className="text-sm font-bold text-gray-400">최대 {streak}연승</div>
                        </div>

                        <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-2xl mb-8">
                            <h3 className={`text-2xl font-bold mb-2 ${getRank(score).color}`}>
                                {getRank(score).title}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                {getRank(score).desc}
                            </p>
                        </div>

                        <div className="flex gap-4 justify-center">
                            <button
                                onClick={startGame}
                                className="flex items-center px-6 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-xl font-bold transition-all"
                            >
                                <RefreshCw className="w-5 h-5 mr-2" />
                                다시하기
                            </button>
                            <button
                                onClick={shareResult}
                                className="flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-500/30 transition-all transform hover:-translate-y-1"
                            >
                                <Share2 className="w-5 h-5 mr-2" />
                                결과 공유
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <style>{`
                @keyframes bounce-short {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
                .animate-bounce-short {
                    animation: bounce-short 2s infinite;
                }
            `}</style>
        </div>
    );
};

export default CapitalQuiz;
