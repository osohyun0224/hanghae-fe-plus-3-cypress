import React, { useRef } from 'react';
import { mount } from '@cypress/react18';
import { ChakraProvider } from '@chakra-ui/react';
import OverlapDialog from '../../src/components/schedule/OverlapDialog';
import { Event } from '../../src/types';

const OverlapDialogWrapper = ({ isOpen, onClose, overlappingEvents, onConfirm }) => {
  const cancelRef = useRef<HTMLButtonElement>(null);

  return (
    <ChakraProvider>
      <OverlapDialog
        isOpen={isOpen}
        onClose={onClose}
        cancelRef={cancelRef}
        overlappingEvents={overlappingEvents}
        onConfirm={onConfirm}
      />
    </ChakraProvider>
  );
};

describe('OverlapDialog.cy.tsx', () => {
  it('다이얼로그가 올바르게 렌더링되어야 한다.', () => {
    const overlappingEvents: Event[] = [
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
      {
        id: '2',
        title: '해리와 과제하기',
        date: '2024-11-11',
        startTime: '18:00',
        endTime: '22:00',
        description: '항해 플러스 8주차 과제하기',
        location: '스파크플러스',
        category: '개인',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 0,
      },
    ];

    const onClose = cy.stub();
    const onConfirm = cy.stub();

    mount(
      <OverlapDialogWrapper
        isOpen={true}
        onClose={onClose}
        overlappingEvents={overlappingEvents}
        onConfirm={onConfirm}
      />
    );

    cy.get('[role="alertdialog"]').should('be.visible');

    cy.get('[data-testid="overlap-warning"]').should('contain', '다음 일정과 겹칩니다:');

    overlappingEvents.forEach((event) => {
      cy.contains(`${event.title} (${event.date} ${event.startTime}-${event.endTime})`).should('be.visible');
    });

    cy.get('[data-testid="confirm-message"]').should('contain', '계속 진행하시겠습니까?');
  });

  it('취소 버튼 클릭 시 onClose 콜백이 호출되어야 한다.', () => {
    const overlappingEvents: Event[] = [];
    const onClose = cy.stub();
    const onConfirm = cy.stub();

    mount(
      <OverlapDialogWrapper
        isOpen={true}
        onClose={onClose}
        overlappingEvents={overlappingEvents}
        onConfirm={onConfirm}
      />
    );

    cy.get('[data-testid="cancel-button"]').click();
    cy.wrap(onClose).should('have.been.calledOnce');
  });

  it('계속 진행 버튼 클릭 시 onConfirm 콜백이 호출되어야 한다.', () => {
    const overlappingEvents: Event[] = [];
    const onClose = cy.stub();
    const onConfirm = cy.stub();

    mount(
      <OverlapDialogWrapper
        isOpen={true}
        onClose={onClose}
        overlappingEvents={overlappingEvents}
        onConfirm={onConfirm}
      />
    );

    cy.get('[data-testid="confirm-button"]').click();
    cy.wrap(onConfirm).should('have.been.calledOnce');
  });
});