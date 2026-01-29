import React, { useState, useRef, useCallback } from 'react';
import { Download, Share2, RefreshCw, Scroll, Shield, Landmark, PenTool, Utensils, Music, User, Sparkles, Sword, Coins, Compass } from 'lucide-react';
import { domToPng } from 'modern-screenshot';
import SEO from '../components/SEO';
import ToolGuide from '../components/ToolGuide';

const JoseonJob = () => {
    const [name, setName] = useState('');
    const [step, setStep] = useState(0); // 0: Input, 1: Loading, 2: Result
    const resultRef = useRef(null);

    const jobs = [
        { title: "만백성의 어버이, 국왕(王)", desc: "당신은 구중궁궐의 주인이며 나라의 운명을 책임졌던 왕이었습니다. 지혜와 덕망으로 나라를 다스리고 백성을 평안케 한 당신의 이름은 수백 년 뒤 성군으로 기록되어 있습니다.", salary: "나라 전체", motto: "백성이 곧 하늘이며, 하늘의 뜻을 받드는 것이 왕의 도리다.", icon: Landmark, color: "from-red-700 to-red-900", tag: "Royal" },
        { title: "천재적인 기개의 암행어사", desc: "당신은 마패 하나로 탐관오리들을 벌벌 떨게 했던 정의의 사도였습니다. 평소엔 허름한 선비 차림으로 민심을 살피다 결정적인 순간 '암행어사 출두야!'를 외치던 당신은 백성들의 영웅이었습니다.", salary: "봉급 + 포상금", motto: "어둠 속에서 진리를 찾고, 가려진 눈물을 닦아주리라.", icon: Sparkles, color: "from-blue-600 to-indigo-800", tag: "Official" },
        { title: "한양 최고의 상단 행수", desc: "당신은 조선의 경제를 쥐락펴락하던 자산가였습니다. 예리한 판단력과 남다른 신용으로 전국 각지에 상점을 열고 해외 무역까지 진출했으니, 오늘날로 치면 대기업 회장님과 같습니다.", salary: "막대한 이윤", motto: "장사는 이문을 남기는 것이 아니라 사람을 남기는 것이다.", icon: Coins, color: "from-yellow-600 to-amber-800", tag: "Merchant" },
        { title: "대륙을 호령한 무적의 장군", desc: "당신은 전장을 누비며 외적의 침입을 막아낸 전설적인 무신이었습니다. 당신의 칼날 앞에 적들은 추풍낙엽처럼 쓰러졌으며, 당신이 이끄는 군대는 결코 패배를 모르는 무적의 군단이었습니다.", salary: "녹봉 + 품계", motto: "나의 한 목숨 바쳐 이 나라의 강산을 지키리라.", icon: Sword, color: "from-slate-700 to-stone-900", tag: "Warrior" },
        { title: "청렴결백한 산림 처사(선비)", score: 5, desc: "당신은 권위와 재물을 멀리하고 학문 수양에만 전념했던 고결한 지식인이었습니다. 대숲 사이 바람 소리를 벗 삼아 시를 읊고 진리를 탐구하던 당신의 글은 지금까지도 후학들의 귀감이 되고 있습니다.", salary: "마음의 풍요", motto: "책 속에 길이 있고, 붓 끝에 정의가 살아있다.", icon: PenTool, color: "from-emerald-700 to-teal-900", tag: "Scholar" },
        { title: "팔도를 누비는 만능 보부상", desc: "당신은 머리엔 솜을 이고 등엔 짐을 진 채 전국 팔도를 발로 뛰던 유통의 달인이었습니다. 당신의 발길이 닿지 않는 곳이 없었으며, 당신이 전해주는 소식은 온 나라를 들썩이게 하는 정보의 원천이었습니다.", salary: "수수료 + 여비", motto: "길위에 집이 있고, 사람 사이에 길이 있다.", icon: Compass, color: "from-orange-600 to-amber-700", tag: "Worker" },
        { title: "흥과 끼가 넘치는 남사당패 광대", desc: "당신은 고달픈 인생사 속에서 백성들에게 웃음과 눈물을 선사하던 최고의 예인이었습니다. 외줄 타기부터 판소리까지, 당신이 나타나면 그곳은 언제나 축제의 장이 되었고 근심은 연기처럼 사라졌습니다.", salary: "관객의 환호 + 엽전", motto: "인생은 한 판 놀음, 웃고 즐기다 가면 그만인 것을.", icon: Music, color: "from-pink-600 to-purple-800", tag: "Artist" },
        { title: "주막의 절대 권력자, 주모", desc: "당신은 나그네들의 쉼터이자 온갖 정보가 모이는 주막의 주인이었습니다. 시원시원한 성격과 맛깔나는 음식 솜씨로 당신의 주막은 언제나 문전성시를 이루었으며, 당신의 칭찬 한마디에 소문이 강산을 넘었습니다.", salary: "국밥 값 + 막걸리 값", motto: "배고픈 이에겐 밥 한 그릇, 목마른 이에겐 술 한 잔이 최고의 위로다.", icon: Utensils, color: "from-rose-600 to-red-800", tag: "Commoner" },
        { title: "무쇠를 녹이는 신의 손, 대장장이", desc: "당신은 뜨거운 가마솥 앞에서 쇠를 벼리던 장인이었습니다. 당신이 만든 농기구는 풍년을 가져오고, 당신이 벼린 칼은 나라를 지켰습니다. 당신의 땀방울이 곧 나라의 힘이 되었습니다.", salary: "수공비", motto: "두드릴수록 강해지고, 담금질할수록 빛난다.", icon: Shield, color: "from-orange-800 to-amber-950", tag: "Artisan" },
        { title: "궁중의 비밀을 간직한 상궁", desc: "당신은 궁궐의 안살림을 책임지고 왕실을 보좌했던 지혜로운 여인이었습니다. 철저한 예법과 투철한 책임감으로 거친 궁 안의 풍파를 이겨내며 역사의 현장을 지켜보았습니다.", salary: "궁중 녹봉", motto: "보고도 못 본 척, 알고도 모르는 척이 궁의 법도다.", icon: User, color: "from-purple-800 to-indigo-950", tag: "Court" }
    ];

    const generateJob = () => {
        if (!name.trim()) return;
        setStep(1);

        setTimeout(() => {
            let hash = 0;
            for (let i = 0; i < name.length; i++) {
                hash = name.charCodeAt(i) + ((hash << 5) - hash);
            }

            const index = Math.abs(hash) % jobs.length;
            setResultIndex(index);
            setStep(2);
        }, 1500);
    };

    const [resultIndex, setResultIndex] = useState(0);
    const currentJob = jobs[resultIndex];

    const saveAsImage = useCallback(async () => {
        if (!resultRef.current) return;
        try {
            const dataUrl = await domToPng(resultRef.current, {
                backgroundColor: '#f5f5dc', // Beige/Paper color
                scale: 2
            });
            const link = document.createElement('a');
            link.download = `tool-hive-joseon-${name}.png`;
            link.href = dataUrl;
            link.click();
        } catch (err) {
            console.error('Image saving failed:', err);
        }
    }, [name]);

    const joseonFaqs = [
        { q: "조선시대 직업 테스트의 기준은 무엇인가요?", a: "입력하신 성함의 유니코드 조합을 수치화하여 조선시대의 각 직업군이 가진 성격적 이미지와 매칭합니다. 본인뿐만 아니라 친구나 가족의 이름을 넣어보는 것도 재미있습니다!" },
        { q: "결과가 마음에 안 들면 어떡하죠?", a: "전생이나 가상의 직업을 판별하는 재미 도구입니다. 비록 결과가 '망나니'나 '노비'일지라도 그 시대엔 없어서는 안 될 중요한 역할이었음을 기억하며 웃으며 넘겨주세요!" },
        { q: "이름을 한자로 넣으면 결과가 달라지나요?", a: "네, 한글 이름과 한자 이름은 유니코드가 다르므로 결과가 달라질 수 있습니다. 평소 불리는 방식에 맞춰 테스트해보세요." }
    ];

    return (
        <div className="max-w-4xl mx-auto px-4 py-8 space-y-12 mb-20 scroll-smooth">
            <SEO
                title="조선시대 직업 테스트 | 나의 전생 신분 진단하기"
                description="내가 조선시대에 태어났다면? 왕, 선비, 혹은 보부상? 이름만 넣으면 당신의 과거 신분과 직업을 위트 있는 스토리로 분석해 드립니다."
                keywords="조선시대직업, 전생테스트, 과거신분테스트, 이름전생, 조선시대이름테스트, 꿀잼테스트, 바이럴도구"
                category="운세/재미"
                faqs={joseonFaqs}
                steps={["나의 이름을 정갈하게 입력합니다.", "'신분 확인하기'를 클릭하여 명부를 조사합니다.", "도출된 조선시대 직업과 상세 스토리를 읽어봅니다.", "멋진 결과지를 이미지로 저장하여 지인들에게 배첩합니다."]}
            />

            {step === 0 && (
                <div className="text-center space-y-12 py-24 bg-[#f9f5e7] rounded-[3rem] border-8 border-double border-[#d4a373] shadow-2xl animate-in fade-in duration-1000 relative overflow-hidden">
                    {/* Background Texture Overlay */}
                    <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/handmade-paper.png')]"></div>

                    <div className="flex justify-center relative">
                        <div className="w-24 h-24 bg-white rounded-full shadow-2xl flex items-center justify-center text-[#9c6644] border-4 border-[#d4a373] animate-pulse">
                            <Scroll size={48} />
                        </div>
                    </div>

                    <div className="space-y-4 relative">
                        <h1 className="text-4xl md:text-6xl font-black text-[#582f0e] tracking-tight font-serif">조선시대 직업 테스트</h1>
                        <p className="text-lg md:text-2xl text-[#a68a64] font-bold max-w-lg mx-auto leading-relaxed italic">
                            "천지가 개벽할 당신의 전생 신분이<br />이 서찰 안에 적혀 있소."
                        </p>
                    </div>

                    <div className="max-w-sm mx-auto space-y-8 relative">
                        <div className="space-y-2">
                            <label className="text-sm font-black text-[#9c6644] uppercase tracking-widest block text-left px-2">성명(姓名)을 입력하시오</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="당신의 함자를 넣으시오"
                                className="w-full px-8 py-5 rounded-2xl border-4 border-[#d4a373] focus:border-[#582f0e] focus:outline-none text-2xl font-black transition-all shadow-inner bg-white/90 text-[#3d1a00]"
                                maxLength={10}
                            />
                        </div>
                        <button
                            onClick={generateJob}
                            disabled={!name.trim()}
                            className="w-full py-5 bg-[#582f0e] text-[#fefae0] rounded-2xl text-2xl font-black hover:bg-[#3d1a00] hover:scale-[1.03] active:scale-95 disabled:opacity-50 transition-all shadow-2xl flex items-center justify-center gap-3 border-b-8 border-[#2d1606]"
                        >
                            <User size={28} /> 신분 확인하기
                        </button>
                    </div>
                </div>
            )}

            {step === 1 && (
                <div className="min-h-[400px] flex flex-col items-center justify-center space-y-8 animate-in fade-in">
                    <div className="relative">
                        <div className="w-32 h-32 border-[12px] border-[#e9edc9] border-t-[#582f0e] rounded-full animate-spin"></div>
                        <Landmark size={40} className="absolute inset-0 m-auto text-[#d4a373] animate-bounce" />
                    </div>
                    <div className="text-center">
                        <p className="text-2xl font-black text-[#582f0e] mb-2 font-serif">역사 속의 기록지를 뒤적이는 중이오...</p>
                        <p className="text-[#a68a64] font-bold tracking-widest">Searching the Royal Archives of Joseon</p>
                    </div>
                </div>
            )}

            {step === 2 && currentJob && (
                <div className="space-y-12 animate-in zoom-in-95 duration-700">
                    <div
                        ref={resultRef}
                        className="bg-[#fdfcf0] border-[16px] border-double border-[#d4a373] rounded-[4rem] p-8 md:p-16 shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] relative overflow-hidden flex flex-col items-center"
                    >
                        {/* Antique Paper Effects */}
                        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')]"></div>
                        <div className="absolute top-0 left-0 w-full h-12 bg-gradient-to-b from-[#d4a373]/20 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-[#d4a373]/20 to-transparent"></div>

                        <div className="relative w-full text-center space-y-12">
                            <div className="space-y-4">
                                <div className="inline-block px-4 py-1 border-2 border-[#582f0e] text-[#582f0e] font-black text-xs tracking-[0.3em] rounded">朝鮮王朝實錄</div>
                                <h2 className="text-3xl md:text-5xl font-black text-[#3d1a00] font-serif">
                                    <span className="border-b-4 border-[#d4a373]">{name}</span>님의 전생 신분증명서
                                </h2>
                            </div>

                            <div className="flex justify-center">
                                <div className={`w-32 h-32 md:w-48 md:h-48 rounded-2xl bg-gradient-to-br ${currentJob.color} text-white flex items-center justify-center shadow-2xl shadow-indigo-900/40 transform -rotate-2 border-4 border-[#faedcd]`}>
                                    {React.createElement(currentJob.icon, { size: 72 })}
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="text-[#9c6644] font-black text-xl tracking-tighter">[ {currentJob.tag} ]</div>
                                <h3 className="text-4xl md:text-6xl font-black text-[#582f0e] leading-tight font-serif break-keep">
                                    {currentJob.title}
                                </h3>
                            </div>

                            <div className="max-w-xl mx-auto py-10 px-8 bg-white/50 rounded-[2.5rem] border-2 border-dashed border-[#d4a373] text-xl md:text-2xl leading-relaxed text-[#3d1a00] italic font-serif break-keep">
                                "{currentJob.desc}"
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                                <div className="p-8 bg-[#fefae0] rounded-3xl border-2 border-[#ccd5ae] space-y-3 shadow-md">
                                    <h4 className="font-black text-sm text-[#582f0e] uppercase tracking-widest flex items-center gap-2">
                                        <Coins size={18} /> 한 달 수입 (綠俸)
                                    </h4>
                                    <p className="text-2xl font-black text-[#3d1a00]">{currentJob.salary}</p>
                                </div>
                                <div className="p-8 bg-[#fefae0] rounded-3xl border-2 border-[#ccd5ae] space-y-3 shadow-md">
                                    <h4 className="font-black text-sm text-[#582f0e] uppercase tracking-widest flex items-center gap-2">
                                        <PenTool size={18} /> 평생의 좌우명
                                    </h4>
                                    <p className="text-xl font-black text-[#3d1a00] leading-tight">{currentJob.motto}</p>
                                </div>
                            </div>

                            <div className="pt-12 flex flex-col items-center gap-2 border-t-2 border-[#d4a373]/30">
                                <div className="text-sm font-black text-[#d4a373] tracking-[0.8em] mb-1 uppercase">TOOL HIVE | 歷史研究所</div>
                                <div className="text-[10px] text-[#bc6c25] font-bold uppercase tracking-widest">이것은 기록에 의한 실제 상황임을 증명하오</div>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap justify-center gap-4 no-print">
                        <button
                            onClick={saveAsImage}
                            className="px-12 py-5 bg-[#582f0e] text-[#fefae0] rounded-full font-black text-2xl hover:scale-105 active:scale-95 transition-all shadow-2xl flex items-center gap-3"
                        >
                            <Download size={28} /> 신분 서찰 내려받기
                        </button>
                        <button
                            onClick={() => {
                                alert('서찰 링크가 복사되었습니다! 세상에 널리 알리시오.');
                                navigator.clipboard.writeText(window.location.href);
                            }}
                            className="px-12 py-5 bg-white text-[#582f0e] rounded-full font-black text-2xl hover:scale-105 active:scale-95 transition-all border-4 border-[#faedcd] shadow-lg flex items-center gap-3"
                        >
                            <Share2 size={28} /> 소문 내기
                        </button>
                        <button
                            onClick={() => setStep(0)}
                            className="px-12 py-5 bg-[#e9edc9] text-[#582f0e] rounded-full font-black text-2xl hover:bg-[#ccd5ae] transition-colors"
                        >
                            <RefreshCw size={28} /> 다시 태어나기
                        </button>
                    </div>
                </div>
            )}

            <ToolGuide
                title="조선시대 직업 진단 안내"
                intro="조선시대 직업 테스트는 고전 문헌과 직업군별 특징을 바탕으로 사용자의 이름이 가진 상징성을 역사적 사실들과 매칭해 보는 인문학적 상상 도구입니다."
                steps={["나의 전체 함자(이름)를 빈칸에 적습니다.", "'신분 확인하기'를 통해 수백 년 전 전생으로 여행합니다.", "도출된 나의 신분과 좌우명을 확인하고 현재의 삶과 비교해봅니다.", "조상님들의 기운이 서린 결과 서찰을 저장하여 주변에 널리 알립니다."]}
                tips={[
                    "정확한 역사적 고증보다는 재미와 해학에 초점을 맞추어 즐겨주세요.",
                    "결과가 '왕'이 나왔다면 오늘 하루는 왕처럼 위풍당당하게 지내보시는 건 어떨까요?",
                    "친구들과 함께 모여 '조선시대 판 어벤져스' 팀을 짜보는 것도 큰 재미가 될 것입니다."
                ]}
                faqs={joseonFaqs}
            />
        </div>
    );
};

export default JoseonJob;
