import { GoogleGenAI } from "@google/genai";
import { GoldPriceData, PriceSource } from '../types';

// --- FOR LOCAL TESTING ONLY ---
// PASTE YOUR API KEY HERE and save the file.
const API_KEY_LOCAL_TEST = "AIzaSyAnpuDrDTD58Nv4s8S1C5GcSfR-myW0rF8"; 
// For a production environment, it's recommended to use environment variables.
// Do not commit this key to version control.


export const fetchGoldPrice = async (): Promise<GoldPriceData> => {
    let apiKeyFromEnv: string | undefined;
    try {
      // This will only work in a Node.js-like environment (e.g., a server).
      // It's wrapped in a try-catch to prevent a "process is not defined" error in the browser.
      apiKeyFromEnv = process.env.API_KEY;
    } catch (e) {
      // In a browser environment, `process` is not defined, leading to a ReferenceError.
      // We catch this error and proceed, as it's an expected condition for local development.
      apiKeyFromEnv = undefined;
    }
    
    // The hosted environment will have process.env.API_KEY.
    // For local testing in the browser, we fall back to the local constant.
    const API_KEY = apiKeyFromEnv || API_KEY_LOCAL_TEST;

    if (!API_KEY) {
        // This error message now guides the user on how to fix the issue for local development.
        throw new Error("获取黄金价格失败。 API_KEY 未配置。如需本地测试，请将您的密钥粘贴到 services/geminiService.ts 文件中的 API_KEY_LOCAL_TEST 变量中。");
    }

    const ai = new GoogleGenAI({ apiKey: API_KEY });

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: "请扮演金融数据提供者的角色。首先，请用中文提供一句关于当前人民币黄金价格趋势的简短总结。然后，提供一个JSON对象，包含以下键：'currentPrice' (数字，最新的人民币/克现货金价)，'yesterdayPrice' (数字，昨日人民币收盘价)，'prediction' (数字，对明日人民币金价的实际预测)，以及 'predictionExplanation' (字符串，用中文简要解释预测所考虑的因素，如市场趋势、新闻和技术指标)。JSON对象必须被包裹在markdown代码块中，格式如下：```json\n{...}\n```",
            config: {
                tools: [{googleSearch: {}}],
            },
        });

        const fullText = response.text.trim();
        
        const jsonRegex = /```json\n([\s\S]*?)\n```/;
        const jsonMatch = fullText.match(jsonRegex);

        if (!jsonMatch || !jsonMatch[1]) {
            throw new Error("无法在 API 响应中找到有效的 JSON 数据块。");
        }
        
        const jsonText = jsonMatch[1];
        const data = JSON.parse(jsonText);

        const summary = fullText.split('```json')[0].trim();

        const sources: PriceSource[] = [];
        const seenUris = new Set<string>();
        const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;

        if (chunks) {
            for (const chunk of chunks) {
                if (chunk.web && chunk.web.uri && !seenUris.has(chunk.web.uri)) {
                    sources.push({
                        uri: chunk.web.uri,
                        title: chunk.web.title || "Source",
                    });
                    seenUris.add(chunk.web.uri);
                }
            }
        }
        
        if (typeof data.currentPrice !== 'number' || typeof data.yesterdayPrice !== 'number' || typeof data.prediction !== 'number' || typeof data.predictionExplanation !== 'string') {
            throw new Error("从 API 收到的数据结构无效。");
        }

        return { ...data, summary, sources };
    } catch (error) {
        console.error("Error fetching gold price from Gemini API:", error);
        if (error instanceof Error) {
            if (error.message.includes('API key not valid')) {
                throw new Error("提供的 API 密钥无效。请检查您的配置。");
            }
            // Re-throw our specific, user-friendly error messages
            if (error.message.startsWith("获取黄金价格失败") || error.message.startsWith("无法在 API 响应中找到") || error.message.startsWith("从 API 收到的数据结构无效")) {
                throw error;
            }
        }
        throw new Error("从 Gemini API 获取数据失败。");
    }
};