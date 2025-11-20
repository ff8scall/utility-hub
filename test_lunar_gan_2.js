import LunarJS from 'lunar-javascript';
const { Solar, Lunar, Gan, Zhi } = LunarJS;

try {
    console.log('Gan available:', !!Gan);
    console.log('Zhi available:', !!Zhi);

    const solar = Solar.fromYmdHms(2023, 11, 20, 14, 30, 0);
    const lunar = solar.getLunar();
    const ec = lunar.getEightChar();

    const yearGanStr = ec.getYearGan();
    console.log('Year Gan String:', yearGanStr);

    if (Gan) {
        // Note: library might use different method names or structure
        // Checking if Gan has fromName or similar
        // Actually, looking at other libraries, sometimes it's Gan.byName
        // But let's try to inspect Gan object if it exists
        console.log('Gan keys:', Object.keys(Gan));
    }

} catch (e) {
    console.error('Error:', e);
}
