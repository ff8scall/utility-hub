import React, { useState, useRef, useCallback } from 'react';
import { Download, Share2, RefreshCw, Palette, Sparkles, Heart, Zap, Smile, Star, Moon, Sun, Coffee } from 'lucide-react';
import { domToPng } from 'modern-screenshot';
import SEO from '../components/SEO';
import ToolGuide from '../components/ToolGuide';

const FirstImpressionColor = () => {
    const [name, setName] = useState('');
    const [step, setStep] = useState(0); // 0: Input, 1: Loading, 2: Result
    const resultRef = useRef(null);

    const colors = [
        { name: "Deep Navy", hex: "#1e3a8a", mood: "지적이고 신뢰감 있는", desc: "당신은 첫눈에 깊은 신뢰를 주는 사람입니다. 차분한 대화 속에서 느껴지는 지적인 아우라가 당신의 가장 큰 매력입니다.", keywords: ["신뢰", "지성", "차분함"], pair: "Silver", icon: Star },
        { name: "Soft Pink", hex: "#fbcfe8", mood: "사랑스럽고 다정한", desc: "봄바람처럼 부드러운 미소가 당신의 첫인상입니다. 따뜻한 마음씨로 주변 사람들을 편안하게 감싸주는 다정한 매력을 가졌습니다.", keywords: ["사랑", "다정", "친절"], pair: "Cream", icon: Heart },
        { name: "Vibrant Orange", hex: "#f97316", mood: "에너지 넘치고 톡톡 튀는", desc: "당신이 나타나면 주변 분위기가 단숨에 밝아집니다. 통통 튀는 아이디어와 지치지 않는 에너지가 당신을 돋보이게 합니다.", keywords: ["활력", "열정", "개성"], pair: "White", icon: Zap },
        { name: "Forest Green", hex: "#064e3b", mood: "편안하고 싱그러운", desc: "깊은 숲속의 공기처럼 맑고 깨끗한 인상을 줍니다. 당신과 함께라면 누구든 마음의 안정을 찾고 힐링하는 기분을 느낍니다.", keywords: ["안정", "자연", "신선"], pair: "Beige", icon: Sun },
        { name: "Royal Purple", hex: "#581c87", mood: "고급스럽고 우아한", desc: "범접할 수 없는 고귀함과 우아함이 당신의 첫 이미지입니다. 미스테리하면서도 화려한 매력이 사람들을 당신에게 끌어당깁니다.", keywords: ["품격", "신비", "우아함"], pair: "Gold", icon: Sparkles },
        { name: "Lemon Yellow", hex: "#fde047", mood: "밝고 활기찬", desc: "태양처럼 밝고 긍정적인 에너지가 당신을 감싸고 있습니다. 당신의 웃음소리는 언제나 주변을 희망으로 채워주는 능력이 있군요.", keywords: ["긍정", "활기", "희망"], pair: "Blue", icon: Smile },
        { name: "Charcoal Gray", hex: "#374151", mood: "차분하고 세련된", desc: "군더더기 없는 깔끔함과 도시적인 세련미가 당신의 첫 느낌입니다. 묵묵히 자신의 자리를 지키는 당신은 매우 듬직한 사람입니다.", keywords: ["절제", "전문성", "도시적"], pair: "Black", icon: Moon },
        { name: "Sky Blue", hex: "#7dd3fc", mood: "맑고 순수한", desc: "구름 한 점 없는 하늘처럼 투명하고 순수한 영혼이 느껴집니다. 당신과 대화하면 세상의 복잡한 일들이 모두 잊히는 듯한 착각이 듭니다.", keywords: ["순수", "자유", "투명함"], pair: "Mint", icon: Star },
        { name: "Warm Beige", hex: "#f5f5dc", mood: "따뜻하고 안정적인", desc: "갓 구운 빵이나 따뜻한 차 한 잔처럼 포근한 느낌을 줍니다. 당신의 부드러운 배려와 경청은 다른 이들에게 큰 위로가 됩니다.", keywords: ["포근함", "안정", "경청"], pair: "Brown", icon: Coffee },
        { name: "Cherry Red", hex: "#be123c", mood: "정열적이고 강렬한", desc: "한 번 보면 절대 잊을 수 없는 강한 존재감이 당신의 매력입니다. 매사에 열정적이며 당당한 당신의 모습은 매우 매혹적입니다.", keywords: ["정열", "확신", "매혹"], pair: "Gray", icon: Zap },
        { name: "Mint Fresh", hex: "#6ee7b7", mood: "시원하고 개성 있는", desc: "기존의 틀에 얽매이지 않는 신선한 시각을 가진 당신! 당신만이 가진 독특한 취향과 개성은 언제나 새로운 영감을 줍니다.", keywords: ["감각", "개성", "신선함"], pair: "Lemon", icon: Palette },
        { name: "Lavender", hex: "#c084fc", mood: "신비롭고 몽환적인", desc: "꿈속에서 만난 요정처럼 신비로운 아우라를 풍깁니다. 조용하지만 깊은 통찰력을 가진 당신은 타인의 마음을 읽는 능력이 탁월합니다.", keywords: ["예술", "통찰", "신비"], pair: "Pink", icon: Heart },
        { name: "Coffee Brown", hex: "#78350f", mood: "중후하고 깊이 있는", desc: "오래된 와인처럼 깊은 풍미와 중후한 멋이 느껴집니다. 당신의 말 한마디는 묵직한 힘이 있고 많은 이들이 당신의 경험을 신뢰합니다.", keywords: ["깊이", "전통", "신뢰"], pair: "Green", icon: Coffee },
        { name: "Golden Honey", hex: "#fbbf24", mood: "풍요롭고 따사로운", desc: "가을 들판처럼 풍요롭고 따뜻한 햇살 같은 인상을 줍니다. 당신과 함께라면 결코 부족함이 느껴지지 않으며 풍성한 삶을 나누어 줍니다.", keywords: ["풍요", "인자함", "황금빛"], pair: "Navy", icon: Star },
        { name: "Cyber Silver", hex: "#cbd5e1", mood: "트렌디하고 미래적인", desc: "시대를 앞서가는 감각과 쿨한 성격이 당신의 첫인상입니다. 논리적이며 군더더기 없는 당신의 스타일은 많은 이들의 워너비가 됩니다.", keywords: ["트렌드", "논리", "세련"], pair: "Blue", icon: Zap },
        { name: "Coral Crush", hex: "#fb7185", mood: "발랄하고 친근한", desc: "언제나 웃음이 피어나는 친화력 갑! 당신은 누구와도 금방 친구가 될 수 있는 다정한 오지라퍼이자 모임의 주인공입니다.", keywords: ["친화력", "유머", "애교"], pair: "Yellow", icon: Heart }
    ];

    const generateColor = () => {
        if (!name.trim()) return;
        setStep(1);

        setTimeout(() => {
            let hash = 0;
            for (let i = 0; i < name.length; i++) {
                hash = name.charCodeAt(i) + ((hash << 5) - hash);
            }

            const index = Math.abs(hash) % colors.length;
            setResultIndex(index);
            setStep(2);
        }, 1500);
    };

    const [resultIndex, setResultIndex] = useState(0);
    const currentColor = colors[resultIndex];

    const saveAsImage = useCallback(async () => {
        if (!resultRef.current) return;
        try {
            const dataUrl = await domToPng(resultRef.current, {
                backgroundColor: '#ffffff',
                scale: 2
            });
            const link = document.createElement('a');
            link.download = `tool-hive-color-${name}.png`;
            link.href = dataUrl;
            link.click();
        } catch (err) {
            console.error('Image saving failed:', err);
        }
    }, [name]);

    const colorFaqs = [
        { q: "첫인상 컬러는 어떤 기준으로 정해지나요?", a: "이름이 가진 고유한 유니코드 수치를 분석하여, 그 소리가 주는 심리적 시각 이미지와 16가지의 대표 컬러 팔레트를 매칭합니다." },
        { q: "퍼스널 컬러와는 다른 건가요?", a: "퍼스널 컬러는 신체 색상에 기반한 반면, 첫인상 컬러는 이름이 주는 '이미지'와 '아우라'에 집중한 심리적 진단 도구입니다." },
        { q: "결과에 나온 컬러의 옷을 입으면 좋나요?", a: "네! 타인이 당신을 보았을 때 가장 자연스럽고 매력적이라고 느끼는 에너지가 그 컬러에 담겨 있습니다. 포인트 아이템으로 활용해 보세요!" }
    ];

    return (
        <div className="max-w-4xl mx-auto px-4 py-8 space-y-12 mb-20">
            <SEO
                title="나의 첫인상 컬러 테스트 | 나는 남들에게 어떤 색으로 보일까?"
                description="나의 이름이 풍기는 아우라는 무슨 색일까? 이름만 넣으면 당신의 첫인상 컬러와 분위기를 16가지 감각적인 팔레트로 분석해 드립니다."
                keywords="첫인상컬러, 이미지테스트, 이름테스트, 심리테스트, 컬러팔레트, 아우라테스트, 무료분석, 바이럴도구"
                category="운세/재미"
                faqs={colorFaqs}
                steps={["나의 전체 이름을 입력창에 넣습니다.", "'나의 컬러 찾기' 버튼을 클릭합니다.", "이름에서 연산된 고유한 첫인상 컬러와 분위기를 확인합니다.", "감성적인 컬러 카드를 저장하여 나의 정체성을 자랑해 보세요!"]}
            />

            {step === 0 && (
                <div className="text-center space-y-12 py-24 bg-white rounded-[4rem] border-8 border-slate-50 shadow-2xl animate-in fade-in duration-1000 relative overflow-hidden group">
                    <div className="flex justify-center relative">
                        <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-indigo-500 animate-pulse border-2 border-slate-100">
                            <Palette size={48} />
                        </div>
                    </div>

                    <div className="space-y-4 px-6">
                        <h1 className="text-4xl md:text-6xl font-black text-slate-800 tracking-tighter">나의 첫인상 컬러</h1>
                        <p className="text-lg md:text-xl text-slate-500 font-medium max-w-lg mx-auto leading-relaxed">
                            "사람들이 당신의 이름을 들었을 때<br />무의식적으로 떠올리는 색깔을 찾아 드립니다."
                        </p>
                    </div>

                    <div className="max-w-sm mx-auto space-y-8 relative">
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="이름을 입력하세요"
                            className="w-full px-8 py-5 rounded-2xl border-4 border-slate-100 focus:border-indigo-400 focus:outline-none text-2xl font-black transition-all shadow-inner bg-slate-50"
                            maxLength={10}
                        />
                        <button
                            onClick={generateColor}
                            disabled={!name.trim()}
                            className="w-full py-5 bg-slate-900 text-white rounded-2xl text-xl font-black hover:bg-black hover:scale-105 active:scale-95 disabled:opacity-30 transition-all shadow-2xl flex items-center justify-center gap-3"
                        >
                            나의 컬러 찾기 <Sparkles size={24} />
                        </button>
                    </div>

                    {/* Decorative Color Dots */}
                    <div className="absolute top-10 left-10 w-12 h-12 rounded-full bg-pink-100 animate-bounce"></div>
                    <div className="absolute bottom-10 right-10 w-16 h-16 rounded-full bg-blue-100 animate-bounce delay-300"></div>
                </div>
            )}

            {step === 1 && (
                <div className="min-h-[400px] flex flex-col items-center justify-center space-y-8 animate-in fade-in">
                    <div className="flex gap-4">
                        {[0, 1, 2].map(i => (
                            <div key={i} className="w-6 h-12 rounded-full bg-slate-200 animate-pulse" style={{ animationDelay: `${i * 200}ms` }}></div>
                        ))}
                    </div>
                    <div className="text-center">
                        <p className="text-2xl font-black text-slate-800 mb-2">당신의 아우라를 분석하는 중...</p>
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Aura & Hue Extraction for {name}</p>
                    </div>
                </div>
            )}

            {step === 2 && currentColor && (
                <div className="space-y-12 animate-in slide-in-from-bottom-5 duration-700">
                    <div
                        ref={resultRef}
                        className="bg-white border-[16px] border-slate-50 rounded-[4rem] p-10 md:p-16 shadow-2xl relative overflow-hidden"
                    >
                        <div className="flex flex-col md:flex-row gap-12 items-center md:items-stretch font-serif">
                            {/* Color Block */}
                            <div className="w-full md:w-1/2 aspect-square rounded-[2rem] shadow-2xl relative overflow-hidden" style={{ backgroundColor: currentColor.hex }}>
                                <div className="absolute bottom-8 left-8 text-white/40 font-black text-3xl tracking-widest uppercase rotate-90 origin-left">
                                    AURA COLOR
                                </div>
                                <div className="absolute top-8 right-8 text-white p-4 bg-black/10 backdrop-blur-md rounded-full">
                                    {React.createElement(currentColor.icon, { size: 32 })}
                                </div>
                            </div>

                            {/* Info Area */}
                            <div className="w-full md:w-1/2 flex flex-col justify-between py-4 space-y-8 text-center md:text-left">
                                <div className="space-y-2">
                                    <span className="text-xs font-black text-slate-400 tracking-widest uppercase">IDNTTY REPORT</span>
                                    <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter">
                                        {currentColor.name}
                                    </h2>
                                    <p className="text-2xl md:text-3xl font-bold text-slate-500 italic">"{currentColor.mood}"</p>
                                </div>

                                <p className="text-lg md:text-xl font-medium text-slate-700 leading-relaxed break-keep">
                                    {currentColor.desc}
                                </p>

                                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                                    {currentColor.keywords.map((k, i) => (
                                        <span key={i} className="px-4 py-1.5 bg-slate-100 text-slate-600 rounded-full text-sm font-black">#{k}</span>
                                    ))}
                                </div>

                                <div className="p-6 bg-slate-50 rounded-2xl border-2 border-slate-100">
                                    <div className="text-xs font-black text-slate-400 mb-2 uppercase">BEST PAIRING WITH</div>
                                    <div className="text-xl font-black text-slate-800">{currentColor.pair} Look</div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-16 pt-8 border-t border-slate-100 flex justify-between items-center text-slate-200">
                            <span className="text-2xl font-serif font-black tracking-widest uppercase opacity-50">TOOL HIVE</span>
                            <span className="text-xs font-black uppercase tracking-widest opacity-50">2026 Aura Vision Lab</span>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap justify-center gap-4">
                        <button
                            onClick={saveAsImage}
                            className="px-10 py-5 bg-slate-900 text-white rounded-full font-black text-xl hover:bg-black hover:scale-105 active:scale-95 transition-all shadow-2xl flex items-center gap-3"
                        >
                            <Download size={24} /> 컬러 카드 저장
                        </button>
                        <button
                            onClick={() => {
                                alert('나의 컬러 링크가 복사되었습니다!');
                                navigator.clipboard.writeText(window.location.href);
                            }}
                            className="px-10 py-5 bg-white text-slate-700 rounded-full font-black text-xl hover:scale-105 transition-all border-4 border-slate-50 shadow-lg flex items-center gap-3"
                        >
                            <Share2 size={24} /> 결과 공유하기
                        </button>
                        <button
                            onClick={() => setStep(0)}
                            className="px-10 py-5 bg-slate-100 text-slate-400 rounded-full font-black text-xl hover:text-indigo-600 transition-colors"
                        >
                            <RefreshCw size={24} /> 다른 이름 측정
                        </button>
                    </div>
                </div>
            )}

            <ToolGuide
                title="첫인상 컬러 테스트 가이드"
                intro="첫인상 컬러 테스트(First Impression Color Report)는 이름이 자아내는 '이미지 분위기'를 시각적인 컬러 데이터로 변환해 드리는 기능입니다."
                steps={["나의 실명 혹은 SNS에서 주로 쓰이는 닉네임을 입력합니다.", "'나의 컬러 찾기' 버튼을 눌러 아우라 분석 결과를 기다립니다.", "나의 첫인상이 어떤 분위기를 자아내는지 컬러와 키워드를 통해 확인합니다.", "세련된 디자인의 컬러 리포트를 지인들과 공유하며 어울리는지 확인해보세요!"]}
                tips={[
                    "실명뿐만 아니라 인스타그램 검색 아이디(ID)를 넣어 분석해보는 것도 트렌디한 즐거움입니다.",
                    "결과에 나온 컬러는 당신에게 가장 호감을 가져다주는 '아우라 컬러'이니 패션이나 프로필 사진 배경으로 활용해 보세요.",
                    "친구들과 각자의 컬러를 모아보고, 누구의 첫인상이 가장 강렬한지 투표해보는 재미가 있습니다."
                ]}
                faqs={colorFaqs}
            />
        </div>
    );
};

export default FirstImpressionColor;
