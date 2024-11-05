import { Event } from '../../types';
import {
  fillZero,
  formatDate,
  formatMonth,
  formatWeek,
  getDaysInMonth,
  getEventsForDay,
  getWeekDates,
  getWeeksAtMonth,
  isDateInRange,
} from '../../utils/dateUtils';

describe('getDaysInMonth', () => {
  it('1월은 31일 수를 반환한다', () => {
    expect(getDaysInMonth(2024, 1)).toBe(31);
  });

  it('4월은 30일 일수를 반환한다', () => {
    expect(getDaysInMonth(2024, 4)).toBe(30);
  });

  it('윤년의 2월에 대해 29일을 반환한다', () => {
    expect(getDaysInMonth(2028, 2)).toBe(29);
  });

  it('평년의 2월에 대해 28일을 반환한다', () => {
    expect(getDaysInMonth(2026, 2)).toBe(28);
  });

  it('유효하지 않은 월에 대해 적절히 처리한다', () => {
    expect(getDaysInMonth(2024, 0)).toBe(31);
    expect(getDaysInMonth(2024, 20)).toBe(31);
  });
  //추가
  describe('경계값 테스트', () => {
    it('0월은 이전 해의 12월로 처리되어 31일을 반환한다', () => {
      expect(getDaysInMonth(2024, 0)).toBe(31);
    });

    it('13월은 다음 해의 1월로 처리되어 31일을 반환한다', () => {
      expect(getDaysInMonth(2024, 13)).toBe(31);
    });

    it('매우 큰 월 숫자는 연도를 넘어 순환하여 처리된다', () => {
      // 20월 = 1년 8월과 동일
      expect(getDaysInMonth(2024, 20)).toBe(31); // 2025년 8월과 동일
      // 25월 = 2년 1월과 동일
      expect(getDaysInMonth(2024, 25)).toBe(31); // 2026년 1월과 동일
    });
  });
});

