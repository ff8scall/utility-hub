import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Share2, RefreshCw, BookOpen, Scroll, CheckCircle2, XCircle } from 'lucide-react';

const VocabularyTest = () => {
    const [gameState, setGameState] = useState('start'); // start, playing, result
    const [score, setScore] = useState(0);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [isCorrect, setIsCorrect] = useState(null);

    // Question Database (Idioms and Vocabulary)
    const questions = [
        {
            question: "'심심한 사과'의 '심심하다'의 뜻은?",
            options: ["지루하고 재미없다", "마음의 표현 정도가 깊고 간절하다", "음식 맛이 싱겁다", "하는 일이 없어 무료하다"],
            answer: "마음의 표현 정도가 깊고 간절하다",
            desc: "'심심(甚深)'은 매우 깊다는 뜻입니다."
        },
        {
            question: "'사흘'은 며칠을 의미할까요?",
            options: ["3일", "4일", "5일", "30일"],
            answer: "3일",
            desc: "하루, 이틀, 사흘(3일), 나흘(4일)... 순서입니다. 4일은 나흘입니다."
        },
        {
            question: "'금일'의 뜻은?",
            options: ["금요일", "오늘", "내일", "어제"],
            answer: "오늘",
            desc: "'금일(今日)'은 '오늘'을 뜻하는 한자어입니다."
        },
        {
            question: "'고지식하다'의 뜻은?",
            options: ["지식이 높고 풍부하다", "성품이 곧고 융통성이 없다", "높은 자리에 있다", "옛날 지식만 안다"],
            answer: "성품이 곧고 융통성이 없다",
            desc: "성질이 외골수라 융통성이 없다는 뜻입니다. 지식이 많다는 뜻이 아닙니다."
        },
        {
            question: "'무료하다'의 뜻은?",
            options: ["돈을 내지 않아도 된다", "흥미가 없어 심심하고 지루하다", "없어서 부족하다", "매우 바쁘다"],
            answer: "흥미가 없어 심심하고 지루하다",
            desc: "지루함을 뜻할 때는 '무료(無聊)'를 씁니다. 공짜는 '무료(無料)'입니다."
        },
        {
            question: "'결재'와 '결제'의 차이로 올바른 것은?",
            options: ["부장님께 서류를 결제 받다", "신용카드로 결재하다", "부장님께 서류를 결재 받다", "둘 다 같은 말이다"],
            answer: "부장님께 서류를 결재 받다",
            desc: "상사에게 안건을 허가받는 것은 '결재(決裁)', 대금을 치르는 것은 '결제(決濟)'입니다."
        },
        {
            question: "'과반수'의 올바른 쓰임은?",
            options: ["과반수 이상 찬성", "과반수 이하 찬성", "과반수 찬성", "과반수 넘게 찬성"],
            answer: "과반수 찬성",
            desc: "'과반수(過半數)'는 이미 '반을 넘은 수'라는 뜻이므로 '이상', '넘게'와 같이 쓰는 것은 겹말(중복)입니다."
        },
        {
            question: "'일취월장'의 뜻은?",
            options: ["해가 지고 달이 뜸", "날마다 달마다 발전함", "일찍 취직해서 돈을 범", "한 달 동안 장사를 함"],
            answer: "날마다 달마다 발전함",
            desc: "날로 달로 발전하거나 성장한다는 뜻입니다."
        },
        {
            question: "'우천 시'는 언제일까요?",
            options: ["소(牛)가 밭을 갈 때", "비가 올 때", "날씨가 더울 때", "오른쪽으로 갈 때"],
            answer: "비가 올 때",
            desc: "'우천(雨天)'은 비가 오는 날씨를 뜻합니다."
        },
        {
            question: "'미운털이 박히다'의 뜻은?",
            options: ["몸에 털이 많이 나다", "누구에게 미움을 받게 되다", "머리카락이 빠지다", "박혀있는 털을 뽑다"],
            answer: "누구에게 미움을 받게 되다",
            desc: "남에게 미움을 받을 만한 짓을 하여 미움의 대상이 되는 것을 비유적으로 이르는 말입니다."
        }
    ];

    const startGame = () => {
        setGameState('playing');
        setScore(0);
        setCurrentQuestionIndex(0);
        setSelectedAnswer(null);
        setIsCorrect(null);
    };

    const handleAnswer = (choice) => {
        if (selectedAnswer) return;

        setSelectedAnswer(choice);
        const correct = choice === questions[currentQuestionIndex].answer;
        setIsCorrect(correct);

        if (correct) {
            setScore(prev => prev + 1);
        }

        setTimeout(() => {
            if (currentQuestionIndex < questions.length - 1) {
                setCurrentQuestionIndex(prev => prev + 1);
                setSelectedAnswer(null);
                setIsCorrect(null);
            } else {
                setGameState('result');
            }
        }, 2000); // 2 seconds to read explanation
    };

    const getRank = (finalScore) => {
        if (finalScore === 10) return { title: "어휘력 대왕", desc: "걸어다니는 국어사전이시군요!", color: "text-purple-600" };
        if (finalScore >= 8) return { title: "언어의 마술사", desc: "상당히 높은 어휘력을 가지고 계십니다.", color: "text-blue-600" };
        if (finalScore >= 5) return { title: "평범한 시민", desc: "일상 소통에 문제없는 수준입니다.", color: "text-green-600" };
        return { title: "문해력 요정", desc: "책을 조금 더 가까이 해보는 건 어떨까요?", color: "text-orange-500" };
    };

    const shareResult = () => {
        const rank = getRank(score);
        if (navigator.share) {
            navigator.share({
                title: '문해력 테스트',
                text: `나의 어휘력 점수: ${score}점 (${rank.title}) - 유틸리티 허브`,
                url: window.location.href,
            });
        } else {
            alert('링크가 복사되었습니다!');
            navigator.clipboard.writeText(window.location.href);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <Helmet>
                <title>문해력 테스트 | 사자성어 어휘력 퀴즈 - Utility Hub</title>
                <meta name="description" content="심심한 사과? 금일? 사흘? 알쏭달쏭한 어휘력 퀴즈. 나의 문해력 수준을 테스트해보세요." />
                <meta name="keywords" content="문해력, 어휘력, 사자성어, 한국어퀴즈, 문해력테스트, vocabulary test" />
            </Helmet>

            <div className="text-center mb-10">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4 animate-fade-in">
                    📚 문해력 테스트
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300">
                    심심한 사과? 사흘? 당신의 어휘력은 안녕한가요?
                </p>
            </div>

            <div className="max-w-xl mx-auto bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden p-8 transition-all duration-300 min-h-[400px] flex flex-col justify-center">

                {gameState === 'start' && (
                    <div className="text-center animate-fade-in w-full">
                        <BookOpen className="w-24 h-24 text-green-600 mx-auto mb-6" />
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">어휘력 진단 고사</h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                            최근 이슈가 되는 문해력 논란!<br />
                            나는 과연 제대로 알고 쓰고 있을까요?<br />
                            총 {questions.length}문제로 확인해보세요.
                        </p>
                        <button
                            onClick={startGame}
                            className="w-full py-4 bg-green-600 hover:bg-green-700 text-white text-xl font-bold rounded-2xl shadow-lg transition-all transform hover:-translate-y-1"
                        >
                            테스트 시작
                        </button>
                    </div>
                )}

                {gameState === 'playing' && (
                    <div className="animate-fade-in w-full">
                        <div className="flex justify-between items-center mb-6">
                            <span className="text-sm font-bold text-green-600">
                                문제 {currentQuestionIndex + 1} / {questions.length}
                            </span>
                            <span className="text-sm font-medium text-gray-400">
                                점수: {score}
                            </span>
                        </div>

                        <div className="mb-8 text-center bg-green-50 dark:bg-green-900/20 p-6 rounded-2xl border-2 border-green-100 dark:border-green-800">
                            <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white leading-relaxed break-keep">
                                {questions[currentQuestionIndex].question}
                            </h2>
                        </div>

                        <div className="space-y-3">
                            {questions[currentQuestionIndex].options.map((option, index) => {
                                const isSelected = selectedAnswer === option;
                                const isAnswer = option === questions[currentQuestionIndex].answer;

                                let btnClass = "bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-800 dark:text-white border-2 border-transparent";

                                if (selectedAnswer) {
                                    if (isSelected) {
                                        btnClass = isCorrect
                                            ? "bg-green-100 dark:bg-green-900/30 border-green-500 text-green-700 dark:text-green-300"
                                            : "bg-red-100 dark:bg-red-900/30 border-red-500 text-red-700 dark:text-red-300";
                                    } else if (isAnswer) {
                                        btnClass = "bg-green-100 dark:bg-green-900/30 border-green-500 text-green-700 dark:text-green-300 opacity-70";
                                    } else {
                                        btnClass = "opacity-50";
                                    }
                                }

                                return (
                                    <button
                                        key={index}
                                        onClick={() => handleAnswer(option)}
                                        disabled={selectedAnswer !== null}
                                        className={`w-full py-4 rounded-xl text-lg font-medium transition-all ${btnClass}`}
                                    >
                                        <div className="flex items-center justify-between px-4">
                                            <span>{option}</span>
                                            {selectedAnswer && isAnswer && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                                            {selectedAnswer && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-500" />}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        {selectedAnswer && (
                            <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-xl text-center text-sm animate-fade-in">
                                <p className="font-bold text-gray-800 dark:text-gray-200 mb-1">
                                    💡 해설
                                </p>
                                <p className="text-gray-600 dark:text-gray-400">
                                    {questions[currentQuestionIndex].desc}
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {gameState === 'result' && (
                    <div className="text-center animate-scale-in w-full">
                        <Scroll className="w-20 h-20 text-green-600 mx-auto mb-6" />

                        <div className="mb-8">
                            <span className="text-gray-500 dark:text-gray-400">최종 점수</span>
                            <div className="text-6xl font-black text-green-600 dark:text-green-400 my-2">
                                {score} <span className="text-2xl text-gray-400 font-bold">/ {questions.length}</span>
                            </div>
                        </div>

                        <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-2xl mb-8">
                            <h3 className={`text-2xl font-bold mb-2 ${getRank(score).color}`}>
                                {getRank(score).title}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                {getRank(score).desc}
                            </p>
                        </div>

                        <div className="flex gap-4 justify-center">
                            <button
                                onClick={startGame}
                                className="flex items-center px-6 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-xl font-bold transition-all"
                            >
                                <RefreshCw className="w-5 h-5 mr-2" />
                                다시하기
                            </button>
                            <button
                                onClick={shareResult}
                                className="flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold shadow-lg shadow-green-500/30 transition-all transform hover:-translate-y-1"
                            >
                                <Share2 className="w-5 h-5 mr-2" />
                                결과 공유
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                {/* SEO Content Section */}
                <div className="md:col-span-3 bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6 text-sm text-gray-600 dark:text-gray-400">
                    <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-2">💡 문해력 키우기</h3>
                    <p>
                        문해력(Literacy)은 글을 읽고 이해하는 능력입니다.
                        최근 스마트폰 영상 매체의 발달로 인해 긴 글을 읽기 어려워하는 현상이 늘어나고 있습니다.
                        정확한 어휘 사용은 소통의 오해를 줄이고 자신의 생각을 풍부하게 표현하는 데 도움을 줍니다.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default VocabularyTest;
