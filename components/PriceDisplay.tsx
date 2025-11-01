import React from 'react';

interface PriceDisplayProps {
  price: number;
}

const PriceDisplay: React.FC<PriceDisplayProps> = ({ price }) => {
  return (
    <div className="text-center my-4">
      <p className="text-lg text-gray-400">当前价格 (人民币/克)</p>
      <div className="flex items-center justify-center">
        <span className="text-6xl md:text-7xl font-bold text-yellow-400 tracking-tighter">
          ¥{price.toFixed(2)}
        </span>
      </div>
    </div>
  );
};

export default PriceDisplay;