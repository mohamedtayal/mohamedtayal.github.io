import React, { useState, useEffect, useCallback } from 'react';
import { Goal, Resource, Achievement, Milestone } from './types';
import Header from './components/Header';
import GoalCard from './components/GoalCard';
import GoalForm from './components/GoalForm';
import ResourceCard from './components/ResourceCard';
import AchievementBadge from './components/AchievementBadge';
import GeminiGoalGenerator from './components/GeminiGoalGenerator';
import { PlusIcon, TargetIcon, BookOpenIcon, TrophyIcon, SparklesIcon } from './components/icons/Icons';

type View = 'dashboard' | 'resources' | 'achievements';

const App: React.FC = () => {
  const [view, setView] = useState<View>('dashboard');
  const [goals, setGoals] = useState<Goal[]>([]);
  const [resources] = useState<Resource[]>([
    { id: 1, title: 'How to Build a Strong Career Foundation', category: 'Career', type: 'Article', link: '#', description: 'Essential tips for early-stage professionals.' },
    { id: 2, title: 'The Science of Well-Being', category: 'Health', type: 'Video', link: '#', description: 'A deep dive into psychological wellness and happiness.' },
    { id: 3, title: 'Mastering a New Language', category: 'Education', type: 'Podcast', link: '#', description: 'Strategies and hacks for language acquisition.' },
    { id: 4, title: 'The Art of Public Speaking', category: 'Personal', type: 'Video', link: '#', description: 'Conquer your fears and deliver compelling presentations.' },
  ]);
  const [bookmarkedResources, setBookmarkedResources] = useState<Set<number>>(new Set());
  const [achievements, setAchievements] = useState<Achievement[]>([
    { id: 1, title: 'First Step', description: 'You set your very first goal!', unlocked: false, icon: <TargetIcon /> },
    { id: 2, title: 'Milestone Master', description: 'You completed 5 milestones.', unlocked: false, icon: <TrophyIcon /> },
    { id: 3, title: 'Goal Getter', description: 'You achieved your first goal.', unlocked: false, icon: <SparklesIcon /> },
    { id: 4, title: 'Curious Mind', description: 'You bookmarked a resource.', unlocked: false, icon: <BookOpenIcon /> },
  ]);

  const [isGoalFormOpen, setIsGoalFormOpen] = useState(false);

  const checkAchievements = useCallback(() => {
    const newAchievements = [...achievements];
    // First Step
    if (goals.length > 0 && !newAchievements[0].unlocked) newAchievements[0].unlocked = true;
    // Milestone Master
    const completedMilestones = goals.flatMap(g => g.milestones).filter(m => m.completed).length;
    if (completedMilestones >= 5 && !newAchievements[1].unlocked) newAchievements[1].unlocked = true;
    // Goal Getter
    const completedGoals = goals.filter(g => g.milestones.length > 0 && g.milestones.every(m => m.completed)).length;
    if (completedGoals > 0 && !newAchievements[2].unlocked) newAchievements[2].unlocked = true;
    // Curious Mind
    if (bookmarkedResources.size > 0 && !newAchievements[3].unlocked) newAchievements[3].unlocked = true;

    setAchievements(newAchievements);
  }, [goals, bookmarkedResources, achievements]);

  useEffect(() => {
    checkAchievements();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [goals, bookmarkedResources]);

  const addGoal = (newGoal: Omit<Goal, 'id' | 'createdAt' | 'milestones'>) => {
    const goal: Goal = {
      ...newGoal,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      milestones: [],
    };
    setGoals(prevGoals => [...prevGoals, goal]);
    setIsGoalFormOpen(false);
  };

  const updateGoal = (updatedGoal: Goal) => {
    setGoals(goals.map(g => g.id === updatedGoal.id ? updatedGoal : g));
  };
  
  const deleteGoal = (goalId: number) => {
    setGoals(goals.filter(g => g.id !== goalId));
  };

  const toggleMilestone = (goalId: number, milestoneId: number) => {
    setGoals(goals.map(goal => {
      if (goal.id === goalId) {
        return {
          ...goal,
          milestones: goal.milestones.map(m => m.id === milestoneId ? { ...m, completed: !m.completed } : m)
        };
      }
      return goal;
    }));
  };
  
  const addMilestone = (goalId: number, milestoneText: string) => {
      setGoals(goals.map(goal => {
          if (goal.id === goalId && milestoneText.trim() !== '') {
              const newMilestone: Milestone = {
                  id: Date.now(),
                  text: milestoneText,
                  completed: false,
              };
              return {...goal, milestones: [...goal.milestones, newMilestone]};
          }
          return goal;
      }));
  };

  const toggleBookmark = (resourceId: number) => {
    const newBookmarks = new Set(bookmarkedResources);
    if (newBookmarks.has(resourceId)) {
      newBookmarks.delete(resourceId);
    } else {
      newBookmarks.add(resourceId);
    }
    setBookmarkedResources(newBookmarks);
  };
  
  const renderView = () => {
    switch (view) {
      case 'dashboard':
        return (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-slate-800">Your Dashboard</h2>
              <button
                onClick={() => setIsGoalFormOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-sm"
              >
                <PlusIcon />
                New Goal
              </button>
            </div>
            
            {goals.length === 0 && !isGoalFormOpen && (
                 <div className="text-center py-12 px-6 bg-white rounded-lg shadow-md border border-slate-200">
                    <TargetIcon className="w-16 h-16 mx-auto text-blue-400 mb-4" />
                    <h3 className="text-xl font-semibold text-slate-700 mb-2">Start Your Journey</h3>
                    <p className="text-slate-500 mb-6 max-w-md mx-auto">You haven't set any goals yet. Click "New Goal" to begin or get some ideas from our AI assistant below!</p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {goals.map(goal => (
                <GoalCard 
                  key={goal.id} 
                  goal={goal} 
                  onToggleMilestone={toggleMilestone} 
                  onAddMilestone={addMilestone}
                  onUpdate={updateGoal}
                  onDelete={deleteGoal}
                />
              ))}
            </div>
            
            <div className="mt-12">
                <GeminiGoalGenerator onAddGoal={addGoal} />
            </div>
          </>
        );
      case 'resources':
        return (
          <>
            <h2 className="text-3xl font-bold text-slate-800 mb-6">Resource Hub</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resources.map(resource => (
                <ResourceCard 
                  key={resource.id} 
                  resource={resource} 
                  isBookmarked={bookmarkedResources.has(resource.id)}
                  onToggleBookmark={toggleBookmark}
                />
              ))}
            </div>
          </>
        );
      case 'achievements':
        return (
          <>
            <h2 className="text-3xl font-bold text-slate-800 mb-6">Your Achievements</h2>
             <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {achievements.map(ach => (
                <AchievementBadge key={ach.id} achievement={ach} />
              ))}
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <Header currentView={view} setView={setView} />
      <main className="container mx-auto p-4 md:p-8">
        {renderView()}
      </main>
      
      {isGoalFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-2xl transform transition-all relative max-h-[90vh] overflow-y-auto">
             <button
              onClick={() => setIsGoalFormOpen(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-slate-800"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <GoalForm onAddGoal={addGoal} />
          </div>
        </div>
      )}
      
      <footer className="text-center p-6 text-slate-500 mt-12">
        <p>&copy; {new Date().getFullYear()} وسيلة (Waseela). All rights reserved.</p>
        <p className="text-sm">Your partner in achieving greatness.</p>
      </footer>
    </div>
  );
};

export default App;
