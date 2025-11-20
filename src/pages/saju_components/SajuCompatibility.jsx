import React, { useState } from 'react';
import { Solar, Lunar } from 'lunar-javascript';
import { Heart, Users, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';

const SajuCompatibility = ({ userResult, getWuXing, getHangul }) => {
    const [partnerDate, setPartnerDate] = useState('');
    const [partnerTime, setPartnerTime] = useState('');
    const [partnerCalendarType, setPartnerCalendarType] = useState('solar');
    const [partnerGender, setPartnerGender] = useState('female');
    const [compatibility, setCompatibility] = useState(null);

    const calculateCompatibility = (e) => {
        e.preventDefault();
        if (!partnerDate || !userResult) return;

        try {
            const [year, month, day] = partnerDate.split('-').map(Number);
            const [hour, minute] = partnerTime ? partnerTime.split(':').map(Number) : [12, 0];

            let targetLunar;
            if (partnerCalendarType === 'lunar') {
                targetLunar = Lunar.fromYmdHms(year, month, day, hour, minute, 0);
            } else {
                const targetSolar = Solar.fromYmdHms(year, month, day, hour, minute, 0);
                targetLunar = targetSolar.getLunar();
            }

            const eightChar = targetLunar.getEightChar();
            const partnerDayGan = eightChar.getDayGan();
            const partnerDayZhi = eightChar.getDayZhi();
            const partnerDayMasterWuXing = getWuXing(partnerDayGan);

            // 일간 간합(天干合) 체크
            const ganHapPairs = {
                '甲': '己', '己': '甲',
                '乙': '庚', '庚': '乙',
                '丙': '辛', '辛': '丙',
                '丁': '壬', '壬': '丁',
                '戊': '癸', '癸': '戊'
            };

            const userDayGan = userResult.dayMaster;
            const hasGanHap = ganHapPairs[userDayGan] === partnerDayGan;

            // 오행 균형 분석
            const userWuxing = userResult.wuxingStats;
            const partnerPillars = {
                year: { gan: eightChar.getYearGan(), zhi: eightChar.getYearZhi() },
                month: { gan: eightChar.getMonthGan(), zhi: eightChar.getMonthZhi() },
                day: { gan: partnerDayGan, zhi: partnerDayZhi },
                hour: { gan: eightChar.getTimeGan(), zhi: eightChar.getTimeZhi() }
            };

            const partnerWuxingStats = { '목': 0, '화': 0, '토': 0, '금': 0, '수': 0 };
            Object.values(partnerPillars).forEach(p => {
                const ganWx = getWuXing(p.gan);
                const zhiWx = getWuXing(p.zhi);
                if (ganWx) partnerWuxingStats[ganWx]++;
                if (zhiWx) partnerWuxingStats[zhiWx]++;
            });

            // 오행 상생상극 관계
            const wuxingRelation = (wx1, wx2) => {
                const cycle = ['목', '화', '토', '금', '수'];
                const idx1 = cycle.indexOf(wx1);
                const idx2 = cycle.indexOf(wx2);
                if (idx1 === -1 || idx2 === -1) return 'neutral';

                if ((idx2 - idx1 + 5) % 5 === 1) return 'generate'; // 상생
                if ((idx2 - idx1 + 5) % 5 === 2) return 'control'; // 상극
                if (idx1 === idx2) return 'same';
                return 'neutral';
            };

            const dayMasterRelation = wuxingRelation(userResult.dayMasterWuXing, partnerDayMasterWuXing);

            // 오행 보완 점수 (상대방이 내 부족한 오행을 채워주는가?)
            let complementScore = 0;
            const wuxingElements = ['목', '화', '토', '금', '수'];

            wuxingElements.forEach(element => {
                const userCount = userWuxing[element] || 0;
                const partnerCount = partnerWuxingStats[element] || 0;

                // 내가 부족한 오행을 상대가 많이 가지고 있으면 보완점수 증가
                if (userCount < 2 && partnerCount >= 2) {
                    complementScore += 15;
                } else if (userCount === 0 && partnerCount > 0) {
                    complementScore += 20;
                }
            });

            // 종합 점수 계산
            let totalScore = 50; // 기본 점수

            if (hasGanHap) totalScore += 25; // 간합이 있으면 큰 가산점

            if (dayMasterRelation === 'generate') totalScore += 15; // 상생 관계
            else if (dayMasterRelation === 'same') totalScore += 10; // 같은 오행
            else if (dayMasterRelation === 'control') totalScore -= 10; // 상극 관계

            totalScore += Math.min(complementScore, 30); // 보완 점수 (최대 30점)

            // 점수 범위 제한
            totalScore = Math.max(0, Math.min(100, totalScore));

            setCompatibility({
                partnerDayGan,
                partnerDayZhi,
                partnerDayGanHangul: getHangul(partnerDayGan),
                partnerDayZhiHangul: getHangul(partnerDayZhi),
                partnerDayMasterWuXing,
                hasGanHap,
                dayMasterRelation,
                complementScore,
                totalScore,
                userWuxing,
                partnerWuxing: partnerWuxingStats
            });

        } catch (error) {
            console.error(error);
            alert('궁합 계산 중 오류가 발생했습니다.');
        }
    };

    const getScoreColor = (score) => {
        if (score >= 80) return 'text-green-600 dark:text-green-400';
        if (score >= 60) return 'text-blue-600 dark:text-blue-400';
        if (score >= 40) return 'text-yellow-600 dark:text-yellow-400';
        return 'text-red-600 dark:text-red-400';
    };

    const getScoreLabel = (score) => {
        if (score >= 80) return '매우 좋음';
        if (score >= 60) return '좋음';
        if (score >= 40) return '보통';
        return '노력 필요';
    };

    return (
        <div className="space-y-6">
            {/* 설명 */}
            <div className="bg-pink-50 dark:bg-pink-900/20 border border-pink-200 dark:border-pink-900/50 rounded-xl p-4">
                <div className="flex gap-3">
                    <Heart className="w-5 h-5 text-pink-600 dark:text-pink-400 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-pink-900 dark:text-pink-100 space-y-1">
                        <p className="font-bold">궁합 분석이란?</p>
                        <p>두 사람의 사주를 비교하여 일간의 조화, 오행의 균형 등을 종합적으로 분석합니다. 점수가 낮다고 해서 나쁜 것은 아니며, 서로를 이해하고 배려하는 것이 가장 중요합니다.</p>
                    </div>
                </div>
            </div>

            {/* 파트너 정보 입력 */}
            <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    상대방 정보 입력
                </h3>
                <form onSubmit={calculateCompatibility} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">생년월일</label>
                            <input
                                type="date"
                                value={partnerDate}
                                onChange={(e) => setPartnerDate(e.target.value)}
                                required
                                className="w-full px-4 py-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">태어난 시간 (선택)</label>
                            <input
                                type="time"
                                value={partnerTime}
                                onChange={(e) => setPartnerTime(e.target.value)}
                                className="w-full px-4 py-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                            />
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium block">양력/음력</label>
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        value="solar"
                                        checked={partnerCalendarType === 'solar'}
                                        onChange={(e) => setPartnerCalendarType(e.target.value)}
                                        className="w-4 h-4 text-primary"
                                    />
                                    <span>양력</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        value="lunar"
                                        checked={partnerCalendarType === 'lunar'}
                                        onChange={(e) => setPartnerCalendarType(e.target.value)}
                                        className="w-4 h-4 text-primary"
                                    />
                                    <span>음력</span>
                                </label>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium block">성별</label>
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        value="male"
                                        checked={partnerGender === 'male'}
                                        onChange={(e) => setPartnerGender(e.target.value)}
                                        className="w-4 h-4 text-primary"
                                    />
                                    <span>남성</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        value="female"
                                        checked={partnerGender === 'female'}
                                        onChange={(e) => setPartnerGender(e.target.value)}
                                        className="w-4 h-4 text-primary"
                                    />
                                    <span>여성</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 bg-pink-600 hover:bg-pink-700 text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
                    >
                        <Heart className="w-5 h-5" />
                        궁합 분석하기
                    </button>
                </form>
            </div>

            {/* 궁합 결과 */}
            {compatibility && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    {/* 종합 점수 */}
                    <div className="bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 border-2 border-pink-200 dark:border-pink-900/50 rounded-xl p-8 text-center">
                        <h3 className="text-lg font-bold mb-4">궁합 점수</h3>
                        <div className={`text-6xl font-bold mb-2 ${getScoreColor(compatibility.totalScore)}`}>
                            {compatibility.totalScore}점
                        </div>
                        <div className="text-xl font-medium text-muted-foreground">
                            {getScoreLabel(compatibility.totalScore)}
                        </div>
                    </div>

                    {/* 일간 조화 */}
                    <div className="bg-card border border-border rounded-xl p-6 space-y-4">
                        <h3 className="font-bold text-lg flex items-center gap-2">
                            <Users className="w-5 h-5 text-primary" />
                            일간(日干) 조화
                        </h3>
                        <div className="grid grid-cols-2 gap-4 text-center">
                            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                                <div className="text-xs text-muted-foreground mb-1">나의 일간</div>
                                <div className="text-2xl font-bold">{userResult.pillars[1].ganHangul}</div>
                                <div className="text-sm text-muted-foreground">({userResult.dayMasterWuXing})</div>
                            </div>
                            <div className="bg-pink-50 dark:bg-pink-900/20 p-4 rounded-lg">
                                <div className="text-xs text-muted-foreground mb-1">상대방 일간</div>
                                <div className="text-2xl font-bold">{compatibility.partnerDayGanHangul}</div>
                                <div className="text-sm text-muted-foreground">({compatibility.partnerDayMasterWuXing})</div>
                            </div>
                        </div>

                        {compatibility.hasGanHap && (
                            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-900/50">
                                <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
                                    <CheckCircle className="w-5 h-5" />
                                    <span className="font-bold">천간합(天干合) 성립!</span>
                                </div>
                                <p className="text-sm text-muted-foreground mt-2">
                                    두 사람의 일간이 서로 합을 이루어 강한 인연과 조화를 의미합니다. 서로를 보완하며 함께 성장할 수 있는 관계입니다.
                                </p>
                            </div>
                        )}

                        <div className="bg-muted/30 p-4 rounded-lg">
                            <div className="font-bold mb-2">오행 관계</div>
                            <p className="text-sm text-muted-foreground">
                                {compatibility.dayMasterRelation === 'generate' && '상생(相生) 관계: 서로를 도와주고 발전시키는 관계입니다.'}
                                {compatibility.dayMasterRelation === 'control' && '상극(相剋) 관계: 서로 견제하지만 균형을 맞출 수 있습니다.'}
                                {compatibility.dayMasterRelation === 'same' && '같은 오행: 서로를 잘 이해하고 공감할 수 있습니다.'}
                                {compatibility.dayMasterRelation === 'neutral' && '중립 관계: 안정적이고 평화로운 관계를 유지할 수 있습니다.'}
                            </p>
                        </div>
                    </div>

                    {/* 오행 보완 분석 */}
                    <div className="bg-card border border-border rounded-xl p-6 space-y-4">
                        <h3 className="font-bold text-lg flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-primary" />
                            오행 균형 분석
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            서로의 부족한 오행을 채워주면 더욱 조화로운 관계가 됩니다.
                        </p>
                        <div className="grid grid-cols-5 gap-2 text-center text-xs">
                            {['목', '화', '토', '금', '수'].map(element => (
                                <div key={element} className="space-y-2">
                                    <div className="font-bold">{element}</div>
                                    <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded">
                                        나: {compatibility.userWuxing[element]}
                                    </div>
                                    <div className="bg-pink-100 dark:bg-pink-900/30 p-2 rounded">
                                        상대: {compatibility.partnerWuxing[element]}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 조언 */}
                    <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-900/50 rounded-xl p-6">
                        <div className="flex gap-3">
                            <AlertCircle className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
                            <div className="text-sm text-purple-900 dark:text-purple-100 space-y-2">
                                <p className="font-bold">💜 궁합 조언</p>
                                <p>
                                    궁합은 참고 자료일 뿐, 두 사람의 노력과 배려가 가장 중요합니다.
                                    서로의 다른 점을 이해하고 존중하며, 부족한 부분을 채워주려는 마음가짐이
                                    좋은 관계를 만들어갑니다. 사주는 타고난 성향을 보여줄 뿐,
                                    운명은 스스로 만들어가는 것입니다.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SajuCompatibility;
