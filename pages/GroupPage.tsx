
import React, { useState } from 'react';

const GroupPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'AI & Data', 'Design', 'Philosophy', 'Science', 'Art'];

  const myGroups = [
    { name: '量子计算研讨会', members: '1.2k', icon: '⚡' },
    { name: '生成式艺术实验室', members: '840', icon: '🎨' },
    { name: '现代哲学沙龙', members: '3.1k', icon: '🏛️' },
  ];

  const recommendedGroups = [
    { title: '神经网络架构深度探索', members: '4.5k', desc: '专注于深度学习架构的最前沿研究与讨论。', cover: 'https://picsum.photos/id/201/400/250' },
    { title: '未来城市设计小组', members: '2.8k', desc: '探讨 AI 与可持续建筑如何重塑未来都市。', cover: 'https://picsum.photos/id/202/400/250' },
    { title: '数字考古学', members: '1.1k', desc: '利用技术手段挖掘和保护数字遗产。', cover: 'https://picsum.photos/id/203/400/250' },
    { title: '生物黑客与增强', members: '6.7k', desc: '关于生物技术与人类增强的伦理与实践讨论。', cover: 'https://picsum.photos/id/204/400/250' },
  ];

  return (
    <div className="p-8 max-w-[1400px] mx-auto min-h-screen">
      <header className="mb-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">知识小组</h1>
            <p className="text-slate-500">在垂直领域与全球探索者进行深度连接</p>
          </div>
          <div className="flex gap-3">
            <button className="px-6 py-3 bg-white dark:bg-zinc-900 border border-primary/10 rounded-2xl text-sm font-bold flex items-center gap-2 hover:bg-primary/5 transition-all">
              <span className="material-symbols-outlined text-sm">search</span> 搜索小组
            </button>
            <button className="px-6 py-3 bg-primary text-white rounded-2xl text-sm font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all">
              创建小组
            </button>
          </div>
        </div>

        {/* My Groups Horizontal Scroll */}
        <div className="mb-12">
          <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6 px-1">我的小组</h2>
          <div className="flex gap-6 overflow-x-auto no-scrollbar pb-4 -mx-1 px-1">
            {myGroups.map((group, i) => (
              <div key={i} className="flex-shrink-0 w-64 bg-white dark:bg-zinc-900 p-6 rounded-[2rem] border border-primary/5 hover:border-primary/20 transition-all cursor-pointer shadow-sm flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center text-3xl shadow-inner">
                  {group.icon}
                </div>
                <div>
                  <h3 className="font-bold text-sm mb-1 truncate">{group.name}</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">{group.members} Members</p>
                </div>
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
          {recommendedGroups.map((group, i) => (
            <div key={i} className="group bg-white dark:bg-zinc-900 rounded-[2.5rem] overflow-hidden border border-primary/5 hover:shadow-2xl hover:border-primary/30 transition-all flex flex-col">
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
                  <button className="text-primary text-sm font-bold flex items-center gap-1 hover:gap-2 transition-all">
                    申请加入 <span className="material-symbols-outlined text-base">arrow_forward</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default GroupPage;
