import React, { useState } from 'react';
import SEO from '../components/SEO';
import { Lock, Unlock, Copy, Check } from 'lucide-react';
import ShareButtons from '../components/ShareButtons';
import CryptoJS from 'crypto-js';

const EncryptionTool = () => {
    const [mode, setMode] = useState('encrypt'); // encrypt, decrypt
    const [text, setText] = useState('');
    const [password, setPassword] = useState('');
    const [result, setResult] = useState('');
    const [copied, setCopied] = useState(false);

    const handleEncrypt = () => {
        if (!text || !password) {
            alert('텍스트와 비밀번호를 모두 입력해주세요.');
            return;
        }
        try {
            const encrypted = CryptoJS.AES.encrypt(text, password).toString();
            setResult(encrypted);
        } catch (error) {
            alert('암호화 중 오류가 발생했습니다.');
        }
    };

    const handleDecrypt = () => {
        if (!text || !password) {
            alert('암호화된 텍스트와 비밀번호를 모두 입력해주세요.');
            return;
        }
        try {
            const decrypted = CryptoJS.AES.decrypt(text, password);
            const decryptedText = decrypted.toString(CryptoJS.enc.Utf8);
            if (!decryptedText) {
                alert('복호화 실패: 비밀번호가 틀렸거나 잘못된 암호문입니다.');
                return;
            }
            setResult(decryptedText);
        } catch (error) {
            alert('복호화 중 오류가 발생했습니다.');
        }
    };

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(result);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            alert('복사 실패');
        }
    };

    const handleClear = () => {
        setText('');
        setPassword('');
        setResult('');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            <SEO
                title="암호화/복호화 도구 - AES 암호화"
                description="AES 알고리즘을 사용한 텍스트 암호화 및 복호화 도구입니다. 비밀번호 기반으로 안전하게 암호화하세요."
                keywords={['암호화', '복호화', 'AES', 'encryption', 'decryption']}
                path="/encryption-tool"
            />

            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-500 to-orange-600 rounded-2xl mb-4 shadow-lg">
                        <Lock className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                        암호화/복호화 도구
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        AES 알고리즘 기반 텍스트 암호화
                    </p>
                </div>

                {/* Mode Toggle */}
                <div className="flex gap-2 mb-6">
                    <button
                        onClick={() => { setMode('encrypt'); setResult(''); }}
                        className={`flex-1 px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${mode === 'encrypt'
                                ? 'bg-red-500 text-white'
                                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                            }`}
                    >
                        <Lock className="w-5 h-5" />
                        암호화
                    </button>
                    <button
                        onClick={() => { setMode('decrypt'); setResult(''); }}
                        className={`flex-1 px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${mode === 'decrypt'
                                ? 'bg-red-500 text-white'
                                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                            }`}
                    >
                        <Unlock className="w-5 h-5" />
                        복호화
                    </button>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8">
                    {/* Input */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {mode === 'encrypt' ? '원본 텍스트' : '암호화된 텍스트'}
                        </label>
                        <textarea
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder={mode === 'encrypt' ? '암호화할 텍스트를 입력하세요' : '복호화할 암호문을 입력하세요'}
                            rows={6}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-white resize-none"
                        />
                    </div>

                    {/* Password */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            비밀번호
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="암호화/복호화에 사용할 비밀번호"
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-white"
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 mb-6">
                        <button
                            onClick={mode === 'encrypt' ? handleEncrypt : handleDecrypt}
                            className="flex-1 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
                        >
                            {mode === 'encrypt' ? '암호화 실행' : '복호화 실행'}
                        </button>
                        <button
                            onClick={handleClear}
                            className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
                        >
                            초기화
                        </button>
                    </div>

                    {/* Result */}
                    {result && (
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    결과
                                </label>
                                <button
                                    onClick={handleCopy}
                                    className="flex items-center gap-2 px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                >
                                    {copied ? (
                                        <>
                                            <Check className="w-4 h-4" />
                                            복사됨
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="w-4 h-4" />
                                            복사
                                        </>
                                    )}
                                </button>
                            </div>
                            <div className="p-4 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg">
                                <pre className="whitespace-pre-wrap break-all text-sm text-gray-900 dark:text-white font-mono">
                                    {result}
                                </pre>
                            </div>
                        </div>
                    )}
                </div>

                {/* Warning */}
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-8">
                    <h3 className="font-bold text-yellow-800 dark:text-yellow-300 mb-2">⚠️ 주의사항</h3>
                    <ul className="text-sm text-yellow-700 dark:text-yellow-400 space-y-1">
                        <li>• 비밀번호를 잊어버리면 복호화할 수 없습니다</li>
                        <li>• 중요한 데이터는 반드시 백업하세요</li>
                        <li>• 브라우저에서 처리되며 서버로 전송되지 않습니다</li>
                        <li>• AES-256 알고리즘을 사용합니다</li>
                    </ul>
                </div>

                <ShareButtons />
            </div>
        </div>
    );
};

export default EncryptionTool;
