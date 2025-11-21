import React, { useState, useRef } from 'react';
import SEO from '../components/SEO';
import { Palette, Upload, Copy, Check, Download, Image as ImageIcon } from 'lucide-react';
import ShareButtons from '../components/ShareButtons';
import ColorThief from 'colorthief';

const ColorExtractor = () => {
    const [colors, setColors] = useState([]);
    const [imageUrl, setImageUrl] = useState('');
    const [copiedIndex, setCopiedIndex] = useState(null);
    const fileInputRef = useRef(null);
    const imageRef = useRef(null);

    const rgbToHex = (r, g, b) => {
        return '#' + [r, g, b].map(x => {
            const hex = x.toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        }).join('');
    };

    const rgbToHsl = (r, g, b) => {
        r /= 255;
        g /= 255;
        b /= 255;
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;

        if (max === min) {
            h = s = 0;
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
                case g: h = ((b - r) / d + 2) / 6; break;
                case b: h = ((r - g) / d + 4) / 6; break;
            }
        }

        return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
    };

    const extractColors = (img) => {
        const colorThief = new ColorThief();
        try {
            const palette = colorThief.getPalette(img, 8);
            const colorData = palette.map(([r, g, b]) => ({
                rgb: `rgb(${r}, ${g}, ${b})`,
                hex: rgbToHex(r, g, b),
                hsl: rgbToHsl(r, g, b),
                r, g, b
            }));
            setColors(colorData);
        } catch (error) {
            console.error('색상 추출 실패:', error);
            alert('색상 추출에 실패했습니다. 다른 이미지를 시도해보세요.');
        }
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setImageUrl(event.target.result);
                setColors([]);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleImageLoad = () => {
        if (imageRef.current) {
            extractColors(imageRef.current);
        }
    };

    const copyToClipboard = (text, index) => {
        navigator.clipboard.writeText(text);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 1500);
    };

    const exportAsCSS = () => {
        const css = colors.map((color, i) =>
            `--color-${i + 1}: ${color.hex};`
        ).join('\n');

        const blob = new Blob([`:root {\n  ${css}\n}`], { type: 'text/css' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = 'palette.css';
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
    };

    const exportAsJSON = () => {
        const json = JSON.stringify(colors, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = 'palette.json';
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <SEO
                title="색상 추출기 - 이미지에서 컬러 팔레트 추출 | Utility Hub"
                description="이미지를 업로드하면 주요 색상을 자동으로 추출합니다. HEX, RGB, HSL 코드를 복사하고 CSS/JSON으로 내보낼 수 있습니다."
                keywords="색상추출, 컬러팔레트, 이미지색상, 색상코드, HEX, RGB, HSL, 팔레트생성"
            />

            <div className="text-center space-y-4 py-6">
                <div className="inline-flex items-center justify-center p-3 bg-pink-100 dark:bg-pink-900/30 rounded-full mb-2">
                    <Palette className="w-8 h-8 text-pink-600 dark:text-pink-400" />
                </div>
                <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-purple-600">
                    색상 추출기
                </h1>
                <p className="text-muted-foreground">
                    이미지에서 주요 색상을 추출하여 팔레트를 만들어보세요.
                </p>
            </div>

            {/* Upload Section */}
            <div className="card p-8">
                <div className="space-y-4">
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-12 text-center cursor-pointer hover:border-pink-500 dark:hover:border-pink-500 transition-colors"
                    >
                        <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                        <p className="text-lg font-medium mb-2">이미지 업로드</p>
                        <p className="text-sm text-muted-foreground">
                            클릭하여 이미지를 선택하거나 드래그 앤 드롭
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                            JPG, PNG, GIF 지원
                        </p>
                    </div>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                    />
                </div>
            </div>

            {/* Image Preview */}
            {imageUrl && (
                <div className="card p-6">
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                        <ImageIcon className="w-5 h-5" />
                        업로드된 이미지
                    </h3>
                    <div className="flex justify-center">
                        <img
                            ref={imageRef}
                            src={imageUrl}
                            alt="Uploaded"
                            crossOrigin="anonymous"
                            onLoad={handleImageLoad}
                            className="max-w-full max-h-96 rounded-lg shadow-lg"
                        />
                    </div>
                </div>
            )}

            {/* Color Palette */}
            {colors.length > 0 && (
                <div className="space-y-6">
                    <div className="card p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-lg">추출된 색상 팔레트</h3>
                            <div className="flex gap-2">
                                <button
                                    onClick={exportAsCSS}
                                    className="btn btn-ghost text-sm flex items-center gap-2"
                                >
                                    <Download className="w-4 h-4" />
                                    CSS
                                </button>
                                <button
                                    onClick={exportAsJSON}
                                    className="btn btn-ghost text-sm flex items-center gap-2"
                                >
                                    <Download className="w-4 h-4" />
                                    JSON
                                </button>
                            </div>
                        </div>

                        {/* Color Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                            {colors.map((color, index) => (
                                <div
                                    key={index}
                                    className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow"
                                >
                                    <div
                                        className="h-32 w-full"
                                        style={{ backgroundColor: color.hex }}
                                    />
                                    <div className="p-3 bg-white dark:bg-gray-800 space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-mono font-bold">{color.hex.toUpperCase()}</span>
                                            <button
                                                onClick={() => copyToClipboard(color.hex, `hex-${index}`)}
                                                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                                            >
                                                {copiedIndex === `hex-${index}` ? (
                                                    <Check className="w-4 h-4 text-green-500" />
                                                ) : (
                                                    <Copy className="w-4 h-4" />
                                                )}
                                            </button>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-mono text-muted-foreground">{color.rgb}</span>
                                            <button
                                                onClick={() => copyToClipboard(color.rgb, `rgb-${index}`)}
                                                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                                            >
                                                {copiedIndex === `rgb-${index}` ? (
                                                    <Check className="w-4 h-4 text-green-500" />
                                                ) : (
                                                    <Copy className="w-4 h-4" />
                                                )}
                                            </button>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-mono text-muted-foreground">{color.hsl}</span>
                                            <button
                                                onClick={() => copyToClipboard(color.hsl, `hsl-${index}`)}
                                                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                                            >
                                                {copiedIndex === `hsl-${index}` ? (
                                                    <Check className="w-4 h-4 text-green-500" />
                                                ) : (
                                                    <Copy className="w-4 h-4" />
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Color Bar */}
                        <div className="h-16 rounded-lg overflow-hidden flex shadow-lg">
                            {colors.map((color, index) => (
                                <div
                                    key={index}
                                    className="flex-1"
                                    style={{ backgroundColor: color.hex }}
                                    title={color.hex}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Info */}
            <div className="bg-muted/30 rounded-xl p-6 space-y-2 text-sm">
                <h3 className="font-bold text-base">💡 사용 방법</h3>
                <ul className="space-y-1 text-muted-foreground list-disc list-inside">
                    <li>이미지를 업로드하면 자동으로 8가지 주요 색상을 추출합니다</li>
                    <li>각 색상의 HEX, RGB, HSL 코드를 클릭하여 복사할 수 있습니다</li>
                    <li>CSS 또는 JSON 파일로 팔레트를 내보낼 수 있습니다</li>
                    <li>디자인 작업, 웹 개발, 브랜딩 등에 활용하세요</li>
                </ul>
            </div>

            <ShareButtons
                title="색상 추출기"
                description="이미지에서 색상 팔레트를 자동으로 추출하세요!"
            />
        </div>
    );
};

export default ColorExtractor;
