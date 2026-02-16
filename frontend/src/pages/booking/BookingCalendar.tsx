import React from 'react';
import { DayPicker } from 'react-day-picker';
import { fr } from 'date-fns/locale';
import { format } from 'date-fns';

interface BookingCalendarProps {
  selectedRange: { from: Date | undefined; to: Date | undefined };
  setSelectedRange: (range: { from: Date | undefined; to: Date | undefined }) => void;
  disabledDays?: Date[];
}

export default function BookingCalendar({ 
  selectedRange, 
  setSelectedRange,
  disabledDays = []
}: BookingCalendarProps) {
  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <DayPicker
        mode="range"
        selected={selectedRange}
        onSelect={(range: any) => setSelectedRange(range)}
        locale={fr}
        disabled={[
          ...disabledDays,
          { before: new Date() }
        ]}
        modifiers={{
          booked: disabledDays
        }}
        modifiersStyles={{
          booked: { 
            backgroundColor: '#FEE2E2',
            textDecoration: 'line-through' 
          }
        }}
        styles={{
          caption: { color: '#1E40AF' },
          head: { color: '#6B7280' },
          day: { margin: '2px' },
          selected: {
            backgroundColor: '#2563EB',
            color: 'white',
            borderRadius: '8px'
          }
        }}
      />
    </div>
  );
}