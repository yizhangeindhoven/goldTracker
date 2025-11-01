import React, { useState, useEffect, useCallback } from 'react';
import { GoldPriceData } from './types';
import { fetchGoldPrice } from './services/geminiService';
import PriceDisplay from './components/PriceDisplay';
import StatCard from './components/StatCard';
import LoadingSpinner from './components/LoadingSpinner';
import PredictionModal from './components/PredictionModal';

const App: React.FC = () => {
  const [goldData, setGoldData] = useState<GoldPriceData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [isPredictionModalOpen, setPredictionModalOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const getGoldPrice = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchGoldPrice();
      setGoldData(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '发生未知错误。';
      setError(errorMessage);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getGoldPrice();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center text-center">
          <LoadingSpinner />
          <p className="mt-4 text-lg text-yellow-300">正在获取最新黄金价格...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center bg-red-900/50 border border-red-500/50 p-4 rounded-lg">
          <p className="text-red-300 text-lg mb-4 font-semibold">发生错误</p>
          <p className="text-red-400 text-base mb-4">{error}</p>
          <button
            onClick={getGoldPrice}
            className="px-6 py-2 bg-yellow-500 text-gray-900 font-bold rounded-lg hover:bg-yellow-400 transition-colors"
          >
            重试
          </button>
        </div>
      );
    }

    if (goldData) {
      return (
        <>
          <PriceDisplay price={goldData.currentPrice} />
          {goldData.summary && (
            <p className="text-center text-gray-300 mt-2 mb-6 italic max-w-md">
              "{goldData.summary}"
            </p>
          )}
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-2">
            <StatCard
              title="与昨日对比"
              currentValue={goldData.currentPrice}
              comparisonValue={goldData.yesterdayPrice}
            />
            <StatCard
              title="明日预测"
              currentValue={goldData.currentPrice}
              comparisonValue={goldData.prediction}
              isPrediction={true}
              onIconClick={() => setPredictionModalOpen(true)}
            />
          </div>
        </>
      );
    }

    return null;
  };

  return (
    <>
      <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4 font-sans">
        <div className="w-full max-w-2xl mx-auto bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl shadow-yellow-500/10 border border-yellow-500/20 p-6 md:p-8">
          <header className="text-center border-b border-gray-700 pb-4 mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-yellow-400 tracking-wider">
              黄金价格追踪
            </h1>
            <p className="text-gray-400 mt-2 text-sm md:text-base">
              {currentTime.toLocaleString('zh-CN', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
              })}
            </p>
          </header>
          <main className="flex flex-col items-center">
            {renderContent()}
          </main>
        </div>
        <footer className="text-center mt-8 text-gray-500 text-sm w-full max-w-2xl mx-auto px-4">
          <p>由 Gemini API 驱动</p>
          {goldData?.sources && goldData.sources.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-700">
                <h4 className="font-semibold text-gray-400 mb-2">数据来源</h4>
                <ul className="flex flex-wrap justify-center gap-x-4 gap-y-2">
                    {goldData.sources.map((source, index) => (
                        <li key={index}>
                            <a 
                                href={source.uri} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-yellow-500 hover:text-yellow-400 hover:underline transition-colors"
                                aria-label={`在 ${source.title} 阅读更多`}
                            >
                                {source.title}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
          )}
        </footer>
      </div>
      {isPredictionModalOpen && goldData?.predictionExplanation && (
        <PredictionModal 
          explanation={goldData.predictionExplanation}
          onClose={() => setPredictionModalOpen(false)}
        />
      )}
    </>
  );
};

export default App;