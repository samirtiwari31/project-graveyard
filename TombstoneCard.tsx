
import React from 'react';
import { Project } from '../types';

interface TombstoneCardProps {
  project: Project;
  onClick: (id: string) => void;
  isFeatured?: boolean;
}

const TombstoneCard: React.FC<TombstoneCardProps> = ({ project, onClick, isFeatured }) => {
  const isResurrected = project.status === 'resurrected';

  return (
    <div 
      onClick={() => onClick(project.id)}
      className={`group relative cursor-pointer overflow-hidden rounded-t-[50px] border-x-4 border-t-4 transition-all hover:-translate-y-2 
        ${isFeatured 
          ? 'border-amber-500/50 bg-stone-900 shadow-[0_-15px_40px_rgba(245,158,11,0.2)]' 
          : 'border-stone-800 bg-stone-900 hover:border-violet-500/50 hover:shadow-[0_-10px_30px_rgba(139,92,246,0.1)]'
        } p-8`}
    >
      {/* Tombstone shape topper */}
      <div className={`absolute inset-x-0 -top-16 h-32 rounded-full transition-colors ${isFeatured ? 'bg-stone-900' : 'bg-stone-900 group-hover:bg-stone-800'}`} />
      
      <div className="relative z-10 pt-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="mono text-[10px] uppercase tracking-widest text-stone-500">
            {project.category}
          </span>
          {isFeatured && (
            <span className="flex items-center gap-1 text-[10px] font-bold text-amber-500 uppercase italic">
              <i className="fa-solid fa-crown"></i> Legendary
            </span>
          )}
        </div>
        
        <h3 className={`mb-3 text-2xl font-bold italic transition-colors ${isFeatured ? 'text-amber-200' : 'text-stone-200 group-hover:text-violet-300'}`}>
          {project.title}
        </h3>
        
        <div className="mb-4 h-12">
          <p className="line-clamp-2 text-sm italic text-stone-400">
            "{project.epitaph || 'Lost in the digital fog.'}"
          </p>
        </div>

        <p className="mb-4 line-clamp-2 text-xs leading-relaxed text-stone-500">
          {project.description}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {project.tags.slice(0, 3).map(tag => (
            <span key={tag} className="mono text-[9px] text-stone-600 bg-stone-800/50 px-2 py-0.5 rounded">#{tag}</span>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-stone-800 pt-4 text-[10px] italic text-stone-500">
          <span>Resting since {project.abandonedDate}</span>
          <span className="flex items-center gap-1">
            <i className="fa-solid fa-hand-holding-heart"></i> {project.adoptions} Adoptions
          </span>
        </div>
      </div>

      {/* Decorative Cracks */}
      <div className="absolute bottom-0 right-0 p-2 opacity-5 group-hover:opacity-20 transition-opacity">
        <i className={`fa-solid ${isFeatured ? 'fa-scroll' : 'fa-skull'} text-5xl`}></i>
      </div>
    </div>
  );
};

export default TombstoneCard;
