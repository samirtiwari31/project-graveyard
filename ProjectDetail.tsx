
import React, { useState, useEffect, useRef } from 'react';
import { Project, ChatMessage } from '../types';
import { performAutopsy, conductSeance } from '../services/gemini';

interface ProjectDetailProps {
  project: Project;
  onClose: () => void;
  onAdopt: (id: string) => void;
  isUserAuthor: boolean;
  isAlreadyAdopted: boolean;
}

const ProjectDetail: React.FC<ProjectDetailProps> = ({ project, onClose, onAdopt, isUserAuthor, isAlreadyAdopted }) => {
  const [autopsy, setAutopsy] = useState<string | null>(project.aiAutopsy || null);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<'details' | 'content' | 'seance'>('details');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [seanceLoading, setSeanceLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, view]);

  const runAutopsy = async () => {
    setLoading(true);
    const result = await performAutopsy(project.title, project.content, project.description);
    setAutopsy(result || null);
    setLoading(false);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || seanceLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setSeanceLoading(true);

    const ghostResponse = await conductSeance(project, userMsg, messages);
    setMessages(prev => [...prev, { role: 'ghost', text: ghostResponse || "..." }]);
    setSeanceLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-4xl h-[85vh] overflow-hidden rounded-3xl border border-stone-700 bg-stone-900 shadow-2xl flex flex-col animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-800 p-6 bg-stone-950/70">
          <div>
            <h2 className="text-3xl font-bold text-violet-300 italic flex items-center gap-3">
              {project.title}
              {isUserAuthor && <span className="text-[10px] font-bold text-violet-500 uppercase italic border border-violet-500/30 px-2 py-0.5 rounded-full">Your Creation</span>}
            </h2>
            <p className="text-sm text-stone-400 italic mt-1">"{project.epitaph}"</p>
          </div>
          <button 
            onClick={onClose}
            className="text-stone-500 hover:text-white transition-colors p-2 h-10 w-10 flex items-center justify-center rounded-full hover:bg-stone-800"
          >
            <i className="fa-solid fa-xmark text-2xl"></i>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-stone-800 px-6 bg-stone-950/30">
          {[
            { id: 'details', label: 'Dossier', icon: 'fa-book-skull' },
            { id: 'content', label: 'The Remains', icon: 'fa-code' },
            { id: 'seance', label: 'Conduct Séance', icon: 'fa-ghost' }
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setView(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-4 text-xs font-bold uppercase tracking-widest transition-all border-b-2 ${view === tab.id ? 'border-violet-500 text-violet-400 bg-violet-500/5' : 'border-transparent text-stone-500 hover:text-stone-300'}`}
            >
              <i className={`fa-solid ${tab.icon}`}></i>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden relative">
          <div className="h-full overflow-y-auto p-8 custom-scrollbar" ref={scrollRef}>
            {view === 'details' && (
              <div className="space-y-10">
                <section>
                  <h4 className="mono text-[10px] uppercase tracking-[0.2em] text-violet-500 mb-3">Original Vision</h4>
                  <p className="text-xl text-stone-200 leading-relaxed italic font-light">{project.description}</p>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <section className="rounded-2xl bg-red-950/10 border border-red-900/20 p-6">
                    <h4 className="mono text-[10px] uppercase tracking-widest text-red-500 mb-3">Cause of Death</h4>
                    <p className="text-red-200/80 italic">{project.reasonForAbandonment}</p>
                  </section>
                  <section className="rounded-2xl bg-stone-800/20 border border-stone-700/30 p-6">
                    <h4 className="mono text-[10px] uppercase tracking-widest text-stone-500 mb-3">Lineage</h4>
                    <div className="flex flex-col gap-1">
                      <span className="text-stone-300">Creator: @{project.author}</span>
                      <span className="text-stone-400 text-xs">Buried: {project.abandonedDate}</span>
                      <span className="text-stone-400 text-xs">Adoptions: {project.adoptions} souls</span>
                    </div>
                  </section>
                </div>

                <section className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="mono text-[10px] uppercase tracking-[0.2em] text-violet-500">Digital Autopsy</h4>
                    {!autopsy && !loading && (
                      <button 
                        onClick={runAutopsy}
                        className="text-xs bg-violet-600/20 text-violet-400 px-4 py-1 rounded-full border border-violet-500/30 hover:bg-violet-600/40 transition-all"
                      >
                        Consult Gravedigger
                      </button>
                    )}
                  </div>
                  
                  {loading ? (
                    <div className="flex flex-col items-center justify-center p-12 text-stone-500">
                      <i className="fa-solid fa-skull text-4xl mb-4 animate-pulse"></i>
                      <span className="mono text-xs animate-pulse">Communicating with the beyond...</span>
                    </div>
                  ) : autopsy ? (
                    <div className="prose prose-invert max-w-none rounded-2xl bg-stone-950/40 p-8 border border-stone-800 text-stone-400 leading-relaxed italic shadow-inner">
                      {autopsy}
                    </div>
                  ) : (
                    <div className="text-center py-12 border-2 border-dashed border-stone-800 rounded-3xl text-stone-600">
                      <p className="italic">The remains are still warm. Click above to perform an autopsy.</p>
                    </div>
                  )}
                </section>
              </div>
            )}

            {view === 'content' && (
              <div className="h-full flex flex-col">
                <h4 className="mono text-[10px] uppercase tracking-widest text-violet-500 mb-4">The Digital Corpse</h4>
                <div className="flex-1 rounded-2xl bg-black/40 border border-stone-800 p-8 relative">
                   <pre className="mono h-full overflow-auto text-emerald-400/80 text-sm leading-relaxed custom-scrollbar">
                    <code>{project.content}</code>
                  </pre>
                </div>
              </div>
            )}

            {view === 'seance' && (
              <div className="h-full flex flex-col">
                <div className="flex-1 space-y-4 mb-6">
                  {messages.length === 0 && (
                    <div className="text-center py-12 text-stone-600 italic flex flex-col items-center">
                      <div className="w-24 h-24 mb-6 rounded-full border border-stone-800 flex items-center justify-center animate-pulse">
                         <i className="fa-solid fa-ghost text-3xl"></i>
                      </div>
                      <p className="max-w-xs">The ghost of {project.title} lingers. Say something to wake it.</p>
                    </div>
                  )}
                  {messages.map((m, i) => (
                    <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] px-6 py-3 rounded-2xl text-sm ${
                        m.role === 'user' 
                          ? 'bg-stone-800 text-stone-200 rounded-tr-none' 
                          : 'bg-violet-900/20 border border-violet-800/30 text-violet-300 italic rounded-tl-none shadow-[0_0_15px_rgba(139,92,246,0.1)]'
                      }`}>
                        {m.text}
                      </div>
                    </div>
                  ))}
                  {seanceLoading && (
                    <div className="flex justify-start">
                      <div className="px-6 py-3 rounded-2xl bg-violet-900/10 text-violet-500 text-sm italic animate-pulse">
                        The air grows cold...
                      </div>
                    </div>
                  )}
                </div>
                
                <form onSubmit={handleSendMessage} className="relative">
                  <input 
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="Whisper to the ghost..."
                    className="w-full bg-stone-950 border border-stone-800 rounded-2xl px-6 py-4 text-stone-200 focus:outline-none focus:border-violet-500/50 pr-16 shadow-inner"
                  />
                  <button 
                    type="submit"
                    disabled={seanceLoading}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-violet-500 hover:text-violet-300 p-2 disabled:opacity-50"
                  >
                    <i className="fa-solid fa-paper-plane text-xl"></i>
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-stone-800 p-8 bg-stone-950/50 flex items-center justify-between">
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 text-sm border border-emerald-500/20">
               <i className="fa-solid fa-seedling"></i>
             </div>
             <p className="text-xs text-stone-500 max-w-xs italic">
               {isUserAuthor ? "You laid this to rest. Others can now adopt it." : "By clicking adopt, you swear to bring this soul back to life."}
             </p>
          </div>
          {!isUserAuthor && (
            <button 
              onClick={() => onAdopt(project.id)}
              disabled={isAlreadyAdopted}
              className={`px-10 py-4 rounded-full font-bold transition-all flex items-center gap-3 shadow-[0_0_30px_rgba(139,92,246,0.4)] group ${isAlreadyAdopted ? 'bg-stone-800 text-stone-500 cursor-not-allowed shadow-none' : 'bg-violet-600 text-white hover:bg-violet-500'}`}
            >
              <span>{isAlreadyAdopted ? 'Resurrection Ongoing' : 'Resurrect Project'}</span>
              <i className={`fa-solid ${isAlreadyAdopted ? 'fa-check' : 'fa-wand-sparkles group-hover:rotate-45'} transition-transform`}></i>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
