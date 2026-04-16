import React, { useState } from 'react';
import { Goal } from '../types';

interface GoalFormProps {
  onAddGoal: (newGoal: Omit<Goal, 'id' | 'createdAt' | 'milestones'>) => void;
}

const GoalForm: React.FC<GoalFormProps> = ({ onAddGoal }) => {
  const [title, setTitle] = useState('');
  const [measurement, setMeasurement] = useState('');
  const [achievability, setAchievability] = useState('');
  const [relevance, setRelevance] = useState('');
  const [deadline, setDeadline] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !measurement.trim() || !achievability.trim() || !relevance.trim() || !deadline) {
      setError('Please fill in all fields.');
      return;
    }
    setError('');
    onAddGoal({ title, measurement, achievability, relevance, deadline });
  };

  const inputClass = 'w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm';
  const labelClass = 'block text-sm font-semibold text-slate-700 mb-1';

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-2xl font-bold text-slate-800 mb-4">Create a SMART Goal</h2>

      <div>
        <label className={labelClass}>
          <span className="text-blue-600">S</span>pecific — What exactly do you want to achieve?
        </label>
        <input
          type="text"
          className={inputClass}
          placeholder="e.g. Learn Spanish to conversational level"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
      </div>

      <div>
        <label className={labelClass}>
          <span className="text-blue-600">M</span>easurable — How will you track progress?
        </label>
        <input
          type="text"
          className={inputClass}
          placeholder="e.g. Pass a B2 CEFR exam"
          value={measurement}
          onChange={e => setMeasurement(e.target.value)}
        />
      </div>

      <div>
        <label className={labelClass}>
          <span className="text-blue-600">A</span>chievable — Why is this goal realistic for you?
        </label>
        <input
          type="text"
          className={inputClass}
          placeholder="e.g. I can dedicate 1 hour per day to study"
          value={achievability}
          onChange={e => setAchievability(e.target.value)}
        />
      </div>

      <div>
        <label className={labelClass}>
          <span className="text-blue-600">R</span>elevant — Why does this goal matter to you?
        </label>
        <input
          type="text"
          className={inputClass}
          placeholder="e.g. To connect with Spanish-speaking clients"
          value={relevance}
          onChange={e => setRelevance(e.target.value)}
        />
      </div>

      <div>
        <label className={labelClass}>
          <span className="text-blue-600">T</span>ime-bound — What is your deadline?
        </label>
        <input
          type="date"
          className={inputClass}
          value={deadline}
          onChange={e => setDeadline(e.target.value)}
          min={new Date().toISOString().split('T')[0]}
        />
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        type="submit"
        className="w-full bg-blue-600 text-white font-semibold py-2.5 rounded-lg hover:bg-blue-700 transition-colors mt-2"
      >
        Create Goal
      </button>
    </form>
  );
};

export default GoalForm;
