
import React, { useState, useEffect } from 'react';
import { api } from '@api';

interface Group {
  id: string;
  name: string;
  members: string;
  icon: string;
  category?: string;
  desc?: string;
  cover?: string;
}

const GroupPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [newGroup, setNewGroup] = useState({ name: '', category: 'AI & Data', desc: '' });
  const [myGroups, setMyGroups] = useState<Group[]>([
    { id: '1', name: '量子计算研讨会', members: '1.2k', icon: '⚡' },
    { id: '2', name: '生成式艺术实验室', members: '840', icon: '🎨' },
    { id: '3', name: '现代哲学沙龙', members: '3.1k', icon: '🏛️' },
  ]);
  const [recommendedGroups, setRecommendedGroups] = useState<Group[]>([
    { id: '4', title: '神经网络架构深度探索', members: '4.5k', desc: '专注于深度学习架构的最前沿研究与讨论。', cover: 'https://picsum.photos/id/201/400/250', category: 'AI & Data' },
    { id: '5', title: '未来城市设计小组', members: '2.8k', desc: '探讨 AI 与可持续建筑如何重塑未来都市。', cover: 'https://picsum.photos/id/202/400/250', category: 'Design' },
    { id: '6', title: '数字考古学', members: '1.1k', desc: '利用技术手段挖掘和保护数字遗产。', cover: 'https://picsum.photos/id/203/400/250', category: 'Science' },
    { id: '7', title: '生物黑客与增强', members: '6.7k', desc: '关于生物技术与人类增强的伦理与实践讨论。', cover: 'https://picsum.photos/id/204/400/250', category: 'Science' },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const categories = ['All', 'AI & Data', 'Design', 'Philosophy', 'Science', 'Art'];

  // 过滤推荐小组
  const filteredGroups = recommendedGroups.filter(group => {
    const matchesCategory = activeCategory === 'All' || group.category === activeCategory;
    const matchesSearch = !searchQuery || (group.title && group.title.toLowerCase().includes(searchQuery.toLowerCase())) || (group.desc && group.desc.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // 创建小组
  const handleCreateGroup = () => {
    if (newGroup.name && newGroup.desc) {
      const group: Group = {
        id: Date.now().toString(),
        name: newGroup.name,
        members: '1',
        icon: '🌟',
        category: newGroup.category,
        desc: newGroup.desc,
        cover: `https://picsum.photos/id/${Math.floor(Math.random() * 300)}/400/250`
      };
      setMyGroups([group, ...myGroups]);
      setRecommendedGroups([group, ...recommendedGroups]);
      setIsCreating(false);
      setNewGroup({ name: '', category: 'AI & Data', desc: '' });
      // 保存到本地存储
      localStorage.setItem('myGroups', JSON.stringify([group, ...myGroups]));
    }
  };

  // 加入小组
  const joinGroup = (group: Group) => {
    if (!myGroups.find(g => g.id === group.id)) {
      const updatedGroup = { ...group, members: (parseInt(group.members) + 1).toString() + 'k' };
      setMyGroups([updatedGroup, ...myGroups]);
      // 保存到本地存储
      localStorage.setItem('myGroups', JSON.stringify([updatedGroup, ...myGroups]));
    }
  };

  // 删除小组
  const deleteGroup = (group: Group) => {
    if (window.confirm('确定要删除这个小组吗？')) {
      const updatedMyGroups = myGroups.filter(g => g.id !== group.id);
      setMyGroups(updatedMyGroups);
      // 从推荐小组中也删除
      const updatedRecommendedGroups = recommendedGroups.filter(g => g.id !== group.id);
      setRecommendedGroups(updatedRecommendedGroups);
      // 保存到本地存储
      localStorage.setItem('myGroups', JSON.stringify(updatedMyGroups));
    }
  };

  // 从本地存储加载数据
  useEffect(() => {
    const savedMyGroups = localStorage.getItem('myGroups');
    if (savedMyGroups) {
      setMyGroups(JSON.parse(savedMyGroups));
    }
  }, []);

  return (
    <div className="p-8 max-w-[1400px] mx-auto min-h-screen">
      <header className="mb-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">知识小组</h1>
            <p className="text-slate-500">在垂直领域与全球探索者进行深度连接</p>
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <input
                type="text"
                placeholder="搜索小组..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-6 py-3 bg-white dark:bg-zinc-900 border border-primary/10 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <span className="material-symbols-outlined text-sm absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400">search</span>
            </div>
            <button 
              onClick={() => setIsCreating(true)}
              className="px-6 py-3 bg-primary text-white rounded-2xl text-sm font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all"
            >
              创建小组
            </button>
          </div>
        </div>

        {/* My Groups Horizontal Scroll */}
        <div className="mb-12">
          <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6 px-1">我的小组</h2>
          <div className="flex gap-6 overflow-x-auto no-scrollbar pb-4 -mx-1 px-1">
            {myGroups.map((group) => (
              <div key={group.id} className="flex-shrink-0 w-64 bg-white dark:bg-zinc-900 p-6 rounded-[2rem] border border-primary/5 hover:border-primary/20 transition-all cursor-pointer shadow-sm flex items-center gap-4 relative">
                <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center text-3xl shadow-inner">
                  {group.icon}
                </div>
                <div>
                  <h3 className="font-bold text-sm mb-1 truncate">{group.name}</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">{group.members} Members</p>
                </div>
                <button 
                  onClick={() => deleteGroup(group)}
                  className="absolute top-4 right-4 w-8 h-8 bg-red-500/10 flex items-center justify-center rounded-full hover:bg-red-500/20 transition-all"
                  title="删除小组"
                >
                  <span className="material-symbols-outlined text-red-500 text-sm">delete</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* Recommended Section */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">推荐加入</h2>
          <div className="flex gap-2 bg-slate-100 dark:bg-zinc-800 p-1 rounded-xl">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeCategory === cat ? 'bg-white dark:bg-zinc-700 shadow-sm text-primary' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredGroups.map((group) => (
            <div key={group.id} className="group bg-white dark:bg-zinc-900 rounded-[2.5rem] overflow-hidden border border-primary/5 hover:shadow-2xl hover:border-primary/30 transition-all flex flex-col">
              <div className="h-40 overflow-hidden relative">
                <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" src={group.cover} alt="Group Cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <span className="text-[10px] font-black uppercase tracking-widest">{group.members} Members</span>
                </div>
              </div>
              <div className="p-8 flex-1 flex flex-col">
                <h3 className="font-bold text-lg mb-3 group-hover:text-primary transition-colors">{group.title}</h3>
                <p className="text-slate-500 text-sm mb-6 line-clamp-2 leading-relaxed">{group.desc}</p>
                <div className="mt-auto flex items-center justify-between">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map((u) => (
                      <img key={u} className="w-6 h-6 rounded-full border-2 border-white dark:border-zinc-800" src={`https://picsum.photos/id/${210+u}/50/50`} alt="User" />
                    ))}
                  </div>
                  <button 
                    onClick={() => joinGroup(group)}
                    className="text-primary text-sm font-bold flex items-center gap-1 hover:gap-2 transition-all"
                  >
                    申请加入 <span className="material-symbols-outlined text-base">arrow_forward</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Create Group Modal */}
      {isCreating && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-6 bg-black/60 backdrop-blur-xl animate-in zoom-in-95 duration-300">
          <div className="w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-[3rem] p-12 shadow-2xl border border-primary/20 max-h-[90vh] overflow-y-auto no-scrollbar">
            <h2 className="text-3xl font-black mb-10 tracking-tighter">创建新小组</h2>
            
            <div className="space-y-8">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">小组名称</label>
                <input 
                  autoFocus
                  className="w-full px-6 py-4 bg-slate-50 dark:bg-zinc-800 rounded-2xl border-none focus:ring-2 focus:ring-primary/50 text-sm font-bold"
                  placeholder="输入小组名称..."
                  value={newGroup.name}
                  onChange={(e) => setNewGroup({...newGroup, name: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">小组类别</label>
                <select 
                  className="w-full px-6 py-4 bg-slate-50 dark:bg-zinc-800 rounded-2xl border-none focus:ring-2 focus:ring-primary/50 text-sm font-bold appearance-none"
                  value={newGroup.category}
                  onChange={(e) => setNewGroup({...newGroup, category: e.target.value})}
                >
                  {categories.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">小组描述</label>
                <textarea 
                  className="w-full px-6 py-6 bg-slate-50 dark:bg-zinc-800 rounded-2xl border-none focus:ring-2 focus:ring-primary/50 text-sm font-medium leading-relaxed"
                  placeholder="描述你的小组..."
                  rows={4}
                  value={newGroup.desc}
                  onChange={(e) => setNewGroup({...newGroup, desc: e.target.value})}
                />
              </div>

              {error && (
                <div className="text-red-500 text-sm">{error}</div>
              )}

              <div className="flex gap-6 pt-6">
                <button onClick={() => setIsCreating(false)} className="flex-1 py-5 text-slate-400 font-black uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-zinc-800 rounded-2xl transition-all">取消</button>
                <button onClick={handleCreateGroup} className="flex-1 py-5 bg-primary text-white font-black uppercase tracking-widest rounded-2xl shadow-2xl shadow-primary/30 hover:scale-105 transition-all">创建小组</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupPage;
