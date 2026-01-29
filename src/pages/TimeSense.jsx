import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { Share2, RefreshCw, Timer, Play, Pause, Trophy, Clock } from 'lucide-react';

const TimeSense = () => {
    const [gameState, setGameState] = useState('idle'); // idle, running, stopped
    const [startTime, setStartTime] = useState(0);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [displayTime, setDisplayTime] = useState('0.00');
    const [targetTime, setTargetTime] = useState(10.00);
    const timerRef = useRef(null);

    const startGame = () => {
        setGameState('running');
        setStartTime(Date.now());
        setElapsedTime(0);
        setDisplayTime('0.00');

        timerRef.current = setInterval(() => {
            const now = Date.now();
            const elapsed = (now - startTime) / 1000;
            // Only update display for the first 3 seconds to let user know it's working
            // Then hide it (???) or just blur it. 
            // Better UX: Show timer counting up, then hide it after 2-3 seconds with a "Hidden" message
            // or just kept hidden from start? 
            // Let's hide it after 3 seconds for difficulty.
        }, 10);
    };

    // Actually, react state inside interval is tricky with stale closures if we use state directly.
    // Let's use requestAnimationFrame for display updates or just update on stop.
    // For this game "Hidden Timer", we don't need to update UI while running except maybe a "Running..." indicator.

    const handleStart = () => {
        setGameState('running');
        setStartTime(Date.now());
        setDisplayTime('0.00');

        // Clear any existing timer
        if (timerRef.current) clearInterval(timerRef.current);

        // Update display for first 3 seconds
        timerRef.current = setInterval(() => {
            const currentElapsed = (Date.now() - startTime) / 1000;
            // We can't access updated startTime here easily without ref, but Date.now() is fine.
            // Wait, startTime is state. 
            // We need to capture the start timestamp in a ref or use functional update if we want exactness, 
            // but here we just need visually 3 seconds
        }, 100);
    };

    // Revised Logic
    const [visualTime, setVisualTime] = useState(0);

    useEffect(() => {
        let animationFrame;

        if (gameState === 'running') {
            const start = Date.now();
            const tick = () => {
                const now = Date.now();
                const elapsed = (now - start) / 1000;
                setVisualTime(elapsed);

                if (elapsed < 3.0) {
                    setDisplayTime(elapsed.toFixed(2));
                } else {
                    setDisplayTime('?.??');
                }

                animationFrame = requestAnimationFrame(tick);
            };
            animationFrame = requestAnimationFrame(tick);
        }

        return () => cancelAnimationFrame(animationFrame);
    }, [gameState]);

    const handleStop = () => {
        const stopTime = Date.now();
        const finalElapsed = (stopTime - startTime) / 1000; // Recalculate precisely from start
        // Wait, startInEffect was different from handleStart logic. 
        // Let's unify.

        // Actually simplest is just:
        // When running, we track start time in REF to avoid re-renders impacting precision if possible, 
        // but state is fine for simple game.
        // Let's use the effect above for visual, but calculate final score based on precise diff.

        // If we use the visualTime state, it might be slightly off due to frame timing.
        // Better to use Date.now() diff.
    };

    // Refactored clean implementation
    const [showHint, setShowHint] = useState(true);

    const start = () => {
        setGameState('running');
        setStartTime(Date.now());
        setShowHint(true);
    };

    const stop = () => {
        const now = Date.now();
        const elapsed = (now - startTime) / 1000;
        setElapsedTime(elapsed);
        setGameState('stopped');
        setDisplayTime(elapsed.toFixed(2));
    };

    // Visual update effect
    useEffect(() => {
        let interval;
        if (gameState === 'running') {
            interval = setInterval(() => {
                const now = Date.now();
                const current = (now - startTime) / 1000;

                if (current < 3.0) {
                    setDisplayTime(current.toFixed(2));
                } else {
                    setDisplayTime('?.??');
                    setShowHint(false);
                }
            }, 30);
        }
        return () => clearInterval(interval);
    }, [gameState, startTime]);

    const getRank = (time) => {
        const diff = Math.abs(time - targetTime);
        if (diff === 0) return { rank: "GOD", desc: "당신은 시간의 신인가요?", color: "text-purple-600" };
        if (diff <= 0.05) return { rank: "SSS", desc: "소름돋는 정확도! 인간 시계입니다.", color: "text-red-500" };
        if (diff <= 0.1) return { rank: "S", desc: "칼 같은 타이밍! 아주 훌륭해요.", color: "text-orange-500" };
        if (diff <= 0.3) return { rank: "A", desc: "꽤 정확한 편이네요!", color: "text-green-600" };
        if (diff <= 0.5) return { rank: "B", desc: "평범한 감각입니다. 조금 더 집중해보세요.", color: "text-blue-500" };
        if (diff <= 1.0) return { rank: "C", desc: "시간이 꽤 흘렀네요...", color: "text-gray-500" };
        return { rank: "F", desc: "시간 개념이... 없으신가요? 😅", color: "text-gray-400" };
    };

    const diff = Math.abs(elapsedTime - targetTime).toFixed(2);
    const result = getRank(elapsedTime);

    const shareResult = () => {
        if (navigator.share) {
            navigator.share({
                title: '절대 시간 감각 테스트',
                text: `나의 기록: ${elapsedTime.toFixed(2)}초 (오차 ${diff}초) - 랭크 ${result.rank} | 유틸리티 허브`,
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
                <title>절대 시간 감각 테스트 | 10초 맞추기 게임 - Utility Hub</title>
                <meta name="description" content="시계 없이 정확히 10.00초를 맞춰보세요! 당신의 체감 시간은 실제 시간과 얼마나 다를까요? 초정밀 시간 감각 테스트." />
                <meta name="keywords" content="시간감각, 10초맞추기, 타이머게임, 절대시간, 시간맞추기, 감각테스트" />
            </Helmet>

            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4 animate-fade-in">
                    ⏱️ 절대 시간 감각 테스트
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300">
                    눈을 감고 마음속으로 10초를 세어보세요.
                </p>
            </div>

            <div className="max-w-xl mx-auto bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden p-8 transition-all duration-300 min-h-[400px] flex flex-col justify-center items-center">

                <div className="mb-12 text-center">
                    <span className="text-sm font-bold text-gray-400 tracking-widest uppercase mb-2 block">Target Time</span>
                    <div className="text-6xl font-black text-indigo-500 dark:text-indigo-400 font-mono">
                        {targetTime.toFixed(2)}<span className="text-3xl">s</span>
                    </div>
                </div>

                <div className="w-64 h-64 rounded-full border-8 border-gray-100 dark:border-gray-700 flex items-center justify-center mb-10 relative">
                    {/* Timer Display */}
                    <div className={`text-5xl font-bold font-mono transition-all duration-300 ${gameState === 'stopped' ? (Math.abs(elapsedTime - targetTime) <= 0.1 ? 'text-green-500 scale-110' : 'text-red-500') : 'text-gray-800 dark:text-white'}`}>
                        {displayTime}<span className="text-2xl ml-1">s</span>
                    </div>

                    {/* Progress Ring Animation (Optional) */}
                    {gameState === 'running' && (
                        <div className="absolute inset-0 rounded-full border-8 border-t-indigo-500 border-r-transparent border-b-transparent border-l-transparent animate-spin-slow opacity-30"></div>
                    )}
                </div>

                {gameState === 'idle' && (
                    <button
                        onClick={start}
                        className="w-full max-w-xs py-4 bg-indigo-600 hover:bg-indigo-700 text-white text-xl font-bold rounded-2xl shadow-lg shadow-indigo-500/30 transition-all transform hover:-translate-y-1 flex items-center justify-center"
                    >
                        <Play className="w-6 h-6 mr-2" fill="currentColor" />
                        시작하기
                    </button>
                )}

                {gameState === 'running' && (
                    <div className="text-center w-full">
                        <p className="text-sm text-gray-400 mb-6 animate-pulse">
                            {showHint ? "3초 후에 타이머가 사라집니다..." : "마음속으로 10초를 세세요!"}
                        </p>
                        <button
                            onClick={stop}
                            className="w-full max-w-xs py-4 bg-red-500 hover:bg-red-600 text-white text-xl font-bold rounded-2xl shadow-lg shadow-red-500/30 transition-all transform active:scale-95 flex items-center justify-center mx-auto"
                        >
                            <Pause className="w-6 h-6 mr-2" fill="currentColor" />
                            멈춤 (STOP)
                        </button>
                    </div>
                )}

                {gameState === 'stopped' && (
                    <div className="text-center animate-scale-in w-full">
                        <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-2xl mb-8">
                            <div className="flex items-center justify-center gap-2 mb-2">
                                <span className="text-gray-500 dark:text-gray-400">오차</span>
                                <span className="font-bold font-mono text-xl">{diff}초</span>
                            </div>
                            <h3 className={`text-4xl font-black mb-2 ${result.color}`}>
                                {result.rank} <span className="text-lg font-bold text-gray-400">등급</span>
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                {result.desc}
                            </p>
                        </div>

                        <div className="flex gap-4 justify-center">
                            <button
                                onClick={() => setGameState('idle')}
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
                    <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-2">💡 절대 시간 감각(Absolute Time Sense)이란?</h3>
                    <p>
                        시계나 외부의 도움 없이 시간의 흐름을 정확하게 인지하는 능력을 말합니다.
                        일반적으로 사람들은 10초를 짐작할 때 실제보다 빠르게 세거나 느리게 세는 경향이 있습니다.
                        이 테스트를 통해 자신의 바이오리듬과 시간 감각이 얼마나 정확한지 확인해보세요. 집중력 향상에도 도움이 됩니다.
                    </p>
                </div>
            </div>

            <style>{`
                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-spin-slow {
                    animation: spin-slow 10s linear infinite;
                }
            `}</style>
        </div>
    );
};

export default TimeSense;
