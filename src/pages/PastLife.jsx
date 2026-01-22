import React, { useState, useRef, useCallback } from 'react';
import { Download, Share2, RefreshCw, Scroll, Shield, Gem, Compass, Landmark, Ship, Star, Sparkles, User, Anchor, Music, PenTool } from 'lucide-react';
import { domToPng } from 'modern-screenshot';
import SEO from '../components/SEO';
import ToolGuide from '../components/ToolGuide';

const PastLife = () => {
    const [name, setName] = useState('');
    const [gender, setGender] = useState('unisex');
    const [step, setStep] = useState(0); // 0: Input, 1: Loading, 2: Result
    const resultRef = useRef(null);

    const pastLives = [
        {
            title: "백성을 사랑한 성군 (태평성대의 왕)",
            era: "기원전 10세기 어느 왕국",
            story: "당신은 지혜로운 눈과 따뜻한 가슴을 지닌 왕이었습니다. 전쟁보다는 농업과 예술을 장려하여 당신이 통치하던 시대는 굶주리는 백성이 없었으며, 지금까지도 역사서에 가장 위대한 군주 중 하나로 기록되어 있습니다.",
            achievement: "백성을 위한 새로운 법전 편찬 및 대규모 관개 시설 구축",
            motto: "진정한 권력은 지배하는 것이 아니라 보호하는 것에 있다.",
            icon: Landmark,
            color: "from-yellow-400 to-orange-500",
            category: "Royal"
        },
        {
            title: "대양을 누비던 전설의 해적왕",
            era: "17세기 대항해시대",
            story: "당신은 거친 파도와 바람을 길들이던 바다의 주인이었습니다. 수많은 보물보다 동료들과 함께 항해하는 자유를 더 사랑했으며, 그 어떤 해군도 당신의 배를 따라잡지 못했다고 전해집니다.",
            achievement: "7개의 바다를 모두 횡단하며 잃어버린 고대 도시의 보물을 발견",
            motto: "지도는 방향을 알려줄 뿐, 길은 스스로 만드는 것이다.",
            icon: Ship,
            color: "from-blue-600 to-slate-800",
            category: "Explorer"
        },
        {
            title: "세상을 깨우친 은둔의 대문호",
            era: "19세기 낭만주의 시대",
            story: "당신은 잉크 냄새와 종이 서걱거리는 소리 속에서 진리를 찾던 작가였습니다. 당신이 남긴 시 한 편과 소설 한 장은 수많은 사람의 심금을 울렸으며, 사후 수백 년이 지나서야 당신의 천재성이 인정받았습니다.",
            achievement: "시대를 앞서간 300여 권의 미공개 원고와 불후의 명작 '새벽의 노래'",
            motto: "글은 지워질 수 있으나, 그 안에 담긴 영혼은 영원히 흐른다.",
            icon: PenTool,
            color: "from-amber-700 to-stone-500",
            category: "Artist"
        },
        {
            title: "달빛 아래 춤추던 신비로운 도사",
            era: "서기 8세기 동양의 어느 산자락",
            story: "당신은 구름을 타고 바람과 대화하던 비범한 인물이었습니다. 세속의 권력에는 관심이 없었으며, 아픈 사람들을 치유하고 길 잃은 여행자들에게 별의 길을 알려주는 신비로운 존재로 기억되고 있습니다.",
            achievement: "자연의 기운을 담은 72가지 비법 약초 도감 완성",
            motto: "흐르는 물처럼 살아라. 막히면 돌아가고 넘치면 메워라.",
            icon: Sparkles,
            color: "from-indigo-400 to-purple-600",
            category: "Mystic"
        },
        {
            title: "정의를 위해 검을 들었던 전설의 기사",
            era: "12세기 중세 유럽",
            story: "당신은 명예와 약속을 목숨보다 중하게 여겼던 충직한 기사였습니다. 수많은 전장에서 승리했지만 결코 약자를 괴롭히지 않았으며, 그 용맹함은 오늘날까지 기사도의 표본으로 전해집니다.",
            achievement: "혼자만의 힘으로 성을 지켜내고 억울하게 갇힌 영웅들을 구출",
            motto: "검은 부러질지언정, 기사의 맹세는 꺾이지 않는다.",
            icon: Shield,
            color: "from-slate-400 to-blue-500",
            category: "Warrior"
        },
        {
            title: "신대륙을 발견한 지성적인 탐험가",
            era: "15세기 지리상 발견의 시대",
            story: "당신은 공포를 호기심으로 승화시킨 용기 있는 탐험가였습니다. 아무도 가본 적 없는 서쪽 끝으로 배를 몰아 마침내 새로운 대륙을 발견했으며, 인종과 문화를 초월한 교류의 장을 열었습니다.",
            achievement: "세계 최초로 지구의 정확한 둘레와 신비로운 생물들의 지도를 완성",
            motto: "안전한 항구에만 있어서는 한 번도 보지 못한 섬에 닿을 수 없다.",
            icon: Compass,
            color: "from-teal-500 to-emerald-700",
            category: "Explorer"
        },
        {
            title: "평화를 노래했던 방랑 음악가",
            era: "18세기 오스트리아의 거리",
            story: "당신은 악기 하나만 짊어지고 전 세계의 마을을 돌며 희망을 연주했습니다. 당신의 선율이 흐르는 곳에는 전쟁이 멈췄고, 슬픔에 잠겼던 사람들이 다시 웃음을 되찾았다고 합니다.",
            achievement: "모든 인류가 동시에 흥얼거릴 수 있는 인류 화합의 교향곡 작곡",
            motto: "말이 통하지 않는 곳에서도 음악은 심장으로 전달된다.",
            icon: Music,
            color: "from-rose-400 to-pink-600",
            category: "Artist"
        },
        {
            title: "우주의 비밀을 풀었던 천문학자",
            era: "기원전 3세기 알렉산드리아",
            story: "당신은 누구보다 하늘을 사랑했던 지식인이었습니다. 별들의 움직임을 기록하고 행성의 궤도를 계산하며, 인류가 우주라는 거대한 바다에 첫발을 내디딜 수 있도록 이론적 토대를 닦았습니다.",
            achievement: "밤하늘의 8,000개 별자리를 분류하고 행성의 공전 주기를 계산",
            motto: "우리는 모두 별의 먼지로 만들어진 우주의 일부이다.",
            icon: Star,
            color: "from-indigo-600 to-blue-900",
            category: "Scholar"
        }
    ];

    const generatePastLife = () => {
        if (!name.trim()) return;
        setStep(1);

        // Deterministic logic based on name characters
        setTimeout(() => {
            let hash = 0;
            for (let i = 0; i < name.length; i++) {
                hash = name.charCodeAt(i) + ((hash << 5) - hash);
            }

            // Add gender bias
            if (gender === 'male') hash += 7;
            if (gender === 'female') hash += 13;

            const index = Math.abs(hash) % pastLives.length;
            setResultIndex(index);
            setStep(2);
        }, 1500);
    };

    const [resultIndex, setResultIndex] = useState(0);
    const currentPastLife = pastLives[resultIndex];

    const saveAsImage = useCallback(async () => {
        if (!resultRef.current) return;
        try {
            const dataUrl = await domToPng(resultRef.current, {
                backgroundColor: '#ffffff',
                scale: 2
            });
            const link = document.createElement('a');
            link.download = `tool-hive-past-life-${name}.png`;
            link.href = dataUrl;
            link.click();
        } catch (err) {
            console.error('Image saving failed:', err);
        }
    }, [name]);

    const pastLifeFaqs = [
        { q: "전생 진단 결과는 어떻게 나오나요?", a: "사용자가 입력한 이름의 고유한 문자 조합(유니코드)을 수치화하여 미리 정의된 16가지의 전생 데이터 중 하나를 연결합니다. 따라서 동일한 이름과 성별을 넣으면 항상 같은 결과가 나옵니다." },
        { q: "이름이 바뀌면 전생도 바뀌나요?", a: "본 도구는 '이름'의 기운과 상징성을 기반으로 분석하므로, 개명 전후의 결과가 다를 수 있습니다. 현재 가장 많이 사용하시는 이름을 넣어보세요." },
        { q: "전생 결과가 정말 실제 제 전생일까요?", a: "과학적 근거보다는 재미와 자기 통찰을 위한 도구입니다. 전생의 특징 중 현재의 나와 닮은 점을 찾아보며 재미있게 즐겨주세요!" }
    ];

    const pastLifeSteps = [
        "진단하고 싶은 분의 실명을 입력합니다.",
        "성별을 선택합니다. (한쪽 성별에 치우치지 않는 결과도 가능합니다)",
        "'전생 확인하기' 버튼을 눌러 운명의 수레바퀴를 돌립니다.",
        "밝혀진 전생 스토리와 성적을 확인하고 결과 카드를 친구에게 공유합니다."
    ];

    return (
        <div className="max-w-4xl mx-auto px-4 py-8 space-y-12 mb-20">
            <SEO
                title="이름으로 보는 나의 전생 테스트 | 유료 도사 전생 진단"
                description="당신의 이름 속에 숨겨진 전생의 비밀을 밝혀드립니다. 중세 기사부터 조선의 거상까지, 당신이 어떤 삶을 살았는지 지금 확인해보세요."
                keywords="전생테스트, 이름전생, 나의전생, 전생이름테스트, 과거라이프, 심리테스트, 무료진단"
                category="운세/재미"
                faqs={pastLifeFaqs}
                steps={pastLifeSteps}
            />

            {step === 0 && (
                <div className="text-center space-y-10 py-16 bg-gradient-to-br from-indigo-900/5 to-slate-900/10 rounded-[3rem] border border-indigo-500/10 shadow-inner animate-in fade-in duration-700">
                    <div className="flex justify-center">
                        <div className="relative">
                            <div className="absolute inset-0 bg-indigo-500 blur-3xl opacity-20 animate-pulse"></div>
                            <Scroll size={80} className="text-indigo-600 relative" />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-slate-800 dark:text-slate-100">나의 전생 알아보기</h1>
                        <p className="text-lg md:text-xl text-muted-foreground font-medium">당신의 이름에 새겨진 영혼의 발자취를 따라가 봅니다.</p>
                    </div>

                    <div className="max-w-sm mx-auto space-y-6 bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl border border-border">
                        <div className="space-y-2 text-left">
                            <label className="text-sm font-bold text-slate-500 px-1">이름 입력</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="당신의 이름을 입력하세요"
                                className="w-full px-5 py-4 rounded-2xl border-2 border-border focus:border-indigo-500 focus:outline-none text-lg font-bold transition-all"
                            />
                        </div>

                        <div className="space-y-2 text-left">
                            <label className="text-sm font-bold text-slate-500 px-1">성별 선택</label>
                            <div className="grid grid-cols-3 gap-2">
                                {['male', 'female', 'unisex'].map((g) => (
                                    <button
                                        key={g}
                                        onClick={() => setGender(g)}
                                        className={`py-3 rounded-xl border-2 transition-all font-bold text-sm ${gender === g
                                                ? 'border-indigo-500 bg-indigo-50 text-indigo-600 shadow-md'
                                                : 'border-border text-slate-400 hover:border-slate-300'
                                            }`}
                                    >
                                        {g === 'male' ? '남성' : g === 'female' ? '여성' : '모두'}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={generatePastLife}
                            disabled={!name.trim()}
                            className="w-full py-4 bg-indigo-600 text-white rounded-2xl text-lg font-black hover:bg-indigo-700 hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:hover:scale-100 transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2"
                        >
                            <Sparkles size={20} /> 전생 확인하기
                        </button>
                    </div>
                </div>
            )}

            {step === 1 && (
                <div className="min-h-[400px] flex flex-col items-center justify-center space-y-8 animate-pulse">
                    <div className="relative">
                        <div className="w-32 h-32 border-8 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
                        <Scroll size={40} className="absolute inset-0 m-auto text-indigo-600" />
                    </div>
                    <div className="text-center space-y-2">
                        <p className="text-2xl font-black text-indigo-600">역사의 기록을 뒤지는 중...</p>
                        <p className="text-muted-foreground">당신의 운명이 결정되고 있습니다.</p>
                    </div>
                </div>
            )}

            {step === 2 && currentPastLife && (
                <div className="space-y-10 animate-in zoom-in-95 duration-700">
                    <div
                        ref={resultRef}
                        className="bg-white dark:bg-slate-900 border-8 border-double border-indigo-100 rounded-[3rem] p-8 md:p-12 shadow-2xl relative overflow-hidden text-center"
                    >
                        {/* Antique Texture Overlays */}
                        <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')]"></div>

                        <div className="relative space-y-12">
                            <div className="space-y-3">
                                <div className="inline-block px-4 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-black tracking-widest text-slate-500 uppercase">THE SCROLL OF DESTINY</div>
                                <h2 className="text-2xl font-bold text-slate-400">{name} 님의 영혼의 발자취</h2>
                            </div>

                            <div className="flex justify-center">
                                <div className={`w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br ${currentPastLife.color} text-white flex items-center justify-center shadow-2xl transform rotate-3`}>
                                    {React.createElement(currentPastLife.icon, { size: 64 })}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="text-indigo-600 font-bold mb-1">{currentPastLife.era}</div>
                                <h3 className="text-4xl md:text-5xl font-black text-slate-800 dark:text-white leading-tight">
                                    {currentPastLife.title}
                                </h3>
                            </div>

                            <div className="max-w-xl mx-auto py-8 px-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 text-lg leading-relaxed text-slate-600 dark:text-slate-300 italic">
                                "{currentPastLife.story}"
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                                <div className="p-6 bg-white dark:bg-slate-900 border-2 border-slate-100 rounded-2xl space-y-2 shadow-sm">
                                    <h4 className="font-black text-xs text-indigo-600 uppercase flex items-center gap-2">
                                        <Gem size={14} /> 주요 업적
                                    </h4>
                                    <p className="font-bold text-slate-700 dark:text-slate-200">{currentPastLife.achievement}</p>
                                </div>
                                <div className="p-6 bg-white dark:bg-slate-900 border-2 border-slate-100 rounded-2xl space-y-2 shadow-sm">
                                    <h4 className="font-black text-xs text-indigo-600 uppercase flex items-center gap-2">
                                        <Landmark size={14} /> 영혼의 조언
                                    </h4>
                                    <p className="font-bold text-slate-700 dark:text-slate-200">{currentPastLife.motto}</p>
                                </div>
                            </div>

                            <div className="pt-10 flex flex-col items-center">
                                <div className="w-24 h-1 bg-gradient-to-r from-transparent via-indigo-200 to-transparent mb-4"></div>
                                <div className="text-2xl font-black text-slate-200 uppercase tracking-[0.5em]">TOOL HIVE</div>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap justify-center gap-4 no-print">
                        <button
                            onClick={saveAsImage}
                            className="flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-full font-bold hover:scale-105 transition-transform shadow-lg shadow-indigo-600/20"
                        >
                            <Download size={20} /> 전생 기록부 저장
                        </button>
                        <button
                            onClick={() => {
                                alert('링크가 복사되었습니다! 친구들에게 당신의 전생을 보여주세요.');
                                navigator.clipboard.writeText(window.location.href);
                            }}
                            className="flex items-center gap-2 px-8 py-4 bg-white text-slate-700 rounded-full font-bold hover:scale-105 transition-transform border border-slate-200 shadow-sm"
                        >
                            <Share2 size={20} /> 결과 공유
                        </button>
                        <button
                            onClick={() => setStep(0)}
                            className="flex items-center gap-2 px-8 py-4 bg-slate-100 text-slate-500 rounded-full font-bold hover:scale-105 transition-transform hover:text-slate-700"
                        >
                            <RefreshCw size={20} /> 다른 이름으로 확인
                        </button>
                    </div>
                </div>
            )}

            <ToolGuide
                title="나의 전생 알아보기 도구 정보"
                intro="전생 테스트는 당신의 이름이 가진 에너지와 상징을 역사적 인물이나 직업군의 특징에 투영하여 성격적 유사성을 찾아내는 즐거운 상상 도구입니다."
                steps={pastLifeSteps}
                tips={[
                    "정확한 분석을 위해 별명보다는 실제 이름을 사용하시는 것이 좋습니다.",
                    "결과 카드를 저장하여 현재의 삶과 전생의 공통점을 비교해보세요.",
                    "친구들과 각자의 전생을 공유하며 전생의 인연이 있었는지 확인해보는 것도 재미있습니다."
                ]}
                faqs={pastLifeFaqs}
            />
        </div>
    );
};

export default PastLife;
