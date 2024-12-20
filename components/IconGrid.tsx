'use client';

import React from 'react';
import { IconMetadata } from '@/types/icon';
import Icon from './Icon';
import { useVirtualizer, VirtualItem } from '@tanstack/react-virtual';
import { Eye, Download, Link } from 'lucide-react';
import { Button } from './ui/button';

interface IconGridProps {
  icons: IconMetadata[];
  columns?: number;
  onIconSelect?: (icon: IconMetadata) => void;
  onIconDownload?: (icon: IconMetadata) => void;
  onIconCopy?: (icon: IconMetadata) => void;
}

const IconGrid = ({ 
  icons, 
  columns = 4,
  onIconSelect,
  onIconDownload,
  onIconCopy
}: IconGridProps) => {
  const parentRef = React.useRef<HTMLDivElement>(null);
  
  const rowVirtualizer = useVirtualizer({
    count: Math.ceil(icons.length / columns),
    getScrollElement: () => parentRef.current,
    estimateSize: () => 160, // Increased row height for bigger previews
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
                absolute top-0 left-0 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6
                w-full p-4
              `}
              style={{
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              {rowIcons.map((icon) => (
                <div 
                  key={icon.path} 
                  className="group relative flex flex-col items-center gap-2 p-4 border rounded-lg hover:border-blue-500 transition-colors"
                >
                  <Icon
                    icon={icon}
                    className="p-2"
                  />
                  <span className="text-xs text-gray-600 text-center">
                    {icon.name}
                  </span>
                  <span className="text-xs text-gray-400">
                    {icon.size}px
                  </span>
                  
                  <div className="absolute inset-0 bg-white/90 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onIconSelect?.(icon)}
                      className="w-10 h-10 p-0"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onIconDownload?.(icon)}
                      className="w-10 h-10 p-0"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onIconCopy?.(icon)}
                      className="w-10 h-10 p-0"
                    >
                      <Link className="h-4 w-4" />
                    </Button>
                  </div>
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