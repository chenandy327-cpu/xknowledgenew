
import React, { useState } from 'react';

interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  type: 'image' | 'video' | 'text';
  cover: string;
  content: string;
  date: string;
}

const ProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('portfolio');
  const [activeCategory, setActiveCategory] = useState('All');
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([
    { 
      id: '1', 
      title: '基于生成式 AI 的情感化交互研究', 
      category: 'AI & UI', 
      type: 'image', 
      cover: 'https://picsum.photos/id/201/600/400',
      content: '本文探讨了 LLM 如何改变传统 UI 交互逻辑...',
      date: '2024.11.01'
    },
    { 
      id: '2', 
      title: '数字原生代的空间感官', 
      category: 'Philosophy', 
      type: 'video', 
      cover: 'https://picsum.photos/id/202/600/400',
      content: '一段关于数字孪生与物理空间融合的视频调研报告。',
      date: '2024.10.25'
    },
    { 
      id: '3', 
      title: '极简主义下的功能重构', 
      category: 'Design', 
      type: 'text', 
      cover: 'https://picsum.photos/id/203/600/400',
      content: '深度解析如何在保持极简视觉的同时增强功能密度。',
      date: '2024.10.15'
    }
  ]);
  
  const [isAdding, setIsAdding] = useState(false);
  const [newItem, setNewItem] = useState<Partial<PortfolioItem>>({
    title: '',
    category: 'AI & UI',
    type: 'image',
    content: ''
  });

  const categories = ['All', 'AI & UI', 'Philosophy', 'Design', 'Art'];

  const filteredPortfolio = activeCategory === 'All' 
    ? portfolio 
    : portfolio.filter(item => item.category === activeCategory);

  const handleAddItem = () => {
    if (newItem.title && newItem.content) {
      const item: PortfolioItem = {
        id: Date.now().toString(),
        title: newItem.title!,
        category: newItem.category || 'AI & UI',
        type: newItem.type || 'image',
        cover: `https://picsum.photos/id/${Math.floor(Math.random() * 300)}/600/400`,
        content: newItem.content!,
        date: new Date().toLocaleDateString()
      };
      setPortfolio([item, ...portfolio]);
      setIsAdding(false);
      setNewItem({ title: '', category: 'AI & UI', type: 'image', content: '' });
    }
  };

  const deleteItem = (id: string) => {
    setPortfolio(portfolio.filter(p => p.id !== id));
  };

  return (
    <div className="p-8 max-w-[1400px] mx-auto min-h-screen pb-32">
      {/* Profile Header */}
      <section className="relative mb-20">
        <div className="h-80 rounded-[3rem] overflow-hidden shadow-2xl relative">
          <img className="w-full h-full object-cover" src="https://picsum.photos/id/905/1400/500" alt="Banner" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        </div>
        <div className="relative -mt-32 px-12">
          <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-2xl p-10 rounded-[3rem] border border-primary/10 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-10">
            <div className="flex flex-col lg:flex-row items-center gap-10">
              <img className="w-44 h-44 rounded-[2.5rem] border-8 border-white dark:border-zinc-800 shadow-2xl object-cover -mt-32 hover:scale-105 transition-transform" src="https://picsum.photos/id/64/300/300" alt="Avatar" />
              <div className="text-center lg:text-left">
                <h1 className="text-4xl font-black mb-2 tracking-tighter">林梓安 <span className="text-primary text-base font-bold italic ml-2">@zian_lin</span></h1>
                <p className="text-slate-500 font-bold text-sm max-w-lg mb-6 leading-relaxed">AI 交互研究员 & 业余诗人 | 致力于数字人文研究 | 上海交大交互设计硕士</p>
                <div className="flex gap-10 justify-center lg:justify-start">
                  <div className="text-center"><span className="block text-2xl font-black text-primary">1.4k</span><span className="text-[10px] text-slate-400 uppercase font-black tracking-[0.2em]">Following</span></div>
                  <div className="text-center"><span className="block text-2xl font-black text-primary">8.2k</span><span className="text-[10px] text-slate-400 uppercase font-black tracking-[0.2em]">Followers</span></div>
                  <div className="text-center"><span className="block text-2xl font-black text-primary">{portfolio.length}</span><span className="text-[10px] text-slate-400 uppercase font-black tracking-[0.2em]">Projects</span></div>
                </div>
              </div>
            </div>
            <div className="flex gap-4">
              <button className="px-10 py-4 bg-primary text-white font-black rounded-2xl shadow-2xl shadow-primary/30 hover:scale-105 transition-all">编辑档案</button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Tabs */}
      <nav className="flex items-center justify-center gap-4 mb-12 bg-white dark:bg-zinc-900 w-fit mx-auto p-1.5 rounded-2xl border border-primary/5 shadow-sm">
        {['portfolio', 'logs', 'activity'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-10 py-3 rounded-xl font-black text-sm transition-all uppercase tracking-widest ${
              activeTab === tab ? 'bg-primary text-white shadow-xl' : 'text-slate-400 hover:text-primary'
            }`}
          >
            {tab === 'portfolio' ? '作品集' : tab === 'logs' ? '打卡历' : '动态'}
          </button>
        ))}
      </nav>

      {/* Portfolio View */}
      {activeTab === 'portfolio' && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
            <div className="flex gap-3 bg-slate-50 dark:bg-zinc-800 p-1.5 rounded-xl border border-primary/5">
              {categories.map(cat => (
                <button 
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeCategory === cat ? 'bg-white dark:bg-zinc-700 text-primary shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <button 
              onClick={() => setIsAdding(true)}
              className="flex items-center gap-3 px-8 py-3 bg-primary/10 text-primary font-black rounded-xl border border-primary/20 hover:bg-primary hover:text-white transition-all group"
            >
              <span className="material-symbols-outlined group-hover:rotate-90 transition-transform">add_circle</span>
              发布新作品
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {filteredPortfolio.map((item) => (
              <div key={item.id} className="group bg-white dark:bg-zinc-900 rounded-[3rem] overflow-hidden border border-primary/5 hover:shadow-2xl transition-all flex flex-col relative">
                <div className="h-64 overflow-hidden relative">
                  <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" src={item.cover} alt={item.title} />
                  <div className="absolute top-6 left-6 flex gap-2">
                    <span className="bg-white/90 dark:bg-zinc-800/90 text-primary text-[10px] font-black px-4 py-1.5 rounded-full uppercase shadow-xl">{item.category}</span>
                    <span className="bg-primary text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase shadow-xl flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">{item.type === 'video' ? 'play_circle' : item.type === 'image' ? 'image' : 'article'}</span>
                      {item.type}
                    </span>
                  </div>
                  <button 
                    onClick={() => deleteItem(item.id)}
                    className="absolute top-6 right-6 w-10 h-10 bg-red-500/80 backdrop-blur text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  >
                    <span className="material-symbols-outlined text-lg">delete</span>
                  </button>
                </div>
                <div className="p-10 flex-1 flex flex-col">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mb-3">{item.date}</p>
                  <h3 className="text-xl font-black mb-6 group-hover:text-primary transition-colors leading-tight tracking-tight">{item.title}</h3>
                  <p className="text-slate-500 text-sm mb-8 line-clamp-3 leading-relaxed font-medium">{item.content}</p>
                  <div className="mt-auto pt-8 border-t border-slate-50 dark:border-zinc-800 flex justify-between items-center">
                    <button className="text-primary text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all">
                      阅读详情 <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </button>
                    <div className="flex gap-4 text-slate-300">
                      <span className="material-symbols-outlined text-lg hover:text-primary cursor-pointer transition-colors">favorite</span>
                      <span className="material-symbols-outlined text-lg hover:text-primary cursor-pointer transition-colors">share</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add New Project Modal */}
      {isAdding && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-6 bg-black/60 backdrop-blur-xl animate-in zoom-in-95 duration-300">
          <div className="w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-[3rem] p-12 shadow-2xl border border-primary/20 max-h-[90vh] overflow-y-auto no-scrollbar">
            <h2 className="text-3xl font-black mb-10 tracking-tighter">PUBLISH_NEW_WORK</h2>
            
            <div className="space-y-8">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">标题</label>
                <input 
                  autoFocus
                  className="w-full px-6 py-4 bg-slate-50 dark:bg-zinc-800 rounded-2xl border-none focus:ring-2 focus:ring-primary/50 text-sm font-bold"
                  placeholder="作品标题..."
                  value={newItem.title}
                  onChange={(e) => setNewItem({...newItem, title: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">领域</label>
                  <select 
                    className="w-full px-6 py-4 bg-slate-50 dark:bg-zinc-800 rounded-2xl border-none focus:ring-2 focus:ring-primary/50 text-sm font-bold appearance-none"
                    value={newItem.category}
                    onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                  >
                    {categories.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">类型</label>
                  <div className="flex gap-2 p-1 bg-slate-50 dark:bg-zinc-800 rounded-2xl border border-primary/5">
                    {['image', 'video', 'text'].map(t => (
                      <button 
                        key={t}
                        onClick={() => setNewItem({...newItem, type: t as any})}
                        className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${newItem.type === t ? 'bg-primary text-white shadow-lg' : 'text-slate-400'}`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">正文内容 (Markdown 支持)</label>
                <textarea 
                  className="w-full px-6 py-6 bg-slate-50 dark:bg-zinc-800 rounded-2xl border-none focus:ring-2 focus:ring-primary/50 text-sm font-medium leading-relaxed"
                  placeholder="写下你的思考..."
                  rows={6}
                  value={newItem.content}
                  onChange={(e) => setNewItem({...newItem, content: e.target.value})}
                />
              </div>

              <div className="flex gap-6 pt-6">
                <button onClick={() => setIsAdding(false)} className="flex-1 py-5 text-slate-400 font-black uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-zinc-800 rounded-2xl transition-all">取消发布</button>
                <button onClick={handleAddItem} className="flex-1 py-5 bg-primary text-white font-black uppercase tracking-widest rounded-2xl shadow-2xl shadow-primary/30 hover:scale-105 transition-all">确认发布</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
