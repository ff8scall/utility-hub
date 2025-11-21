import React, { useState, useEffect } from 'react';
import SEO from '../components/SEO';
import { DollarSign, RefreshCw, TrendingUp, Calendar, Edit2, Save, ArrowRightLeft } from 'lucide-react';
import ShareButtons from '../components/ShareButtons';
import RelatedTools from '../components/RelatedTools';

const CurrencyConverter = () => {
    // Default rates (KRW base) - Updated: 2025-11-21
    const DEFAULT_RATES = {
        USD: 1340.50,
        JPY: 9.12,
        CNY: 185.20,
        EUR: 1460.30,
        GBP: 1695.80,
        AUD: 870.40,
        CAD: 960.30,
        CHF: 1520.60,
        HKD: 171.80,
        SGD: 995.20,
    };

    const CURRENCY_INFO = {
        KRW: { name: '대한민국 원', symbol: '₩', flag: '🇰🇷' },
        USD: { name: '미국 달러', symbol: '$', flag: '🇺🇸' },
        JPY: { name: '일본 엔', symbol: '¥', flag: '🇯🇵' },
        CNY: { name: '중국 위안', symbol: '¥', flag: '🇨🇳' },
        EUR: { name: '유로', symbol: '€', flag: '🇪🇺' },
        GBP: { name: '영국 파운드', symbol: '£', flag: '🇬🇧' },
        AUD: { name: '호주 달러', symbol: 'A$', flag: '🇦🇺' },
        CAD: { name: '캐나다 달러', symbol: 'C$', flag: '🇨🇦' },
        CHF: { name: '스위스 프랑', symbol: 'CHF', flag: '🇨🇭' },
        HKD: { name: '홍콩 달러', symbol: 'HK$', flag: '🇭🇰' },
        SGD: { name: '싱가포르 달러', symbol: 'S$', flag: '🇸🇬' },
    };

    const [rates, setRates] = useState(() => {
        const saved = localStorage.getItem('currency-rates');
        return saved ? JSON.parse(saved) : DEFAULT_RATES;
    });

    const [lastUpdate, setLastUpdate] = useState(() => {
        return localStorage.getItem('currency-last-update') || '2025-11-21';
    });

    const [fromCurrency, setFromCurrency] = useState('USD');
    const [toCurrency, setToCurrency] = useState('KRW');
    const [amount, setAmount] = useState('100');
    const [result, setResult] = useState('');
    const [editMode, setEditMode] = useState(false);
    const [editRates, setEditRates] = useState({});

    useEffect(() => {
        calculateConversion();
    }, [amount, fromCurrency, toCurrency, rates]);

    const calculateConversion = () => {
        const amt = parseFloat(amount) || 0;
        if (amt === 0) {
            setResult('');
            return;
        }

        let converted;
        if (fromCurrency === 'KRW' && toCurrency === 'KRW') {
            converted = amt;
        } else if (fromCurrency === 'KRW') {
            converted = amt / rates[toCurrency];
        } else if (toCurrency === 'KRW') {
            converted = amt * rates[fromCurrency];
        } else {
            const toKRW = amt * rates[fromCurrency];
            converted = toKRW / rates[toCurrency];
        }

        setResult(converted.toFixed(2));
    };

    const formatNumber = (num) => {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };

    const swapCurrencies = () => {
        setFromCurrency(toCurrency);
        setToCurrency(fromCurrency);
    };

    const resetToDefault = () => {
        if (confirm('기본 환율로 초기화하시겠습니까?')) {
            setRates(DEFAULT_RATES);
            setLastUpdate(new Date().toISOString().split('T')[0]);
            localStorage.setItem('currency-rates', JSON.stringify(DEFAULT_RATES));
            localStorage.setItem('currency-last-update', new Date().toISOString().split('T')[0]);
            setEditMode(false);
        }
    };

    const startEdit = () => {
        setEditRates({ ...rates });
        setEditMode(true);
    };

    const saveRates = () => {
        setRates(editRates);
        const today = new Date().toISOString().split('T')[0];
        setLastUpdate(today);
        localStorage.setItem('currency-rates', JSON.stringify(editRates));
        localStorage.setItem('currency-last-update', today);
        setEditMode(false);
    };

    const cancelEdit = () => {
        setEditRates({});
        setEditMode(false);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <SEO
                title="환율 계산기 - 주요 통화 환율 변환 | Utility Hub"
                description="주요 통화 간 환율을 계산하세요. USD, JPY, CNY, EUR, GBP 등 다양한 통화를 지원합니다. 사용자 정의 환율 설정 가능."
                keywords="환율, 환율계산기, 달러, 엔화, 위안화, 환전, 통화변환, 외환"
            />

            <div className="text-center space-y-4 py-6">
                <div className="inline-flex items-center justify-center p-3 bg-green-100 dark:bg-green-900/30 rounded-full mb-2">
                    <DollarSign className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-blue-600">
                    환율 계산기
                </h1>
                <p className="text-muted-foreground">
                    주요 통화 간 환율을 빠르게 계산하세요.
                </p>
            </div>

            {/* Disclaimer */}
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4 text-sm">
                <div className="flex items-start gap-2">
                    <TrendingUp className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="font-medium text-yellow-800 dark:text-yellow-300">참고용 환율 정보</p>
                        <p className="text-yellow-700 dark:text-yellow-400 mt-1">
                            이 환율은 참고용이며 실제 환전 시 금융기관의 환율과 다를 수 있습니다.
                            정확한 환율은 은행이나 환전소에 문의하세요.
                        </p>
                        <p className="text-xs text-yellow-600 dark:text-yellow-500 mt-2 flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            마지막 업데이트: {lastUpdate}
                        </p>
                    </div>
                </div>
            </div>

            {/* Converter */}
            <div className="card p-8 space-y-6">
                {/* From Currency */}
                <div>
                    <label className="block text-sm font-medium mb-2">보낼 금액</label>
                    <div className="flex gap-3">
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="input flex-1 text-lg"
                            placeholder="100"
                            min="0"
                            step="0.01"
                        />
                        <select
                            value={fromCurrency}
                            onChange={(e) => setFromCurrency(e.target.value)}
                            className="input w-40 text-lg font-medium"
                        >
                            {Object.keys(CURRENCY_INFO).map((code) => (
                                <option key={code} value={code}>
                                    {CURRENCY_INFO[code].flag} {code}
                                </option>
                            ))}
                        </select>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                        {CURRENCY_INFO[fromCurrency].name} ({CURRENCY_INFO[fromCurrency].symbol})
                    </p>
                </div>

                {/* Swap Button */}
                <div className="flex justify-center">
                    <button
                        onClick={swapCurrencies}
                        className="p-3 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        title="통화 바꾸기"
                    >
                        <ArrowRightLeft className="w-6 h-6" />
                    </button>
                </div>

                {/* To Currency */}
                <div>
                    <label className="block text-sm font-medium mb-2">받을 금액</label>
                    <div className="flex gap-3">
                        <input
                            type="text"
                            value={result ? formatNumber(result) : ''}
                            readOnly
                            className="input flex-1 text-lg font-bold bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400"
                            placeholder="0.00"
                        />
                        <select
                            value={toCurrency}
                            onChange={(e) => setToCurrency(e.target.value)}
                            className="input w-40 text-lg font-medium"
                        >
                            {Object.keys(CURRENCY_INFO).map((code) => (
                                <option key={code} value={code}>
                                    {CURRENCY_INFO[code].flag} {code}
                                </option>
                            ))}
                        </select>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                        {CURRENCY_INFO[toCurrency].name} ({CURRENCY_INFO[toCurrency].symbol})
                    </p>
                </div>

                {/* Exchange Rate Info */}
                {result && (
                    <div className="p-4 bg-muted/30 rounded-lg text-center">
                        <p className="text-sm text-muted-foreground">환율</p>
                        <p className="text-lg font-bold">
                            1 {fromCurrency} = {
                                fromCurrency === 'KRW'
                                    ? (1 / rates[toCurrency]).toFixed(4)
                                    : toCurrency === 'KRW'
                                        ? rates[fromCurrency].toFixed(2)
                                        : (rates[fromCurrency] / rates[toCurrency]).toFixed(4)
                            } {toCurrency}
                        </p>
                    </div>
                )}
            </div>

            {/* Rate Management */}
            <div className="card p-6 space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="font-bold text-lg">환율 관리</h3>
                    <div className="flex gap-2">
                        {!editMode ? (
                            <>
                                <button onClick={startEdit} className="btn btn-ghost text-sm flex items-center gap-2">
                                    <Edit2 className="w-4 h-4" />
                                    환율 수정
                                </button>
                                <button onClick={resetToDefault} className="btn btn-ghost text-sm flex items-center gap-2">
                                    <RefreshCw className="w-4 h-4" />
                                    초기화
                                </button>
                            </>
                        ) : (
                            <>
                                <button onClick={saveRates} className="btn btn-primary text-sm flex items-center gap-2">
                                    <Save className="w-4 h-4" />
                                    저장
                                </button>
                                <button onClick={cancelEdit} className="btn btn-ghost text-sm">
                                    취소
                                </button>
                            </>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {Object.keys(rates).map((code) => (
                        <div key={code} className="p-3 bg-muted/30 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                                <span className="font-medium">{CURRENCY_INFO[code].flag} {code}</span>
                                <span className="text-xs text-muted-foreground">→ KRW</span>
                            </div>
                            {editMode ? (
                                <input
                                    type="number"
                                    value={editRates[code]}
                                    onChange={(e) => setEditRates({ ...editRates, [code]: parseFloat(e.target.value) })}
                                    className="input w-full text-sm"
                                    step="0.01"
                                />
                            ) : (
                                <p className="font-mono text-sm">{rates[code].toFixed(2)}</p>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Info */}
            <div className="bg-muted/30 rounded-xl p-6 space-y-2 text-sm">
                <h3 className="font-bold text-base">💡 사용 방법</h3>
                <ul className="space-y-1 text-muted-foreground list-disc list-inside">
                    <li>금액과 통화를 선택하면 자동으로 환율이 계산됩니다</li>
                    <li>"환율 수정" 버튼으로 직접 환율을 입력할 수 있습니다</li>
                    <li>수정한 환율은 브라우저에 저장되어 다음에도 사용됩니다</li>
                    <li>"초기화" 버튼으로 기본 환율로 되돌릴 수 있습니다</li>
                    <li>실제 환전 시에는 금융기관의 환율을 확인하세요</li>
                </ul>
            </div>

            <ShareButtons
                title="환율 계산기"
                description="주요 통화 간 환율을 빠르게 계산하세요!"
            />

            <RelatedTools relatedIds={['length', 'weight', 'age-calc']} />
        </div>
    );
};

export default CurrencyConverter;
