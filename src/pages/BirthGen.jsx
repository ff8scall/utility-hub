import React, { useState } from 'react';
import SEO from '../components/SEO';
import { Gift, Calendar, Flower, Gem, Sparkles } from 'lucide-react';
import { birthstones, birthFlowers } from '../data/BirthData';
import ShareButtons from '../components/ShareButtons';

const BirthGen = () => {
    const [birthDate, setBirthDate] = useState(new Date().toISOString().split('T')[0]);

    const getBirthData = () => {
        if (!birthDate) return null;
        const date = new Date(birthDate);
        const month = date.getMonth() + 1;
        return {
            month,
            stone: birthstones[month],
            flower: birthFlowers[month]
        };
    };

    const data = getBirthData();

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <SEO
                title="내 탄생석과 탄생화 찾기 - 무료 조회 | Utility Hub"
                description="생일만 입력하면 나의 탄생석과 탄생화, 그리고 그 의미를 무료로 확인할 수 있습니다. 나를 상징하는 보석과 꽃은 무엇일까요?"
                keywords="탄생석, 탄생화, 탄생석조회, 탄생화조회, 생일보석, 생일꽃, 무료운세"
            />

            <div className="text-center space-y-4 py-6">
                <div className="inline-flex items-center justify-center p-3 bg-pink-100 dark:bg-pink-900/30 rounded-full mb-2">
                    <Gift className="w-8 h-8 text-pink-600 dark:text-pink-400" />
                </div>
                <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-rose-500">
                    탄생석 & 탄생화
                </h1>
                <p className="text-muted-foreground">
                    당신이 태어난 날을 상징하는 보석과 꽃을 찾아보세요.
                </p>
            </div>

            {/* 날짜 선택 */}
            <div className="max-w-md mx-auto bg-card border border-border rounded-xl p-6 shadow-sm">
                <label className="block text-sm font-medium mb-2 flex items-center gap-2 justify-center">
                    <Calendar className="w-4 h-4" />
                    생일 선택
                </label>
                <input
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="w-full p-3 border border-border rounded-xl bg-background text-center text-lg font-medium focus:ring-2 focus:ring-pink-500 outline-none"
                />
            </div>

            {/* 결과 카드 */}
            {data && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {/* 탄생석 */}
                    <div className={`rounded-2xl p-8 border-2 ${data.stone.bg} border-opacity-50 flex flex-col items-center text-center space-y-4 shadow-sm`}>
                        <div className="p-4 bg-white dark:bg-gray-800 rounded-full shadow-inner">
                            <Gem className={`w-12 h-12 ${data.stone.color}`} />
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">
                                {data.month}월의 탄생석
                            </h3>
                            <h2 className={`text-3xl font-bold ${data.stone.color}`}>
                                {data.stone.name}
                            </h2>
                        </div>
                        <div className="px-4 py-2 bg-white/50 dark:bg-black/20 rounded-lg">
                            <p className="font-medium text-gray-700 dark:text-gray-200">
                                "{data.stone.meaning}"
                            </p>
                        </div>
                    </div>

                    {/* 탄생화 */}
                    <div className="rounded-2xl p-8 border-2 bg-green-50 border-green-100 dark:bg-green-900/10 dark:border-green-900/30 flex flex-col items-center text-center space-y-4 shadow-sm">
                        <div className="p-4 bg-white dark:bg-gray-800 rounded-full shadow-inner">
                            <Flower className="w-12 h-12 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">
                                {data.month}월의 탄생화
                            </h3>
                            <h2 className="text-3xl font-bold text-green-700 dark:text-green-400">
                                {data.flower.name}
                            </h2>
                        </div>
                        <div className="px-4 py-2 bg-white/50 dark:bg-black/20 rounded-lg">
                            <p className="font-medium text-gray-700 dark:text-gray-200">
                                "{data.flower.meaning}"
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <div className="mt-8">
                <ShareButtons
                    title="나의 탄생석과 탄생화 찾기"
                    description="내 생일을 상징하는 보석과 꽃은 무엇일까요? 무료로 확인해보세요!"
                />
            </div>
        </div>
    );
};

export default BirthGen;
