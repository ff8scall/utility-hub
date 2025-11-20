import { Solar, Lunar, Gan, Zhi } from 'lunar-javascript';

try {
    const solar = Solar.fromYmdHms(2023, 11, 20, 14, 30, 0);
    const lunar = solar.getLunar();
    const ec = lunar.getEightChar();

    const yearGanStr = ec.getYearGan();
    console.log('Year Gan String:', yearGanStr);

    // Try to create Gan object
    try {
        const gan = Gan.fromName(yearGanStr);
        console.log('Gan Object created:', gan);
        console.log('Gan WuXing:', gan.getWuXing());
    } catch (e) {
        console.log('Gan.fromName failed:', e.message);
    }

    const yearZhiStr = ec.getYearZhi();
    console.log('Year Zhi String:', yearZhiStr);

    try {
        const zhi = Zhi.fromName(yearZhiStr);
        console.log('Zhi Object created:', zhi);
        console.log('Zhi WuXing:', zhi.getWuXing());
    } catch (e) {
        console.log('Zhi.fromName failed:', e.message);
    }

} catch (e) {
    console.error('Error:', e);
}
