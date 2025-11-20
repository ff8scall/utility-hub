import { Solar, Lunar } from 'lunar-javascript';

try {
    const solar = Solar.fromYmdHms(2023, 11, 20, 14, 30, 0);
    const lunar = solar.getLunar();
    const ec = lunar.getEightChar();

    console.log('Year Gan:', ec.getYearGan());
    console.log('Type of Year Gan:', typeof ec.getYearGan());

    // If it's an object, try to see its prototype or properties
    if (typeof ec.getYearGan() === 'object') {
        console.log('Year Gan keys:', Object.keys(ec.getYearGan()));
        // Check if it has toString
        console.log('Year Gan toString:', ec.getYearGan().toString());
    }

    console.log('Year Zhi:', ec.getYearZhi());

    // Check WuXing
    // If getYearGan returns a string, it won't have getWuXing method.
    // Maybe we need to create a Gan object from the string?
    // Or maybe ec.getYearGan() returns a Gan object but I used the wrong method name?

} catch (e) {
    console.error('Error:', e);
}
