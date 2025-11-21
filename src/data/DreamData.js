export const dreamData = [
    // 동물 (Animals)
    { id: 'snake', keyword: '뱀', category: 'animal', description: '뱀은 지혜, 재물, 또는 태몽을 상징합니다. 뱀이 집안으로 들어오면 재물이 들어오거나 귀한 손님이 올 징조입니다.', goodOrBad: 'good' },
    { id: 'dog', keyword: '개', category: 'animal', description: '개는 충성심과 대인관계를 의미합니다. 개가 짖거나 무는 꿈은 주변 사람과의 갈등을 암시할 수 있습니다.', goodOrBad: 'bad' },
    { id: 'cat', keyword: '고양이', category: 'animal', description: '고양이는 비밀, 도둑, 또는 까다로운 인연을 상징합니다. 고양이를 안는 꿈은 벅찬 일거리를 맡게 됨을 의미합니다.', goodOrBad: 'neutral' },
    { id: 'pig', keyword: '돼지', category: 'animal', description: '돼지는 재물과 복을 상징하는 대표적인 길몽입니다. 돼지를 잡거나 돼지가 집으로 들어오는 꿈은 큰 재물을 얻을 징조입니다.', goodOrBad: 'good' },
    { id: 'dragon', keyword: '용', category: 'animal', description: '용은 최고의 권위와 명예를 상징합니다. 용이 승천하는 꿈은 입신양명하고 큰 성공을 거둘 대길몽입니다.', goodOrBad: 'good' },
    { id: 'tiger', keyword: '호랑이', category: 'animal', description: '호랑이는 권력과 명예를 상징합니다. 호랑이를 타고 달리는 꿈은 권력을 잡거나 큰 세력을 얻게 됨을 의미합니다.', goodOrBad: 'good' },

    // 자연 (Nature)
    { id: 'fire', keyword: '불', category: 'nature', description: '불은 번창과 성공을 의미합니다. 집이 활활 타오르는 꿈은 사업이 크게 번창하고 재물이 들어올 징조입니다.', goodOrBad: 'good' },
    { id: 'water', keyword: '물', category: 'nature', description: '맑은 물은 재물과 안정을, 탁한 물은 근심과 질병을 의미합니다. 물이 집안으로 흘러들어오는 꿈은 재물이 생길 징조입니다.', goodOrBad: 'good' },
    { id: 'rain', keyword: '비', category: 'nature', description: '비는 은혜와 결실을 상징하지만, 폭우는 근심거리를 의미할 수도 있습니다. 시원하게 비를 맞는 꿈은 근심이 해소될 징조입니다.', goodOrBad: 'good' },
    { id: 'snow', keyword: '눈', category: 'nature', description: '눈은 순수함과 새로운 시작을 의미합니다. 함박눈이 내리는 꿈은 소원이 성취되고 재물이 들어올 징조입니다.', goodOrBad: 'good' },
    { id: 'mountain', keyword: '산', category: 'nature', description: '산은 목표와 성취를 상징합니다. 산 정상에 오르는 꿈은 바라던 목표를 달성하고 최고의 자리에 오를 징조입니다.', goodOrBad: 'good' },

    // 신체 (Body)
    { id: 'tooth', keyword: '이빨', category: 'body', description: '이빨은 가족이나 친척을 상징합니다. 이빨이 빠지는 꿈은 가족에게 우환이 생기거나 이별수가 있을 수 있음을 암시합니다.', goodOrBad: 'bad' },
    { id: 'blood', keyword: '피', category: 'body', description: '피는 생명력과 재물을 상징합니다. 피를 많이 흘리는 꿈은 재물운이 상승하고 소원이 이루어질 길몽입니다.', goodOrBad: 'good' },
    { id: 'hair', keyword: '머리카락', category: 'body', description: '머리카락은 근심과 걱정을 의미합니다. 머리카락을 자르는 꿈은 근심 걱정이 해소되고 새로운 마음으로 시작함을 의미합니다.', goodOrBad: 'good' },
    { id: 'hand', keyword: '손', category: 'body', description: '손은 협력자나 형제를 상징합니다. 손을 다치는 꿈은 형제나 가까운 사람에게 좋지 않은 일이 생길 수 있음을 암시합니다.', goodOrBad: 'bad' },

    // 행동 (Actions)
    { id: 'flying', keyword: '날다', category: 'action', description: '하늘을 나는 꿈은 신분 상승과 소원 성취를 의미합니다. 자유롭게 날아다니는 꿈은 하는 일이 순조롭게 풀릴 징조입니다.', goodOrBad: 'good' },
    { id: 'falling', keyword: '떨어지다', category: 'action', description: '높은 곳에서 떨어지는 꿈은 신분 하락이나 실패, 좌절을 암시합니다. 또는 키가 크려는 성장통일 수도 있습니다.', goodOrBad: 'bad' },
    { id: 'running', keyword: '달리다', category: 'action', description: '달리는 꿈은 목표를 향한 노력을 의미합니다. 쫓기듯 달리는 것은 심리적 압박감을, 상쾌하게 달리는 것은 일의 진척을 의미합니다.', goodOrBad: 'neutral' },
    { id: 'crying', keyword: '울다', category: 'action', description: '크게 우는 꿈은 억눌린 감정이 해소되고 기쁜 일이 생길 징조입니다. 시원하게 울수록 좋은 꿈입니다.', goodOrBad: 'good' },
    { id: 'laughing', keyword: '웃다', category: 'action', description: '크게 웃는 꿈은 근심 걱정이 사라지고 소원이 성취될 징조입니다. 하지만 비웃음을 당하는 꿈은 구설수에 오를 수 있습니다.', goodOrBad: 'neutral' },

    // 사물/기타 (Objects/Other)
    { id: 'money', keyword: '돈', category: 'object', description: '돈을 줍거나 받는 꿈은 실제로 재물이 들어오거나 일거리가 생길 징조입니다. 돈을 잃어버리는 꿈은 근심이 생길 수 있습니다.', goodOrBad: 'good' },
    { id: 'poop', keyword: '똥', category: 'object', description: '똥은 재물과 횡재수를 상징하는 대표적인 길몽입니다. 똥을 밟거나 뒤집어쓰는 꿈은 큰 재물이 들어올 대길몽입니다.', goodOrBad: 'good' },
    { id: 'shoes', keyword: '신발', category: 'object', description: '신발은 의지할 곳이나 협력자를 상징합니다. 신발을 잃어버리는 꿈은 협력자를 잃거나 직장을 잃을 수 있음을 암시합니다.', goodOrBad: 'bad' },
    { id: 'clothes', keyword: '옷', category: 'object', description: '새 옷을 입는 꿈은 신분 상승이나 취직, 승진을 의미합니다. 옷이 찢어지거나 더러워지는 꿈은 망신을 당할 수 있습니다.', goodOrBad: 'bad' },
    { id: 'car', keyword: '자동차', category: 'object', description: '자동차를 운전하는 꿈은 자신의 인생이나 사업을 주도적으로 이끌어감을 의미합니다. 사고가 나는 꿈은 일의 차질을 암시합니다.', goodOrBad: 'neutral' }
];

export const dreamCategories = [
    { id: 'all', label: '전체', icon: '✨' },
    { id: 'animal', label: '동물', icon: '🐯' },
    { id: 'nature', label: '자연', icon: '🌳' },
    { id: 'body', label: '신체', icon: '💪' },
    { id: 'action', label: '행동', icon: '🏃' },
    { id: 'object', label: '사물', icon: '🎁' }
];
