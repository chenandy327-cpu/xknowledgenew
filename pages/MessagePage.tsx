
import React from 'react';

const MessagePage: React.FC = () => {
  return (
    <div className="flex h-screen bg-white dark:bg-zinc-950">
      {/* Contact List */}
      <aside className="w-80 border-r border-primary/5 flex flex-col">
        <div className="p-6 border-b border-primary/5">
          <h1 className="text-2xl font-bold mb-6">消息</h1>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-2 text-slate-400">search</span>
            <input className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-zinc-900 border-none rounded-xl text-sm" placeholder="搜索对话..." type="text" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto no-scrollbar">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className={`p-4 flex items-center gap-4 cursor-pointer hover:bg-primary/5 border-b border-primary/5 ${i === 1 ? 'bg-primary/5 border-l-4 border-primary' : ''}`}>
              <img className="w-12 h-12 rounded-2xl object-cover" src={`https://picsum.photos/id/${150 + i}/100/100`} alt="Avatar" />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-bold text-sm truncate">陈婉莹 (AI 研究)</h3>
                  <span className="text-[10px] text-slate-400">14:20</span>
                </div>
                <p className="text-xs text-slate-500 truncate">期待你分享更多的学习图谱...</p>
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* Chat Area */}
      <main className="flex-1 flex flex-col">
        <header className="h-20 px-8 border-b border-primary/5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img className="w-10 h-10 rounded-xl" src="https://picsum.photos/id/151/100/100" alt="Active Chat" />
            <div>
              <h2 className="font-bold text-base">陈婉莹</h2>
              <p className="text-[10px] text-emerald-500 uppercase font-bold tracking-widest">在线</p>
            </div>
          </div>
          <div className="flex gap-4">
            <button className="px-6 py-2 bg-primary/10 text-primary font-bold rounded-xl text-sm hover:bg-primary hover:text-white transition-all">添加好友</button>
            <button className="p-2 text-slate-400 hover:text-primary transition-colors"><span className="material-symbols-outlined">more_vert</span></button>
          </div>
        </header>

        <div className="flex-1 p-8 overflow-y-auto no-scrollbar space-y-8">
          <div className="flex gap-4 max-w-2xl">
            <img className="w-8 h-8 rounded-xl mt-1" src="https://picsum.photos/id/151/100/100" alt="Other" />
            <div className="bg-slate-50 dark:bg-zinc-900 p-4 rounded-2xl rounded-tl-none border border-primary/5 text-sm leading-relaxed">
              你好！看了你最近更新的作品集，非常赞同你对生成式设计模块的理解。
            </div>
          </div>
          <div className="flex flex-row-reverse gap-4">
            <div className="bg-primary text-white p-4 rounded-2xl rounded-tr-none shadow-lg shadow-primary/20 text-sm leading-relaxed max-w-2xl">
              谢谢陈老师！我也在关注您的研究，收获良多。
            </div>
          </div>
        </div>

        <footer className="p-6 border-t border-primary/5">
          <div className="relative">
            <textarea className="w-full p-4 pr-16 bg-slate-50 dark:bg-zinc-900 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 text-sm resize-none" placeholder="输入消息..." rows={1}></textarea>
            <button className="absolute right-3 bottom-3 w-10 h-10 bg-primary text-white rounded-xl shadow-lg flex items-center justify-center">
              <span className="material-symbols-outlined">send</span>
            </button>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default MessagePage;
