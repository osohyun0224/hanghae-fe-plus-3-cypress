import { BellIcon } from '@chakra-ui/icons';
import {
  Box,
  Heading,
  HStack,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
} from '@chakra-ui/react';
import React from 'react';

import { weekDays } from '../../constants';
import { useWeekEvents } from '../../hooks/useWeekEvents';
import { Event } from '../../types';
import { formatWeek, getWeekDates } from '../../utils/dateUtils';

interface Props {
  currentDate: Date;
  notifiedEvents: string[];
  filteredEvents: Event[];
}

const WeekView: React.FC<Props> = ({ currentDate, notifiedEvents, filteredEvents }) => {
  const weekDates = getWeekDates(currentDate);
  const { getEventsForDate } = useWeekEvents(filteredEvents, notifiedEvents);

  return (
    <VStack data-testid="week-view" align="stretch" w="full" spacing={4}>
      <Heading size="md">{formatWeek(currentDate)}</Heading>
      <Table variant="simple" w="full">
        <Thead>
          <Tr>
            {weekDays.map((day) => (
              <Th key={day} width="14.28%">
                {day}
              </Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            {weekDates.map((date) => (
              <Td key={date.toISOString()} height="100px" verticalAlign="top" width="14.28%">
                <Text fontWeight="bold">{date.getDate()}</Text>
                {getEventsForDate(date).map((event) => (
                  <Box
                    key={event.id}
                    p={1}
                    my={1}
                    bg={event.isNotified ? 'red.100' : 'gray.100'}
                    borderRadius="md"
                    data-testid="event-container"
                  >
                    <HStack spacing={1}>
                      {event.isNotified && <BellIcon data-testid="bell-icon" />}
                      <Text fontSize="sm" noOfLines={1}>
                        {event.title}
                      </Text>
                    </HStack>
                  </Box>
                ))}
              </Td>
            ))}
          </Tr>
        </Tbody>
      </Table>
    </VStack>
  );
};

export default WeekView;
