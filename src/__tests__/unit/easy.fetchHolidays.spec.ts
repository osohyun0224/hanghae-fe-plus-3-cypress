import { fetchHolidays } from '../../apis/fetchHolidays';

describe('fetchHolidays', () => {
  it('주어진 월의 공휴일만 반환한다', () => {
    const inputDates = new Date('2024-10-10');
    const holidays = fetchHolidays(inputDates);
    expect(Object.keys(holidays)).toHaveLength(2);
    expect(holidays['2024-10-03']).toBe('개천절');
    expect(holidays['2024-10-09']).toBe('한글날');
  });

  it('공휴일이 없는 월에 대해 빈 객체를 반환한다', () => {
    const inputDates = new Date('2024-11-01');
    const holidays = fetchHolidays(inputDates);
    expect(Object.keys(holidays)).toHaveLength(0);
  });

  it('여러 공휴일이 있는 월에 대해 모든 공휴일을 반환한다', () => {
    const inputDates = new Date('2024-09-30');
    const holidays = fetchHolidays(inputDates);
    const sortDates = Object.keys(holidays).sort();
    expect(sortDates).toHaveLength(3);
    expect(sortDates).toEqual(['2024-09-16', '2024-09-17', '2024-09-18']);
    expect(holidays['2024-09-16']).toBe('추석');
    expect(holidays['2024-09-17']).toBe('추석');
    expect(holidays['2024-09-18']).toBe('추석');
  });
});
