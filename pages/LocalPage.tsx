
import React, { useState, useEffect } from 'react';

interface UserEvent {
  day: number;
  title: string;
  type: string;
}

interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  date: string;
  location: string;
  cover: string;
  creator: string;
  participants: number;
  maxParticipants: number;
}

interface Participant {
  id: string;
  name: string;
  avatar: string;
  status: 'pending' | 'accepted';
}

const LocalPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('find');
  const [userEvents, setUserEvents] = useState<UserEvent[]>([
    { day: 15, title: 'AI 艺术闭门分享会', type: 'Personal' }
  ]);
  const [editingDay, setEditingDay] = useState<number | null>(null);
  const [newTitle, setNewTitle] = useState('');

  // 项目相关状态
  const [projects, setProjects] = useState<Project[]>([
    { id: '1', title: 'x²年度跨界知识论坛', description: '汇聚各领域专家，探讨前沿技术与艺术的融合', category: '学术会议', date: '11月11日', location: '上海 · 徐汇', cover: 'https://picsum.photos/id/111/400/300', creator: 'Dr. Alan Chen', participants: 120, maxParticipants: 200 },
    { id: '2', title: '“数字之境”光影艺术展', description: '探索数字技术与传统艺术的碰撞', category: '艺术展览', date: '11月15日', location: '上海 · 黄浦', cover: 'https://picsum.photos/id/122/400/300', creator: 'Artist Mike Wang', participants: 85, maxParticipants: 150 },
    { id: '3', title: '独立创作者交流周', description: '为独立创作者提供交流与合作的平台', category: '同城聚会', date: '11月20日', location: '上海 · 静安', cover: 'https://picsum.photos/id/133/400/300', creator: 'CEO Lisa Zhang', participants: 60, maxParticipants: 100 },
  ]);
  
  const [showCreateProjectModal, setShowCreateProjectModal] = useState(false);
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    category: '同城聚会',
    date: '',
    location: '',
    maxParticipants: 50
  });
  
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [showProjectDetailModal, setShowProjectDetailModal] = useState(false);

  const daysInMonth = 30;

  // 从本地存储加载项目数据
  useEffect(() => {
    const savedProjects = localStorage.getItem('projects');
    if (savedProjects) {
      setProjects(JSON.parse(savedProjects));
    }
  }, []);

  // 保存项目数据到本地存储
  useEffect(() => {
    localStorage.setItem('projects', JSON.stringify(projects));
  }, [projects]);

  // 创建项目
  const handleCreateProject = () => {
    if (newProject.title && newProject.description && newProject.date && newProject.location) {
      const project: Project = {
        id: Date.now().toString(),
        title: newProject.title,
        description: newProject.description,
        category: newProject.category,
        date: newProject.date,
        location: newProject.location,
        cover: `https://picsum.photos/id/${Math.floor(Math.random() * 300)}/400/300`,
        creator: 'You',
        participants: 0,
        maxParticipants: newProject.maxParticipants
      };
      setProjects([project, ...projects]);
      setShowCreateProjectModal(false);
      setNewProject({
        title: '',
        description: '',
        category: '同城聚会',
        date: '',
        location: '',
        maxParticipants: 50
      });
    }
  };

  // 查看项目详情
  const viewProjectDetail = (project: Project) => {
    setSelectedProject(project);
    // 从本地存储加载参与者数据
    const savedParticipants = localStorage.getItem(`project_${project.id}_participants`);
    if (savedParticipants) {
      setParticipants(JSON.parse(savedParticipants));
    } else {
      // 模拟参与者数据
      setParticipants([
        { id: '1', name: '张明', avatar: 'https://picsum.photos/id/152/100/100', status: 'accepted' },
        { id: '2', name: '李华', avatar: 'https://picsum.photos/id/153/100/100', status: 'accepted' },
        { id: '3', name: '王芳', avatar: 'https://picsum.photos/id/154/100/100', status: 'pending' },
        { id: '4', name: '赵强', avatar: 'https://picsum.photos/id/155/100/100', status: 'pending' },
      ]);
    }
    setShowProjectDetailModal(true);
  };

  // 报名参与活动
  const joinProject = () => {
    if (selectedProject) {
      // 检查是否已经报名
      const isAlreadyJoined = participants.some(p => p.name === 'You');
      if (!isAlreadyJoined) {
        const newParticipant: Participant = {
          id: Date.now().toString(),
          name: 'You',
          avatar: 'https://picsum.photos/id/151/100/100',
          status: 'accepted'
        };
        const updatedParticipants = [newParticipant, ...participants];
        setParticipants(updatedParticipants);
        
        // 更新项目参与者数量
        const updatedProjects = projects.map(project => 
          project.id === selectedProject.id 
            ? { ...project, participants: project.participants + 1 }
            : project
        );
        setProjects(updatedProjects);
        setSelectedProject({ ...selectedProject, participants: selectedProject.participants + 1 });
        
        // 保存参与者数据到本地存储
        localStorage.setItem(`project_${selectedProject.id}_participants`, JSON.stringify(updatedParticipants));
      }
    }
  };

  // 邀请用户
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');

  // 地址相关状态
  const [currentLocation, setCurrentLocation] = useState('上海 · 徐汇');
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [locations] = useState([
    '上海 · 徐汇',
    '上海 · 黄浦',
    '上海 · 静安',
    '北京 · 朝阳',
    '北京 · 海淀',
    '广州 · 天河',
    '广州 · 越秀',
    '深圳 · 南山',
    '深圳 · 福田'
  ]);

  const handleInviteUser = () => {
    if (inviteEmail && selectedProject) {
      // 模拟邀请成功
      const invitedParticipant: Participant = {
        id: Date.now().toString(),
        name: inviteEmail.split('@')[0],
        avatar: `https://picsum.photos/id/${Math.floor(Math.random() * 100)}/100/100`,
        status: 'pending'
      };
      const updatedParticipants = [invitedParticipant, ...participants];
      setParticipants(updatedParticipants);
      
      // 保存参与者数据到本地存储
      localStorage.setItem(`project_${selectedProject.id}_participants`, JSON.stringify(updatedParticipants));
      
      setShowInviteModal(false);
      setInviteEmail('');
    }
  };

  // 删除项目
  const deleteProject = (projectId: string) => {
    if (window.confirm('确定要删除这个活动吗？')) {
      const updatedProjects = projects.filter(project => project.id !== projectId);
      setProjects(updatedProjects);
      // 清除相关的参与者数据
      localStorage.removeItem(`project_${projectId}_participants`);
    }
  };

  // 管理参与状态
  const updateParticipantStatus = (participantId: string, status: 'accepted' | 'pending') => {
    if (selectedProject) {
      const updatedParticipants = participants.map(participant => 
        participant.id === participantId ? { ...participant, status } : participant
      );
      setParticipants(updatedParticipants);
      
      // 保存参与者数据到本地存储
      localStorage.setItem(`project_${selectedProject.id}_participants`, JSON.stringify(updatedParticipants));
    }
  };

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
          <div className="bg-primary/10 px-6 py-2 rounded-full flex items-center gap-3 text-sm text-primary font-bold border border-primary/20 cursor-pointer hover:bg-primary/20 transition-all" onClick={() => setShowLocationModal(true)}>
            <span className="material-symbols-outlined text-lg fill-1">location_on</span> {currentLocation}
            <span className="material-symbols-outlined text-sm">expand_more</span>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-10 no-scrollbar">
        {activeTab === 'find' && (
          <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              {projects.map((project) => (
                <div key={project.id} className="group bg-white dark:bg-zinc-900 rounded-[2.5rem] overflow-hidden border border-primary/5 hover:shadow-2xl transition-all flex flex-col cursor-pointer" onClick={() => viewProjectDetail(project)}>
                  <div className="h-56 relative overflow-hidden">
                    <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" src={project.cover} alt={project.title} />
                    <span className="absolute top-6 left-6 bg-white/95 dark:bg-zinc-800/95 text-[10px] font-black text-primary px-4 py-1.5 rounded-full uppercase tracking-wider shadow-xl">{project.category}</span>
                  </div>
                  <div className="p-8 flex-1">
                    <h3 className="font-black text-xl mb-4 group-hover:text-primary transition-colors leading-tight">{project.title}</h3>
                    <p className="text-slate-500 text-sm line-clamp-2 mb-6">{project.description}</p>
                    <div className="flex items-center justify-between text-slate-400 text-xs font-bold pt-6 border-t border-slate-50 dark:border-zinc-800">
                      <span className="flex items-center gap-2 text-primary bg-primary/5 px-3 py-1 rounded-lg">
                        <span className="material-symbols-outlined text-sm">near_me</span> {project.location}
                      </span>
                      <span>{project.date} · {project.participants}/{project.maxParticipants}人</span>
                    </div>
                  </div>
                </div>
              ))}
              <div className="border-4 border-dashed border-primary/10 rounded-[2.5rem] flex flex-col items-center justify-center p-12 group cursor-pointer hover:bg-primary/5 hover:border-primary/30 transition-all" onClick={() => setShowCreateProjectModal(true)}>
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

      {/* Create Project Modal */}
      {showCreateProjectModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-[2.5rem] p-10 shadow-2xl border border-primary/20">
            <h3 className="text-2xl font-black mb-8">发布新活动</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">活动标题</label>
                <input 
                  autoFocus
                  className="w-full px-6 py-4 bg-slate-50 dark:bg-zinc-800 rounded-2xl border-none focus:ring-2 focus:ring-primary/50 text-sm font-bold"
                  placeholder="输入活动标题"
                  value={newProject.title}
                  onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">活动描述</label>
                <textarea 
                  className="w-full px-6 py-4 bg-slate-50 dark:bg-zinc-800 rounded-2xl border-none focus:ring-2 focus:ring-primary/50 text-sm font-bold"
                  placeholder="输入活动描述"
                  rows={3}
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">活动分类</label>
                <select 
                  className="w-full px-6 py-4 bg-slate-50 dark:bg-zinc-800 rounded-2xl border-none focus:ring-2 focus:ring-primary/50 text-sm font-bold"
                  value={newProject.category}
                  onChange={(e) => setNewProject({ ...newProject, category: e.target.value })}
                >
                  <option value="同城聚会">同城聚会</option>
                  <option value="学术会议">学术会议</option>
                  <option value="艺术展览">艺术展览</option>
                  <option value="技术 workshop">技术 workshop</option>
                  <option value="其他">其他</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">活动日期</label>
                <input 
                  type="text"
                  className="w-full px-6 py-4 bg-slate-50 dark:bg-zinc-800 rounded-2xl border-none focus:ring-2 focus:ring-primary/50 text-sm font-bold"
                  placeholder="如：11月25日"
                  value={newProject.date}
                  onChange={(e) => setNewProject({ ...newProject, date: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">活动地点</label>
                <input 
                  type="text"
                  className="w-full px-6 py-4 bg-slate-50 dark:bg-zinc-800 rounded-2xl border-none focus:ring-2 focus:ring-primary/50 text-sm font-bold"
                  placeholder="如：上海 · 徐汇"
                  value={newProject.location}
                  onChange={(e) => setNewProject({ ...newProject, location: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">最大参与人数</label>
                <input 
                  type="number"
                  min="1"
                  className="w-full px-6 py-4 bg-slate-50 dark:bg-zinc-800 rounded-2xl border-none focus:ring-2 focus:ring-primary/50 text-sm font-bold"
                  placeholder="输入最大参与人数"
                  value={newProject.maxParticipants}
                  onChange={(e) => setNewProject({ ...newProject, maxParticipants: parseInt(e.target.value) || 50 })}
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button onClick={() => setShowCreateProjectModal(false)} className="flex-1 py-4 text-slate-500 font-bold hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-2xl transition-all">取消</button>
                <button onClick={handleCreateProject} className="flex-1 py-4 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/20">发布活动</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Project Detail Modal */}
      {showProjectDetailModal && selectedProject && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="w-full max-w-4xl bg-white dark:bg-zinc-900 rounded-[2.5rem] shadow-2xl border border-primary/20 overflow-hidden">
            <div className="relative h-72">
              <img className="w-full h-full object-cover" src={selectedProject.cover} alt={selectedProject.title} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-10 w-full">
                <span className="inline-block px-4 py-1.5 bg-primary text-white text-[10px] font-black rounded-full uppercase tracking-wider mb-4">{selectedProject.category}</span>
                <h3 className="text-3xl font-black text-white mb-2">{selectedProject.title}</h3>
                <div className="flex items-center gap-6 text-white/80 text-sm font-bold">
                  <span className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">person</span> 组织者: {selectedProject.creator}
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">event</span> {selectedProject.date}
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">near_me</span> {selectedProject.location}
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">group</span> {selectedProject.participants}/{selectedProject.maxParticipants} 人
                  </span>
                </div>
              </div>
              <button onClick={() => setShowProjectDetailModal(false)} className="absolute top-6 right-6 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-10">
              <div className="mb-10">
                <h4 className="text-xl font-black mb-4">活动详情</h4>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{selectedProject.description}</p>
              </div>
              <div className="mb-10">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-xl font-black">参与人员</h4>
                  <button onClick={() => setShowInviteModal(true)} className="px-4 py-2 bg-primary/10 text-primary font-bold rounded-xl hover:bg-primary hover:text-white transition-all text-sm">
                    邀请用户
                  </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {participants.map((participant) => (
                    <div key={participant.id} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-zinc-800 rounded-xl">
                      <img className="w-10 h-10 rounded-full object-cover" src={participant.avatar} alt={participant.name} />
                      <div className="flex-1">
                        <h5 className="font-bold text-sm">{participant.name}</h5>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-bold px-2 py-1 rounded-full ${participant.status === 'accepted' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400'}`}>
                            {participant.status === 'accepted' ? '已确认' : '待确认'}
                          </span>
                          {selectedProject?.creator === 'You' && participant.name !== 'You' && (
                            <select 
                              className="text-xs font-bold bg-transparent border-none focus:ring-1 focus:ring-primary"
                              value={participant.status}
                              onChange={(e) => updateParticipantStatus(participant.id, e.target.value as 'accepted' | 'pending')}
                            >
                              <option value="pending">待确认</option>
                              <option value="accepted">已确认</option>
                            </select>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex gap-4">
                {selectedProject.creator === 'You' && (
                  <button onClick={() => deleteProject(selectedProject.id)} className="flex-1 py-4 text-red-500 font-bold hover:bg-red-50 dark:hover:bg-red-900/20 rounded-2xl transition-all">删除活动</button>
                )}
                <button onClick={() => setShowProjectDetailModal(false)} className={`flex-1 py-4 text-slate-500 font-bold hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-2xl transition-all ${selectedProject.creator === 'You' ? '' : 'flex-1'}`}>{selectedProject.creator === 'You' ? '取消' : '关闭'}</button>
                <button onClick={joinProject} className="flex-1 py-4 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 transition-all">
                  {participants.some(p => p.name === 'You') ? '已报名' : '报名参与'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Invite User Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-[2.5rem] p-10 shadow-2xl border border-primary/20">
            <h3 className="text-2xl font-black mb-8">邀请用户</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">用户邮箱</label>
                <input 
                  autoFocus
                  type="email"
                  className="w-full px-6 py-4 bg-slate-50 dark:bg-zinc-800 rounded-2xl border-none focus:ring-2 focus:ring-primary/50 text-sm font-bold"
                  placeholder="输入用户邮箱地址"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button onClick={() => setShowInviteModal(false)} className="flex-1 py-4 text-slate-500 font-bold hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-2xl transition-all">取消</button>
                <button onClick={handleInviteUser} className="flex-1 py-4 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/20">发送邀请</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Location Selection Modal */}
      {showLocationModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-[2.5rem] p-10 shadow-2xl border border-primary/20">
            <h3 className="text-2xl font-black mb-8">选择城市</h3>
            <div className="space-y-4">
              {locations.map((location, index) => (
                <button 
                  key={index}
                  onClick={() => {
                    setCurrentLocation(location);
                    setShowLocationModal(false);
                  }}
                  className={`w-full text-left px-6 py-4 rounded-2xl font-bold transition-all ${currentLocation === location ? 'bg-primary text-white' : 'bg-slate-50 dark:bg-zinc-800 hover:bg-slate-100 dark:hover:bg-zinc-700'}`}
                >
                  {location}
                </button>
              ))}
            </div>
            <div className="flex gap-4 pt-8">
              <button onClick={() => setShowLocationModal(false)} className="flex-1 py-4 text-slate-500 font-bold hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-2xl transition-all">取消</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocalPage;
