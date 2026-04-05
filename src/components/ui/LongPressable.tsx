import React from 'react';
import { useLongPress } from '../../hooks/useLongPress';

interface LongPressableProps {
  onLongPress: () => void;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  key?: React.Key;
}

export function LongPressable({ onLongPress, onClick = () => {}, children, className }: LongPressableProps) {
  const longPressProps = useLongPress(onLongPress, onClick);
  
  return (
    <div {...longPressProps} className={className}>
      {children}
    </div>
  );
}
