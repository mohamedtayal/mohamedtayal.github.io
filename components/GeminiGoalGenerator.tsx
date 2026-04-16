import React, { useState } from 'react';
import { Goal, GoalSuggestion } from '../types';
import { SparklesIcon } from './icons/Icons';

interface GeminiGoalGeneratorProps {
  onAddGoal: (newGoal: Omit<Goal, 'id' | 'createdAt' | 'milestones'>) => void;
}

const GeminiGoalGenerator: React.FC<GeminiGoalGeneratorProps> = ({ onAddGoal }) => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<GoalSuggestion | null>(null);
  const [error, setError] = useState('');

  const generateGoal = async () => {
    if (!prompt.trim()) {
      setError('Please describe what you want to achieve.');
      return;
    }
    setError('');
    setIsLoading(true);
    setSuggestion(null);

    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey === 'PLACEHOLDER_API_KEY') {
        throw new Error('Gemini API key is not configured. Please set GEMINI_API_KEY in your .env.local file.');
      }

      const { GoogleGenAI } = await import('@google/genai');
      const ai = new GoogleGenAI({ apiKey });

      const systemPrompt = `You are a SMART goal coach. Given a user's goal description, return a JSON object with the following fields:
- specific: A specific, clear goal statement
- measurable: How progress and success will be measured
- achievable: Why this goal is realistic and what resources are needed
- relevant: Why this goal matters and aligns with broader objectives
- timeBoundDays: Number of days to complete the goal (integer)

Return ONLY valid JSON, no markdown or explanation.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: `${systemPrompt}\n\nUser goal: ${prompt}`,
      });

      const text = response.text ?? '';
      const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const parsed: GoalSuggestion = JSON.parse(cleaned);
      setSuggestion(parsed);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to generate goal suggestion.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSuggestion = () => {
    if (!suggestion) return;
    const deadline = new Date();
    deadline.setDate(deadline.getDate() + suggestion.timeBoundDays);
    onAddGoal({
      title: suggestion.specific,
      measurement: suggestion.measurable,
      achievability: suggestion.achievable,
      relevance: suggestion.relevant,
      deadline: deadline.toISOString().split('T')[0],
    });
    setSuggestion(null);
    setPrompt('');
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
          <SparklesIcon className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-800">AI Goal Generator</h3>
          <p className="text-sm text-slate-500">Powered by Gemini — describe your goal and we'll make it SMART</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          className="flex-1 border border-blue-200 bg-white rounded-lg px-4 py-2.5 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g. I want to get fit, learn a skill, advance my career..."
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && generateGoal()}
          disabled={isLoading}
        />
        <button
          onClick={generateGoal}
          disabled={isLoading}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          <SparklesIcon className="w-4 h-4" />
          {isLoading ? 'Generating...' : 'Generate'}
        </button>
      </div>

      {error && (
        <p className="mt-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
      )}

      {suggestion && (
        <div className="mt-4 bg-white rounded-lg border border-blue-200 p-4 space-y-2">
          <h4 className="font-bold text-slate-800 mb-3">Suggested SMART Goal:</h4>
          <div className="space-y-2 text-sm">
            <p><span className="font-semibold text-blue-600">Specific:</span> <span className="text-slate-700">{suggestion.specific}</span></p>
            <p><span className="font-semibold text-blue-600">Measurable:</span> <span className="text-slate-700">{suggestion.measurable}</span></p>
            <p><span className="font-semibold text-blue-600">Achievable:</span> <span className="text-slate-700">{suggestion.achievable}</span></p>
            <p><span className="font-semibold text-blue-600">Relevant:</span> <span className="text-slate-700">{suggestion.relevant}</span></p>
            <p><span className="font-semibold text-blue-600">Timeline:</span> <span className="text-slate-700">{suggestion.timeBoundDays} days</span></p>
          </div>
          <button
            onClick={handleAddSuggestion}
            className="mt-3 w-full bg-green-600 text-white font-semibold py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
          >
            Add This Goal to Dashboard
          </button>
        </div>
      )}
    </div>
  );
};

export default GeminiGoalGenerator;
