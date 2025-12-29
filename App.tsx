
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { StickerConfig, SloganSuggestion } from './types';
import StickerPreview from './components/StickerPreview';
import Controls from './components/Controls';
import SloganGenerator from './components/SloganGenerator';

const DEFAULT_CONFIG: StickerConfig = {
  text: '新 销 冠',
  bgColor: '#ef4444', 
  textColor: '#ffffff',
  avatarUrl: 'https://picsum.photos/400/600',
  avatarScale: 1.0, // Default scale
  aspectRatio: '16:9', // Default ratio as requested
  fontSize: 100,
  showPointer: true,
};

const App: React.FC = () => {
  const [config, setConfig] = useState<StickerConfig>(DEFAULT_CONFIG);
  const [suggestions, setSuggestions] = useState<SloganSuggestion[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  const handleDownload = async () => {
    const canvas = document.getElementById('sticker-canvas') as HTMLCanvasElement;
    if (canvas) {
      const link = document.createElement('a');
      link.download = `wechat-sticker-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    }
  };

  const generateSlogans = async (topic: string) => {
    setLoadingSuggestions(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Generate 5 short, high-energy Chinese slogans for a WeChat sticker about: ${topic}. Each slogan should be extremely short (2-5 characters). Return as a JSON array of objects with 'text' and 'category'.`,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                text: { type: Type.STRING },
                category: { type: Type.STRING }
              },
              required: ['text', 'category']
            }
          }
        }
      });
      
      const result = JSON.parse(response.text);
      setSuggestions(result);
    } catch (error) {
      console.error("Failed to generate slogans", error);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-8 px-4">
      <header className="max-w-4xl w-full mb-8 text-center">
        <h1 className="text-4xl font-black text-gray-900 mb-2 tracking-tight">微信艺术表情包制作</h1>
        <p className="text-gray-500 font-medium italic">WeChat Sticker Studio - 艺术字 & 自由排版</p>
      </header>

      <main className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Left Side: Preview & Download */}
        <div className="flex flex-col items-center">
          <div className="bg-white p-6 sm:p-8 rounded-[2rem] shadow-2xl border border-gray-100 sticky top-8 w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest">实时预览 Preview</h2>
              <div className="flex gap-2">
                <span className="bg-orange-100 text-orange-600 px-2 py-0.5 rounded text-[10px] font-bold">艺术字</span>
                <span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded text-[10px] font-bold">{config.aspectRatio}</span>
              </div>
            </div>
            
            <div className="relative group overflow-hidden rounded-2xl bg-gray-50">
              <StickerPreview config={config} />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-5 transition-all pointer-events-none"></div>
            </div>
            
            <div className="mt-8 flex gap-4">
              <button
                onClick={handleDownload}
                className="flex-1 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-black py-5 px-6 rounded-2xl shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3 text-lg"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                下载高清表情
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-5 text-center leading-relaxed">
              高清导出，支持直接拖拽至微信聊天框<br/>
              <span className="text-gray-300 font-bold">建议上传透明底 PNG 图像以获得极致效果</span>
            </p>
          </div>
        </div>

        {/* Right Side: Controls & AI */}
        <div className="space-y-8 w-full">
          <section className="bg-white p-6 sm:p-8 rounded-[2rem] shadow-lg border border-gray-100">
            <h2 className="text-xl font-black text-gray-800 mb-8 flex items-center gap-3">
              <span className="bg-orange-500 p-2 rounded-xl"><svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path></svg></span>
              艺术字编辑器
            </h2>
            <Controls config={config} setConfig={setConfig} />
          </section>

          <section className="bg-white p-6 sm:p-8 rounded-[2rem] shadow-lg border border-gray-100">
            <h2 className="text-xl font-black text-gray-800 mb-6 flex items-center gap-3">
              <span className="bg-blue-500 p-2 rounded-xl"><svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M11.3 1.047a1 1 0 01.897.95L12.25 2.25V5c0 .552.448 1 1 1h2.75l.053-.003a1 1 0 01.95.897l.003.053V13a3 3 0 01-3 3H5a3 3 0 01-3-3V5a3 3 0 013-3h5.25l.053-.003zM14 11a1 1 0 10-2 0 1 1 0 002 0zm-7-2a1 1 0 112 0 1 1 0 01-2 0zm1 4a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd"></path></svg></span>
              文案助手
            </h2>
            <SloganGenerator 
              onGenerate={generateSlogans} 
              suggestions={suggestions} 
              onSelect={(text) => setConfig(prev => ({ ...prev, text }))}
              loading={loadingSuggestions}
            />
          </section>
        </div>
      </main>

      <footer className="mt-16 text-gray-400 text-sm pb-8 font-medium">
        &copy; 2024 WeChat Sticker Studio. Professional Edition.
      </footer>
    </div>
  );
};

export default App;
