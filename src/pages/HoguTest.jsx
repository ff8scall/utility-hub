import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Share2, RefreshCw, Hand, ShieldAlert, Award, HelpingHand } from 'lucide-react';

const HoguTest = () => {
    const [step, setStep] = useState('intro');
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);

    const questions = [
        {
            id: 1,
            question: "친구가 돈을 빌려달라고 한다. 당신의 반응은?",
            options: [
                { text: "얼마나 필요한데? (여유 있으면 빌려줌)", score: 5 },
                { text: "미안, 나도 요즘 힘들어. (칼차단)", score: 0 },
                { text: "아... 알겠어... (거절 못하고 빌려줌)", score: 10 },
                { text: "언제 갚을 건데? 차용증 써.", score: 2 }
            ]
        },
        {
            id: 2,
            question: "식당에서 주문한 메뉴와 다른 음식이 나왔다.",
            options: [
                { text: "저기요, 이거 안 시켰는데요 (바꿔달라 함)", score: 0 },
                { text: "그냥 먹지 뭐... (말 못하고 먹음)", score: 10 },
                { text: "이게 더 비싼 건가? 개이득 (긍정왕)", score: 5 },
                { text: "직원을 불러서 조용히 말한다.", score: 2 }
            ]
        },
        {
            id: 3,
            question: "보험 권유 전화를 받았을 때?",
            options: [
                { text: "관심 없습니다. (뚝 끊음)", score: 0 },
                { text: "아... 네... (계속 듣고 있음)", score: 10 },
                { text: "바빠서 죄송합니다~ (친절하게 끊음)", score: 5 },
                { text: "그게 뭔데요? (혹해서 질문함)", score: 8 }
            ]
        },
        {
            id: 4,
            question: "조별 과제에서 아무도 조장을 안 하려고 한다.",
            options: [
                { text: "답답해서 내가 총대 멘다.", score: 8 },
                { text: "끝까지 가만히 있는다.", score: 0 },
                { text: "제비뽑기 하자고 제안한다.", score: 3 },
                { text: "어쩔 수 없이 떠밀려서 내가 함", score: 10 }
            ]
        },
        {
            id: 5,
            question: "친구가 약속 시간에 1시간 늦었다.",
            options: [
                { text: "괜찮아~ 천천히 와 (속은 부글부글)", score: 10 },
                { text: "야! 지금 장난해? (화냄)", score: 0 },
                { text: "늦은 만큼 밥 사라고 한다.", score: 3 },
                { text: "나도 카페에서 놀고 있지 뭐.", score: 5 }
            ]
        },
        {
            id: 6,
            question: "점원이 '이 옷 진짜 잘 어울리세요~'라고 하며 비싼 옷을 추천한다.",
            options: [
                { text: "그쵸? 이쁘네요 (칭찬에 약해서 삼)", score: 10 },
                { text: "좀 더 둘러볼게요~ (안 삼)", score: 0 },
                { text: "생각 좀 해볼게요 (고민함)", score: 5 },
                { text: "가격표 보고 바로 내려놓음", score: 2 }
            ]
        },
        {
            id: 7,
            question: "거절을 해야 하는 상황에서 나는?",
            options: [
                { text: "단호하게 NO 라고 말한다.", score: 0 },
                { text: "돌려 말하는데 상대가 눈치 못 챌 때가 많다.", score: 8 },
                { text: "구구절절 핑계를 대며 미안해한다.", score: 5 },
                { text: "결국 거절 못해서 수락한다.", score: 10 }
            ]
        }
    ];

    const getResult = (finalScore) => {
        if (finalScore >= 50) return {
            level: '1등급', title: '인간 ATM 호구왕', color: 'text-purple-600', bg: 'bg-purple-50', icon: Award,
            desc: "당신은 이 구역의 호구왕입니다! 착한 것과 호구는 다릅니다. 남 배려하다가 본인 등골만 휘는 타입. 이제는 '싫다'고 말하는 연습이 시급합니다.",
            advice: "거울 보고 '싫어!' 소리치기 연습 100회 실시."
        };
        if (finalScore >= 30) return {
            level: '2등급', title: '거절 못하는 예스맨', color: 'text-blue-500', bg: 'bg-blue-50', icon: HelpingHand,
            desc: "마음이 약해서 부탁을 잘 거절하지 못하는군요. '좋은 게 좋은 거지'라고 생각하지만, 사실 속으로는 스트레스받고 있잖아요? 가끔은 이기적이어도 괜찮아요.",
            advice: "남 눈치 보지 말고 내 이득부터 챙기세요."
        };
        if (finalScore >= 15) return {
            level: '3등급', title: '실속 챙기는 스마트인', color: 'text-green-500', bg: 'bg-green-50', icon: Hand,
            desc: "적당히 배려할 줄 알면서도 맺고 끊음이 확실하시네요! 호구 잡힐 일은 거의 없겠습니다. 사회생활 만렙의 능력자시군요.",
            advice: "지금처럼 현명하게 대처하세요!"
        };
        return {
            level: '4등급', title: '철벽 방어 만렙', color: 'text-gray-600', bg: 'bg-gray-100', icon: ShieldAlert,
            desc: "호구가 뭐죠? 먹는 건가요? 당신은 호구가 될 확률 0%입니다. 오히려 남들이 당신을 어려워할 수도 있겠네요. 너무 차갑게 굴지는 마세요~",
            advice: "가끔은 져주는 척하는 여유도 필요해요."
        };
    };

    const handleAnswer = (points) => {
        setScore(prev => prev + points);
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(prev => prev + 1);
        } else {
            setStep('result');
        }
    };

    const resetTest = () => {
        setStep('intro');
        setCurrentQuestion(0);
        setScore(0);
    };

    const shareResult = () => {
        const result = getResult(score);
        if (navigator.share) {
            navigator.share({
                title: '호구 성향 테스트',
                text: `나의 호구력은? [${result.title}] - Utility Hub`,
                url: window.location.href,
            });
        } else {
            alert('링크가 복사되었습니다!');
            navigator.clipboard.writeText(window.location.href);
        }
    };

    return (
        <div className="max-w-2xl mx-auto px-4 py-12">
            <Helmet>
                <title>호구 성향 테스트 | 내가 호구라고? - Utility Hub</title>
                <meta name="description" content="혹시 내가 호구? 거절 못하고 손해만 보는 당신을 위한 팩트 폭격 테스트." />
                <meta name="keywords" content="호구테스트, 거절못하는성격, 심리테스트, 호구자가진단, pushover test" />
            </Helmet>

            {step === 'intro' && (
                <div className="text-center animate-fade-in bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl">
                    <HelpingHand className="w-24 h-24 text-purple-500 mx-auto mb-6 animate-pulse" />
                    <h1 className="text-3xl md:text-4xl font-black text-gray-800 dark:text-white mb-4">
                        호구 성향 테스트
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                        혹시 '착하다'는 말을 자주 듣나요?<br />
                        부탁을 거절하기가 너무 힘든가요?<br />
                        당신의 호구력을 진단해드립니다.
                    </p>
                    <button
                        onClick={() => setStep('test')}
                        className="w-full py-4 bg-purple-500 hover:bg-purple-600 text-white text-xl font-bold rounded-2xl shadow-lg transition-transform hover:scale-105"
                    >
                        진단 시작하기
                    </button>
                    <p className="mt-4 text-xs text-gray-400">주의: 팩폭에 상처받지 마세요</p>
                </div>
            )}

            {step === 'test' && (
                <div className="animate-fade-in">
                    <div className="mb-6 flex justify-between items-center text-sm font-bold text-gray-400">
                        <span>Q{currentQuestion + 1}</span>
                        <span>{currentQuestion + 1} / {questions.length}</span>
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-lg text-center mb-6">
                        <h2 className="text-xl font-bold text-gray-800 dark:text-white leading-relaxed">
                            {questions[currentQuestion].question}
                        </h2>
                    </div>

                    <div className="space-y-3">
                        {questions[currentQuestion].options.map((option, index) => (
                            <button
                                key={index}
                                onClick={() => handleAnswer(option.score)}
                                className="w-full py-4 px-6 bg-white dark:bg-gray-800 hover:bg-purple-50 dark:hover:bg-purple-900/20 border-2 border-transparent hover:border-purple-300 rounded-2xl text-lg font-medium text-gray-700 dark:text-gray-200 shadow-sm transition-all text-left"
                            >
                                {option.text}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {step === 'result' && (
                <div className="animate-scale-in text-center bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl">
                    <div className="mb-6">
                        {getResult(score).icon({ className: `w-24 h-24 mx-auto animate-bounce ${getResult(score).color}` })}
                    </div>

                    <span className="text-gray-500 dark:text-gray-400 font-bold">당신은...</span>
                    <h2 className={`text-3xl md:text-4xl font-black mt-2 mb-6 ${getResult(score).color}`}>
                        {getResult(score).title}
                    </h2>

                    <div className={`p-6 rounded-2xl mb-8 ${getResult(score).bg} dark:bg-opacity-10 text-left`}>
                        <p className="text-lg text-gray-800 dark:text-gray-200 leading-relaxed font-medium">
                            {getResult(score).desc}
                        </p>
                        <p className="mt-4 text-sm font-bold text-gray-500 dark:text-gray-400">
                            💡 {getResult(score).advice}
                        </p>
                    </div>

                    <div className="flex gap-4 justify-center">
                        <button
                            onClick={resetTest}
                            className="flex-1 py-4 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-2xl font-bold transition-all flex items-center justify-center gap-2"
                        >
                            <RefreshCw className="w-5 h-5" />
                            다시하기
                        </button>
                        <button
                            onClick={shareResult}
                            className="flex-1 py-4 bg-purple-500 hover:bg-purple-600 text-white rounded-2xl font-bold shadow-lg shadow-purple-500/30 transition-all flex items-center justify-center gap-2 transform hover:-translate-y-1"
                        >
                            <Share2 className="w-5 h-5" />
                            공유하기
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HoguTest;
