import React from 'react';
import { mount } from '@cypress/react18';
import { ChakraProvider } from '@chakra-ui/react';
import NotificationList from '../../src/components/notification/NotificationList';

describe('NotificationList.cy.tsx', () => {
  it('알림을 표시하고 닫기 버튼 클릭을 처리해야 한다.', () => {
    const notifications = [
      { message: '알림 1' },
      { message: '알림 2' },
    ];

    const onClose = cy.stub();

    mount(
      <ChakraProvider>
        <NotificationList notifications={notifications} onClose={onClose} />
      </ChakraProvider>
    );

    cy.get('div[role="alert"]').should('have.length', notifications.length);
    cy.contains('알림 1').should('be.visible');
    cy.contains('알림 2').should('be.visible');

    cy.get('button[aria-label="Close"]').first().click();

    cy.wrap(onClose).should('have.been.calledOnceWith', 0);
  });

  it('알림이 없을 때 아무것도 표시되지 않아야 한다.', () => {
    const notifications: any[] = [];
    const onClose = cy.stub();

    mount(
      <ChakraProvider>
        <NotificationList notifications={notifications} onClose={onClose} />
      </ChakraProvider>
    );

    cy.get('div[role="alert"]').should('not.exist');
  });

  it('여러 알림의 닫기 버튼을 순차적으로 클릭할 수 있어야 한다.', () => {
    const notifications = [
      { message: '알림 1' },
      { message: '알림 2' },
      { message: '알림 3' },
    ];

    const onClose = cy.stub();

    mount(
      <ChakraProvider>
        <NotificationList notifications={notifications} onClose={onClose} />
      </ChakraProvider>
    );

    notifications.forEach((_, index) => {
      cy.get('button[aria-label="Close"]').eq(index).click();
      cy.wrap(onClose).should('have.been.calledWith', index);
    });
  });
});