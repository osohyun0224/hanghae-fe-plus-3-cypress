import { ChakraProvider } from '@chakra-ui/react';
import { render, screen, waitFor, within } from '@testing-library/react';
import { UserEvent, userEvent } from '@testing-library/user-event';
import React from 'react';

import { setupMockHandlerCreation, setupMockHandlerUpdating } from '../__mocks__/handlersUtils';
import App from '../App';
import MonthView from '../components/schedule/MonthView';
import WeekView from '../components/schedule/WeekView';

const renderWithComponent = (ui: React.ReactElement) => {
  return render(<ChakraProvider>{ui}</ChakraProvider>);
};

const renderApp = () => {
  return render(
    <ChakraProvider>
      <App />
    </ChakraProvider>
  );
};

let user: UserEvent;

beforeEach(() => {
  user = userEvent.setup();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('MonthView 컴포넌트 통합 테스트', () => {
  it('입력한 새로운 일정 정보에 맞춰 모든 필드가 이벤트 리스트에 정확히 저장되고, 월간 달력에도 정확히 표시되어야 한다.', async () => {
    setupMockHandlerCreation();
    renderApp();

    await waitFor(() => {
      expect(screen.getByText(/검색 결과가 없습니다/i)).toBeInTheDocument();
    });

    const newEvent = {
      title: '해리와 과제하기',
      date: '2024-11-11',
      startTime: '18:00',
      endTime: '22:00',
      description: '항해 플러스 8주차 과제하기',
      location: '스파크플러스',
      category: '개인',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 0,
    };

    await user.type(screen.getByLabelText(/제목/), newEvent.title);
    await user.type(screen.getByLabelText(/날짜/), newEvent.date);
    await user.type(screen.getByLabelText(/시작 시간/), newEvent.startTime);
    await user.type(screen.getByLabelText(/종료 시간/), newEvent.endTime);
    await user.type(screen.getByLabelText(/설명/), newEvent.description);
    await user.type(screen.getByLabelText(/위치/), newEvent.location);
    await user.selectOptions(screen.getByLabelText(/카테고리/), newEvent.category);

    await user.click(screen.getByRole('button', { name: /일정 추가/ }));

    await waitFor(async () => {
      const eventList = await screen.getByTestId('event-list');
      expect(within(eventList).getByText('해리와 과제하기')).toBeInTheDocument();
      expect(within(eventList).getByText('2024-11-11')).toBeInTheDocument();
      expect(within(eventList).getByText('항해 플러스 8주차 과제하기')).toBeInTheDocument();
      expect(within(eventList).getByText('스파크플러스')).toBeInTheDocument();
      expect(within(eventList).getByText('18:00 - 22:00')).toBeInTheDocument();
      expect(within(eventList).getByText('카테고리: 개인')).toBeInTheDocument();
    });

    const mockProps = {
      currentDate: new Date('2024-11-15'),
      events: [newEvent],
    };

    renderWithComponent(
      <MonthView holidays={{}} notifiedEvents={[]} filteredEvents={[]} {...mockProps} />
    );

    const eventTitles = screen.getAllByText('해리와 과제하기');
    expect(eventTitles.length).toBeGreaterThan(0);
  });

  it('기존 일정의 세부 정보를 수정하고 변경사항이 반영되어야하고, 월간 달력에도 정확히 표시되어야 한다.', async () => {
    setupMockHandlerUpdating([
      {
        id: '1',
        title: '기존 일정',
        date: '2024-11-04',
        startTime: '13:00',
        endTime: '14:00',
        description: 'CoreTech Weekly Standup',
        location: 'CoreTech 회의실',
        category: '업무',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 10,
      },
    ]);

    renderApp();

    const eventList = await screen.getByTestId('event-list');

    await waitFor(() => {
      expect(within(eventList).getByText('기존 일정')).toBeInTheDocument();
      expect(within(eventList).getByText('2024-11-04')).toBeInTheDocument();
      expect(within(eventList).getByText(/13:00/)).toBeInTheDocument();
      expect(within(eventList).getByText(/14:00/)).toBeInTheDocument();
      expect(within(eventList).getByText('CoreTech Weekly Standup')).toBeInTheDocument();
      expect(within(eventList).getByText('CoreTech 회의실')).toBeInTheDocument();
      expect(within(eventList).getByText(/업무/)).toBeInTheDocument();
    });

    const editButton = screen.getByRole('button', { name: /Edit event/i });
    await user.click(editButton);

    await user.clear(screen.getByLabelText(/제목/));
    await user.type(screen.getByLabelText(/제목/), '해리와 1-on-1');

    await user.clear(screen.getByLabelText(/날짜/));
    await user.type(screen.getByLabelText(/날짜/), '2024-11-03');

    await user.clear(screen.getByLabelText(/시작 시간/));
    await user.type(screen.getByLabelText(/시작 시간/), '12:00');

    await user.clear(screen.getByLabelText(/종료 시간/));
    await user.type(screen.getByLabelText(/종료 시간/), '13:00');

    await user.clear(screen.getByLabelText(/설명/));
    await user.type(screen.getByLabelText(/설명/), '해리가 1-on-1을 요청함');

    await user.clear(screen.getByLabelText(/위치/));
    await user.type(screen.getByLabelText(/위치/), '누누커피');

    await user.selectOptions(screen.getByLabelText(/카테고리/), '개인');

    await user.click(screen.getByRole('button', { name: /일정 수정/ }));

    const updatedEventList = await screen.findByTestId('event-list');

    await waitFor(() => {
      expect(within(updatedEventList).getByText('해리와 1-on-1')).toBeInTheDocument();
      expect(within(updatedEventList).getByText('2024-11-03')).toBeInTheDocument();
      expect(within(updatedEventList).getByText(/12:00/)).toBeInTheDocument();
      expect(within(updatedEventList).getByText(/13:00/)).toBeInTheDocument();
      expect(within(updatedEventList).getByText('해리가 1-on-1을 요청함')).toBeInTheDocument();
      expect(within(updatedEventList).getByText('누누커피')).toBeInTheDocument();
      expect(within(updatedEventList).getByText(/개인/)).toBeInTheDocument();
    });

    const mockProps = {
      currentDate: new Date('2024-11-15'),
      events: [eventList],
    };

    renderWithComponent(
      <MonthView holidays={{}} notifiedEvents={[]} filteredEvents={[]} {...mockProps} />
    );

    const eventTitles = screen.getAllByText('해리와 1-on-1');
    expect(eventTitles.length).toBeGreaterThan(0);
  });
});

describe('WeekView 컴포넌트 통합 테스트', () => {
  it('입력한 새로운 일정 정보에 맞춰 모든 필드가 이벤트 리스트에 정확히 저장되고, 주간 뷰에도 정확히 표시되어야 한다.', async () => {
    setupMockHandlerCreation();
    renderApp();

    await waitFor(() => {
      expect(screen.getByText(/검색 결과가 없습니다/i)).toBeInTheDocument();
    });

    const newEvent = {
      title: '해리와 과제하기',
      date: '2024-11-11',
      startTime: '18:00',
      endTime: '22:00',
      description: '항해 플러스 8주차 과제하기',
      location: '스파크플러스',
      category: '개인',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 0,
    };

    await user.type(screen.getByLabelText(/제목/), newEvent.title);
    await user.type(screen.getByLabelText(/날짜/), newEvent.date);
    await user.type(screen.getByLabelText(/시작 시간/), newEvent.startTime);
    await user.type(screen.getByLabelText(/종료 시간/), newEvent.endTime);
    await user.type(screen.getByLabelText(/설명/), newEvent.description);
    await user.type(screen.getByLabelText(/위치/), newEvent.location);
    await user.selectOptions(screen.getByLabelText(/카테고리/), newEvent.category);

    await user.click(screen.getByRole('button', { name: /일정 추가/ }));

    await waitFor(async () => {
      const eventList = await screen.getByTestId('event-list');
      expect(within(eventList).getByText('해리와 과제하기')).toBeInTheDocument();
      expect(within(eventList).getByText('2024-11-11')).toBeInTheDocument();
      expect(within(eventList).getByText('항해 플러스 8주차 과제하기')).toBeInTheDocument();
      expect(within(eventList).getByText('스파크플러스')).toBeInTheDocument();
      expect(within(eventList).getByText('18:00 - 22:00')).toBeInTheDocument();
      expect(within(eventList).getByText('카테고리: 개인')).toBeInTheDocument();
    });

    const mockProps = {
      currentDate: new Date('2024-11-10'),
      events: [newEvent],
    };

    renderWithComponent(<WeekView notifiedEvents={[]} filteredEvents={[]} {...mockProps} />);

    const eventTitles = screen.getAllByText('해리와 과제하기');
    expect(eventTitles.length).toBeGreaterThan(0);
  });

  it('기존 일정의 세부 정보를 수정하고 변경사항이 반영되어야하고, 주간 달력에도 정확히 표시되어야 한다.', async () => {
    setupMockHandlerUpdating([
      {
        id: '1',
        title: '기존 일정',
        date: '2024-11-04',
        startTime: '13:00',
        endTime: '14:00',
        description: 'CoreTech Weekly Standup',
        location: 'CoreTech 회의실',
        category: '업무',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 10,
      },
    ]);

    renderApp();

    const eventList = await screen.getByTestId('event-list');

    await waitFor(() => {
      expect(within(eventList).getByText('기존 일정')).toBeInTheDocument();
      expect(within(eventList).getByText('2024-11-04')).toBeInTheDocument();
      expect(within(eventList).getByText(/13:00/)).toBeInTheDocument();
      expect(within(eventList).getByText(/14:00/)).toBeInTheDocument();
      expect(within(eventList).getByText('CoreTech Weekly Standup')).toBeInTheDocument();
      expect(within(eventList).getByText('CoreTech 회의실')).toBeInTheDocument();
      expect(within(eventList).getByText(/업무/)).toBeInTheDocument();
    });

    const editButton = screen.getByRole('button', { name: /Edit event/i });
    await user.click(editButton);

    await user.clear(screen.getByLabelText(/제목/));
    await user.type(screen.getByLabelText(/제목/), '해리와 1-on-1');

    await user.clear(screen.getByLabelText(/날짜/));
    await user.type(screen.getByLabelText(/날짜/), '2024-11-03');

    await user.clear(screen.getByLabelText(/시작 시간/));
    await user.type(screen.getByLabelText(/시작 시간/), '12:00');

    await user.clear(screen.getByLabelText(/종료 시간/));
    await user.type(screen.getByLabelText(/종료 시간/), '13:00');

    await user.clear(screen.getByLabelText(/설명/));
    await user.type(screen.getByLabelText(/설명/), '해리가 1-on-1을 요청함');

    await user.clear(screen.getByLabelText(/위치/));
    await user.type(screen.getByLabelText(/위치/), '누누커피');

    await user.selectOptions(screen.getByLabelText(/카테고리/), '개인');

    await user.click(screen.getByRole('button', { name: /일정 수정/ }));

    const updatedEventList = await screen.findByTestId('event-list');

    await waitFor(() => {
      expect(within(updatedEventList).getByText('해리와 1-on-1')).toBeInTheDocument();
      expect(within(updatedEventList).getByText('2024-11-03')).toBeInTheDocument();
      expect(within(updatedEventList).getByText(/12:00/)).toBeInTheDocument();
      expect(within(updatedEventList).getByText(/13:00/)).toBeInTheDocument();
      expect(within(updatedEventList).getByText('해리가 1-on-1을 요청함')).toBeInTheDocument();
      expect(within(updatedEventList).getByText('누누커피')).toBeInTheDocument();
      expect(within(updatedEventList).getByText(/개인/)).toBeInTheDocument();
    });

    const mockProps = {
      currentDate: new Date('2024-11-04'),
      events: [eventList],
    };

    renderWithComponent(<WeekView notifiedEvents={[]} filteredEvents={[]} {...mockProps} />);

    const eventTitles = screen.getAllByText('해리와 1-on-1');
    expect(eventTitles.length).toBeGreaterThan(0);
  });
});
