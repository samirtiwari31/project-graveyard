
import React, { useState } from 'react';
import { ProjectCategory } from '../types';
import { CATEGORIES } from '../constants';
import { generateEpitaph } from '../services/gemini';

interface UploadFormProps {
  onAdd: (project: any) => void;
  onCancel: () => void;
}

const UploadForm: React.FC<UploadFormProps> = ({ onAdd, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    category: 'Code' as ProjectCategory,
    description: '',
    content: '',
    reasonForAbandonment: '',
    tags: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Generate AI Epitaph
    const epitaph = await generateEpitaph(formData.title, formData.reasonForAbandonment);

    const newProject = {
      ...formData,
      id: Math.random().toString(36).substr(2, 9),
      abandonedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      adoptions: 0,
      status: 'buried',
      epitaph: epitaph,
      tags: formData.tags.split(',').map(t => t.trim()).filter(t => t)
    };
    
    onAdd(newProject);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl">
      <form 
        onSubmit={handleSubmit}
        className="w-full max-w-3xl bg-stone-900 border border-stone-800 rounded-[40px] p-10 space-y-6 shadow-2xl overflow-y-auto max-h-[90vh] custom-scrollbar"
      >
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-4xl font-black italic text-violet-300">Prepare for Burial</h2>
            <p className="text-stone-500 mt-2 italic">Fill the tomb with the remains of your unfulfilled ambition.</p>
          </div>
          <button type="button" onClick={onCancel} className="text-stone-500 hover:text-white h-12 w-12 flex items-center justify-center rounded-full hover:bg-stone-800">
            <i className="fa-solid fa-xmark text-2xl"></i>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="mono text-[10px] uppercase tracking-widest text-stone-500 ml-1">The Title</label>
            <input 
              required
              placeholder="e.g. My Forgotten Engine"
              className="w-full bg-stone-950 border border-stone-800 rounded-2xl px-5 py-3 text-stone-200 focus:outline-none focus:border-violet-500 shadow-inner"
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="mono text-[10px] uppercase tracking-widest text-stone-500 ml-1">The Architect</label>
            <input 
              required
              placeholder="Your handle"
              className="w-full bg-stone-950 border border-stone-800 rounded-2xl px-5 py-3 text-stone-200 focus:outline-none focus:border-violet-500 shadow-inner"
              value={formData.author}
              onChange={e => setFormData({...formData, author: e.target.value})}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="mono text-[10px] uppercase tracking-widest text-stone-500 ml-1">Nature of the Work</label>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(c => (
              <button
                key={c}
                type="button"
                onClick={() => setFormData({...formData, category: c as any})}
                className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${formData.category === c ? 'bg-violet-600 text-white border-violet-600' : 'bg-stone-950 text-stone-500 border-stone-800 hover:border-stone-600'}`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="mono text-[10px] uppercase tracking-widest text-stone-500 ml-1">Last Rites (Description)</label>
          <textarea 
            required
            rows={3}
            className="w-full bg-stone-950 border border-stone-800 rounded-2xl px-5 py-3 text-stone-200 focus:outline-none focus:border-violet-500 shadow-inner"
            value={formData.description}
            onChange={e => setFormData({...formData, description: e.target.value})}
            placeholder="What was this supposed to become?"
          />
        </div>

        <div className="space-y-2">
          <label className="mono text-[10px] uppercase tracking-widest text-stone-500 ml-1">The Cold Code/Text</label>
          <textarea 
            required
            rows={6}
            className="w-full mono bg-stone-950 border border-stone-800 rounded-2xl px-5 py-4 text-emerald-500/80 focus:outline-none focus:border-violet-500 text-sm shadow-inner"
            value={formData.content}
            onChange={e => setFormData({...formData, content: e.target.value})}
            placeholder="// Paste the remains here..."
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="mono text-[10px] uppercase tracking-widest text-stone-500 ml-1">Cause of Death</label>
            <input 
              required
              className="w-full bg-stone-950 border border-stone-800 rounded-2xl px-5 py-3 text-stone-200 focus:outline-none focus:border-violet-500 shadow-inner"
              value={formData.reasonForAbandonment}
              onChange={e => setFormData({...formData, reasonForAbandonment: e.target.value})}
              placeholder="Why did you stop?"
            />
          </div>
          <div className="space-y-2">
            <label className="mono text-[10px] uppercase tracking-widest text-stone-500 ml-1">Tags (Comma Separated)</label>
            <input 
              className="w-full bg-stone-950 border border-stone-800 rounded-2xl px-5 py-3 text-stone-200 focus:outline-none focus:border-violet-500 shadow-inner"
              value={formData.tags}
              onChange={e => setFormData({...formData, tags: e.target.value})}
              placeholder="rust, logic, pain"
            />
          </div>
        </div>

        <div className="flex justify-end gap-6 pt-6 items-center">
          <span className="text-stone-600 text-xs italic">
            The Gravedigger is preparing the AI epitaph...
          </span>
          <button 
            type="submit"
            disabled={loading}
            className="px-12 py-4 rounded-full bg-violet-600 text-white font-bold hover:bg-violet-500 transition-all shadow-[0_0_40px_rgba(139,92,246,0.3)] disabled:opacity-50 flex items-center gap-3"
          >
            {loading ? (
              <><i className="fa-solid fa-skull animate-spin"></i> Digging Grave...</>
            ) : (
              <><i className="fa-solid fa-cross"></i> Lay to Rest</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UploadForm;
