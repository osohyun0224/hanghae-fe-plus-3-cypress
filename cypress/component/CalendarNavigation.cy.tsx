import { ChakraProvider } from '@chakra-ui/react';
import { mount } from '@cypress/react18';
import React, { useState } from 'react';

import CalendarNavigation from '../../src/components/schedule/CalendarNavigation';

describe('CalendarNavigation.cy.tsx', () => {
  it('이전 및 다음 버튼 클릭을 처리해야 한다.', () => {
    const onViewChange = cy.stub();
    const onNavigate = cy.stub();

    mount(
      <ChakraProvider>
        <CalendarNavigation view="week" onViewChange={onViewChange} onNavigate={onNavigate} />
      </ChakraProvider>
    );

    cy.get('button[aria-label="Previous"]').click();
    cy.wrap(onNavigate).should('have.been.calledOnceWith', 'prev');

    cy.get('button[aria-label="Next"]').click();
    cy.wrap(onNavigate).should('have.been.calledWith', 'next');
  });

  it('뷰 선택을 변경할 수 있어야 한다.', () => {
    const onViewChange = cy.stub();
    const onNavigate = cy.stub();

    const TestComponent = () => {
      const [view, setView] = useState<'week' | 'month'>('week');

      return (
        <ChakraProvider>
          <CalendarNavigation
            view={view}
            onViewChange={(newView) => {
              setView(newView);
              onViewChange(newView);
            }}
            onNavigate={onNavigate}
          />
        </ChakraProvider>
      );
    };

    mount(<TestComponent />);

    cy.get('select[aria-label="view"]').select('month');
    cy.wrap(onViewChange).should('have.been.calledWith', 'month');

    cy.get('select[aria-label="view"]').select('week');
    cy.wrap(onViewChange).should('have.been.calledWith', 'week');

    cy.wrap(onViewChange).should('have.callCount', 2);
    cy.wrap(onViewChange).its('firstCall').should('have.been.calledWith', 'month');
    cy.wrap(onViewChange).its('secondCall').should('have.been.calledWith', 'week');
  });
});
