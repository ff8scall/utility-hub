import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Share2, Trophy, RotateCcw, Play, Pause, ChevronLeft, ChevronRight, ChevronUp, ChevronDown } from 'lucide-react';
import SEO from '../components/SEO';
import useShareCanvas from '../hooks/useShareCanvas';

const GRID_SIZE = 20;
const INITIAL_SPEED = 150;
const MIN_SPEED = 60;
const SPEED_INCREMENT = 2;

const SnakeGame = () => {
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
    const [food, setFood] = useState({ x: 15, y: 15 });
    const [direction, setDirection] = useState('RIGHT');
    const [nextDirection, setNextDirection] = useState('RIGHT');
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(
        parseInt(localStorage.getItem('snake-high-score') || '0')
    );
    const [gameState, setGameState] = useState('idle'); // idle, playing, paused, gameover
    const [speed, setSpeed] = useState(INITIAL_SPEED);
    const { shareCanvas } = useShareCanvas();

    // Initialize Game
    const initGame = useCallback(() => {
        setSnake([{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }]);
        setFood(getRandomFood({ x: 10, y: 10 }));
        setDirection('RIGHT');
        setNextDirection('RIGHT');
        setScore(0);
        setSpeed(INITIAL_SPEED);
        setGameState('playing');
    }, []);

    const getRandomFood = (head) => {
        let newFood;
        while (true) {
            newFood = {
                x: Math.floor(Math.random() * GRID_SIZE),
                y: Math.floor(Math.random() * GRID_SIZE)
            };
            // Don't spawn food on snake body or head
            const isOnSnake = snake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
            const isOnHead = head && head.x === newFood.x && head.y === newFood.y;
            if (!isOnSnake && !isOnHead) break;
        }
        return newFood;
    };

    const moveSnake = useCallback(() => {
        if (gameState !== 'playing') return;

        setDirection(nextDirection);
        const head = { ...snake[0] };

        switch (nextDirection) {
            case 'UP': head.y -= 1; break;
            case 'DOWN': head.y += 1; break;
            case 'LEFT': head.x -= 1; break;
            case 'RIGHT': head.x += 1; break;
            default: break;
        }

        // Collision Check (Walls)
        if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
            handleGameOver();
            return;
        }

        // Collision Check (Self)
        if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
            handleGameOver();
            return;
        }

        const newSnake = [head, ...snake];

        // Food Check
        if (head.x === food.x && head.y === food.y) {
            setScore(prev => {
                const newScore = prev + 10;
                if (newScore > highScore) {
                    setHighScore(newScore);
                    localStorage.setItem('snake-high-score', newScore.toString());
                }
                return newScore;
            });
            setFood(getRandomFood(head));
            setSpeed(prev => Math.max(MIN_SPEED, prev - SPEED_INCREMENT));
        } else {
            newSnake.pop();
        }

        setSnake(newSnake);
    }, [snake, food, nextDirection, gameState, highScore]);

    const handleGameOver = () => {
        setGameState('gameover');
    };

    // Game Loop
    useEffect(() => {
        if (gameState === 'playing') {
            const interval = setInterval(moveSnake, speed);
            return () => clearInterval(interval);
        }
    }, [moveSnake, gameState, speed]);

    // Keyboard Input
    useEffect(() => {
        const handleKeyDown = (e) => {
            switch (e.key) {
                case 'ArrowUp':
                    if (direction !== 'DOWN') setNextDirection('UP');
                    break;
                case 'ArrowDown':
                    if (direction !== 'UP') setNextDirection('DOWN');
                    break;
                case 'ArrowLeft':
                    if (direction !== 'RIGHT') setNextDirection('LEFT');
                    break;
                case 'ArrowRight':
                    if (direction !== 'LEFT') setNextDirection('RIGHT');
                    break;
                case ' ': // Space to pause/start
                    if (gameState === 'playing') setGameState('paused');
                    else if (gameState === 'paused' || gameState === 'idle') setGameState('playing');
                    break;
                default: break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [direction, gameState]);

    // Rendering
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        const cellSize = width / GRID_SIZE;

        // Clear
        ctx.fillStyle = '#0f172a'; // slate-900
        ctx.fillRect(0, 0, width, height);

        // Draw Grid (Subtle)
        ctx.strokeStyle = '#1e293b'; // slate-800
        ctx.lineWidth = 0.5;
        for (let i = 0; i <= GRID_SIZE; i++) {
            ctx.beginPath();
            ctx.moveTo(i * cellSize, 0);
            ctx.lineTo(i * cellSize, height);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(0, i * cellSize);
            ctx.lineTo(width, i * cellSize);
            ctx.stroke();
        }

        // Draw Food
        ctx.fillStyle = '#f43f5e'; // rose-500
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#f43f5e';
        ctx.beginPath();
        ctx.arc(
            food.x * cellSize + cellSize / 2,
            food.y * cellSize + cellSize / 2,
            cellSize / 2.5,
            0,
            Math.PI * 2
        );
        ctx.fill();
        ctx.shadowBlur = 0;

        // Draw Snake
        snake.forEach((segment, index) => {
            const isHead = index === 0;
            ctx.fillStyle = isHead ? '#10b981' : '#34d399'; // emerald-500 : emerald-400

            if (isHead) {
                ctx.shadowBlur = 10;
                ctx.shadowColor = '#10b981';
            }

            // Body segments are rounded
            const r = cellSize / 4;
            const x = segment.x * cellSize + 1;
            const y = segment.y * cellSize + 1;
            const w = cellSize - 2;
            const h = cellSize - 2;

            ctx.beginPath();
            ctx.moveTo(x + r, y);
            ctx.arcTo(x + w, y, x + w, y + h, r);
            ctx.arcTo(x + w, y + h, x, y + h, r);
            ctx.arcTo(x, y + h, x, y, r);
            ctx.arcTo(x, y, x + w, y, r);
            ctx.closePath();
            ctx.fill();
            ctx.shadowBlur = 0;

            // Draw Eyes on Head
            if (isHead) {
                ctx.fillStyle = 'white';
                const eyeSize = cellSize / 8;
                const offset = cellSize / 4;

                let eye1 = { x: 0, y: 0 };
                let eye2 = { x: 0, y: 0 };

                if (direction === 'RIGHT') {
                    eye1 = { x: x + w - offset, y: y + offset };
                    eye2 = { x: x + w - offset, y: y + h - offset };
                } else if (direction === 'LEFT') {
                    eye1 = { x: x + offset, y: y + offset };
                    eye2 = { x: x + offset, y: y + h - offset };
                } else if (direction === 'UP') {
                    eye1 = { x: x + offset, y: y + offset };
                    eye2 = { x: x + w - offset, y: y + offset };
                } else {
                    eye1 = { x: x + offset, y: y + h - offset };
                    eye2 = { x: x + w - offset, y: y + h - offset };
                }

                ctx.beginPath();
                ctx.arc(eye1.x, eye1.y, eyeSize, 0, Math.PI * 2);
                ctx.arc(eye2.x, eye2.y, eyeSize, 0, Math.PI * 2);
                ctx.fill();
            }
        });
    }, [snake, food, direction]);

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <SEO
                title="스네이크 게임 - 클래식 뱀 게임"
                description="먹이를 먹고 점점 길어지는 클래식 스네이크 게임을 즐겨보세요. 당신의 한계에 도전하고 기록을 공유하세요!"
                keywords="스네이크게임, 뱀게임, 클래식게임, 미니게임, 무료게임, snake game"
            />

            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold">스네이크 게임</h1>
                <p className="text-muted-foreground">키보드 방향키를 사용하여 뱀을 조종하세요</p>
            </div>

            <div className="flex justify-between items-center bg-card p-4 rounded-xl border border-border shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="text-center">
                        <div className="text-xs text-muted-foreground uppercase font-bold">SCORE</div>
                        <div className="text-2xl font-mono font-bold text-primary">{score}</div>
                    </div>
                    <div className="text-center">
                        <div className="text-xs text-muted-foreground uppercase font-bold flex items-center gap-1 justify-center">
                            <Trophy size={12} className="text-yellow-500" /> BEST
                        </div>
                        <div className="text-2xl font-mono font-bold">{highScore}</div>
                    </div>
                </div>
                <div className="flex gap-2">
                    {gameState === 'playing' ? (
                        <button
                            onClick={() => setGameState('paused')}
                            className="p-3 bg-secondary hover:bg-secondary/80 rounded-lg transition-colors"
                        >
                            <Pause size={20} />
                        </button>
                    ) : gameState === 'paused' ? (
                        <button
                            onClick={() => setGameState('playing')}
                            className="p-3 bg-primary text-primary-foreground rounded-lg transition-colors"
                        >
                            <Play size={20} />
                        </button>
                    ) : null}
                    <button
                        onClick={initGame}
                        className="p-3 bg-secondary hover:bg-secondary/80 rounded-lg transition-colors"
                        title="새 게임"
                    >
                        <RotateCcw size={20} />
                    </button>
                </div>
            </div>

            <div className="relative group flex flex-col items-center" ref={containerRef}>
                <div className="relative bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border-4 border-slate-800">
                    <canvas
                        ref={canvasRef}
                        width={400}
                        height={400}
                        className="block max-w-full h-auto"
                        style={{ aspectRatio: '1/1' }}
                    />

                    {/* Overlays */}
                    {gameState === 'idle' && (
                        <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-300">
                            <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mb-6 animate-pulse">
                                <Play size={40} className="text-emerald-500 ml-1" />
                            </div>
                            <h2 className="text-2xl font-bold mb-4">준비되셨나요?</h2>
                            <button
                                onClick={initGame}
                                className="px-8 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition-all hover:scale-105 active:scale-95 shadow-lg shadow-emerald-500/20"
                            >
                                시작하기
                            </button>
                            <p className="mt-4 text-sm text-slate-400">또는 스페이스바를 누르세요</p>
                        </div>
                    )}

                    {gameState === 'paused' && (
                        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm flex flex-col items-center justify-center animate-in fade-in duration-200">
                            <div className="p-4 bg-white/10 rounded-full mb-4">
                                <Pause size={48} className="text-white" />
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-6">일시 정지</h2>
                            <button
                                onClick={() => setGameState('playing')}
                                className="px-8 py-3 bg-white text-slate-900 font-bold rounded-xl hover:bg-slate-100 transition-all"
                            >
                                계속하기
                            </button>
                        </div>
                    )}

                    {gameState === 'gameover' && (
                        <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center animate-in zoom-in duration-300">
                            <h2 className="text-4xl font-black text-rose-500 mb-2">GAME OVER</h2>
                            <p className="text-slate-400 mb-6">수고하셨습니다!</p>

                            <div className="bg-slate-800/50 rounded-2xl p-6 mb-8 w-full max-w-[240px]">
                                <div className="text-xs text-slate-500 font-bold uppercase mb-1">최종 점수</div>
                                <div className="text-4xl font-mono font-black text-white">{score}</div>
                            </div>

                            <div className="flex flex-col gap-3 w-full max-w-[240px]">
                                <button
                                    onClick={initGame}
                                    className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
                                >
                                    <RotateCcw size={20} />
                                    다시 도전하기
                                </button>
                                <button
                                    onClick={() => shareCanvas(containerRef.current, '스네이크 게임', score)}
                                    className="w-full py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                                >
                                    <Share2 size={18} />
                                    결과 공유하기
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Mobile Controls */}
                <div className="grid grid-cols-3 gap-2 mt-8 md:hidden">
                    <div />
                    <button
                        onClick={() => direction !== 'DOWN' && setNextDirection('UP')}
                        className="w-14 h-14 bg-slate-800 rounded-xl flex items-center justify-center active:bg-slate-700"
                    >
                        <ChevronUp size={32} />
                    </button>
                    <div />
                    <button
                        onClick={() => direction !== 'RIGHT' && setNextDirection('LEFT')}
                        className="w-14 h-14 bg-slate-800 rounded-xl flex items-center justify-center active:bg-slate-700"
                    >
                        <ChevronLeft size={32} />
                    </button>
                    <button
                        onClick={() => direction !== 'UP' && setNextDirection('DOWN')}
                        className="w-14 h-14 bg-slate-800 rounded-xl flex items-center justify-center active:bg-slate-700"
                    >
                        <ChevronDown size={32} />
                    </button>
                    <button
                        onClick={() => direction !== 'LEFT' && setNextDirection('RIGHT')}
                        className="w-14 h-14 bg-slate-800 rounded-xl flex items-center justify-center active:bg-slate-700"
                    >
                        <ChevronRight size={32} />
                    </button>
                </div>
            </div>

            <div className="card p-6 bg-slate-50 dark:bg-slate-900/50">
                <h3 className="font-bold mb-3 flex items-center gap-2">
                    <RotateCcw size={18} className="text-primary" />
                    게임 방법
                </h3>
                <ul className="text-sm space-y-2 text-muted-foreground">
                    <li>• <strong>방향키</strong>: 뱀의 이동 방향을 조종합니다.</li>
                    <li>• <strong>먹이(빨간색 루비)</strong>: 먹이를 먹으면 점수가 10점 올라가고 몸이 길어집니다.</li>
                    <li>• <strong>속도</strong>: 먹이를 먹을수록 뱀의 이동 속도가 조금씩 빨라집니다.</li>
                    <li>• <strong>게임 오버</strong>: 벽에 부딪히거나 자신의 몸에 부딪히면 게임이 종료됩니다.</li>
                    <li>• <strong>공유</strong>: 높은 점수를 기록하고 친구들에게 자랑해보세요!</li>
                </ul>
            </div>
        </div>
    );
};

export default SnakeGame;
