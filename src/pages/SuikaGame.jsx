import React, { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';
import SEO from '../components/SEO';
import { RefreshCw, Trophy, AlertTriangle } from 'lucide-react';
import useUserPreferences from '../hooks/useUserPreferences';

const SuikaGame = () => {
    const sceneRef = useRef(null);
    const engineRef = useRef(null);
    const renderRef = useRef(null);
    const runnerRef = useRef(null);
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [nextFruit, setNextFruit] = useState(null);
    const [highScore, setHighScore] = useState(0);
    const { addRecentTool } = useUserPreferences();

    // Fruit definitions
    const FRUITS = [
        { label: 'cherry', radius: 15, color: '#FF0000', emoji: '🍒', score: 2 },
        { label: 'strawberry', radius: 25, color: '#FF4444', emoji: '🍓', score: 4 },
        { label: 'grape', radius: 35, color: '#AA44FF', emoji: '🍇', score: 8 },
        { label: 'tangerine', radius: 45, color: '#FFAA00', emoji: '🍊', score: 16 },
        { label: 'lemon', radius: 55, color: '#FFFF00', emoji: '🍋', score: 32 },
        { label: 'peach', radius: 65, color: '#FFCCCC', emoji: '🍑', score: 64 },
        { label: 'pineapple', radius: 75, color: '#FFFF44', emoji: '🍍', score: 128 },
        { label: 'melon', radius: 85, color: '#AAFF44', emoji: '🍈', score: 256 },
        { label: 'watermelon', radius: 95, color: '#44FF44', emoji: '🍉', score: 512 },
        { label: 'coconut', radius: 105, color: '#AA8844', emoji: '🥥', score: 1024 },
        { label: 'star', radius: 120, color: '#FFDD00', emoji: '⭐', score: 2048 },
    ];

    // Load High Score
    useEffect(() => {
        addRecentTool('suika-game');
        const saved = localStorage.getItem('tool-hive-suika-highscore');
        if (saved) setHighScore(parseInt(saved, 10));
    }, []);

    // Save High Score
    useEffect(() => {
        if (score > highScore) {
            setHighScore(score);
            localStorage.setItem('tool-hive-suika-highscore', score);
        }
    }, [score, highScore]);

    const initGame = () => {
        if (!sceneRef.current) return;

        // Cleanup existing
        if (engineRef.current) {
            Matter.Runner.stop(runnerRef.current);
            Matter.Render.stop(renderRef.current);
            Matter.World.clear(engineRef.current.world);
            Matter.Engine.clear(engineRef.current);
            renderRef.current.canvas.remove();
            renderRef.current.canvas = null;
            renderRef.current.context = null;
            renderRef.current.textures = {};
        }

        // Setup Matter.js
        const Engine = Matter.Engine,
            Render = Matter.Render,
            Runner = Matter.Runner,
            Bodies = Matter.Bodies,
            Composite = Matter.Composite,
            Events = Matter.Events,
            World = Matter.World;

        const engine = Engine.create();
        engineRef.current = engine;

        const width = Math.min(window.innerWidth - 32, 450); // Mobile responsive width
        const height = 650;

        const render = Render.create({
            element: sceneRef.current,
            engine: engine,
            options: {
                width,
                height,
                wireframes: false,
                background: '#f8fafc', // Light slate
                // pixelRatio caused zooming issues on high-DPI screens, removing for 1:1 mapping safety
                // pixelRatio: window.devicePixelRatio 
            }
        });
        renderRef.current = render;

        // Create Walls
        // Make walls thicker and ensure floor is clearly visible
        const wallOptions = {
            isStatic: true,
            render: { fillStyle: '#94a3b8' },
            restitution: 0.2, // Slightly less bouncy walls
            friction: 0.1
        };

        // Ground: y = height. Height is 60. Top edge = height - 30.
        // If canvas height is 650, floor surface is at 620.
        const ground = Bodies.rectangle(width / 2, height, width, 60, wallOptions);

        const leftWall = Bodies.rectangle(0, height / 2, 20, height, wallOptions);
        const rightWall = Bodies.rectangle(width, height / 2, 20, height, wallOptions);

        // Top "Danger Line" Sensor
        const topSensor = Bodies.rectangle(width / 2, 100, width, 2, {
            isStatic: true,
            isSensor: true,
            render: { visible: true, fillStyle: 'rgba(255, 0, 0, 0.2)' },
            label: 'topSensor'
        });

        Composite.add(engine.world, [ground, leftWall, rightWall, topSensor]);

        // Input Handling (Mouse/Touch)
        let currentDropper = null;
        let isDropping = false;

        // Initial next fruit
        let nextFruitIndex = Math.floor(Math.random() * 3); // Start with smaller fruits
        setNextFruit(FRUITS[nextFruitIndex]);

        // Helper to spawn a new dropper fruit
        const spawnDropper = () => {
            if (isDropping) return;

            const fruitInfo = FRUITS[nextFruitIndex];
            currentDropper = Bodies.circle(width / 2, 50, fruitInfo.radius, {
                isStatic: true,
                render: {
                    fillStyle: fruitInfo.color,
                    sprite: {
                        // Using text/emoji rendering hack via custom render or just placeholder
                    }
                },
                label: `fruit_${nextFruitIndex}`
            });
            // We'll use custom rendering for emojis later, for now colors are fine but let's try to pass emoji info
            currentDropper.fruitIndex = nextFruitIndex;

            Composite.add(engine.world, currentDropper);

            // Prepare next-next fruit
            nextFruitIndex = Math.floor(Math.random() * 3);
            setNextFruit(FRUITS[nextFruitIndex]);
        };

        spawnDropper();

        // Custom Render Loop for Emojis
        Events.on(render, 'afterRender', () => {
            const context = render.context;
            const bodies = Composite.allBodies(engine.world);

            context.font = "30px Arial";
            context.textAlign = "center";
            context.textBaseline = "middle";

            bodies.forEach(body => {
                if (body.label.startsWith('fruit_')) {
                    const index = parseInt(body.label.split('_')[1]);
                    const fruit = FRUITS[index];
                    if (fruit) {
                        context.font = `${fruit.radius * 1.2}px Arial`; // Scale emoji
                        context.fillText(fruit.emoji, body.position.x, body.position.y + (fruit.radius * 0.15)); // Adjust text center
                    }
                }
            });

            // Draw Danger Line Text
            context.font = "14px Arial";
            context.fillStyle = "red";
            context.fillText("——— 위험 라인 (넘으면 게임 오버) ———", width / 2, 100);
        });

        // Collision Logic (Merging)
        Events.on(engine, 'collisionStart', (event) => {
            const pairs = event.pairs;

            for (let i = 0; i < pairs.length; i++) {
                const pair = pairs[i];
                const bodyA = pair.bodyA;
                const bodyB = pair.bodyB;

                // Check for Game Over (Fruit touching top sensor while stable? Actually game over is usually if it stays above line)
                // Simplified Game Over: collision with sensor is interesting, but usually it's "staying above".
                // Let's implement simpler merge logic first.

                if (bodyA.label.startsWith('fruit_') && bodyB.label.startsWith('fruit_')) {
                    const indexA = parseInt(bodyA.label.split('_')[1]);
                    const indexB = parseInt(bodyB.label.split('_')[1]);

                    if (indexA === indexB && indexA < FRUITS.length - 1) {
                        // Merge!
                        const newMidPoint = {
                            x: (bodyA.position.x + bodyB.position.x) / 2,
                            y: (bodyA.position.y + bodyB.position.y) / 2
                        };

                        // Remove old bodies
                        Composite.remove(engine.world, [bodyA, bodyB]);

                        // Spawn new body
                        const nextIndex = indexA + 1;
                        const nextFruit = FRUITS[nextIndex];

                        const newBody = Bodies.circle(newMidPoint.x, newMidPoint.y, nextFruit.radius, {
                            render: { fillStyle: nextFruit.color },
                            label: `fruit_${nextIndex}`,
                            restitution: 0.2
                        });
                        newBody.fruitIndex = nextIndex;

                        Composite.add(engine.world, newBody);

                        // Update Score
                        setScore(prev => prev + nextFruit.score);
                    }
                }
            }
        });

        // Game Over Check (Poll every second)
        const checkGameOverInterval = setInterval(() => {
            if (gameOver) return;
            const bodies = Composite.allBodies(engine.world);
            const fruits = bodies.filter(b => b.label.startsWith('fruit_') && !b.isStatic);

            for (const fruit of fruits) {
                // If a fruit is above the line (y < 100) and is effectively sleeping/slow (settled)
                if (fruit.position.y < 100 && fruit.velocity.y < 0.2 && fruit.velocity.y > -0.2) {
                    // Give a little buffer time? For simplicity, instant fail if settled above.
                    // Actually, usually there's a timer. Let's just strict check for now.
                    // To avoid instant fail on spawn, make sure spawn y is higher than 100? Spawn is 50.
                    // The dropped fruit falls PAST 100 quickly. If it piles up to 100, fail.

                    // Check if it's the CURRENT dropper (isStatic) - ignore it
                    if (!fruit.isStatic) {
                        setGameOver(true);
                        Matter.Runner.stop(runnerRef.current);
                    }
                }
            }
        }, 1000);

        // Input Handling Functions
        const handleInputMove = (x) => {
            if (currentDropper && !isDropping) {
                // Clamp x position
                const clampedX = Math.max(30, Math.min(width - 30, x));
                Matter.Body.setPosition(currentDropper, { x: clampedX, y: 50 });
            }
        };

        const handleInputEnd = () => {
            if (currentDropper && !isDropping) {
                isDropping = true;
                Matter.Body.setStatic(currentDropper, false); // Make it fall
                currentDropper = null;

                // Spawn next after delay
                setTimeout(() => {
                    isDropping = false;
                    if (!gameOver) spawnDropper();
                }, 1000);
            }
        };

        // DOM Listeners for the canvas container
        const canvasContainer = sceneRef.current;

        const onMouseMove = (e) => {
            const rect = canvasContainer.getBoundingClientRect();
            handleInputMove(e.clientX - rect.left);
        };
        const onMouseUp = () => handleInputEnd();

        const onTouchMove = (e) => {
            const rect = canvasContainer.getBoundingClientRect();
            handleInputMove(e.touches[0].clientX - rect.left);
        };
        // Touch end doesn't give coords, but we just drop where it was
        const onTouchEnd = () => handleInputEnd();

        canvasContainer.addEventListener('mousemove', onMouseMove);
        canvasContainer.addEventListener('mouseup', onMouseUp);
        // Add to window for easier release? better to keep local first to avoid misclicks
        canvasContainer.addEventListener('touchmove', onTouchMove, { passive: false });
        canvasContainer.addEventListener('touchend', onTouchEnd);

        // Run
        Render.run(render);
        const runner = Runner.create();
        runnerRef.current = runner;
        Runner.run(runner, engine);

        return () => {
            clearInterval(checkGameOverInterval);
            canvasContainer.removeEventListener('mousemove', onMouseMove);
            canvasContainer.removeEventListener('mouseup', onMouseUp);
            canvasContainer.removeEventListener('touchmove', onTouchMove);
            canvasContainer.removeEventListener('touchend', onTouchEnd);
        };
    };

    // Restart Game
    const restartGame = () => {
        setScore(0);
        setGameOver(false);
        initGame();
    };

    // Effect to start game on mount usually, but we need to handle restart cleanly
    useEffect(() => {
        const cleanup = initGame();
        return () => {
            if (cleanup) cleanup();
            // cleanup matter runner in initGame logic handles refs
        }
    }, [gameOver]); // Re-run init when game over state clears (restart)

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <SEO
                title="수박 게임 (Merge Puzzle) - Tool Hive"
                description="같은 과일을 합쳐 더 큰 과일을 만드는 중독성 있는 퍼즐 게임. 최고 점수에 도전하세요!"
                keywords="수박게임, 머지퍼즐, 게임, 퍼즐, 과일합치기, 웹게임"
            />

            <div className="flex flex-col items-center">
                <h2 className="text-3xl font-bold mb-6 text-center">🍉 수박 게임 (Merge Puzzle)</h2>

                {/* Score Board */}
                <div className="flex gap-8 mb-4">
                    <div className="bg-card border border-border rounded-xl px-6 py-3 text-center shadow-sm">
                        <div className="text-xs text-muted-foreground uppercase font-bold">현재 점수</div>
                        <div className="text-2xl font-black text-primary">{score}</div>
                    </div>
                    <div className="bg-card border border-border rounded-xl px-6 py-3 text-center shadow-sm">
                        <div className="text-xs text-muted-foreground uppercase font-bold flex items-center justify-center gap-1">
                            <Trophy className="w-3 h-3 text-yellow-500" /> 최고 기록
                        </div>
                        <div className="text-2xl font-black text-foreground">{highScore}</div>
                    </div>
                </div>

                {/* Next Fruit Preview */}
                <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
                    <span>다음 과일:</span>
                    <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-lg border border-border">
                        {nextFruit ? nextFruit.emoji : '?'}
                    </div>
                </div>

                {/* Game Area */}
                <div className="relative group">
                    {/* Game Canvas Container */}
                    <div
                        ref={sceneRef}
                        className="border-4 border-slate-300 rounded-lg overflow-hidden bg-slate-50 cursor-pointer shadow-inner touch-none select-none"
                        style={{ maxWidth: '100%', maxHeight: '80vh' }}
                    ></div>

                    {/* Game Over Overlay */}
                    {gameOver && (
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-white rounded-lg animate-in fade-in">
                            <AlertTriangle className="w-16 h-16 text-red-500 mb-4 animate-bounce" />
                            <h3 className="text-3xl font-bold mb-2">게임 오버!</h3>
                            <p className="text-slate-200 mb-8 text-lg">최종 점수: <span className="font-bold text-white">{score}</span></p>
                            <button
                                onClick={restartGame}
                                className="flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-full font-bold text-lg hover:bg-primary/90 transition-transform active:scale-95 shadow-lg"
                            >
                                <RefreshCw className="w-5 h-5" /> 다시 시작
                            </button>
                        </div>
                    )}
                </div>

                {/* Instructions */}
                <div className="mt-8 max-w-lg text-center space-y-2 text-muted-foreground bg-muted/30 p-4 rounded-xl">
                    <h4 className="font-bold text-foreground">게임 방법</h4>
                    <p className="text-sm">👆 화면을 터치하거나 클릭하여 위치를 잡고 놓으세요.</p>
                    <p className="text-sm">🔄 같은 과일끼리 닿으면 합쳐져서 더 큰 과일이 됩니다.</p>
                    <p className="text-sm">⚠️ 과일이 상단 빨간 라인을 넘어가면 게임이 종료됩니다.</p>
                </div>

                {/* Legend */}
                <div className="mt-4 flex flex-wrap justify-center gap-2 max-w-lg">
                    {FRUITS.map((fruit, idx) => (
                        <div key={idx} className="flex flex-col items-center">
                            <span className="text-xl">{fruit.emoji}</span>
                            {idx < FRUITS.length - 1 && <span className="text-muted-foreground/30">→</span>}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SuikaGame;
