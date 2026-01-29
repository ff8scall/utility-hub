import React, { useState, useRef, useCallback } from 'react';
import { Download, Share2, RefreshCw, Music, Disc, Sparkles, Heart, Moon, Sun, Zap, Coffee, CloudRain, Star, Headphones } from 'lucide-react';
import { domToPng } from 'modern-screenshot';
import SEO from '../components/SEO';
import ToolGuide from '../components/ToolGuide';

const LifeBgm = () => {
    const [name, setName] = useState('');
    const [emotion, setEmotion] = useState('Happy');
    const [step, setStep] = useState(0); // 0: Input, 1: Loading, 2: Result
    const resultRef = useRef(null);

    const emotions = [
        { id: 'Happy', label: '행복해', icon: Sun, color: 'text-yellow-500' },
        { id: 'Sad', label: '우울해', icon: CloudRain, color: 'text-blue-500' },
        { id: 'Excited', label: '신나!', icon: Zap, color: 'text-orange-500' },
        { id: 'Tired', label: '지쳤어', icon: Coffee, color: 'text-stone-500' },
        { id: 'Relaxed', label: '편안해', icon: Moon, color: 'text-indigo-500' },
        { id: 'Lonely', label: '외로워', icon: Star, color: 'text-purple-400' },
        { id: 'Angry', label: '화나!', icon: Zap, color: 'text-red-500' },
        { id: 'Bored', label: '심심해', icon: Music, color: 'text-slate-400' }
    ];

    const playlistData = {
        Happy: { title: "햇살 가득한 오후의 산책", tracks: ["비눗방울 여행", "Lollipop Sky", "네가 웃으면 나도 좋아"], mood: "밝고 경쾌한" },
        Sad: { title: "비오는 창가에서 듣는 위로", tracks: ["텅 빈 의자", "Midnight Piano", "괜찮아, 그럴 수 있어"], mood: "잔잔하고 위로가 되는" },
        Excited: { title: "심장이 터질 듯한 축제의 밤", tracks: ["Neon Heartbeat", "오늘의 주인공은 나", "무지개 끝까지"], mood: "파워풀하고 에너틱한" },
        Tired: { title: "지친 하루의 끝, 수고했어", tracks: ["베개 위로의 여행", "심호흡 한 번", "Off Ground"], mood: "차분하고 편안한" },
        Relaxed: { title: "함께 걷는 노을 길", tracks: ["바람의 속삭임", "Slow Tempo", "그늘 아래서"], mood: "감성적이고 고즈넉한" },
        Lonely: { title: "별빛이 내리는 밤의 독백", tracks: ["혼자라도 괜찮은 밤", "달빛 조각", "Missing You"], mood: "고독하지만 아름다운" },
        Angry: { title: "불타는 분노의 심포니", tracks: ["Crash and Burn", "나 건드리지 마", "싹 다 갈아엎어"], mood: "강렬하고 비트 있는" },
        Bored: { title: "나른한 시계 소리", tracks: ["먼지 춤추는 풍경", "무한 스크롤의 늪", "Zzz..."], mood: "몽환적이고 나른한" }
    };

    const generateBgm = () => {
        if (!name.trim()) return;
        setStep(1);

        setTimeout(() => {
            let hash = 0;
            for (let i = 0; i < name.length; i++) {
                hash = name.charCodeAt(i) + ((hash << 5) - hash);
            }

            setStep(2);
        }, 1500);
    };

    const currentPlaylist = playlistData[emotion] || playlistData.Happy;

    const saveAsImage = useCallback(async () => {
        if (!resultRef.current) return;
        try {
            const dataUrl = await domToPng(resultRef.current, {
                backgroundColor: '#ffffff',
                scale: 2
            });
            const link = document.createElement('a');
            link.download = `tool-hive-life-bgm-${name}.png`;
            link.href = dataUrl;
            link.click();
        } catch (err) {
            console.error('Image saving failed:', err);
        }
    }, [name]);

    const bgmFaqs = [
        { q: "인생 BGM은 어떻게 선정되나요?", a: "입력하신 이름과 선택하신 현재의 감정 상태를 인공지능 음악 추천 알고리즘에 대입하여, 지금 이 순간 당신의 인생이 한 편의 영화라면 깔릴 법한 가장 어울리는 곡들을 추출합니다." },
        { q: "실제 음악을 들을 수 있나요?", a: "이 도구는 가상의 OST 제목과 분위기를 생성해 드리는 재미용 도구입니다. 하지만 결과에 영감을 받아 실제 유사한 분위기의 음악을 찾아보시는 것을 추천합니다!" },
        { q: "감정에 따라 결과가 많이 달라지나요?", a: "네, 같은 이름일지라도 현재의 기분에 따라 당신을 둘러싼 '에너지 필드'가 달라지므로 완전히 다른 플레이리스트가 도출됩니다." }
    ];

    return (
        <div className="max-w-4xl mx-auto px-4 py-8 space-y-12 mb-20 lowercase-none">
            <SEO
                title="인생 BGM 추출기 | 나의 삶이 영화라면 어떤 음악이 흐를까?"
                description="나의 인생을 음악으로 표현한다면? 이름과 기분만 선택하면 당신의 인생 스토리에 어울리는 가상 OST를 추천해 드립니다. 감성 LP 이미지 생성기."
                keywords="인생BGM, 인생음악, 심리테스트, 이름테스트, 감성테스트, LP이미지, 플레이리스트추천, 바이럴도구"
                category="운세/재미"
                faqs={bgmFaqs}
                steps={["나의 이름을 입력합니다.", "현재 나의 감정 상태를 선택합니다.", "'BGM 추출하기' 버튼을 클릭합니다.", "생성된 나만의 LP와 플레이리스트를 확인하고 감성을 친구들과 공유합니다."]}
            />

            {step === 0 && (
                <div className="text-center space-y-12 py-20 bg-stone-900 rounded-[4rem] border-8 border-stone-800 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl"></div>

                    <div className="flex justify-center relative">
                        <div className="w-24 h-24 bg-stone-100 rounded-full flex items-center justify-center text-stone-900 animate-spin-slow shadow-2xl">
                            <Disc size={48} />
                        </div>
                        <div className="absolute -top-4 -right-4 p-4 bg-white text-indigo-600 rounded-2xl shadow-xl animate-bounce">
                            <Headphones size={24} />
                        </div>
                    </div>

                    <div className="space-y-4 px-6 relative">
                        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter">인생 BGM 추출기</h1>
                        <p className="text-lg md:text-xl text-stone-400 font-medium max-w-lg mx-auto leading-relaxed">
                            "지금 이 순간, 당신의 삶이 한 편의 영화라면<br />배경음악으로 흐를 가장 감성적인 곡은?"
                        </p>
                    </div>

                    <div className="max-w-xl mx-auto px-6 space-y-10 relative">
                        <div className="space-y-4">
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="당신의 함자를 입력하세요"
                                className="w-full px-8 py-5 rounded-[2rem] bg-stone-800 border-4 border-stone-700 focus:border-indigo-500 focus:outline-none text-xl font-black transition-all shadow-inner text-white text-center"
                                maxLength={10}
                            />
                        </div>

                        <div className="space-y-4">
                            <p className="text-stone-500 font-black text-sm uppercase tracking-widest">지금 기분은 어떤가요?</p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {emotions.map((e) => (
                                    <button
                                        key={e.id}
                                        onClick={() => setEmotion(e.id)}
                                        className={`p-4 rounded-2xl border-4 transition-all flex flex-col items-center gap-2 group ${emotion === e.id
                                                ? 'bg-indigo-600 border-indigo-400 text-white scale-105 shadow-xl'
                                                : 'bg-stone-800 border-stone-700 text-stone-500 hover:border-indigo-500'
                                            }`}
                                    >
                                        <e.icon size={24} className={emotion === e.id ? 'text-white' : e.color} />
                                        <span className="font-bold">{e.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={generateBgm}
                            disabled={!name.trim()}
                            className="w-full py-5 bg-white text-stone-900 rounded-[2rem] text-xl font-black hover:scale-110 active:scale-95 disabled:opacity-30 transition-all shadow-[0_20px_40px_rgba(255,255,255,0.1)] flex items-center justify-center gap-2"
                        >
                            BGM 추출하기 <Sparkles size={24} />
                        </button>
                    </div>
                </div>
            )}

            {step === 1 && (
                <div className="min-h-[400px] flex flex-col items-center justify-center space-y-8 animate-in fade-in">
                    <div className="relative">
                        <div className="w-40 h-40 border-[16px] border-stone-100 border-t-indigo-600 rounded-full animate-spin"></div>
                        <Disc size={48} className="absolute inset-0 m-auto text-indigo-400 animate-pulse" />
                    </div>
                    <div className="text-center">
                        <p className="text-2xl font-black text-indigo-600 mb-2">당신의 에너지를 음악으로 변환 중...</p>
                        <p className="text-stone-400 font-bold tracking-widest uppercase text-xs">Aural DNA Composition for {name}</p>
                    </div>
                </div>
            )}

            {step === 2 && currentPlaylist && (
                <div className="space-y-12 animate-in slide-in-from-bottom-5 duration-700">
                    <div
                        ref={resultRef}
                        className="bg-white border-[20px] border-stone-50 rounded-[5rem] p-10 md:p-16 shadow-2xl relative overflow-hidden flex flex-col items-center md:flex-row gap-12"
                    >
                        {/* Vinyl Section */}
                        <div className="w-full md:w-1/2 flex justify-center items-center relative py-10">
                            <div className="w-64 h-64 md:w-80 md:h-80 bg-stone-900 rounded-full shadow-[0_20px_60px_rgba(0,0,0,0.5)] flex items-center justify-center relative animate-spin-slow">
                                {/* Grooves */}
                                <div className="absolute inset-4 border border-white/10 rounded-full"></div>
                                <div className="absolute inset-10 border border-white/5 rounded-full"></div>
                                <div className="absolute inset-20 border border-white/5 rounded-full"></div>
                                {/* Label */}
                                <div className="w-24 h-24 md:w-32 md:h-32 bg-indigo-600 rounded-full flex flex-col items-center justify-center text-white p-4 text-center border-4 border-white/20">
                                    <div className="text-[10px] uppercase font-black tracking-widest mb-1">SIDE A</div>
                                    <div className="text-xs md:text-sm font-black leading-tight truncate w-full">{name}</div>
                                    <div className="w-2 h-2 bg-stone-900 rounded-full mt-2 shadow-inner"></div>
                                </div>
                            </div>
                            <div className="absolute -top-4 -right-4 bg-indigo-50/80 backdrop-blur-md p-4 rounded-3xl border border-indigo-100 shadow-xl">
                                <Headphones size={40} className="text-indigo-600" />
                            </div>
                        </div>

                        {/* Text Section */}
                        <div className="w-full md:w-1/2 space-y-8 text-center md:text-left">
                            <div className="space-y-2">
                                <span className="text-xs font-black text-indigo-500 tracking-widest uppercase">OST TRACK LIST</span>
                                <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter leading-tight break-keep">
                                    "{currentPlaylist.title}"
                                </h2>
                                <p className="text-xl font-bold text-slate-400">by {name} - {currentPlaylist.mood} 선율</p>
                            </div>

                            <div className="space-y-4 pt-6 border-t-2 border-slate-50">
                                {currentPlaylist.tracks.map((track, i) => (
                                    <div key={i} className="flex items-center gap-4 group">
                                        <span className="text-xl font-black text-indigo-200 group-hover:text-indigo-600 transition-colors">0{i + 1}</span>
                                        <div className="flex-1 text-left">
                                            <div className="text-lg font-black text-slate-700">{track}</div>
                                            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Original Soundtrack</div>
                                        </div>
                                        <Music size={16} className="text-slate-200" />
                                    </div>
                                ))}
                            </div>

                            <div className="pt-8 flex items-end justify-between border-t border-slate-50 opacity-50">
                                <div>
                                    <div className="text-sm font-black text-slate-800 tracking-widest uppercase">TOOL HIVE</div>
                                    <div className="text-[10px] text-slate-400 font-bold">RECORDS & ENTERTAINMENT</div>
                                </div>
                                <div className="text-[10px] font-black text-slate-300">© 2026 LIFE OST LAB</div>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap justify-center gap-6 no-print">
                        <button
                            onClick={saveAsImage}
                            className="px-12 py-6 bg-stone-900 text-white rounded-full font-black text-2xl hover:bg-black hover:scale-105 active:scale-95 transition-all shadow-2xl flex items-center gap-3"
                        >
                            <Download size={28} /> LP 카드 이미지 저장
                        </button>
                        <button
                            onClick={() => {
                                alert('나의 인생 BGM 링크가 복사되었습니다!');
                                navigator.clipboard.writeText(window.location.href);
                            }}
                            className="px-12 py-6 bg-white text-stone-900 rounded-full font-black text-2xl hover:scale-105 active:scale-95 transition-all border-4 border-stone-50 shadow-lg flex items-center gap-3"
                        >
                            <Share2 size={28} /> 친구들에게 공유
                        </button>
                        <button
                            onClick={() => setStep(0)}
                            className="px-12 py-6 text-slate-400 rounded-full font-black text-2xl hover:text-indigo-600 transition-colors"
                        >
                            <RefreshCw size={28} /> 기분 다시 설정
                        </button>
                    </div>
                </div>
            )}

            <ToolGuide
                title="인생 BGM 추출기 가이드"
                intro="인생 BGM 추출기(Life BGM Extractor)는 사용자의 삶의 서사와 현재의 정서 상태를 음악적 메타데이터로 변환하여 개인 맞춤형 가상 OST 리스트를 생성해 드리는 감성 도구입니다."
                steps={["나의 이름을 기입합니다.", "현재 내가 느끼고 있는 솔직한 감정 상태를 아이콘에서 선택합니다.", "'BGM 추출하기'를 눌러 나만의 감성 LP와 트랙 리스트를 받습니다.", "완성된 플레이리스트를 이미지로 저장하여 개인 소장하거나 SNS에 공유해보세요."]}
                tips={[
                    "아침, 점심, 저녁에 따라 기분이 달라질 때마다 테스트해보면 매번 새로운 인생 분위기를 발견할 수 있습니다.",
                    "결과에 나온 노래 제목들을 보고 실제 본인과 가장 닮은 음악 장르가 무엇일지 상상해 보세요.",
                    "친구들과 플레이리스트를 서로 교환하여 서로의 감성을 깊이 이해하는 시간을 가져볼 수 있습니다."
                ]}
                faqs={bgmFaqs}
            />
            {/* Custom Animation for Rotate */}
            <style jsx>{`
                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-spin-slow {
                    animation: spin-slow 10s linear infinite;
                }
            `}</style>
        </div>
    );
};

export default LifeBgm;
