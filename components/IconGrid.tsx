'use client';

import React from 'react';
import { IconMetadata } from '@/types/icon';
import Icon from './Icon';
import { useVirtualizer, VirtualItem } from '@tanstack/react-virtual';

interface IconGridProps {
  icons: IconMetadata[];
  columns?: number;
}

const IconGrid = ({ icons, columns = 6 }: IconGridProps) => {
  const parentRef = React.useRef<HTMLDivElement>(null);
  
  const rowVirtualizer = useVirtualizer({
    count: Math.ceil(icons.length / columns),
    getScrollElement: () => parentRef.current,
    estimateSize: () => 100, // Increased row height for better spacing
    overscan: 5,
  });

  return (
    <div 
      ref={parentRef}
      className="h-[600px] overflow-auto"
    >
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow: VirtualItem) => {
          const startIndex = virtualRow.index * columns;
          const rowIcons = icons.slice(startIndex, startIndex + columns);

          return (
            <div
              key={virtualRow.index}
              className={`
                absolute top-0 left-0 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4
                w-full p-4
              `}
              style={{
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              {rowIcons.map((icon) => (
                <div key={icon.path} className="flex flex-col items-center gap-2">
                  <Icon
                    icon={icon}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  />
                  <span className="text-xs text-gray-600 text-center">
                    {icon.name}
                  </span>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default IconGrid; 