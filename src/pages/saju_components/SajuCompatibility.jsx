import React, { useState } from 'react';
import { Solar, Lunar } from 'lunar-javascript';
import { Heart, Users, TrendingUp, AlertCircle, CheckCircle, Sparkles } from 'lucide-react';


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

                if ((idx2 - idx1 + 5) % 5 === 1) return 'generate'; // 상생 (내가 생해줌)
                if ((idx1 - idx2 + 5) % 5 === 1) return 'generated'; // 상생 (내가 생받음)
                if ((idx2 - idx1 + 5) % 5 === 2) return 'control'; // 상극 (내가 극함)
                if ((idx1 - idx2 + 5) % 5 === 2) return 'controlled'; // 상극 (내가 극당함)
                if (idx1 === idx2) return 'same';
                return 'neutral';
            };

            const dayMasterRelation = wuxingRelation(userResult.dayMasterWuXing, partnerDayMasterWuXing);

            // 오행 보완 점수 (상대방이 내 부족한 오행을 채워주는가?)
            let complementScore = 0;
            const wuxingElements = ['목', '화', '토', '금', '수'];
            const missingElements = []; // 내가 부족한 오행
            const filledElements = []; // 상대가 채워준 오행

            wuxingElements.forEach(element => {
                const userCount = userWuxing[element] || 0;
                const partnerCount = partnerWuxingStats[element] || 0;

                if (userCount < 2) {
                    missingElements.push(element);
                    // 내가 부족한 오행을 상대가 많이 가지고 있으면 보완점수 증가
                    if (partnerCount >= 2) {
                        complementScore += 15;
                        filledElements.push(element);
                    } else if (userCount === 0 && partnerCount > 0) {
                        complementScore += 20;
                        filledElements.push(element);
                    }
                }
            });

            // 종합 점수 계산
            let totalScore = 50; // 기본 점수

            if (hasGanHap) totalScore += 25; // 간합이 있으면 큰 가산점

            if (dayMasterRelation === 'generate' || dayMasterRelation === 'generated') totalScore += 15; // 상생 관계
            else if (dayMasterRelation === 'same') totalScore += 10; // 같은 오행
            else if (dayMasterRelation === 'control' || dayMasterRelation === 'controlled') totalScore -= 10; // 상극 관계

            totalScore += Math.min(complementScore, 30); // 보완 점수 (최대 30점)

            // 점수 범위 제한
            totalScore = Math.max(0, Math.min(100, totalScore));

            // 상세 설명 생성
            const explanation = generateDetailedExplanation({
                totalScore,
                userDayGan: userResult.dayMaster,
                partnerDayGan,
                userDayMasterWuXing: userResult.dayMasterWuXing,
                partnerDayMasterWuXing,
                dayMasterRelation,
                hasGanHap,
                missingElements,
                filledElements,
                userWuxing,
                partnerWuxing: partnerWuxingStats
            });

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
                partnerWuxing: partnerWuxingStats,
                explanation
            });

        } catch (error) {
            console.error(error);
            alert('궁합 계산 중 오류가 발생했습니다.');
        }
    };

    const generateDetailedExplanation = (data) => {
        const {
            totalScore,
            userDayGan, partnerDayGan,
            userDayMasterWuXing, partnerDayMasterWuXing,
            dayMasterRelation,
            hasGanHap,
            missingElements,
            filledElements
        } = data;

        let sections = [];

        // 1. 총평
        let summary = "";
        if (totalScore >= 90) summary = "천생연분입니다! 서로가 서로에게 꼭 필요한 존재이며, 깊은 이해와 사랑을 나눌 수 있는 최고의 궁합입니다.";
        else if (totalScore >= 80) summary = "매우 좋은 궁합입니다. 서로의 장점을 살려주고 단점을 보완해주는 훌륭한 파트너가 될 수 있습니다.";
        else if (totalScore >= 70) summary = "좋은 관계입니다. 약간의 차이는 있지만, 서로 노력하면 충분히 행복한 관계를 만들어갈 수 있습니다.";
        else if (totalScore >= 50) summary = "보통의 궁합입니다. 서로 다른 점이 많을 수 있으니, 이해와 배려가 관계 유지의 핵심입니다.";
        else summary = "노력이 필요한 관계입니다. 성향 차이가 클 수 있으므로, 서로의 다름을 인정하고 맞춰가려는 의지가 중요합니다.";
        sections.push({ title: "총평", content: summary });

        // 2. 일간(성격) 조화 분석
        let dayMasterContent = `당신은 **${userDayMasterWuXing}**의 기운을 가진 **${userDayGan}** 일간이고, 상대방은 **${partnerDayMasterWuXing}**의 기운을 가진 **${partnerDayGan}** 일간입니다.\n\n`;

        if (hasGanHap) {
            dayMasterContent += `✨ **천간합(天干合)**이 성립합니다! 두 사람의 영혼이 강하게 끌리는 형국입니다. 처음 만났을 때부터 강렬한 이끌림을 느꼈을 수 있으며, 정신적인 유대감이 매우 깊습니다. 서로가 없으면 허전함을 느낄 정도로 끈끈한 인연입니다.`;
        } else {
            switch (dayMasterRelation) {
                case 'generate': // 내가 생해줌 (목 -> 화)
                    dayMasterContent += `당신의 기운이 상대방을 도와주는 **상생(相生)** 관계입니다. 당신이 상대방에게 많은 사랑과 배려를 베풀게 되며, 상대방은 당신 덕분에 성장하고 편안함을 느낍니다. 주는 기쁨을 아는 당신과 받는 고마움을 아는 상대방의 조화가 아름답습니다.`;
                    break;
                case 'generated': // 내가 생받음 (수 -> 목)
                    dayMasterContent += `상대방의 기운이 당신을 도와주는 **상생(相生)** 관계입니다. 상대방으로부터 많은 사랑과 지지를 받게 됩니다. 당신이 힘들 때 상대방이 든든한 버팀목이 되어줄 것입니다. 상대방의 헌신에 감사함을 표현한다면 관계는 더욱 깊어질 것입니다.`;
                    break;
                case 'same': // 같은 오행
                    dayMasterContent += `두 분은 같은 **${userDayMasterWuXing}**의 기운을 공유하는 **비견(比肩)** 관계입니다. 친구처럼 편안하고 서로를 누구보다 잘 이해할 수 있습니다. 공통의 관심사가 많고 대화가 잘 통하지만, 때로는 자존심 대결을 할 수도 있으니 서로 존중하는 태도가 필요합니다.`;
                    break;
                case 'control': // 내가 극함 (목 -> 토)
                    dayMasterContent += `당신이 상대방을 리드하거나 통제하려는 **상극(相剋)**의 성향이 있을 수 있습니다. 당신의 주도권이 강하게 작용할 수 있지만, 지나치면 상대방이 답답함을 느낄 수 있습니다. 상대방의 의견을 경청하고 부드럽게 대하는 지혜가 필요합니다.`;
                    break;
                case 'controlled': // 내가 극당함 (금 -> 목)
                    dayMasterContent += `상대방이 당신을 리드하거나 통제하는 **상극(相剋)**의 성향이 있을 수 있습니다. 상대방의 카리스마에 매력을 느낄 수도 있지만, 때로는 압박감을 느낄 수도 있습니다. 서로의 영역을 존중하고 적절한 거리를 유지하는 것이 도움이 됩니다.`;
                    break;
                default:
                    dayMasterContent += `두 분의 기운은 서로 직접적인 충돌이나 생조 없이 무난하게 어우러지는 관계입니다.`;
            }
        }
        sections.push({ title: "성격 및 기운의 조화", content: dayMasterContent });

        // 3. 오행 균형(상호 보완) 분석
        let balanceContent = "";
        if (filledElements.length > 0) {
            balanceContent = `당신의 사주에서 부족하거나 약한 기운인 **[${filledElements.join(', ')}]** 기운을 상대방이 풍부하게 가지고 있습니다. \n\n이는 상대방이 당신의 부족한 점을 채워줄 수 있음을 의미합니다. 당신이 결단력이 부족할 때 상대방이 결정을 내려주거나, 당신이 감정적일 때 상대방이 이성적으로 잡아주는 등 서로에게 긍정적인 영향을 줄 수 있는 **상호보완적인 관계**입니다.`;
        } else if (missingElements.length > 0) {
            balanceContent = `당신의 사주에서 부족한 **[${missingElements.join(', ')}]** 기운을 상대방도 충분히 가지고 있지 않을 수 있습니다. \n\n이 경우, 두 사람 모두 비슷한 약점을 가질 수 있으니 주의가 필요합니다. 예를 들어, 두 분 다 '화(火)' 기운이 부족하다면 열정과 추진력이 다소 부족할 수 있으므로, 의식적으로 활기찬 활동을 함께 하는 것이 좋습니다.`;
        } else {
            balanceContent = `두 분의 오행 분포는 대체로 무난합니다. 특별히 한쪽으로 치우치지 않아 안정적인 관계를 유지할 수 있습니다.`;
        }
        sections.push({ title: "오행의 균형과 보완", content: balanceContent });

        // 4. 조언
        let advice = "";
        if (totalScore >= 80) advice = "더할 나위 없이 좋은 궁합입니다. 지금처럼 서로를 아끼고 사랑한다면 평생 행복한 동반자가 될 것입니다.";
        else if (totalScore >= 60) advice = "서로의 차이를 인정하고 대화로 풀어간다면 충분히 좋은 관계가 될 수 있습니다. 상대방의 장점을 더 많이 봐주세요.";
        else advice = "서로 맞지 않는 부분이 있을 수 있습니다. 하지만 궁합이 전부는 아닙니다. 서로의 다름을 이해하고 배려하는 노력이 있다면 운명을 뛰어넘는 사랑을 할 수 있습니다.";
        sections.push({ title: "미래를 위한 조언", content: advice });

        return sections;
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
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    {/* 종합 점수 */}
                    <div className="bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 border-2 border-pink-200 dark:border-pink-900/50 rounded-xl p-8 text-center shadow-sm">
                        <h3 className="text-lg font-bold mb-4">궁합 점수</h3>
                        <div className={`text-6xl font-bold mb-2 ${getScoreColor(compatibility.totalScore)}`}>
                            {compatibility.totalScore}점
                        </div>
                        <div className="text-xl font-medium text-muted-foreground">
                            {getScoreLabel(compatibility.totalScore)}
                        </div>
                    </div>

                    {/* 상세 분석 리포트 */}
                    <div className="space-y-6">
                        <h3 className="text-xl font-bold flex items-center gap-2 px-2">
                            <Sparkles className="w-6 h-6 text-yellow-500" />
                            상세 궁합 리포트
                        </h3>

                        {compatibility.explanation && compatibility.explanation.map((section, idx) => (
                            <div key={idx} className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                                <h4 className="text-lg font-bold mb-3 text-primary flex items-center gap-2">
                                    <span className="w-1.5 h-6 bg-primary rounded-full"></span>
                                    {section.title}
                                </h4>
                                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                                    {section.content}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* 기존의 시각적 요소들 (일간 조화, 오행 균형) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* 일간 조화 시각화 */}
                        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
                            <h3 className="font-bold text-lg flex items-center gap-2">
                                <Users className="w-5 h-5 text-primary" />
                                일간(日干) 구성
                            </h3>
                            <div className="grid grid-cols-2 gap-4 text-center">
                                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                                    <div className="text-xs text-muted-foreground mb-1">나</div>
                                    <div className="text-2xl font-bold">{userResult.pillars[1].ganHangul}</div>
                                    <div className="text-sm text-muted-foreground">({userResult.dayMasterWuXing})</div>
                                </div>
                                <div className="bg-pink-50 dark:bg-pink-900/20 p-4 rounded-lg">
                                    <div className="text-xs text-muted-foreground mb-1">상대방</div>
                                    <div className="text-2xl font-bold">{compatibility.partnerDayGanHangul}</div>
                                    <div className="text-sm text-muted-foreground">({compatibility.partnerDayMasterWuXing})</div>
                                </div>
                            </div>
                            {compatibility.hasGanHap && (
                                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-200 dark:border-green-900/50 text-center">
                                    <div className="flex items-center justify-center gap-2 text-green-700 dark:text-green-300 font-bold">
                                        <CheckCircle className="w-4 h-4" />
                                        천간합(天干合) 성립
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* 오행 균형 시각화 */}
                        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
                            <h3 className="font-bold text-lg flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-primary" />
                                오행 분포 비교
                            </h3>
                            <div className="grid grid-cols-5 gap-2 text-center text-xs">
                                {['목', '화', '토', '금', '수'].map(element => (
                                    <div key={element} className="space-y-2">
                                        <div className="font-bold">{element}</div>
                                        <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded relative group">
                                            <span className="font-bold">{compatibility.userWuxing[element]}</span>
                                            <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border shadow-sm">나</span>
                                        </div>
                                        <div className="bg-pink-100 dark:bg-pink-900/30 p-2 rounded relative group">
                                            <span className="font-bold">{compatibility.partnerWuxing[element]}</span>
                                            <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border shadow-sm">상대</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};


export default SajuCompatibility;

