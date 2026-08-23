import React from 'react';

interface PixelMosaicProps {
  className?: string;
  rows?: number;
  cols?: number;
  density?: 'sparse' | 'medium' | 'dense';
}

export const PixelMosaic: React.FC<PixelMosaicProps> = ({
  className = '',
  rows = 8,
  cols = 8,
  density = 'dense'
}) => {
  // Palette of warm terracotta, safety orange, peach, cream, pink tones
  const colors = [
    '#e8622c', // safety orange
    '#f97316', // bright orange
    '#ea580c', // deep orange
    '#fb923c', // light orange
    '#fdba74', // peach
    '#fed7aa', // soft cream peach
    '#f43f5e', // rose coral
    '#fb7185', // soft rose
    '#ffedd5', // pale cream
  ];

  // Generate deterministic-looking organic grid
  const gridCells = React.useMemo(() => {
    const cells = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        // Bias density towards top right
        const distFromTopRight = Math.sqrt(Math.pow(cols - 1 - c, 2) + Math.pow(r, 2));
        const maxDist = Math.sqrt(Math.pow(cols, 2) + Math.pow(rows, 2));
        const normalizedDist = distFromTopRight / maxDist; // 0 at top right, 1 at bottom left
        
        // Probability of showing a pixel
        const threshold = density === 'dense' ? 0.75 : density === 'medium' ? 0.55 : 0.35;
        const shouldRender = Math.sin(r * 3 + c * 7) * 0.5 + 0.5 > normalizedDist * (1.2 - threshold);
        
        if (shouldRender) {
          const colorIdx = Math.abs(Math.floor((Math.sin(r * 11 + c * 13) * 100) % colors.length));
          const opacity = Math.max(0.2, 1 - normalizedDist * 0.85);
          cells.push({
            r,
            c,
            color: colors[colorIdx],
            opacity: Number(opacity.toFixed(2))
          });
        }
      }
    }
    return cells;
  }, [rows, cols, density]);

  return (
    <div
      className={`grid gap-1.5 sm:gap-2 select-none pointer-events-none ${className}`}
      style={{
        gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
        gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`
      }}
      aria-hidden="true"
    >
      {Array.from({ length: rows * cols }).map((_, idx) => {
        const r = Math.floor(idx / cols);
        const c = idx % cols;
        const cell = gridCells.find(cell => cell.r === r && cell.c === c);

        if (!cell) {
          return <div key={idx} className="w-full aspect-square opacity-0" />;
        }

        return (
          <div
            key={idx}
            className="w-full aspect-square rounded-sm sm:rounded-md transition-all duration-300 transform hover:scale-110"
            style={{
              backgroundColor: cell.color,
              opacity: cell.opacity,
              boxShadow: cell.opacity > 0.6 ? `0 2px 8px ${cell.color}40` : undefined
            }}
          />
        );
      })}
    </div>
  );
};

export default PixelMosaic;
