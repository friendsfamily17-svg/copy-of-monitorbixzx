
import React from 'react';

interface ChartDataPoint {
  label: string;
  value: number;
}

interface BarChartProps {
  data: ChartDataPoint[];
}

const BarChart: React.FC<BarChartProps> = ({ data }) => {
  const maxValue = Math.max(...data.map(d => d.value), 1);
  const chartHeight = 200;

  if (data.length === 0) {
    return (
      <div style={{ height: `${chartHeight}px` }} className="flex items-center justify-center text-slate-500">
        <p>No production data to display.</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <style>{`
        .bar {
          transition: height 0.5s ease-out;
        }
        .bar-group:hover .bar {
          filter: brightness(1.25);
        }
        .bar-group:hover .tooltip {
          opacity: 1;
          transform: translateY(-8px);
        }
      `}</style>
      <div className="flex justify-around items-end" style={{ height: `${chartHeight}px` }}>
        {data.map((point) => (
          <div key={point.label} className="bar-group relative flex flex-col items-center h-full justify-end w-full px-2">
            <div className="tooltip absolute bottom-full mb-2 w-max px-2 py-1 bg-slate-900 text-white text-xs rounded opacity-0 transition-all duration-300 pointer-events-none">
              {point.value} Units
            </div>
            <div
              className="bar bg-gradient-to-t from-purple-600 to-cyan-500 w-full rounded-t-md"
              style={{ height: `${(point.value / maxValue) * 100}%` }}
            />
          </div>
        ))}
      </div>
      <div className="flex justify-around mt-2 text-xs text-slate-400 border-t border-slate-700 pt-2">
        {data.map(point => (
          <div key={point.label} className="w-full text-center px-1">{point.label}</div>
        ))}
      </div>
    </div>
  );
};

export default BarChart;