import React, { useState } from 'react';
import { Share2, MessageCircle, Facebook, Twitter, Link2, Check } from 'lucide-react';

const ShareButtons = ({ title, description, url }) => {
    const [copied, setCopied] = useState(false);

    // Use current page URL if not provided
    const shareUrl = url || window.location.href;
    const shareTitle = title || document.title;
    const shareDescription = description || '';

    // KakaoTalk Share
    const handleKakaoShare = () => {
        if (window.Kakao && window.Kakao.Link) {
            window.Kakao.Link.sendDefault({
                objectType: 'feed',
                content: {
                    title: shareTitle,
                    description: shareDescription,
                    imageUrl: 'https://ff8scall.github.io/utility-hub/og-image.png',
                    link: {
                        mobileWebUrl: shareUrl,
                        webUrl: shareUrl,
                    },
                },
                buttons: [
                    {
                        title: '자세히 보기',
                        link: {
                            mobileWebUrl: shareUrl,
                            webUrl: shareUrl,
                        },
                    },
                ],
            });
        } else {
            // Fallback: open in new window
            const kakaoUrl = `https://story.kakao.com/share?url=${encodeURIComponent(shareUrl)}`;
            window.open(kakaoUrl, '_blank', 'width=600,height=400');
        }
    };

    // Facebook Share
    const handleFacebookShare = () => {
        const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        window.open(facebookUrl, '_blank', 'width=600,height=400');
    };

    // Twitter Share
    const handleTwitterShare = () => {
        const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`;
        window.open(twitterUrl, '_blank', 'width=600,height=400');
    };

    // Copy Link
    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    return (
        <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-muted-foreground flex items-center gap-1">
                <Share2 className="w-4 h-4" />
                공유하기:
            </span>

            {/* KakaoTalk */}
            <button
                onClick={handleKakaoShare}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-400 hover:bg-yellow-500 text-gray-900 rounded-lg text-sm font-medium transition-colors"
                title="카카오톡으로 공유"
            >
                <MessageCircle className="w-4 h-4" />
                <span className="hidden sm:inline">카톡</span>
            </button>

            {/* Facebook */}
            <button
                onClick={handleFacebookShare}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                title="페이스북으로 공유"
            >
                <Facebook className="w-4 h-4" />
                <span className="hidden sm:inline">페북</span>
            </button>

            {/* Twitter */}
            <button
                onClick={handleTwitterShare}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-500 hover:bg-sky-600 text-white rounded-lg text-sm font-medium transition-colors"
                title="트위터로 공유"
            >
                <Twitter className="w-4 h-4" />
                <span className="hidden sm:inline">트위터</span>
            </button>

            {/* Copy Link */}
            <button
                onClick={handleCopyLink}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${copied
                        ? 'bg-green-600 text-white'
                        : 'bg-muted hover:bg-muted/80 text-foreground'
                    }`}
                title="링크 복사"
            >
                {copied ? (
                    <>
                        <Check className="w-4 h-4" />
                        <span className="hidden sm:inline">복사됨!</span>
                    </>
                ) : (
                    <>
                        <Link2 className="w-4 h-4" />
                        <span className="hidden sm:inline">링크</span>
                    </>
                )}
            </button>
        </div>
    );
};

export default ShareButtons;
