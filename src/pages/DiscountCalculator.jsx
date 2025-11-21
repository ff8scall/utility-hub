import React, { useState } from 'react';
import SEO from '../components/SEO';
import { Percent, Calculator, TrendingDown, RefreshCw } from 'lucide-react';
import ShareButtons from '../components/ShareButtons';

const DiscountCalculator = () => {
    const [originalPrice, setOriginalPrice] = useState('');
    const [discountPercent, setDiscountPercent] = useState('');
    const [finalPrice, setFinalPrice] = useState('');
    const [savings, setSavings] = useState(0);
    const [mode, setMode] = useState('forward'); // forward or reverse

    const formatNumber = (num) => {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };

    const parseNumber = (str) => {
        return parseFloat(str.replace(/,/g, '')) || 0;
    };

    const calculateForward = (price, discount) => {
        const p = parseNumber(price);
        const d = parseFloat(discount) || 0;

        if (p > 0 && d >= 0 && d <= 100) {
            const discountAmount = p * (d / 100);
            const final = p - discountAmount;
            setFinalPrice(formatNumber(Math.round(final)));
            setSavings(Math.round(discountAmount));
        } else {
            setFinalPrice('');
            setSavings(0);
        }
    };

    const calculateReverse = (price, final) => {
        const p = parseNumber(price);
        const f = parseNumber(final);

        if (p > 0 && f > 0 && f < p) {
            const discountAmount = p - f;
            const percent = (discountAmount / p) * 100;
            setDiscountPercent(percent.toFixed(1));
            setSavings(Math.round(discountAmount));
        } else {
            setDiscountPercent('');
            setSavings(0);
        }
    };

    const handleOriginalPriceChange = (value) => {
        setOriginalPrice(value);
        if (mode === 'forward') {
            calculateForward(value, discountPercent);
        } else {
            calculateReverse(value, finalPrice);
        }
    };

    const handleDiscountChange = (value) => {
        setDiscountPercent(value);
        if (mode === 'forward') {
            calculateForward(originalPrice, value);
        }
    };

    const handleFinalPriceChange = (value) => {
        setFinalPrice(value);
        if (mode === 'reverse') {
            calculateReverse(originalPrice, value);
        }
    };

    const applyPreset = (percent) => {
        setMode('forward');
        setDiscountPercent(percent.toString());
        calculateForward(originalPrice, percent);
    };

    const reset = () => {
        setOriginalPrice('');
        setDiscountPercent('');
        setFinalPrice('');
        setSavings(0);
    };

    const switchMode = () => {
        setMode(mode === 'forward' ? 'reverse' : 'forward');
        setDiscountPercent('');
        setFinalPrice('');
        setSavings(0);
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <SEO
                title="할인율 계산기 - 세일 가격 계산 | Utility Hub"
                description="원가와 할인율을 입력하면 할인 가격을 자동으로 계산해드립니다. 역계산으로 할인율도 확인할 수 있습니다."
                keywords="할인율, 할인계산기, 세일가격, 쇼핑계산기, 할인가격계산"
            />

            <div className="text-center space-y-4 py-6">
                <div className="inline-flex items-center justify-center p-3 bg-red-100 dark:bg-red-900/30 rounded-full mb-2">
                    <Percent className="w-8 h-8 text-red-600 dark:text-red-400" />
                </div>
                <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-pink-600">
                    할인율 계산기
                </h1>
                <p className="text-muted-foreground">
                    원가와 할인율을 입력하면 최종 가격을 계산해드립니다.
                </p>
            </div>

            {/* Mode Switch */}
            <div className="flex justify-center gap-2">
                <button
                    onClick={() => setMode('forward')}
                    className={`px-6 py-2 rounded-lg font-medium transition-colors ${mode === 'forward'
                            ? 'bg-red-500 text-white'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                        }`}
                >
                    할인율 → 최종가격
                </button>
                <button
                    onClick={() => setMode('reverse')}
                    className={`px-6 py-2 rounded-lg font-medium transition-colors ${mode === 'reverse'
                            ? 'bg-red-500 text-white'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                        }`}
                >
                    최종가격 → 할인율
                </button>
            </div>

            <div className="card p-8 space-y-6">
                {/* Original Price */}
                <div>
                    <label className="block text-sm font-medium mb-2">원가</label>
                    <div className="relative">
                        <input
                            type="text"
                            value={originalPrice}
                            onChange={(e) => handleOriginalPriceChange(e.target.value)}
                            className="input w-full text-right pr-12 text-lg"
                            placeholder="0"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">원</span>
                    </div>
                </div>

                {mode === 'forward' ? (
                    <>
                        {/* Discount Percent */}
                        <div>
                            <label className="block text-sm font-medium mb-2">할인율</label>
                            <div className="relative">
                                <input
                                    type="number"
                                    value={discountPercent}
                                    onChange={(e) => handleDiscountChange(e.target.value)}
                                    className="input w-full text-right pr-12 text-lg"
                                    placeholder="0"
                                    min="0"
                                    max="100"
                                    step="0.1"
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">%</span>
                            </div>

                            {/* Preset Buttons */}
                            <div className="grid grid-cols-4 gap-2 mt-3">
                                {[10, 20, 30, 50].map((percent) => (
                                    <button
                                        key={percent}
                                        onClick={() => applyPreset(percent)}
                                        className="btn btn-ghost text-sm py-2"
                                    >
                                        {percent}%
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Final Price (Result) */}
                        <div>
                            <label className="block text-sm font-medium mb-2">최종 가격</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={finalPrice}
                                    readOnly
                                    className="input w-full text-right pr-12 text-lg font-bold bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400"
                                    placeholder="0"
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-green-600 dark:text-green-400">원</span>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        {/* Final Price (Input) */}
                        <div>
                            <label className="block text-sm font-medium mb-2">최종 가격</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={finalPrice}
                                    onChange={(e) => handleFinalPriceChange(e.target.value)}
                                    className="input w-full text-right pr-12 text-lg"
                                    placeholder="0"
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">원</span>
                            </div>
                        </div>

                        {/* Discount Percent (Result) */}
                        <div>
                            <label className="block text-sm font-medium mb-2">할인율</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={discountPercent}
                                    readOnly
                                    className="input w-full text-right pr-12 text-lg font-bold bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400"
                                    placeholder="0"
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-green-600 dark:text-green-400">%</span>
                            </div>
                        </div>
                    </>
                )}

                {/* Savings Display */}
                {savings > 0 && (
                    <div className="p-4 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-xl border border-red-200 dark:border-red-800">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <TrendingDown className="w-5 h-5 text-red-600 dark:text-red-400" />
                                <span className="font-medium text-gray-700 dark:text-gray-300">절약 금액</span>
                            </div>
                            <span className="text-2xl font-bold text-red-600 dark:text-red-400">
                                {formatNumber(savings)}원
                            </span>
                        </div>
                    </div>
                )}

                {/* Reset Button */}
                <button
                    onClick={reset}
                    className="btn btn-ghost w-full flex items-center justify-center gap-2"
                >
                    <RefreshCw className="w-5 h-5" />
                    초기화
                </button>
            </div>

            {/* Info */}
            <div className="bg-muted/30 rounded-xl p-6 space-y-2 text-sm">
                <h3 className="font-bold text-base flex items-center gap-2">
                    <Calculator className="w-4 h-4" />
                    사용 방법
                </h3>
                <ul className="space-y-1 text-muted-foreground list-disc list-inside">
                    <li><strong>할인율 → 최종가격:</strong> 원가와 할인율을 입력하면 최종 가격 계산</li>
                    <li><strong>최종가격 → 할인율:</strong> 원가와 최종 가격을 입력하면 할인율 계산</li>
                    <li>프리셋 버튼(10%, 20%, 30%, 50%)으로 빠른 계산</li>
                    <li>쉼표로 구분된 금액 표시</li>
                </ul>
            </div>

            <ShareButtons
                title="할인율 계산기"
                description="쇼핑할 때 유용한 할인율 계산기! 원가와 할인율만 입력하면 최종 가격을 바로 확인할 수 있습니다."
            />
        </div>
    );
};

export default DiscountCalculator;
