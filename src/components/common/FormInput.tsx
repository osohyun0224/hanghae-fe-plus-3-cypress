/* eslint-disable no-unused-vars */
import { FormControl, FormLabel, Input } from '@chakra-ui/react';
import React from 'react';

interface FormInputProps {
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FormInput: React.FC<FormInputProps> = ({ label, type = 'text', value, onChange }) => (
  <FormControl>
    <FormLabel>{label}</FormLabel>
    <Input type={type} value={value} onChange={onChange} />
  </FormControl>
);

export default FormInput;
