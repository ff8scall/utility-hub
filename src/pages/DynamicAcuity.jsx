import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { Share2, RefreshCw, Eye, Play, ArrowRight, Zap } from 'lucide-react';

const DynamicAcuity = () => {
    const [gameState, setGameState] = useState('start'); // start, ready, moving, input, result
    const [level, setLevel] = useState(1);
    const [score, setScore] = useState(0);
    const [targetNumber, setTargetNumber] = useState(null);
    const [inputValue, setInputValue] = useState('');
    const [animationDuration, setAnimationDuration] = useState(2000); // ms
    const [feedback, setFeedback] = useState(null); // correct, wrong

    const inputRef = useRef(null);

    const startGame = () => {
        setGameState('ready');
        setLevel(1);
        setScore(0);
        setAnimationDuration(2000);
        setFeedback(null);
    };

    const startLevel = () => {
        setGameState('ready');
        setInputValue('');
        setFeedback(null);

        // Generate random 3-digit number
        const randomNum = Math.floor(100 + Math.random() * 900);
        setTargetNumber(randomNum);

        setTimeout(() => {
            setGameState('moving');
        }, 1000); // 1 sec ready
    };

    // Auto-transition from moving to input
    useEffect(() => {
        if (gameState === 'moving') {
            const timer = setTimeout(() => {
                setGameState('input');
                setTimeout(() => inputRef.current?.focus(), 100);
            }, animationDuration);
            return () => clearTimeout(timer);
        }
    }, [gameState, animationDuration]);

    useEffect(() => {
        if (gameState === 'ready') {
            // Maybe show countdown?
        }
    }, [gameState]);

    const checkAnswer = () => {
        if (parseInt(inputValue) === targetNumber) {
            setFeedback('correct');
            setScore(prev => prev + 10 * level);

            setTimeout(() => {
                if (level < 10) {
                    setLevel(prev => prev + 1);
                    setAnimationDuration(prev => Math.max(200, prev * 0.7)); // Increase speed significantly
                    startLevel(); // recursiveish
                } else {
                    setGameState('result');
                }
            }, 1000);
        } else {
            setFeedback('wrong');
            setTimeout(() => {
                setGameState('result');
            }, 1000);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            checkAnswer();
        }
    };

    const getRank = (finalScore) => {
        if (finalScore >= 500) return { title: "매의 눈", desc: "엄청난 동체 시력입니다! 프로게이머급이네요.", color: "text-purple-600" };
        if (finalScore >= 300) return { title: "야생의 맹수", desc: "움직이는 물체를 놓치지 않는군요.", color: "text-blue-600" };
        if (finalScore >= 100) return { title: "일반인", desc: "평범한 동체 시력입니다.", color: "text-green-600" };
        return { title: "안경 추천", desc: "안과 검진을 받아보시는 게...?", color: "text-gray-500" };
    };

    const shareResult = () => {
        const rank = getRank(score);
        if (navigator.share) {
            navigator.share({
                title: '동체 시력 테스트',
                text: `나의 동체 시력 레벨: ${level}단계 (${score}점) - 타랭크: ${rank.title} | 유틸리티 허브`,
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
                <title>동체 시력 테스트 | 순식간에 지나가는 숫자를 맞춰라 - Utility Hub</title>
                <meta name="description" content="화면을 빠르게 지나가는 숫자를 읽을 수 있나요? 야구 선수, 카레이서에게 필요한 동체 시력을 테스트해보세요." />
                <meta name="keywords" content="동체시력, 시력테스트, 눈건강, 순발력, 게임, visual acuity" />
            </Helmet>

            <div className="text-center mb-10">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4 animate-fade-in">
                    👁️ 동체 시력 테스트
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300">
                    순식간에 지나가는 숫자를 캐치해보세요!
                </p>
            </div>

            <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden min-h-[400px] flex flex-col relative border-4 border-gray-100 dark:border-gray-700">

                {/* Game Screen */}
                <div className="flex-1 relative flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900 overflow-hidden">

                    {gameState === 'start' && (
                        <div className="text-center z-10 animate-fade-in">
                            <Zap className="w-24 h-24 text-yellow-500 mx-auto mb-6" />
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">눈을 크게 뜨세요!</h2>
                            <p className="text-gray-600 dark:text-gray-400 mb-8">
                                숫자가 왼쪽에서 오른쪽으로 빠르게 지나갑니다.<br />
                                단계를 거듭할수록 점점 빨라집니다.
                            </p>
                            <button
                                onClick={() => startLevel()}
                                className="px-8 py-4 bg-yellow-500 hover:bg-yellow-600 text-white text-xl font-bold rounded-2xl shadow-lg transition-transform hover:scale-105 flex items-center mx-auto"
                            >
                                <Play className="w-6 h-6 mr-2" fill="currentColor" />
                                테스트 시작
                            </button>
                        </div>
                    )}

                    {gameState === 'ready' && (
                        <div className="text-4xl font-bold text-gray-400 animate-pulse">
                            Ready...
                        </div>
                    )}

                    {gameState === 'moving' && (
                        <div
                            className="absolute text-5xl md:text-7xl font-black text-gray-800 dark:text-white top-1/2 transform -translate-y-1/2 whitespace-nowrap"
                            style={{
                                animation: `moveRight ${animationDuration}ms linear forwards`
                            }}
                        >
                            {targetNumber}
                        </div>
                    )}

                    {gameState === 'input' && (
                        <div className="text-center w-full max-w-xs animate-scale-in">
                            <h3 className="text-xl font-bold text-gray-600 dark:text-gray-300 mb-4">어떤 숫자였나요?</h3>
                            <input
                                ref={inputRef}
                                type="number"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={handleKeyDown}
                                className="w-full text-center text-3xl font-bold py-3 border-b-4 border-indigo-500 bg-transparent focus:outline-none mb-6 dark:text-white"
                                placeholder="???"
                            />
                            <button
                                onClick={checkAnswer}
                                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors"
                            >
                                확인
                            </button>
                        </div>
                    )}

                    {feedback && (
                        <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-black/80 z-20">
                            <div className={`text-6xl font-black ${feedback === 'correct' ? 'text-green-500' : 'text-red-500'}`}>
                                {feedback === 'correct' ? 'O' : 'X'}
                                {feedback === 'wrong' && (
                                    <div className="text-2xl mt-4 text-gray-800 dark:text-white">
                                        정답: {targetNumber}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {gameState === 'result' && (
                        <div className="text-center z-10 animate-scale-in w-full p-8">
                            <Eye className="w-20 h-20 text-indigo-500 mx-auto mb-4" />
                            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">테스트 종료</h2>

                            <div className="mb-8">
                                <span className="text-gray-500 dark:text-gray-400">최종 레벨</span>
                                <div className="text-6xl font-black text-indigo-600 dark:text-indigo-400 my-2">
                                    Lv.{level}
                                </div>
                                <div className="text-xl font-bold text-gray-500">점수: {score}</div>
                            </div>

                            <div className="bg-gray-100 dark:bg-gray-700 p-6 rounded-2xl mb-8">
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
                                    className="flex items-center px-6 py-3 bg-white border border-gray-200 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:hover:bg-gray-700 text-gray-800 dark:text-white rounded-xl font-bold transition-all"
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

                    {/* Arrow Guide */}
                    {['start', 'ready', 'moving'].includes(gameState) && (
                        <div className="absolute inset-x-0 top-1/2 h-px bg-red-500/20 pointer-events-none"></div>
                    )}
                </div>
            </div>

            <style>{`
                @keyframes moveRight {
                    0% { transform: translate(-50%, -50%); left: -10%; }
                    100% { transform: translate(-50%, -50%); left: 110%; }
                }
            `}</style>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                {/* SEO Content Section */}
                <div className="md:col-span-3 bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6 text-sm text-gray-600 dark:text-gray-400">
                    <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-2">💡 동체 시력(Dynamic Visual Acuity)이란?</h3>
                    <p>
                        움직이는 물체를 정확하고 빠르게 인지하는 능력입니다. 운전 중 위험 요소를 발견하거나, 스포츠 경기에서 공의 궤적을 쫓는 데 필수적인 능력입니다.
                        일반적으로 시력 검사표로 측정하는 '정지 시력'과는 다릅니다. 꾸준한 훈련을 통해 향상시킬 수 있다고 알려져 있습니다.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default DynamicAcuity;
