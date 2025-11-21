import React, { useState } from 'react';
import SEO from '../components/SEO';
import { Droplet, ArrowRightLeft } from 'lucide-react';
import ShareButtons from '../components/ShareButtons';

const VolumeConverter = () => {
    const [value, setValue] = useState('');
    const [fromUnit, setFromUnit] = useState('liter');
    const [toUnit, setToUnit] = useState('ml');

    // 모든 단위를 리터 기준으로 변환
    const units = {
        liter: { name: '리터 (L)', toBase: 1 },
        ml: { name: '밀리리터 (mL)', toBase: 0.001 },
        gallon: { name: '갤런 (gal)', toBase: 3.78541 },
        quart: { name: '쿼트 (qt)', toBase: 0.946353 },
        pint: { name: '파인트 (pt)', toBase: 0.473176 },
        cup: { name: '컵 (cup)', toBase: 0.236588 },
        floz: { name: '액량온스 (fl oz)', toBase: 0.0295735 },
        cbm: { name: '세제곱미터 (m³)', toBase: 1000 },
        cbcm: { name: '세제곱센티미터 (cm³)', toBase: 0.001 },
        cbft: { name: '세제곱피트 (ft³)', toBase: 28.3168 }
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
        <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            <SEO
                title="부피 변환기 - 리터, 갤런, 세제곱미터 변환"
                description="리터, 밀리리터, 갤런, 세제곱미터 등 다양한 부피 단위를 간편하게 변환하세요."
                keywords={['부피', '변환', '리터', '갤런', 'volume', 'converter']}
                path="/volume-converter"
            />

            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl mb-4 shadow-lg">
                        <Droplet className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                        부피 변환기
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        리터, 갤런, 세제곱미터 등 다양한 부피 단위 변환
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
                                className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 dark:bg-gray-700 dark:text-white"
                            />
                            <select
                                value={fromUnit}
                                onChange={(e) => setFromUnit(e.target.value)}
                                className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 dark:bg-gray-700 dark:text-white"
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
                            className="p-3 bg-cyan-100 dark:bg-cyan-900 text-cyan-600 dark:text-cyan-300 rounded-full hover:bg-cyan-200 dark:hover:bg-cyan-800 transition-colors"
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
                                className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 dark:bg-gray-700 dark:text-white"
                            >
                                {Object.entries(units).map(([key, unit]) => (
                                    <option key={key} value={key}>{unit.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Quick Reference */}
                    <div className="bg-cyan-50 dark:bg-cyan-900/20 rounded-lg p-4">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">참고</h3>
                        <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                            <p>• 1L = 1,000mL</p>
                            <p>• 1갤런 = 3.785L</p>
                            <p>• 1m³ = 1,000L</p>
                            <p>• 1컵 = 약 237mL</p>
                        </div>
                    </div>
                </div>

                <ShareButtons />
            </div>
        </div>
    );
};

export default VolumeConverter;
