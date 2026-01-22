import React, { useState, useRef, useCallback } from 'react';
import { Download, Share2, RefreshCw, Heart, PawPrint, Star, Sparkles, Check, Info, Home, Zap } from 'lucide-react';
import { domToPng } from 'modern-screenshot';
import SEO from '../components/SEO';
import ToolGuide from '../components/ToolGuide';

const PetMbti = () => {
    const [step, setStep] = useState(0); // 0: Start, 1: Quiz, 2: Result
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({ E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 });
    const resultRef = useRef(null);

    const questions = [
        {
            dimension: 'EI',
            q: "새로운 사람이나 다른 동물이 집에 오면 우리 아이는?",
            options: [
                { text: "먼저 다가가 반갑게 인사하며 꼬리를 흔든다 (호기심 왕성)", value: 'E' },
                { text: "일단 숨어서 지켜보거나 구석으로 들어간다 (신중한 탐색)", value: 'I' }
            ]
        },
        {
            dimension: 'EI',
            q: "산책을 나가거나 외출했을 때 우리 아이는?",
            options: [
                { text: "처음 보는 친구들에게도 서슴없이 다가간다", value: 'E' },
                { text: "주인 곁을 떠나지 않거나 낯가림을 한다", value: 'I' }
            ]
        },
        {
            dimension: 'SN',
            q: "장난감을 가지고 놀 때 우리 아이의 스타일은?",
            options: [
                { text: "던지는 공이나 움직이는 물체에 본능적으로 반응한다 (현실 반응형)", value: 'S' },
                { text: "한참 동안 물건을 노려보거나 새로운 놀이 방식을 창조한다 (상상 관찰형)", value: 'N' }
            ]
        },
        {
            dimension: 'SN',
            q: "일상적인 루틴(밥 먹는 시간, 산책로)에 대해?",
            options: [
                { text: "정해진 시간과 길이 아니면 어색해하거나 거부한다 (익숙함 선호)", value: 'S' },
                { text: "매번 새로운 길로 가거나 돌발 행동을 즐기는 것 같다 (변화 선호)", value: 'N' }
            ]
        },
        {
            dimension: 'TF',
            q: "주인이 슬퍼하거나 기분이 안 좋을 때 우리 아이는?",
            options: [
                { text: "주변을 맴돌며 밥이나 놀이를 달라고 평소처럼 행동한다 (이성 실천형)", value: 'T' },
                { text: "옆에 와서 얼굴을 핥아주거나 가만히 체온을 나눈다 (감정 공감형)", value: 'F' }
            ]
        },
        {
            dimension: 'TF',
            q: "훈련을 하거나 무언가를 배울 때 우리 아이는?",
            options: [
                { text: "보상(먹이)이 확실해야만 집중해서 행동한다 (목표 중심형)", value: 'T' },
                { text: "칭찬해주고 쓰다듬어주는 스킨십에 더 기뻐한다 (애정 중심형)", value: 'F' }
            ]
        },
        {
            dimension: 'JP',
            q: "배변 시간이 나 잠자는 시간이?",
            options: [
                { text: "거의 일정한 패턴과 규칙이 정해져 있다 (계획적 일상)", value: 'J' },
                { text: "자기 내킬 때 자고 배고플 때 보채며 매번 제각각이다 (즉흥적 일상)", value: 'P' }
            ]
        },
        {
            dimension: 'JP',
            q: "기다려! 혹은 안 돼! 등의 통제에 대해?",
            options: [
                { text: "비교적 잘 따르고 기다릴 줄 안다 (절제형)", value: 'J' },
                { text: "흥분하면 통제가 어렵고 자유분방하게 행동한다 (자유로운 영혼)", value: 'P' }
            ]
        }
    ];

    const petTypes = {
        'ESTJ': { name: "엄격한 군기반장", title: "질서와 규칙을 사랑하는 보스", desc: "집안의 모든 서열을 자기가 정해야 직성이 풀리는 든든한 대장 스타일입니다.", match: "INFP (나긋나긋한 집사)", color: "from-blue-500 to-slate-600" },
        'ESTP': { name: "활동적인 모험가", title: "넘치는 에너지의 에너자이저", desc: "잠시도 가만히 있지 못하는 호기심 천국! 산책 가방만 봐도 공중회전을 합니다.", match: "ISFJ (차분한 집사)", color: "from-orange-500 to-yellow-600" },
        'ESFJ': { name: "다정한 분위기 메이커", title: "모두를 사랑하는 사교왕", desc: "누가 와도 반갑고, 누구랑도 잘 지내는 우리 동네 최고의 핵인싸 동물입니다.", match: "INTP (연구가 집사)", color: "from-pink-500 to-rose-400" },
        'ESFP': { name: "타고난 슈퍼스타", title: "주목받는 것을 즐기는 연예인", desc: "주인의 관심을 독차지하기 위해 온갖 귀여운 짓을 다 하는 사랑둥이입니다.", match: "ISTJ (원칙주의 집사)", color: "from-yellow-400 to-orange-400" },
        'ENTJ': { name: "대담한 통솔자", title: "집 주인을 관리하는 반려 동물", desc: "똑똑하고 영리해서 주인을 조종(?)하는 듯한 느낌을 줄 정도로 영민합니다.", match: "ISFP (예술가 집사)", color: "from-indigo-600 to-blue-700" },
        'ENTP': { name: "재치 넘치는 사고뭉치", title: "창의적으로 말썽 피우는 악동", desc: "어떻게 하면 저기 올라갈까? 어떻게 하면 이걸 부술까? 항상 연구하는 스타일!", match: "INFJ (조용한 집사)", color: "from-purple-500 to-fuchsia-600" },
        'ENFJ': { name: "따뜻한 치유자", title: "주인의 마음을 제일 잘 아는 천사", desc: "당신이 우울할 때 제일 먼저 달려오는, 마음이 아주 깊고 따뜻한 아이입니다.", match: "ISTP (냉철한 집사)", color: "from-red-400 to-pink-500" },
        'ENFP': { name: "재기발랄한 낙천가", title: "보고만 있어도 기분 좋은 댕댕이/냥이", desc: "세상 모든 게 즐겁고 신기한, 지치지 않는 긍정 에너지를 가졌습니다.", match: "INTJ (전략가 집사)", color: "from-green-400 to-teal-500" },
        'ISTJ': { name: "충직한 보디가드", title: "한결같은 믿음직한 파수꾼", desc: "자기 자리를 묵묵히 지키며 주인을 지켜보는, 신뢰도 100%의 믿음직한 친구입니다.", match: "ESFP (활동가 집사)", color: "from-slate-600 to-gray-800" },
        'ISTP': { name: "시크한 기술자", title: "혼자서도 잘 노는 마이웨이", desc: "귀찮은 건 딱 질색! 하지만 사냥이나 놀이 때는 엄청난 집중력을 발휘합니다.", match: "ENFJ (선생님 집사)", color: "from-teal-600 to-emerald-700" },
        'ISFJ': { name: "조용한 수호천사", title: "세상에서 제일 착한 순둥이", desc: "내성적이지만 주인에 대한 사랑은 누구보다 깊은, 아주 섬세한 아이입니다.", match: "ESTP (모험가 집사)", color: "from-blue-400 to-cyan-500" },
        'ISFP': { name: "예술적인 산책가", title: "평화롭고 유유자적한 예술가", desc: "느긋하게 풍경을 감상하고, 햇빛 아래서 낮잠 자는 것을 가장 좋아합니다.", match: "ENTJ (지도자 집사)", color: "from-rose-400 to-amber-500" },
        'INTJ': { name: "용의주도한 전략가", title: "실체를 알 수 없는 미스터리 펫", desc: "가끔 허공을 보거나 신기한 행동을 하지만, 사실 다 계획이 있는 똑쟁이입니다.", match: "ENFP (재기발랄 집사)", color: "from-violet-800 to-indigo-900" },
        'INTP': { name: "아이디어 뱅크", title: "호기심 많은 조용한 관찰자", desc: "혼자 구석에서 장난감을 연구하거나, 집사의 생활을 분석하는 지적 스타일입니다.", match: "ESFJ (친절한 집사)", color: "from-cyan-700 to-blue-800" },
        'INFJ': { name: "신비로운 예언자", title: "영적인 교감을 나누는 특별한 관계", desc: "눈빛 하나로 모든 것을 말하는 듯한, 사람 같은 묘한 매력이 있습니다.", match: "ENTP (개구쟁이 집사)", color: "from-fuchsia-700 to-purple-800" },
        'INFP': { name: "상냥한 공상가", title: "수줍음 많은 낭만 동물", desc: "겁은 조금 많지만 마음은 누구보다 여리고 따뜻해서 섬세한 케어가 필요합니다.", match: "ESTJ (관리자 집사)", color: "from-green-500 to-lime-600" }
    };

    const handleAnswer = (val) => {
        const nextAnswers = { ...answers, [val]: answers[val] + 1 };
        setAnswers(nextAnswers);

        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        } else {
            setStep(2);
        }
    };

    const getResultCode = () => {
        const E_I = answers.E >= answers.I ? 'E' : 'I';
        const S_N = answers.S >= answers.N ? 'S' : 'N';
        const T_F = answers.T >= answers.F ? 'T' : 'F';
        const J_P = answers.J >= answers.P ? 'J' : 'P';
        return E_I + S_N + T_F + J_P;
    };

    const resultCode = step === 2 ? getResultCode() : null;
    const currentType = petTypes[resultCode];

    const saveAsImage = useCallback(async () => {
        if (!resultRef.current) return;
        try {
            const dataUrl = await domToPng(resultRef.current, {
                backgroundColor: '#ffffff',
                scale: 2
            });
            const link = document.createElement('a');
            link.download = `tool-hive-pet-mbti-${resultCode}.png`;
            link.href = dataUrl;
            link.click();
        } catch (err) {
            console.error('Image saving failed:', err);
        }
    }, [resultCode]);

    const resetTest = () => {
        setStep(1);
        setCurrentQuestion(0);
        setAnswers({ E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 });
    };

    const petFaqs = [
        { q: "동물에게도 정말 MBTI가 있나요?", a: "인간의 MBTI 지표를 동물의 행동 패턴에 맞게 재해석한 것입니다. 실제 과학적 성격 검사는 아니지만, 아이의 성향을 이해하는 재미있는 참고 자료가 될 수 있습니다." },
        { q: "강아지와 고양이 모두 테스트 가능한가요?", a: "네, 공통적인 행동(사회성, 활동성, 루틴 등)을 기반으로 문항을 구성했기 때문에 모든 반려동물(강아지, 고양이, 햄스터 등)에게 적용 가능합니다." },
        { q: "결과가 실제 성격과 너무 다른 것 같아요.", a: "컨디션이나 나이, 환경에 따라 행동이 변할 수 있습니다. 평소에 가장 자주 보여주는 모습을 떠올리며 다시 테스트해보세요!" }
    ];

    const petSteps = [
        "우리 아이의 평소 행동(집안/산책/놀이)을 유심히 떠올려봅니다.",
        "8가지 질문에 가장 가깝다고 생각되는 응답을 선택합니다.",
        "도출된 16가지 유형 중 우리 아이가 어디에 속하는지 확인합니다.",
        "결과 카드에 담긴 찰떡궁합 집사 유형과 케어 팁을 체크하고 저장합니다."
    ];

    return (
        <div className="max-w-4xl mx-auto px-4 py-8 space-y-12 mb-20">
            <SEO
                title="우리 아이 펫 MBTI 테스트 | 반려동물 성격 유형 진단"
                description="강아지, 고양이 등 우리 반려동물의 성격은 어떨까요? 행동 패턴으로 알아보는 16가지 펫 MBTI 진단과 집사와의 궁합을 확인해보세요."
                keywords="펫mbti, 강아지mbti, 고양이mbti, 반려동물성격테스트, 펫성향진단, 동물심리테스트"
                category="운세/재미"
                faqs={petFaqs}
                steps={petSteps}
            />

            {step === 0 && (
                <div className="text-center space-y-8 py-20 bg-gradient-to-br from-orange-400/5 to-pink-500/5 rounded-[3rem] border border-orange-200 shadow-sm animate-in fade-in zoom-in duration-500">
                    <div className="inline-flex p-6 rounded-full bg-orange-100 text-orange-500 mb-4 animate-bounce">
                        <PawPrint size={64} />
                    </div>
                    <div className="space-y-4">
                        <h1 className="text-4xl md:text-5xl font-black text-orange-600">펫 MBTI 진단</h1>
                        <p className="text-xl text-muted-foreground max-w-xl mx-auto leading-relaxed">
                            말하지 않아도 알 수 있어요!<br /> 행동으로 알아보는 우리 아이의 진짜 성격은?
                        </p>
                    </div>
                    <button
                        onClick={() => setStep(1)}
                        className="px-10 py-5 bg-orange-500 text-white rounded-full text-xl font-bold hover:scale-105 transition-transform shadow-xl shadow-orange-500/30"
                    >
                        테스트 시작하기
                    </button>
                    <div className="flex justify-center gap-6 text-sm text-orange-400 font-medium">
                        <span className="flex items-center gap-1"><Check size={16} /> 모든 반려동물용</span>
                        <span className="flex items-center gap-1"><Check size={16} /> 1분 내외</span>
                        <span className="flex items-center gap-1"><Check size={16} /> 궁합 분석 포함</span>
                    </div>
                </div>
            )}

            {step === 1 && (
                <div className="space-y-8 animate-in slide-in-from-right-8 duration-300">
                    <div className="flex flex-col gap-2">
                        <div className="flex justify-between items-center text-xs font-black text-orange-400 uppercase tracking-tighter">
                            <span>ANALYZING BEHAVIOR</span>
                            <span>{currentQuestion + 1} / {questions.length}</span>
                        </div>
                        <div className="w-full h-3 bg-orange-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-orange-500 transition-all duration-300"
                                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                            ></div>
                        </div>
                    </div>

                    <div className="bg-card border-2 border-orange-50 rounded-[2.5rem] p-8 md:p-12 space-y-8 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                            <PawPrint size={120} />
                        </div>
                        <h2 className="text-2xl md:text-3xl font-black leading-tight text-slate-800 dark:text-slate-100">
                            {questions[currentQuestion].q}
                        </h2>

                        <div className="grid grid-cols-1 gap-4 relative">
                            {questions[currentQuestion].options.map((option, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleAnswer(option.value)}
                                    className="p-6 text-left rounded-2xl border-2 border-border hover:border-orange-500 hover:bg-orange-50 transition-all group flex justify-between items-center bg-white dark:bg-slate-900"
                                >
                                    <span className="text-lg font-bold group-hover:text-orange-600 transition-colors leading-snug">{option.text}</span>
                                    <div className="w-8 h-8 rounded-full border-2 border-border group-hover:border-orange-500 flex items-center justify-center flex-shrink-0">
                                        <Heart className="w-4 h-4 text-orange-500 scale-0 group-hover:scale-100 transition-transform fill-orange-500" />
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {step === 2 && currentType && (
                <div className="space-y-10 animate-in fade-in duration-700">
                    <div
                        ref={resultRef}
                        className="bg-white dark:bg-slate-900 border-[10px] border-orange-50 rounded-[3rem] p-8 md:p-12 shadow-2xl relative overflow-hidden"
                    >
                        <div className="absolute top-10 right-10 text-orange-100 dark:text-slate-800 rotate-12">
                            <PawPrint size={140} />
                        </div>

                        <div className="relative space-y-10 text-center">
                            <div className="space-y-4">
                                <span className="px-4 py-1 bg-orange-500 text-white rounded-full text-xs font-black tracking-widest uppercase">PET MBTI RESULT</span>
                                <div className="text-6xl font-black text-orange-500 tracking-tighter">{resultCode}</div>
                                <h2 className="text-4xl md:text-5xl font-black text-slate-800 dark:text-white capitalize leading-tight">
                                    "{currentType.name}"
                                </h2>
                            </div>

                            <div className={`p-6 rounded-[2rem] bg-gradient-to-br ${currentType.color} text-white shadow-lg`}>
                                <div className="text-xl font-bold mb-2 flex items-center justify-center gap-2">
                                    <Sparkles size={24} /> {currentType.title}
                                </div>
                                <p className="text-lg opacity-90 leading-relaxed font-medium">
                                    {currentType.desc}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                                <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-3xl space-y-2 border border-slate-100">
                                    <h4 className="font-black text-xs text-orange-500 uppercase flex items-center gap-2">
                                        <Heart size={14} className="fill-orange-500" /> 찰떡궁합 집사
                                    </h4>
                                    <p className="font-bold text-lg">{currentType.match}</p>
                                </div>
                                <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-3xl space-y-2 border border-slate-100">
                                    <h4 className="font-black text-xs text-orange-500 uppercase flex items-center gap-2">
                                        <Zap size={14} className="fill-orange-500" /> 아이를 위한 조언
                                    </h4>
                                    <p className="font-bold text-lg">규칙적인 산책과 풍부한 보상</p>
                                </div>
                            </div>

                            <div className="pt-8 flex flex-col items-center">
                                <div className="text-sm font-black text-orange-300 tracking-[0.4em] mb-1">TOOL HIVE | PET LAB</div>
                                <div className="text-[10px] text-muted-foreground uppercase">반려동물의 행복을 생각합니다</div>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap justify-center gap-4 no-print">
                        <button
                            onClick={saveAsImage}
                            className="flex items-center gap-2 px-10 py-5 bg-orange-500 text-white rounded-full font-bold hover:scale-105 transition-transform shadow-xl shadow-orange-500/20"
                        >
                            <Download size={24} /> 결과 카드 저장하기
                        </button>
                        <button
                            onClick={() => {
                                alert('링크가 복사되었습니다! 우리 아이를 자랑해보세요.');
                                navigator.clipboard.writeText(window.location.href);
                            }}
                            className="flex items-center gap-2 px-10 py-5 bg-white text-orange-600 rounded-full font-bold hover:scale-105 transition-transform border-4 border-orange-50 shadow-sm"
                        >
                            <Share2 size={24} /> 자랑하기
                        </button>
                        <button
                            onClick={resetTest}
                            className="flex items-center gap-2 px-10 py-5 bg-slate-100 text-slate-500 rounded-full font-bold hover:scale-105 transition-transform hover:text-slate-700"
                        >
                            <RefreshCw size={24} /> 다시 하기
                        </button>
                    </div>
                </div>
            )}

            <ToolGuide
                title="펫 MBTI 진단 안내"
                intro="반려동물의 성격 유형 분석(Pet Personality Classification)은 전문가들의 동물 행동 심리학을 기반으로 일상적인 반응들을 유형화한 것입니다."
                steps={petSteps}
                tips={[
                    "집사가 아닌 아이의 입장에서 평소 어떤 선택을 하는지 곰곰이 생각해보세요.",
                    "강아지는 산책 시, 고양이는 낯선 사람 방문 시의 행동이 가장 중요한 지표가 됩니다.",
                    "진단 결과는 단순한 재미를 넘어, 우리 아이의 성향에 맞는 케어 방식을 고민하는 데 활용해보세요."
                ]}
                faqs={petFaqs}
            />
        </div>
    );
};

export default PetMbti;
