import React, { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { RotateCcw, Play, Utensils } from 'lucide-react';
import Matter from 'matter-js';

const CACHE_BUST = Date.now();
const FRUITS = [
    { name: 'Strawberry', radius: 37, texture: `/assets/tanghulu/strawberry_final.png?v=${CACHE_BUST}`, scale: 0.18 },
    { name: 'Grape', radius: 33, texture: `/assets/tanghulu/grape_final.png?v=${CACHE_BUST}`, scale: 0.16 },
    { name: 'Orange', radius: 42, texture: `/assets/tanghulu/orange_final.png?v=${CACHE_BUST}`, scale: 0.20 },
    { name: 'Shine Muscat', radius: 36, texture: `/assets/tanghulu/shine_muscat_final.png?v=${CACHE_BUST}`, scale: 0.18 },
    { name: 'Tomato', radius: 30, texture: `/assets/tanghulu/tomato_final.png?v=${CACHE_BUST}`, scale: 0.15 },
];

const TanghuluGame = () => {
    const sceneRef = useRef(null);
    const engineRef = useRef(null);
    const renderRef = useRef(null);
    const runnerRef = useRef(null);
    const imagesRef = useRef({});

    // Game State Refs
    const gameStateRef = useRef({
        isPlaying: false,
        currentFruit: null,
        canDrop: true,
        activeFruits: [],
        skeweredFruits: [],
        swingTime: 0,
        score: 0,
        speed: 0.03
    });

    const [score, setScore] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [gameOver, setGameOver] = useState(false);

    // Constants
    const WIDTH = 360;
    const HEIGHT = 640;
    const GROUND_HEIGHT = 20;

    // Load images once
    // Helper to strip white background
    const processImageTransparency = (imgSource) => {
        return new Promise((resolve) => {
            const img = new Image();
            img.crossOrigin = "Anonymous";
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);

                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const data = imageData.data;

                for (let i = 0; i < data.length; i += 4) {
                    const r = data[i];
                    const g = data[i + 1];
                    const b = data[i + 2];
                    // Threshold for "White"
                    if (r > 230 && g > 230 && b > 230) {
                        data[i + 3] = 0; // Set Alpha to 0
                    }
                }

                ctx.putImageData(imageData, 0, 0);
                const newImg = new Image();
                newImg.src = canvas.toDataURL();
                newImg.onload = () => resolve(newImg);
            };
            img.src = imgSource;
        });
    };

    // Load and Process images
    useEffect(() => {
        FRUITS.forEach(async (fruit) => {
            const processedImg = await processImageTransparency(fruit.texture);
            imagesRef.current[fruit.name] = processedImg;
        });
    }, []);

    useEffect(() => {
        // 1. Setup Matter.js
        const Engine = Matter.Engine,
            Render = Matter.Render,
            Runner = Matter.Runner,
            Bodies = Matter.Bodies,
            Composite = Matter.Composite,
            Events = Matter.Events;

        const engine = Engine.create();
        engineRef.current = engine;

        const render = Render.create({
            element: sceneRef.current,
            engine: engine,
            options: {
                width: WIDTH,
                height: HEIGHT,
                wireframes: false,
                background: 'transparent', // CSS handles BG
                showSensors: true
            }
        });
        renderRef.current = render;

        window.gameDebug = { engine, render };

        // 2. Create World Objects
        // Base stick (visual anchor)
        const baseStick = Bodies.rectangle(WIDTH / 2, HEIGHT - 60, 10, 80, {
            isStatic: true,
            render: { fillStyle: '#d4a373' },
            label: 'baseStick'
        });

        Composite.add(engine.world, [baseStick]);

        // 3. Run
        const runner = Runner.create();
        runnerRef.current = runner;
        Runner.run(runner, engine);
        Render.run(render);

        // 4. Update Loop
        Events.on(engine, 'beforeUpdate', () => {
            const state = gameStateRef.current;
            if (!state.isPlaying) return;

            // Swing Logic
            if (state.currentFruit && state.canDrop) {
                state.swingTime += state.speed;
                const swingRange = WIDTH / 2 - 40;
                const swingX = WIDTH / 2 + Math.sin(state.swingTime) * swingRange;
                Matter.Body.setPosition(state.currentFruit, { x: swingX, y: 120 });
                Matter.Body.setVelocity(state.currentFruit, { x: 0, y: 0 });
            }

            // Game Over Check
            const cleanupIds = [];
            state.activeFruits.forEach(fruit => {
                if (fruit.position.y > HEIGHT) {
                    cleanupIds.push(fruit);
                    endGame();
                }
            });

            if (cleanupIds.length > 0) {
                Matter.Composite.remove(engine.world, cleanupIds);
            }
        });

        // 5. Render Loop (Try-Catch Protected)
        Events.on(render, 'afterRender', () => {
            try {
                const ctx = render.context;
                const state = gameStateRef.current;
                const centerX = WIDTH / 2;

                // DIAGNOSTIC LOG ONCE
                if (!window._debugRenderLogged) {
                    console.log("[Render Debug] Active Fruits:", state.activeFruits.length);
                    if (state.currentFruit) {
                        console.log("[Render Debug] Current Fruit:", state.currentFruit.fruitName, state.currentFruit.position);
                    }
                    console.log("[Render Debug] Images Loaded:", Object.keys(imagesRef.current));
                    window._debugRenderLogged = true;
                }

                // Stick
                let topY = HEIGHT - 100;
                if (state.skeweredFruits.length > 0) {
                    const topFruit = state.skeweredFruits[state.skeweredFruits.length - 1];
                    topY = topFruit.position.y;
                }

                ctx.beginPath();
                ctx.moveTo(centerX, HEIGHT);
                ctx.lineTo(centerX, topY - 110);
                ctx.lineWidth = 6;
                ctx.strokeStyle = '#d4a373';
                ctx.stroke();

                // Fruits
                const allFruits = [...state.activeFruits, ...state.skeweredFruits, (state.currentFruit ? state.currentFruit : null)];

                allFruits.forEach(fruit => {
                    if (!fruit) return;

                    const radius = fruit.circleRadius;
                    const { x, y } = fruit.position;
                    const diameter = radius * 2;
                    let drawn = false;

                    // Draw Image
                    const fruitName = fruit.fruitName;
                    if (fruitName && imagesRef.current[fruitName]) {
                        const img = imagesRef.current[fruitName];
                        if (img.complete && img.naturalHeight !== 0) {
                            // Transparency handled by processImageTransparency
                            // Just draw centered
                            const drawSize = diameter * 1.4; // 1.4x to reduce visual gaps
                            ctx.drawImage(img, x - drawSize / 2, y - drawSize / 2, drawSize, drawSize);
                            drawn = true;
                        }
                    }

                    // Fallback
                    if (!drawn) {
                        ctx.fillStyle = '#ff6b6b';
                        ctx.beginPath();
                        ctx.arc(x, y, radius, 0, 2 * Math.PI);
                        ctx.fill();
                    }

                    // Shine
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
                    ctx.beginPath();
                    ctx.arc(x - radius * 0.3, y - radius * 0.3, radius * 0.3, 0, 2 * Math.PI);
                    ctx.fill();
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
                    ctx.beginPath();
                    ctx.arc(x - radius * 0.35, y - radius * 0.35, radius * 0.1, 0, 2 * Math.PI);
                    ctx.fill();
                });

            } catch (err) {
                console.error("Render Loop Error:", err);
            }
        });


        // Collision
        Events.on(engine, 'collisionStart', (event) => {
            const state = gameStateRef.current;
            if (!state.isPlaying) return;

            event.pairs.forEach((pair) => {
                const { bodyA, bodyB } = pair;
                let fallingBody = null; // targetBody unused, just validation

                if (state.activeFruits.includes(bodyA)) fallingBody = bodyA;
                else if (state.activeFruits.includes(bodyB)) fallingBody = bodyB;

                if (!fallingBody) return;

                // Simple Hit Check: Hitting anything that is static (stick) or another skewered fruit
                // Actually we just check proximity to center because we removed physical stick body to allow free fall?
                // Wait, in previous code we re-added baseStick.
                // Assuming baseStick is there.

                const diffX = Math.abs(fallingBody.position.x - WIDTH / 2);
                const tolerance = fallingBody.circleRadius * 0.8;

                // Only stick if close to center line
                if (diffX < tolerance) {
                    Matter.Body.setStatic(fallingBody, true);
                    Matter.Body.setPosition(fallingBody, { x: WIDTH / 2, y: fallingBody.position.y });

                    state.activeFruits = state.activeFruits.filter(f => f !== fallingBody);
                    state.skeweredFruits.push(fallingBody);

                    state.score = (state.score || 0) + 10;
                    setScore(state.score);

                    if (state.score % 30 === 0) {
                        state.speed = Math.min((state.speed || 0.03) + 0.015, 0.12);
                    }

                    // Slide Down
                    const idealY = HEIGHT / 2 + 100;
                    const currentY = fallingBody.position.y;
                    if (currentY < idealY) {
                        const shiftY = idealY - currentY;
                        state.skeweredFruits.forEach(f => {
                            Matter.Body.setPosition(f, { x: f.position.x, y: f.position.y + shiftY });
                        });
                        const stick = engine.world.bodies.find(b => b.label === 'baseStick');
                        if (stick) {
                            Matter.Body.setPosition(stick, { x: stick.position.x, y: stick.position.y + shiftY });
                        }
                    }
                }
            });
        });

        return () => {
            Render.stop(render);
            Runner.stop(runner);
            Composite.clear(engine.world);
            Engine.clear(engine);
            render.canvas.remove();
        };
    }, []);

    const startGame = () => {
        const engine = engineRef.current;
        if (!engine) return;

        Matter.Composite.clear(engine.world, false);

        // Reset Camera
        renderRef.current.bounds.min.x = 0;
        renderRef.current.bounds.min.y = 0;
        renderRef.current.bounds.max.x = WIDTH;
        renderRef.current.bounds.max.y = HEIGHT;

        // Add base stick
        const baseStick = Matter.Bodies.rectangle(WIDTH / 2, HEIGHT - 20, 20, 100, {
            isStatic: true,
            render: { fillStyle: '#d4a373' },
            label: 'baseStick'
        });
        Matter.Composite.add(engine.world, [baseStick]);

        gameStateRef.current = {
            isPlaying: true,
            currentFruit: null,
            canDrop: true,
            activeFruits: [],
            skeweredFruits: [],
            swingTime: 0,
            score: 0,
            speed: 0.03
        };

        setScore(0);
        setIsPlaying(true);
        setGameOver(false);

        spawnFruit();
    };

    const endGame = () => {
        setIsPlaying(false);
        setGameOver(true);
        gameStateRef.current.isPlaying = false;
    };

    const spawnFruit = () => {
        const engine = engineRef.current;
        const state = gameStateRef.current;
        const fruitType = FRUITS[Math.floor(Math.random() * FRUITS.length)];

        const fruit = Matter.Bodies.circle(WIDTH / 2, 120, fruitType.radius, {
            isStatic: true,
            render: { opacity: 0 },
            label: 'aimFruit'
        });
        fruit.fruitName = fruitType.name;

        state.currentFruit = fruit;
        state.canDrop = true;
        Matter.Composite.add(engine.world, fruit);
    };

    const dropFruit = () => {
        const state = gameStateRef.current;
        if (!state.isPlaying || !state.canDrop || !state.currentFruit) return;

        const engine = engineRef.current;
        const aimFruit = state.currentFruit;
        if (!aimFruit) return;

        const { position } = aimFruit;
        const fruitType = FRUITS.find(f => f.name === aimFruit.fruitName);

        Matter.Composite.remove(engine.world, aimFruit);
        state.currentFruit = null;
        state.canDrop = false;

        const fallingFruit = Matter.Bodies.circle(position.x, position.y, fruitType.radius, {
            restitution: 0.2,
            friction: 0.5,
            density: 0.005,
            render: { opacity: 0 },
            label: 'fruit'
        });
        fallingFruit.fruitName = fruitType.name;

        state.activeFruits.push(fallingFruit);
        Matter.Composite.add(engine.world, fallingFruit);
        Matter.Body.setVelocity(fallingFruit, { x: 0, y: 15 });

        setTimeout(() => {
            if (gameStateRef.current.isPlaying) spawnFruit();
        }, 1000);
    };

    const handleInput = () => {
        if (gameOver) return;
        if (!isPlaying) startGame();
        else dropFruit();
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <Helmet>
                <title>탕후루 만들기 | Utility Hub</title>
                <meta name="description" content="과일 탕후루 게임" />
            </Helmet>

            <div className="flex flex-col items-center gap-6">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2 flex items-center justify-center gap-2">
                        <Utensils className="w-8 h-8" />
                        탕후루 만들기
                    </h1>
                </div>

                <div className="flex justify-between w-full max-w-[360px] items-center bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                    <div className="text-xl font-bold text-gray-800 dark:text-white">
                        {score} 점
                    </div>
                </div>

                <div className="relative">
                    <div
                        ref={sceneRef}
                        onClick={handleInput}
                        className="w-[360px] h-[640px] cursor-pointer bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden border-4 border-gray-200 dark:border-gray-700 select-none touch-none"
                    >
                        {/* Overlay UI */}
                        {!isPlaying && !gameOver && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 text-white z-10">
                                <button
                                    onClick={(e) => { e.stopPropagation(); startGame(); }}
                                    className="px-8 py-4 bg-red-500 rounded-full text-xl font-bold hover:bg-red-600 transition-transform hover:scale-105 shadow-lg flex items-center gap-2"
                                >
                                    <Play className="w-6 h-6" />
                                    게임 시작
                                </button>
                            </div>
                        )}

                        {gameOver && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 text-white z-10">
                                <h2 className="text-3xl font-bold mb-4">와장창! 😭</h2>
                                <div className="text-6xl mb-6">🍡</div>
                                <p className="text-xl mb-6">최종 점수: {score}점</p>
                                <button
                                    onClick={(e) => { e.stopPropagation(); startGame(); }}
                                    className="px-8 py-3 bg-red-500 rounded-full font-bold hover:bg-red-600 transition-transform hover:scale-105 shadow-xl"
                                >
                                    다시 도전하기
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TanghuluGame;
