import { act, renderHook } from '@testing-library/react';

import { useSearch } from '../../hooks/useSearch.ts';
import { Event } from '../../types.ts';

const events: Event[] = [
  {
    id: '1',
    title: '팀 회의',
    date: '2024-11-03',
    startTime: '13:00',
    endTime: '14:00',
    description: 'CoreTech Weekly Standup',
    location: 'CoreTech 회의실',
    category: '업무',
    repeat: { type: 'none', interval: 0 },
    notificationTime: 10,
  },
  {
    id: '2',
    title: '점심 약속',
    date: '2024-11-21',
    startTime: '12:00',
    endTime: '13:00',
    notificationTime: 10,
    description: 'Harry와 점심 식사',
    location: '회사 근처 식당',
    category: '개인',
    repeat: {
      type: 'daily',
      interval: 1,
    },
  },
];

it('검색어가 비어있을 때 모든 이벤트를 반환해야 한다', () => {
  const { result } = renderHook(() => useSearch(events, new Date('2024-11-01'), 'month'));

  act(() => {
    result.current.setSearchTerm('');
  });

  expect(result.current.filteredEvents).toEqual(events);
});

it('검색어에 맞는 이벤트만 필터링해야 한다', () => {
  const { result } = renderHook(() => useSearch(events, new Date('2024-11-01'), 'month'));

  act(() => {
    result.current.setSearchTerm('팀 회의');
  });

  expect(result.current.filteredEvents).toHaveLength(1);
  expect(result.current.filteredEvents[0].title).toBe('팀 회의');
});

it('검색어가 제목, 설명, 위치 중 하나라도 일치하면 해당 이벤트를 반환해야 한다', () => {
  const { result } = renderHook(() => useSearch(events, new Date('2024-11-01'), 'month'));

  act(() => {
    result.current.setSearchTerm('팀 회의');
  });
  expect(result.current.filteredEvents).toHaveLength(1);
  expect(result.current.filteredEvents[0].title).toBe('팀 회의');

  act(() => {
    result.current.setSearchTerm('Weekly');
  });
  expect(result.current.filteredEvents).toHaveLength(1);
  expect(result.current.filteredEvents[0].title).toBe('팀 회의');

  act(() => {
    result.current.setSearchTerm('CoreTech');
  });
  expect(result.current.filteredEvents).toHaveLength(1);
  expect(result.current.filteredEvents[0].title).toBe('팀 회의');
});

it('현재 뷰(주간/월간)에 해당하는 이벤트만 반환해야 한다', () => {
  const { result: resultMonth } = renderHook(() =>
    useSearch(events, new Date('2024-11-01'), 'month')
  );
  expect(resultMonth.current.filteredEvents).toHaveLength(2);

  const { result: resultWeek } = renderHook(() =>
    useSearch(events, new Date('2024-11-21'), 'week')
  );
  expect(resultWeek.current.filteredEvents).toHaveLength(1);
  expect(resultWeek.current.filteredEvents[0].title).toBe('점심 약속');
});

it("검색어를 '회의'에서 '점심'으로 변경하면 필터링된 결과가 즉시 업데이트되어야 한다", () => {
  const { result } = renderHook(() => useSearch(events, new Date('2024-11-01'), 'month'));

  act(() => {
    result.current.setSearchTerm('회의');
  });
  expect(result.current.filteredEvents).toHaveLength(1);
  expect(result.current.filteredEvents[0].title).toBe('팀 회의');

  act(() => {
    result.current.setSearchTerm('점심');
  });
  expect(result.current.filteredEvents).toHaveLength(1);
  expect(result.current.filteredEvents[0].title).toBe('점심 약속');
});
