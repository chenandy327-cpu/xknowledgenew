
import React, { useState } from 'react';

const CoursePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('mine');
  const [heatmapData, setHeatmapData] = useState<number[]>(
    Array.from({ length: 120 }).map(() => Math.floor(Math.random() * 5))
  );

  const courses = [
    { title: '量化分析进阶：模型与风控', instructor: 'Dr. Alan Chen', progress: 45, completed: false, cover: 'https://picsum.photos/id/180/400/300' },
    { title: 'UI/UX 深度思维体系', instructor: 'Sarah Wang', progress: 100, completed: true, cover: 'https://picsum.photos/id/181/400/300' },
    { title: '现代物理学基础：量子力学', instructor: 'Prof. Zhao', progress: 12, completed: false, cover: 'https://picsum.photos/id/182/400/300' },
  ];

  const toggleHeatmapLevel = (index: number) => {
    const newData = [...heatmapData];
    newData[index] = (newData[index] + 1) % 5;
    setHeatmapData(newData);
  };

  const getHeatmapColor = (level: number) => {
    const colors = [
      'bg-slate-100 dark:bg-zinc-800', 
      'bg-primary/20', 
      'bg-primary/40', 
      'bg-primary/70', 
      'bg-primary'
    ];
    return colors[level];
  };

  return (
    <div className="p-8 max-w-[1400px] mx-auto min-h-screen">
      <header className="mb-16">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-10 mb-12">
          <div>
            <h1 className="text-5xl font-black text-slate-900 dark:text-white mb-4 tracking-tighter">COURSE_CENTER</h1>
            <p className="text-slate-500 font-medium">构建你的系统化知识大厦</p>
          </div>
          <nav className="flex items-center gap-2 bg-white dark:bg-zinc-900 p-2 rounded-2xl border border-primary/5 shadow-sm">
            {['explore', 'mine', 'certificates'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-8 py-3 rounded-xl text-sm font-black transition-all ${
                  activeTab === tab ? 'bg-primary text-white shadow-xl' : 'text-slate-500 hover:text-primary'
                }`}
              >
                {tab === 'explore' ? '发现课程' : tab === 'mine' ? '学习档案' : '学术证书'}
              </button>
            ))}
          </nav>
        </div>

        {/* Interactive Heatmap Section */}
        {activeTab === 'mine' && (
          <div className="bg-white dark:bg-zinc-900 p-10 rounded-[3rem] border border-primary/5 mb-16 shadow-lg group">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h3 className="text-2xl font-black mb-2 italic">DAILY_INTENSITY</h3>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">info</span> 点击网格手动修正当日学习强度
                </p>
              </div>
              <div className="flex items-center gap-10">
                <div className="text-right">
                  <p className="text-4xl font-black text-primary tracking-tighter">148<span className="text-lg">h</span></p>
                  <p className="text-[10px] text-slate-400 font-black uppercase mt-1">Total Effort</p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-[repeat(auto-fill,minmax(14px,14px))] gap-1.5 justify-center">
              {heatmapData.map((level, i) => (
                <div 
                  key={i} 
                  onClick={() => toggleHeatmapLevel(i)}
                  className={`w-3.5 h-3.5 rounded-sm ${getHeatmapColor(level)} transition-all cursor-pointer hover:ring-2 hover:ring-primary/50 hover:scale-125 z-10`}
                  title={`Day ${i + 1}: Level ${level}`}
                ></div>
              ))}
            </div>

            <div className="flex justify-between mt-10 text-[10px] text-slate-400 font-black tracking-widest uppercase items-center pt-8 border-t border-slate-50 dark:border-zinc-800">
              <span className="flex items-center gap-2"><span className="material-symbols-outlined text-sm">event_available</span> Active for 120 Days</span>
              <div className="flex items-center gap-3">
                <span>Less</span>
                <div className="flex gap-1.5">
                  {[0, 1, 2, 3, 4].map((l) => (
                    <div key={l} className={`w-3 h-3 rounded-sm ${getHeatmapColor(l)}`}></div>
                  ))}
                </div>
                <span>More</span>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
        {(activeTab === 'explore' ? courses : courses.filter(c => activeTab === 'mine' ? true : c.completed)).map((course, i) => (
          <div key={i} className="group bg-white dark:bg-zinc-900 rounded-[3rem] overflow-hidden border border-primary/5 hover:shadow-[0_40px_80px_rgba(127,19,236,0.15)] transition-all flex flex-col">
            <div className="h-56 relative overflow-hidden">
              <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" src={course.cover} alt="Course" />
              {course.completed && (
                <div className="absolute top-6 right-6 w-12 h-12 bg-emerald-500 text-white rounded-2xl flex items-center justify-center shadow-2xl animate-bounce-slow">
                  <span className="material-symbols-outlined fill-1">verified</span>
                </div>
              )}
            </div>
            <div className="p-10 flex-1 flex flex-col">
              <h3 className="font-black text-xl mb-6 group-hover:text-primary transition-colors line-clamp-2 leading-tight uppercase tracking-tight">{course.title}</h3>
              <div className="flex items-center gap-3 mb-8">
                <img className="w-8 h-8 rounded-full border border-primary/10" src={`https://picsum.photos/id/${80 + i}/50/50`} alt="Instructor" />
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{course.instructor}</span>
              </div>

              {activeTab !== 'explore' && (
                <div className="mt-auto mb-8">
                  <div className="flex justify-between text-[10px] font-black mb-3 uppercase tracking-widest">
                    <span className="text-slate-400">Progress</span>
                    <span className="text-primary">{course.progress}%</span>
                  </div>
                  <div className="h-1.5 bg-primary/5 rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: `${course.progress}%` }}></div>
                  </div>
                </div>
              )}

              <button className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-md ${
                course.completed ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' : 'bg-primary/5 text-primary hover:bg-primary hover:text-white'
              }`}>
                {course.completed ? 'Get Certificate' : 'Continue Mission'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CoursePage;
