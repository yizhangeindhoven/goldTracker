export interface PriceSource {
  title: string;
  uri: string;
}

export interface GoldPriceData {
  currentPrice: number;
  yesterdayPrice: number;
  prediction: number;
  predictionExplanation?: string;
  sources?: PriceSource[];
  summary?: string;
}