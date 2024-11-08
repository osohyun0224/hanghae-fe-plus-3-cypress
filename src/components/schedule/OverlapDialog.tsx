import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Text,
} from '@chakra-ui/react';
import { RefObject } from 'react';

import { Event } from '../../types';

interface OverlapDialogProps {
  isOpen: boolean;
  onClose: () => void;
  cancelRef: RefObject<HTMLButtonElement>;
  overlappingEvents: Event[];
  onConfirm: () => void;
}

function OverlapDialog({
  isOpen,
  onClose,
  cancelRef,
  overlappingEvents,
  onConfirm,
}: OverlapDialogProps) {
  return (
    <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            일정 겹침 경고
          </AlertDialogHeader>

          <AlertDialogBody>
            <Text data-testid="overlap-warning">다음 일정과 겹칩니다:</Text>
            {overlappingEvents.map((event) => (
              <Text key={event.id}>
                {event.title} ({event.date} {event.startTime}-{event.endTime})
              </Text>
            ))}
            <Text data-testid="confirm-message">계속 진행하시겠습니까?</Text>
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose} data-testid="cancel-button">
              취소
            </Button>
            <Button colorScheme="red" onClick={onConfirm} ml={3} data-testid="confirm-button">
              계속 진행
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}

export default OverlapDialog;
