import React, { useState } from 'react';
import SEO from '../components/SEO';
import { Heart, Info, RefreshCw, Flame } from 'lucide-react';
import ShareButtons from '../components/ShareButtons';

const BMR = () => {
    const [gender, setGender] = useState('male');
    const [age, setAge] = useState('');
    const [height, setHeight] = useState('');
    const [weight, setWeight] = useState('');
    const [activity, setActivity] = useState('1.2');
    const [result, setResult] = useState(null);

    const calculateBMR = () => {
        if (!age || !height || !weight) return;

        const w = parseFloat(weight);
        const h = parseFloat(height);
        const a = parseFloat(age);

        // Mifflin-St Jeor Equation (More accurate than Harris-Benedict)
        let bmrValue = (10 * w) + (6.25 * h) - (5 * a);
        if (gender === 'male') {
            bmrValue += 5;
        } else {
            bmrValue -= 161;
        }

        const tdeeValue = bmrValue * parseFloat(activity);

        setResult({
            bmr: Math.round(bmrValue),
            tdee: Math.round(tdeeValue)
        });
    };

    const reset = () => {
        setAge('');
        setHeight('');
        setWeight('');
        setResult(null);
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <SEO
                title="BMR 기초대사량 계산기 - 하루 권장 칼로리 | Utility Hub"
                description="나의 기초대사량(BMR)과 활동 대사량(TDEE)을 계산하여 하루 권장 칼로리를 확인해보세요."
                keywords="BMR계산기, 기초대사량, 활동대사량, TDEE, 칼로리계산, 다이어트"
            />

            <div className="text-center space-y-4 py-6">
                <div className="inline-flex items-center justify-center p-3 bg-orange-100 dark:bg-orange-900/30 rounded-full mb-2">
                    <Flame className="w-8 h-8 text-orange-600 dark:text-orange-400" />
                </div>
                <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-red-500">
                    기초대사량(BMR) 계산기
                </h1>
                <p className="text-muted-foreground">
                    숨만 쉬어도 소비되는 에너지와 하루 총 소비 칼로리를 계산합니다.
                </p>
            </div>

            <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-6">
                {/* 성별 선택 */}
                <div className="flex gap-4">
                    <button
                        onClick={() => setGender('male')}
                        className={`flex-1 py-3 rounded-xl border-2 font-bold transition-all ${gender === 'male'
                                ? 'border-blue-500 bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                                : 'border-border text-muted-foreground hover:bg-accent'
                            }`}
                    >
                        남성
                    </button>
                    <button
                        onClick={() => setGender('female')}
                        className={`flex-1 py-3 rounded-xl border-2 font-bold transition-all ${gender === 'female'
                                ? 'border-pink-500 bg-pink-50 text-pink-600 dark:bg-pink-900/20 dark:text-pink-400'
                                : 'border-border text-muted-foreground hover:bg-accent'
                            }`}
                    >
                        여성
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium">나이 (세)</label>
                        <input
                            type="number"
                            value={age}
                            onChange={(e) => setAge(e.target.value)}
                            placeholder="25"
                            className="w-full p-3 border border-border rounded-xl bg-background focus:ring-2 focus:ring-orange-500 outline-none"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-medium">신장 (cm)</label>
                        <input
                            type="number"
                            value={height}
                            onChange={(e) => setHeight(e.target.value)}
                            placeholder="175"
                            className="w-full p-3 border border-border rounded-xl bg-background focus:ring-2 focus:ring-orange-500 outline-none"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-medium">체중 (kg)</label>
                        <input
                            type="number"
                            value={weight}
                            onChange={(e) => setWeight(e.target.value)}
                            placeholder="70"
                            className="w-full p-3 border border-border rounded-xl bg-background focus:ring-2 focus:ring-orange-500 outline-none"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium">활동량 수준</label>
                    <select
                        value={activity}
                        onChange={(e) => setActivity(e.target.value)}
                        className="w-full p-3 border border-border rounded-xl bg-background focus:ring-2 focus:ring-orange-500 outline-none"
                    >
                        <option value="1.2">활동 거의 없음 (운동 안 함)</option>
                        <option value="1.375">가벼운 활동 (주 1~3회 운동)</option>
                        <option value="1.55">보통 활동 (주 3~5회 운동)</option>
                        <option value="1.725">많은 활동 (주 6~7회 운동)</option>
                        <option value="1.9">매우 많은 활동 (선수급 운동)</option>
                    </select>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={calculateBMR}
                        className="flex-1 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-orange-500/20"
                    >
                        계산하기
                    </button>
                    <button
                        onClick={reset}
                        className="px-4 py-3 bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-xl transition-colors"
                    >
                        <RefreshCw className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {result && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4">
                    {/* BMR Result */}
                    <div className="bg-card border border-border rounded-xl p-6 shadow-sm text-center space-y-2">
                        <div className="inline-flex p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-600 dark:text-blue-400 mb-2">
                            <Heart className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-medium text-muted-foreground">기초대사량 (BMR)</h3>
                        <div className="text-4xl font-bold text-foreground">
                            {result.bmr.toLocaleString()} <span className="text-lg font-medium text-muted-foreground">kcal</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            아무것도 안 하고 숨만 쉴 때 소비되는 에너지
                        </p>
                    </div>

                    {/* TDEE Result */}
                    <div className="bg-card border border-border rounded-xl p-6 shadow-sm text-center space-y-2 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-red-500/10"></div>
                        <div className="relative">
                            <div className="inline-flex p-3 bg-orange-100 dark:bg-orange-900/30 rounded-full text-orange-600 dark:text-orange-400 mb-2">
                                <Flame className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-medium text-muted-foreground">하루 총 소비량 (TDEE)</h3>
                            <div className="text-4xl font-bold text-orange-600 dark:text-orange-400">
                                {result.tdee.toLocaleString()} <span className="text-lg font-medium text-muted-foreground">kcal</span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                현재 활동량을 고려한 하루 총 에너지 소비량
                            </p>
                        </div>
                    </div>

                    <div className="md:col-span-2 bg-muted/50 p-4 rounded-xl text-sm text-muted-foreground flex gap-3">
                        <Info className="w-5 h-5 shrink-0 mt-0.5" />
                        <div>
                            <p className="font-bold mb-1">다이어트 팁</p>
                            <ul className="list-disc pl-4 space-y-1">
                                <li>체중 감량: 하루 총 소비량(TDEE)보다 <strong>300~500kcal 적게</strong> 섭취하세요.</li>
                                <li>체중 증량: 하루 총 소비량(TDEE)보다 <strong>300~500kcal 많이</strong> 섭취하세요.</li>
                                <li>근육 유지: 하루 총 소비량과 비슷하게 섭취하며 단백질 비중을 높이세요.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            )}

            <div className="mt-8">
                <ShareButtons
                    title="기초대사량(BMR) 계산기"
                    description="나의 기초대사량과 하루 권장 칼로리를 확인해보세요!"
                />
            </div>
        </div>
    );
};

export default BMR;
