import React, { useState } from 'react';
import SEO from '../components/SEO';
import { Ruler, ArrowRightLeft } from 'lucide-react';
import ShareButtons from '../components/ShareButtons';

const AreaConverter = () => {
    const [value, setValue] = useState('');
    const [fromUnit, setFromUnit] = useState('sqm');
    const [toUnit, setToUnit] = useState('pyeong');

    // 모든 단위를 제곱미터 기준으로 변환
    const units = {
        sqm: { name: '제곱미터 (㎡)', toBase: 1 },
        pyeong: { name: '평', toBase: 3.305785 },
        sqft: { name: '제곱피트 (ft²)', toBase: 0.092903 },
        sqyd: { name: '제곱야드 (yd²)', toBase: 0.836127 },
        acre: { name: '에이커 (acre)', toBase: 4046.856 },
        hectare: { name: '헥타르 (ha)', toBase: 10000 },
        sqkm: { name: '제곱킬로미터 (km²)', toBase: 1000000 },
        sqmi: { name: '제곱마일 (mi²)', toBase: 2589988 }
    };

    const convert = () => {
        if (!value || isNaN(value)) return '';
        const baseValue = parseFloat(value) * units[fromUnit].toBase;
        const result = baseValue / units[toUnit].toBase;
        return result.toLocaleString('ko-KR', { maximumFractionDigits: 6 });
    };

    const swap = () => {
        setFromUnit(toUnit);
        setToUnit(fromUnit);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            <SEO
                title="면적 변환기 - 제곱미터, 평, 에이커 변환"
                description="제곱미터, 평, 제곱피트, 에이커, 헥타르 등 다양한 면적 단위를 간편하게 변환하세요."
                keywords={['면적', '변환', '제곱미터', '평', '에이커', 'area', 'converter']}
                path="/area-converter"
            />

            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4 shadow-lg">
                        <Ruler className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                        면적 변환기
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        제곱미터, 평, 에이커 등 다양한 면적 단위 변환
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
                                className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                            />
                            <select
                                value={fromUnit}
                                onChange={(e) => setFromUnit(e.target.value)}
                                className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
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
                            className="p-3 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
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
                                className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                            >
                                {Object.entries(units).map(([key, unit]) => (
                                    <option key={key} value={key}>{unit.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Quick Reference */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">참고</h3>
                        <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                            <p>• 1평 = 3.3058㎡</p>
                            <p>• 1에이커 = 4,046.86㎡ ≈ 1,224평</p>
                            <p>• 1헥타르 = 10,000㎡ ≈ 3,025평</p>
                        </div>
                    </div>
                </div>

                <ShareButtons />
            </div>
        </div>
    );
};

export default AreaConverter;
