import { useState } from 'react';

import { Event, EventForm } from '../types';
import { findOverlappingEvents } from '../utils/eventOverlap';

const useEventOverlap = () => {
  const [isOverlapDialogOpen, setIsOverlapDialogOpen] = useState(false);
  const [overlappingEvents, setOverlappingEvents] = useState<Event[]>([]);

  const checkOverlap = (formData: Event | EventForm, events: Event[]) => {
    const overlapping = findOverlappingEvents(formData, events);
    if (overlapping.length > 0) {
      setOverlappingEvents(overlapping);
      setIsOverlapDialogOpen(true);
      return true;
    }
    return false;
  };

  return { isOverlapDialogOpen, overlappingEvents, checkOverlap, setIsOverlapDialogOpen };
};

export default useEventOverlap;
