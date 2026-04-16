import React, { useState } from 'react';
import { Goal, Milestone } from '../types';
import { TrashIcon, PencilIcon, CheckIcon, PlusIcon } from './icons/Icons';

interface GoalCardProps {
  goal: Goal;
  onToggleMilestone: (goalId: number, milestoneId: number) => void;
  onAddMilestone: (goalId: number, milestoneText: string) => void;
  onUpdate: (goal: Goal) => void;
  onDelete: (goalId: number) => void;
}

const GoalCard: React.FC<GoalCardProps> = ({ goal, onToggleMilestone, onAddMilestone, onUpdate, onDelete }) => {
  const [newMilestoneText, setNewMilestoneText] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(goal.title);

  const completedCount = goal.milestones.filter(m => m.completed).length;
  const totalCount = goal.milestones.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const handleAddMilestone = () => {
    if (newMilestoneText.trim()) {
      onAddMilestone(goal.id, newMilestoneText);
      setNewMilestoneText('');
    }
  };

  const handleSaveTitle = () => {
    if (editedTitle.trim()) {
      onUpdate({ ...goal, title: editedTitle });
    }
    setIsEditing(false);
  };

  const deadline = new Date(goal.deadline);
  const today = new Date();
  const daysLeft = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="bg-white rounded-xl shadow-md border border-slate-200 flex flex-col p-5 gap-4 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start gap-2">
        {isEditing ? (
          <div className="flex items-center gap-2 flex-1">
            <input
              className="border border-slate-300 rounded-lg px-2 py-1 text-slate-800 font-semibold flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={editedTitle}
              onChange={e => setEditedTitle(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSaveTitle()}
              autoFocus
            />
            <button onClick={handleSaveTitle} className="text-green-600 hover:text-green-800">
              <CheckIcon className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <h3 className="text-lg font-bold text-slate-800 flex-1">{goal.title}</h3>
        )}
        <div className="flex gap-1 flex-shrink-0">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="text-slate-400 hover:text-blue-600 transition-colors p-1 rounded"
            title="Edit goal"
          >
            <PencilIcon className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(goal.id)}
            className="text-slate-400 hover:text-red-600 transition-colors p-1 rounded"
            title="Delete goal"
          >
            <TrashIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="text-sm text-slate-500 space-y-1">
        <p><span className="font-medium text-slate-600">Measure:</span> {goal.measurement}</p>
        <p><span className="font-medium text-slate-600">Why:</span> {goal.relevance}</p>
        <p className={`font-medium ${daysLeft < 0 ? 'text-red-500' : daysLeft <= 7 ? 'text-amber-500' : 'text-slate-500'}`}>
          {daysLeft < 0 ? `${Math.abs(daysLeft)} days overdue` : daysLeft === 0 ? 'Due today!' : `${daysLeft} days left`}
        </p>
      </div>

      {totalCount > 0 && (
        <div>
          <div className="flex justify-between text-xs text-slate-500 mb-1">
            <span>Progress</span>
            <span>{completedCount}/{totalCount} milestones</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      <div className="space-y-2">
        {goal.milestones.map((milestone: Milestone) => (
          <div
            key={milestone.id}
            className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
              milestone.completed ? 'bg-green-50' : 'hover:bg-slate-50'
            }`}
            onClick={() => onToggleMilestone(goal.id, milestone.id)}
          >
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
              milestone.completed ? 'bg-green-500 border-green-500' : 'border-slate-300'
            }`}>
              {milestone.completed && <CheckIcon className="w-3 h-3 text-white" />}
            </div>
            <span className={`text-sm ${milestone.completed ? 'line-through text-slate-400' : 'text-slate-700'}`}>
              {milestone.text}
            </span>
          </div>
        ))}
      </div>

      <div className="flex gap-2 mt-auto pt-2 border-t border-slate-100">
        <input
          type="text"
          placeholder="Add a milestone..."
          value={newMilestoneText}
          onChange={e => setNewMilestoneText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAddMilestone()}
          className="flex-1 text-sm border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={handleAddMilestone}
          className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          title="Add milestone"
        >
          <PlusIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default GoalCard;
