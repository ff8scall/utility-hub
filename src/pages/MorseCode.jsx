import React, { useState, useRef, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Copy, Volume2, RotateCcw, ArrowRightLeft, Radio } from 'lucide-react';

const MorseCode = () => {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [mode, setMode] = useState('textToMorse'); // textToMorse, morseToText
    const [isPlaying, setIsPlaying] = useState(false);
    const audioContextRef = useRef(null);

    const morseTable = {
        'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
        'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
        'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
        'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
        'Y': '-.--', 'Z': '--..',
        '1': '.----', '2': '..---', '3': '...--', '4': '....-', '5': '.....',
        '6': '-....', '7': '--...', '8': '---..', '9': '----.', '0': '-----',
        '.': '.-.-.-', ',': '--..--', '?': '..--..', "'": '.----.', '!': '-.-.--',
        '/': '-..-.', '(': '-.--.', ')': '-.--.-', '&': '.-...', ':': '---...',
        ';': '-.-.-.', '=': '-...-', '+': '.-.-.', '-': '-....-', '_': '..--.-',
        '"': '.-..-.', '$': '...-..-', '@': '.--.-.', ' ': '/'
    };

    const reverseMorseTable = Object.entries(morseTable).reduce((acc, [char, code]) => {
        acc[code] = char;
        return acc;
    }, {});

    useEffect(() => {
        const text = input.trim().toUpperCase();
        if (mode === 'textToMorse') {
            const result = text.split('').map(char => morseTable[char] || char).join(' ');
            setOutput(result);
        } else {
            // Morse to Text
            // Handle slashes as spaces
            const result = text.split(' ').map(code => {
                if (code === '/') return ' ';
                return reverseMorseTable[code] || '?';
            }).join('');
            setOutput(result);
        }
    }, [input, mode]);

    const playSound = async () => {
        if (isPlaying || !output) return;
        setIsPlaying(true);

        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!audioContextRef.current) {
            audioContextRef.current = new AudioContext();
        }
        const ctx = audioContextRef.current;
        if (ctx.state === 'suspended') {
            await ctx.resume();
        }

        const dotDuration = 0.06; // s
        let currentTime = ctx.currentTime;

        const codes = output.split('');

        for (const char of codes) {
            if (char === '.' || char === '-') {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();

                osc.frequency.value = 600; // Hz
                osc.connect(gain);
                gain.connect(ctx.destination);

                const duration = char === '.' ? dotDuration : dotDuration * 3;

                osc.start(currentTime);
                osc.stop(currentTime + duration);

                // Attack/Decay to avoid clicking
                gain.gain.setValueAtTime(0, currentTime);
                gain.gain.linearRampToValueAtTime(1, currentTime + 0.01);
                gain.gain.setValueAtTime(1, currentTime + duration - 0.01);
                gain.gain.linearRampToValueAtTime(0, currentTime + duration);

                currentTime += duration + dotDuration; // Sound + Gap
            } else if (char === ' ') {
                currentTime += dotDuration * 3; // Gap between letters
            } else if (char === '/') {
                currentTime += dotDuration * 7; // Gap between words
            }
        }

        setTimeout(() => {
            setIsPlaying(false);
        }, (currentTime - ctx.currentTime) * 1000);
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        alert('복사되었습니다!');
    };

    const swapMode = () => {
        setMode(prev => prev === 'textToMorse' ? 'morseToText' : 'textToMorse');
        setInput(output); // Swap content roughly
        setOutput(input);
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <Helmet>
                <title>모스 부호 번역기 | Morse Code Translator - Utility Hub</title>
                <meta name="description" content="텍스트를 모스 부호로, 모스 부호를 텍스트로 변환하세요. 소리로 들어볼 수도 있습니다. SOS 구조 신호부터 비밀 메시지까지." />
                <meta name="keywords" content="모스부호, morse code, 변환기, 번역기, sos, cw, 전신" />
            </Helmet>

            <div className="text-center mb-10">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4 animate-fade-in">
                    📡 모스 부호 번역기
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300">
                    텍스트 ↔ 모스 부호 변환 및 사운드 재생
                </p>
            </div>

            <div className="max-w-3xl mx-auto">
                {/* Controls */}
                <div className="flex justify-center mb-6">
                    <button
                        onClick={swapMode}
                        className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg text-sm font-bold transition-all"
                    >
                        <ArrowRightLeft className="w-4 h-4 mr-2" />
                        {mode === 'textToMorse' ? '텍스트 → 모스 부호' : '모스 부호 → 텍스트'}
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
                    {/* Input */}
                    <div className="flex flex-col h-64 bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700">
                        <div className="p-4 bg-gray-50 dark:bg-gray-700/50 font-bold text-gray-600 dark:text-gray-300 border-b border-gray-100 dark:border-gray-700 flex justify-between">
                            <span>{mode === 'textToMorse' ? '입력 (Text)' : '입력 (Morse)'}</span>
                            <button onClick={() => setInput('')}><RotateCcw className="w-4 h-4" /></button>
                        </div>
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={mode === 'textToMorse' ? "여기에 내용을 입력하세요 (영어/숫자)" : "모스 부호를 입력하세요 (예: ... --- ...)"}
                            className="flex-1 p-4 resize-none focus:outline-none bg-transparent dark:text-white text-lg font-mono"
                        ></textarea>
                    </div>

                    {/* Output */}
                    <div className="flex flex-col h-64 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl shadow-lg overflow-hidden border border-indigo-100 dark:border-indigo-800">
                        <div className="p-4 bg-indigo-100 dark:bg-indigo-900/40 font-bold text-indigo-700 dark:text-indigo-300 border-b border-indigo-200 dark:border-indigo-800 flex justify-between">
                            <span>{mode === 'textToMorse' ? '결과 (Morse)' : '결과 (Text)'}</span>
                            <button onClick={() => copyToClipboard(output)}><Copy className="w-4 h-4" /></button>
                        </div>
                        <div className="flex-1 p-4 overflow-auto text-lg font-mono text-gray-800 dark:text-white break-words whitespace-pre-wrap">
                            {output || <span className="text-gray-400 italic">결과가 여기에 표시됩니다</span>}
                        </div>
                    </div>


                </div>

                {/* Play Button */}
                <div className="mt-6 flex justify-center">
                    <button
                        onClick={playSound}
                        disabled={!output || isPlaying}
                        className={`
                            px-8 py-4 rounded-2xl font-bold text-xl flex items-center shadow-lg transition-all
                            ${isPlaying
                                ? 'bg-gray-400 cursor-not-allowed text-white'
                                : 'bg-indigo-600 hover:bg-indigo-700 text-white hover:-translate-y-1'
                            }
                        `}
                    >
                        <Volume2 className={`w-6 h-6 mr-2 ${isPlaying ? 'animate-pulse' : ''}`} />
                        {isPlaying ? '재생 중...' : '소리로 듣기'}
                    </button>
                </div>

                {/* Cheat Sheet */}
                <div className="mt-12 bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-2 mb-4 text-gray-500">
                        <Radio className="w-5 h-5" />
                        <span className="font-bold text-sm uppercase">Morse Code Reference</span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 text-sm font-mono">
                        {Object.entries(morseTable).map(([char, code]) => (
                            <div key={char} className="flex justify-between px-3 py-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                <span className="font-bold text-indigo-600 dark:text-indigo-400">{char}</span>
                                <span className="text-gray-600 dark:text-gray-400">{code}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                {/* SEO Content Section */}
                <div className="md:col-span-3 bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6 text-sm text-gray-600 dark:text-gray-400">
                    <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-2">💡 모스 부호(Morse Code)란?</h3>
                    <p>
                        점(Dot)과 선(Dash)의 조합으로 알파벳과 숫자를 표기하는 전신 부호입니다. 1844년 새뮤얼 모스가 발명했습니다.
                        가장 널리 알려진 신호는 SOS(... --- ...)이며, 비상 시 소리나 빛(손전등)으로 구조 요청을 할 때 매우 유용합니다.
                        '사랑해'의 모스 부호는 L(...-..) O(---) V(...-) E(.) 를 조합하여 만들 수 있습니다.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default MorseCode;
