import React, { useState, useEffect, useRef } from 'react';
import SEO from '../components/SEO';
import { Keyboard, RefreshCw, Trophy, Timer } from 'lucide-react';
import ShareButtons from '../components/ShareButtons';

const SENTENCES = [
    "The quick brown fox jumps over the lazy dog.",
    "Pack my box with five dozen liquor jugs.",
    "How vexingly quick daft zebras jump!",
    "Sphinx of black quartz, judge my vow.",
    "Two driven jocks help fax my big quiz.",
    "Life is like a box of chocolates. You never know what you're gonna get.",
    "May the Force be with you.",
    "I'm going to make him an offer he can't refuse.",
    "Frankly, my dear, I don't give a damn.",
    "To be or not to be, that is the question.",
    "All that glitters is not gold.",
    "A journey of a thousand miles begins with a single step.",
    "Actions speak louder than words.",
    "Beauty is in the eye of the beholder.",
    "Better late than never.",
    "Birds of a feather flock together.",
    "Cleanliness is next to godliness.",
    "Don't count your chickens before they hatch.",
    "Don't judge a book by its cover.",
    "Early to bed and early to rise makes a man healthy, wealthy and wise."
];

const TypingTest = () => {
    const [text, setText] = useState('');
    const [input, setInput] = useState('');
    const [startTime, setStartTime] = useState(null);
    const [wpm, setWpm] = useState(0);
    const [accuracy, setAccuracy] = useState(100);
    const [isFinished, setIsFinished] = useState(false);
    const [bestWpm, setBestWpm] = useState(() => {
        return parseInt(localStorage.getItem('typing-best-wpm')) || 0;
    });

    const inputRef = useRef(null);

    useEffect(() => {
        resetGame();
    }, []);

    const resetGame = () => {
        const randomIndex = Math.floor(Math.random() * SENTENCES.length);
        setText(SENTENCES[randomIndex]);
        setInput('');
        setStartTime(null);
        setWpm(0);
        setAccuracy(100);
        setIsFinished(false);
        setTimeout(() => inputRef.current?.focus(), 100);
    };

    const handleChange = (e) => {
        const value = e.target.value;

        if (!startTime) {
            setStartTime(Date.now());
        }

        setInput(value);

        // Calculate Accuracy
        let correctChars = 0;
        for (let i = 0; i < value.length; i++) {
            if (value[i] === text[i]) correctChars++;
        }
        const acc = value.length > 0 ? Math.round((correctChars / value.length) * 100) : 100;
        setAccuracy(acc);

        // Check if finished
        if (value.length === text.length) {
            finishGame(value);
        }
    };

    const finishGame = (finalInput) => {
        const endTime = Date.now();
        const timeInMinutes = (endTime - startTime) / 60000;
        const words = text.split(' ').length;
        const calculatedWpm = Math.round(words / timeInMinutes);

        // Final accuracy check
        let correctChars = 0;
        for (let i = 0; i < finalInput.length; i++) {
            if (finalInput[i] === text[i]) correctChars++;
        }
        const finalAccuracy = Math.round((correctChars / text.length) * 100);

        setWpm(calculatedWpm);
        setAccuracy(finalAccuracy);
        setIsFinished(true);

        if (calculatedWpm > bestWpm && finalAccuracy >= 90) { // Only save if accuracy is decent
            setBestWpm(calculatedWpm);
            localStorage.setItem('typing-best-wpm', calculatedWpm);
        }
    };

    const renderText = () => {
        return text.split('').map((char, index) => {
            let color = 'text-gray-400';
            if (index < input.length) {
                color = input[index] === char ? 'text-green-500' : 'text-red-500 bg-red-100 dark:bg-red-900/30';
            }
            return (
                <span key={index} className={`font-mono text-2xl ${color}`}>
                    {char}
                </span>
            );
        });
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <SEO
                title="영타 속도 테스트 - 타자 연습 | Utility Hub"
                description="나의 영어 타자 속도(WPM)를 측정해보세요. 정확도와 속도를 실시간으로 분석해드립니다."
                keywords="타자연습, 영타연습, WPM, 타자속도, 타이핑테스트"
            />

            <div className="text-center space-y-4 py-6">
                <div className="inline-flex items-center justify-center p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-full mb-2">
                    <Keyboard className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500">
                    영타 속도 테스트
                </h1>
                <p className="text-muted-foreground">
                    제시된 문장을 빠르고 정확하게 입력하여 WPM(분당 단어수)을 측정하세요.
                </p>
            </div>

            <div className="bg-card border border-border rounded-xl p-8 shadow-sm space-y-6">
                {/* Stats */}
                <div className="flex justify-center gap-8 mb-4">
                    <div className="text-center">
                        <div className="text-sm text-muted-foreground font-medium mb-1">WPM</div>
                        <div className="text-3xl font-bold text-primary">{isFinished ? wpm : (startTime ? '...' : 0)}</div>
                    </div>
                    <div className="text-center">
                        <div className="text-sm text-muted-foreground font-medium mb-1">정확도</div>
                        <div className={`text-3xl font-bold ${accuracy < 90 ? 'text-red-500' : 'text-green-500'}`}>
                            {accuracy}%
                        </div>
                    </div>
                    {bestWpm > 0 && (
                        <div className="text-center opacity-60">
                            <div className="text-sm text-muted-foreground font-medium mb-1">최고 기록</div>
                            <div className="text-3xl font-bold">{bestWpm}</div>
                        </div>
                    )}
                </div>

                {/* Text Display */}
                <div className="p-6 bg-muted/30 rounded-xl leading-relaxed break-all min-h-[100px] flex flex-wrap items-center justify-center text-center">
                    {renderText()}
                </div>

                {/* Input Area */}
                <div className="relative">
                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={handleChange}
                        disabled={isFinished}
                        className="w-full p-4 text-xl text-center border-2 border-border rounded-xl bg-background focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 outline-none transition-all disabled:opacity-50"
                        placeholder={isFinished ? "완료!" : "위 문장을 입력하세요..."}
                        autoComplete="off"
                        autoCorrect="off"
                        spellCheck="false"
                    />
                    {isFinished && (
                        <button
                            onClick={resetGame}
                            className="absolute right-2 top-2 bottom-2 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition-colors flex items-center gap-2"
                        >
                            <RefreshCw className="w-4 h-4" />
                            다시 하기
                        </button>
                    )}
                </div>
            </div>

            {isFinished && (
                <div className="animate-in fade-in slide-in-from-bottom-4 text-center">
                    <div className="inline-block bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-6 py-3 rounded-full font-bold text-lg mb-6">
                        🎉 테스트 완료! {wpm} WPM / 정확도 {accuracy}%
                    </div>
                    <ShareButtons
                        title="영타 속도 테스트"
                        description={`제 영타 속도는 ${wpm} WPM (정확도 ${accuracy}%) 입니다! 당신의 실력은?`}
                    />
                </div>
            )}
        </div>
    );
};

export default TypingTest;
