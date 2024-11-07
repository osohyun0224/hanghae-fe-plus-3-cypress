import { renderHook } from '@testing-library/react';
import { expect } from 'vitest';

import useEventValidation from '../../hooks/useEventValidation.ts';
import { Event, EventForm } from '../../types.ts';

const toastFn = vi.fn();

vi.mock('@chakra-ui/react', async () => {
  const actual = await vi.importActual('@chakra-ui/react');
  return {
    ...actual,
    useToast: () => toastFn,
  };
});

describe('useEventValidation', () => {
  beforeEach(() => {
    toastFn.mockClear();
  });

  it('필수 정보가 누락되면 유효성 검사에 실패한다.', () => {
    const { result } = renderHook(() => useEventValidation());

    const formData: Event | EventForm = {
      title: '',
      date: '',
      startTime: '',
      endTime: '',
      description: '설명',
      location: '위치',
      category: '업무',
      repeat: {
        type: 'none',
        interval: 3000,
      },
      notificationTime: 10,
    };

    const isValid = result.current.validate(formData, null, null);

    expect(toastFn).toHaveBeenCalled();
    expect(toastFn).toHaveBeenCalledWith({
      title: '필수 정보를 모두 입력해주세요.',
      status: 'error',
      duration: 3000,
      isClosable: true,
    });
    expect(isValid).toBe(false);
  });

  it('종료 시간이 시작 시간보다 빠르면 유효성 검사에 실패한다.', () => {
    const { result } = renderHook(() => useEventValidation());

    const formData: Event | EventForm = {
      title: '제목',
      date: '2024-10-01',
      startTime: '11:00',
      endTime: '10:00',
      description: '설명',
      location: '위치',
      category: '업무',
      repeat: {
        type: 'none',
        interval: 3000,
      },
      notificationTime: 10,
    };

    const isValid = result.current.validate(
      formData,
      '시작 시간은 종료 시간보다 빨라야 합니다.',
      null
    );

    expect(toastFn).toHaveBeenCalled();
    expect(toastFn).toHaveBeenCalledWith({
      title: '시간 설정을 확인해주세요.',
      status: 'error',
      duration: 3000,
      isClosable: true,
    });
    expect(isValid).toBe(false);
  });

  it('모든 정보가 올바르면 유효성 검사에 성공한다.', () => {
    const { result } = renderHook(() => useEventValidation());

    const formData: Event | EventForm = {
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

    const isValid = result.current.validate(formData, null, null);

    expect(isValid).toBe(true);
  });
});
