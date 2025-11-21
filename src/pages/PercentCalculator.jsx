import React, { useState } from 'react';
import SEO from '../components/SEO';
import { Percent } from 'lucide-react';
import ShareButtons from '../components/ShareButtons';

const PercentCalculator = () => {
    const [mode, setMode] = useState('basic'); // basic, change, ratio

    // Basic: X의 Y%
    const [basicX, setBasicX] = useState('');
    const [basicY, setBasicY] = useState('');

    // Change: 증감률
    const [changeFrom, setChangeFrom] = useState('');
    const [changeTo, setChangeTo] = useState('');

    // Ratio: 비율
    const [ratioPart, setRatioPart] = useState('');
    const [ratioWhole, setRatioWhole] = useState('');

    const calculateBasic = () => {
        if (!basicX || !basicY) return '';
        const result = (parseFloat(basicX) * parseFloat(basicY)) / 100;
        return result.toLocaleString('ko-KR', { maximumFractionDigits: 2 });
    };

    const calculateChange = () => {
        if (!changeFrom || !changeTo) return { percent: '', diff: '' };
        const from = parseFloat(changeFrom);
        const to = parseFloat(changeTo);
        const diff = to - from;
        const percent = ((diff / from) * 100).toFixed(2);
        return {
            percent: percent,
            diff: diff.toLocaleString('ko-KR', { maximumFractionDigits: 2 })
        };
    };

    const calculateRatio = () => {
        if (!ratioPart || !ratioWhole) return '';
        const result = (parseFloat(ratioPart) / parseFloat(ratioWhole)) * 100;
        return result.toFixed(2);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            <SEO
                title="퍼센트 계산기 - 백분율, 증감률, 비율 계산"
                description="퍼센트 계산, 증감률 계산, 비율 계산을 간편하게 할 수 있는 온라인 계산기입니다."
                keywords={['퍼센트', '백분율', '증감률', '비율', 'percent', 'calculator']}
                path="/percent-calculator"
            />

            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl mb-4 shadow-lg">
                        <Percent className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                        퍼센트 계산기
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        백분율, 증감률, 비율 계산
                    </p>
                </div>

                {/* Mode Tabs */}
                <div className="flex gap-2 mb-6 overflow-x-auto">
                    <button
                        onClick={() => setMode('basic')}
                        className={`px-6 py-3 rounded-lg font-medium transition-colors whitespace-nowrap ${mode === 'basic'
                                ? 'bg-green-500 text-white'
                                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                            }`}
                    >
                        X의 Y%
                    </button>
                    <button
                        onClick={() => setMode('change')}
                        className={`px-6 py-3 rounded-lg font-medium transition-colors whitespace-nowrap ${mode === 'change'
                                ? 'bg-green-500 text-white'
                                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                            }`}
                    >
                        증감률 계산
                    </button>
                    <button
                        onClick={() => setMode('ratio')}
                        className={`px-6 py-3 rounded-lg font-medium transition-colors whitespace-nowrap ${mode === 'ratio'
                                ? 'bg-green-500 text-white'
                                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                            }`}
                    >
                        비율 계산
                    </button>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8">
                    {/* Basic Mode */}
                    {mode === 'basic' && (
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                                X의 Y% 계산
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        전체 값 (X)
                                    </label>
                                    <input
                                        type="number"
                                        value={basicX}
                                        onChange={(e) => setBasicX(e.target.value)}
                                        placeholder="예: 100"
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        퍼센트 (Y%)
                                    </label>
                                    <input
                                        type="number"
                                        value={basicY}
                                        onChange={(e) => setBasicY(e.target.value)}
                                        placeholder="예: 20"
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                                    />
                                </div>
                                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6">
                                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">결과</div>
                                    <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                                        {calculateBasic() || '0'}
                                    </div>
                                    {basicX && basicY && (
                                        <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                                            {basicX}의 {basicY}% = {calculateBasic()}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Change Mode */}
                    {mode === 'change' && (
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                                증감률 계산
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        이전 값
                                    </label>
                                    <input
                                        type="number"
                                        value={changeFrom}
                                        onChange={(e) => setChangeFrom(e.target.value)}
                                        placeholder="예: 100"
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        현재 값
                                    </label>
                                    <input
                                        type="number"
                                        value={changeTo}
                                        onChange={(e) => setChangeTo(e.target.value)}
                                        placeholder="예: 120"
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                                    />
                                </div>
                                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">증감률</div>
                                            <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                                                {calculateChange().percent || '0'}%
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">차이</div>
                                            <div className="text-3xl font-bold text-gray-900 dark:text-white">
                                                {calculateChange().diff || '0'}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Ratio Mode */}
                    {mode === 'ratio' && (
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                                비율 계산
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        부분 값
                                    </label>
                                    <input
                                        type="number"
                                        value={ratioPart}
                                        onChange={(e) => setRatioPart(e.target.value)}
                                        placeholder="예: 20"
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        전체 값
                                    </label>
                                    <input
                                        type="number"
                                        value={ratioWhole}
                                        onChange={(e) => setRatioWhole(e.target.value)}
                                        placeholder="예: 100"
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                                    />
                                </div>
                                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6">
                                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">비율</div>
                                    <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                                        {calculateRatio() || '0'}%
                                    </div>
                                    {ratioPart && ratioWhole && (
                                        <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                                            {ratioPart}은(는) {ratioWhole}의 {calculateRatio()}%
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <ShareButtons />
            </div>
        </div>
    );
};

export default PercentCalculator;
