import React, { useState } from 'react';
import SEO from '../components/SEO';
import { PenTool, Check, AlertCircle, Info, ChevronDown, ChevronUp } from 'lucide-react';
import { hangulStrokes, soundElements, elementNames, suri81 } from '../data/NameAnalysisData';
import ShareButtons from '../components/ShareButtons';

const NameAnalysis = () => {
    const [name, setName] = useState('');
    const [mode, setMode] = useState('hangul'); // 'hangul' or 'hanja'
    const [hanjaStrokes, setHanjaStrokes] = useState([0, 0, 0]); // 성, 상명자, 하명자 획수
    const [result, setResult] = useState(null);

    const handleNameChange = (e) => {
        const val = e.target.value;
        if (val.length <= 3) setName(val);
    };

    const getHangulStroke = (char) => {
        // 단순화된 로직: 실제로는 자모 분리 라이브러리가 필요하지만, 
        // 여기서는 약식으로 초성+중성+종성 획수 합을 추정하거나 
        // 미리 정의된 매핑을 사용해야 함. 
        // *중요*: 완벽한 한글 획수 계산을 위해서는 'hangul-js' 같은 라이브러리로 자모 분해 필요.
        // 이 예제에서는 사용자가 직접 입력하는 '정밀 모드'를 권장하고, 
        // 한글 모드는 '재미로 보는' 용도로 안내.

        // 임시: 글자당 평균 획수 또는 랜덤이 아닌, 
        // 실제로는 복잡하므로 여기서는 '한자 획수 입력'을 유도하는 UI에 집중.
        return 0;
    };

    const analyze = () => {
        if (name.length < 2) {
            alert('이름은 2글자 이상이어야 합니다.');
            return;
        }

        let strokes = [];
        if (mode === 'hangul') {
            // 한글 모드: 약식 계산 (실제 서비스에선 자모 분해 로직 필수)
            // 여기서는 데모용으로 글자 획수를 임의 배정하지 않고,
            // *정밀 모드* 사용을 유도하기 위해 한글 모드는 발음 오행만 분석.
            strokes = [0, 0, 0];
        } else {
            strokes = hanjaStrokes.slice(0, name.length);
        }

        // 1. 발음 오행 (한글 초성 기준)
        const elements = name.split('').map(char => {
            const code = char.charCodeAt(0) - 44032;
            if (code < 0 || code > 11171) return null;
            const cho = Math.floor(code / 588);
            const jamo = ['ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'][cho];
            return soundElements[jamo] || soundElements[Object.keys(soundElements).find(k => k === jamo)] || 'earth'; // Fallback
        });

        // 2. 81수리 (원형이정)
        let suriResult = {};
        if (mode === 'hanja') {
            // 원격 (초년): 상명자 + 하명자 (이름 두 글자)
            // 형격 (청년): 성 + 상명자
            // 이격 (장년): 성 + 하명자
            // 정격 (말년): 총 획수

            const s1 = strokes[0]; // 성
            const s2 = strokes[1]; // 상명자
            const s3 = strokes[2] || 0; // 하명자 (외자일 경우 0)

            const won = s2 + s3; // 초년
            const hyung = s1 + s2; // 청년 (핵심)
            const lee = s1 + s3; // 장년
            const jung = s1 + s2 + s3; // 말년

            suriResult = {
                won: { score: won, ...getSuriInfo(won) },
                hyung: { score: hyung, ...getSuriInfo(hyung) },
                lee: { score: lee, ...getSuriInfo(lee) },
                jung: { score: jung, ...getSuriInfo(jung) }
            };
        }

        setResult({
            elements,
            suri: suriResult,
            isHanja: mode === 'hanja'
        });
    };

    const getSuriInfo = (num) => {
        const idx = num % 81 === 0 ? 81 : num % 81;
        const info = suri81[idx];
        return info || { type: 'pyung', title: '평범격', desc: '무난하고 평범한 운세입니다.' };
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <SEO
                title="무료 성명학 - 이름 풀이 & 81수리 | Utility Hub"
                description="내 이름에 담긴 운명은? 발음 오행과 정통 81수리로 이름을 무료로 풀이해드립니다. 한자 획수를 입력하면 더 정확한 결과를 볼 수 있습니다."
                keywords="성명학, 무료이름풀이, 81수리, 한글성명학, 이름운세, 작명"
            />

            <div className="text-center space-y-4 py-6">
                <div className="inline-flex items-center justify-center p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-full mb-2">
                    <PenTool className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                    성명학 이름 풀이
                </h1>
                <p className="text-muted-foreground">
                    이름의 소리와 수리에 담긴 운명을 분석해 드립니다.
                </p>
            </div>

            {/* 입력 폼 */}
            <div className="max-w-xl mx-auto bg-card border border-border rounded-xl p-6 shadow-sm space-y-6">
                <div>
                    <label className="block text-sm font-medium mb-2">이름 (한글)</label>
                    <input
                        type="text"
                        value={name}
                        onChange={handleNameChange}
                        placeholder="홍길동"
                        className="w-full p-3 border border-border rounded-xl bg-background text-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                </div>

                <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                    <div className="flex-1">
                        <h4 className="font-medium text-sm mb-1">분석 모드</h4>
                        <p className="text-xs text-muted-foreground">
                            {mode === 'hangul' ? '발음 오행 위주 분석' : '한자 획수 기반 정밀 분석 (81수리)'}
                        </p>
                    </div>
                    <div className="flex bg-background rounded-lg p-1 border border-border">
                        <button
                            onClick={() => setMode('hangul')}
                            className={`px-3 py-1.5 text-sm rounded-md transition-all ${mode === 'hangul' ? 'bg-indigo-100 text-indigo-700 font-bold' : 'text-muted-foreground'}`}
                        >
                            간편
                        </button>
                        <button
                            onClick={() => setMode('hanja')}
                            className={`px-3 py-1.5 text-sm rounded-md transition-all ${mode === 'hanja' ? 'bg-indigo-100 text-indigo-700 font-bold' : 'text-muted-foreground'}`}
                        >
                            정밀
                        </button>
                    </div>
                </div>

                {mode === 'hanja' && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                        <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 text-xs rounded-lg flex items-start gap-2">
                            <Info className="w-4 h-4 mt-0.5 shrink-0" />
                            <span>네이버 한자사전 등에서 본인 이름 한자의 '총 획수'를 찾아 입력해주세요. (원획법 기준)</span>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="block text-xs font-medium mb-1 text-center">성 (첫 글자)</label>
                                <input
                                    type="number"
                                    value={hanjaStrokes[0] || ''}
                                    onChange={(e) => {
                                        const newStrokes = [...hanjaStrokes];
                                        newStrokes[0] = parseInt(e.target.value) || 0;
                                        setHanjaStrokes(newStrokes);
                                    }}
                                    className="w-full p-2 text-center border border-border rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium mb-1 text-center">상명자 (가운데)</label>
                                <input
                                    type="number"
                                    value={hanjaStrokes[1] || ''}
                                    onChange={(e) => {
                                        const newStrokes = [...hanjaStrokes];
                                        newStrokes[1] = parseInt(e.target.value) || 0;
                                        setHanjaStrokes(newStrokes);
                                    }}
                                    className="w-full p-2 text-center border border-border rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium mb-1 text-center">하명자 (끝)</label>
                                <input
                                    type="number"
                                    value={hanjaStrokes[2] || ''}
                                    onChange={(e) => {
                                        const newStrokes = [...hanjaStrokes];
                                        newStrokes[2] = parseInt(e.target.value) || 0;
                                        setHanjaStrokes(newStrokes);
                                    }}
                                    className="w-full p-2 text-center border border-border rounded-lg"
                                />
                            </div>
                        </div>
                    </div>
                )}

                <button
                    onClick={analyze}
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-500/20"
                >
                    이름 풀이하기
                </button>
            </div>

            {/* 결과 리포트 */}
            {result && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {/* 1. 발음 오행 분석 */}
                    <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <span className="w-1 h-6 bg-indigo-500 rounded-full"></span>
                            발음 오행 분석
                        </h3>
                        <div className="flex justify-center items-center gap-4 mb-4">
                            {name.split('').map((char, idx) => (
                                <React.Fragment key={idx}>
                                    <div className="text-center">
                                        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center text-2xl font-bold mb-2">
                                            {char}
                                        </div>
                                        <span className="text-sm font-medium text-muted-foreground">
                                            {elementNames[result.elements[idx]]}
                                        </span>
                                    </div>
                                    {idx < name.length - 1 && (
                                        <div className="h-0.5 w-8 bg-border"></div>
                                    )}
                                </React.Fragment>
                            ))}
                        </div>
                        <p className="text-center text-sm text-muted-foreground">
                            이름의 소리가 가진 오행의 흐름을 보여줍니다. <br />
                            서로 상생(도와주는 관계)하는 흐름이 가장 좋습니다.
                        </p>
                    </div>

                    {/* 2. 81수리 분석 (정밀 모드일 때만) */}
                    {result.isHanja && (
                        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                                <span className="w-1 h-6 bg-purple-500 rounded-full"></span>
                                81수리 정밀 분석
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <SuriCard label="초년운 (원격)" data={result.suri.won} />
                                <SuriCard label="청년운 (형격)" data={result.suri.hyung} isMain />
                                <SuriCard label="장년운 (이격)" data={result.suri.lee} />
                                <SuriCard label="말년운 (정격)" data={result.suri.jung} />
                            </div>
                        </div>
                    )}

                    {!result.isHanja && (
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl text-center">
                            <Info className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                            <h4 className="font-bold text-blue-700 dark:text-blue-300 mb-1">더 정확한 풀이를 원하시나요?</h4>
                            <p className="text-sm text-blue-600 dark:text-blue-200">
                                '정밀' 모드를 선택하고 한자 획수를 입력하면<br />
                                인생의 시기별 운세(초년, 청년, 장년, 말년)를 확인할 수 있습니다.
                            </p>
                        </div>
                    )}
                </div>
            )}

            <div className="mt-8">
                <ShareButtons
                    title="무료 성명학 이름 풀이"
                    description="내 이름에 담긴 운명은? 무료로 확인해보세요!"
                />
            </div>
        </div>
    );
};

const SuriCard = ({ label, data, isMain }) => (
    <div className={`p-5 rounded-xl border ${isMain ? 'bg-indigo-50 border-indigo-200 dark:bg-indigo-900/20 dark:border-indigo-800' : 'bg-background border-border'}`}>
        <div className="flex justify-between items-start mb-2">
            <span className={`text-sm font-medium ${isMain ? 'text-indigo-600 dark:text-indigo-400' : 'text-muted-foreground'}`}>
                {label}
            </span>
            <span className={`text-xs font-bold px-2 py-1 rounded-full ${data.type === 'gil' ? 'bg-green-100 text-green-700' :
                    data.type === 'hyung' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                }`}>
                {data.type === 'gil' ? '길(吉)' : data.type === 'hyung' ? '흉(凶)' : '평(平)'}
            </span>
        </div>
        <div className="flex items-baseline gap-2 mb-2">
            <span className="text-2xl font-bold">{data.score}수</span>
            <span className="text-lg font-medium text-foreground/80">{data.title}</span>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
            {data.desc}
        </p>
    </div>
);

export default NameAnalysis;
