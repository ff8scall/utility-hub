import React, { useEffect, useRef, useState, useCallback } from 'react';
import { RefreshCw, Play, Trophy, Share2 } from 'lucide-react';
import SEO from '../components/SEO';
import useShareCanvas from '../hooks/useShareCanvas';

const FlappyBird = () => {
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [score, setScore] = useState(0);
    const [bestScore, setBestScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const { shareCanvas } = useShareCanvas();

    // Game constants
    // Game constants
    const GRAVITY = 0.02;
    const JUMP_STRENGTH = -1.5; // milder jump (kept)
    const PIPE_SPEED = 1.5; // half speed (initial)
    const PIPE_SPAWN_RATE = 1500; // original spawn rate
    const PIPE_GAP = 208; // 1.3x gap (initial)
    // mutable refs for dynamic difficulty
    const pipeSpeedRef = useRef(PIPE_SPEED);
    const pipeGapRef = useRef(PIPE_GAP);

    // Game state refs (for loop performance)
    const birdRef = useRef({ y: 300, velocity: 0, radius: 12 });
    const pipesRef = useRef([]);
    const requestRef = useRef();
    const lastTimeRef = useRef(0);
    const scoreRef = useRef(0);

    useEffect(() => {
        const savedBest = localStorage.getItem('flappy-bird-best');
        if (savedBest) setBestScore(parseInt(savedBest));
    }, []);

    const resetGame = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        birdRef.current = {
            y: canvas.height * 0.4,
            velocity: 0, // start stationary
            radius: 12
        };
        // reset dynamic difficulty refs
        pipeSpeedRef.current = PIPE_SPEED;
        pipeGapRef.current = PIPE_GAP;
        // reset game state
        pipesRef.current = [];
        scoreRef.current = 0;
        setScore(0);
        setGameOver(false);
        setIsPlaying(true);
        lastTimeRef.current = performance.now();
    }, []);

    const jump = useCallback(() => {
        if (gameOver) return;
        if (!isPlaying) {
            resetGame();
            // Do not apply jump automatically; wait for user input
            return;
        }
        birdRef.current.velocity = JUMP_STRENGTH;
    }, [gameOver, isPlaying, resetGame]);

    const updateGame = useCallback((time) => {
        if (!isPlaying || gameOver) {
            // Animation loop for idle/game over state if needed, or just stop
            if (!gameOver) requestRef.current = requestAnimationFrame(updateGame);
            return;
        }

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const deltaTime = time - lastTimeRef.current;

        // Normalize speed for frame drops (simple implementation)
        // For this simple game, fixed step is okay, but let's just run logic per frame

        // 1. Update Bird
        birdRef.current.velocity += GRAVITY;
        birdRef.current.y += birdRef.current.velocity;

        // Floor/Ceiling collision
        if (birdRef.current.y + birdRef.current.radius > canvas.height - 20 || birdRef.current.y - birdRef.current.radius < 0) {
            setGameOver(true);
            setIsPlaying(false);
            updateBestScore();
        }

        // 2. Update Pipes
        // Spawn new pipe
        if (pipesRef.current.length === 0 || canvas.width - pipesRef.current[pipesRef.current.length - 1].x > 300) {
            const minPipeHeight = 50;
            const maxPipeHeight = canvas.height - pipeGapRef.current - minPipeHeight - 20; // -20 for floor
            const topHeight = Math.floor(Math.random() * (maxPipeHeight - minPipeHeight + 1)) + minPipeHeight;

            pipesRef.current.push({
                x: canvas.width,
                topHeight: topHeight,
                passed: false
            });
        }

        pipesRef.current.forEach(pipe => {
            pipe.x -= pipeSpeedRef.current;
        });

        // Remove off-screen pipes
        if (pipesRef.current.length > 0 && pipesRef.current[0].x < -60) {
            pipesRef.current.shift();
        }

        // 3. Collision Detection & Scoring
        pipesRef.current.forEach(pipe => {
            // Hitbox - Generous (smaller than visual)
            const hitBoxPadding = 20; // very forgiving collision
            const birdLeft = 50 - birdRef.current.radius + hitBoxPadding;
            const birdRight = 50 + birdRef.current.radius - hitBoxPadding;
            const birdTop = birdRef.current.y - birdRef.current.radius + hitBoxPadding;
            const birdBottom = birdRef.current.y + birdRef.current.radius - hitBoxPadding;

            const pipeLeft = pipe.x;
            const pipeRight = pipe.x + 60; // Pipe width
            const topPipeBottom = pipe.topHeight;
            const bottomPipeTop = pipe.topHeight + pipeGapRef.current;

            // Check overlap
            if (birdRight > pipeLeft && birdLeft < pipeRight) {
                if (birdTop < topPipeBottom || birdBottom > bottomPipeTop) {
                    setGameOver(true);
                    setIsPlaying(false);
                    updateBestScore();
                }
            }

            // Score
            if (!pipe.passed && birdLeft > pipeRight) {
                pipe.passed = true;
                scoreRef.current += 1;
                setScore(curr => curr + 1);
                // Dynamic difficulty: every 10 points adjust speed and gap
                if (scoreRef.current % 10 === 0) {
                    pipeSpeedRef.current *= 1.05; // increase speed by 5%
                    pipeGapRef.current *= 0.9;   // reduce gap by 10%
                }
            }
        });

        draw(ctx);
        lastTimeRef.current = time;
        requestRef.current = requestAnimationFrame(updateGame);
    }, [isPlaying, gameOver]);

    // Separate draw function to keep loop clean
    const draw = (ctx) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Clear
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Background (Sky)
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, '#60a5fa'); // sky-400
        gradient.addColorStop(1, '#93c5fd'); // sky-300
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Pipes
        ctx.fillStyle = '#22c55e'; // green-500
        ctx.strokeStyle = '#15803d'; // green-700
        ctx.lineWidth = 2;

        pipesRef.current.forEach(pipe => {
            // Top Pipe
            ctx.fillRect(pipe.x, 0, 60, pipe.topHeight);
            ctx.strokeRect(pipe.x, 0, 60, pipe.topHeight);

            // Bottom Pipe
            ctx.fillRect(pipe.x, pipe.topHeight + PIPE_GAP, 60, canvas.height - (pipe.topHeight + PIPE_GAP) - 20); // -20 floor
            ctx.strokeRect(pipe.x, pipe.topHeight + PIPE_GAP, 60, canvas.height - (pipe.topHeight + PIPE_GAP) - 20);

            // Cap details (Top Pipe Cap)
            ctx.fillStyle = '#4ade80'; // lighter green
            ctx.fillRect(pipe.x - 2, pipe.topHeight - 20, 64, 20);
            ctx.strokeRect(pipe.x - 2, pipe.topHeight - 20, 64, 20);

            // (Bottom Pipe Cap)
            ctx.fillRect(pipe.x - 2, pipe.topHeight + PIPE_GAP, 64, 20);
            ctx.strokeRect(pipe.x - 2, pipe.topHeight + PIPE_GAP, 64, 20);

            ctx.fillStyle = '#22c55e'; // reset
        });

        // Floor
        ctx.fillStyle = '#d97706'; // amber-600
        ctx.fillRect(0, canvas.height - 20, canvas.width, 20);
        // Grass on top of floor
        ctx.fillStyle = '#4ade80'; // green-400
        ctx.fillRect(0, canvas.height - 25, canvas.width, 5);

        // Bird
        ctx.beginPath();
        ctx.arc(50, birdRef.current.y, birdRef.current.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#fbbf24'; // amber-400
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Bird Eye
        ctx.beginPath();
        ctx.arc(58, birdRef.current.y - 5, 5, 0, Math.PI * 2);
        ctx.fillStyle = '#fff';
        ctx.fill();
        ctx.beginPath();
        ctx.arc(60, birdRef.current.y - 5, 2, 0, Math.PI * 2);
        ctx.fillStyle = '#000';
        ctx.fill();

        // Bird Wing
        ctx.beginPath();
        ctx.ellipse(45, birdRef.current.y + 5, 8, 5, -0.2, 0, Math.PI * 2);
        ctx.fillStyle = '#fff';
        ctx.fill();

        // Bird Beak
        ctx.beginPath();
        ctx.moveTo(60, birdRef.current.y + 2);
        ctx.lineTo(70, birdRef.current.y + 5);
        ctx.lineTo(62, birdRef.current.y + 10);
        ctx.fillStyle = '#ef4444'; // red-500
        ctx.fill();
    };

    const updateBestScore = () => {
        if (scoreRef.current > bestScore) {
            setBestScore(scoreRef.current);
            localStorage.setItem('flappy-bird-best', scoreRef.current.toString());
        }
    };

    useEffect(() => {
        requestRef.current = requestAnimationFrame(updateGame);
        return () => cancelAnimationFrame(requestRef.current);
    }, [updateGame]);

    // Draw initial state when not playing
    useEffect(() => {
        if (!isPlaying && !gameOver && canvasRef.current) {
            const ctx = canvasRef.current.getContext('2d');
            // Draw a simple preview frame
            // Background
            const gradient = ctx.createLinearGradient(0, 0, 0, canvasRef.current.height);
            gradient.addColorStop(0, '#60a5fa');
            gradient.addColorStop(1, '#93c5fd');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);

            // Floor
            ctx.fillStyle = '#d97706';
            ctx.fillRect(0, canvasRef.current.height - 20, canvasRef.current.width, 20);

            // Bird (Centered for title screen)
            ctx.beginPath();
            ctx.arc(canvasRef.current.width / 2, canvasRef.current.height / 2, 20, 0, Math.PI * 2);
            ctx.fillStyle = '#fbbf24';
            ctx.fill();
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 3;
            ctx.stroke();

            // TEXT
            ctx.fillStyle = 'white';
            ctx.font = 'bold 30px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText("파닥파닥 버드", canvasRef.current.width / 2, canvasRef.current.height / 2 - 50);

            ctx.font = '20px sans-serif';
            ctx.fillText("클릭해서 시작하기", canvasRef.current.width / 2, canvasRef.current.height / 2 + 50);
        }
    }, [isPlaying, gameOver]);

    // Event Listeners
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.code === 'Space') {
                e.preventDefault(); // Stop scrolling
                jump();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [jump]);

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <SEO
                title="파닥파닥 버드 - 유틸리티 허브"
                description="중독성 있는 파닥파닥 버드 게임을 즐겨보세요! 얼마나 멀리 날아갈 수 있을까요?"
                keywords="플래피버드, 게임, 미니게임, 파닥파닥, flappy bird"
            />

            <div className="text-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                    파닥파닥 버드
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                    화면을 클릭하거나 스페이스바를 눌러 새를 날리세요!
                </p>
            </div>

            <div className="flex flex-col items-center">
                {/* Score Board */}
                <div className="flex gap-8 mb-4">
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg flex flex-col items-center min-w-[120px]">
                        <span className="text-gray-500 dark:text-gray-400 text-sm font-medium uppercase tracking-wider">Score</span>
                        <span className="text-4xl font-black text-blue-500">{score}</span>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg flex flex-col items-center min-w-[120px]">
                        <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 text-sm font-medium uppercase tracking-wider">
                            <Trophy size={14} className="text-yellow-500" />
                            <span>Best</span>
                        </div>
                        <span className="text-4xl font-black text-yellow-500">{bestScore}</span>
                    </div>
                </div>

                <div className="relative group" ref={containerRef}>
                    <canvas
                        ref={canvasRef}
                        width={400}
                        height={600}
                        onClick={jump}
                        className="bg-sky-300 rounded-xl shadow-2xl cursor-pointer select-none touch-manipulation max-w-full"
                        style={{ maxHeight: '70vh' }}
                    />

                    {gameOver && (
                        <div className="absolute inset-0 bg-black/50 rounded-xl flex flex-col items-center justify-center p-6 backdrop-blur-sm">
                            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl text-center transform scale-110 transition-transform">
                                <h2 className="text-3xl font-black text-gray-800 dark:text-white mb-2">GAME OVER</h2>
                                <div className="flex flex-col gap-1 mb-6">
                                    <span className="text-gray-500 dark:text-gray-400">Score</span>
                                    <span className="text-5xl font-bold text-blue-500">{score}</span>
                                </div>

                                <button
                                    onClick={resetGame}
                                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white rounded-xl font-bold text-lg transition-colors shadow-lg hover:shadow-blue-500/30"
                                >
                                    <RefreshCw size={24} />
                                    다시 시작
                                </button>
                                <button
                                    onClick={() => shareCanvas(containerRef.current, '파닥파닥 버드', score)}
                                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-xl font-bold text-lg transition-colors shadow-lg mt-3"
                                >
                                    <Share2 size={24} />
                                    결과 공유하기
                                </button>
                            </div>
                        </div>
                    )}

                    {!isPlaying && !gameOver && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="bg-black/20 p-4 rounded-full backdrop-blur-[2px] animate-pulse">
                                <Play size={48} className="text-white fill-white opacity-90" />
                            </div>
                        </div>
                    )}
                </div>

                <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
                    Tip: PC에서는 <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-md font-mono text-xs border border-gray-200 dark:border-gray-600">Space</kbd> 키를 사용할 수 있습니다.
                </div>
            </div>
        </div>
    );
};

export default FlappyBird;
