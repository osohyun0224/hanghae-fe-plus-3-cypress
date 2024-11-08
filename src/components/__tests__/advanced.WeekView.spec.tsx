import { ChakraProvider } from '@chakra-ui/react';
import { render, screen } from '@testing-library/react';
import React from 'react';

import { Event } from '../../types';
import WeekView from '../schedule/WeekView';

const renderWithChakra = (ui: React.ReactElement) => {
  return render(<ChakraProvider>{ui}</ChakraProvider>);
};

describe('WeekView', () => {
  const mockEvents: Event[] = [
    {
      id: '1',
      title: '팀 미팅',
      date: '2024-11-15',
      startTime: '10:00',
      endTime: '11:00',
      description: '주간 팀 미팅',
      location: '회의실 A',
      category: '업무',
      notificationTime: 10,
      repeat: {
        type: 'none',
        interval: 0,
      },
    },
  ];

  const mockProps = {
    currentDate: new Date('2024-11-15'),
    notifiedEvents: ['1'],
    filteredEvents: mockEvents,
  };

  it('주간 달력이 올바르게 렌더링되어야 한다', () => {
    renderWithChakra(<WeekView {...mockProps} />);

    expect(screen.getByText('2024년 11월 2주')).toBeInTheDocument();

    const weekDays = ['일', '월', '화', '수', '목', '금', '토'];
    weekDays.forEach((day) => {
      expect(screen.getByText(day)).toBeInTheDocument();
    });
  });

  it('해당 주의 모든 날짜가 표시되어야 한다', () => {
    renderWithChakra(<WeekView {...mockProps} />);

    const weekDates = [10, 11, 12, 13, 14, 15, 16];
    weekDates.forEach((date) => {
      expect(screen.getByText(date.toString())).toBeInTheDocument();
    });
  });

  it('이벤트가 올바른 날짜에 표시되어야 한다', () => {
    renderWithChakra(<WeekView {...mockProps} />);

    const cells = screen.getAllByRole('cell');
    const eventCell = cells.find((cell) => cell.textContent?.includes('15'));
    expect(eventCell).toHaveTextContent('팀 미팅');
  });

  it('알림이 설정된 이벤트는 특별한 스타일로 표시되어야 한다', () => {
    renderWithChakra(<WeekView {...mockProps} />);

    const eventContainer = screen.getByTestId('event-container');
    expect(eventContainer).toBeInTheDocument();

    const bellIcon = screen.getByTestId('bell-icon');
    expect(bellIcon).toBeInTheDocument();

    const eventText = screen.getByText('팀 미팅');
    expect(eventText).toBeInTheDocument();
  });

  it('이벤트가 없는 날짜에는 이벤트 박스가 표시되지 않아야 한다', () => {
    renderWithChakra(<WeekView {...mockProps} />);

    const nonEventDate = '14';
    const nonEventCell = screen
      .getAllByRole('cell')
      .find((cell) => cell.textContent?.includes(nonEventDate));

    expect(nonEventCell?.querySelectorAll('.chakra-stack')).toHaveLength(0);
  });

  it('주간 뷰가 올바른 테스트 ID를 가져야 한다', () => {
    renderWithChakra(<WeekView {...mockProps} />);
    expect(screen.getByTestId('week-view')).toBeInTheDocument();
  });

  it('다른 주의 날짜로 변경 시 해당 주의 날짜들이 표시되어야 한다', () => {
    const newDate = new Date('2024-11-20');
    renderWithChakra(<WeekView {...mockProps} currentDate={newDate} />);

    const weekDates = [17, 18, 19, 20, 21, 22, 23];
    weekDates.forEach((date) => {
      expect(screen.getByText(date.toString())).toBeInTheDocument();
    });
  });
});
