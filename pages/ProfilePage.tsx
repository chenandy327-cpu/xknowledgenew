
import React, { useState, useEffect } from 'react';
import { api } from '../src/services/api';

interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  type: 'image' | 'video' | 'text';
  cover: string;
  content: string;
  date: string;
}

interface Checkin {
  id: string;
  date: string;
  mood: 'great' | 'good' | 'normal' | 'tired' | 'sad';
  content: string;
  streak: number;
  images?: string[];
}

interface Activity {
  id: string;
  type: 'post' | 'checkin' | 'achievement';
  content: string;
  date: string;
  likes: number;
  comments: number;
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
  const [checkins, setCheckins] = useState<Checkin[]>([
    {
      id: '1',
      date: '2024-11-15',
      mood: 'great',
      content: '今天完成了一个重要的项目，感觉非常有成就感！',
      streak: 5
    },
    {
      id: '2',
      date: '2024-11-14',
      mood: 'good',
      content: '学习了新的 AI 模型，收获颇丰。',
      streak: 4
    }
  ]);
  const [activities, setActivities] = useState<Activity[]>([
    {
      id: '1',
      type: 'post',
      content: '发布了新作品：基于生成式 AI 的情感化交互研究',
      date: '2024-11-15 14:30',
      likes: 24,
      comments: 5
    },
    {
      id: '2',
      type: 'checkin',
      content: '连续打卡 5 天！',
      date: '2024-11-15 09:00',
      likes: 12,
      comments: 2
    }
  ]);
  
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [newItem, setNewItem] = useState<Partial<PortfolioItem>>({
    title: '',
    category: 'AI & UI',
    type: 'image',
    content: ''
  });
  const [customCategory, setCustomCategory] = useState('');
  const [useCustomCategory, setUseCustomCategory] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<{[key: string]: string}>({}); // 存储上传的文件URL
  const [uploadProgress, setUploadProgress] = useState<number>(0); // 上传进度
  const [checkinImages, setCheckinImages] = useState<string[]>([]); // 存储打卡上传的图片URL
  const [newCheckin, setNewCheckin] = useState({
    mood: 'good' as 'great' | 'good' | 'normal' | 'tired' | 'sad',
    content: ''
  });
  const [newPost, setNewPost] = useState('');
  const [profileData, setProfileData] = useState({
    name: '林梓安',
    bio: 'AI 交互研究员 & 业余诗人 | 致力于数字人文研究 | 上海交大交互设计硕士',
    avatar: 'https://picsum.photos/id/64/300/300'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isAddingSchedule, setIsAddingSchedule] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [newSchedule, setNewSchedule] = useState('');
  const [schedules, setSchedules] = useState<{[key: string]: string[]}>({}); // 存储每日行程

  const categories = ['All', 'AI & UI', 'Philosophy', 'Design', 'Art'];

  const filteredPortfolio = activeCategory === 'All' 
    ? portfolio 
    : portfolio.filter(item => item.category === activeCategory);

  // 获取今日日期
  const today = new Date().toISOString().split('T')[0];
  // 检查今日是否已打卡
  const hasCheckedInToday = checkins.some(checkin => checkin.date === today);
  // 计算当前连续打卡天数
  const currentStreak = checkins.length > 0 ? checkins[0].streak : 0;

  // 处理文件上传
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 检查文件大小
      if (file.size > 10 * 1024 * 1024) { // 10MB 限制
        alert('文件大小不能超过10MB');
        return;
      }
      
      // 检查文件类型
      const isImage = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');
      if (!isImage && !isVideo) {
        alert('只支持图片和视频文件');
        return;
      }
      
      // 模拟上传进度
      setUploadProgress(0);
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const fileUrl = event.target.result as string;
          setUploadedFiles({...uploadedFiles, cover: fileUrl});
          // 模拟上传进度
          let progress = 0;
          const interval = setInterval(() => {
            progress += 10;
            setUploadProgress(progress);
            if (progress >= 100) {
              clearInterval(interval);
            }
          }, 100);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // 处理打卡图片上传
  const handleCheckinImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages: string[] = [];
      
      // 限制最多上传3张图片
      const maxImages = 3;
      const filesToUpload = Array.from(files).slice(0, maxImages - checkinImages.length);
      
      filesToUpload.forEach((file) => {
        // 检查文件大小
        if (file.size > 5 * 1024 * 1024) { // 5MB 限制
          alert('每张图片大小不能超过5MB');
          return;
        }
        
        // 检查文件类型
        if (!file.type.startsWith('image/')) {
          alert('只支持图片文件');
          return;
        }
        
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            const fileUrl = event.target.result as string;
            newImages.push(fileUrl);
            
            // 当所有文件都读取完成后，更新状态
            if (newImages.length === filesToUpload.length) {
              setCheckinImages([...checkinImages, ...newImages]);
            }
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  // 删除打卡图片
  const removeCheckinImage = (index: number) => {
    const updatedImages = [...checkinImages];
    updatedImages.splice(index, 1);
    setCheckinImages(updatedImages);
  };

  // 处理双击日历日期
  const handleDateDoubleClick = (date: string) => {
    setSelectedDate(date);
    setNewSchedule('');
    setIsAddingSchedule(true);
  };

  // 处理添加行程
  const handleAddSchedule = () => {
    if (selectedDate && newSchedule) {
      setSchedules(prev => {
        const updated = {...prev};
        if (!updated[selectedDate]) {
          updated[selectedDate] = [];
        }
        updated[selectedDate].push(newSchedule);
        return updated;
      });
      setIsAddingSchedule(false);
      setSelectedDate('');
      setNewSchedule('');
      // 保存到本地存储
      localStorage.setItem('schedules', JSON.stringify({...schedules, [selectedDate]: [...(schedules[selectedDate] || []), newSchedule]}));
    }
  };

  // 处理删除行程
  const handleDeleteSchedule = (date: string, index: number) => {
    setSchedules(prev => {
      const updated = {...prev};
      if (updated[date]) {
        updated[date] = updated[date].filter((_, i) => i !== index);
        if (updated[date].length === 0) {
          delete updated[date];
        }
      }
      return updated;
    });
    // 保存到本地存储
    const updatedSchedules = {...schedules};
    if (updatedSchedules[date]) {
      updatedSchedules[date] = updatedSchedules[date].filter((_, i) => i !== index);
      if (updatedSchedules[date].length === 0) {
        delete updatedSchedules[date];
      }
    }
    localStorage.setItem('schedules', JSON.stringify(updatedSchedules));
  };

  // 处理添加作品集
  const handleAddItem = async () => {
    if (newItem.title && newItem.content) {
      const category = useCustomCategory ? customCategory : (newItem.category || 'AI & UI');
      const item: PortfolioItem = {
        id: Date.now().toString(),
        title: newItem.title!,
        category: category || 'AI & UI',
        type: newItem.type || 'image',
        cover: uploadedFiles.cover || `https://picsum.photos/id/${Math.floor(Math.random() * 300)}/600/400`,
        content: newItem.content!,
        date: new Date().toLocaleDateString()
      };
      
      try {
        // 同时添加到发现页面的内容中
        await api.createContent({
          title: item.title,
          description: item.content,
          category: item.category,
          cover: item.cover
        });
      } catch (error) {
        console.error('Failed to add content to discovery:', error);
      }
      
      setPortfolio([item, ...portfolio]);
      setIsAdding(false);
      setNewItem({ title: '', category: 'AI & UI', type: 'image', content: '' });
      setCustomCategory('');
      setUseCustomCategory(false);
      setUploadedFiles({});
      setUploadProgress(0);
      // 添加到动态
      addActivity('post', `发布了新作品：${item.title}`);
      // 保存到本地存储
      localStorage.setItem('portfolio', JSON.stringify([item, ...portfolio]));
    }
  };

  // 处理删除作品集
  const deleteItem = (id: string) => {
    setPortfolio(portfolio.filter(p => p.id !== id));
    // 保存到本地存储
    localStorage.setItem('portfolio', JSON.stringify(portfolio.filter(p => p.id !== id)));
  };

  // 处理每日打卡
  const handleCheckin = () => {
    if (newCheckin.content) {
      const streak = hasCheckedInToday ? currentStreak : currentStreak + 1;
      const checkin: Checkin = {
        id: Date.now().toString(),
        date: today,
        mood: newCheckin.mood,
        content: newCheckin.content,
        streak,
        images: checkinImages.length > 0 ? checkinImages : undefined
      };
      setCheckins([checkin, ...checkins.filter(c => c.date !== today)]);
      setIsCheckingIn(false);
      setNewCheckin({ mood: 'good', content: '' });
      setCheckinImages([]);
      // 添加到动态
      addActivity('checkin', `连续打卡 ${streak} 天！`);
      // 保存到本地存储
      localStorage.setItem('checkins', JSON.stringify([checkin, ...checkins.filter(c => c.date !== today)]));
    }
  };

  // 处理发布动态
  const handlePost = () => {
    if (newPost) {
      const post = newPost;
      setIsPosting(false);
      setNewPost('');
      // 添加到动态
      addActivity('post', post);
    }
  };

  // 添加动态
  const addActivity = (type: 'post' | 'checkin' | 'achievement', content: string) => {
    const activity: Activity = {
      id: Date.now().toString(),
      type,
      content,
      date: new Date().toLocaleString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      likes: 0,
      comments: 0
    };
    setActivities([activity, ...activities]);
    // 保存到本地存储
    localStorage.setItem('activities', JSON.stringify([activity, ...activities]));
  };

  // 处理更新个人资料
  const handleUpdateProfile = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await api.updateCurrentUser({
        name: profileData.name,
        avatar: profileData.avatar
      });
      setSuccess('个人资料更新成功！');
      // Close modal after 2 seconds
      setTimeout(() => {
        setIsEditing(false);
      }, 2000);
      // 保存到本地存储
      localStorage.setItem('profileData', JSON.stringify(profileData));
    } catch (err) {
      setError('更新失败，请重试');
      console.error('Update profile error:', err);
    } finally {
      setLoading(false);
    }
  };

  // 从本地存储加载数据
  useEffect(() => {
    const savedPortfolio = localStorage.getItem('portfolio');
    const savedCheckins = localStorage.getItem('checkins');
    const savedActivities = localStorage.getItem('activities');
    const savedProfileData = localStorage.getItem('profileData');
    const savedSchedules = localStorage.getItem('schedules');
    
    if (savedPortfolio) {
      setPortfolio(JSON.parse(savedPortfolio));
    }
    if (savedCheckins) {
      setCheckins(JSON.parse(savedCheckins));
    }
    if (savedActivities) {
      setActivities(JSON.parse(savedActivities));
    }
    if (savedProfileData) {
      setProfileData(JSON.parse(savedProfileData));
    }
    if (savedSchedules) {
      setSchedules(JSON.parse(savedSchedules));
    }
  }, []);

  // 渲染打卡心情图标
  const renderMoodIcon = (mood: string) => {
    switch (mood) {
      case 'great':
        return 'emoji_events';
      case 'good':
        return 'sentiment_satisfied';
      case 'normal':
        return 'sentiment_neutral';
      case 'tired':
        return 'sentiment_dissatisfied';
      case 'sad':
        return 'sentiment_very_dissatisfied';
      default:
        return 'sentiment_satisfied';
    }
  };

  // 渲染打卡心情颜色
  const getMoodColor = (mood: string) => {
    switch (mood) {
      case 'great':
        return 'text-emerald-500';
      case 'good':
        return 'text-blue-500';
      case 'normal':
        return 'text-yellow-500';
      case 'tired':
        return 'text-orange-500';
      case 'sad':
        return 'text-red-500';
      default:
        return 'text-blue-500';
    }
  };

  // 生成最近30天的日期数组
  const generateDates = () => {
    const dates = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  };

  const recentDates = generateDates();

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
              <img className="w-44 h-44 rounded-[2.5rem] border-8 border-white dark:border-zinc-800 shadow-2xl object-cover -mt-32 hover:scale-105 transition-transform" src={profileData.avatar} alt="Avatar" />
              <div className="text-center lg:text-left">
                <h1 className="text-4xl font-black mb-2 tracking-tighter">{profileData.name} <span className="text-primary text-base font-bold italic ml-2">@zian_lin</span></h1>
                <p className="text-slate-500 font-bold text-sm max-w-lg mb-6 leading-relaxed">{profileData.bio}</p>
                <div className="flex gap-10 justify-center lg:justify-start">
                  <div className="text-center"><span className="block text-2xl font-black text-primary">1.4k</span><span className="text-[10px] text-slate-400 uppercase font-black tracking-[0.2em]">Following</span></div>
                  <div className="text-center"><span className="block text-2xl font-black text-primary">8.2k</span><span className="text-[10px] text-slate-400 uppercase font-black tracking-[0.2em]">Followers</span></div>
                  <div className="text-center"><span className="block text-2xl font-black text-primary">{portfolio.length}</span><span className="text-[10px] text-slate-400 uppercase font-black tracking-[0.2em]">Projects</span></div>
                  <div className="text-center"><span className="block text-2xl font-black text-primary">{currentStreak}</span><span className="text-[10px] text-slate-400 uppercase font-black tracking-[0.2em]">Streak</span></div>
                </div>
              </div>
            </div>
            <div className="flex gap-4">
              <button onClick={() => setIsEditing(true)} className="px-10 py-4 bg-primary text-white font-black rounded-2xl shadow-2xl shadow-primary/30 hover:scale-105 transition-all">编辑档案</button>
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
                  {item.type === 'video' ? (
                    <video 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                      src={item.cover}
                      alt={item.title}
                      controls
                      muted
                      preload="metadata"
                    />
                  ) : (
                    <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" src={item.cover} alt={item.title} />
                  )}
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

      {/* Checkin View */}
      {activeTab === 'logs' && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
            <h2 className="text-2xl font-black">每日打卡</h2>
            {!hasCheckedInToday && (
              <button 
                onClick={() => setIsCheckingIn(true)}
                className="flex items-center gap-3 px-8 py-3 bg-primary text-white font-black rounded-xl hover:shadow-lg hover:shadow-primary/20 transition-all"
              >
                <span className="material-symbols-outlined">add_circle</span>
                今日打卡
              </button>
            )}
          </div>

          {/* Checkin Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white dark:bg-zinc-900 p-8 rounded-[2rem] border border-primary/5 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-3xl text-primary">local_fire_department</span>
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-1">当前连续</h3>
                  <p className="text-3xl font-black text-primary">{currentStreak} 天</p>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-zinc-900 p-8 rounded-[2rem] border border-primary/5 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-3xl text-primary">calendar_month</span>
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-1">总打卡次数</h3>
                  <p className="text-3xl font-black text-primary">{checkins.length} 次</p>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-zinc-900 p-8 rounded-[2rem] border border-primary/5 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-3xl text-primary">mood</span>
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-1">最近心情</h3>
                  <p className={`text-3xl font-black ${getMoodColor(checkins[0]?.mood || 'good')}`}>
                    <span className="material-symbols-outlined">{renderMoodIcon(checkins[0]?.mood || 'good')}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Checkin Calendar */}
          <div className="bg-white dark:bg-zinc-900 p-8 rounded-[2rem] border border-primary/5 shadow-sm mb-12">
            <h3 className="text-lg font-black mb-6">最近 30 天打卡记录</h3>
            <div className="grid grid-cols-7 gap-2">
              {['日', '一', '二', '三', '四', '五', '六'].map(day => (
                <div key={day} className="text-center text-xs font-black text-slate-400 uppercase tracking-widest py-2">{day}</div>
              ))}
              {recentDates.map((date, index) => {
                const checkin = checkins.find(c => c.date === date);
                const hasSchedule = schedules[date] && schedules[date].length > 0;
                return (
                  <div key={date} className="text-center">
                    <div 
                      className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto cursor-pointer transition-all ${checkin ? 'bg-primary text-white font-bold' : hasSchedule ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-bold' : 'bg-slate-100 dark:bg-zinc-800 text-slate-400'}`}
                      onDoubleClick={() => handleDateDoubleClick(date)}
                      title="双击添加行程"
                    >
                      {new Date(date).getDate()}
                      {hasSchedule && (
                        <div className="absolute w-2 h-2 bg-blue-500 rounded-full -bottom-1"></div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Checkins */}
          <div className="space-y-6">
            <h3 className="text-xl font-black mb-6">最近打卡</h3>
            {checkins.map((checkin) => (
              <div key={checkin.id} className="bg-white dark:bg-zinc-900 p-8 rounded-[2rem] border border-primary/5 shadow-sm">
                <div className="flex items-start justify-between gap-6">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center ${getMoodColor(checkin.mood)}`}>
                      <span className="material-symbols-outlined text-2xl">{renderMoodIcon(checkin.mood)}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <h4 className="font-bold">{checkin.date}</h4>
                        <span className="text-xs font-bold text-slate-400">连续 {checkin.streak} 天</span>
                      </div>
                      <p className="text-slate-500 mb-4">{checkin.content}</p>
                      {checkin.images && checkin.images.length > 0 && (
                        <div className="flex gap-3 mt-4">
                          {checkin.images.map((image, index) => (
                            <div key={index} className="w-20 h-20">
                              <img 
                                src={image} 
                                alt={`Checkin image ${index + 1}`} 
                                className="w-full h-full object-cover rounded-lg"
                              />
                            </div>
                          ))}
                        </div>
                      )}
                      {/* 显示当天行程 */}
                      {schedules[checkin.date] && schedules[checkin.date].length > 0 && (
                        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-zinc-800">
                          <h5 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">当日行程</h5>
                          <div className="space-y-2">
                            {schedules[checkin.date].map((schedule, index) => (
                              <div key={index} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                <span className="material-symbols-outlined text-xs text-blue-500">event_note</span>
                                <span>{schedule}</span>
                                <button 
                                  onClick={() => handleDeleteSchedule(checkin.date, index)}
                                  className="ml-auto text-red-500 hover:text-red-700 transition-colors"
                                  title="删除行程"
                                >
                                  <span className="material-symbols-outlined text-xs">delete</span>
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Activity View */}
      {activeTab === 'activity' && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
            <h2 className="text-2xl font-black">个人动态</h2>
            <button 
              onClick={() => setIsPosting(true)}
              className="flex items-center gap-3 px-8 py-3 bg-primary text-white font-black rounded-xl hover:shadow-lg hover:shadow-primary/20 transition-all"
            >
              <span className="material-symbols-outlined">add_circle</span>
              发布动态
            </button>
          </div>

          {/* Activity Feed */}
          <div className="space-y-8">
            {activities.map((activity) => (
              <div key={activity.id} className="bg-white dark:bg-zinc-900 p-8 rounded-[2rem] border border-primary/5 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full border-2 border-primary/10 flex-shrink-0">
                    <img className="w-full h-full rounded-full object-cover" src={profileData.avatar} alt="Avatar" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-bold">{profileData.name}</h4>
                      <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{activity.type === 'post' ? '发布' : activity.type === 'checkin' ? '打卡' : '成就'}</span>
                      <span className="text-xs text-slate-400 ml-auto">{activity.date}</span>
                    </div>
                    <p className="text-slate-500 mb-4">{activity.content}</p>
                    <div className="flex items-center gap-6">
                      <button className="flex items-center gap-2 text-xs font-black text-slate-400 hover:text-primary transition-colors">
                        <span className="material-symbols-outlined text-sm">favorite</span>
                        {activity.likes} 赞
                      </button>
                      <button className="flex items-center gap-2 text-xs font-black text-slate-400 hover:text-primary transition-colors">
                        <span className="material-symbols-outlined text-sm">comment</span>
                        {activity.comments} 评论
                      </button>
                      <button className="flex items-center gap-2 text-xs font-black text-slate-400 hover:text-primary transition-colors">
                        <span className="material-symbols-outlined text-sm">share</span>
                        分享
                      </button>
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

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">封面上传</label>
                {uploadedFiles.cover ? (
                  <div className="relative">
                    <img 
                      src={uploadedFiles.cover} 
                      alt="Cover Preview" 
                      className="w-full h-48 object-cover rounded-2xl"
                    />
                    {uploadProgress < 100 && (
                      <div className="absolute inset-0 bg-black/30 rounded-2xl flex items-center justify-center">
                        <div className="text-white font-bold">上传中... {uploadProgress}%</div>
                      </div>
                    )}
                    <button 
                      onClick={() => setUploadedFiles({})}
                      className="absolute top-4 right-4 w-10 h-10 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-all"
                    >
                      <span className="material-symbols-outlined">close</span>
                    </button>
                  </div>
                ) : (
                  <label className="block border-2 border-dashed border-primary/30 rounded-2xl p-8 text-center cursor-pointer hover:border-primary transition-all">
                    <input 
                      type="file" 
                      accept="image/*,video/*" 
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                    <span className="material-symbols-outlined text-4xl text-primary/50 mb-3">upload_file</span>
                    <p className="text-sm font-bold text-slate-500">点击或拖拽上传封面</p>
                    <p className="text-xs text-slate-400 mt-2">支持 JPG、PNG、MP4 格式，最大 10MB</p>
                  </label>
                )}
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">领域</label>
                  <select 
                    className="w-full px-6 py-4 bg-slate-50 dark:bg-zinc-800 rounded-2xl border-none focus:ring-2 focus:ring-primary/50 text-sm font-bold appearance-none"
                    value={useCustomCategory ? 'Custom' : newItem.category}
                    onChange={(e) => {
                      if (e.target.value === 'Custom') {
                        setUseCustomCategory(true);
                      } else {
                        setUseCustomCategory(false);
                        setNewItem({...newItem, category: e.target.value});
                      }
                    }}
                  >
                    {categories.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                    <option value="Custom">自定义</option>
                  </select>
                  {useCustomCategory && (
                    <input 
                      className="w-full px-6 py-4 mt-3 bg-slate-50 dark:bg-zinc-800 rounded-2xl border-none focus:ring-2 focus:ring-primary/50 text-sm font-bold"
                      placeholder="输入自定义领域..."
                      value={customCategory}
                      onChange={(e) => setCustomCategory(e.target.value)}
                    />
                  )}
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

      {/* Checkin Modal */}
      {isCheckingIn && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-6 bg-black/60 backdrop-blur-xl animate-in zoom-in-95 duration-300">
          <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-[3rem] p-12 shadow-2xl border border-primary/20 max-h-[90vh] overflow-y-auto no-scrollbar">
            <h2 className="text-3xl font-black mb-10 tracking-tighter">今日打卡</h2>
            
            <div className="space-y-8">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">今天感觉如何？</label>
                <div className="grid grid-cols-5 gap-3">
                  {['great', 'good', 'normal', 'tired', 'sad'].map(mood => (
                    <button 
                      key={mood}
                      onClick={() => setNewCheckin({...newCheckin, mood: mood as any})}
                      className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-all ${
                        newCheckin.mood === mood 
                          ? 'bg-primary text-white shadow-lg' 
                          : 'bg-slate-50 dark:bg-zinc-800 text-slate-400 hover:bg-slate-100 dark:hover:bg-zinc-700'
                      }`}
                    >
                      <span className="material-symbols-outlined text-2xl">{renderMoodIcon(mood)}</span>
                      <span className="text-xs font-black uppercase tracking-widest">
                        {mood === 'great' ? '很棒' : 
                         mood === 'good' ? '不错' : 
                         mood === 'normal' ? '一般' : 
                         mood === 'tired' ? '疲惫' : '难过'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">今日感想</label>
                <textarea 
                  className="w-full px-6 py-6 bg-slate-50 dark:bg-zinc-800 rounded-2xl border-none focus:ring-2 focus:ring-primary/50 text-sm font-medium leading-relaxed"
                  placeholder="分享一下今天的收获或感受..."
                  rows={4}
                  value={newCheckin.content}
                  onChange={(e) => setNewCheckin({...newCheckin, content: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">添加图片 (最多3张)</label>
                {checkinImages.length > 0 && (
                  <div className="flex gap-4 mb-4">
                    {checkinImages.map((image, index) => (
                      <div key={index} className="relative w-24 h-24">
                        <img 
                          src={image} 
                          alt={`Checkin image ${index + 1}`} 
                          className="w-full h-full object-cover rounded-xl"
                        />
                        <button 
                          onClick={() => removeCheckinImage(index)}
                          className="absolute top-2 right-2 w-6 h-6 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-red-500 transition-all"
                        >
                          <span className="material-symbols-outlined text-xs">close</span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                {checkinImages.length < 3 && (
                  <label className="block border-2 border-dashed border-primary/30 rounded-2xl p-6 text-center cursor-pointer hover:border-primary transition-all">
                    <input 
                      type="file" 
                      accept="image/*" 
                      multiple
                      className="hidden"
                      onChange={handleCheckinImageUpload}
                    />
                    <span className="material-symbols-outlined text-3xl text-primary/50 mb-2">upload_file</span>
                    <p className="text-sm font-bold text-slate-500">点击或拖拽上传图片</p>
                    <p className="text-xs text-slate-400 mt-1">支持 JPG、PNG 格式，每张最大 5MB</p>
                  </label>
                )}
              </div>

              <div className="flex gap-6 pt-6">
                <button onClick={() => setIsCheckingIn(false)} className="flex-1 py-5 text-slate-400 font-black uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-zinc-800 rounded-2xl transition-all">取消</button>
                <button onClick={handleCheckin} className="flex-1 py-5 bg-primary text-white font-black uppercase tracking-widest rounded-2xl shadow-2xl shadow-primary/30 hover:scale-105 transition-all">确认打卡</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Post Modal */}
      {isPosting && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-6 bg-black/60 backdrop-blur-xl animate-in zoom-in-95 duration-300">
          <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-[3rem] p-12 shadow-2xl border border-primary/20 max-h-[90vh] overflow-y-auto no-scrollbar">
            <h2 className="text-3xl font-black mb-10 tracking-tighter">发布动态</h2>
            
            <div className="space-y-8">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">动态内容</label>
                <textarea 
                  className="w-full px-6 py-6 bg-slate-50 dark:bg-zinc-800 rounded-2xl border-none focus:ring-2 focus:ring-primary/50 text-sm font-medium leading-relaxed"
                  placeholder="分享你的想法..."
                  rows={6}
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                />
              </div>

              <div className="flex gap-6 pt-6">
                <button onClick={() => setIsPosting(false)} className="flex-1 py-5 text-slate-400 font-black uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-zinc-800 rounded-2xl transition-all">取消</button>
                <button onClick={handlePost} className="flex-1 py-5 bg-primary text-white font-black uppercase tracking-widest rounded-2xl shadow-2xl shadow-primary/30 hover:scale-105 transition-all">发布</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Schedule Modal */}
      {isAddingSchedule && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-6 bg-black/60 backdrop-blur-xl animate-in zoom-in-95 duration-300">
          <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-[3rem] p-12 shadow-2xl border border-primary/20 max-h-[90vh] overflow-y-auto no-scrollbar">
            <h2 className="text-3xl font-black mb-10 tracking-tighter">添加行程</h2>
            
            <div className="space-y-8">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">日期</label>
                <input 
                  className="w-full px-6 py-4 bg-slate-50 dark:bg-zinc-800 rounded-2xl border-none focus:ring-2 focus:ring-primary/50 text-sm font-bold"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  disabled
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">行程内容</label>
                <input 
                  autoFocus
                  className="w-full px-6 py-4 bg-slate-50 dark:bg-zinc-800 rounded-2xl border-none focus:ring-2 focus:ring-primary/50 text-sm font-bold"
                  placeholder="输入行程内容..."
                  value={newSchedule}
                  onChange={(e) => setNewSchedule(e.target.value)}
                />
              </div>

              <div className="flex gap-6 pt-6">
                <button onClick={() => setIsAddingSchedule(false)} className="flex-1 py-5 text-slate-400 font-black uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-zinc-800 rounded-2xl transition-all">取消</button>
                <button onClick={handleAddSchedule} className="flex-1 py-5 bg-primary text-white font-black uppercase tracking-widest rounded-2xl shadow-2xl shadow-primary/30 hover:scale-105 transition-all">确认添加</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-6 bg-black/60 backdrop-blur-xl animate-in zoom-in-95 duration-300">
          <div className="w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-[3rem] p-12 shadow-2xl border border-primary/20 max-h-[90vh] overflow-y-auto no-scrollbar">
            <h2 className="text-3xl font-black mb-10 tracking-tighter">编辑个人资料</h2>
            
            <div className="space-y-8">
              <div className="flex flex-col items-center gap-6">
                <div className="relative">
                  <img 
                    className="w-32 h-32 rounded-[2rem] border-4 border-primary shadow-2xl object-cover"
                    src={profileData.avatar}
                    alt="Avatar"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">姓名</label>
                <input 
                  autoFocus
                  className="w-full px-6 py-4 bg-slate-50 dark:bg-zinc-800 rounded-2xl border-none focus:ring-2 focus:ring-primary/50 text-sm font-bold"
                  placeholder="你的姓名..."
                  value={profileData.name}
                  onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">个人简介</label>
                <textarea 
                  className="w-full px-6 py-6 bg-slate-50 dark:bg-zinc-800 rounded-2xl border-none focus:ring-2 focus:ring-primary/50 text-sm font-medium leading-relaxed"
                  placeholder="介绍一下自己..."
                  rows={4}
                  value={profileData.bio}
                  onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">头像 URL</label>
                <input 
                  className="w-full px-6 py-4 bg-slate-50 dark:bg-zinc-800 rounded-2xl border-none focus:ring-2 focus:ring-primary/50 text-sm font-bold"
                  placeholder="你的头像 URL..."
                  value={profileData.avatar}
                  onChange={(e) => setProfileData({...profileData, avatar: e.target.value})}
                />
              </div>

              {error && (
                <div className="text-red-500 text-sm">{error}</div>
              )}

              {success && (
                <div className="text-green-500 text-sm">{success}</div>
              )}

              <div className="flex gap-6 pt-6">
                <button onClick={() => setIsEditing(false)} className="flex-1 py-5 text-slate-400 font-black uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-zinc-800 rounded-2xl transition-all">取消</button>
                <button 
                  onClick={handleUpdateProfile}
                  disabled={loading}
                  className="flex-1 py-5 bg-primary text-white font-black uppercase tracking-widest rounded-2xl shadow-2xl shadow-primary/30 hover:scale-105 transition-all"
                >
                  {loading ? '更新中...' : '更新资料'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
