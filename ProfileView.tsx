
import React, { useState } from 'react';
import { UserProfile, Project } from '../types';

interface ProfileViewProps {
  user: UserProfile;
  userProjects: Project[];
  adoptedProjects: Project[];
  onUpdate: (updatedUser: UserProfile) => void;
  onBack: () => void;
  onProjectClick: (id: string) => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ user, userProjects, adoptedProjects, onUpdate, onBack, onProjectClick }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(user);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(editForm);
    setIsEditing(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between mb-12">
        <button 
          onClick={onBack}
          className="group flex items-center gap-2 text-stone-500 hover:text-violet-400 transition-colors"
        >
          <i className="fa-solid fa-arrow-left transition-transform group-hover:-translate-x-1"></i>
          <span className="mono text-[10px] uppercase tracking-widest">Back to the Graveyard</span>
        </button>
        <button 
          onClick={() => setIsEditing(!isEditing)}
          className="px-6 py-2 rounded-full border border-stone-800 text-stone-400 hover:border-violet-500 hover:text-violet-400 transition-all text-xs font-bold uppercase tracking-widest"
        >
          {isEditing ? 'Discard Changes' : 'Rewrite Destiny'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column: Stats & Identity */}
        <div className="lg:col-span-1 space-y-8">
          <div className="relative p-8 rounded-[40px] border border-stone-800 bg-stone-900/40 backdrop-blur-md text-center overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-violet-500 to-transparent opacity-50"></div>
            
            {/* Spectral Portrait Photo */}
            <div className="relative w-48 h-48 mx-auto mb-8">
              <div className="absolute inset-0 rounded-full border-4 border-stone-800 animate-pulse"></div>
              <div className="absolute inset-2 rounded-full border border-violet-500/30"></div>
              <div className="w-full h-full rounded-full overflow-hidden border-2 border-stone-700 bg-stone-950 relative group">
                <img 
                  src={user.profileImage} 
                  alt="Spectral Identity"
                  className="w-full h-full object-cover grayscale opacity-70 group-hover:opacity-90 group-hover:grayscale-0 transition-all duration-700 scale-110 group-hover:scale-100"
                />
                <div className="absolute inset-0 bg-violet-900/10 mix-blend-color"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-stone-950/20"></div>
              </div>
              <div className="absolute -bottom-2 -right-2 w-12 h-12 rounded-full bg-violet-600 flex items-center justify-center border-4 border-stone-900 shadow-xl">
                 <i className="fa-solid fa-skull-crossbones text-white text-sm"></i>
              </div>
            </div>

            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-4 text-left">
                <div>
                  <label className="mono text-[9px] uppercase text-stone-600 block mb-1">True Name</label>
                  <input 
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-2 text-sm text-stone-200 focus:border-violet-500 outline-none"
                    value={editForm.name}
                    onChange={e => setEditForm({...editForm, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="mono text-[9px] uppercase text-stone-600 block mb-1">Portrait URL (Spectral Form)</label>
                  <input 
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-2 text-sm text-stone-200 focus:border-violet-500 outline-none"
                    value={editForm.profileImage}
                    onChange={e => setEditForm({...editForm, profileImage: e.target.value})}
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <label className="mono text-[9px] uppercase text-stone-600 block mb-1">Spectral Bio</label>
                  <textarea 
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-2 text-sm text-stone-200 focus:border-violet-500 outline-none h-24"
                    value={editForm.bio}
                    onChange={e => setEditForm({...editForm, bio: e.target.value})}
                  />
                </div>
                <button type="submit" className="w-full bg-violet-600 py-3 rounded-xl font-bold text-sm shadow-[0_10px_20px_rgba(139,92,246,0.2)]">Update Record</button>
              </form>
            ) : (
              <>
                <h2 className="text-3xl font-black italic text-stone-100 mb-1">{user.name}</h2>
                <p className="mono text-[10px] uppercase tracking-widest text-violet-500 mb-6">{user.rank}</p>
                <p className="text-stone-400 text-sm italic mb-8 px-4 leading-relaxed">"{user.bio}"</p>
                
                <div className="grid grid-cols-2 gap-4 pt-6 border-t border-stone-800">
                  <div className="text-center">
                    <span className="block text-2xl font-black text-stone-200">{userProjects.length}</span>
                    <span className="mono text-[9px] uppercase text-stone-500">Buried</span>
                  </div>
                  <div className="text-center">
                    <span className="block text-2xl font-black text-stone-200">{adoptedProjects.length}</span>
                    <span className="mono text-[9px] uppercase text-stone-500">Resurrected</span>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="p-8 rounded-[40px] border border-stone-800 bg-stone-900/20 space-y-4">
            <h4 className="mono text-[10px] uppercase tracking-widest text-stone-500">Arcane Knowledge (Skills)</h4>
            <div className="flex flex-wrap gap-2">
              {user.skills.map(skill => (
                <span key={skill} className="px-3 py-1 rounded-full bg-stone-800 text-[10px] text-stone-400 border border-stone-700">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Listings */}
        <div className="lg:col-span-2 space-y-12">
          <section>
            <div className="flex items-center gap-4 mb-6">
              <i className="fa-solid fa-tombstone text-stone-700 text-xl"></i>
              <h3 className="text-2xl font-bold italic text-stone-200">The Burial Grounds</h3>
            </div>
            {userProjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {userProjects.map(p => (
                  <div 
                    key={p.id}
                    onClick={() => onProjectClick(p.id)}
                    className="p-6 rounded-3xl border border-stone-800 bg-stone-900/40 hover:border-violet-500/30 transition-all cursor-pointer group"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-stone-200 group-hover:text-violet-400 transition-colors">{p.title}</h4>
                      <span className="text-[10px] mono text-stone-600">{p.abandonedDate}</span>
                    </div>
                    <p className="text-xs text-stone-500 line-clamp-2 italic">"{p.epitaph}"</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center rounded-3xl border border-dashed border-stone-800 text-stone-600 italic">
                You haven't laid any projects to rest... yet.
              </div>
            )}
          </section>

          <section>
            <div className="flex items-center gap-4 mb-6">
              <i className="fa-solid fa-heart-pulse text-stone-700 text-xl"></i>
              <h3 className="text-2xl font-bold italic text-stone-200">Resurrected Souls</h3>
            </div>
            {adoptedProjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {adoptedProjects.map(p => (
                  <div 
                    key={p.id}
                    onClick={() => onProjectClick(p.id)}
                    className="p-6 rounded-3xl border border-stone-800 bg-stone-900/40 hover:border-emerald-500/30 transition-all cursor-pointer group"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-stone-200 group-hover:text-emerald-400 transition-colors">{p.title}</h4>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-500 mono font-bold">Adopted</span>
                    </div>
                    <p className="text-xs text-stone-500 line-clamp-2 italic">Original Creator: @{p.author}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center rounded-3xl border border-dashed border-stone-800 text-stone-600 italic">
                No souls are currently under your care.
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
