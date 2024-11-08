/* eslint-disable no-unused-vars */
import { FormControl, FormLabel, HStack, Input, Tooltip } from '@chakra-ui/react';
import React from 'react';

import { getTimeErrorMessage } from '../../utils/timeValidation';

interface TimeInputsProps {
  startTime: string;
  endTime: string;
  onStartTimeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onEndTimeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  startTimeError: string | null;
  endTimeError: string | null;
}

function TimeInputs({
  startTime,
  endTime,
  onStartTimeChange,
  onEndTimeChange,
  startTimeError,
  endTimeError,
}: TimeInputsProps) {
  return (
    <HStack width="100%">
      <FormControl>
        <FormLabel>시작 시간</FormLabel>
        <Tooltip label={startTimeError} isOpen={!!startTimeError} placement="top">
          <Input
            type="time"
            value={startTime}
            onChange={onStartTimeChange}
            onBlur={() => getTimeErrorMessage(startTime, endTime)}
            isInvalid={!!startTimeError}
          />
        </Tooltip>
      </FormControl>
      <FormControl>
        <FormLabel>종료 시간</FormLabel>
        <Tooltip label={endTimeError} isOpen={!!endTimeError} placement="top">
          <Input
            type="time"
            value={endTime}
            onChange={onEndTimeChange}
            onBlur={() => getTimeErrorMessage(startTime, endTime)}
            isInvalid={!!endTimeError}
          />
        </Tooltip>
      </FormControl>
    </HStack>
  );
}

export default TimeInputs;
