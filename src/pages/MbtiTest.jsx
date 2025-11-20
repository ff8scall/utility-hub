import React, { useState } from 'react';
import { Brain, ArrowRight, RotateCcw } from 'lucide-react';
import SEO from '../components/SEO';

const MbtiTest = () => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({});
    const [result, setResult] = useState(null);

    const questions = [
        // E vs I (외향 vs 내향)
        {
            id: 'ei1',
            question: '주말에 친구들과 모임이 있다면?',
            options: [
                { value: 'E', text: '기대되고 신난다! 사람들과 어울리는 게 좋다' },
                { value: 'I', text: '가끔은 좋지만, 혼자만의 시간도 필요하다' }
            ]
        },
        {
            id: 'ei2',
            question: '처음 만난 사람들과 대화할 때',
            options: [
                { value: 'E', text: '먼저 말을 걸고 적극적으로 대화한다' },
                { value: 'I', text: '상대방이 말을 걸 때까지 기다리는 편이다' }
            ]
        },
        {
            id: 'ei3',
            question: '에너지를 충전하는 방법은?',
            options: [
                { value: 'E', text: '친구들과 만나서 수다 떨기' },
                { value: 'I', text: '집에서 혼자 조용히 쉬기' }
            ]
        },
        // S vs N (감각 vs 직관)
        {
            id: 'sn1',
            question: '새로운 일을 배울 때',
            options: [
                { value: 'S', text: '구체적인 예시와 단계별 설명이 필요하다' },
                { value: 'N', text: '전체적인 개념과 원리를 먼저 이해하고 싶다' }
            ]
        },
        {
            id: 'sn2',
            question: '대화할 때 나는',
            options: [
                { value: 'S', text: '실제 경험과 구체적인 사실을 중요하게 생각한다' },
                { value: 'N', text: '가능성과 미래에 대한 상상을 즐긴다' }
            ]
        },
        {
            id: 'sn3',
            question: '문제를 해결할 때',
            options: [
                { value: 'S', text: '검증된 방법과 경험을 활용한다' },
                { value: 'N', text: '새로운 방법과 창의적인 해결책을 찾는다' }
            ]
        },
        // T vs F (사고 vs 감정)
        {
            id: 'tf1',
            question: '친구가 고민 상담을 할 때',
            options: [
                { value: 'T', text: '논리적으로 분석하고 해결책을 제시한다' },
                { value: 'F', text: '공감하고 위로하며 감정을 이해해준다' }
            ]
        },
        {
            id: 'tf2',
            question: '중요한 결정을 내릴 때',
            options: [
                { value: 'T', text: '객관적인 사실과 논리를 우선시한다' },
                { value: 'F', text: '사람들의 감정과 관계를 고려한다' }
            ]
        },
        {
            id: 'tf3',
            question: '비판을 받았을 때',
            options: [
                { value: 'T', text: '내용이 타당한지 분석한다' },
                { value: 'F', text: '감정적으로 상처받는다' }
            ]
        },
        // J vs P (판단 vs 인식)
        {
            id: 'jp1',
            question: '여행 계획을 세울 때',
            options: [
                { value: 'J', text: '상세한 일정표를 만들고 계획대로 움직인다' },
                { value: 'P', text: '대략적인 계획만 세우고 즉흥적으로 즐긴다' }
            ]
        },
        {
            id: 'jp2',
            question: '과제나 업무 마감일이 있을 때',
            options: [
                { value: 'J', text: '미리미리 준비해서 여유있게 끝낸다' },
                { value: 'P', text: '마감 직전에 집중해서 끝낸다' }
            ]
        },
        {
            id: 'jp3',
            question: '일상생활에서 나는',
            options: [
                { value: 'J', text: '계획적이고 체계적으로 생활한다' },
                { value: 'P', text: '유연하고 자유롭게 생활한다' }
            ]
        }
    ];

    const mbtiDescriptions = {
        'INTJ': {
            title: '전략가',
            subtitle: '상상력이 풍부한 전략가',
            traits: ['독립적', '분석적', '전략적', '완벽주의'],
            strengths: '복잡한 문제를 논리적으로 해결하고, 장기적인 비전을 가지고 계획을 실행합니다.',
            weaknesses: '감정 표현이 서툴고, 지나치게 비판적일 수 있습니다.',
            careers: '과학자, 엔지니어, 전략 기획자, 연구원',
            famous: '일론 머스크, 마크 저커버그'
        },
        'INTP': {
            title: '논리술사',
            subtitle: '혁신적인 발명가',
            traits: ['논리적', '호기심', '독창적', '객관적'],
            strengths: '복잡한 이론을 이해하고 새로운 아이디어를 창출합니다.',
            weaknesses: '실용성이 부족하고, 감정 표현에 서툽니다.',
            careers: '프로그래머, 수학자, 철학자, 과학자',
            famous: '알버트 아인슈타인, 빌 게이츠'
        },
        'ENTJ': {
            title: '통솔자',
            subtitle: '대담한 지도자',
            traits: ['리더십', '결단력', '효율적', '자신감'],
            strengths: '목표를 설정하고 사람들을 이끌어 성과를 달성합니다.',
            weaknesses: '타인의 감정을 간과하고, 지나치게 강압적일 수 있습니다.',
            careers: 'CEO, 변호사, 경영 컨설턴트, 정치인',
            famous: '스티브 잡스, 마거릿 대처'
        },
        'ENTP': {
            title: '변론가',
            subtitle: '똑똑한 악마의 대변인',
            traits: ['창의적', '논쟁적', '열정적', '독창적'],
            strengths: '새로운 아이디어를 제시하고 토론을 즐깁니다.',
            weaknesses: '일관성이 부족하고, 논쟁을 즐겨 갈등을 일으킬 수 있습니다.',
            careers: '기업가, 마케터, 변호사, 발명가',
            famous: '토마스 에디슨, 마크 트웨인'
        },
        'INFJ': {
            title: '옹호자',
            subtitle: '선의의 옹호자',
            traits: ['이상주의', '통찰력', '헌신적', '공감능력'],
            strengths: '깊은 통찰력으로 사람들을 이해하고 돕습니다.',
            weaknesses: '완벽주의 성향으로 스트레스를 받고, 번아웃에 취약합니다.',
            careers: '상담사, 작가, 교사, 사회운동가',
            famous: '마더 테레사, 넬슨 만델라'
        },
        'INFP': {
            title: '중재자',
            subtitle: '이상주의적 중재자',
            traits: ['이상주의', '창의적', '공감적', '개방적'],
            strengths: '예술적 감각이 뛰어나고 타인을 깊이 이해합니다.',
            weaknesses: '현실적이지 못하고, 비판에 민감합니다.',
            careers: '작가, 예술가, 심리학자, 상담사',
            famous: '윌리엄 셰익스피어, J.R.R. 톨킨'
        },
        'ENFJ': {
            title: '선도자',
            subtitle: '카리스마 넘치는 지도자',
            traits: ['카리스마', '이타적', '설득력', '공감능력'],
            strengths: '사람들에게 영감을 주고 긍정적인 변화를 이끕니다.',
            weaknesses: '타인의 문제를 지나치게 떠안고, 자신을 소홀히 합니다.',
            careers: '교사, 코치, 정치인, HR 전문가',
            famous: '오프라 윈프리, 버락 오바마'
        },
        'ENFP': {
            title: '활동가',
            subtitle: '열정적인 활동가',
            traits: ['열정적', '창의적', '사교적', '자유로운'],
            strengths: '새로운 가능성을 발견하고 사람들과 쉽게 친해집니다.',
            weaknesses: '집중력이 부족하고, 계획을 끝까지 실행하지 못합니다.',
            careers: '마케터, 배우, 상담사, 기획자',
            famous: 'BTS RM, 로빈 윌리엄스'
        },
        'ISTJ': {
            title: '현실주의자',
            subtitle: '실용적인 현실주의자',
            traits: ['책임감', '체계적', '신뢰성', '실용적'],
            strengths: '규칙을 준수하고 맡은 일을 완벽하게 수행합니다.',
            weaknesses: '변화에 저항하고, 융통성이 부족합니다.',
            careers: '회계사, 공무원, 군인, 관리자',
            famous: '조지 워싱턴, 워런 버핏'
        },
        'ISFJ': {
            title: '수호자',
            subtitle: '헌신적인 수호자',
            traits: ['헌신적', '세심함', '책임감', '배려심'],
            strengths: '타인을 돌보고 안정적인 환경을 만듭니다.',
            weaknesses: '자신의 필요를 무시하고, 변화를 두려워합니다.',
            careers: '간호사, 교사, 사서, 행정직',
            famous: '마더 테레사, 케이트 미들턴'
        },
        'ESTJ': {
            title: '경영자',
            subtitle: '엄격한 관리자',
            traits: ['조직력', '실용적', '결단력', '전통적'],
            strengths: '효율적으로 조직을 관리하고 목표를 달성합니다.',
            weaknesses: '융통성이 부족하고, 감정을 간과합니다.',
            careers: '경영자, 판사, 군인, 경찰',
            famous: '미셸 오바마, 헨리 포드'
        },
        'ESFJ': {
            title: '집정관',
            subtitle: '사교적인 외교관',
            traits: ['사교적', '협조적', '책임감', '배려심'],
            strengths: '사람들과 잘 어울리고 조화로운 환경을 만듭니다.',
            weaknesses: '비판에 민감하고, 타인의 인정에 의존합니다.',
            careers: '간호사, 교사, 이벤트 기획자, 영업',
            famous: '테일러 스위프트, 빌 클린턴'
        },
        'ISTP': {
            title: '장인',
            subtitle: '대담한 실험가',
            traits: ['실용적', '독립적', '논리적', '유연함'],
            strengths: '문제를 빠르게 해결하고 손재주가 뛰어납니다.',
            weaknesses: '감정 표현이 서툴고, 장기 계획이 부족합니다.',
            careers: '엔지니어, 정비사, 운동선수, 소방관',
            famous: '클린트 이스트우드, 마이클 조던'
        },
        'ISFP': {
            title: '모험가',
            subtitle: '호기심 많은 예술가',
            traits: ['예술적', '유연함', '친절함', '개방적'],
            strengths: '예술적 감각이 뛰어나고 현재를 즐깁니다.',
            weaknesses: '계획성이 부족하고, 스트레스에 약합니다.',
            careers: '예술가, 디자이너, 음악가, 요리사',
            famous: '마이클 잭슨, 프리다 칼로'
        },
        'ESTP': {
            title: '사업가',
            subtitle: '모험을 즐기는 사업가',
            traits: ['활동적', '대담함', '실용적', '사교적'],
            strengths: '위기 상황에서 빠르게 대처하고 행동합니다.',
            weaknesses: '장기 계획이 부족하고, 충동적입니다.',
            careers: '영업, 기업가, 운동선수, 응급구조사',
            famous: '도널드 트럼프, 어니스트 헤밍웨이'
        },
        'ESFP': {
            title: '연예인',
            subtitle: '자유로운 영혼의 연예인',
            traits: ['사교적', '열정적', '즉흥적', '낙천적'],
            strengths: '사람들을 즐겁게 하고 분위기를 띄웁니다.',
            weaknesses: '계획성이 부족하고, 장기적 목표가 없습니다.',
            careers: '연예인, 이벤트 기획자, 영업, 여행 가이드',
            famous: '마릴린 먼로, 엘튼 존'
        }
    };

    const handleAnswer = (value) => {
        const newAnswers = { ...answers, [questions[currentQuestion].id]: value };
        setAnswers(newAnswers);

        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        } else {
            calculateResult(newAnswers);
        }
    };

    const calculateResult = (finalAnswers) => {
        const scores = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };

        Object.values(finalAnswers).forEach(answer => {
            scores[answer]++;
        });

        const mbti =
            (scores.E >= scores.I ? 'E' : 'I') +
            (scores.S >= scores.N ? 'S' : 'N') +
            (scores.T >= scores.F ? 'T' : 'F') +
            (scores.J >= scores.P ? 'J' : 'P');

        setResult({ type: mbti, scores, ...mbtiDescriptions[mbti] });
    };

    const resetTest = () => {
        setCurrentQuestion(0);
        setAnswers({});
        setResult(null);
    };

    if (result) {
        return (
            <div className="max-w-4xl mx-auto space-y-6">
                <SEO
                    title={`MBTI 테스트 결과: ${result.type} - Utility Hub`}
                    description={`당신의 MBTI는 ${result.type} (${result.title})입니다. ${result.subtitle}`}
                    keywords="MBTI 테스트, 성격 유형, 심리 테스트, MBTI 결과"
                />

                <div className="text-center space-y-4">
                    <div className="inline-block px-6 py-2 bg-primary/10 rounded-full">
                        <span className="text-sm font-medium text-primary">테스트 완료!</span>
                    </div>
                    <h1 className="text-4xl font-bold">당신은 {result.type}형</h1>
                    <p className="text-2xl text-primary">{result.title}</p>
                    <p className="text-lg text-muted-foreground">{result.subtitle}</p>
                </div>

                {/* 성향 점수 */}
                <div className="bg-card border border-border rounded-xl p-6 space-y-4">
                    <h3 className="font-bold text-lg">성향 분석</h3>
                    <div className="space-y-3">
                        {[
                            { left: 'E (외향)', right: 'I (내향)', leftScore: result.scores.E, rightScore: result.scores.I },
                            { left: 'S (감각)', right: 'N (직관)', leftScore: result.scores.S, rightScore: result.scores.N },
                            { left: 'T (사고)', right: 'F (감정)', leftScore: result.scores.T, rightScore: result.scores.F },
                            { left: 'J (판단)', right: 'P (인식)', leftScore: result.scores.J, rightScore: result.scores.P }
                        ].map((item, idx) => {
                            const total = item.leftScore + item.rightScore;
                            const leftPercent = (item.leftScore / total) * 100;
                            return (
                                <div key={idx}>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span>{item.left}</span>
                                        <span>{item.right}</span>
                                    </div>
                                    <div className="h-3 bg-secondary rounded-full overflow-hidden flex">
                                        <div
                                            className="bg-primary transition-all"
                                            style={{ width: `${leftPercent}%` }}
                                        />
                                        <div
                                            className="bg-purple-500 transition-all"
                                            style={{ width: `${100 - leftPercent}%` }}
                                        />
                                    </div>
                                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                                        <span>{item.leftScore}점</span>
                                        <span>{item.rightScore}점</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* 주요 특징 */}
                <div className="bg-card border border-border rounded-xl p-6 space-y-4">
                    <h3 className="font-bold text-lg">주요 특징</h3>
                    <div className="flex flex-wrap gap-2">
                        {result.traits.map((trait, idx) => (
                            <span key={idx} className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">
                                {trait}
                            </span>
                        ))}
                    </div>
                </div>

                {/* 강점 & 약점 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-green-500/10 border border-green-500/50 rounded-xl p-6">
                        <h3 className="font-bold text-lg text-green-600 dark:text-green-400 mb-3">💪 강점</h3>
                        <p className="text-sm">{result.strengths}</p>
                    </div>
                    <div className="bg-orange-500/10 border border-orange-500/50 rounded-xl p-6">
                        <h3 className="font-bold text-lg text-orange-600 dark:text-orange-400 mb-3">⚠️ 약점</h3>
                        <p className="text-sm">{result.weaknesses}</p>
                    </div>
                </div>

                {/* 추천 직업 */}
                <div className="bg-card border border-border rounded-xl p-6 space-y-3">
                    <h3 className="font-bold text-lg">💼 추천 직업</h3>
                    <p className="text-muted-foreground">{result.careers}</p>
                </div>

                {/* 유명인 */}
                <div className="bg-card border border-border rounded-xl p-6 space-y-3">
                    <h3 className="font-bold text-lg">⭐ 같은 유형의 유명인</h3>
                    <p className="text-muted-foreground">{result.famous}</p>
                </div>

                <button
                    onClick={resetTest}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-secondary hover:bg-accent rounded-lg font-bold transition-colors"
                >
                    <RotateCcw className="w-5 h-5" />
                    다시 테스트하기
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <SEO
                title="MBTI 성격 유형 테스트 - Utility Hub"
                description="12문항으로 알아보는 나의 MBTI 성격 유형. 간단한 질문으로 16가지 성격 유형 중 나의 유형을 찾아보세요."
                keywords="MBTI 테스트, 성격 유형 테스트, 심리 테스트, MBTI 무료, 성격 검사"
            />

            <header className="text-center space-y-2">
                <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
                    <Brain className="w-8 h-8 text-primary" />
                    MBTI 성격 유형 테스트
                </h1>
                <p className="text-muted-foreground">
                    12개의 질문으로 알아보는 나의 성격 유형
                </p>
            </header>

            {/* Progress */}
            <div className="space-y-2">
                <div className="flex justify-between text-sm text-muted-foreground">
                    <span>질문 {currentQuestion + 1} / {questions.length}</span>
                    <span>{Math.round(((currentQuestion + 1) / questions.length) * 100)}%</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                        className="h-full bg-primary transition-all duration-300"
                        style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                    />
                </div>
            </div>

            {/* Question */}
            <div className="bg-card border border-border rounded-xl p-8 space-y-6">
                <h2 className="text-xl font-bold text-center">
                    {questions[currentQuestion].question}
                </h2>

                <div className="space-y-3">
                    {questions[currentQuestion].options.map((option, idx) => (
                        <button
                            key={idx}
                            onClick={() => handleAnswer(option.value)}
                            className="w-full p-5 text-left bg-secondary hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:border-blue-500 border-2 border-transparent rounded-lg transition-all duration-200 group relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <div className="flex items-center justify-between relative z-10">
                                <span className="font-medium group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{option.text}</span>
                                <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-blue-500" />
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Educational Content */}
            <div className="space-y-6">
                {/* MBTI란? */}
                <div className="bg-muted/30 rounded-xl p-6">
                    <h3 className="font-bold text-lg mb-4">🧠 MBTI란?</h3>
                    <div className="space-y-3 text-sm text-muted-foreground">
                        <p>
                            <strong className="text-foreground">MBTI (Myers-Briggs Type Indicator)</strong>는
                            칼 융의 심리 유형론을 바탕으로 개발된 성격 유형 검사입니다.
                            사람의 성격을 4가지 척도로 나누어 총 16가지 유형으로 분류합니다.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                            <div className="bg-background border border-border rounded-lg p-3">
                                <p className="font-bold text-primary mb-1">⚡ 에너지 방향</p>
                                <div className="flex justify-between text-xs">
                                    <span><strong className="text-foreground">E</strong> (외향)</span>
                                    <span>vs</span>
                                    <span><strong className="text-foreground">I</strong> (내향)</span>
                                </div>
                                <p className="text-xs mt-1">사교적 활동 vs 내면의 생각</p>
                            </div>
                            <div className="bg-background border border-border rounded-lg p-3">
                                <p className="font-bold text-primary mb-1">👀 인식 기능</p>
                                <div className="flex justify-between text-xs">
                                    <span><strong className="text-foreground">S</strong> (감각)</span>
                                    <span>vs</span>
                                    <span><strong className="text-foreground">N</strong> (직관)</span>
                                </div>
                                <p className="text-xs mt-1">실제 경험 vs 미래 가능성</p>
                            </div>
                            <div className="bg-background border border-border rounded-lg p-3">
                                <p className="font-bold text-primary mb-1">⚖️ 판단 기능</p>
                                <div className="flex justify-between text-xs">
                                    <span><strong className="text-foreground">T</strong> (사고)</span>
                                    <span>vs</span>
                                    <span><strong className="text-foreground">F</strong> (감정)</span>
                                </div>
                                <p className="text-xs mt-1">논리적 사실 vs 사람과의 관계</p>
                            </div>
                            <div className="bg-background border border-border rounded-lg p-3">
                                <p className="font-bold text-primary mb-1">📅 생활 양식</p>
                                <div className="flex justify-between text-xs">
                                    <span><strong className="text-foreground">J</strong> (판단)</span>
                                    <span>vs</span>
                                    <span><strong className="text-foreground">P</strong> (인식)</span>
                                </div>
                                <p className="text-xs mt-1">계획과 체계 vs 자율과 융통성</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 테스트 방법 */}
                <div className="bg-muted/30 rounded-xl p-6">
                    <h3 className="font-bold text-lg mb-4">📝 테스트 방법</h3>
                    <div className="space-y-3 text-sm text-muted-foreground">
                        <div className="flex items-start gap-3">
                            <span className="text-2xl">1️⃣</span>
                            <div>
                                <p className="font-semibold text-foreground">솔직하게 답변하세요</p>
                                <p>이상적인 모습이 아닌, 현재의 편안한 자신의 모습을 선택하세요.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <span className="text-2xl">2️⃣</span>
                            <div>
                                <p className="font-semibold text-foreground">너무 오래 고민하지 마세요</p>
                                <p>질문을 읽고 가장 먼저 떠오르는 직관적인 답변이 정확할 확률이 높습니다.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <span className="text-2xl">3️⃣</span>
                            <div>
                                <p className="font-semibold text-foreground">중립적인 답변은 없습니다</p>
                                <p>두 가지 선택지 중 자신에게 조금이라도 더 가까운 쪽을 선택해야 합니다.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 결과 해석 */}
                <div className="bg-muted/30 rounded-xl p-6">
                    <h3 className="font-bold text-lg mb-4">📊 결과 해석</h3>
                    <div className="space-y-3 text-sm text-muted-foreground">
                        <p>
                            결과는 4가지 알파벳의 조합으로 나타납니다 (예: INTJ, ESFP).
                            각 유형은 고유한 강점과 약점, 선호하는 직업, 대인관계 스타일을 가지고 있습니다.
                        </p>
                        <div className="bg-background border border-border rounded-lg p-4">
                            <p className="font-semibold text-foreground mb-2">유형 그룹</p>
                            <ul className="space-y-1 list-disc list-inside ml-2">
                                <li><strong className="text-purple-600 dark:text-purple-400">분석가형</strong> (NT): 합리적이고 지적인 유형 (INTJ, INTP, ENTJ, ENTP)</li>
                                <li><strong className="text-green-600 dark:text-green-400">외교관형</strong> (NF): 공감하고 협력하는 유형 (INFJ, INFP, ENFJ, ENFP)</li>
                                <li><strong className="text-blue-600 dark:text-blue-400">관리자형</strong> (SJ): 현실적이고 헌신적인 유형 (ISTJ, ISFJ, ESTJ, ESFJ)</li>
                                <li><strong className="text-yellow-600 dark:text-yellow-400">탐험가형</strong> (SP): 대담하고 실용적인 유형 (ISTP, ISFP, ESTP, ESFP)</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* 주의사항 */}
                <div className="bg-yellow-500/10 border border-yellow-500/50 rounded-xl p-6">
                    <h3 className="font-bold text-lg mb-4 text-yellow-600 dark:text-yellow-400">⚠️ 참고사항</h3>
                    <div className="space-y-3 text-sm text-muted-foreground">
                        <p>
                            이 테스트는 정식 MBTI 검사의 약식 버전입니다.
                            자신의 성향을 파악하는 가벼운 참고용으로만 활용해주세요.
                            더 정확하고 상세한 분석을 원하신다면 전문가를 통한 정식 검사를 권장합니다.
                        </p>
                        <p>
                            또한, 성격 유형은 좋고 나쁨이 없으며, 환경이나 노력에 따라 변화할 수 있습니다.
                            결과에 너무 얽매이지 말고 자신의 강점을 발전시키는 도구로 활용하세요.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MbtiTest;
