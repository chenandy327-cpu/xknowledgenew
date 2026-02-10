
import React from 'react';

interface CreateModalProps {
  onClose: () => void;
}

const CreateModal: React.FC<CreateModalProps> = ({ onClose }) => {
  const options = [
    { icon: 'edit_note', label: '发布作品', desc: '支持图文、视频多媒体' },
    { icon: 'live_tv', label: '发起直播', desc: '连接课程，实时互动', highlight: true },
    { icon: 'school', label: '上传录播', desc: '系统化课程教学' },
    { icon: 'groups', label: '创建小组', desc: '连接志同道合的伙伴' },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-bgDark/80 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-[3rem] shadow-2xl border border-primary/10 overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="p-8 border-b border-primary/5 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-1">开始创作</h2>
            <p className="text-slate-500 text-sm">选择你的创作形式，激发无限潜能</p>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-primary/5 rounded-full transition-colors">
            <span className="material-symbols-outlined text-slate-400">close</span>
          </button>
        </div>
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          {options.map((opt, i) => (
            <button
              key={i}
              className={`p-6 rounded-[2rem] border transition-all text-left flex gap-6 hover:-translate-y-1 ${
                opt.highlight
                  ? 'bg-primary border-primary text-white shadow-xl shadow-primary/30'
                  : 'bg-slate-50 dark:bg-zinc-800/50 border-primary/5 hover:border-primary/20'
              }`}
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner ${
                opt.highlight ? 'bg-white/20' : 'bg-white dark:bg-zinc-800 text-primary'
              }`}>
                <span className="material-symbols-outlined text-3xl">{opt.icon}</span>
              </div>
              <div className="flex-1">
                <p className="font-bold text-lg mb-1">{opt.label}</p>
                <p className={`text-xs ${opt.highlight ? 'text-white/70' : 'text-slate-400'}`}>{opt.desc}</p>
              </div>
            </button>
          ))}
        </div>
        <div className="p-8 bg-slate-50 dark:bg-zinc-800/50 flex justify-center">
          <p className="text-xs text-slate-400 font-medium">x² 创作者权益：全方位多媒体形态支持（图文/视频/直播）</p>
        </div>
      </div>
    </div>
  );
};

export default CreateModal;
