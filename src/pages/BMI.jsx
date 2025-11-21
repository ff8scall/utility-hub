import React, { useState } from 'react';
import SEO from '../components/SEO';
import { Activity, Info, RefreshCw } from 'lucide-react';
import ShareButtons from '../components/ShareButtons';

const BMI = () => {
    const [height, setHeight] = useState('');
    const [weight, setWeight] = useState('');
    const [bmi, setBmi] = useState(null);
    const [status, setStatus] = useState('');

    const calculateBMI = () => {
        if (!height || !weight) return;

        const h = parseFloat(height) / 100; // cm to m
        const w = parseFloat(weight);
        const bmiValue = w / (h * h);
        const roundedBMI = bmiValue.toFixed(1);

        setBmi(roundedBMI);

        if (bmiValue < 18.5) setStatus('저체중');
        else if (bmiValue < 23) setStatus('정상');
        else if (bmiValue < 25) setStatus('과체중');
        else if (bmiValue < 30) setStatus('비만');
        else setStatus('고도비만');
    };

    const reset = () => {
        setHeight('');
        setWeight('');
        setBmi(null);
        setStatus('');
    };

    const getStatusColor = (s) => {
        switch (s) {
            case '저체중': return 'text-blue-500 bg-blue-50 dark:bg-blue-900/20 border-blue-200';
            case '정상': return 'text-green-500 bg-green-50 dark:bg-green-900/20 border-green-200';
            case '과체중': return 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200';
            case '비만': return 'text-orange-500 bg-orange-50 dark:bg-orange-900/20 border-orange-200';
            case '고도비만': return 'text-red-500 bg-red-50 dark:bg-red-900/20 border-red-200';
            default: return 'text-gray-500';
        }
    };

    const getGaugePosition = () => {
        if (!bmi) return 0;
        // Map BMI 10-40 to 0-100%
        const val = parseFloat(bmi);
        const pos = ((val - 10) / 30) * 100;
        return Math.min(Math.max(pos, 0), 100);
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <SEO
                title="BMI 계산기 - 비만도 측정 | Utility Hub"
                description="키와 몸무게만 입력하면 나의 BMI(체질량지수)와 비만도를 바로 확인할 수 있습니다."
                keywords="BMI계산기, 비만도계산기, 체질량지수, 다이어트, 건강계산기"
            />

            <div className="text-center space-y-4 py-6">
                <div className="inline-flex items-center justify-center p-3 bg-green-100 dark:bg-green-900/30 rounded-full mb-2">
                    <Activity className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-teal-600">
                    BMI 비만도 계산기
                </h1>
                <p className="text-muted-foreground">
                    나의 체질량지수(BMI)를 확인하고 건강 상태를 점검해보세요.
                </p>
            </div>

            <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium">신장 (cm)</label>
                        <input
                            type="number"
                            value={height}
                            onChange={(e) => setHeight(e.target.value)}
                            placeholder="175"
                            className="w-full p-3 border border-border rounded-xl bg-background focus:ring-2 focus:ring-green-500 outline-none"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-medium">체중 (kg)</label>
                        <input
                            type="number"
                            value={weight}
                            onChange={(e) => setWeight(e.target.value)}
                            placeholder="70"
                            className="w-full p-3 border border-border rounded-xl bg-background focus:ring-2 focus:ring-green-500 outline-none"
                            onKeyDown={(e) => e.key === 'Enter' && calculateBMI()}
                        />
                    </div>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={calculateBMI}
                        className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-green-500/20"
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

            {bmi && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                    <div className={`p-6 rounded-xl border-2 ${getStatusColor(status)} text-center space-y-2`}>
                        <h3 className="text-lg font-medium opacity-80">나의 BMI 지수</h3>
                        <div className="text-5xl font-bold">{bmi}</div>
                        <div className="text-xl font-bold badge inline-block px-4 py-1 rounded-full bg-white/50 dark:bg-black/20">
                            {status}
                        </div>
                    </div>

                    {/* Gauge Visualization */}
                    <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                        <div className="relative h-4 bg-gray-200 dark:bg-gray-700 rounded-full mb-2 overflow-hidden">
                            <div className="absolute inset-y-0 left-0 w-[28%] bg-blue-400 opacity-50"></div> {/* 저체중 ~18.5 */}
                            <div className="absolute inset-y-0 left-[28%] w-[15%] bg-green-400 opacity-50"></div> {/* 정상 ~23 */}
                            <div className="absolute inset-y-0 left-[43%] w-[7%] bg-yellow-400 opacity-50"></div> {/* 과체중 ~25 */}
                            <div className="absolute inset-y-0 left-[50%] w-[17%] bg-orange-400 opacity-50"></div> {/* 비만 ~30 */}
                            <div className="absolute inset-y-0 left-[67%] w-[33%] bg-red-400 opacity-50"></div> {/* 고도비만 30+ */}
                        </div>

                        {/* Indicator */}
                        <div className="relative h-6 -mt-5 mb-6">
                            <div
                                className="absolute top-0 w-4 h-4 bg-black dark:bg-white rounded-full border-2 border-white dark:border-gray-900 shadow-md transition-all duration-500"
                                style={{ left: `calc(${getGaugePosition()}% - 8px)` }}
                            ></div>
                            <div
                                className="absolute top-5 text-xs font-bold transform -translate-x-1/2 transition-all duration-500"
                                style={{ left: `${getGaugePosition()}%` }}
                            >
                                {bmi}
                            </div>
                        </div>

                        <div className="flex justify-between text-xs text-muted-foreground">
                            <span>18.5</span>
                            <span>23</span>
                            <span>25</span>
                            <span>30</span>
                        </div>
                        <div className="flex justify-between text-xs font-medium mt-1">
                            <span className="text-blue-500">저체중</span>
                            <span className="text-green-500 pl-4">정상</span>
                            <span className="text-yellow-500 pl-2">과체중</span>
                            <span className="text-orange-500 pl-2">비만</span>
                            <span className="text-red-500">고도</span>
                        </div>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl flex gap-3 items-start">
                        <Info className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
                        <div className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                            <p className="font-bold">BMI(체질량지수)란?</p>
                            <p>키와 몸무게를 이용하여 비만도를 추정하는 지표입니다. <br />근육량이 많은 경우 BMI가 높게 나올 수 있으니 참고용으로만 활용하세요.</p>
                        </div>
                    </div>
                </div>
            )}

            <div className="mt-8">
                <ShareButtons
                    title="BMI 비만도 계산기"
                    description="내 키와 몸무게로 비만도를 확인해보세요!"
                />
            </div>
        </div>
    );
};

export default BMI;
