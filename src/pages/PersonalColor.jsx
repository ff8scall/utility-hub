import React, { useState, useRef, useCallback } from 'react';
import { Download, Share2, RefreshCw, Check, Sparkles, Palette, User, Heart, Activity, Flame, X } from 'lucide-react';
import { domToPng } from 'modern-screenshot';
import SEO from '../components/SEO';
import ToolGuide from '../components/ToolGuide';

const PersonalColor = () => {
    const [step, setStep] = useState(0); // 0: Start, 1: Quiz, 2: Result
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState([]);
    const resultRef = useRef(null);

    const questions = [
        {
            q: "당신의 피부 톤은 어떤 쪽에 더 가깝나요?",
            options: [
                { text: "노란기가 도는 따뜻한 톤", value: "warm" },
                { text: "붉은기가 도는 차가운 톤", value: "cool" }
            ],
            icon: Palette
        },
        {
            q: "손목 안쪽의 혈관 색상은 어떤가요?",
            options: [
                { text: "초록색 혹은 올리브색", value: "warm" },
                { text: "파란색 혹은 보라색", value: "cool" }
            ],
            icon: Activity
        },
        {
            q: "골드 주얼리와 실버 주얼리 중 무엇이 더 잘 어울리나요?",
            options: [
                { text: "골드 (얼굴이 화사해짐)", value: "warm" },
                { text: "실버 (피부가 깨끗해 보임)", value: "cool" }
            ],
            icon: Sparkles
        },
        {
            q: "햇볕에 탔을 때 피부가 어떻게 변하나요?",
            options: [
                { text: "가무잡잡하게 구릿빛으로 탄다", value: "warm" },
                { text: "빨갛게 익고 금방 가라앉거나 벗겨진다", value: "cool" }
            ],
            icon: Flame
        },
        {
            q: "천천히 거울을 봤을 때, 눈동자 색은 어떤가요?",
            options: [
                { text: "밝은 갈색 혹은 부드러운 갈색", value: "warm" },
                { text: "진한 고동색 혹은 푸른빛 도는 검정", value: "cool" }
            ],
            icon: User
        },
        {
            q: "내추럴 헤어 컬러(자연모)는 어떤 빛인가요?",
            options: [
                { text: "부드러운 갈색 혹은 노란빛 도는 갈색", value: "warm" },
                { text: "푸른빛이 도는 흑색 혹은 아주 짙은 고동색", value: "cool" }
            ],
            icon: Palette
        },
        {
            q: "피치/오렌지 립과 핑크/로즈 립 중 더 잘 받는 것은?",
            options: [
                { text: "오렌지, 코랄, 피치 계열", value: "warm" },
                { text: "핑크, 마젠타, 푸시아 계열", value: "cool" }
            ],
            icon: Heart
        },
        {
            q: "주변에서 어떤 이미지가 더 강하다는 말을 듣나요?",
            options: [
                { text: "생기 있고 친근한, 혹은 지적인 느낌", value: "light" },
                { text: "깨끗하고 부드러운, 혹은 세련된 느낌", value: "mute" }
            ],
            icon: Sparkles
        },
        {
            q: "당신이 선호하는 의상의 명도는 어떤가요?",
            options: [
                { text: "밝고 선명한 원색 혹은 파스텔 톤", value: "bright" },
                { text: "차분하고 깊이 있는 어두운 톤이나 탁색", value: "deep" }
            ],
            icon: Palette
        },
        {
            q: "메이크업을 할 때 어떤 메이크업이 더 잘 어울리나요?",
            options: [
                { text: "가볍고 투명한, 혹은 화사한 메이크업", value: "light" },
                { text: "음영이 깊은, 혹은 매트하고 선명한 메이크업", value: "mute" }
            ],
            icon: User
        }
    ];

    const results = {
        spring: {
            name: "봄 웜톤 (Spring Warm)",
            description: "생기 넘치고 발랄한 에너지를 가진 당신! 따뜻하고 밝은 컬러들이 당신의 얼굴을 가장 화사하게 밝혀줍니다.",
            colors: ["#FFB7C5", "#FFD700", "#FF7F50", "#98FB98"],
            colorNames: ["Peach", "Bright Gold", "Coral", "Yellow Green"],
            tips: "아이보리나 베이지 기본에 코랄 컬러로 생기를 더해보세요. 골드 주얼리가 찰떡입니다!",
            best: ["살구색", "노란색", "코랄핑크", "연둣빛"],
            worst: ["무거운 검정", "푸른빛 도는 핫핑크", "탁한 그레이"]
        },
        summer: {
            name: "여름 쿨톤 (Summer Cool)",
            description: "깨끗하고 청초하며 시원한 분위기를 가진 당신! 부드러우면서도 차가운 파스텔 톤이 당신의 피부를 투명하게 만들어줍니다.",
            colors: ["#E6E6FA", "#F08080", "#ADD8E6", "#C0C0C0"],
            colorNames: ["Lavender", "Light Rose", "Sky Blue", "Soft Silver"],
            tips: "화이트나 블루 베이스의 파스텔 톤을 활용해 보세요. 실버 주얼리가 당신의 맑은 피부를 돋보이게 합니다.",
            best: ["라벤더", "스카이블루", "밀키화이트", "로즈핑크"],
            worst: ["금색(골드)", "주황색", "카키색", "딥 브라운"]
        },
        autumn: {
            name: "가을 웜톤 (Autumn Warm)",
            description: "성숙하고 우아하며 그윽한 매력을 가진 당신! 깊이 있고 차분한 대지의 컬러들이 당신의 아우라를 완성해줍니다.",
            colors: ["#E2725B", "#FFDB58", "#3CB371", "#8B4513"],
            colorNames: ["Terracotta", "Mustard", "Deep Green", "Rich Brown"],
            tips: "음영 메이크업과 매트한 텍스처가 아주 잘 어울립니다. 골드나 앤티크한 소품을 활용해 보세요.",
            best: ["베이지", "머스타드", "올리브 그린", "벽돌색"],
            worst: ["선명한 블루", "라벤더", "순백색(화이트)"]
        },
        winter: {
            name: "겨울 쿨톤 (Winter Cool)",
            description: "선명하고 도시적이며 카리스마 넘치는 당신! 강렬한 원색이나 아예 차가운 컬러들이 당신의 이목구비를 뚜렷하게 해줍니다.",
            colors: ["#FF00FF", "#000080", "#FFFFFF", "#000000"],
            colorNames: ["Magenta", "Navy", "Pure White", "Jet Black"],
            tips: "대비감이 큰 코디(블랙&화이트)가 베스트입니다. 화려한 실버나 다이아몬드 느낌의 액세서리를 추천해요.",
            best: ["블랙", "네이비", "레몬옐로우", "마젠타"],
            worst: ["주황색", "살구색", "카멜색", "머스타드"]
        }
    };

    const handleAnswer = (value) => {
        const newAnswers = [...answers, value];
        setAnswers(newAnswers);

        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        } else {
            setStep(2);
        }
    };

    const getFinalResult = () => {
        let warmCount = 0;
        let coolCount = 0;
        let lightCount = 0;
        let muteCount = 0;

        answers.forEach(ans => {
            if (ans === 'warm') warmCount++;
            if (ans === 'cool') coolCount++;
            if (ans === 'light' || ans === 'bright') lightCount++;
            if (ans === 'mute' || ans === 'deep') muteCount++;
        });

        const isWarm = warmCount >= coolCount;
        const isLight = lightCount >= muteCount;

        if (isWarm) {
            return isLight ? 'spring' : 'autumn';
        } else {
            return isLight ? 'summer' : 'winter';
        }
    };

    const resultType = step === 2 ? getFinalResult() : null;
    const currentResult = results[resultType];

    const saveAsImage = useCallback(async () => {
        if (!resultRef.current) return;
        try {
            const dataUrl = await domToPng(resultRef.current, {
                backgroundColor: '#ffffff',
                scale: 2
            });
            const link = document.createElement('a');
            link.download = `tool-hive-personal-color-${resultType}.png`;
            link.href = dataUrl;
            link.click();
        } catch (err) {
            console.error('Image saving failed:', err);
        }
    }, [resultType]);

    const resetTest = () => {
        setStep(1);
        setCurrentQuestion(0);
        setAnswers([]);
    };

    const personalFaqs = [
        { q: "퍼스널 컬러 진단은 꼭 전문가에게 받아야 하나요?", a: "전문가의 진단이 가장 정확하지만, 자가 진단을 통해 자신에게 어울리는 대략적인 색상 범위를 파악하는 것만으로도 패션과 메이크업에 큰 도움이 됩니다." },
        { q: "계절이 바뀌면 퍼스널 컬러도 변하나요?", a: "퍼스널 컬러는 타고난 신체 색상(피부, 눈동자, 머리카락)을 기반으로 하므로 쉽게 변하지 않습니다. 다만 노화나 환경에 의해 피부 톤이 미세하게 변할 수는 있습니다." },
        { q: "진단 결과가 평소 좋아하는 색과 달라요.", a: "좋아하는 색과 어울리는 색은 다를 수 있습니다. 피해야 할 색상(Worst)을 얼굴에서 멀리하고, 하의나 소품 등으로 활용하는 지혜가 필요합니다." }
    ];

    const personalSteps = [
        "자연광 아래에서 거울을 준비합니다.",
        "제시되는 10가지 질문에 평소 자신의 특징을 생각하며 정직하게 답변합니다.",
        "진단 결과를 확인하고 나만의 베스트 컬러들을 체크합니다.",
        "결과 카드를 이미지로 저장하여 어울리는 옷을 살 때 참고하거나 SNS에 공유합니다."
    ];

    return (
        <div className="max-w-4xl mx-auto px-4 py-8 space-y-12">
            <SEO
                title="무료 퍼스널 컬러 자가 진단 | 웜톤 쿨톤 테스트"
                description="간편한 설문을 통해 나의 퍼스널 컬러를 찾아보세요. 봄웜, 여름쿨, 가을웜, 겨울쿨 타입별 베스트 컬러와 메이크업 팁을 제공합니다."
                keywords="퍼스널컬러자가진단, 웜톤쿨톤테스트, 퍼스널컬러테스트, 무료퍼스널컬러, 봄웜여름쿨, 스타일추천"
                category="운세/재미"
                faqs={personalFaqs}
                steps={personalSteps}
            />

            {step === 0 && (
                <div className="text-center space-y-8 py-20 bg-gradient-to-br from-primary/5 to-purple-500/5 rounded-3xl border border-primary/10 animate-in fade-in zoom-in duration-500">
                    <div className="inline-flex p-5 rounded-3xl bg-primary/10 text-primary mb-4">
                        <Palette size={64} />
                    </div>
                    <div className="space-y-4">
                        <h1 className="text-4xl md:text-5xl font-black">나만의 퍼스널 컬러 찾기</h1>
                        <p className="text-xl text-muted-foreground max-w-xl mx-auto leading-relaxed">
                            나를 가장 빛나게 해줄 인생 컬러를 찾아보세요.<br /> 1분 만에 끝나는 정확한 자가 진단 테스트!
                        </p>
                    </div>
                    <button
                        onClick={() => setStep(1)}
                        className="px-10 py-4 bg-primary text-white rounded-full text-xl font-bold hover:scale-105 transition-transform shadow-xl shadow-primary/20"
                    >
                        테스트 시작하기
                    </button>
                    <div className="flex justify-center gap-6 text-sm text-muted-foreground pt-4">
                        <span className="flex items-center gap-1">10문항</span>
                        <span className="flex items-center gap-1">1분 소요</span>
                        <span className="flex items-center gap-1">이미지 저장 가능</span>
                    </div>
                </div>
            )}

            {step === 1 && (
                <div className="space-y-8 animate-in slide-in-from-right-8 duration-300">
                    <div className="flex justify-between items-center px-2">
                        <span className="text-sm font-bold text-primary">질문 {currentQuestion + 1} / {questions.length}</span>
                        <div className="w-64 h-2 bg-muted rounded-full overflow-hidden">
                            <div
                                className="h-full bg-primary transition-all duration-300"
                                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                            ></div>
                        </div>
                    </div>

                    <div className="bg-card border border-border rounded-3xl p-10 space-y-8 shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                                {React.createElement(questions[currentQuestion].icon, { size: 28 })}
                            </div>
                            <h2 className="text-2xl font-bold leading-tight">
                                {questions[currentQuestion].q}
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            {questions[currentQuestion].options.map((option, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleAnswer(option.value)}
                                    className="p-6 text-left rounded-2xl border-2 border-border hover:border-primary hover:bg-primary/5 transition-all group flex justify-between items-center"
                                >
                                    <span className="text-lg font-medium group-hover:text-primary transition-colors">{option.text}</span>
                                    <div className="w-6 h-6 rounded-full border-2 border-border group-hover:border-primary flex items-center justify-center">
                                        <div className="w-3 h-3 rounded-full bg-primary scale-0 group-hover:scale-100 transition-transform"></div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {step === 2 && currentResult && (
                <div className="space-y-10 animate-in fade-in duration-700">
                    {/* Result Card for Capture */}
                    <div
                        ref={resultRef}
                        className="bg-white dark:bg-slate-900 border border-border rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden"
                    >
                        {/* Decorative Background */}
                        <div className="absolute top-0 right-0 w-64 h-64 opacity-20 blur-[100px] rounded-full" style={{ backgroundColor: currentResult.colors[0] }}></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 opacity-20 blur-[100px] rounded-full" style={{ backgroundColor: currentResult.colors[2] }}></div>

                        <div className="relative space-y-10">
                            <div className="text-center space-y-4">
                                <span className="px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-bold uppercase tracking-widest">PERSONAL COLOR RESULT</span>
                                <h2 className="text-4xl md:text-5xl font-black">{currentResult.name}</h2>
                            </div>

                            <div className="bg-muted/30 rounded-3xl p-6 text-center italic text-lg leading-relaxed">
                                "{currentResult.description}"
                            </div>

                            <div className="space-y-6">
                                <h3 className="text-xl font-bold flex items-center gap-2">
                                    <Palette className="w-6 h-6 text-primary" />
                                    당신을 빛내줄 Best Color Palette
                                </h3>
                                <div className="grid grid-cols-4 gap-4">
                                    {currentResult.colors.map((color, i) => (
                                        <div key={i} className="space-y-2 text-center">
                                            <div className="aspect-square rounded-2xl shadow-inner border border-black/5" style={{ backgroundColor: color }}></div>
                                            <span className="text-[10px] md:text-xs font-bold text-muted-foreground uppercase">{currentResult.colorNames[i]}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="p-6 bg-green-500/5 border border-green-500/10 rounded-2xl space-y-3">
                                    <h4 className="font-bold text-green-600 flex items-center gap-2">
                                        <Sparkles size={18} /> Best Colors
                                    </h4>
                                    <div className="flex flex-wrap gap-2 text-sm">
                                        {currentResult.best.map((c, i) => (
                                            <span key={i} className="px-3 py-1 bg-white dark:bg-slate-800 rounded-lg shadow-sm">{c}</span>
                                        ))}
                                    </div>
                                </div>
                                <div className="p-6 bg-red-500/5 border border-red-500/10 rounded-2xl space-y-3">
                                    <h4 className="font-bold text-red-600 flex items-center gap-2">
                                        <Palette size={18} /> Worst Colors
                                    </h4>
                                    <div className="flex flex-wrap gap-2 text-sm">
                                        {currentResult.worst.map((c, i) => (
                                            <span key={i} className="px-3 py-1 bg-white dark:bg-slate-800 rounded-lg shadow-sm">{c}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="p-8 bg-primary/5 border border-primary/10 rounded-3xl space-y-3">
                                <h4 className="font-bold text-primary flex items-center gap-2 text-lg">
                                    <Sparkles size={20} /> 전문가의 코디 한마디
                                </h4>
                                <p className="text-muted-foreground leading-relaxed">
                                    {currentResult.tips}
                                </p>
                            </div>

                            <div className="pt-8 text-center border-t border-dashed border-border flex flex-col items-center">
                                <p className="text-xs text-muted-foreground font-medium mb-2">분석 완료 | Tool Hive</p>
                                <div className="text-xl font-black tracking-tighter text-primary/40">TOOL HIVE</div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap justify-center gap-4 no-print">
                        <button
                            onClick={saveAsImage}
                            className="flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-full font-bold hover:scale-105 transition-transform shadow-lg"
                        >
                            <Download size={20} /> 결과 이미지 저장
                        </button>
                        <button
                            onClick={() => {
                                if (navigator.share) {
                                    navigator.share({
                                        title: '나의 퍼스널 컬러 진단 결과',
                                        text: `나의 퍼스널 컬러는 ${currentResult.name}입니다! 당신의 컬러도 확인해보세요.`,
                                        url: window.location.href,
                                    });
                                } else {
                                    alert('링크가 복사되었습니다!');
                                    navigator.clipboard.writeText(window.location.href);
                                }
                            }}
                            className="flex items-center gap-2 px-8 py-4 bg-secondary text-foreground rounded-full font-bold hover:scale-105 transition-transform border border-border shadow-sm"
                        >
                            <Share2 size={20} /> 공유하기
                        </button>
                        <button
                            onClick={resetTest}
                            className="flex items-center gap-2 px-8 py-4 bg-card text-muted-foreground rounded-full font-bold hover:scale-105 transition-transform border border-border hover:text-foreground"
                        >
                            <RefreshCw size={20} /> 다시 테스트하기
                        </button>
                    </div>
                </div>
            )}

            <ToolGuide
                title="퍼스널 컬러 자가 진단 가이드"
                intro="퍼스널 컬러는 타고난 개인의 신체 색상과 가장 잘 어우러지는 색상의 조화를 의미합니다. 자신에게 맞는 컬러를 활용하면 얼굴이 더 생기 있고 이목구비가 뚜렷해 보이는 효과를 얻을 수 있습니다."
                steps={personalSteps}
                tips={[
                    "정확한 진단을 위해 화장을 지운 맨얼굴로 테스트하는 것을 권장합니다.",
                    "집안의 노란 조명보다는 자연광(햇빛) 아래에서 자신의 피부와 눈동자를 관찰하세요.",
                    "진단이 애매하다면 가족이나 친구에게 평소 어떤 색의 옷을 입었을 때 박수를 받았는지 물어보세요."
                ]}
                faqs={personalFaqs}
            />
        </div>
    );
};

export default PersonalColor;
