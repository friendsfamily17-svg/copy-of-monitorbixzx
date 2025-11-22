
import React from 'react';

interface PieChartDataPoint {
  label: string;
  value: number;
  color: string;
}

interface PieChartProps {
  data: PieChartDataPoint[];
}

const PieSlice: React.FC<{ slice: PieChartDataPoint; percentage: number; startAngle: number; endAngle: number }> = ({ slice, percentage, startAngle, endAngle }) => {
  const getCoordinates = (angle: number) => {
    const x = Math.cos(angle * Math.PI / 180);
    const y = Math.sin(angle * Math.PI / 180);
    return [x, y];
  };

  const [startX, startY] = getCoordinates(startAngle);
  const [endX, endY] = getCoordinates(endAngle);

  const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;

  const pathData = [
    `M ${startX} ${startY}`, // Move
    `A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}`, // Arc
    `L 0 0`, // Line to center
  ].join(' ');

  return (
    <g className="pie-slice-group transform transition-transform duration-200 hover:scale-105">
      <path d={pathData} fill={slice.color} />
      <title>{`${slice.label}: ${slice.value} (${percentage.toFixed(1)}%)`}</title>
    </g>
  );
};

const PieChart: React.FC<PieChartProps> = ({ data }) => {
  const total = data.reduce((acc, d) => acc + d.value, 0);

  if (data.length === 0 || total === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-slate-500">
        <p>No data to display in chart.</p>
      </div>
    );
  }

  let cumulativeAngle = 0;

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6 h-full">
      <div className="relative w-48 h-48 sm:w-56 sm:h-56">
        <svg viewBox="-1 -1 2 2" className="transform -rotate-90">
          {data.map(slice => {
            const percentage = (slice.value / total) * 100;
            const angle = (slice.value / total) * 360;
            const startAngle = cumulativeAngle;
            cumulativeAngle += angle;
            const endAngle = cumulativeAngle;

            return (
              <PieSlice
                key={slice.label}
                slice={slice}
                percentage={percentage}
                startAngle={startAngle}
                endAngle={endAngle}
              />
            );
          })}
        </svg>
      </div>
      <div className="flex-1 w-full">
        <ul className="space-y-2">
          {data.map(slice => (
            <li key={slice.label} className="flex items-center text-sm">
              <span style={{ backgroundColor: slice.color }} className="w-4 h-4 rounded-full mr-3 flex-shrink-0"></span>
              <span className="text-slate-300 font-medium truncate">{slice.label}</span>
              <span className="ml-auto text-slate-400 flex-shrink-0 pl-2">{slice.value} ({((slice.value / total) * 100).toFixed(1)}%)</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PieChart;
