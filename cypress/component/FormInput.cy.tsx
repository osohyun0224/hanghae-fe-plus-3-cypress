import React, { useState } from 'react';
import { mount } from '@cypress/react18';
import { ChakraProvider } from '@chakra-ui/react';
import FormInput from '../../src/components/common/FormInput';

const FormInputWrapper = ({ label, initialValue }: { label: string; initialValue: string }) => {
  const [value, setValue] = useState(initialValue);

  return (
    <ChakraProvider>
      <FormInput label={label} value={value} onChange={(e) => setValue(e.target.value)} />
    </ChakraProvider>
  );
};

describe('FormInput.cy.tsx', () => {
  it('레이블과 입력 필드를 올바르게 렌더링해야 한다.', () => {
    const label = '이름';
    const initialValue = '오소현';

    mount(<FormInputWrapper label={label} initialValue={initialValue} />);

    cy.contains(label).should('be.visible');

    cy.get('input').should('have.value', initialValue);
  });

  it('입력 값이 변경될 때 onChange 핸들러가 호출되어야 한다.', () => {
    const label = '이메일';
    const initialValue = '';

    mount(<FormInputWrapper label={label} initialValue={initialValue} />);

    const newValue = 'test@example.com';
    cy.get('input').type(newValue);

    cy.get('input').should('have.value', newValue);
  });

  it('입력 필드에 글자를 입력할 수 있어야 한다.', () => {
    const label = '메시지';
    const initialValue = '';

    mount(<FormInputWrapper label={label} initialValue={initialValue} />);

    const inputText = 'Harry와 1-on-1';
    cy.get('input').type(inputText);

    cy.get('input').should('have.value', inputText);
  });
}); 