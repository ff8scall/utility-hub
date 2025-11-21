import React, { useState, useRef, useEffect } from 'react';
import SEO from '../components/SEO';
import { Zap, RotateCcw, Trophy } from 'lucide-react';
import ShareButtons from '../components/ShareButtons';

const ReactionTest = () => {
    const [gameState, setGameState] = useState('waiting'); // waiting, ready, now, result, too-early
    const [startTime, setStartTime] = useState(0);
    const [reactionTime, setReactionTime] = useState(null);
    const [bestScore, setBestScore] = useState(() => {
        return parseInt(localStorage.getItem('reaction-best')) || null;
    });

    const timeoutRef = useRef(null);

    const startGame = () => {
        setGameState('ready');
        setReactionTime(null);

        const randomDelay = Math.floor(Math.random() * 3000) + 2000; // 2-5 seconds

        timeoutRef.current = setTimeout(() => {
            setGameState('now');
            setStartTime(Date.now());
        }, randomDelay);
    };

    const handleClick = () => {
        if (gameState === 'waiting' || gameState === 'result' || gameState === 'too-early') {
            startGame();
        } else if (gameState === 'ready') {
            clearTimeout(timeoutRef.current);
            setGameState('too-early');
        } else if (gameState === 'now') {
            const endTime = Date.now();
            const time = endTime - startTime;
            setReactionTime(time);
            setGameState('result');

            if (!bestScore || time < bestScore) {
                setBestScore(time);
                localStorage.setItem('reaction-best', time);
            }
        }
    };

    useEffect(() => {
        return () => clearTimeout(timeoutRef.current);
    }, []);

    const getMessage = () => {
        switch (gameState) {
            case 'waiting': return '화면을 클릭하여 시작하세요';
            case 'ready': return '초록색이 되면 클릭하세요!';
            case 'now': return '클릭!!!';
            case 'result': return `${reactionTime}ms`;
            case 'too-early': return '너무 빨라요! 다시 시도하세요';
            default: return '';
        }
    };

    const getBgColor = () => {
        switch (gameState) {
            case 'waiting': return 'bg-blue-500 hover:bg-blue-600';
            case 'ready': return 'bg-red-500';
            case 'now': return 'bg-green-500';
            case 'result': return 'bg-blue-500 hover:bg-blue-600';
            case 'too-early': return 'bg-blue-500 hover:bg-blue-600';
            default: return 'bg-blue-500';
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <SEO
                title="반응속도 테스트 - 순발력 게임 | Utility Hub"
                description="나의 반응속도는 몇 ms일까요? 초록색 화면이 뜰 때 클릭하여 순발력을 테스트해보세요."
                keywords="반응속도, 순발력테스트, 미니게임, 반응속도테스트"
            />

            <div className="text-center space-y-4 py-6">
                <div className="inline-flex items-center justify-center p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-full mb-2">
                    <Zap className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
                </div>
                <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 to-orange-500">
                    반응속도 테스트
                </h1>
                <p className="text-muted-foreground">
                    화면 색상이 초록색으로 바뀌는 순간 최대한 빠르게 클릭하세요!
                </p>
            </div>

            <div
                className={`
                    relative w-full aspect-video md:aspect-[2/1] rounded-2xl shadow-xl 
                    flex flex-col items-center justify-center text-white cursor-pointer 
                    transition-all duration-200 select-none
                    ${getBgColor()}
                `}
                onMouseDown={handleClick}
                onTouchStart={(e) => { e.preventDefault(); handleClick(); }}
            >
                {gameState === 'waiting' && <Zap className="w-16 h-16 mb-4 animate-pulse" />}
                {gameState === 'ready' && <div className="text-6xl font-bold mb-4">...</div>}
                {gameState === 'now' && <div className="text-6xl font-bold mb-4">CLICK!</div>}
                {gameState === 'result' && <div className="text-6xl font-bold mb-4">{reactionTime}ms</div>}
                {gameState === 'too-early' && <div className="text-6xl font-bold mb-4">Wait!</div>}

                <h2 className="text-3xl md:text-4xl font-bold text-center px-4 drop-shadow-md">
                    {getMessage()}
                </h2>

                {gameState === 'result' && (
                    <p className="mt-4 text-lg opacity-90">클릭하여 다시 시작</p>
                )}
            </div>

            {bestScore && (
                <div className="flex justify-center">
                    <div className="bg-card border border-border px-8 py-4 rounded-xl shadow-sm flex items-center gap-4">
                        <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
                            <Trophy className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                        </div>
                        <div className="text-center">
                            <div className="text-sm text-muted-foreground font-medium">최고 기록</div>
                            <div className="text-2xl font-bold">{bestScore}ms</div>
                        </div>
                    </div>
                </div>
            )}

            <div className="mt-8">
                <ShareButtons
                    title="반응속도 테스트"
                    description={`제 반응속도는 ${bestScore ? bestScore + 'ms' : '측정 중'} 입니다! 당신의 순발력은?`}
                />
            </div>
        </div>
    );
};

export default ReactionTest;
