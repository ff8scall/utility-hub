import React, { useState } from 'react';
import { Solar, Lunar } from 'lunar-javascript';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Info } from 'lucide-react';

const SajuCalendar = ({ result, getWuXing, getHangul, getSipsin }) => {
    const today = new Date();
    const [currentYear, setCurrentYear] = useState(today.getFullYear());
    const [currentMonth, setCurrentMonth] = useState(today.getMonth() + 1);
    const [selectedDay, setSelectedDay] = useState(null);

    if (!result) return null;

    // 해당 월의 일수 계산
    const getDaysInMonth = (year, month) => {
        return new Date(year, month, 0).getDate();
    };

    // 해당 월의 첫 날이 무슨 요일인지 (0: 일요일)
    const getFirstDayOfMonth = (year, month) => {
        return new Date(year, month - 1, 1).getDay();
    };

    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

    // 달력 데이터 생성
    const calendarDays = [];
    for (let i = 0; i < firstDay; i++) {
        calendarDays.push(null); // 빈 칸
    }
    for (let day = 1; day <= daysInMonth; day++) {
        const solar = Solar.fromYmd(currentYear, currentMonth, day);
        const lunar = solar.getLunar();
        const eightChar = lunar.getEightChar();
        const dayGan = eightChar.getDayGan();
        const dayZhi = eightChar.getDayZhi();
        const dayGanWuXing = getWuXing(dayGan);
        const sipsin = getSipsin(result.dayMasterWuXing, dayGanWuXing);

        // 길흉 판단 (간단한 로직)
        const isGood = ['인성', '재성'].includes(sipsin);
        const isCaution = ['관성'].includes(sipsin);

        calendarDays.push({
            day,
            gan: dayGan,
            zhi: dayZhi,
            ganHangul: getHangul(dayGan),
            zhiHangul: getHangul(dayZhi),
            sipsin,
            isGood,
            isCaution,
            isToday: currentYear === today.getFullYear() &&
                currentMonth === today.getMonth() + 1 &&
                day === today.getDate()
        });
    }

    const handlePrevMonth = () => {
        if (currentMonth === 1) {
            setCurrentMonth(12);
            setCurrentYear(currentYear - 1);
        } else {
            setCurrentMonth(currentMonth - 1);
        }
        setSelectedDay(null);
    };

    const handleNextMonth = () => {
        if (currentMonth === 12) {
            setCurrentMonth(1);
            setCurrentYear(currentYear + 1);
        } else {
            setCurrentMonth(currentMonth + 1);
        }
        setSelectedDay(null);
    };

    const sipsinAnalysis = {
        '비겁': { color: 'bg-purple-100 dark:bg-purple-900/30', desc: '주변 사람들과의 관계가 중요한 날' },
        '식상': { color: 'bg-green-100 dark:bg-green-900/30', desc: '창의력과 표현력이 발휘되는 날' },
        '재성': { color: 'bg-blue-100 dark:bg-blue-900/30', desc: '재물운이 좋은 날' },
        '관성': { color: 'bg-orange-100 dark:bg-orange-900/30', desc: '책임감이 요구되는 날' },
        '인성': { color: 'bg-indigo-100 dark:bg-indigo-900/30', desc: '학업과 문서운이 좋은 날' }
    };

    return (
        <div className="space-y-6">
            {/* 설명 */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900/50 rounded-xl p-4">
                <div className="flex gap-3">
                    <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-900 dark:text-blue-100 space-y-1">
                        <p className="font-bold">운세 달력이란?</p>
                        <p>매일의 일진(日辰)을 확인하고, 나의 일간과의 관계를 통해 그날의 운세를 미리 파악할 수 있습니다. 중요한 일정을 계획할 때 참고하세요.</p>
                    </div>
                </div>
            </div>

            {/* 달력 헤더 */}
            <div className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                    <button
                        onClick={handlePrevMonth}
                        className="p-2 hover:bg-muted rounded-lg transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <h3 className="font-bold text-xl">
                        {currentYear}년 {currentMonth}월
                    </h3>
                    <button
                        onClick={handleNextMonth}
                        className="p-2 hover:bg-muted rounded-lg transition-colors"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>

                {/* 요일 헤더 */}
                <div className="grid grid-cols-7 gap-2 mb-2">
                    {['일', '월', '화', '수', '목', '금', '토'].map((day, idx) => (
                        <div
                            key={day}
                            className={`text-center text-sm font-bold py-2 ${idx === 0 ? 'text-red-600 dark:text-red-400' :
                                idx === 6 ? 'text-blue-600 dark:text-blue-400' :
                                    'text-muted-foreground'
                                }`}
                        >
                            {day}
                        </div>
                    ))}
                </div>

                {/* 달력 그리드 */}
                <div className="grid grid-cols-7 gap-2">
                    {calendarDays.map((dayData, idx) => {
                        if (!dayData) {
                            return <div key={`empty-${idx}`} className="aspect-square" />;
                        }

                        const bgColor = sipsinAnalysis[dayData.sipsin]?.color || 'bg-muted/30';

                        return (
                            <button
                                key={dayData.day}
                                onClick={() => setSelectedDay(dayData)}
                                className={`aspect-square p-2 rounded-lg border transition-all hover:scale-105 ${dayData.isToday
                                    ? 'border-primary border-2 shadow-md'
                                    : 'border-border'
                                    } ${bgColor} ${selectedDay?.day === dayData.day ? 'ring-2 ring-primary' : ''
                                    }`}
                            >
                                <div className="flex flex-col items-center justify-center h-full">
                                    <div className={`text-sm font-bold mb-1 ${dayData.isToday ? 'text-primary' : ''
                                        }`}>
                                        {dayData.day}
                                    </div>
                                    <div className="text-[10px] text-muted-foreground">
                                        {dayData.ganHangul}{dayData.zhiHangul}
                                    </div>
                                    {dayData.isGood && (
                                        <div className="text-[10px] text-green-600 dark:text-green-400">✓</div>
                                    )}
                                    {dayData.isCaution && (
                                        <div className="text-[10px] text-orange-600 dark:text-orange-400">!</div>
                                    )}
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* 범례 */}
                <div className="mt-6 pt-4 border-t border-border">
                    <div className="text-xs text-muted-foreground mb-2">범례</div>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-xs">
                        {Object.entries(sipsinAnalysis).map(([key, value]) => (
                            <div key={key} className="flex items-center gap-2">
                                <div className={`w-4 h-4 rounded ${value.color}`} />
                                <span>{key}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* 선택된 날짜 상세 정보 */}
            {selectedDay && (
                <div className="bg-gradient-to-br from-card to-muted/20 border border-border rounded-xl p-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                        <CalendarIcon className="w-5 h-5 text-primary" />
                        {currentYear}년 {currentMonth}월 {selectedDay.day}일 운세
                    </h3>

                    <div className="space-y-4">
                        <div className="bg-background/50 p-4 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-muted-foreground">일진(日辰)</span>
                                <span className="text-2xl font-bold">
                                    {selectedDay.ganHangul}{selectedDay.zhiHangul}
                                </span>
                            </div>
                            <div className="text-sm">
                                <span className="font-bold text-primary">{selectedDay.sipsin}</span>의 기운이 들어오는 날입니다.
                            </div>
                        </div>

                        <div className={`p-4 rounded-lg ${sipsinAnalysis[selectedDay.sipsin]?.color}`}>
                            <p className="text-sm">
                                {sipsinAnalysis[selectedDay.sipsin]?.desc}
                            </p>
                        </div>

                        {selectedDay.isGood && (
                            <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-200 dark:border-green-900/50">
                                <p className="text-sm text-green-700 dark:text-green-300">
                                    ✓ 좋은 날입니다. 중요한 일정을 잡기에 적합합니다.
                                </p>
                            </div>
                        )}

                        {selectedDay.isCaution && (
                            <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg border border-orange-200 dark:border-orange-900/50">
                                <p className="text-sm text-orange-700 dark:text-orange-300">
                                    ! 신중함이 필요한 날입니다. 중요한 결정은 한 번 더 생각해보세요.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SajuCalendar;
