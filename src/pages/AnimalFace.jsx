import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Share2, RefreshCw, Dog, Cat, Fish, Rabbit } from 'lucide-react';

const AnimalFace = () => {
    const [step, setStep] = useState(0);
    const [scores, setScores] = useState({
        puppy: 0,
        cat: 0,
        rabbit: 0,
        bear: 0,
        fox: 0
    });
    const [result, setResult] = useState(null);

    const questions = [
        {
            id: 1,
            question: "당신의 눈매는 어떤 느낌인가요?",
            answers: [
                { text: "크고 동그란 순한 눈", type: "puppy", score: 2 },
                { text: "가로로 길고 날카로운 눈", type: "cat", score: 2 },
                { text: "웃을 때 반달이 되는 눈", type: "fox", score: 2 },
                { text: "초롱초롱하고 맑은 눈", type: "rabbit", score: 2 }
            ]
        },
        {
            id: 2,
            question: "가장 듣고 싶은 칭찬은 무엇인가요?",
            answers: [
                { text: "귀엽고 사랑스럽다", type: "puppy", score: 2 },
                { text: "도도하고 매력있다", type: "cat", score: 2 },
                { text: "섹시하고 분위기 있다", type: "fox", score: 2 },
                { text: "듬직하고 포근하다", type: "bear", score: 2 }
            ]
        },
        {
            id: 3,
            question: "연애 스타일은 어떤가요?",
            answers: [
                { text: "항상 붙어있고 싶어하는 애교쟁이", type: "puppy", score: 2 },
                { text: "밀당의 고수, 잡힐 듯 잡히지 않는 스타일", type: "cat", score: 2 },
                { text: "상대를 홀리는 치명적인 매력", type: "fox", score: 2 },
                { text: "한결같이 챙겨주는 우직한 스타일", type: "bear", score: 2 }
            ]
        },
        {
            id: 4,
            question: "주변 사람들이 말하는 당신의 이미지는?",
            answers: [
                { text: "활발하고 밝은 에너지", type: "rabbit", score: 2 },
                { text: "차분하고 신비로운 분위기", type: "cat", score: 1 },
                { text: "친근하고 편안한 느낌", type: "puppy", score: 1 },
                { text: "묵직하고 신뢰가 가는 느낌", type: "bear", score: 2 }
            ]
        },
        {
            id: 5,
            question: "본인의 얼굴형과 가장 가까운 것은?",
            answers: [
                { text: "동글동글한 얼굴", type: "rabbit", score: 1 },
                { text: "날렵한 브이라인", type: "fox", score: 2 },
                { text: "약간 각진 편이거나 둥근 편", type: "bear", score: 1 },
                { text: "계란형", type: "puppy", score: 1 }
            ]
        },
        {
            id: 6,
            question: "어디선가 시선이 느껴진다. 당신의 행동은?",
            answers: [
                { text: "눈이 마주치면 생글생글 웃는다", type: "puppy", score: 2 },
                { text: "누구지? 하고 빤히 쳐다본다", type: "rabbit", score: 2 },
                { text: "모르는 척 도도하게 할 일을 한다", type: "cat", score: 2 },
                { text: "신경 쓰지 않고 묵묵히 있는다", type: "bear", score: 2 }
            ]
        },
        {
            id: 7,
            question: "친구들과 놀 때 당신의 포지션은?",
            answers: [
                { text: "분위기 메이커! 나서서 분위기를 띄운다", type: "rabbit", score: 1 },
                { text: "조용히 있다가 팩폭 날리는 스타일", type: "cat", score: 1 },
                { text: "모두를 챙겨주는 리더 겸 엄마/아빠", type: "bear", score: 2 },
                { text: "그냥 친구들이 하는 대로 잘 따라가는 편", type: "puppy", score: 1 }
            ]
        }
    ];

    const animals = {
        puppy: {
            name: "멍뭉미 넘치는 강아지상",
            description: "순둥순둥하고 귀여운 매력의 소유자시군요! 사람을 좋아하고 정이 많아 주변에 항상 사람이 끊이지 않습니다. 웃는 모습이 매력적이며 누구나 쉽게 다가갈 수 있는 편안한 인상을 가지고 있어요.",
            traits: ["#다정다감", "#애교만점", "#인싸재질", "#사랑둥이"],
            color: "text-amber-500",
            icon: Dog,
            bg: "bg-amber-100 dark:bg-amber-900/30",
            match: "고양이상"
        },
        cat: {
            name: "도도하고 시크한 고양이상",
            description: "날카로운 듯하지만 알고 보면 매력 덩어리! 처음엔 차가워 보일 수 있지만 친해지면 헤어 나올 수 없는 반전 매력을 가지고 계시네요. 세련되고 도시적인 분위기가 돋보입니다.",
            traits: ["#츤데레", "#반전매력", "#세련됨", "#도도함"],
            color: "text-indigo-500",
            icon: Cat,
            bg: "bg-indigo-100 dark:bg-indigo-900/30",
            match: "강아지상"
        },
        rabbit: {
            name: "상큼발랄 귀여운 토끼상",
            description: "호기심 많고 활동적인 당신! 맑고 초롱초롱한 눈망울이 매력 포인트입니다. 언제나 생기 있고 발랄한 에너지를 뿜어내어 주변 사람들의 기분까지 좋게 만드는 해피 바이러스예요.",
            traits: ["#호기심왕", "#상큼발랄", "#분위기메이커", "#동안외모"],
            color: "text-pink-500",
            icon: Rabbit,
            bg: "bg-pink-100 dark:bg-pink-900/30",
            match: "곰상"
        },
        bear: {
            name: "우직하고 포근한 곰상",
            description: "듬직하고 신뢰가 가는 인상의 소유자! 묵묵히 곁을 지켜주는 든든함 덕분에 이성에게 인기가 많습니다. 푸근하고 여유로운 성격으로 주변 사람들에게 편안함을 줍니다.",
            traits: ["#듬직함", "#배려왕", "#순정파", "#편안함"],
            color: "text-stone-600",
            icon: Dog,
            bg: "bg-stone-100 dark:bg-stone-800/50",
            match: "토끼상"
        },
        fox: {
            name: "치명적인 매력의 여우상",
            description: "사람을 홀리는 치명적인 매력을 가졌군요! 눈치가 빠르고 센스가 넘쳐 어디서나 사랑받는 스타일입니다. 자신의 매력을 잘 알고 적재적소에 활용할 줄 아는 연애 고수일지도?",
            traits: ["#매력쟁이", "#눈치백단", "#센스쟁이", "#플러팅고수"],
            color: "text-red-500",
            icon: Cat, // Using Cat icon as proxy for Fox
            bg: "bg-red-100 dark:bg-red-900/30",
            match: "곰상"
        }
    };

    const handleAnswer = (type, score) => {
        setScores(prev => ({
            ...prev,
            [type]: prev[type] + score
        }));

        if (step < questions.length - 1) {
            setStep(step + 1);
        } else {
            calculateResult();
            setStep(questions.length);
        }
    };

    const calculateResult = () => {
        const sorted = Object.entries(scores).sort(([, a], [, b]) => b - a);
        // Add current answer score before sorting potentially, but here we do it in handleAnswer.
        // Wait, state update is async. Better to calculate with final input.
        // Actually for simplicity in this engaging UI, let's just pick the max from state + current click logic if needed.
        // For now, let's trust the state accumulation after a small delay or pass the final calc.

        // Simpler approach: Determine result based on final scores state.
        // Since state update is scheduled, we need to be careful.
        // Let's do a simple calculation: find the key with max value.
        // To fix state lag, we can rely on result calculation after last step render or use a temp variable.
        // BUT `handleAnswer` updates state, and next render sees `step` incremented.
        // We will calculating in `useEffect` when step reaches end? Or just calculate here.
        // Let's use a standard "Finish" transition.
    };

    // Correct way to handle final score:
    const handleFinalAnswer = (type, score) => {
        const finalScores = { ...scores, [type]: scores[type] + score };
        setScores(finalScores);

        const winner = Object.entries(finalScores).sort((a, b) => b[1] - a[1])[0][0];
        setResult(winner);
        setStep(questions.length);
    };

    const resetTest = () => {
        setStep(0);
        setScores({ puppy: 0, cat: 0, rabbit: 0, bear: 0, fox: 0 });
        setResult(null);
    };

    const shareResult = () => {
        if (navigator.share) {
            navigator.share({
                title: '동물상 테스트',
                text: `나의 동물상 결과는: ${animals[result].name}`,
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
                <title>동물상 테스트 | 나는 강아지상? 고양이상? - Utility Hub</title>
                <meta name="description" content="간단한 테스트로 알아보는 나의 동물상! 강아지상, 고양이상, 여우상, 토끼상, 곰상 중 나는 어떤 스타일일까요?" />
                <meta name="keywords" content="동물상테스트, 강아지상, 고양이상, 여우상, 관상테스트, 인상테스트" />
            </Helmet>

            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4 animate-fade-in">
                    🦊 동물상 테스트 🐶
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300">
                    재미로 보는 나의 이미지 동물 찾기
                </p>
            </div>

            <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden p-8 transition-all duration-300 min-h-[500px] flex flex-col justify-center">
                {step < questions.length ? (
                    <div className="animate-fade-in">
                        <div className="mb-8 flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-500">Question {step + 1} / {questions.length}</span>
                            <div className="w-1/2 h-2 bg-gray-200 rounded-full">
                                <div
                                    className="h-full bg-indigo-500 rounded-full transition-all duration-300"
                                    style={{ width: `${((step + 1) / questions.length) * 100}%` }}
                                ></div>
                            </div>
                        </div>

                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-8 text-center leading-relaxed">
                            {questions[step]?.question}
                        </h2>

                        <div className="space-y-4">
                            {questions[step]?.answers.map((answer, index) => (
                                <button
                                    key={index}
                                    onClick={() => step === questions.length - 1 ? handleFinalAnswer(answer.type, answer.score) : handleAnswer(answer.type, answer.score)}
                                    className="w-full p-6 text-lg text-left bg-gray-50 dark:bg-gray-700 hover:bg-indigo-50 dark:hover:bg-gray-600 border-2 border-transparent hover:border-indigo-500 rounded-2xl transition-all duration-200 transform hover:-translate-y-1"
                                >
                                    {answer.text}
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="text-center animate-scale-in">
                        <div className={`inline-block p-6 rounded-full ${animals[result].bg} mb-6`}>
                            {React.createElement(animals[result].icon, { className: `w-20 h-20 ${animals[result].color}` })}
                        </div>

                        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                            당신은 <span className={animals[result].color}>{animals[result].name}</span>
                        </h2>

                        <div className="flex flex-wrap justify-center gap-2 mb-6">
                            {animals[result].traits.map((trait, i) => (
                                <span key={i} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm font-medium text-gray-600 dark:text-gray-300">
                                    {trait}
                                </span>
                            ))}
                        </div>

                        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed whitespace-pre-wrap px-4 bg-gray-50 dark:bg-gray-700/50 py-6 rounded-2xl">
                            {animals[result].description}
                        </p>

                        <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-xl mb-8">
                            <span className="text-sm text-gray-500 dark:text-gray-400 block mb-1">환상의 짝꿍</span>
                            <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">❤️ {animals[result].match}</span>
                        </div>

                        <div className="flex gap-4 justify-center">
                            <button
                                onClick={resetTest}
                                className="flex items-center px-6 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-xl font-bold transition-all"
                            >
                                <RefreshCw className="w-5 h-5 mr-2" />
                                다시하기
                            </button>
                            <button
                                onClick={shareResult}
                                className="flex items-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/30 transition-all transform hover:-translate-y-1"
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
                    <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-2">💡 동물상 테스트에 대하여</h3>
                    <p>
                        동물상 테스트는 얼굴의 특징과 성격적 성향을 종합하여 가장 유사한 동물 이미지를 찾아주는 심리/관상 테스트입니다.
                        강아지상은 귀엽고 사랑스러운 매력을, 고양이상은 도도하고 세련된 매력을 상징합니다.
                        그 외에도 여우상, 토끼상, 곰상 등 다양한 매력을 가진 동물 유형을 확인해보세요.
                        이 테스트는 재미를 위해 제작되었으며, 정확한 관상학적 결과와는 차이가 있을 수 있습니다.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AnimalFace;