describe('getWeekDates', () => {
  it('주중의 날짜(수요일)에 대해 올바른 주의 날짜들을 반환한다', () => {
    // 수요일
    const date = new Date('2024-11-06');
    const weekDates = getWeekDates(date);
    expect(weekDates).toHaveLength(7);
    expect(weekDates[0].toISOString().split('T')[0]).toBe('2024-11-03');
    expect(weekDates[1].toISOString().split('T')[0]).toBe('2024-11-04');
    expect(weekDates[2].toISOString().split('T')[0]).toBe('2024-11-05');
    expect(weekDates[3].toISOString().split('T')[0]).toBe('2024-11-06');
    expect(weekDates[4].toISOString().split('T')[0]).toBe('2024-11-07');
    expect(weekDates[5].toISOString().split('T')[0]).toBe('2024-11-08');
    expect(weekDates[6].toISOString().split('T')[0]).toBe('2024-11-09');
  });

  it('주의 시작(일요일)에 대해 올바른 주의 날짜들을 반환한다', () => {
    const date = new Date('2024-11-03');
    const weekDates = getWeekDates(date);
    expect(weekDates).toHaveLength(7);
    expect(weekDates[0].toISOString().split('T')[0]).toBe('2024-11-03');
    expect(weekDates[1].toISOString().split('T')[0]).toBe('2024-11-04');
    expect(weekDates[2].toISOString().split('T')[0]).toBe('2024-11-05');
    expect(weekDates[3].toISOString().split('T')[0]).toBe('2024-11-06');
    expect(weekDates[4].toISOString().split('T')[0]).toBe('2024-11-07');
    expect(weekDates[5].toISOString().split('T')[0]).toBe('2024-11-08');
    expect(weekDates[6].toISOString().split('T')[0]).toBe('2024-11-09');
  });

  it('주의 끝(토요일)에 대해 올바른 주의 날짜들을 반환한다', () => {
    const date = new Date('2024-11-02');
    const weekDates = getWeekDates(date);
    expect(weekDates).toHaveLength(7);
    expect(weekDates[0].toISOString().split('T')[0]).toBe('2024-10-27');
    expect(weekDates[1].toISOString().split('T')[0]).toBe('2024-10-28');
    expect(weekDates[2].toISOString().split('T')[0]).toBe('2024-10-29');
    expect(weekDates[3].toISOString().split('T')[0]).toBe('2024-10-30');
    expect(weekDates[4].toISOString().split('T')[0]).toBe('2024-10-31');
    expect(weekDates[5].toISOString().split('T')[0]).toBe('2024-11-01');
    expect(weekDates[6].toISOString().split('T')[0]).toBe('2024-11-02');
  });

  it('연도를 넘어가는 주의 날짜를 정확히 처리한다 (연말)', () => {
    const date = new Date('2024-12-29');
    const weekDates = getWeekDates(date);
    expect(weekDates[0].toISOString().split('T')[0]).toBe('2024-12-29');     
    expect(weekDates[1].toISOString().split('T')[0]).toBe('2024-12-30');
    expect(weekDates[2].toISOString().split('T')[0]).toBe('2024-12-31');
    expect(weekDates[3].toISOString().split('T')[0]).toBe('2025-01-01');
    expect(weekDates[4].toISOString().split('T')[0]).toBe('2025-01-02');
    expect(weekDates[5].toISOString().split('T')[0]).toBe('2025-01-03');
    expect(weekDates[6].toISOString().split('T')[0]).toBe('2025-01-04');
  });

  it('연도를 넘어가는 주의 날짜를 정확히 처리한다 (연초)', () => {
    const date = new Date('2025-01-02');
    const weekDates = getWeekDates(date);
    expect(weekDates[0].toISOString().split('T')[0]).toBe('2024-12-29');     
    expect(weekDates[1].toISOString().split('T')[0]).toBe('2024-12-30');
    expect(weekDates[2].toISOString().split('T')[0]).toBe('2024-12-31');
    expect(weekDates[3].toISOString().split('T')[0]).toBe('2025-01-01');
    expect(weekDates[4].toISOString().split('T')[0]).toBe('2025-01-02');
    expect(weekDates[5].toISOString().split('T')[0]).toBe('2025-01-03');
    expect(weekDates[6].toISOString().split('T')[0]).toBe('2025-01-04');
  });

  it('윤년의 2월 29일을 포함한 주를 올바르게 처리한다', () => {
    const date = new Date('2024-02-29');
    const weekDates = getWeekDates(date);
    expect(weekDates[0].toISOString().split('T')[0]).toBe('2024-02-25');     
    expect(weekDates[1].toISOString().split('T')[0]).toBe('2024-02-26'); 
    expect(weekDates[2].toISOString().split('T')[0]).toBe('2024-02-27'); 
    expect(weekDates[3].toISOString().split('T')[0]).toBe('2024-02-28'); 
    expect(weekDates[4].toISOString().split('T')[0]).toBe('2024-02-29'); 
    expect(weekDates[5].toISOString().split('T')[0]).toBe('2024-03-01'); 
    expect(weekDates[6].toISOString().split('T')[0]).toBe('2024-03-02'); 
  });

  it('월의 마지막 날짜를 포함한 주를 올바르게 처리한다', () => {
    const date = new Date('2024-11-30');
    const weekDates = getWeekDates(date);
    expect(weekDates[0].toISOString().split('T')[0]).toBe('2024-11-24');
    expect(weekDates[1].toISOString().split('T')[0]).toBe('2024-11-25');
    expect(weekDates[2].toISOString().split('T')[0]).toBe('2024-11-26');
    expect(weekDates[3].toISOString().split('T')[0]).toBe('2024-11-27');
    expect(weekDates[4].toISOString().split('T')[0]).toBe('2024-11-28');
    expect(weekDates[5].toISOString().split('T')[0]).toBe('2024-11-29');
    expect(weekDates[6].toISOString().split('T')[0]).toBe('2024-11-30');
  });
});

describe('getWeeksAtMonth', () => {
  it('2024년 7월 1일의 올바른 주 정보를 반환해야 한다', () => {
    const weeks = getWeeksAtMonth(new Date('2024-07-01'));
    expect(weeks).toEqual([
      [null, 1, 2, 3, 4, 5, 6],
      [7, 8, 9, 10, 11, 12, 13],
      [14, 15, 16, 17, 18, 19, 20],
      [21, 22, 23, 24, 25, 26, 27],
      [28, 29, 30, 31, null, null, null],
    ]);
  });
});

