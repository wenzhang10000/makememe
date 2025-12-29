
import React, { useState } from 'react';
import { SloganSuggestion } from '../types';

interface Props {
  onGenerate: (topic: string) => Promise<void>;
  suggestions: SloganSuggestion[];
  onSelect: (text: string) => void;
  loading: boolean;
}

const SloganGenerator: React.FC<Props> = ({ onGenerate, suggestions, onSelect, loading }) => {
  const [topic, setTopic] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim()) {
      onGenerate(topic);
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="输入主题，如：夸夸、职场、离职..."
          className="flex-1 border-2 border-gray-100 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
        />
        <button
          type="submit"
          disabled={loading || !topic}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-bold py-2 px-6 rounded-xl transition-all shadow-md active:scale-95"
        >
          {loading ? 'AI 思考中...' : '生成灵感'}
        </button>
      </form>

      {suggestions.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
          {suggestions.map((s, idx) => (
            <button
              key={idx}
              onClick={() => onSelect(s.text)}
              className="text-left p-3 border-2 border-gray-50 rounded-xl hover:border-blue-200 hover:bg-blue-50 transition-all group"
            >
              <div className="text-xs text-blue-400 font-bold mb-1 uppercase tracking-tighter">{s.category}</div>
              <div className="text-gray-800 font-bold group-hover:text-blue-700">{s.text}</div>
            </button>
          ))}
        </div>
      )}
      
      {suggestions.length === 0 && !loading && (
        <div className="flex flex-wrap gap-2">
          {['销冠时刻', '老板开门', '打工人加油', '下班万岁', '真的服了'].map(tag => (
            <button
              key={tag}
              onClick={() => onGenerate(tag)}
              className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-xs font-bold text-gray-500 transition-all"
            >
              # {tag}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SloganGenerator;
