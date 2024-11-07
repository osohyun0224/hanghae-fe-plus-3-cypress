import { Event } from '../../types';
import { createNotificationMessage, getUpcomingEvents } from '../../utils/notificationUtils';

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
];

describe('getUpcomingEvents', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('이미 알림이 간 이벤트는 제외한다', () => {
    const date = new Date('2024-11-01T09:50:00');
    vi.setSystemTime(date);
    const upcomingEvents = getUpcomingEvents(events, new Date(), ['1']);
    expect(upcomingEvents).toHaveLength(0);
  });

  it('알림 시간이 아직 도래하지 않은 이벤트는 반환하지 않는다', () => {
    const date = new Date('2024-11-01T09:40:00');
    vi.setSystemTime(date);
    const upcomingEvents = getUpcomingEvents(events, new Date(), []);
    expect(upcomingEvents).toHaveLength(0);
  });

  it('알림 시간이 지난 이벤트는 반환하지 않는다', () => {
    const date = new Date('2024-11-01T11:00:00');
    vi.setSystemTime(date);
    const upcomingEvents = getUpcomingEvents(events, new Date(), []);
    expect(upcomingEvents).toHaveLength(0);
  });

// 추가 테스트 케이스
  it('알림 시간이 다가온 이벤트를 반환한다', () => {
    const date = new Date('2024-11-03T12:50:00');
    const upcomingEvents = getUpcomingEvents(events, date, []);
    expect(upcomingEvents).toHaveLength(1);
  });
});

describe('createNotificationMessage', () => {
  it('올바른 알림 메시지를 생성해야 한다', () => {
    const message = createNotificationMessage(events[0]);
    expect(message).toBe('10분 후 팀 회의 일정이 시작됩니다.');
  });
});
