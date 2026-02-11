
import React, { useState, useEffect } from 'react';
import { api } from '../src/services/api';

interface Course {
  id: string;
  title: string;
  instructor: string;
  progress: number;
  completed: boolean;
  cover: string;
  type: 'live' | 'recorded';
  description: string;
  startTime?: string;
  duration?: string;
  enrolled?: boolean;
  creatorId?: string;
}

interface Comment {
  id: string;
  courseId: string;
  user: string;
  content: string;
  time: string;
}

const CoursePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('mine');
  const [heatmapData, setHeatmapData] = useState<number[]>(
    Array.from({ length: 120 }).map(() => Math.floor(Math.random() * 5))
  );
  const [courses, setCourses] = useState<Course[]>([
    { 
      id: '1',
      title: '量化分析进阶：模型与风控', 
      instructor: 'Dr. Alan Chen', 
      progress: 45, 
      completed: false, 
      cover: 'https://picsum.photos/id/180/400/300',
      type: 'recorded',
      description: '深入学习量化分析的高级模型和风险控制策略',
      duration: '12小时'
    },
    { 
      id: '2',
      title: 'UI/UX 深度思维体系', 
      instructor: 'Sarah Wang', 
      progress: 100, 
      completed: true, 
      cover: 'https://picsum.photos/id/181/400/300',
      type: 'recorded',
      description: '构建系统化的UI/UX设计思维体系',
      duration: '8小时'
    },
    { 
      id: '3',
      title: '现代物理学基础：量子力学', 
      instructor: 'Prof. Zhao', 
      progress: 12, 
      completed: false, 
      cover: 'https://picsum.photos/id/182/400/300',
      type: 'live',
      description: '从基础概念到前沿应用的量子力学课程',
      startTime: '2024-12-01 19:00',
      duration: '10小时'
    },
  ]);
  const [isCreating, setIsCreating] = useState(false);
  const [newCourse, setNewCourse] = useState({
    title: '',
    instructor: 'You',
    type: 'recorded' as 'live' | 'recorded',
    description: '',
    startTime: '',
    duration: ''
  });
  const [courseCover, setCourseCover] = useState<string>('');
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');

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

  // 处理封面上传
  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 检查文件大小
      if (file.size > 5 * 1024 * 1024) {
        alert('文件大小不能超过5MB');
        return;
      }
      
      // 检查文件类型
      if (!file.type.startsWith('image/')) {
        alert('请上传图片文件');
        return;
      }
      
      // 模拟上传进度
      setUploadProgress(0);
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setCourseCover(event.target.result as string);
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

  // 创建课程
  const handleCreateCourse = () => {
    if (newCourse.title && newCourse.description) {
      const course: Course = {
        id: Date.now().toString(),
        title: newCourse.title,
        instructor: newCourse.instructor,
        progress: 0,
        completed: false,
        cover: courseCover || `https://picsum.photos/id/${Math.floor(Math.random() * 300)}/400/300`,
        type: newCourse.type,
        description: newCourse.description,
        startTime: newCourse.startTime,
        duration: newCourse.duration,
        creatorId: 'current-user-id' // 实际应用中应从认证系统获取
      };
      setCourses([course, ...courses]);
      setIsCreating(false);
      setNewCourse({
        title: '',
        instructor: 'You',
        type: 'recorded',
        description: '',
        startTime: '',
        duration: ''
      });
      setCourseCover('');
      setUploadProgress(0);
      // 保存到本地存储
      localStorage.setItem('courses', JSON.stringify([course, ...courses]));
    }
  };

  // 删除课程
  const deleteCourse = async (courseId: string) => {
    if (window.confirm('确定要删除这门课程吗？删除后将无法恢复。')) {
      try {
        // 调用API删除课程
        await api.deleteCourse(courseId);
        
        // 更新本地状态
        const updatedCourses = courses.filter(course => course.id !== courseId);
        setCourses(updatedCourses);
        
        // 保存到本地存储
        localStorage.setItem('courses', JSON.stringify(updatedCourses));
        
        // 显示删除成功提示
        alert('课程删除成功！');
      } catch (error) {
        console.error('删除课程失败:', error);
        // 显示删除失败提示
        alert('删除课程失败，请稍后重试。');
      }
    }
  };

  // 加入课程
  const joinCourse = (course: Course) => {
    if (window.confirm('确定要加入这门课程吗？')) {
      const updatedCourse = { ...course, enrolled: true };
      setCourses(courses.map(c => c.id === course.id ? updatedCourse : c));
      // 保存到本地存储
      localStorage.setItem('courses', JSON.stringify(courses.map(c => c.id === course.id ? updatedCourse : c)));
      alert('成功加入课程！');
    }
  };

  // 查看课程详情
  const viewCourseDetails = (course: Course) => {
    setSelectedCourse(course);
    // 加载课程评论
    setComments([
      {
        id: '1',
        courseId: course.id,
        user: 'Student 1',
        content: '这门课程非常棒！',
        time: '2小时前'
      },
      {
        id: '2',
        courseId: course.id,
        user: 'Student 2',
        content: '老师讲解得很详细，容易理解。',
        time: '5小时前'
      }
    ]);
  };

  // 提交评论
  const submitComment = () => {
    if (newComment && selectedCourse) {
      const comment: Comment = {
        id: Date.now().toString(),
        courseId: selectedCourse.id,
        user: 'You',
        content: newComment,
        time: '刚刚'
      };
      setComments([comment, ...comments]);
      setNewComment('');
    }
  };

  // 从本地存储加载数据
  useEffect(() => {
    const savedCourses = localStorage.getItem('courses');
    if (savedCourses) {
      setCourses(JSON.parse(savedCourses));
    }
  }, []);

  return (
    <div className="p-8 max-w-[1400px] mx-auto min-h-screen">
      <header className="mb-16">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-10 mb-12">
          <div>
            <h1 className="text-5xl font-black text-slate-900 dark:text-white mb-4 tracking-tighter">COURSE_CENTER</h1>
            <p className="text-slate-500 font-medium">构建你的系统化知识大厦</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsCreating(true)}
              className="px-6 py-3 bg-primary text-white rounded-2xl text-sm font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all"
            >
              创建课程
            </button>
            <nav className="flex items-center gap-2 bg-white dark:bg-zinc-900 p-2 rounded-2xl border border-primary/5 shadow-sm">
              {['explore', 'mine', 'certificates'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 rounded-xl text-sm font-black transition-all ${
                    activeTab === tab ? 'bg-primary text-white shadow-xl' : 'text-slate-500 hover:text-primary'
                  }`}
                >
                  {tab === 'explore' ? '发现课程' : tab === 'mine' ? '学习档案' : '学术证书'}
                </button>
              ))}
            </nav>
          </div>
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
        {(activeTab === 'explore' ? courses : courses.filter(c => activeTab === 'mine' ? true : c.completed)).map((course) => (
          <div key={course.id} className="group bg-white dark:bg-zinc-900 rounded-[3rem] overflow-hidden border border-primary/5 hover:shadow-[0_40px_80px_rgba(127,19,236,0.15)] transition-all flex flex-col">
            <div className="h-56 relative overflow-hidden">
              <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" src={course.cover} alt="Course" />
              {course.completed && (
                <div className="absolute top-6 right-6 w-12 h-12 bg-emerald-500 text-white rounded-2xl flex items-center justify-center shadow-2xl animate-bounce-slow">
                  <span className="material-symbols-outlined fill-1">verified</span>
                </div>
              )}
              <div className="absolute top-6 left-6 bg-white/90 dark:bg-zinc-800/90 text-primary text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider shadow-xl">
                {course.type === 'live' ? '直播课程' : '录播课程'}
              </div>
            </div>
            <div className="p-10 flex-1 flex flex-col">
              <h3 className="font-black text-xl mb-3 group-hover:text-primary transition-colors line-clamp-2 leading-tight uppercase tracking-tight">{course.title}</h3>
              <p className="text-slate-500 text-sm mb-6 line-clamp-2">{course.description}</p>
              <div className="flex items-center gap-3 mb-6">
                <img className="w-8 h-8 rounded-full border border-primary/10" src={`https://picsum.photos/id/${80 + parseInt(course.id)}/50/50`} alt="Instructor" />
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{course.instructor}</span>
              </div>
              {course.type === 'live' && course.startTime && (
                <div className="flex items-center gap-2 text-xs text-primary mb-6">
                  <span className="material-symbols-outlined text-sm">event</span>
                  {course.startTime}
                </div>
              )}
              {course.duration && (
                <div className="flex items-center gap-2 text-xs text-slate-400 mb-6">
                  <span className="material-symbols-outlined text-sm">access_time</span>
                  {course.duration}
                </div>
              )}

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

              <div className="flex gap-4">
                <button 
                  onClick={() => viewCourseDetails(course)}
                  className="flex-1 py-4 bg-primary/10 text-primary rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all hover:bg-primary hover:text-white"
                >
                  查看详情
                </button>
                {!course.enrolled && activeTab === 'explore' && (
                  <button 
                    onClick={() => joinCourse(course)}
                    className="flex-1 py-4 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all hover:shadow-lg hover:shadow-primary/20"
                  >
                    加入课程
                  </button>
                )}
                {course.creatorId === 'current-user-id' && (
                  <button 
                    onClick={() => deleteCourse(course.id)}
                    className="w-12 h-12 bg-red-100 text-red-500 rounded-2xl flex items-center justify-center hover:bg-red-200 transition-all"
                    title="删除课程"
                  >
                    <span className="material-symbols-outlined">delete</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Course Modal */}
      {isCreating && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-6 bg-black/60 backdrop-blur-xl animate-in zoom-in-95 duration-300">
          <div className="w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-[3rem] p-12 shadow-2xl border border-primary/20 max-h-[90vh] overflow-y-auto no-scrollbar">
            <h2 className="text-3xl font-black mb-10 tracking-tighter">创建新课程</h2>
            
            <div className="space-y-8">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">课程封面</label>
                <div className="space-y-4">
                  {courseCover ? (
                    <div className="relative">
                      <img 
                        src={courseCover} 
                        alt="Course Cover" 
                        className="w-full h-48 object-cover rounded-2xl"
                      />
                      {uploadProgress < 100 && (
                        <div className="absolute inset-0 bg-black/30 rounded-2xl flex items-center justify-center">
                          <div className="text-white font-bold">上传中... {uploadProgress}%</div>
                        </div>
                      )}
                      <button 
                        onClick={() => setCourseCover('')}
                        className="absolute top-4 right-4 w-10 h-10 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-all"
                      >
                        <span className="material-symbols-outlined">close</span>
                      </button>
                    </div>
                  ) : (
                    <label className="block border-2 border-dashed border-primary/30 rounded-2xl p-8 text-center cursor-pointer hover:border-primary transition-all">
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden"
                        onChange={handleCoverUpload}
                      />
                      <span className="material-symbols-outlined text-4xl text-primary/50 mb-3">add_photo_alternate</span>
                      <p className="text-sm font-bold text-slate-500">点击或拖拽上传课程封面</p>
                      <p className="text-xs text-slate-400 mt-2">支持 JPG、PNG 格式，最大 5MB</p>
                    </label>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">课程标题</label>
                <input 
                  autoFocus
                  className="w-full px-6 py-4 bg-slate-50 dark:bg-zinc-800 rounded-2xl border-none focus:ring-2 focus:ring-primary/50 text-sm font-bold"
                  placeholder="输入课程标题..."
                  value={newCourse.title}
                  onChange={(e) => setNewCourse({...newCourse, title: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">课程类型</label>
                <div className="flex gap-2 p-1 bg-slate-50 dark:bg-zinc-800 rounded-2xl border border-primary/5">
                  {['recorded', 'live'].map(type => (
                    <button 
                      key={type}
                      onClick={() => setNewCourse({...newCourse, type: type as 'live' | 'recorded'})}
                      className={`flex-1 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${newCourse.type === type ? 'bg-primary text-white shadow-lg' : 'text-slate-400'}`}
                    >
                      {type === 'recorded' ? '录播课程' : '直播课程'}
                    </button>
                  ))}
                </div>
              </div>

              {newCourse.type === 'live' && (
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">直播时间</label>
                  <input 
                    type="datetime-local"
                    className="w-full px-6 py-4 bg-slate-50 dark:bg-zinc-800 rounded-2xl border-none focus:ring-2 focus:ring-primary/50 text-sm font-bold"
                    value={newCourse.startTime}
                    onChange={(e) => setNewCourse({...newCourse, startTime: e.target.value})}
                  />
                </div>
              )}

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">课程时长</label>
                <input 
                  type="text"
                  placeholder="例如：10小时"
                  className="w-full px-6 py-4 bg-slate-50 dark:bg-zinc-800 rounded-2xl border-none focus:ring-2 focus:ring-primary/50 text-sm font-bold"
                  value={newCourse.duration}
                  onChange={(e) => setNewCourse({...newCourse, duration: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">课程描述</label>
                <textarea 
                  className="w-full px-6 py-6 bg-slate-50 dark:bg-zinc-800 rounded-2xl border-none focus:ring-2 focus:ring-primary/50 text-sm font-medium leading-relaxed"
                  placeholder="描述你的课程..."
                  rows={4}
                  value={newCourse.description}
                  onChange={(e) => setNewCourse({...newCourse, description: e.target.value})}
                />
              </div>

              <div className="flex gap-6 pt-6">
                <button onClick={() => setIsCreating(false)} className="flex-1 py-5 text-slate-400 font-black uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-zinc-800 rounded-2xl transition-all">取消</button>
                <button onClick={handleCreateCourse} className="flex-1 py-5 bg-primary text-white font-black uppercase tracking-widest rounded-2xl shadow-2xl shadow-primary/30 hover:scale-105 transition-all">创建课程</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Course Detail Modal */}
      {selectedCourse && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-6 bg-black/60 backdrop-blur-xl animate-in zoom-in-95 duration-300">
          <div className="w-full max-w-4xl bg-white dark:bg-zinc-900 rounded-[3rem] p-12 shadow-2xl border border-primary/20 max-h-[90vh] overflow-y-auto no-scrollbar">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-3xl font-black tracking-tighter">{selectedCourse.title}</h2>
              <button 
                onClick={() => setSelectedCourse(null)}
                className="w-12 h-12 bg-slate-100 dark:bg-zinc-800 rounded-full flex items-center justify-center hover:bg-slate-200 dark:hover:bg-zinc-700 transition-all"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <div className="space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div>
                  <img className="w-full h-80 object-cover rounded-[2rem] mb-6" src={selectedCourse.cover} alt="Course Cover" />
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <img className="w-10 h-10 rounded-full border border-primary/10" src={`https://picsum.photos/id/${80 + parseInt(selectedCourse.id)}/50/50`} alt="Instructor" />
                      <div>
                        <p className="text-sm font-bold">{selectedCourse.instructor}</p>
                        <p className="text-xs text-slate-400">Instructor</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <span className="material-symbols-outlined text-sm">event</span>
                        {selectedCourse.type === 'live' ? selectedCourse.startTime : '录播课程'}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <span className="material-symbols-outlined text-sm">access_time</span>
                        {selectedCourse.duration}
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-black mb-6">课程描述</h3>
                  <p className="text-slate-500 text-sm mb-8 leading-relaxed">{selectedCourse.description}</p>
                  <div className="space-y-4">
                    <h4 className="text-sm font-black uppercase tracking-widest text-slate-400">课程内容</h4>
                    <div className="space-y-3">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="flex items-center gap-4">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">{i}</div>
                          <div>
                            <p className="text-sm font-bold">第 {i} 节：{selectedCourse.title} - 主题 {i}</p>
                            <p className="text-xs text-slate-400">45分钟</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-primary/5 pt-10">
                <h3 className="text-xl font-black mb-6">课程讨论</h3>
                <div className="space-y-6 mb-8">
                  {comments.map((comment) => (
                    <div key={comment.id} className="flex gap-4">
                      <img className="w-10 h-10 rounded-full border border-primary/10 flex-shrink-0" src={`https://picsum.photos/id/${100 + parseInt(comment.id)}/50/50`} alt="User" />
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <p className="text-sm font-bold">{comment.user}</p>
                          <p className="text-xs text-slate-400">{comment.time}</p>
                        </div>
                        <p className="text-slate-500 text-sm">{comment.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-3">
                  <img className="w-10 h-10 rounded-full border border-primary/10 flex-shrink-0" src="https://picsum.photos/id/64/50/50" alt="You" />
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="写下你的评论..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && submitComment()}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-zinc-800 rounded-2xl border border-primary/5 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                    />
                  </div>
                  <button 
                    onClick={submitComment}
                    className="px-6 py-3 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all hover:shadow-lg hover:shadow-primary/20"
                  >
                    发送
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoursePage;
