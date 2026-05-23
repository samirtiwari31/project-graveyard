
import React, { useState, useMemo } from 'react';
import { Project, ProjectCategory, UserProfile } from './types';
import { INITIAL_PROJECTS, CATEGORIES } from './constants';
import TombstoneCard from './components/TombstoneCard';
import ProjectDetail from './components/ProjectDetail';
import GhostStats from './components/GhostStats';
import UploadForm from './components/UploadForm';
import ProfileView from './components/ProfileView';
import AuthView from './components/AuthView';

const GHOST_AVATAR = "https://images.unsplash.com/photo-1509248961158-e54f6934749c?q=80&w=200&h=200&auto=format&fit=crop";

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [filter, setFilter] = useState<ProjectCategory | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showUpload, setShowUpload] = useState(false);
  const [view, setView] = useState<'graveyard' | 'profile'>('graveyard');

  const [user, setUser] = useState<UserProfile>({
    name: 'The Nameless One',
    email: 'lost@void.com',
    bio: 'Gatherer of forgotten syntax and silent prose.',
    joinedDate: 'Oct 2024',
    rank: 'Apprentice Ghoul',
    location: 'Digital Limbo',
    skills: ['Code Archaeology'],
    profileImage: GHOST_AVATAR
  });

  const [adoptedIds, setAdoptedIds] = useState<string[]>(['2']); 

  const handleAuthSuccess = (authenticatedUser: UserProfile) => {
    setUser({
      ...authenticatedUser,
      profileImage: GHOST_AVATAR // Assigning the spectral portrait
    });
    setIsAuthenticated(true);
  };

  const featuredProjects = useMemo(() => {
    return [...projects].sort((a, b) => b.adoptions - a.adoptions).slice(0, 3);
  }, [projects]);

  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      const matchesFilter = filter === 'All' || p.category === filter;
      const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesFilter && matchesSearch;
    });
  }, [projects, filter, searchQuery]);

  const statsData = useMemo(() => {
    return CATEGORIES.map(cat => ({
      category: cat,
      count: projects.filter(p => p.category === cat).length
    }));
  }, [projects]);

  const selectedProject = projects.find(p => p.id === selectedProjectId);
  
  const userProjects = projects.filter(p => p.authorEmail === user.email);
  const adoptedProjects = projects.filter(p => adoptedIds.includes(p.id));

  const handleAddProject = (newProject: Project) => {
    newProject.author = user.name;
    newProject.authorEmail = user.email;
    setProjects([newProject, ...projects]);
    setShowUpload(false);
  };

  const handleAdopt = (id: string) => {
    if (!adoptedIds.includes(id)) {
      setAdoptedIds([...adoptedIds, id]);
      setProjects(prev => prev.map(p => p.id === id ? {...p, adoptions: p.adoptions + 1} : p));
    }
  };

  if (!isAuthenticated) {
    return <AuthView onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <div className="min-h-screen relative pb-20 overflow-x-hidden">
      <div className="fixed inset-0 mist pointer-events-none z-0" />
      
      <nav className="sticky top-0 z-40 bg-stone-950/90 backdrop-blur-xl border-b border-stone-800">
        <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
          <div className="flex items-center gap-6 cursor-pointer" onClick={() => setView('graveyard')}>
            <div className="w-14 h-14 rounded-full bg-violet-600/10 flex items-center justify-center border border-violet-500/30 shadow-[0_0_20px_rgba(139,92,246,0.1)]">
              <i className="fa-solid fa-ghost text-violet-400 text-3xl animate-pulse"></i>
            </div>
            <div>
              <h1 className="text-3xl font-black italic tracking-tighter text-white">Project Graveyard</h1>
              <p className="text-[10px] mono uppercase tracking-[0.3em] text-stone-500">Mausoleum of Abandoned Dreams</p>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-8">
            {view === 'graveyard' && (
              <div className="relative group">
                <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-stone-600 text-sm group-focus-within:text-violet-500 transition-colors"></i>
                <input 
                  type="text" 
                  placeholder="Exhume a project..."
                  className="bg-stone-900/40 border border-stone-800 rounded-full py-3 pl-12 pr-6 text-sm text-stone-200 focus:outline-none focus:border-violet-500/50 w-72 transition-all shadow-inner"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>
            )}
            
            <button 
              onClick={() => setShowUpload(true)}
              className="bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-300 px-6 py-3 rounded-full font-bold text-xs uppercase tracking-widest transition-all"
            >
              Lay to Rest
            </button>

            <button 
              onClick={() => setView('profile')}
              className={`flex items-center gap-3 p-1.5 pr-6 rounded-full border transition-all group ${view === 'profile' ? 'border-violet-500 bg-violet-500/10' : 'border-stone-800 bg-stone-900/50 hover:border-stone-700'}`}
            >
              <div className="w-10 h-10 rounded-full border border-stone-800 overflow-hidden relative shadow-[0_0_10px_rgba(139,92,246,0.2)]">
                <img 
                  src={user.profileImage} 
                  alt="Spectral Avatar"
                  className="w-full h-full object-cover grayscale opacity-60 group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-violet-500/10 mix-blend-overlay"></div>
              </div>
              <div className="text-left">
                <p className="text-[10px] font-black uppercase text-stone-100">{user.name}</p>
                <p className="text-[8px] mono text-violet-500 uppercase">{user.rank}</p>
              </div>
            </button>
          </div>
        </div>
      </nav>

      {view === 'graveyard' ? (
        <>
          <section className="max-w-7xl mx-auto px-6 pt-16 pb-8 animate-in fade-in duration-1000">
            <div className="flex items-end justify-between mb-10">
               <div>
                 <h2 className="mono text-[10px] uppercase tracking-[0.5em] text-amber-500 mb-2">The High Mausoleum</h2>
                 <h3 className="text-4xl font-black italic text-stone-100">Legends of the Lost</h3>
               </div>
               <div className="text-stone-500 italic text-sm border-b border-stone-800 pb-1">
                 Most Adopted Souls
               </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {featuredProjects.map(p => (
                <TombstoneCard key={p.id} project={p} onClick={setSelectedProjectId} isFeatured={true} />
              ))}
            </div>
          </section>

          <section className="max-w-7xl mx-auto px-6 py-12">
            <div className="flex flex-wrap items-center justify-between gap-8 mb-16">
              <div className="flex flex-wrap gap-3">
                {['All', ...CATEGORIES].map(cat => (
                  <button 
                    key={cat}
                    onClick={() => setFilter(cat as any)}
                    className={`px-8 py-2 rounded-full text-xs font-black uppercase tracking-widest border transition-all ${filter === cat ? 'bg-stone-100 text-stone-950 border-stone-100' : 'bg-transparent border-stone-800 text-stone-500 hover:border-stone-600'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <div className="text-stone-600 text-xs mono">
                {filteredProjects.length} REMAINS UNEARTHED
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-16">
              <aside className="lg:col-span-1 space-y-12">
                <GhostStats data={statsData} />
                <div className="relative p-8 rounded-[30px] border border-stone-800 bg-stone-900/20 overflow-hidden group">
                  <h4 className="mono text-[10px] uppercase tracking-widest text-violet-500 mb-4">Gravedigger's Creed</h4>
                  <p className="text-stone-400 text-sm italic leading-relaxed relative z-10">
                    "What is buried here is not dead, for in the hands of another, it may yet live a thousand lives."
                  </p>
                </div>
              </aside>

              <div className="lg:col-span-3">
                {filteredProjects.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {filteredProjects.map(p => (
                      <TombstoneCard key={p.id} project={p} onClick={setSelectedProjectId} />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-32 text-stone-700 bg-stone-900/10 rounded-[50px] border-2 border-dashed border-stone-800/30">
                    <p className="text-2xl font-bold italic">The soil is empty here.</p>
                  </div>
                )}
              </div>
            </div>
          </section>
        </>
      ) : (
        <ProfileView 
          user={user}
          userProjects={userProjects}
          adoptedProjects={adoptedProjects}
          onUpdate={setUser}
          onBack={() => setView('graveyard')}
          onProjectClick={setSelectedProjectId}
        />
      )}

      {selectedProject && (
        <ProjectDetail 
          project={selectedProject} 
          onClose={() => setSelectedProjectId(null)} 
          onAdopt={handleAdopt}
          isUserAuthor={selectedProject.authorEmail === user.email}
          isAlreadyAdopted={adoptedIds.includes(selectedProject.id)}
        />
      )}

      {showUpload && (
        <UploadForm 
          onAdd={handleAddProject} 
          onCancel={() => setShowUpload(false)} 
        />
      )}

      <footer className="mt-32 border-t border-stone-800 py-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
           <i className="fa-solid fa-skull-crossbones text-4xl text-stone-800 mb-6"></i>
           <p className="text-stone-700 text-[10px] mono uppercase tracking-widest">
              Project Graveyard &copy; {new Date().getFullYear()} • Memento Mori
           </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
