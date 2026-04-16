import React from 'react';
import { Resource } from '../types';
import { BookmarkIcon } from './icons/Icons';

interface ResourceCardProps {
  resource: Resource;
  isBookmarked: boolean;
  onToggleBookmark: (id: number) => void;
}

const categoryColors: Record<Resource['category'], string> = {
  Career: 'bg-purple-100 text-purple-700',
  Health: 'bg-green-100 text-green-700',
  Education: 'bg-blue-100 text-blue-700',
  Personal: 'bg-amber-100 text-amber-700',
};

const typeColors: Record<Resource['type'], string> = {
  Article: 'bg-slate-100 text-slate-600',
  Video: 'bg-red-100 text-red-600',
  Podcast: 'bg-indigo-100 text-indigo-600',
};

const ResourceCard: React.FC<ResourceCardProps> = ({ resource, isBookmarked, onToggleBookmark }) => {
  return (
    <div className="bg-white rounded-xl shadow-md border border-slate-200 p-5 flex flex-col gap-3 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between gap-2">
        <div className="flex gap-2 flex-wrap">
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${categoryColors[resource.category]}`}>
            {resource.category}
          </span>
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${typeColors[resource.type]}`}>
            {resource.type}
          </span>
        </div>
        <button
          onClick={() => onToggleBookmark(resource.id)}
          className={`transition-colors flex-shrink-0 ${isBookmarked ? 'text-blue-600' : 'text-slate-300 hover:text-blue-400'}`}
          title={isBookmarked ? 'Remove bookmark' : 'Bookmark'}
        >
          <BookmarkIcon className="w-5 h-5" filled={isBookmarked} />
        </button>
      </div>

      <h3 className="text-base font-bold text-slate-800 leading-snug">{resource.title}</h3>
      <p className="text-sm text-slate-500 flex-1">{resource.description}</p>

      <a
        href={resource.link}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-auto text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"
      >
        View Resource →
      </a>
    </div>
  );
};

export default ResourceCard;
