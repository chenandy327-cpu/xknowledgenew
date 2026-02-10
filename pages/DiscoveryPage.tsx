
import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

const DiscoveryPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('recommended');
  const [filter, setFilter] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [hotspots, setHotspots] = useState([
    { name: '量子计算', top: '25%', left: '30%', color: '#a855f7' },
    { name: '生成式AI', top: '45%', left: '60%', color: '#7f13ec' },
    { name: '神经网络', top: '65%', left: '35%', color: '#3b82f6' },
    { name: '艺术哲学', top: '15%', left: '55%', color: '#ec4899' },
    { name: '数字孪生', top: '75%', left: '55%', color: '#3b82f6' },
    { name: '脑机接口', top: '35%', left: '15%', color: '#f59e0b' },
  ]);

  const [hotChats, setHotChats] = useState([
    { id: 1, topic: 'DeepSeek-R1 的推理逻辑', count: '1.2w', trend: 'up' },
    { id: 2, topic: '碳基与硅基生命的边界', count: '8.4k', trend: 'up' },
    { id: 3, topic: '空间计算中的交互革命', count: '6.2k', trend: 'steady' },
    { id: 4, topic: '从原子到比特：物质数字化', count: '4.8k', trend: 'up' },
    { id: 5, topic: '后人类主义下的艺术创作', count: '3.1k', trend: 'new' },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [hotspotsData, hotChatsData] = await Promise.all([
          api.getHotspots(),
          api.getHotChats()
        ]);
        setHotspots(hotspotsData);
        setHotChats(hotChatsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleTopicClick = (topic: string) => {
    setFilter(topic);
    setLoading(true);
    setTimeout(() => setLoading(false), 800);
  };

  return (
    <div className="p-6 lg:p-10 min-h-screen bg-bgLight dark:bg-bgDark transition-colors">
      {/* Top Interactive Section: Planet + Hot Chats */}
      <section className="mb-12 flex flex-col lg:flex-row gap-8 items-stretch">
        
        {/* Planet Area (Left 2/3) */}
        <div className="lg:w-2/3 relative overflow-hidden rounded-[3rem] bg-[#0c0614] p-8 md:p-12 min-h-[500px] md:min-h-[600px] flex flex-col items-center justify-center text-center shadow-2xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(127,19,236,0.15)_0%,_transparent_70%)]"></div>
          
          <div className="relative z-10 w-full mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/20 border border-primary/30 text-primary-light text-[10px] font-black mb-6 tracking-widest uppercase">
              探索模式：实时知识星球
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tight leading-tight">
              {filter ? `聚焦：${filter}` : '潜入知识的无尽深空'}
            </h1>
            {filter && (
              <button 
                onClick={() => setFilter(null)}
                className="text-primary-light hover:text-white text-xs font-black uppercase tracking-widest transition-colors"
              >
                [ 重置视野 ]
              </button>
            )}
          </div>

          {/* The Planet Container */}
          <div className="relative w-72 h-72 md:w-[400px] md:h-[400px] flex items-center justify-center group">
            <div
              className="w-full h-full rounded-full relative transition-transform duration-1000 group-hover:rotate-6 cursor-pointer overflow-hidden"
              style={{
                background: 'radial-gradient(circle at 30% 30%, #b366ff 0%, #7f13ec 40%, #2e005e 100%)',
                boxShadow: '0 0 80px rgba(127,19,236,0.4), inset -20px -20px 50px rgba(0,0,0,0.6)'
              }}
            >
              <div className="absolute inset-0 opacity-20 mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
            </div>

            {/* Pulsing Hotspots */}
            {hotspots.map((spot, i) => (
              <div
                key={i}
                onClick={() => handleTopicClick(spot.name)}
                className="absolute flex flex-col items-center cursor-pointer group/spot z-20"
                style={{ top: spot.top, left: spot.left }}
              >
                <div className="relative">
                  <div className="w-2 h-2 rounded-full bg-white shadow-[0_0_15px_#fff] animate-ping absolute inset-0"></div>
                  <div className="w-2 h-2 rounded-full bg-white relative"></div>
                </div>
                <div className={`mt-2 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white text-[9px] font-black transition-all transform group-hover/spot:scale-125 group-hover/spot:bg-primary ${filter === spot.name ? 'ring-2 ring-white scale-110 bg-primary' : ''}`}>
                  {spot.name}
                </div>
              </div>
            ))}
            
            {/* Orbital Rings */}
            <div className="absolute inset-0 border-[1px] border-primary/20 rounded-full scale-110 rotate-45 pointer-events-none opacity-20"></div>
            <div className="absolute inset-0 border-[1px] border-primary/10 rounded-full scale-125 -rotate-12 pointer-events-none opacity-10"></div>
          </div>
        </div>

        {/* Recent Hot Chats (Right 1/3) */}
        <div className="lg:w-1/3 flex flex-col bg-white dark:bg-zinc-900 rounded-[3rem] border border-primary/5 p-8 shadow-xl">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-black flex items-center gap-3 italic">
              <span className="material-symbols-outlined text-primary fill-1">trending_up</span>
              近期热聊
            </h2>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Live Now</span>
          </div>

          <div className="space-y-4 flex-1 overflow-y-auto no-scrollbar">
            {hotChats.map((chat, idx) => (
              <div 
                key={chat.id} 
                className="group p-4 rounded-[1.5rem] bg-slate-50 dark:bg-zinc-800/50 border border-transparent hover:border-primary/20 hover:bg-white dark:hover:bg-zinc-800 transition-all cursor-pointer flex items-center gap-4"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black text-lg group-hover:bg-primary group-hover:text-white transition-all">
                  {idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200 truncate group-hover:text-primary transition-colors">{chat.topic}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] text-slate-400 font-bold">{chat.count} 参与</span>
                    {chat.trend === 'up' && <span className="text-[10px] text-emerald-500 font-black">↑ 飙升</span>}
                    {chat.trend === 'new' && <span className="text-[10px] text-primary font-black">● 新兴</span>}
                  </div>
                </div>
                <span className="material-symbols-outlined text-slate-300 text-sm group-hover:translate-x-1 transition-transform">chevron_right</span>
              </div>
            ))}
          </div>

          <button className="mt-8 w-full py-4 rounded-2xl bg-primary/5 text-primary font-black text-xs uppercase tracking-widest hover:bg-primary hover:text-white transition-all">
            查看全部话题
          </button>
        </div>
      </section>

      {/* Content Feed Section */}
      <div className="max-w-[1200px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div className="flex items-center gap-2 bg-white dark:bg-zinc-900 p-1.5 rounded-2xl border border-primary/10 shadow-sm">
            {['recommended', 'global', 'following'].map((tab) => (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab); setFilter(null); }}
                className={`px-6 py-2.5 rounded-xl text-sm font-black transition-all ${
                  activeTab === tab && !filter ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-500 hover:text-primary'
                }`}
              >
                {tab === 'recommended' ? '精选推荐' : tab === 'global' ? '全站动态' : '我的关注'}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 animate-pulse">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-96 bg-slate-100 dark:bg-zinc-800 rounded-[2.5rem]"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="group bg-white dark:bg-zinc-900 rounded-[2.5rem] overflow-hidden border border-primary/5 hover:border-primary/30 transition-all cursor-pointer shadow-sm hover:shadow-2xl flex flex-col">
                <div className="h-56 overflow-hidden relative">
                  <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" src={`https://picsum.photos/id/${115 + i}/600/400`} alt="Post" />
                  <span className="absolute top-6 left-6 bg-primary text-white text-[9px] font-black px-3 py-1.5 rounded-lg uppercase tracking-[0.2em] shadow-xl">
                    {filter || 'Knowledge'}
                  </span>
                </div>
                <div className="p-8 flex-1 flex flex-col">
                  <h3 className="text-xl font-black mb-4 group-hover:text-primary transition-colors leading-tight tracking-tight uppercase">
                    {filter ? `${filter}技术如何在未来五年内重塑行业生态` : '生成式 AI 在现代 UI 交互中的深度实践'}
                  </h3>
                  <p className="text-slate-500 text-sm line-clamp-2 mb-8 leading-relaxed font-medium">
                    探讨大语言模型与实时渲染技术如何深度融合，为用户带来前所未有的沉浸式体验与认知革命...
                  </p>
                  <div className="mt-auto flex items-center justify-between pt-6 border-t border-slate-50 dark:border-zinc-800">
                    <div className="flex items-center gap-3">
                      <img className="w-8 h-8 rounded-full border border-primary/10" src={`https://picsum.photos/id/${140 + i}/100/100`} alt="User" />
                      <span className="text-xs font-black text-slate-700 dark:text-slate-300">Dr. Alan Chen</span>
                    </div>
                    <div className="flex gap-4 text-slate-400 text-[10px] font-bold">
                      <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">visibility</span> 2.4k</span>
                      <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">favorite</span> 812</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DiscoveryPage;
