
import React from 'react';
import { StickerConfig } from '../types';

interface Props {
  config: StickerConfig;
  setConfig: React.Dispatch<React.SetStateAction<StickerConfig>>;
}

const Controls: React.FC<Props> = ({ config, setConfig }) => {
  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setConfig(prev => ({ ...prev, avatarUrl: event.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const colors = [
    '#ef4444', 
    '#f97316', 
    '#eab308', 
    '#3b82f6', 
    '#8b5cf6', 
    '#10b981', 
    '#000000', 
  ];

  return (
    <div className="space-y-8">
      {/* Aspect Ratio Selector */}
      <div>
        <label className="text-sm font-black text-gray-700 block mb-3">画面比例 Aspect Ratio</label>
        <div className="flex gap-3">
          {(['16:9', '1:1', '9:16'] as const).map(ratio => (
            <button
              key={ratio}
              onClick={() => setConfig(prev => ({ ...prev, aspectRatio: ratio }))}
              className={`flex-1 py-3 px-2 rounded-xl border-2 font-black text-sm transition-all ${
                config.aspectRatio === ratio 
                ? 'bg-orange-500 border-orange-500 text-white shadow-lg scale-105' 
                : 'bg-white border-gray-100 text-gray-400 hover:border-orange-200'
              }`}
            >
              {ratio}
            </button>
          ))}
        </div>
      </div>

      {/* Text Input */}
      <div>
        <div className="flex justify-between items-end mb-2">
          <label className="text-sm font-black text-gray-700">主标题 Text</label>
          <span className="text-[10px] text-gray-400 font-bold uppercase">支持换行</span>
        </div>
        <textarea
          value={config.text}
          onChange={(e) => setConfig(prev => ({ ...prev, text: e.target.value }))}
          className="w-full border-2 border-gray-100 rounded-2xl p-4 focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 focus:outline-none transition-all resize-none h-24 font-black text-xl tracking-tight"
          placeholder="输入文字..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Font Size Slider */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <label className="text-sm font-black text-gray-700">字体大小 Size</label>
            <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-lg text-[10px] font-black">{config.fontSize}px</span>
          </div>
          <input 
            type="range" 
            min="40" 
            max="200" 
            value={config.fontSize} 
            onChange={(e) => setConfig(prev => ({ ...prev, fontSize: parseInt(e.target.value) }))}
            className="w-full h-2 bg-gray-100 rounded-xl appearance-none cursor-pointer accent-orange-500"
          />
        </div>

        {/* Avatar Scale Slider */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <label className="text-sm font-black text-gray-700">头像缩放 Scale</label>
            <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-lg text-[10px] font-black">{Math.round(config.avatarScale * 100)}%</span>
          </div>
          <input 
            type="range" 
            min="0.2" 
            max="2.5" 
            step="0.05"
            value={config.avatarScale} 
            onChange={(e) => setConfig(prev => ({ ...prev, avatarScale: parseFloat(e.target.value) }))}
            className="w-full h-2 bg-gray-100 rounded-xl appearance-none cursor-pointer accent-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Background Color Picker */}
        <div>
          <label className="block text-sm font-black text-gray-700 mb-3">底色 Theme</label>
          <div className="flex flex-wrap gap-2 mb-3">
            {colors.map(c => (
              <button
                key={c}
                onClick={() => setConfig(prev => ({ ...prev, bgColor: c }))}
                className={`w-8 h-8 rounded-lg border-2 transition-all hover:scale-110 shadow-sm ${config.bgColor === c ? 'border-gray-300 scale-110' : 'border-transparent'}`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
          <input
            type="color"
            value={config.bgColor}
            onChange={(e) => setConfig(prev => ({ ...prev, bgColor: e.target.value }))}
            className="w-full h-10 rounded-xl cursor-pointer border-2 border-gray-100 p-1 bg-white"
          />
        </div>

        {/* Text Color Picker */}
        <div>
          <label className="block text-sm font-black text-gray-700 mb-3">文字色 Text</label>
          <div className="flex gap-2 mb-3">
             {['#ffffff', '#000000', '#facc15', '#fef08a'].map(c => (
              <button
                key={c}
                onClick={() => setConfig(prev => ({ ...prev, textColor: c }))}
                className={`w-8 h-8 rounded-lg border-2 transition-all hover:scale-110 shadow-sm ${config.textColor === c ? 'border-gray-300 scale-110' : 'border-transparent'}`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
          <input
            type="color"
            value={config.textColor}
            onChange={(e) => setConfig(prev => ({ ...prev, textColor: e.target.value }))}
            className="w-full h-10 rounded-xl cursor-pointer border-2 border-gray-100 p-1 bg-white"
          />
        </div>
      </div>

      {/* Avatar Upload */}
      <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
        <label className="block text-sm font-black text-gray-700 mb-4">人物头像 Avatar</label>
        <div className="flex items-center gap-6">
          <label className="flex-1 cursor-pointer bg-white hover:bg-gray-100 border-2 border-dashed border-gray-200 rounded-2xl p-6 transition-all text-center group">
            <svg className="w-8 h-8 mx-auto mb-2 text-gray-300 group-hover:text-orange-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
            <span className="text-xs text-gray-400 font-bold block">更换图像</span>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleAvatarUpload} 
              className="hidden" 
            />
          </label>
          {config.avatarUrl && (
            <div className="relative group shrink-0">
              <img 
                src={config.avatarUrl} 
                alt="preview" 
                className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-xl" 
              />
              <button 
                onClick={() => setConfig(prev => ({ ...prev, avatarUrl: null }))}
                className="absolute -top-3 -right-3 bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm shadow-xl transition-colors active:scale-90"
              >✕</button>
            </div>
          )}
        </div>
      </div>

      {/* Show Pointer Toggle */}
      <div className="flex items-center justify-between p-4 bg-orange-50 rounded-2xl border border-orange-100">
        <label htmlFor="showPointer" className="text-sm font-black text-gray-700 cursor-pointer select-none">显示对话尖角 Bubble Pointer</label>
        <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full shadow-inner bg-gray-200">
          <input 
            type="checkbox" 
            id="showPointer"
            checked={config.showPointer}
            onChange={(e) => setConfig(prev => ({ ...prev, showPointer: e.target.checked }))}
            className="absolute z-10 w-6 h-6 rounded-full appearance-none cursor-pointer bg-white border-2 border-gray-100 checked:right-0 checked:bg-orange-500 transition-all right-6"
          />
          <div className={`absolute inset-0 rounded-full transition-colors ${config.showPointer ? 'bg-orange-500' : 'bg-gray-200'}`}></div>
        </div>
      </div>
    </div>
  );
};

export default Controls;
