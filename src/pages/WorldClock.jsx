import React, { useState, useEffect } from 'react';
import SEO from '../components/SEO';
import { Globe, Clock } from 'lucide-react';
import ShareButtons from '../components/ShareButtons';

const WorldClock = () => {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const cities = [
        { name: '서울', timezone: 'Asia/Seoul', flag: '🇰🇷', offset: 9 },
        { name: '도쿄', timezone: 'Asia/Tokyo', flag: '🇯🇵', offset: 9 },
        { name: '베이징', timezone: 'Asia/Shanghai', flag: '🇨🇳', offset: 8 },
        { name: '홍콩', timezone: 'Asia/Hong_Kong', flag: '🇭🇰', offset: 8 },
        { name: '싱가포르', timezone: 'Asia/Singapore', flag: '🇸🇬', offset: 8 },
        { name: '방콕', timezone: 'Asia/Bangkok', flag: '🇹🇭', offset: 7 },
        { name: '뉴델리', timezone: 'Asia/Kolkata', flag: '🇮🇳', offset: 5.5 },
        { name: '두바이', timezone: 'Asia/Dubai', flag: '🇦🇪', offset: 4 },
        { name: '모스크바', timezone: 'Europe/Moscow', flag: '🇷🇺', offset: 3 },
        { name: '파리', timezone: 'Europe/Paris', flag: '🇫🇷', offset: 1 },
        { name: '런던', timezone: 'Europe/London', flag: '🇬🇧', offset: 0 },
        { name: '뉴욕', timezone: 'America/New_York', flag: '🇺🇸', offset: -5 },
        { name: 'LA', timezone: 'America/Los_Angeles', flag: '🇺🇸', offset: -8 },
        { name: '시드니', timezone: 'Australia/Sydney', flag: '🇦🇺', offset: 11 }
    ];

    const getTimeForCity = (timezone) => {
        return currentTime.toLocaleTimeString('ko-KR', {
            timeZone: timezone,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });
    };

    const getDateForCity = (timezone) => {
        return currentTime.toLocaleDateString('ko-KR', {
            timeZone: timezone,
            month: 'short',
            day: 'numeric',
            weekday: 'short'
        });
    };

    const getTimeDiff = (offset) => {
        const seoulOffset = 9;
        const diff = offset - seoulOffset;
        if (diff === 0) return '기준';
        return diff > 0 ? `+${diff}시간` : `${diff}시간`;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            <SEO
                title="세계 시계 - 전 세계 주요 도시 현재 시간"
                description="서울, 도쿄, 뉴욕, 런던, 파리 등 전 세계 주요 도시의 현재 시간을 실시간으로 확인하세요."
                keywords={['세계시계', '시간', '시차', 'world clock', 'timezone']}
                path="/world-clock"
            />

            <div className="container mx-auto px-4 py-8 max-w-6xl">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mb-4 shadow-lg">
                        <Globe className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                        세계 시계
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        전 세계 주요 도시의 현재 시간
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                    {cities.map((city) => (
                        <div
                            key={city.timezone}
                            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
                        >
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <span className="text-3xl">{city.flag}</span>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                        {city.name}
                                    </h3>
                                </div>
                                <span className="text-xs px-2 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 rounded-full">
                                    {getTimeDiff(city.offset)}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm mb-2">
                                <Clock className="w-4 h-4" />
                                <span>{getDateForCity(city.timezone)}</span>
                            </div>
                            <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 font-mono">
                                {getTimeForCity(city.timezone)}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-4">시차 정보</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <div>
                            <p className="mb-2">• 서울 기준으로 시차를 표시합니다</p>
                            <p className="mb-2">• 일광절약시간(DST)이 자동 반영됩니다</p>
                        </div>
                        <div>
                            <p className="mb-2">• 매초 자동으로 업데이트됩니다</p>
                            <p className="mb-2">• 날짜 변경선도 고려됩니다</p>
                        </div>
                    </div>
                </div>

                <div className="mt-8">
                    <ShareButtons />
                </div>
            </div>
        </div>
    );
};

export default WorldClock;
