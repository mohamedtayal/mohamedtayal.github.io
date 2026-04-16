import React from 'react';
import { Achievement } from '../types';

interface AchievementBadgeProps {
  achievement: Achievement;
}

const AchievementBadge: React.FC<AchievementBadgeProps> = ({ achievement }) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-5 rounded-xl border-2 text-center transition-all ${
        achievement.unlocked
          ? 'border-yellow-400 bg-yellow-50 shadow-md'
          : 'border-slate-200 bg-white opacity-50 grayscale'
      }`}
    >
      <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${
        achievement.unlocked ? 'bg-yellow-400 text-white' : 'bg-slate-200 text-slate-400'
      }`}>
        {achievement.icon}
      </div>
      <h3 className="font-bold text-slate-800 text-sm mb-1">{achievement.title}</h3>
      <p className="text-xs text-slate-500">{achievement.description}</p>
      {achievement.unlocked && (
        <span className="mt-2 text-xs font-semibold text-yellow-600 bg-yellow-100 px-2 py-0.5 rounded-full">
          Unlocked!
        </span>
      )}
    </div>
  );
};

export default AchievementBadge;
