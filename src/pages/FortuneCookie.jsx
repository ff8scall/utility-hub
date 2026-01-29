import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Share2, RefreshCw, Cookie, Sparkles } from 'lucide-react';

const FortuneCookie = () => {
    const [isCracked, setIsCracked] = useState(false);
    const [fortune, setFortune] = useState(null);
    const [animationState, setAnimationState] = useState('idle'); // idle, cracking, revealed

    const fortunes = [
        "오늘은 당신의 날입니다! 원하는 모든 것이 이루어질 거예요.",
        "뜻밖의 행운이 당신을 찾아오고 있습니다. 기대하세요!",
        "작은 노력이 큰 결실을 맺게 될 것입니다. 포기하지 마세요.",
        "당신의 미소가 누군가에게는 큰 힘이 됩니다.",
        "오늘은 조금 과감한 도전을 해봐도 좋은 날입니다.",
        "지나가 버린 일에 미련을 두지 마세요. 더 좋은 것이 오고 있습니다.",
        "당신을 응원하는 사람이 생각보다 가까이에 있습니다.",
        "잠시 휴식을 취하세요. 충전의 시간이 필요합니다.",
        "생각지도 못한 곳에서 좋은 소식을 듣게 될 것입니다.",
        "당신의 직감을 믿으세요. 오늘은 당신의 선택이 정답입니다.",
        "행복은 멀리 있지 않습니다. 바로 당신의 마음속에 있습니다.",
        "어려움이 있어도 곧 해결될 것입니다. 힘내세요!",
        "새로운 만남이 당신의 인생에 긍정적인 변화를 가져올 것입니다.",
        "오늘은 나 자신을 위해 작은 선물을 해보는 건 어떨까요?",
        "당신의 따뜻한 말 한마디가 누군가의 하루를 바꿀 수 있습니다.",
        "급할수록 돌아가세요. 여유를 가지면 길이 보입니다.",
        "당신의 능력은 당신이 생각하는 것보다 훨씬 뛰어납니다.",
        "오늘 하루는 걱정 근심을 내려놓고 즐기세요!",
        "사랑이 가득한 하루가 될 것입니다. 마음을 열어두세요.",
        "당신은 충분히 잘하고 있습니다. 자신감을 가지세요!"
    ];

    const handleCrack = () => {
        if (isCracked) return;

        setAnimationState('cracking');

        setTimeout(() => {
            const randomFortune = fortunes[Math.floor(Math.random() * fortunes.length)];
            setFortune(randomFortune);
            setIsCracked(true);
            setAnimationState('revealed');
        }, 1000);
    };

    const resetCookie = () => {
        setIsCracked(false);
        setFortune(null);
        setAnimationState('idle');
    };

    const shareResult = () => {
        if (navigator.share) {
            navigator.share({
                title: '오늘의 포춘 쿠키',
                text: `[오늘의 운세] ${fortune}`,
                url: window.location.href,
            });
        } else {
            alert('메시지가 복사되었습니다!');
            navigator.clipboard.writeText(`[오늘의 포춘 쿠키]\n${fortune}\n${window.location.href}`);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <Helmet>
                <title>포춘 쿠키 | 오늘의 행운 메시지 뽑기 - Utility Hub</title>
                <meta name="description" content="매일매일 확인하는 오늘의 행운 메시지! 포춘 쿠키를 깨서 당신을 위한 긍정적인 조언과 행운의 문구를 확인해보세요." />
                <meta name="keywords" content="포춘쿠키, 운세, 행운, 명언, 좋은글, 오늘의메시지" />
            </Helmet>

            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4 animate-fade-in">
                    🥠 포춘 쿠키
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300">
                    오늘 당신에게 찾아온 행운의 메시지를 확인하세요.
                </p>
            </div>

            <div className="max-w-xl mx-auto bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden p-8 transition-all duration-300 min-h-[500px] flex flex-col justify-center items-center relative">

                {/* Background Sparkles */}
                {animationState === 'revealed' && (
                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                        {[...Array(6)].map((_, i) => (
                            <Sparkles
                                key={i}
                                className={`absolute text-yellow-400 opacity-0 animate-ping absolute top-1/2 left-1/2`}
                                style={{
                                    animationDelay: `${i * 0.2}s`,
                                    transform: `translate(${Math.random() * 200 - 100}px, ${Math.random() * 200 - 100}px)`
                                }}
                            />
                        ))}
                    </div>
                )}

                {!isCracked ? (
                    <div className="text-center animate-fade-in flex flex-col items-center cursor-pointer group" onClick={handleCrack}>
                        <div className={`relative transition-all duration-500 transform ${animationState === 'cracking' ? 'scale-110 shake' : 'group-hover:scale-105'}`}>
                            {/* SVG Cookie Representation */}
                            <svg width="240" height="240" viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="120" cy="120" r="100" fill="#FCD34D" className={`${animationState === 'cracking' ? 'animate-pulse' : ''}`} />
                                <path d="M120 20C64.7715 20 20 64.7715 20 120C20 175.228 64.7715 220 120 220C175.228 220 220 175.228 220 120C220 64.7715 175.228 20 120 20ZM120 200C75.8172 200 40 164.183 40 120C40 75.8172 75.8172 40 120 40C164.183 40 200 75.8172 200 120C200 164.183 164.183 200 120 200Z" fill="#F59E0B" fillOpacity="0.5" />
                                <path d="M160 100L120 140L80 100" stroke="#B45309" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M70 140C70 140 90 170 120 170C150 170 170 140 170 140" stroke="#B45309" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
                                <text x="120" y="80" textAnchor="middle" fill="#B45309" fontSize="24" fontFamily="sans-serif" fontWeight="bold">TOUCH ME</text>
                            </svg>
                        </div>
                        <p className="mt-8 text-xl font-bold text-gray-500 animate-bounce">
                            쿠키를 터치해서 열어보세요!
                        </p>
                    </div>
                ) : (
                    <div className="text-center w-full animate-scale-in z-10">
                        <div className="mb-8">
                            <span className="inline-block px-4 py-1.5 bg-yellow-100 dark:bg-yellow-900/40 text-yellow-600 dark:text-yellow-300 rounded-full text-sm font-bold mb-4">
                                오늘의 행운 메시지
                            </span>
                            <div className="relative p-8 bg-yellow-50 dark:bg-yellow-900/10 border-2 border-yellow-200 dark:border-yellow-700/50 rounded-2xl shadow-sm">
                                <span className="absolute top-4 left-4 text-4xl text-yellow-300 transform -rotate-12">"</span>
                                <p className="text-2xl md:text-3xl font-medium text-gray-800 dark:text-gray-100 leading-relaxed break-keep font-serif">
                                    {fortune}
                                </p>
                                <span className="absolute bottom-4 right-4 text-4xl text-yellow-300 transform rotate-12">"</span>
                            </div>
                        </div>

                        <div className="flex gap-4 justify-center">
                            <button
                                onClick={resetCookie}
                                className="flex items-center px-6 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-xl font-bold transition-all"
                            >
                                <RefreshCw className="w-5 h-5 mr-2" />
                                다른 쿠키 열기
                            </button>
                            <button
                                onClick={shareResult}
                                className="flex items-center px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl font-bold shadow-lg shadow-yellow-500/30 transition-all transform hover:-translate-y-1"
                            >
                                <Share2 className="w-5 h-5 mr-2" />
                                메시지 공유
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                {/* SEO Content Section */}
                <div className="md:col-span-3 bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6 text-sm text-gray-600 dark:text-gray-400">
                    <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-2">💡 포춘 쿠키란?</h3>
                    <p>
                        포춘 쿠키(Fortune Cookie)는 미국 중국 음식점에서 후식으로 나누어 주는 과자로, 안에는 운세가 적힌 종이가 들어있습니다.
                        바삭한 과자를 깨뜨려 그 안에 숨겨진 희망찬 메시지나 조언을 읽는 재미가 있죠.
                        여기서는 언제 어디서나 포춘 쿠키를 열어 오늘의 행운을 점쳐볼 수 있습니다.
                    </p>
                </div>
            </div>

            <style>{`
                @keyframes shake {
                    0%, 100% { transform: scale(1.1) rotate(0deg); }
                    25% { transform: scale(1.1) rotate(-5deg); }
                    75% { transform: scale(1.1) rotate(5deg); }
                }
                .shake {
                    animation: shake 0.5s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
};

export default FortuneCookie;
