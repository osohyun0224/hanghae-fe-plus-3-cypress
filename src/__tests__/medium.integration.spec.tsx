import { ChakraProvider } from '@chakra-ui/react';
import { render, screen, waitFor, within } from '@testing-library/react';
import { UserEvent, userEvent } from '@testing-library/user-event';

import {
  setupMockHandlerCreation,
  setupMockHandlerUpdating,
  setupMockHandlerDeletion,
} from '../__mocks__/handlersUtils';
import App from '../App';

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

describe('일정 CRUD 및 기본 기능', () => {
  it('입력한 새로운 일정 정보에 맞춰 모든 필드가 이벤트 리스트에 정확히 저장된다.', async () => {
    setupMockHandlerCreation();
    renderApp();

    await waitFor(() => {
      expect(screen.getByText(/검색 결과가 없습니다/i)).toBeInTheDocument();
    });

    const newEvent = {
      title: '새로운 일정',
      date: '2024-11-08',
      startTime: '12:00',
      endTime: '13:00',
      description: '새로운 일정에 대한 설명',
      location: '새로운 장소',
      category: '업무',
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
      expect(within(eventList).getByText('새로운 일정')).toBeInTheDocument();
      expect(within(eventList).getByText('2024-11-08')).toBeInTheDocument();
      expect(within(eventList).getByText('새로운 일정에 대한 설명')).toBeInTheDocument();
      expect(within(eventList).getByText('새로운 장소')).toBeInTheDocument();
      expect(within(eventList).getByText('12:00 - 13:00')).toBeInTheDocument();
      expect(within(eventList).getByText('카테고리: 업무')).toBeInTheDocument();
    });
  });

  it('기존 일정의 세부 정보를 수정하고 변경사항이 정확히 반영된다', async () => {
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
    await user.type(screen.getByLabelText(/제목/), '긴급 장애대응');

    await user.clear(screen.getByLabelText(/날짜/));
    await user.type(screen.getByLabelText(/날짜/), '2024-11-03');

    await user.clear(screen.getByLabelText(/시작 시간/));
    await user.type(screen.getByLabelText(/시작 시간/), '12:00');

    await user.clear(screen.getByLabelText(/종료 시간/));
    await user.type(screen.getByLabelText(/종료 시간/), '13:00');

    await user.clear(screen.getByLabelText(/설명/));
    await user.type(screen.getByLabelText(/설명/), '긴급 장애대응 팀 회의');

    await user.clear(screen.getByLabelText(/위치/));
    await user.type(screen.getByLabelText(/위치/), '회의실');

    await user.selectOptions(screen.getByLabelText(/카테고리/), '업무');

    await user.click(screen.getByRole('button', { name: /일정 수정/ }));

    const updatedEventList = await screen.findByTestId('event-list');

    await waitFor(() => {
      expect(within(updatedEventList).getByText('긴급 장애대응')).toBeInTheDocument();
      expect(within(updatedEventList).getByText('2024-11-03')).toBeInTheDocument();
      expect(within(updatedEventList).getByText(/12:00/)).toBeInTheDocument();
      expect(within(updatedEventList).getByText(/13:00/)).toBeInTheDocument();
      expect(within(updatedEventList).getByText('긴급 장애대응 팀 회의')).toBeInTheDocument();
      expect(within(updatedEventList).getByText('회의실')).toBeInTheDocument();
      expect(within(updatedEventList).getByText(/업무/)).toBeInTheDocument();
    });
  });

  it('일정을 삭제하고 더 이상 조회되지 않는지 확인한다', async () => {
    setupMockHandlerDeletion([
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

    const deleteButton = await within(eventList).findByRole('button', { name: 'Delete event' });
    await user.click(deleteButton);

    await waitFor(() => {
      expect(within(eventList).queryByText('기존 일정')).not.toBeInTheDocument();
      expect(within(eventList).queryByText('2024-11-04')).not.toBeInTheDocument();
      expect(within(eventList).queryByText(/13:00/)).not.toBeInTheDocument();
      expect(within(eventList).queryByText(/14:00/)).not.toBeInTheDocument();
      expect(within(eventList).queryByText('CoreTech Weekly Standup')).not.toBeInTheDocument();
      expect(within(eventList).queryByText('CoreTech 회의실')).not.toBeInTheDocument();
      expect(within(eventList).queryByText(/업무/)).not.toBeInTheDocument();
      expect(within(eventList).getByText(/검색 결과가 없습니다/)).toBeInTheDocument();
    });
  });
});

describe('일정 뷰', () => {
  it('주별 뷰를 선택 후 해당 주에 일정이 없으면, 일정이 표시되지 않는다.', async () => {
    setupMockHandlerCreation([
      {
        id: '1',
        title: '기존 일정',
        date: '2024-11-30',
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

    await user.selectOptions(screen.getByLabelText(/view/), 'week');

    const eventList = await screen.getByTestId('event-list');

    expect(within(eventList).getByText(/검색 결과가 없습니다./)).toBeInTheDocument();
  });

  it('주별 뷰 선택 후 해당 일자에 일정이 존재한다면 해당 일정이 정확히 표시된다', async () => {
    vi.setSystemTime(new Date('2024-11-03T00:00:00'));

    setupMockHandlerCreation([
      {
        id: '1',
        title: '기존 일정',
        date: '2024-11-03',
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

    await user.selectOptions(screen.getByLabelText(/view/), 'week');

    const eventList = await screen.getByTestId('event-list');
    expect(within(eventList).getByText('기존 일정')).toBeInTheDocument();
    expect(within(eventList).getByText('2024-11-03')).toBeInTheDocument();
    expect(within(eventList).getByText(/13:00/)).toBeInTheDocument();
    expect(within(eventList).getByText(/14:00/)).toBeInTheDocument();
    expect(within(eventList).getByText('CoreTech Weekly Standup')).toBeInTheDocument();
    expect(within(eventList).getByText('CoreTech 회의실')).toBeInTheDocument();
    expect(within(eventList).getByText(/업무/)).toBeInTheDocument();
  });

  it('월별 뷰에 일정이 없으면, 일정이 표시되지 않아야 한다.', async () => {
    vi.setSystemTime(new Date('2024-09-01T00:00:00'));

    renderApp();

    await user.selectOptions(screen.getByLabelText(/view/), 'month');

    const eventList = await screen.getByTestId('event-list');
    expect(within(eventList).getByText(/검색 결과가 없습니다./)).toBeInTheDocument();
  });

  it('월별 뷰에 일정이 정확히 표시되는지 확인한다', async () => {
    vi.setSystemTime(new Date('2024-11-08T00:00:00'));

    setupMockHandlerCreation([
      {
        id: '1',
        title: '기존 일정',
        date: '2024-11-03',
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

    await user.selectOptions(screen.getByLabelText(/view/), 'month');

    const eventList = await screen.getByTestId('event-list');
    expect(within(eventList).getByText('기존 일정')).toBeInTheDocument();
    expect(within(eventList).getByText('2024-11-03')).toBeInTheDocument();
    expect(within(eventList).getByText(/13:00/)).toBeInTheDocument();
    expect(within(eventList).getByText(/14:00/)).toBeInTheDocument();
    expect(within(eventList).getByText('CoreTech Weekly Standup')).toBeInTheDocument();
    expect(within(eventList).getByText('CoreTech 회의실')).toBeInTheDocument();
    expect(within(eventList).getByText(/업무/)).toBeInTheDocument();
  });

  it('달력에 1월 1일(신정)이 공휴일로 표시되는지 확인한다', async () => {
    vi.setSystemTime(new Date('2024-01-01T00:00:00'));

    renderApp();

    await user.selectOptions(screen.getByLabelText(/view/), 'month');

    const monthView = await screen.getByTestId('month-view');
    expect(within(monthView).getByText(/신정/)).toBeInTheDocument();
  });
});

describe('검색 기능', () => {
  vi.setSystemTime(new Date('2024-11-01T00:00:00'));

  it('검색 결과가 없으면, "검색 결과가 없습니다."가 표시되어야 한다.', async () => {
    setupMockHandlerCreation([
      {
        id: '1',
        title: '기존 일정',
        date: '2024-11-03',
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

    await user.type(screen.getByLabelText(/일정 검색/), '없는 일정');

    const eventList = await screen.getByTestId('event-list');
    expect(within(eventList).getByText(/검색 결과가 없습니다./)).toBeInTheDocument();
  });

  it("'팀 회의'를 검색하면 해당 제목을 가진 일정이 리스트에 노출된다", async () => {
    setupMockHandlerCreation([
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
    ]);

    renderApp();

    const eventList = await screen.findByTestId('event-list');
    await waitFor(() => expect(within(eventList).getByText('팀 회의')).toBeInTheDocument());

    await userEvent.type(screen.getByPlaceholderText(/검색어를 입력하세요/), '팀 회의');

    expect(within(eventList).getByText('팀 회의')).toBeInTheDocument();
    expect(within(eventList).getByText('2024-11-03')).toBeInTheDocument();
    expect(within(eventList).getByText(/13:00/)).toBeInTheDocument();
    expect(within(eventList).getByText(/14:00/)).toBeInTheDocument();
    expect(within(eventList).getByText('CoreTech Weekly Standup')).toBeInTheDocument();
    expect(within(eventList).getByText('CoreTech 회의실')).toBeInTheDocument();
    expect(within(eventList).getByText(/업무/)).toBeInTheDocument();
  });

  it('검색어를 지우면 모든 일정이 다시 표시되어야 한다', async () => {
    setupMockHandlerCreation([
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
        title: 'Harry와 1-on-1',
        date: '2024-11-05',
        startTime: '15:00',
        endTime: '16:00',
        description: '2024 하반기 팀 리더 1-on-1',
        location: '누누커피',
        category: '개인',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 10,
      },
    ]);
    renderApp();

    await user.type(screen.getByPlaceholderText(/검색어를 입력하세요/), '없는 검색어');

    const eventList = await screen.getByTestId('event-list');
    expect(within(eventList).getByText(/검색 결과가 없습니다./)).toBeInTheDocument();

    await user.clear(screen.getByPlaceholderText(/검색어를 입력하세요/));

    expect(within(eventList).getByText('팀 회의')).toBeInTheDocument();
    expect(within(eventList).getByText('2024-11-03')).toBeInTheDocument();
    expect(within(eventList).getByText(/13:00/)).toBeInTheDocument();
    expect(within(eventList).getByText(/14:00/)).toBeInTheDocument();
    expect(within(eventList).getByText('CoreTech Weekly Standup')).toBeInTheDocument();
    expect(within(eventList).getByText('CoreTech 회의실')).toBeInTheDocument();
    expect(within(eventList).getByText(/업무/)).toBeInTheDocument();

    expect(within(eventList).getByText('Harry와 1-on-1')).toBeInTheDocument();
    expect(within(eventList).getByText('2024-11-05')).toBeInTheDocument();
    expect(within(eventList).getByText(/15:00/)).toBeInTheDocument();
    expect(within(eventList).getByText(/16:00/)).toBeInTheDocument();
    expect(within(eventList).getByText('2024 하반기 팀 리더 1-on-1')).toBeInTheDocument();
    expect(within(eventList).getByText('누누커피')).toBeInTheDocument();
    expect(within(eventList).getByText(/개인/)).toBeInTheDocument();
  });
});

describe('일정 충돌', () => {
  it('겹치는 시간에 새 일정을 추가할 때 경고가 표시된다.', async () => {
    setupMockHandlerCreation([
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
    ]);
    renderApp();

    await user.type(screen.getByLabelText(/제목/), '새 회의');
    await user.type(screen.getByLabelText(/날짜/), '2024-11-03');
    await user.type(screen.getByLabelText(/시작 시간/), '13:30');
    await user.type(screen.getByLabelText(/종료 시간/), '14:30');
    await user.type(screen.getByLabelText(/설명/), '새로운 회의');
    await user.type(screen.getByLabelText(/위치/), '회의실2');
    await user.selectOptions(screen.getByLabelText(/카테고리/), '업무');

    await user.click(screen.getByRole('button', { name: /일정 추가/ }));


    expect(screen.getByText('일정 겹침 경고')).toBeInTheDocument();
  });

  it('기존 일정의 시간을 수정하여 충돌이 발생하면 경고가 노출된다', async () => {
    setupMockHandlerCreation([
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
        title: '다른 회의',
        date: '2024-11-03',
        startTime: '10:00',
        endTime: '11:00',
        description: '다른 회의 설명',
        location: '회의실2',
        category: '업무',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 10,
      },
    ]);
    renderApp();

    await user.type(screen.getByLabelText(/일정 검색/), '팀 회의');

    await user.click(screen.getByRole('button', { name: 'Edit event' }));

    await user.clear(screen.getByLabelText(/시작 시간/));
    await user.type(screen.getByLabelText(/시작 시간/), '10:00');
    await user.clear(screen.getByLabelText(/종료 시간/));
    await user.type(screen.getByLabelText(/종료 시간/), '11:00');

    await user.click(screen.getByRole('button', { name: /일정 수정/ }));

    expect(screen.getByText('일정 겹침 경고')).toBeInTheDocument();
    expect(screen.getByText(/다음 일정과 겹칩니다./)).toBeInTheDocument();
    expect(screen.getByText(/다른 회의 \(2024-11-03 10:00-11:00\)/)).toBeInTheDocument();
    expect(screen.getByText(/계속 진행하시겠습니까?/)).toBeInTheDocument();
  });
});

it('notificationTime을 10으로 하면 지정 시간 10분 전 알람 텍스트가 노출된다', async () => {
  vi.setSystemTime(new Date('2024-11-03T12:50:00'));

  setupMockHandlerCreation([
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
  ]);
  renderApp();

  await waitFor(() => {
    expect(screen.getByText(/일정이 시작됩니다./)).toBeInTheDocument();
  });
  vi.useRealTimers();
});
