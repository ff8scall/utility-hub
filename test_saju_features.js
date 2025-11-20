import LunarJS from 'lunar-javascript';
const { Lunar, Solar, EightChar, Yun } = LunarJS;

// 1. Setup a sample date (1995-05-05 12:00)
const solar = Solar.fromYmdHms(1995, 5, 5, 12, 0, 0);
const lunar = solar.getLunar();
const eightChar = lunar.getEightChar();

// 3. Check Daily Fortune Feasibility
try {
    const today = Solar.fromYmdHms(2024, 11, 20, 0, 0, 0);
    const todayLunar = today.getLunar();
    const todayEightChar = todayLunar.getEightChar();

    console.log('\n--- Daily Pillar (Iljin) ---');
    console.log('Today (2024-11-20):', todayEightChar.getDayGan() + todayEightChar.getDayZhi());

} catch (e) {
    console.log('Error checking Daily Fortune:', e.message);
}
