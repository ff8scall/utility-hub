
export const zodiacSigns = [
    { id: 'aries', name: '양자리', date: '3.21 ~ 4.19', emoji: '♈', element: '불', planet: '화성' },
    { id: 'taurus', name: '황소자리', date: '4.20 ~ 5.20', emoji: '♉', element: '땅', planet: '금성' },
    { id: 'gemini', name: '쌍둥이자리', date: '5.21 ~ 6.21', emoji: '♊', element: '바람', planet: '수성' },
    { id: 'cancer', name: '게자리', date: '6.22 ~ 7.22', emoji: '♋', element: '물', planet: '달' },
    { id: 'leo', name: '사자자리', date: '7.23 ~ 8.22', emoji: '♌', element: '불', planet: '태양' },
    { id: 'virgo', name: '처녀자리', date: '8.23 ~ 9.23', emoji: '♍', element: '땅', planet: '수성' },
    { id: 'libra', name: '천칭자리', date: '9.24 ~ 10.22', emoji: '♎', element: '바람', planet: '금성' },
    { id: 'scorpio', name: '전갈자리', date: '10.23 ~ 11.22', emoji: '♏', element: '물', planet: '명왕성' },
    { id: 'sagittarius', name: '사수자리', date: '11.23 ~ 12.24', emoji: '♐', element: '불', planet: '목성' },
    { id: 'capricorn', name: '염소자리', date: '12.25 ~ 1.19', emoji: '♑', element: '땅', planet: '토성' },
    { id: 'aquarius', name: '물병자리', date: '1.20 ~ 2.18', emoji: '♒', element: '바람', planet: '천왕성' },
    { id: 'pisces', name: '물고기자리', date: '2.19 ~ 3.20', emoji: '♓', element: '물', planet: '해왕성' }
];

