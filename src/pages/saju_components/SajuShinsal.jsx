import React from 'react';
import { Sparkles } from 'lucide-react';
import { shinsalData } from '../../data/SajuData.js';

const SajuShinsal = ({ result }) => {
    if (!result) return null;

    return (
        <div className="space-y-6">
            <div className="bg-card border border-border rounded-xl p-6 space-y-4">
                <h3 className="font-bold text-lg flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-500" />
                    나의 주요 신살(神殺)
                </h3>

                {result.shinsals.length > 0 ? (
                    <div className="space-y-3">
                        {result.shinsals.map((shinsal, idx) => (
                            <div key={idx} className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-100 dark:border-purple-900/50">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-bold text-lg text-purple-700 dark:text-purple-300">
                                        {shinsalData[shinsal].name}
                                    </span>
                                    <div className="flex gap-1">
                                        {shinsalData[shinsal].keywords.map((kw, kIdx) => (
                                            <span key={kIdx} className="text-xs px-2 py-1 bg-white dark:bg-black/20 rounded-full text-muted-foreground">
                                                #{kw}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <p className="text-sm text-muted-foreground leading-relaxed mb-2">
                                    {shinsalData[shinsal].desc}
                                </p>
                                <div className="bg-white dark:bg-black/10 p-3 rounded border-l-4 border-purple-500">
                                    <p className="text-xs text-muted-foreground">
                                        💡 <strong>조언:</strong> {shinsalData[shinsal].advice}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 text-muted-foreground">
                        <Sparkles className="w-12 h-12 mx-auto mb-3 opacity-30" />
                        <p className="text-sm">
                            주요 신살(도화, 역마, 화개)이 발견되지 않았습니다.
                        </p>
                        <p className="text-xs mt-1">
                            이는 평범하고 무난한 삶을 의미할 수도 있습니다.
                        </p>
                    </div>
                )}
            </div>

            {/* 신살 설명 (모든 신살 종류 안내) */}
            <div className="bg-muted/30 rounded-xl p-6 space-y-4">
                <h4 className="font-bold text-md">신살(神殺)이란?</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                    신살은 사주팔자에서 특정한 조합으로 나타나는 특별한 기운을 의미합니다.
                    각 신살은 그 사람의 성향, 재능, 운명적 특징을 나타내며,
                    긍정적인 면과 주의해야 할 면을 함께 가지고 있습니다.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                    {Object.entries(shinsalData).map(([key, data]) => (
                        <div key={key} className="bg-background p-3 rounded border border-border">
                            <div className="font-bold text-purple-600 dark:text-purple-400 mb-1">{data.name}</div>
                            <div className="text-muted-foreground">{data.keywords.join(', ')}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SajuShinsal;
