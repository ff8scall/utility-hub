import React from 'react';
import { Calendar, Sun, Moon, TrendingUp } from 'lucide-react';
import { sipsinAnalysis } from '../../data/SajuData.js';

const SajuFlow = ({ result, generateDaewoonStory }) => {
    if (!result) return null;

    return (
        <div className="space-y-6">
            {/* 오늘의 운세 */}
            <div className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-xl p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Sun className="w-24 h-24" />
                </div>
                <h3 className="font-bold text-lg flex items-center gap-2 mb-4 text-primary">
                    <Calendar className="w-5 h-5" />
                    오늘의 운세 ({result.dailyFortune.date})
                </h3>
                <div className="flex flex-col md:flex-row gap-6 items-start relative z-10">
                    <div className="flex items-center gap-4 bg-background/60 p-4 rounded-lg backdrop-blur-sm">
                        <div className="text-center">
                            <span className="text-xs text-muted-foreground block mb-1">일진(日辰)</span>
                            <span className="text-2xl font-bold">{result.dailyFortune.ganHangul}{result.dailyFortune.zhiHangul}</span>
                        </div>
                        <div className="h-8 w-px bg-border" />
                        <div>
                            <span className="text-sm font-bold text-primary block">{sipsinAnalysis[result.dailyFortune.sipsin]?.title}</span>
                            <span className="text-xs text-muted-foreground">의 기운이 들어옵니다.</span>
                        </div>
                    </div>
                    <div className="flex-1">
                        <p className="text-sm font-medium mb-2">
                            {sipsinAnalysis[result.dailyFortune.sipsin]?.desc}
                        </p>
                        <p className="text-sm text-muted-foreground bg-background/50 p-2 rounded">
                            💡 <strong>Tip:</strong> {sipsinAnalysis[result.dailyFortune.sipsin]?.advice}
                        </p>
                    </div>
                </div>
            </div>

            {/* 세운(년운) */}
            <div className="bg-card border border-border rounded-xl p-6 space-y-4">
                <h3 className="font-bold text-lg flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    {result.seun.year}년 올해의 운세
                </h3>
                <div className="flex items-center gap-4 bg-primary/5 p-4 rounded-lg">
                    <div className="text-center min-w-[60px]">
                        <span className="text-2xl font-bold">{result.seun.ganHangul}{result.seun.zhiHangul}</span>
                        <span className="text-xs text-muted-foreground block">({result.seun.year}년)</span>
                    </div>
                    <div className="h-8 w-px bg-border" />
                    <div>
                        <span className="text-sm font-bold text-primary block mb-1">
                            {sipsinAnalysis[result.seun.sipsin]?.title}
                        </span>
                        <p className="text-xs text-muted-foreground">
                            {sipsinAnalysis[result.seun.sipsin]?.desc}
                        </p>
                    </div>
                </div>
            </div>

            {/* 대운(大運) 3단계 분석 */}
            <div className="space-y-6">
                <h3 className="font-bold text-xl flex items-center gap-2">
                    <TrendingUp className="w-6 h-6 text-primary" />
                    대운(大運) - 인생의 흐름
                </h3>

                {result.daewoon && ['초년', '중년', '말년'].map((stage, idx) => {
                    const stageData = result.daewoon[stage];
                    if (!stageData) return null;

                    const { story, keywords } = generateDaewoonStory(stage, stageData.sipsins);

                    return (
                        <div key={stage} className="bg-gradient-to-br from-card to-muted/20 border-2 border-primary/20 rounded-xl p-6 space-y-4">
                            <div className="flex items-center justify-between">
                                <h4 className="font-bold text-lg text-primary">{stage}운 ({stageData.ageRange})</h4>
                                <div className="flex gap-2">
                                    {keywords.map((kw, kidx) => (
                                        <span key={kidx} className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                                            #{kw}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-background/50 p-4 rounded-lg">
                                <p className="text-sm leading-relaxed whitespace-pre-line text-muted-foreground">
                                    {story}
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {stageData.periods.map((period, pidx) => (
                                    <div key={pidx} className="text-xs bg-muted/50 px-3 py-1 rounded-full">
                                        {period.age}세: {period.gan}{period.zhi} ({period.sipsin})
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default SajuFlow;
