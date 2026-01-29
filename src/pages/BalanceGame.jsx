import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Share2, RefreshCw, Scale, ArrowRight, CheckCircle2 } from 'lucide-react';

const BalanceGame = () => {
    const [step, setStep] = useState(0);
    const [history, setHistory] = useState([]); // Stores user choices
    const [showStats, setShowStats] = useState(false); // To show stats after selection
    const [currentStats, setCurrentStats] = useState({ a: 50, b: 50 });

    const questions = [
        {
            id: 1,
            title: "평생 한 가지 음식만 먹어야 한다면?",
            optionA: "라면",
            optionB: "치킨"
        },
        {
            id: 2,
            title: "여름 vs 겨울, 더 싫은 계절은?",
            optionA: "에어컨 없는 여름",
            optionB: "보일러 고장난 겨울"
        },
        {
            id: 3,
            title: "초능력을 가질 수 있다면?",
            optionA: "과거로 가는 능력",
            optionB: "미래를 보는 능력"
        },
        {
            id: 4,
            title: "다시 태어난다면?",
            optionA: "재벌 2세 (얼굴 랜덤)",
            optionB: "존잘/존예 (평범한 집안)"
        },
        {
            id: 5,
            title: "친구와의 약속, 더 나쁜 것은?",
            optionA: "약속 당일 잠수타는 친구",
            optionB: "약속 시간마다 1시간 늦는 친구"
        },
        {
            id: 6,
            title: "핸드폰 배터리가 없을 때?",
            optionA: "배터리 1%인데 와이파이 됨",
            optionB: "배터리 100%인데 인터넷 안됨"
        },
        {
            id: 7,
            title: "직장 상사 고르기",
            optionA: "일 못하는데 착한 상사",
            optionB: "일 잘하는데 성격 더러운 상사"
        },
        {
            id: 8,
            title: "로또 1등에 당첨된다면?",
            optionA: "아무한테도 말 안 한다",
            optionB: "가족한테만 말한다"
        },
        {
            id: 9,
            title: "10년지기 이성 친구",
            optionA: "1억 받고 절교하기",
            optionB: "그냥 지내기 (돈 0원)"
        },
        {
            id: 10,
            title: "연인 사이에 더 용서할 수 없는 것은?",
            optionA: "이성 친구와 단둘이 술 마시기",
            optionB: "전 연인과 연락하며 지내기"
        }
    ];

    const generateRandomStats = () => {
        // Generate random percentage between 30 and 70 for Option A
        const percentA = Math.floor(Math.random() * (70 - 30 + 1)) + 30;
        return { a: percentA, b: 100 - percentA };
    };

    const handleSelect = (choice) => {
        if (showStats) return;

        const stats = generateRandomStats();
        setCurrentStats(stats);
        setShowStats(true);

        const newHistory = [...history, { questionId: questions[step].id, choice, stats }];
        setHistory(newHistory);

        // Auto advance after delay
        setTimeout(() => {
            if (step < questions.length) {
                setShowStats(false);
                setStep(step + 1);
            }
        }, 1500);
    };

    const resetGame = () => {
        setStep(0);
        setHistory([]);
        setShowStats(false);
    };

    const shareResult = () => {
        if (navigator.share) {
            navigator.share({
                title: '밸런스 게임',
                text: `나의 밸런스 게임 결과는? 당신의 선택과 비교해보세요!`,
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
                <title>밸런스 게임 | 황금밸런스 질문 모음 - Utility Hub</title>
                <meta name="description" content="인생 최대의 난제! 짜장 vs 짬뽕부터 상상 초월 밸런스 게임까지. 친구, 연인과 함께 즐기는 재밌는 밸런스 게임 질문 모음." />
                <meta name="keywords" content="밸런스게임, 밸런스질문, vs게임, 심리테스트, 재미있는게임, 커플밸런스게임" />
            </Helmet>

            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4 animate-fade-in">
                    ⚖️ 밸런스 게임
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300">
                    선택장애 유발! 당신의 선택은?
                </p>
            </div>

            <div className="max-w-3xl mx-auto">
                {step < questions.length ? (
                    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden p-6 md:p-10 transition-all duration-300 min-h-[500px] flex flex-col justify-center animate-fade-in relative">
                        {/* Progress Bar */}
                        <div className="absolute top-0 left-0 w-full h-2 bg-gray-200">
                            <div
                                className="h-full bg-indigo-500 transition-all duration-300"
                                style={{ width: `${((step) / questions.length) * 100}%` }}
                            ></div>
                        </div>

                        <div className="text-center mb-10 mt-6">
                            <span className="inline-block px-3 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 rounded-full text-sm font-bold mb-4">
                                Question {step + 1}
                            </span>
                            <h2 className="text-3xl md:text-3xl font-bold text-gray-800 dark:text-white leading-tight">
                                {questions[step].title}
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
                            {/* Option A */}
                            <button
                                onClick={() => handleSelect('A')}
                                disabled={showStats}
                                className={`relative group p-8 rounded-2xl border-4 transition-all duration-300 transform hover:-translate-y-2 flex flex-col items-center justify-center min-h-[200px]
                                ${showStats
                                        ? (history[step]?.choice === 'A' ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-gray-200 opacity-50')
                                        : 'border-red-200 hover:border-red-500 bg-white hover:bg-red-50 dark:bg-gray-700 dark:hover:bg-red-900/20'
                                    }`}
                            >
                                <span className={`text-4xl font-bold mb-4 ${showStats && history[step]?.choice === 'A' ? 'text-red-600' : 'text-red-500'}`}>A</span>
                                <span className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white break-keep text-center">{questions[step].optionA}</span>

                                {showStats && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-800/80 rounded-xl animate-fade-in">
                                        <span className="text-5xl font-extrabold text-red-600">{currentStats.a}%</span>
                                    </div>
                                )}
                            </button>

                            {/* VS Badge */}
                            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg">
                                <div className="bg-gray-800 dark:bg-white text-white dark:text-gray-800 w-12 h-12 rounded-full flex items-center justify-center font-black text-xl italic">
                                    VS
                                </div>
                            </div>

                            {/* Option B */}
                            <button
                                onClick={() => handleSelect('B')}
                                disabled={showStats}
                                className={`relative group p-8 rounded-2xl border-4 transition-all duration-300 transform hover:-translate-y-2 flex flex-col items-center justify-center min-h-[200px]
                                ${showStats
                                        ? (history[step]?.choice === 'B' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 opacity-50')
                                        : 'border-blue-200 hover:border-blue-500 bg-white hover:bg-blue-50 dark:bg-gray-700 dark:hover:bg-blue-900/20'
                                    }`}
                            >
                                <span className={`text-4xl font-bold mb-4 ${showStats && history[step]?.choice === 'B' ? 'text-blue-600' : 'text-blue-500'}`}>B</span>
                                <span className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white break-keep text-center">{questions[step].optionB}</span>

                                {showStats && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-800/80 rounded-xl animate-fade-in">
                                        <span className="text-5xl font-extrabold text-blue-600">{currentStats.b}%</span>
                                    </div>
                                )}
                            </button>
                        </div>

                        {showStats && (
                            <p className="text-center text-gray-500 mt-6 animate-pulse">
                                다음 질문으로 넘어갑니다...
                            </p>
                        )}
                    </div>
                ) : (
                    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden p-8 animate-scale-in">
                        <div className="text-center mb-8">
                            <Scale className="w-20 h-20 text-indigo-500 mx-auto mb-4" />
                            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">게임 종료!</h2>
                            <p className="text-gray-600 dark:text-gray-300">
                                당신의 취향은 확고하시군요!
                            </p>
                        </div>

                        <div className="space-y-4 mb-8 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                            {history.map((record, index) => (
                                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                                    <div className="flex-1">
                                        <p className="text-xs text-gray-500 mb-1">{questions[index].title}</p>
                                        <p className={`font-bold ${record.choice === 'A' ? 'text-red-500' : 'text-blue-500'}`}>
                                            {record.choice === 'A' ? questions[index].optionA : questions[index].optionB}
                                        </p>
                                    </div>
                                    <div className="text-right pl-4">
                                        <span className="text-sm font-medium text-gray-400">
                                            {record.choice === 'A' ? record.stats.a : record.stats.b}% 선택
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex gap-4 justify-center">
                            <button
                                onClick={resetGame}
                                className="flex items-center px-6 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-xl font-bold transition-all"
                            >
                                <RefreshCw className="w-5 h-5 mr-2" />
                                다시하기
                            </button>
                            <button
                                onClick={shareResult}
                                className="flex items-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/30 transition-all transform hover:-translate-y-1"
                            >
                                <Share2 className="w-5 h-5 mr-2" />
                                결과 공유
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                {/* SEO Content Section */}
                <div className="md:col-span-3 bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6 text-sm text-gray-600 dark:text-gray-400">
                    <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-2">💡 밸런스 게임이란?</h3>
                    <p>
                        밸런스 게임은 두 가지 극단적이고 난처한 선택지 중 하나를 반드시 선택해야 하는 게임입니다.
                        '평생 라면만 먹기 vs 평생 탄산 끊기'처럼 고르기 힘든 질문들을 통해 친구나 연인의 가치관과 취향을 알아보세요.
                        술자리 게임이나 아이스브레이킹용으로도 아주 좋습니다.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default BalanceGame;
