import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { Share2, RefreshCw, Eye, Play, Trophy, Timer } from 'lucide-react';

const ColorTest = () => {
    const [gameState, setGameState] = useState('start'); // start, playing, gameover
    const [stage, setStage] = useState(1);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(15);
    const [gridSize, setGridSize] = useState(2);
    const [colors, setColors] = useState({ base: '', diff: '' });
    const [diffIndex, setDiffIndex] = useState(0);

    const generateColors = useCallback((currentStage) => {
        // HSL randomization
        const h = Math.floor(Math.random() * 360);
        const s = Math.floor(Math.random() * 40) + 60; // 60-100%
        const l = Math.floor(Math.random() * 40) + 40; // 40-80%

        // Difficulty adjustment: lightness difference decreases as stage increases
        // Stage 1: diff 20%, Stage 50: diff 2%
        let diff = Math.max(2, 25 - Math.floor(currentStage / 2));

        const baseColor = `hsl(${h}, ${s}%, ${l}%)`;
        const diffColor = `hsl(${h}, ${s}%, ${l + diff}%)`;

        return { base: baseColor, diff: diffColor };
    }, []);

    const startGame = () => {
        setGameState('playing');
        setStage(1);
        setScore(0);
        setTimeLeft(15);
        setGridSize(2);
        setupLevel(1);
    };

    const setupLevel = (currentStage) => {
        const size = Math.min(8, Math.floor((currentStage + 1) / 2) + 2); // 2x2 -> 8x8
        setGridSize(size);

        const newColors = generateColors(currentStage);
        setColors(newColors);

        const total = size * size;
        setDiffIndex(Math.floor(Math.random() * total));
    };

    const handleBoxClick = (index) => {
        if (gameState !== 'playing') return;

        if (index === diffIndex) {
            // Correct
            const nextStage = stage + 1;
            setStage(nextStage);
            setScore(nextStage - 1); // Score is completed stages
            setTimeLeft(prev => Math.min(15, prev + 1)); // Add 1 second bonus per correct answer
            setupLevel(nextStage);
        } else {
            // Wrong
            setTimeLeft(prev => Math.max(0, prev - 3)); // Penalty 3 seconds
        }
    };

    useEffect(() => {
        let timer;
        if (gameState === 'playing') {
            timer = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        setGameState('gameover');
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [gameState]);

    const getTier = (finalScore) => {
        if (finalScore >= 50) return { name: "🦅 매의 눈 (Eagle Eye)", desc: "당신의 눈은 현미경인가요? 인간을 초월한 색감 능력자입니다!", color: "text-purple-600" };
        if (finalScore >= 40) return { name: "🐯 호랑이 눈 (Tiger Eye)", desc: "미세한 차이도 놓치지 않는 예리한 감각의 소유자!", color: "text-red-500" };
        if (finalScore >= 30) return { name: "🦊 여우 눈 (Fox Eye)", desc: "상당히 뛰어난 색감 능력을 가지고 계시네요.", color: "text-orange-500" };
        if (finalScore >= 20) return { name: "🐱 고양이 눈 (Cat Eye)", desc: "평균 이상의 색감 능력을 가진 당신!", color: "text-green-600" };
        if (finalScore >= 10) return { name: "🐶 강아지 눈 (Puppy Eye)", desc: "평범한 색감 능력을 가지고 있습니다. 조금 더 노력해보세요!", color: "text-blue-500" };
        return { name: "🦇 박쥐 눈 (Bat Eye)", desc: "혹시... 색맹이신가요? 흑백 세상에 살고 계신 건 아니죠?", color: "text-gray-500" };
    };

    const shareResult = () => {
        const tier = getTier(score);
        if (navigator.share) {
            navigator.share({
                title: '색감 능력 테스트',
                text: `나의 색감 능력 레벨은: ${stage}단계! - ${tier.name}`,
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
                <title>색감 능력 테스트 | 다른 색깔 찾기 게임 - Utility Hub</title>
                <meta name="description" content="나의 색감 능력은 상위 몇 프로일까? 미세하게 다른 색깔을 찾아내는 색감 테스트 게임. 단계가 올라갈수록 점점 어려워집니다!" />
                <meta name="keywords" content="색감테스트, 다른색찾기, 색맹테스트, 시력테스트, 게임, 미니게임" />
            </Helmet>

            <div className="text-center mb-8">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4 animate-fade-in">
                    🎨 색감 능력 테스트
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300">
                    다른 색깔의 박스를 찾아 클릭하세요!
                </p>
            </div>

            <div className="max-w-lg mx-auto bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden p-6 transition-all duration-300 min-h-[500px] flex flex-col items-center justify-center">

                {gameState === 'start' && (
                    <div className="text-center animate-fade-in space-y-8">
                        <div className="relative inline-block">
                            <Eye className="w-32 h-32 text-indigo-500 mx-auto" />
                            <div className="absolute top-0 right-0 animate-ping">
                                <Sparkles className="w-8 h-8 text-yellow-400" />
                            </div>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">준비 되셨나요?</h2>
                        <p className="text-gray-600 dark:text-gray-300 max-w-xs mx-auto">
                            제한 시간 내에 다른 색깔의 네모를 찾아주세요. 정답을 맞히면 시간이 추가됩니다!
                        </p>
                        <button
                            onClick={startGame}
                            className="inline-flex items-center px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white text-xl font-bold rounded-2xl shadow-lg hover:shadow-indigo-500/30 transition-all transform hover:-translate-y-1"
                        >
                            <Play className="w-6 h-6 mr-2" />
                            게임 시작
                        </button>
                    </div>
                )}

                {gameState === 'playing' && (
                    <div className="w-full h-full flex flex-col animate-fade-in">
                        <div className="flex justify-between items-center mb-6 px-2">
                            <div className="flex items-center space-x-2">
                                <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg font-bold text-gray-700 dark:text-gray-200">
                                    Stage {stage}
                                </span>
                            </div>
                            <div className="flex items-center space-x-2 text-red-500 font-bold text-xl">
                                <Timer className="w-6 h-6" />
                                <span>{timeLeft}s</span>
                            </div>
                        </div>

                        <div
                            className="grid gap-2 w-full aspect-square bg-gray-100 dark:bg-gray-700 p-2 rounded-xl"
                            style={{
                                gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
                                gridTemplateRows: `repeat(${gridSize}, 1fr)`
                            }}
                        >
                            {Array.from({ length: gridSize * gridSize }).map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => handleBoxClick(i)}
                                    className="rounded-lg shadow-sm transition-transform active:scale-95 duration-100"
                                    style={{
                                        backgroundColor: i === diffIndex ? colors.diff : colors.base
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {gameState === 'gameover' && (
                    <div className="text-center animate-scale-in w-full">
                        <Trophy className="w-24 h-24 text-yellow-400 mx-auto mb-4" />
                        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Game Over!</h2>
                        <p className="text-gray-500 dark:text-gray-400 mb-6">최종 스테이지: {stage}</p>

                        <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-2xl mb-8">
                            <h3 className={`text-2xl font-bold mb-2 ${getTier(score).color}`}>
                                {getTier(score).name}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                {getTier(score).desc}
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
                                className="flex items-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/30 transition-all transform hover:-translate-y-1"
                            >
                                <Share2 className="w-5 h-5 mr-2" />
                                점수 공유
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                {/* SEO Content Section */}
                <div className="md:col-span-3 bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6 text-sm text-gray-600 dark:text-gray-400">
                    <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-2">💡 색감 능력 테스트 팁</h3>
                    <p>
                        초반 스테이지는 누구나 쉽게 맞출 수 있지만, 레벨이 올라갈수록 색깔 차이가 미세해집니다.
                        화면 밝기를 높이고, 주변 조명을 어둡게 하면 더 잘 보일 수 있습니다.
                        너무 오래 고민하면 시간이 부족해지니 직감을 믿고 빠르게 클릭하세요!
                    </p>
                </div>
            </div>

            {/* Sparkles Component for re-use if needed */}
            <div style={{ display: 'none' }}>
                <Sparkles />
            </div>
        </div>
    );
};

export default ColorTest;
