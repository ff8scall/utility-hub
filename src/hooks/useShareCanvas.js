import { useCallback } from 'react';
import { domToBlob } from 'modern-screenshot';

/**
 * Hook to capture an element (including canvas and HTML overlays) and share it
 * Fallback to downloading the image if sharing is not supported
 */
const useShareCanvas = () => {
    const shareCanvas = useCallback(async (element, title = '게임 결과', score = 0) => {
        if (!element) {
            console.error('Element not found');
            return;
        }

        try {
            // 1. Capture element using modern-screenshot for oklch compatibility and high quality
            const blob = await domToBlob(element, {
                scale: 2, // Double resolution for high quality
                backgroundColor: 'transparent',
                // modern-screenshot is generally better with modern CSS like oklch
            });

            if (!blob) throw new Error('Failed to create blob');

            const fileName = `game_result_${Date.now()}.png`;
            const file = new File([blob], fileName, { type: 'image/png' });

            // 2. Try to use Web Share API
            if (navigator.canShare && navigator.canShare({ files: [file] })) {
                await navigator.share({
                    files: [file],
                    title: title,
                    text: `[유틸리티 허브] ${title}에서 ${score}점을 기록했습니다! 여러분도 도전해보세요!`,
                    url: window.location.href
                });
            } else {
                // Fallback: Download
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = fileName;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);

                alert('공유 기능이 지원되지 않는 브라우저입니다. 이미지가 기기에 저장되었습니다.');
            }
        } catch (error) {
            if (error.name !== 'AbortError') {
                console.error('Error sharing game result:', error);
                alert('공유 중 오류가 발생했습니다. (최신 CSS 컬러 호환성 문제일 수 있습니다)');
            }
        }
    }, []);

    return { shareCanvas };
};

export default useShareCanvas;
