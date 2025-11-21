import React, { useState } from 'react';
import SEO from '../components/SEO';
import { Gauge, ArrowRightLeft } from 'lucide-react';
import ShareButtons from '../components/ShareButtons';

const SpeedConverter = () => {
    const [value, setValue] = useState('');
    const [fromUnit, setFromUnit] = useState('kmh');
    const [toUnit, setToUnit] = useState('mph');

    // 모든 단위를 m/s 기준으로 변환
    const units = {
        ms: { name: '미터/초 (m/s)', toBase: 1 },
        kmh: { name: '킬로미터/시 (km/h)', toBase: 0.277778 },
        mph: { name: '마일/시 (mph)', toBase: 0.44704 },
        fps: { name: '피트/초 (ft/s)', toBase: 0.3048 },
        knot: { name: '노트 (knot)', toBase: 0.514444 },
        mach: { name: '마하 (Mach)', toBase: 343 }
    };

    const convert = () => {
        if (!value || isNaN(value)) return '';
        const baseValue = parseFloat(value) * units[fromUnit].toBase;
        const result = baseValue / units[toUnit].toBase;
        return result.toLocaleString('ko-KR', { maximumFractionDigits: 4 });
    };

    const swap = () => {
        setFromUnit(toUnit);
        setToUnit(fromUnit);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            <SEO
                title="속도 변환기 - km/h, mph, m/s 변환"
                description="킬로미터/시, 마일/시, 미터/초, 노트 등 다양한 속도 단위를 간편하게 변환하세요."
                keywords={['속도', '변환', 'kmh', 'mph', 'speed', 'converter']}
                path="/speed-converter"
            />

            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl mb-4 shadow-lg">
                        <Gauge className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                        속도 변환기
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        km/h, mph, m/s, 노트 등 다양한 속도 단위 변환
                    </p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8">
                    {/* From */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            변환할 값
                        </label>
                        <div className="flex gap-4">
                            <input
                                type="number"
                                value={value}
                                onChange={(e) => setValue(e.target.value)}
                                placeholder="숫자 입력"
                                className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
                            />
                            <select
                                value={fromUnit}
                                onChange={(e) => setFromUnit(e.target.value)}
                                className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
                            >
                                {Object.entries(units).map(([key, unit]) => (
                                    <option key={key} value={key}>{unit.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Swap Button */}
                    <div className="flex justify-center mb-6">
                        <button
                            onClick={swap}
                            className="p-3 bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-300 rounded-full hover:bg-orange-200 dark:hover:bg-orange-800 transition-colors"
                        >
                            <ArrowRightLeft className="w-5 h-5" />
                        </button>
                    </div>

                    {/* To */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            변환 결과
                        </label>
                        <div className="flex gap-4">
                            <div className="flex-1 px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white font-semibold text-lg">
                                {convert() || '0'}
                            </div>
                            <select
                                value={toUnit}
                                onChange={(e) => setToUnit(e.target.value)}
                                className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
                            >
                                {Object.entries(units).map(([key, unit]) => (
                                    <option key={key} value={key}>{unit.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Quick Reference */}
                    <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">참고</h3>
                        <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                            <p>• 100km/h ≈ 62.14mph ≈ 27.78m/s</p>
                            <p>• 1노트 = 1.852km/h (해상/항공 속도)</p>
                            <p>• 마하 1 = 약 1,235km/h (음속)</p>
                        </div>
                    </div>
                </div>

                <ShareButtons />
            </div>
        </div>
    );
};

export default SpeedConverter;