export const zodiacPersonality = {
    aries: {
        keywords: ['열정', '도전', '솔직', '성급'],
        desc: '양자리는 12별자리의 시작으로, 넘치는 에너지와 개척 정신을 가지고 있습니다. 솔직하고 직설적이며, 원하는 것을 얻기 위해 물불 가리지 않는 열정이 있습니다. 리더십이 뛰어나지만 때로는 성급함이 실수를 부를 수 있습니다.',
        strengths: '용기, 결단력, 자신감, 열정',
        weaknesses: '참을성 부족, 다혈질, 충동적'
    },
    taurus: {
        keywords: ['신중', '안정', '끈기', '고집'],
        desc: '황소자리는 평화와 안정을 사랑하며, 신중하고 끈기 있게 목표를 향해 나아갑니다. 미적 감각이 뛰어나고 맛있는 음식과 좋은 물건을 즐길 줄 압니다. 변화를 싫어하고 고집이 센 편이지만, 한번 마음먹은 일은 끝까지 해내는 책임감이 있습니다.',
        strengths: '신뢰감, 인내심, 현실적, 헌신적',
        weaknesses: '고집불통, 소유욕, 변화 거부'
    },
    gemini: {
        keywords: ['호기심', '재치', '변덕', '소통'],
        desc: '쌍둥이자리는 호기심이 많고 재치가 넘치며, 누구와도 잘 어울리는 사교성을 가졌습니다. 정보 습득 능력이 뛰어나고 언변이 좋지만, 싫증을 잘 내고 변덕스러운 면이 있습니다. 두 가지 일을 동시에 처리하는 멀티태스킹 능력이 뛰어납니다.',
        strengths: '적응력, 학습 능력, 유머 감각',
        weaknesses: '산만함, 우유부단, 끈기 부족'
    },
    cancer: {
        keywords: ['감성', '모성애', '방어', '공감'],
        desc: '게자리는 감수성이 풍부하고 공감 능력이 뛰어나며, 가족과 친구를 끔찍이 아낍니다. 보호 본능이 강해 내 사람을 지키려는 의지가 강하지만, 상처를 잘 받고 감정 기복이 심할 수 있습니다. 따뜻하고 배려심 깊은 성격입니다.',
        strengths: '상상력, 충성심, 설득력, 보호본능',
        weaknesses: '예민함, 비관적, 감정 기복'
    },
    leo: {
        keywords: ['자신감', '리더십', '화려', '자존심'],
        desc: '사자자리는 태양처럼 밝고 뜨거운 에너지를 가졌으며, 언제 어디서나 주목받기를 좋아합니다. 자신감이 넘치고 리더십이 뛰어나지만, 자존심이 세고 독단적인 면이 있을 수 있습니다. 관대하고 열정적인 성격으로 주변에 사람이 많습니다.',
        strengths: '창의력, 열정, 관대함, 유머',
        weaknesses: '오만함, 고집, 자기중심적'
    },
    virgo: {
        keywords: ['완벽', '분석', '섬세', '비판'],
        desc: '처녀자리는 섬세하고 분석적이며, 완벽을 추구하는 성향이 있습니다. 현실적이고 실용적이며, 남을 돕는 것을 좋아합니다. 하지만 지나치게 꼼꼼하여 자신과 타인에게 엄격할 수 있습니다. 깔끔하고 정리 정돈을 잘합니다.',
        strengths: '충성심, 분석력, 친절함, 근면함',
        weaknesses: '수줍음, 걱정, 지나친 비판'
    },
    libra: {
        keywords: ['조화', '균형', '사교', '우유부단'],
        desc: '천칭자리는 조화와 균형을 중요시하며, 평화주의자입니다. 사교적이고 매너가 좋아 인기가 많으며, 아름다운 것을 사랑합니다. 하지만 결정을 내리는 데 시간이 오래 걸리고, 갈등을 피하려다 우유부단해질 수 있습니다.',
        strengths: '협동심, 공정함, 사교성',
        weaknesses: '우유부단, 갈등 회피, 의존적'
    },
    scorpio: {
        keywords: ['신비', '통찰', '질투', '집념'],
        desc: '전갈자리는 신비롭고 강렬한 매력을 가졌으며, 통찰력이 뛰어납니다. 겉으로는 차가워 보일 수 있지만 내면에는 뜨거운 열정을 품고 있습니다. 질투심과 소유욕이 강하지만, 한번 신뢰한 사람에게는 끝까지 의리를 지킵니다.',
        strengths: '용기, 열정, 끈기, 통찰력',
        weaknesses: '질투, 비밀스러움, 복수심'
    },
    sagittarius: {
        keywords: ['자유', '모험', '낙천', '직설'],
        desc: '사수자리는 자유로운 영혼의 소유자로, 모험과 여행을 사랑합니다. 낙천적이고 긍정적이며, 철학적인 사고를 즐깁니다. 구속받는 것을 싫어하고 직설적인 화법을 쓰지만, 뒤끝이 없고 시원시원한 성격입니다.',
        strengths: '관대함, 이상주의, 유머 감각',
        weaknesses: '약속 불이행, 참을성 부족, 무뚝뚝함'
    },
    capricorn: {
        keywords: ['성실', '책임', '야망', '보수'],
        desc: '염소자리는 성실하고 책임감이 강하며, 목표를 향해 꾸준히 노력하는 대기만성형입니다. 현실적이고 보수적이며, 규칙과 질서를 중요시합니다. 겉으로는 딱딱해 보일 수 있지만, 내면은 따뜻하고 유머 감각도 있습니다.',
        strengths: '책임감, 자제력, 관리 능력',
        weaknesses: '비관적, 용서 부족, 권위적'
    },
    aquarius: {
        keywords: ['독창', '개성', '박애', '반항'],
        desc: '물병자리는 독창적이고 개성이 넘치며, 남들과 다른 시각으로 세상을 바라봅니다. 자유와 평등을 중요시하고, 친구를 좋아합니다. 때로는 엉뚱하고 반항적으로 보일 수 있지만, 인류애가 넘치는 휴머니스트입니다.',
        strengths: '진보적, 독창적, 독립적, 인도주의',
        weaknesses: '감정 표현 서툶, 타협 거부, 냉담함'
    },
    pisces: {
        keywords: ['공감', '예술', '몽상', '희생'],
        desc: '물고기자리는 감수성이 풍부하고 상상력이 뛰어나며, 예술적인 재능이 있습니다. 동정심이 많아 남을 잘 도와주지만, 현실 감각이 부족하고 분위기에 잘 휩쓸릴 수 있습니다. 낭만적이고 부드러운 성격입니다.',
        strengths: '자비로움, 예술적, 직관력, 온화함',
        weaknesses: '현실 도피, 과신, 우울감'
    }
};