describe('getEventsForDay', () => {
  const events: Event[] = [
    {
      id: '1',
      title: '영어 수업',
      date: '2024-11-01',
      startTime: '09:00',
      endTime: '10:30',
      description: '온라인 영어 회화',
      location: '화상 회의실',
      category: '학습',
      repeat: {
        type: 'weekly',
        interval: 1,
        endDate: '2024-12-31',
      },
      notificationTime: 15,
    },
    {
      id: '2',
      title: '병원 예약',
      date: '2024-11-0',
      startTime: '14:30',
      endTime: '15:30',
      description: '정기 건강 검진',
      location: '서울 중앙 병원',
      category: '건강',
      repeat: {
        type: 'yearly',
        interval: 1,
      },
      notificationTime: 45,
    },
    {
      id: '3',
      title: '요가 클래스',
      date: '2024-11-32',
      startTime: '18:00',
      endTime: '19:00',
      description: '저녁 스트레칭 수업',
      location: '웰니스 센터',
      category: '운동',
      repeat: {
        type: 'none',
        interval: 0,
      },
      notificationTime: 20,
    },
  ];

  it('특정 날짜(1일)에 해당하는 이벤트만 정확히 반환한다', () => {
    const eventDay = getEventsForDay(events, 1);
    expect(eventDay).toEqual([
      {
        id: '1',
        title: '영어 수업',
        date: '2024-11-01',
        startTime: '09:00',
        endTime: '10:30',
        description: '온라인 영어 회화',
        location: '화상 회의실',
        category: '학습',
        repeat: {
          type: 'weekly',
          interval: 1,
          endDate: '2024-12-31',
        },
        notificationTime: 15,
      },
    ]);
  });

  it('해당 날짜에 이벤트가 없을 경우 빈 배열을 반환한다', () => {
    const eventDay = getEventsForDay(events, 2);
    expect(eventDay).toEqual([]);
  });

  it('날짜가 0일 경우 빈 배열을 반환한다', () => {
    const eventDay = getEventsForDay(events, 0);
    expect(eventDay).toEqual([]);
  });

  it('날짜가 32일 이상인 경우 빈 배열을 반환한다', () => {
    const eventDay = getEventsForDay(events, 32);
    expect(eventDay).toEqual([]);
  });
});

describe('formatWeek', () => {
  it('월의 중간 날짜에 대해 올바른 주 정보를 반환한다', () => {
    const weekDates = formatWeek(new Date('2024-11-15'));
    expect(weekDates).toBe('2024년 11월 2주');
  });

  it('월의 첫 주에 대해 올바른 주 정보를 반환한다', () => {
    const weekDates = formatWeek(new Date('2024-11-04'));
    expect(weekDates).toBe('2024년 11월 1주');
  });

  it('월의 마지막 주에 대해 올바른 주 정보를 반환한다', () => {
    const weekDates = formatWeek(new Date('2024-11-30'));
    expect(weekDates).toBe('2024년 11월 4주');
  });

  it('연도가 바뀌는 주에 대해 올바른 주 정보를 반환한다', () => {
    const weekDates = formatWeek(new Date('2025-01-01'));
    expect(weekDates).toBe('2025년 1월 1주');
  });

  it('윤년 2월의 마지막 주에 대해 올바른 주 정보를 반환한다', () => {
    const weekDates = formatWeek(new Date('2024-02-29'));
    expect(weekDates).toBe('2024년 2월 5주');
  });

  it('평년 2월의 마지막 주에 대해 올바른 주 정보를 반환한다', () => {
    const weekDates = formatWeek(new Date('2025-02-28'));
    expect(weekDates).toBe('2025년 2월 4주');
  });
});

describe('formatMonth', () => {
  it("2024년 7월 10일을 '2024년 7월'로 반환한다", () => {});
});

describe('isDateInRange', () => {
  const rangeStart = new Date('2024-07-01');
  const rangeEnd = new Date('2024-07-31');

  it('범위 내의 날짜 2024-07-10에 대해 true를 반환한다', () => {});

  it('범위의 시작일 2024-07-01에 대해 true를 반환한다', () => {});

  it('범위의 종료일 2024-07-31에 대해 true를 반환한다', () => {});

  it('범위 이전의 날짜 2024-06-30에 대해 false를 반환한다', () => {});

  it('범위 이후의 날짜 2024-08-01에 대해 false를 반환한다', () => {});

  it('시작일이 종료일보다 늦은 경우 모든 날짜에 대해 false를 반환한다', () => {});
});

describe('fillZero', () => {
  test("5를 2자리로 변환하면 '05'를 반환한다", () => {});

  test("10을 2자리로 변환하면 '10'을 반환한다", () => {});

  test("3을 3자리로 변환하면 '003'을 반환한다", () => {});

  test("100을 2자리로 변환하면 '100'을 반환한다", () => {});

  test("0을 2자리로 변환하면 '00'을 반환한다", () => {});

  test("1을 5자리로 변환하면 '00001'을 반환한다", () => {});

  test("소수점이 있는 3.14를 5자리로 변환하면 '03.14'를 반환한다", () => {});

  test('size 파라미터를 생략하면 기본값 2를 사용한다', () => {});

  test('value가 지정된 size보다 큰 자릿수를 가지면 원래 값을 그대로 반환한다', () => {});
});

describe('formatDate', () => {
  it('날짜를 YYYY-MM-DD 형식으로 포맷팅한다', () => {});

  it('day 파라미터가 제공되면 해당 일자로 포맷팅한다', () => {});

  it('월이 한 자리 수일 때 앞에 0을 붙여 포맷팅한다', () => {});

  it('일이 한 자리 수일 때 앞에 0을 붙여 포맷팅한다', () => {});
});
