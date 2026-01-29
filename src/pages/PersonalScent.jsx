import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Share2, RefreshCw, Wind, Leaf, Sun, Droplet, Star } from 'lucide-react';

const PersonalScent = () => {
    const [step, setStep] = useState(0);
    const [scores, setScores] = useState({
        soap: 0,
        woody: 0,
        floral: 0,
        citrus: 0,
        musk: 0
    });
    const [result, setResult] = useState(null);

    const questions = [
        {
            id: 1,
            question: "가장 좋아하는 계절의 분위기는?",
            answers: [
                { text: "햇살이 내리쬐는 싱그러운 여름", type: "citrus", score: 2 },
                { text: "포근하고 따뜻한 봄바람", type: "floral", score: 2 },
                { text: "낙엽 지는 차분한 가을 숲", type: "woody", score: 2 },
                { text: "깨끗하고 하얀 겨울 눈", type: "soap", score: 2 }
            ]
        },
        {
            id: 2,
            question: "당신의 옷장 속 주된 컬러는?",
            answers: [
                { text: "흰색, 아이보리 등 깔끔한 톤", type: "soap", score: 2 },
                { text: "브라운, 카키 등 자연의 색", type: "woody", score: 2 },
                { text: "파스텔, 핑크 등 화사한 색", type: "floral", score: 2 },
                { text: "블랙, 그레이 등 무채색", type: "musk", score: 2 }
            ]
        },
        {
            id: 3,
            question: "주말 오후, 당신이 있고 싶은 장소는?",
            answers: [
                { text: "갓 세탁한 이불 속", type: "soap", score: 2 },
                { text: "꽃이 만발한 정원", type: "floral", score: 2 },
                { text: "상큼한 과일 음료가 있는 카페", type: "citrus", score: 2 },
                { text: "조용하고 아늑한 서재", type: "woody", score: 2 }
            ]
        },
        {
            id: 4,
            question: "자신을 표현하는 단어는?",
            answers: [
                { text: "상큼함, 활발함", type: "citrus", score: 2 },
                { text: "우아함, 부드러움", type: "musk", score: 2 },
                { text: "차분함, 지적임", type: "woody", score: 2 },
                { text: "러블리, 낭만적", type: "floral", score: 2 }
            ]
        },
        {
            id: 5,
            question: "선호하는 데이트 스타일은?",
            answers: [
                { text: "한강에서 치맥하며 수다 떨기", type: "citrus", score: 1 },
                { text: "분위기 좋은 레스토랑 코스 요리", type: "musk", score: 2 },
                { text: "손 잡고 꽃길 산책하기", type: "floral", score: 2 },
                { text: "집에서 넷플릭스 보며 뒹굴기", type: "soap", score: 2 }
            ]
        },
        {
            id: 6,
            question: "스트레스 받을 때 당신의 해소법은?",
            answers: [
                { text: "맛있는 디저트 먹기", type: "floral", score: 1 },
                { text: "신나는 음악 듣고 드라이브", type: "citrus", score: 2 },
                { text: "따뜻한 물로 반신욕", type: "soap", score: 2 },
                { text: "혼자만의 명상 시간", type: "woody", score: 2 }
            ]
        },
        {
            id: 7,
            question: "이성에게 어필하고 싶은 나의 매력은?",
            answers: [
                { text: "지켜주고 싶은 청순함", type: "soap", score: 1 },
                { text: "깊이를 알 수 없는 관능미", type: "musk", score: 2 },
                { text: "같이 있으면 즐거운 유쾌함", type: "citrus", score: 2 },
                { text: "기대고 싶은 든든함", type: "woody", score: 1 }
            ]
        }
    ];

    const scents = {
        soap: {
            name: "깨끗한 비누향 (Soap/Cotton)",
            description: "방금 씻고 나온 듯한 청량하고 깨끗한 느낌을 주는 당신! 순수하고 단정한 이미지를 가지고 있으며, 꾸며낸 모습보다는 자연스러운 매력을 선호합니다. 호불호 없이 누구나 편안하게 느끼는 향입니다.",
            notes: ["화이트 머스크", "코튼", "릴리", "알데하이드"],
            color: "text-sky-500",
            icon: Droplet,
            bg: "bg-sky-100 dark:bg-sky-900/30",
            recommend: "클린 웜코튼, 바이레도 블랑쉬"
        },
        woody: {
            name: "그윽한 우디향 (Woody/Earthy)",
            description: "숲속의 나무처럼 차분하고 깊은 분위기를 가진 당신. 지적이고 신뢰감을 주는 이미지를 선호하며, 가볍지 않은 묵직한 존재감이 매력입니다. 마음을 진정시켜주는 편안한 향이 잘 어울립니다.",
            notes: ["샌달우드", "시더우드", "베티버", "패출리"],
            color: "text-emerald-700",
            icon: Leaf,
            bg: "bg-emerald-100 dark:bg-emerald-900/30",
            recommend: "딥티크 탐다오, 이솝 휠"
        },
        floral: {
            name: "우아한 플로럴향 (Floral)",
            description: "꽃처럼 화사하고 사랑스러운 매력의 소유자! 낭만적이고 감수성이 풍부하며, 부드러운 여성미/남성미를 가지고 있습니다. 격식 있는 자리나 데이트에 특히 잘 어울리는 향입니다.",
            notes: ["장미", "재스민", "작약", "프리지아"],
            color: "text-pink-500",
            icon: Sun,
            bg: "bg-pink-100 dark:bg-pink-900/30",
            recommend: "디올 미스디올, 조말론 피오니 앤 블러쉬"
        },
        citrus: {
            name: "상큼한 시트러스향 (Citrus)",
            description: "톡톡 튀는 비타민 같은 상큼한 매력을 가진 당신! 긍정적이고 활기찬 에너지로 주변을 밝게 만듭니다. 무거운 향보다는 가볍고 시원한 향이 당신의 에너지를 더욱 돋보이게 합니다.",
            notes: ["레몬", "오렌지", "자몽", "베르가못"],
            color: "text-orange-500",
            icon: Wind,
            bg: "bg-orange-100 dark:bg-orange-900/30",
            recommend: "조말론 라임바질, 아틀리에 코롱 포멜로"
        },
        musk: {
            name: "관능적인 머스크향 (Musk/Vanilla)",
            description: "부드럽지만 강렬한 여운을 남기는 매혹적인 당신. 포근하면서도 섹시한 분위기를 동시에 가지고 있어 타인을 끌어당기는 힘이 있습니다. 살냄새처럼 은은하게 퍼지는 향이 잘 어울립니다.",
            notes: ["머스크", "바닐라", "앰버", "통카빈"],
            color: "text-purple-600",
            icon: Star,
            bg: "bg-purple-100 dark:bg-purple-900/30",
            recommend: "딥티크 플레르드뽀, 톰포드 화이트스웨이드"
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
            // Need to calculate here correctly or use separate finalize function?
            // Let's use handleFinalAnswer pattern again for consistency
        }
    };

    const handleFinalAnswer = (type, score) => {
        const finalScores = { ...scores, [type]: scores[type] + score };
        setScores(finalScores);

        const winner = Object.entries(finalScores).sort((a, b) => b[1] - a[1])[0][0];
        setResult(winner);
        setStep(questions.length);
    };

    const resetTest = () => {
        setStep(0);
        setScores({ soap: 0, woody: 0, floral: 0, citrus: 0, musk: 0 });
        setResult(null);
    };

    const shareResult = () => {
        if (navigator.share) {
            navigator.share({
                title: '나만의 향기 테스트',
                text: `나에게 어울리는 향기는: ${scents[result].name}`,
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
                <title>나만의 향기 테스트 | 퍼스널 향수 추천 - Utility Hub</title>
                <meta name="description" content="나의 분위기와 성격에 딱 맞는 향수는? 간단한 테스트로 알아보는 퍼스널 향기 찾기! 비누향, 우디향, 플로럴향, 시트러스향, 머스크향 추천." />
                <meta name="keywords" content="향수테스트, 향기테스트, 퍼스널향수, 향수추천, 심리테스트" />
            </Helmet>

            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4 animate-fade-in">
                    🌸 나만의 향기 테스트 🌿
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300">
                    나의 분위기에 찰떡인 향수는 무엇일까요?
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
                        <div className={`inline-block p-6 rounded-full ${scents[result].bg} mb-6`}>
                            {React.createElement(scents[result].icon, { className: `w-20 h-20 ${scents[result].color}` })}
                        </div>

                        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                            당신의 향기는 <span className={scents[result].color}>{scents[result].name}</span>
                        </h2>

                        <div className="flex flex-wrap justify-center gap-2 mb-6">
                            {scents[result].notes.map((note, i) => (
                                <span key={i} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm font-medium text-gray-600 dark:text-gray-300">
                                    {note}
                                </span>
                            ))}
                        </div>

                        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed whitespace-pre-wrap px-4 bg-gray-50 dark:bg-gray-700/50 py-6 rounded-2xl">
                            {scents[result].description}
                        </p>

                        <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-xl mb-8">
                            <span className="text-sm text-gray-500 dark:text-gray-400 block mb-1">추천 향수</span>
                            <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">{scents[result].recommend}</span>
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
                    <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-2">💡 퍼스널 향기 테스트에 대하여</h3>
                    <p>
                        퍼스널 향기 테스트는 개인의 취향, 성격, 라이프스타일을 분석하여 가장 잘 어울리는 향기 계열을 추천해주는 서비스입니다.
                        내가 좋아하는 계절, 옷 스타일, 휴식 공간 등을 통해 비누향, 우디향, 플로럴향, 시트러스향, 머스크향 등 대표적인 5가지 향기 타입 중 하나를 찾아드립니다.
                        나에게 딱 맞는 향수를 찾고 싶거나 나의 분위기를 알고 싶을 때 이용해보세요.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PersonalScent;
