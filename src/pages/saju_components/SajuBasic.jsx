import React from 'react';
import { User, TrendingUp } from 'lucide-react';
import { analysisData } from '../../data/SajuData.js';

const SajuBasic = ({ result }) => {
    if (!result) return null;

    return (
        <div className="space-y-6">
            {/* 기본 정보 */}
            <div className="bg-muted/30 rounded-xl p-4 text-sm text-center space-y-1">
                <p><span className="font-bold">양력:</span> {result.solarDate}</p>
                <p><span className="font-bold">음력:</span> {result.lunarDate}</p>
                <p><span className="font-bold">띠:</span> {result.zodiac}</p>
            </div>

            {/* 사주팔자 표 */}
            <div className="grid grid-cols-4 gap-2 md:gap-4 text-center">
                {result.pillars.map((pillar, idx) => (
                    <div key={idx} className="bg-card border border-border rounded-lg p-4">
                        <div className="text-xs text-muted-foreground mb-2">{pillar.label}</div>
                        <div className="space-y-1">
                            <div className="text-2xl font-bold text-primary">{pillar.ganHangul}</div>
                            <div className="text-sm text-muted-foreground">{pillar.gan}</div>
                            <div className="h-px bg-border my-2" />
                            <div className="text-2xl font-bold text-secondary">{pillar.zhiHangul}</div>
                            <div className="text-sm text-muted-foreground">{pillar.zhi}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* 오행 분석 */}
            <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="font-bold text-lg flex items-center gap-2 mb-4">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    오행(五行) 분석
                </h3>
                <div className="space-y-3">
                    {Object.entries(result.wuxingStats).map(([element, count]) => (
                        <div key={element} className="space-y-1">
                            <div className="flex justify-between text-sm">
                                <span className="font-medium">{element}</span>
                                <span className="text-muted-foreground">{count}개</span>
                            </div>
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-primary to-primary/70 transition-all"
                                    style={{ width: `${(count / 8) * 100}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 본원(일간) 상세 분석 */}
            <div className="bg-gradient-to-br from-card to-muted/20 border border-border rounded-xl p-6 space-y-4">
                <h3 className="font-bold text-xl flex items-center gap-2">
                    <User className="w-6 h-6 text-primary" />
                    본원(本源) 분석 - {result.dayMaster} ({result.dayMasterWuXing})
                </h3>

                {analysisData[result.dayMasterWuXing] && (
                    <>
                        {/* 키워드 */}
                        <div className="flex flex-wrap gap-2">
                            {analysisData[result.dayMasterWuXing].keywords.map((kw, idx) => (
                                <span
                                    key={idx}
                                    className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium"
                                >
                                    #{kw}
                                </span>
                            ))}
                        </div>

                        {/* 기본 성향 */}
                        <div className="bg-background/50 p-4 rounded-lg">
                            <h4 className="font-bold mb-2 text-primary">기본 성향</h4>
                            <p className="text-sm leading-relaxed text-muted-foreground">
                                {analysisData[result.dayMasterWuXing].basic}
                            </p>
                        </div>

                        {/* 장점 */}
                        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-100 dark:border-green-900/50">
                            <h4 className="font-bold mb-2 text-green-700 dark:text-green-300">✅ 장점</h4>
                            <ul className="space-y-1 text-sm">
                                {analysisData[result.dayMasterWuXing].pros.map((pro, idx) => (
                                    <li key={idx} className="text-muted-foreground">• {pro}</li>
                                ))}
                            </ul>
                        </div>

                        {/* 단점 */}
                        <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-100 dark:border-orange-900/50">
                            <h4 className="font-bold mb-2 text-orange-700 dark:text-orange-300">⚠️ 주의할 점</h4>
                            <ul className="space-y-1 text-sm">
                                {analysisData[result.dayMasterWuXing].cons.map((con, idx) => (
                                    <li key={idx} className="text-muted-foreground">• {con}</li>
                                ))}
                            </ul>
                        </div>

                        {/* 추천 직업 */}
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-900/50">
                            <h4 className="font-bold mb-2 text-blue-700 dark:text-blue-300">💼 추천 직업</h4>
                            <p className="text-sm text-muted-foreground">
                                {analysisData[result.dayMasterWuXing].career}
                            </p>
                        </div>

                        {/* 건강 */}
                        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-100 dark:border-red-900/50">
                            <h4 className="font-bold mb-2 text-red-700 dark:text-red-300">🏥 건강</h4>
                            <p className="text-sm text-muted-foreground">
                                {analysisData[result.dayMasterWuXing].health}
                            </p>
                        </div>

                        {/* 조언 */}
                        <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-100 dark:border-purple-900/50">
                            <h4 className="font-bold mb-2 text-purple-700 dark:text-purple-300">💡 조언</h4>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                {analysisData[result.dayMasterWuXing].advice}
                            </p>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default SajuBasic;