export const compatibilityData = {
    best: {
        aries: ['leo', 'sagittarius'],
        taurus: ['virgo', 'capricorn'],
        gemini: ['libra', 'aquarius'],
        cancer: ['scorpio', 'pisces'],
        leo: ['aries', 'sagittarius'],
        virgo: ['taurus', 'capricorn'],
        libra: ['gemini', 'aquarius'],
        scorpio: ['cancer', 'pisces'],
        sagittarius: ['aries', 'leo'],
        capricorn: ['taurus', 'virgo'],
        aquarius: ['gemini', 'libra'],
        pisces: ['cancer', 'scorpio']
    },
    good: {
        aries: ['gemini', 'aquarius'],
        taurus: ['cancer', 'pisces'],
        gemini: ['aries', 'leo'],
        cancer: ['taurus', 'virgo'],
        leo: ['gemini', 'libra'],
        virgo: ['cancer', 'scorpio'],
        libra: ['leo', 'sagittarius'],
        scorpio: ['virgo', 'capricorn'],
        sagittarius: ['libra', 'aquarius'],
        capricorn: ['scorpio', 'pisces'],
        aquarius: ['aries', 'sagittarius'],
        pisces: ['taurus', 'capricorn']
    },
    bad: {
        aries: ['cancer', 'capricorn'],
        taurus: ['leo', 'aquarius'],
        gemini: ['virgo', 'pisces'],
        cancer: ['aries', 'libra'],
        leo: ['taurus', 'scorpio'],
        virgo: ['gemini', 'sagittarius'],
        libra: ['cancer', 'capricorn'],
        scorpio: ['leo', 'aquarius'],
        sagittarius: ['virgo', 'pisces'],
        capricorn: ['aries', 'libra'],
        aquarius: ['taurus', 'scorpio'],
        pisces: ['gemini', 'sagittarius']
    }
};

export const fortuneMessages = {
    high: [
        "최고의 하루입니다! 무엇을 해도 잘 풀리는 날이니 자신감을 가지세요.",
        "행운의 여신이 당신의 편입니다. 오랫동안 바라던 일이 이루어질 수 있습니다.",
        "에너지가 넘치고 긍정적인 기운이 가득합니다. 새로운 도전을 시작하기에 완벽한 날입니다.",
        "주변 사람들에게 인정받고 칭찬받는 날입니다. 당신의 능력을 마음껏 발휘하세요.",
        "뜻밖의 횡재수가 있습니다. 기분 좋은 소식이 들려올 것입니다."
    ],
    medium: [
        "무난하고 평온한 하루입니다. 일상의 소소한 행복을 즐겨보세요.",
        "노력한 만큼의 대가가 따르는 날입니다. 성실함이 빛을 발할 것입니다.",
        "작은 어려움이 있을 수 있지만, 충분히 극복할 수 있습니다. 긍정적인 마음을 유지하세요.",
        "새로운 변화보다는 안정을 추구하는 것이 좋습니다. 차분하게 하루를 보내세요.",
        "친구와의 만남이나 가벼운 산책이 기분 전환에 도움이 될 것입니다."
    ],
    low: [
        "조금 지치고 힘든 하루가 될 수 있습니다. 무리하지 말고 휴식을 취하세요.",
        "예상치 못한 변수가 생길 수 있으니, 계획을 여유롭게 잡는 것이 좋습니다.",
        "말과 행동에 신중해야 합니다. 사소한 오해가 다툼으로 번질 수 있습니다.",
        "건강 관리에 유의하세요. 스트레스를 받지 않도록 마인드 컨트롤이 필요합니다.",
        "오늘은 중요한 결정을 미루는 것이 좋습니다. 차분하게 상황을 지켜보세요."
    ]
};
