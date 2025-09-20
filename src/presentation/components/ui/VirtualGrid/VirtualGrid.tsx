import { memo, useState, useEffect, useRef, useMemo, useCallback } from "react";
import type { ReactNode } from "react";
import "./VirtualGrid.scss";

interface VirtualGridProps {
  items: any[];
  renderItem: (item: any, index: number) => ReactNode;
  itemHeight: number;
  itemWidth: number;
  containerHeight: number;
  gap?: number;
  className?: string;
}

const VirtualGrid = memo(
  ({
    items,
    renderItem,
    itemHeight,
    itemWidth,
    containerHeight,
    gap = 24,
    className = "",
  }: VirtualGridProps) => {
    const [scrollTop, setScrollTop] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    const { columnsPerRow, startIndex, endIndex, totalHeight } = useMemo(() => {
      if (!containerRef.current) {
        return {
          columnsPerRow: 1,
          visibleRows: 0,
          startIndex: 0,
          endIndex: 0,
          totalHeight: 0,
        };
      }

      const containerWidth = containerRef.current.clientWidth;
      const columnsPerRow = Math.floor(
        (containerWidth + gap) / (itemWidth + gap)
      );
      const totalRows = Math.ceil(items.length / columnsPerRow);
      const rowHeight = itemHeight + gap;

      const visibleRows = Math.ceil(containerHeight / rowHeight) + 2; // Buffer rows
      const startRow = Math.max(0, Math.floor(scrollTop / rowHeight) - 1);
      const endRow = Math.min(totalRows, startRow + visibleRows);

      const startIndex = startRow * columnsPerRow;
      const endIndex = Math.min(items.length, endRow * columnsPerRow);
      const totalHeight = totalRows * rowHeight - gap;

      return { columnsPerRow, visibleRows, startIndex, endIndex, totalHeight };
    }, [items.length, itemHeight, itemWidth, containerHeight, gap, scrollTop]);

    const visibleItems = useMemo(() => {
      return items.slice(startIndex, endIndex);
    }, [items, startIndex, endIndex]);

    const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
      setScrollTop(e.currentTarget.scrollTop);
    }, []);

    useEffect(() => {
      // Reset scroll when items change significantly
      if (containerRef.current && items.length === 0) {
        containerRef.current.scrollTop = 0;
        setScrollTop(0);
      }
    }, [items.length]);

    const getItemStyle = useCallback(
      (index: number) => {
        const globalIndex = startIndex + index;
        const row = Math.floor(globalIndex / columnsPerRow);
        const col = globalIndex % columnsPerRow;

        return {
          position: "absolute" as const,
          top: row * (itemHeight + gap),
          left: col * (itemWidth + gap),
          width: itemWidth,
          height: itemHeight,
        };
      },
      [startIndex, columnsPerRow, itemHeight, itemWidth, gap]
    );

    if (items.length === 0) {
      return null;
    }

    return (
      <div
        ref={containerRef}
        className={`virtual-grid ${className}`}
        style={{ height: containerHeight, overflow: "auto" }}
        onScroll={handleScroll}
      >
        <div
          className="virtual-grid__container"
          style={{
            position: "relative",
            height: totalHeight,
          }}
        >
          {visibleItems.map((item, index) => (
            <div
              key={startIndex + index}
              style={getItemStyle(index)}
              className="virtual-grid__item"
            >
              {renderItem(item, startIndex + index)}
            </div>
          ))}
        </div>
      </div>
    );
  }
);

VirtualGrid.displayName = "VirtualGrid";

export default VirtualGrid;
