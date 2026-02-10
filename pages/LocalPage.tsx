
import React, { useState } from 'react';

interface UserEvent {
  day: number;
  title: string;
  type: string;
}

const LocalPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('find');
  const [userEvents, setUserEvents] = useState<UserEvent[]>([
    { day: 15, title: 'AI 艺术闭门分享会', type: 'Personal' }
  ]);
  const [editingDay, setEditingDay] = useState<number | null>(null);
  const [newTitle, setNewTitle] = useState('');

  const daysInMonth = 30;
  const events = [
    { title: 'x²年度跨界知识论坛', dist: 1.2, cat: '学术会议', date: '11月11日', cover: 'https://picsum.photos/id/111/400/300' },
    { title: '“数字之境”光影艺术展', dist: 3.5, cat: '艺术展览', date: '11月15日', cover: 'https://picsum.photos/id/122/400/300' },
    { title: '独立创作者交流周', dist: 0.8, cat: '同城聚会', date: '11月20日', cover: 'https://picsum.photos/id/133/400/300' },
  ];

  const handleAddEvent = () => {
    if (editingDay && newTitle) {
      setUserEvents([...userEvents, { day: editingDay, title: newTitle, type: 'User' }]);
      setNewTitle('');
      setEditingDay(null);
    }
  };

  const removeEvent = (day: number) => {
    setUserEvents(userEvents.filter(e => e.day !== day));
  };

  return (
    <div className="flex flex-col h-screen bg-bgLight dark:bg-bgDark">
      <header className="h-24 bg-white dark:bg-zinc-900 border-b border-primary/5 px-10 flex items-center justify-between sticky top-0 z-40 shadow-sm">
        <div className="flex items-center space-x-16">
          <h1 className="text-2xl font-black text-primary tracking-tighter italic">LOCAL_NET</h1>
          <nav className="flex space-x-10">
            {['find', 'calendar', 'my'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative py-3 text-sm font-bold transition-all ${
                  activeTab === tab ? 'text-primary' : 'text-slate-500 hover:text-primary'
                }`}
              >
                {tab === 'find' ? '探索活动' : tab === 'calendar' ? '活动日历' : '已预约'}
                {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-1 bg-primary rounded-full animate-in slide-in-from-left-2"></div>}
              </button>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-primary/10 px-6 py-2 rounded-full flex items-center gap-3 text-sm text-primary font-bold border border-primary/20">
            <span className="material-symbols-outlined text-lg fill-1">location_on</span> 上海 · 徐汇
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-10 no-scrollbar">
        {activeTab === 'find' && (
          <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              {events.map((ev, i) => (
                <div key={i} className="group bg-white dark:bg-zinc-900 rounded-[2.5rem] overflow-hidden border border-primary/5 hover:shadow-2xl transition-all flex flex-col">
                  <div className="h-56 relative overflow-hidden">
                    <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" src={ev.cover} alt="Event" />
                    <span className="absolute top-6 left-6 bg-white/95 dark:bg-zinc-800/95 text-[10px] font-black text-primary px-4 py-1.5 rounded-full uppercase tracking-wider shadow-xl">{ev.cat}</span>
                  </div>
                  <div className="p-8 flex-1">
                    <h3 className="font-black text-xl mb-6 group-hover:text-primary transition-colors leading-tight">{ev.title}</h3>
                    <div className="flex items-center justify-between text-slate-400 text-xs font-bold pt-6 border-t border-slate-50 dark:border-zinc-800">
                      <span className="flex items-center gap-2 text-primary bg-primary/5 px-3 py-1 rounded-lg">
                        <span className="material-symbols-outlined text-sm">near_me</span> {ev.dist}km
                      </span>
                      <span>{ev.date} · 14:00</span>
                    </div>
                  </div>
                </div>
              ))}
              <div className="border-4 border-dashed border-primary/10 rounded-[2.5rem] flex flex-col items-center justify-center p-12 group cursor-pointer hover:bg-primary/5 hover:border-primary/30 transition-all">
                <div className="w-16 h-16 bg-primary text-white rounded-2xl flex items-center justify-center shadow-2xl group-hover:rotate-90 transition-transform">
                  <span className="material-symbols-outlined text-3xl">add</span>
                </div>
                <p className="mt-6 font-black text-primary text-xl">发布你的活动</p>
              </div>
            </div>

            <div className="lg:col-span-4 space-y-8">
              <div className="bg-white dark:bg-zinc-900 p-8 rounded-[2.5rem] border border-primary/5 shadow-sm">
                <h2 className="text-xl font-black mb-8 flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary fill-1">map</span> 区域热力
                </h2>
                <div className="aspect-square bg-slate-100 dark:bg-zinc-800 rounded-3xl relative overflow-hidden mb-8 border border-primary/5">
                  <img className="absolute inset-0 w-full h-full object-cover opacity-60 dark:opacity-30 mix-blend-multiply" src="https://picsum.photos/id/104/500/500" alt="Map" />
                  <div className="absolute top-1/2 left-1/3 w-20 h-20 bg-primary/20 rounded-full animate-pulse blur-xl"></div>
                </div>
                <button className="w-full bg-zinc-900 dark:bg-white dark:text-zinc-900 text-white py-5 rounded-2xl font-black text-sm hover:scale-[1.02] transition-all shadow-xl">
                  开启 AR 寻迹模式
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'calendar' && (
          <div className="max-w-[1200px] mx-auto bg-white dark:bg-zinc-900 rounded-[3rem] border border-primary/5 shadow-sm overflow-hidden">
            <div className="p-10 border-b border-primary/5 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black mb-1">2024年 11月</h2>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Knowledge Journey Planner</p>
              </div>
              <div className="flex gap-4">
                <button className="p-3 hover:bg-primary/10 rounded-2xl border border-primary/5 transition-all"><span className="material-symbols-outlined">chevron_left</span></button>
                <button className="p-3 hover:bg-primary/10 rounded-2xl border border-primary/5 transition-all"><span className="material-symbols-outlined">chevron_right</span></button>
              </div>
            </div>
            <div className="grid grid-cols-7 text-center">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                <div key={d} className="py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] bg-slate-50/50 dark:bg-zinc-800/30 border-b border-primary/5">
                  {d}
                </div>
              ))}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const dayEvent = userEvents.find(e => e.day === day);
                return (
                  <div 
                    key={i} 
                    onClick={() => setEditingDay(day)}
                    className={`h-36 border-r border-b border-primary/5 p-4 flex flex-col transition-all cursor-pointer hover:bg-primary/5 group ${dayEvent ? 'bg-primary/5' : ''}`}
                  >
                    <span className={`text-xs font-black ${dayEvent ? 'text-primary' : 'text-slate-300'}`}>{day}</span>
                    {dayEvent && (
                      <div className="mt-2 p-2 bg-primary/10 border border-primary/20 rounded-xl text-[10px] font-bold text-primary animate-in zoom-in-95 relative group/item">
                        <span className="block truncate">{dayEvent.title}</span>
                        <button 
                          onClick={(e) => { e.stopPropagation(); removeEvent(day); }}
                          className="absolute -top-1 -right-1 bg-white dark:bg-zinc-800 text-slate-400 rounded-full w-4 h-4 flex items-center justify-center opacity-0 group-hover/item:opacity-100 hover:text-red-500 transition-all"
                        >
                          ×
                        </button>
                      </div>
                    )}
                    <div className="mt-auto opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-[10px] text-primary font-bold">+ 添加日程</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Quick Add Modal */}
      {editingDay && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-[2.5rem] p-10 shadow-2xl border border-primary/20">
            <h3 className="text-xl font-black mb-6">规划 11月{editingDay}日</h3>
            <input 
              autoFocus
              className="w-full px-6 py-4 bg-slate-50 dark:bg-zinc-800 rounded-2xl border-none mb-8 focus:ring-2 focus:ring-primary/50 text-sm font-bold"
              placeholder="日程标题 (如：参观展览)"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddEvent()}
            />
            <div className="flex gap-4">
              <button onClick={() => setEditingDay(null)} className="flex-1 py-4 text-slate-500 font-bold hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-2xl transition-all">取消</button>
              <button onClick={handleAddEvent} className="flex-1 py-4 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/20">确定记录</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocalPage;
