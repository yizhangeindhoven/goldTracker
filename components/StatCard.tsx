import React from 'react';

interface StatCardProps {
  title: string;
  currentValue: number;
  comparisonValue: number;
  isPrediction?: boolean;
  onIconClick?: () => void;
}

const UpArrow = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
    </svg>
);

const DownArrow = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
);

const InfoIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 hover:text-gray-300 transition-colors" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
    </svg>
);


const StatCard: React.FC<StatCardProps> = ({ title, currentValue, comparisonValue, isPrediction = false, onIconClick }) => {
  const difference = isPrediction ? comparisonValue - currentValue : currentValue - comparisonValue;
  const percentageChange = (difference / comparisonValue) * 100;
  const isPositive = difference >= 0;

  const colorClass = isPositive ? 'text-green-400' : 'text-red-400';
  const bgClass = isPositive ? 'bg-green-500/10' : 'bg-red-500/10';
  
  const getTrendDescription = () => {
    if (isPrediction) {
      return isPositive ? '预测上涨' : '预测下跌';
    }
    return isPositive ? '上涨' : '下跌';
  };

  return (
    <div className="bg-gray-700/50 rounded-lg p-4 w-full flex flex-col justify-between border border-gray-600">
      <div>
        <div className="flex justify-between items-center">
            <h3 className="text-gray-400 text-sm font-medium">{title}</h3>
            {isPrediction && onIconClick && (
                <button onClick={onIconClick} aria-label="显示预测说明">
                    <InfoIcon />
                </button>
            )}
        </div>
        <p className="text-2xl font-semibold text-white mt-1">
          ¥{comparisonValue.toFixed(2)}
        </p>
      </div>
      <div className={`mt-3 inline-flex items-center text-sm font-semibold px-2.5 py-1 rounded-full ${colorClass} ${bgClass}`}>
        {isPositive ? <UpArrow /> : <DownArrow />}
        <span>
          {percentageChange.toFixed(2)}% ({getTrendDescription()})
        </span>
      </div>
    </div>
  );
};

export default StatCard;