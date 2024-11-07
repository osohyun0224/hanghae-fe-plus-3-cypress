import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import useEventOverlap from '../../hooks/useEventOverlap';
import { Event, EventForm } from '../../types.ts';

describe('useEventOverlap', () => {
  const events: Event[] = [
    {
      id: '1',
      title: '제목',
      date: '2024-10-01',
      startTime: '10:00',
      endTime: '11:00',
      description: '설명',
      location: '위치',
      category: '업무',
      repeat: {
        type: 'none',
        interval: 3000,
      },
      notificationTime: 10,
    },
    {
      id: '2',
      title: '제목 2',
      date: '2024-10-11',
      startTime: '10:00',
      endTime: '11:00',
      description: '설명 2',
      location: '위치 2',
      category: '업무',
      repeat: {
        type: 'none',
        interval: 3000,
      },
      notificationTime: 10,
    },
  ];

  it('끝나는 시간과 시작 시간이 같은 경우 중복으로 간주하지 않는다.', () => {
    const { result } = renderHook(() => useEventOverlap());

    const newEvent: Event | EventForm = {
      title: '제목',
      date: '2024-10-01',
      startTime: '11:00',
      endTime: '12:00',
      description: '설명',
      location: '위치',
      category: '업무',
      repeat: {
        type: 'none',
        interval: 3000,
      },
      notificationTime: 10,
    };

    act(() => {
      result.current.checkOverlap(newEvent, events);
    });

    expect(result.current.isOverlapDialogOpen).toBe(false);
  });

  it('다른 날짜의 이벤트는 중복으로 간주하지 않는다.', () => {
    const { result } = renderHook(() => useEventOverlap());

    const newEvent: Event | EventForm = {
      title: '제목',
      date: '2024-10-02',
      startTime: '10:00',
      endTime: '11:00',
      description: '설명',
      location: '위치',
      category: '업무',
      repeat: {
        type: 'none',
        interval: 3000,
      },
      notificationTime: 10,
    };

    act(() => {
      result.current.checkOverlap(newEvent, events);
    });

    expect(result.current.isOverlapDialogOpen).toBe(false);
  });

  it('빈 이벤트 리스트에 대해 중복이 발생하지 않는다.', () => {
    const { result } = renderHook(() => useEventOverlap());

    const newEvent: Event | EventForm = {
      title: '제목',
      date: '2024-10-01',
      startTime: '10:00',
      endTime: '11:00',
      description: '설명',
      location: '위치',
      category: '업무',
      repeat: {
        type: 'none',
        interval: 3000,
      },
      notificationTime: 10,
    };

    act(() => {
      result.current.checkOverlap(newEvent, []);
    });

    expect(result.current.isOverlapDialogOpen).toBe(false);
  });
});