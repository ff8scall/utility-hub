import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Share2, Trophy, RotateCcw, Play, ArrowDown } from 'lucide-react';
import SEO from '../components/SEO';
import useShareCanvas from '../hooks/useShareCanvas';

const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 600;
const BLOCK_HEIGHT = 40;
const INITIAL_WIDTH = 200;
const INITIAL_SPEED = 2.5;
const SPEED_INCREMENT = 0.05;

const TowerStacker = () => {
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const requestRef = useRef();
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(
        parseInt(localStorage.getItem('stacker-high-score') || '0')
    );
    const [gameState, setGameState] = useState('idle'); // idle, playing, gameover
    const { shareCanvas } = useShareCanvas();

    // Game state refs (to avoid stale closures in RAF)
    const stateRef = useRef({
        blocks: [],
        currentBlock: { x: 0, y: 0, w: INITIAL_WIDTH, speed: INITIAL_SPEED, dir: 1 },
        cameraY: 0,
        targetCameraY: 0,
        hue: 200,
    });

    const initGame = useCallback(() => {
        stateRef.current = {
            blocks: [
                { x: (CANVAS_WIDTH - INITIAL_WIDTH) / 2, y: CANVAS_HEIGHT - BLOCK_HEIGHT, w: INITIAL_WIDTH, color: 'hsl(200, 70%, 50%)' }
            ],
            currentBlock: {
                x: 0,
                y: CANVAS_HEIGHT - BLOCK_HEIGHT * 2,
                w: INITIAL_WIDTH,
                speed: INITIAL_SPEED,
                dir: 1
            },
            cameraY: 0,
            targetCameraY: 0,
            hue: 200,
        };
        setScore(0);
        setGameState('playing');
    }, []);

    const handleAction = useCallback(() => {
        if (gameState === 'idle') {
            initGame();
            return;
        }
        if (gameState !== 'playing') return;

        const { blocks, currentBlock, hue } = stateRef.current;
        const lastBlock = blocks[blocks.length - 1];

        // Calculate overlap
        const delta = currentBlock.x - lastBlock.x;
        const overlap = currentBlock.w - Math.abs(delta);

        if (overlap <= 0) {
            setGameState('gameover');
            return;
        }

        // Perfect match bonus (if delta is very small)
        let newWidth = overlap;
        let finalX = delta > 0 ? lastBlock.x + delta : currentBlock.x;

        if (Math.abs(delta) < 5) {
            newWidth = lastBlock.w;
            finalX = lastBlock.x;
            // Visual feedback for perfect could be added
        }

        // Add block to stack
        const newBlock = {
            x: finalX,
            y: currentBlock.y,
            w: newWidth,
            color: `hsl(${hue}, 70%, 50%)`
        };
        stateRef.current.blocks.push(newBlock);

        // Update score
        const newScore = blocks.length - 1;
        setScore(newScore);
        if (newScore > highScore) {
            setHighScore(newScore);
            localStorage.setItem('stacker-high-score', newScore.toString());
        }

        // Prepare next block
        const nextY = currentBlock.y - BLOCK_HEIGHT;
        const nextSpeed = INITIAL_SPEED + (newScore * SPEED_INCREMENT);
        stateRef.current.currentBlock = {
            x: Math.random() > 0.5 ? -newWidth : CANVAS_WIDTH,
            y: nextY,
            w: newWidth,
            speed: nextSpeed,
            dir: finalX < 0 ? 1 : (finalX + newWidth > CANVAS_WIDTH ? -1 : (Math.random() > 0.5 ? 1 : -1))
        };

        // Update color
        stateRef.current.hue = (hue + 10) % 360;

        // Update camera
        if (newScore > 5) {
            stateRef.current.targetCameraY = (newScore - 5) * BLOCK_HEIGHT;
        }
    }, [gameState, highScore, initGame]);

    const animate = useCallback((time) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const state = stateRef.current;

        // Move current block
        if (gameState === 'playing') {
            state.currentBlock.x += state.currentBlock.speed * state.currentBlock.dir;
            if (state.currentBlock.x + state.currentBlock.w > CANVAS_WIDTH) {
                state.currentBlock.dir = -1;
            } else if (state.currentBlock.x < 0) {
                state.currentBlock.dir = 1;
            }
        }

        // Smooth camera
        state.cameraY += (state.targetCameraY - state.cameraY) * 0.1;

        // Clear
        ctx.fillStyle = '#f8fafc'; // slate-50
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        ctx.save();
        ctx.translate(0, state.cameraY);

        // Draw blocks
        state.blocks.forEach((b, i) => {
            // Draw shadow/side for 3D effect
            ctx.fillStyle = b.color.replace('50%', '40%');
            ctx.fillRect(b.x + 4, b.y + 4, b.w, BLOCK_HEIGHT);

            // Draw main block
            ctx.fillStyle = b.color;
            ctx.fillRect(b.x, b.y, b.w, BLOCK_HEIGHT);

            // Highlight top
            ctx.fillStyle = 'rgba(255,255,255,0.2)';
            ctx.fillRect(b.x, b.y, b.w, 4);
        });

        // Draw current moving block
        if (gameState === 'playing') {
            const b = state.currentBlock;
            ctx.fillStyle = `hsl(${state.hue}, 70%, 50%)`;
            ctx.fillRect(b.x, b.y, b.w, BLOCK_HEIGHT);
            ctx.fillStyle = 'rgba(255,255,255,0.2)';
            ctx.fillRect(b.x, b.y, b.w, 4);
        }

        ctx.restore();

        requestRef.current = requestAnimationFrame(animate);
    }, [gameState]);

    useEffect(() => {
        requestRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(requestRef.current);
    }, [animate]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.code === 'Space' || e.code === 'Enter') {
                e.preventDefault();
                handleAction();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleAction]);

    return (
        <div className="max-w-2xl mx-auto space-y-6 select-none">
            <SEO
                title="탑 쌓기 - 타이밍 액션 게임"
                description="정확한 타이밍에 블록을 쌓아 높은 탑을 만드세요! 당신의 집중력을 테스트하고 최고 기록을 공유하세요."
                keywords="탑쌓기, 타워빌더, 타이밍게임, 미니게임, 무료게임, tower stacker"
            />

            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold">탑 쌓기</h1>
                <p className="text-muted-foreground">화면을 클릭하거나 스페이스바를 눌러 블록을 쌓으세요</p>
            </div>

            <div className="flex justify-between items-center bg-card p-4 rounded-xl border border-border shadow-sm">
                <div className="flex items-center gap-6">
                    <div className="text-center">
                        <div className="text-xs text-muted-foreground uppercase font-bold">현재 층수</div>
                        <div className="text-3xl font-black text-primary">{score}F</div>
                    </div>
                    <div className="text-center">
                        <div className="text-xs text-muted-foreground uppercase font-bold flex items-center gap-1">
                            <Trophy size={14} className="text-yellow-500" /> 최고 기록
                        </div>
                        <div className="text-3xl font-black">{highScore}F</div>
                    </div>
                </div>
                <button
                    onClick={initGame}
                    className="p-3 bg-secondary hover:bg-secondary/80 rounded-xl transition-colors"
                >
                    <RotateCcw size={20} />
                </button>
            </div>

            <div
                className="relative group flex flex-col items-center cursor-pointer touch-manipulation"
                ref={containerRef}
                onClick={handleAction}
            >
                <div className="relative bg-white rounded-3xl overflow-hidden shadow-2xl border-8 border-slate-100 dark:border-slate-800 h-[500px] w-full max-w-[400px]">
                    <canvas
                        ref={canvasRef}
                        width={CANVAS_WIDTH}
                        height={CANVAS_HEIGHT}
                        className="block w-full h-full object-cover"
                    />

                    {/* Overlays */}
                    {gameState === 'idle' && (
                        <div className="absolute inset-0 bg-white/40 backdrop-blur-sm flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-500">
                            <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mb-6 animate-bounce">
                                <ArrowDown size={40} className="text-primary" />
                            </div>
                            <h2 className="text-2xl font-bold mb-4 text-slate-800">탑을 높이 쌓아보세요!</h2>
                            <button
                                onClick={(e) => { e.stopPropagation(); initGame(); }}
                                className="px-10 py-4 bg-primary text-primary-foreground font-black rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 transition-transform active:scale-95"
                            >
                                시작하기
                            </button>
                        </div>
                    )}

                    {gameState === 'gameover' && (
                        <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center animate-in zoom-in duration-300">
                            <div className="text-rose-500 mb-2">
                                <Trophy size={64} className="mx-auto opacity-20 absolute -translate-y-4 -translate-x-4 scale-150 rotate-12" />
                                <h2 className="text-5xl font-black relative">FAILED</h2>
                            </div>
                            <p className="text-slate-400 mb-8">블록을 놓쳤습니다!</p>

                            <div className="bg-white/10 rounded-3xl p-8 mb-8 w-full max-w-[240px]">
                                <div className="text-xs text-slate-500 font-bold uppercase mb-1">최종 높이</div>
                                <div className="text-5xl font-black text-white">{score}<span className="text-xl">F</span></div>
                            </div>

                            <div className="flex flex-col gap-3 w-full max-w-[240px]">
                                <button
                                    onClick={(e) => { e.stopPropagation(); initGame(); }}
                                    className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
                                >
                                    <RotateCcw size={20} />
                                    다시 도전하기
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); shareCanvas(containerRef.current, '탑 쌓기', `${score}층`); }}
                                    className="w-full py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-2"
                                >
                                    <Share2 size={18} />
                                    결과 공유하기
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="card p-6 bg-slate-50 dark:bg-slate-900/50 border-none shadow-none text-center">
                <h3 className="font-bold mb-3 flex items-center justify-center gap-2">
                    🏆 게임 팁
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                    블록이 아래 블록과 <strong>정확히</strong> 일치할수록 탑이 안정적입니다.<br />
                    가장자리를 벗어난 부분은 잘려나가며 다음 블록의 크기가 줄어드니 주의하세요!
                </p>
            </div>
        </div>
    );
};

export default TowerStacker;
