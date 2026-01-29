import React, { useState, useRef, useCallback } from 'react';
import { Download, Share2, RefreshCw, Zap, Sparkles, Moon, DollarSign, Utensils, Coffee, Heart, Brain, Smile, Activity, Star, Eye, Shield } from 'lucide-react';
import { domToPng } from 'modern-screenshot';
import SEO from '../components/SEO';
import ToolGuide from '../components/ToolGuide';

const IfIAmGod = () => {
    const [name, setName] = useState('');
    const [step, setStep] = useState(0); // 0: Input, 1: Loading, 2: Result
    const resultRef = useRef(null);

    const gods = [
        { type: "지름신의 강림", title: "통장의 잔고를 파괴하는 성스러운 결제자", desc: "당신은 결제 버튼만 보면 항거할 수 없는 신성한 부름을 듣습니다. 세상 모든 물건은 당신의 손을 거쳐야만 그 가치를 증명하죠. 비록 통장은 가벼워질지언정, 택배 박스를 뜯는 당신의 얼굴은 누구보다 성스럽습니다.", power: "무제한 카드 긁기", rank: "SSR급 소비 요정", icon: DollarSign, color: "from-yellow-400 to-orange-600" },
        { type: "잠의 신, 모피어스", title: "침대와 물아일체를 이룬 영면의 지배자", desc: "머리만 대면 3초 안에 꿈의 세계로 접속하는 놀라운 권능을 가졌군요. 알람 소리는 당신에게 그저 배경음악일 뿐입니다. 어제의 나와 오늘의 나를 잠으로 이기는 당신은 진정한 휴식의 군주입니다.", power: "어디서든 숙면하기", rank: "Zzz급 기절 마스터", icon: Moon, color: "from-blue-600 to-indigo-900" },
        { type: "파괴의 신", title: "손만 대면 기계가 항복하는 마이너스의 손", desc: "멀쩡하던 물건도 당신의 손길이 닿으면 순식간에 고철로 변하는 신비한 힘을 가졌습니다. 의도치 않게 주변을 정돈(?)하고 강제 미니멀리즘을 실천하게 만드는 당신은 진정한 창조 전의 파괴자입니다.", power: "기계 먹통 만들기", rank: "A급 파괴 공작원", icon: Zap, color: "from-slate-700 to-zinc-900" },
        { type: "프로 야근의 신", title: "사무실 불빛을 지키는 등대지기", desc: "어둠이 내려앉아도 당신의 모니터는 꺼지지 않습니다. 커피를 성수로 마시며 엑셀과 파워포인트로 세상을 정화하는 당신! 전우애를 다지는 동료들에게 당신은 든든한 밤의 수호신과 같습니다.", power: "졸음 참기 & 광속 타이핑", rank: "S급 등대지기", icon: Coffee, color: "from-stone-600 to-amber-900" },
        { type: "금사빠의 신", title: "3초면 운명의 상대를 만나는 사랑의 화신", desc: "옷깃만 스쳐도 인연, 눈만 마주쳐도 운명임을 직감하는 사랑 넘치는 영혼이시군요. 매일매일이 첫사랑처럼 설레는 당신의 심장은 세상 어떤 엔진보다 뜨겁게 타오르고 있습니다.", power: "금방 사랑에 빠지기", rank: "핑크급 직진 요정", icon: Heart, color: "from-rose-400 to-pink-600" },
        { type: "먹부림의 신", title: "전국 맛집의 질서를 바로잡는 미식의 군주", desc: "한 입만 먹어도 식재료의 원산지와 주방장의 컨디션을 알아맞히는 절대 미각의 소유자입니다. 당신이 가는 곳이 곧 핫플레이스이며, 당신의 숟가락질 한 번에 맛의 역사가 새로 쓰입니다.", power: "무한 흡입 & 칼로리 승화", rank: "특S급 미식 대가", icon: Utensils, color: "from-orange-500 to-red-700" },
        { type: "운빨의 신", title: "로또 명당도 피해가는 우주의 기운 결정체", desc: "가위바위보부터 경품 당첨까지, 우주의 모든 확률이 당신을 중심으로 돌아갑니다. 노력보다는 운으로 모든 난관을 극복하는 당신이야말로 신이 가장 아끼는 이 시대의 '럭키 가이'입니다.", power: "확률 조작 & 대박 터뜨리기", rank: "전설급 황금손", icon: Sparkles, color: "from-yellow-300 to-amber-500" },
        { type: "게으름의 신", title: "숨쉬기 운동만으로 평화를 유지하는 정지된 자", desc: "움직임은 최소화, 행복은 최대화! 누워 있을 때 가장 고아한 자태를 뽐내는 당신은 중력을 가장 잘 다루는 현자입니다. 당신의 주변엔 언제나 고요하고 평온한 기운이 감돌고 있습니다.", power: "중력 무시 & 빈둥거리기", rank: "베짱이급 평화주의자", icon: Activity, color: "from-emerald-400 to-teal-600" },
        { type: "분노 조절의 신", title: "부처님도 울고 갈 살신성인의 마인드 컨트롤", desc: "웬만한 시련과 고난에는 '그럴 수 있지' 한 마디로 대응하는 강철 멘탈의 현자입니다. 당신의 자비로움은 끝이 없어, 빌런들조차 당신 앞에서는 순한 양이 되어버리는 기적을 경험합니다.", power: "온화한 미소 유지", rank: "성인급 평화 사절", icon: Smile, color: "from-indigo-400 to-blue-500" },
        { type: "드립의 신", title: "존재 자체가 밈(Meme)이 되는 웃음 전도사", desc: "당신의 입이 열리는 순간, 세상의 모든 지루함은 종말을 고합니다. 찰나의 타이밍을 놓치지 않는 당신의 센스는 인스타그램과 트위터의 알고리즘조차 경외하는 신의 영역입니다.", power: "찰나의 드립 & 분위기 반전", rank: "레전드급 광대", icon: Star, color: "from-violet-500 to-purple-800" },
        { type: "지식의 신", title: "걸어 다니는 백과사전, 궁금증 파괴자", desc: "세상의 온갖 잡다한 지식부터 심오한 철학까지 당신의 뇌세포에 저장되어 있습니다. 사람들은 궁금한 게 생기면 구글보다 먼저 당신을 찾죠. 지적 호기심이 당신의 영원한 양식입니다.", power: "TMI 방출 & 팩트 체크", rank: "천재급 위키피디아", icon: Brain, color: "from-cyan-500 to-blue-700" },
        { type: "낭만의 신", title: "새벽 감성을 한 방울로 승화시키는 예술가", desc: "비 오는 창밖, 지는 노을만 보아도 영혼의 떨림을 느끼는 감수성의 끝판왕입니다. 당신이 쓴 글 한 줄에 세상은 촉촉하게 젖어 들고, 잊고 있던 낭만이 다시 꽃피우게 됩니다.", power: "눈물샘 자극 & 감성 폭발", rank: "감성급 밤의 시인", icon: Eye, color: "from-indigo-700 to-slate-900" }
    ];

    const generateGodType = () => {
        if (!name.trim()) return;
        setStep(1);

        setTimeout(() => {
            let hash = 0;
            for (let i = 0; i < name.length; i++) {
                hash = name.charCodeAt(i) + ((hash << 5) - hash);
            }

            const index = Math.abs(hash) % gods.length;
            setResultIndex(index);
            setStep(2);
        }, 1500);
    };

    const [resultIndex, setResultIndex] = useState(0);
    const currentGod = gods[resultIndex];

    const saveAsImage = useCallback(async () => {
        if (!resultRef.current) return;
        try {
            const dataUrl = await domToPng(resultRef.current, {
                backgroundColor: '#ffffff',
                scale: 2
            });
            const link = document.createElement('a');
            link.download = `tool-hive-god-${name}.png`;
            link.href = dataUrl;
            link.click();
        } catch (err) {
            console.error('Image saving failed:', err);
        }
    }, [name]);

    const godFaqs = [
        { q: "어떤 원리로 신의 유형이 결정되나요?", a: "사용자의 이름이 가진 고유한 유니코드 조합을 수치화하여 12가지 현대적 수호신 유형과 매칭합니다. 본인의 평소 성향과 결과가 얼마나 일치하는지 확인해 보세요!" },
        { q: "결과가 너무 이상하게 나왔어요!", a: "이 도구는 일상의 습관이나 특징을 재미있게 '신격화'하여 보여주는 유머 도구입니다. 가볍게 즐기시고 친구들과 결과를 비교하며 웃음을 나눠보세요." },
        { q: "개명하면 결과가 바뀌나요?", a: "네, 이름 기반 알고리즘이기 때문에 글자 하나만 바뀌어도 당신을 수호하는 신격 유형이 완전히 바뀔 수 있습니다." }
    ];

    return (
        <div className="max-w-4xl mx-auto px-4 py-8 space-y-12 mb-20 lowercase-none">
            <SEO
                title="내가 만약 신이라면? | 이름으로 보는 수호신 테스트"
                description="나는 무슨 신일까? 지름신, 잠의 신, 파괴의 신 등 이름만 넣으면 당신의 숨겨진 신성과 권능을 분석해 드립니다. 현대인 맞춤형 신격 테스트."
                keywords="신테스트, 신유형테스트, 이름테스트, 심리테스트, 지름신, 파괴의신, 무료진단, 바이럴도구"
                category="운세/재미"
                faqs={godFaqs}
                steps={["나의 이름을 입력창에 입력합니다.", "'신성 부여받기' 버튼을 클릭합니다.", "부여된 신의 이름과 권능, 등급을 확인합니다.", "장엄한 결과 카드를 저장하여 SNS에 배포해 보세요!"]}
            />

            {step === 0 && (
                <div className="text-center space-y-12 py-24 bg-slate-900 rounded-[4rem] border-8 border-slate-800 shadow-[0_0_100px_rgba(99,102,241,0.2)] animate-in fade-in duration-1000 relative overflow-hidden group">
                    {/* Animated Glow Background */}
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.15),transparent)] animate-pulse"></div>

                    <div className="flex justify-center relative">
                        <div className="w-28 h-28 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl shadow-[0_0_50px_rgba(99,102,241,0.5)] flex items-center justify-center text-white transform rotate-12 group-hover:rotate-0 transition-transform duration-500">
                            <Sparkles size={56} />
                        </div>
                    </div>

                    <div className="space-y-4 relative">
                        <h1 className="text-4xl md:text-7xl font-black text-white tracking-tight">내가 '신'이라면?</h1>
                        <p className="text-xl md:text-2xl text-slate-400 font-bold max-w-lg mx-auto leading-relaxed">
                            "평범한 인간의 삶 속에 숨겨진<br />당신의 장엄한 신성이 깨어납니다."
                        </p>
                    </div>

                    <div className="max-w-sm mx-auto space-y-8 relative">
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="함자(이름)를 입력하시오"
                            className="w-full px-10 py-6 rounded-[2.5rem] bg-slate-800 border-4 border-slate-700 focus:border-indigo-500 focus:outline-none text-2xl font-black transition-all shadow-inner text-white text-center"
                            maxLength={10}
                        />
                        <button
                            onClick={generateGodType}
                            disabled={!name.trim()}
                            className="w-full py-6 bg-indigo-600 text-white rounded-[2.5rem] text-2xl font-black hover:bg-indigo-500 hover:scale-110 active:scale-95 disabled:opacity-50 transition-all shadow-[0_20px_40px_rgba(79,70,229,0.3)] flex items-center justify-center gap-3"
                        >
                            신성 부여받기 <Zap size={28} />
                        </button>
                    </div>
                </div>
            )}

            {step === 1 && (
                <div className="min-h-[500px] flex flex-col items-center justify-center space-y-8 animate-in fade-in">
                    <div className="relative">
                        <div className="w-40 h-40 border-[16px] border-slate-100 border-t-indigo-600 rounded-full animate-spin"></div>
                        <Shield size={48} className="absolute inset-0 m-auto text-indigo-400 animate-pulse" />
                    </div>
                    <div className="text-center">
                        <p className="text-3xl font-black text-indigo-600 mb-2">신의 영역으로 접속 중...</p>
                        <p className="text-slate-400 font-bold tracking-widest uppercase text-xs">Calibrating Divine Essence for {name}</p>
                    </div>
                </div>
            )}

            {step === 2 && currentGod && (
                <div className="space-y-12 animate-in zoom-in-90 duration-700">
                    <div
                        ref={resultRef}
                        className="bg-white border-[20px] border-slate-50 rounded-[5rem] p-10 md:p-20 shadow-2xl relative overflow-hidden flex flex-col items-center"
                    >
                        {/* Divine Background Effects */}
                        <div className={`absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b ${currentGod.color} opacity-10 blur-3xl pointer-events-none`}></div>

                        <div className="relative w-full text-center space-y-16">
                            <div className="space-y-4">
                                <span className="px-6 py-2 bg-slate-900 text-white rounded-full text-xs font-black tracking-[0.5em] uppercase">DIVINE DECREE</span>
                                <h2 className="text-4xl md:text-6xl font-black text-slate-900">
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">{name}</span>님의 진정한 정체
                                </h2>
                            </div>

                            <div className="flex justify-center relative">
                                <div className={`w-36 h-36 md:w-56 md:h-56 rounded-[3rem] bg-gradient-to-br ${currentGod.color} text-white flex items-center justify-center shadow-2xl relative z-10 transform -rotate-3`}>
                                    {React.createElement(currentGod.icon, { size: 96 })}
                                </div>
                                <div className="absolute inset-0 bg-white blur-xl opacity-50 animate-pulse scale-150"></div>
                            </div>

                            <div className="space-y-8">
                                <div className="space-y-2">
                                    <div className="text-2xl font-black text-indigo-500 uppercase tracking-widest">TYPE : {currentGod.rank}</div>
                                    <h3 className="text-5xl md:text-8xl font-black text-slate-900 tracking-tighter break-keep">
                                        "{currentGod.type}"
                                    </h3>
                                </div>
                                <p className="text-xl md:text-3xl font-bold text-slate-500 italic max-w-2xl mx-auto leading-tight">
                                    {currentJob ? "" : currentGod.title}
                                </p>
                            </div>

                            <div className="bg-slate-50 p-10 md:p-14 rounded-[4rem] border border-slate-100 shadow-inner">
                                <p className="text-xl md:text-2xl font-bold text-slate-700 leading-relaxed break-keep">
                                    {currentGod.desc}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                                <div className="p-10 bg-white rounded-[3rem] shadow-xl border-2 border-slate-50 flex flex-col items-center gap-4 group hover:scale-105 transition-transform">
                                    <Zap className="text-indigo-500" size={40} />
                                    <div>
                                        <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">고유 권능</div>
                                        <div className="text-2xl font-black text-slate-800">{currentGod.power}</div>
                                    </div>
                                </div>
                                <div className="p-10 bg-white rounded-[3rem] shadow-xl border-2 border-slate-50 flex flex-col items-center gap-4 group hover:scale-105 transition-transform">
                                    <Star className="text-purple-500" size={40} />
                                    <div>
                                        <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">신격 등급</div>
                                        <div className="text-2xl font-black text-slate-800">{currentGod.rank.split(' ')[0]}</div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-12 flex flex-col items-center gap-2">
                                <div className="text-3xl font-black text-slate-200 tracking-[0.6em] uppercase">PANTHEON | TOOL HIVE</div>
                                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.4em]">Official Oracle & Divinity Analysis Tool</div>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap justify-center gap-6 no-print">
                        <button
                            onClick={saveAsImage}
                            className="px-12 py-6 bg-slate-900 text-white rounded-full font-black text-2xl hover:bg-slate-800 hover:scale-110 active:scale-95 transition-all shadow-2xl flex items-center gap-3"
                        >
                            <Download size={32} /> 신성 리포트 저장
                        </button>
                        <button
                            onClick={() => {
                                if (navigator.share) {
                                    navigator.share({ title: '나의 신성 분석 결과', text: `나는 "${currentGod.type}"! 당신은 어떤 신인가요?`, url: window.location.href });
                                } else {
                                    alert('서찰 링크가 복사되었습니다!');
                                    navigator.clipboard.writeText(window.location.href);
                                }
                            }}
                            className="px-12 py-6 bg-white text-slate-900 rounded-full font-black text-2xl hover:scale-110 active:scale-95 transition-all border-4 border-slate-50 shadow-lg flex items-center gap-3"
                        >
                            <Share2 size={32} /> 이 소식을 알리기
                        </button>
                        <button
                            onClick={() => setStep(0)}
                            className="px-12 py-6 border-4 border-transparent text-slate-400 rounded-full font-black text-2xl hover:text-indigo-600 transition-colors"
                        >
                            <RefreshCw size={32} /> 다른 인물 점지하기
                        </button>
                    </div>
                </div>
            )}

            <ToolGuide
                title="신격 유형 테스트 안내"
                intro="내가 만약 신이라면?'은 일상의 소소한 습관이나 현대인의 특징을 성스러운 신의 이미지로 재해석하여 시각적 즐거움과 유머를 선사하는 가벼운 분석 도구입니다."
                steps={["나의 함자(이름)를 경건하게 입력합니다.", "'신성 부여받기' 버튼을 통해 나를 수호하는 신격 유형을 찾습니다.", "도출된 신의 이름, 권능, 그리고 위트 있는 캐릭터 스토리를 읽어봅니다.", "성스러운 결과 카드를 다운로드하여 주변 친구들과 신성(?)을 겨뤄보세요."]}
                tips={[
                    "본인의 실명뿐 아니라 닉네임이나 상호명 등을 넣어보는 것도 신선한 재미가 됩니다.",
                    "결과에 나온 '고유 권능'이 실제 본인의 습관과 맞는지 비교해 보세요.",
                    "직장 동료들끼리 서로 어떤 '신'인지 공유하며 즐거운 점심시간 대화 소재로 활용해 보세요."
                ]}
                faqs={godFaqs}
            />
        </div>
    );
};

export default IfIAmGod;
