import React, { useState, useEffect } from 'react';
import { api } from '../src/services/api';
import { useApp } from '../App';

interface User {
  id: string;
  email: string;
  name: string;
  avatar: string;
  created_at: string;
}

interface Content {
  id: string;
  title: string;
  content: string;
  author: string;
  created_at: string;
  user_id: string;
  category?: string;
}

interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  instructorAvatar: string;
  duration: string;
  level: string;
  category: string;
  image: string;
  created_at: string;
  user_id: string;
}

interface UserFormData {
  name: string;
  email: string;
  password: string;
}

interface ContentFormData {
  title: string;
  content: string;
  category: string;
  cover: string;
}

interface CourseFormData {
  title: string;
  description: string;
  instructor: string;
  duration: string;
  level: string;
  category: string;
  cover: string;
}

const AdminPage: React.FC = () => {
  const { theme } = useApp();
  const [activeTab, setActiveTab] = useState<'users' | 'content' | 'courses' | 'stats' | 'logs' | 'system'>('users');
  const [users, setUsers] = useState<User[]>([]);
  const [contents, setContents] = useState<Content[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalContent: 0,
    totalGroups: 0,
    dailyActiveUsers: 0
  });
  
  // 表单状态
  const [showUserForm, setShowUserForm] = useState(false);
  const [showContentForm, setShowContentForm] = useState(false);
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editingContent, setEditingContent] = useState<Content | null>(null);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  
  // 表单数据
  const [userFormData, setUserFormData] = useState<UserFormData>({
    name: '',
    email: '',
    password: ''
  });
  
  const [userFormErrors, setUserFormErrors] = useState<Record<string, string>>({
    name: '',
    email: '',
    password: ''
  });
  
  const [contentFormData, setContentFormData] = useState<ContentFormData>({
    title: '',
    content: '',
    category: 'Knowledge',
    cover: ''
  });
  
  const [contentFormErrors, setContentFormErrors] = useState<Record<string, string>>({
    title: '',
    content: '',
    category: ''
  });
  
  const [courseFormData, setCourseFormData] = useState<CourseFormData>({
    title: '',
    description: '',
    instructor: '',
    duration: '10 hours',
    level: 'Beginner',
    category: 'AI & Machine Learning',
    cover: ''
  });
  
  const [courseFormErrors, setCourseFormErrors] = useState<Record<string, string>>({
    title: '',
    description: '',
    instructor: '',
    duration: '',
    level: '',
    category: ''
  });
  
  // 通知系统
  const [notifications, setNotifications] = useState<Array<{
    id: string;
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
  }>>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // 获取统计数据
      setStats({
        totalUsers: 1242,
        totalContent: 5682,
        totalGroups: 87,
        dailyActiveUsers: 324
      });

      // 获取用户列表
      const usersData = await api.getFriends();
      setUsers((usersData as any[]).map((user: any) => ({
        id: user.id,
        email: `${user.name}@example.com`,
        name: user.name,
        avatar: user.avatar,
        created_at: new Date().toISOString()
      })));

      // 获取内容列表
      const contentData = await api.request('/content');
      setContents(contentData);

      // 获取课程列表
      const coursesData = await api.request('/courses');
      setCourses(coursesData);

      // 获取日志数据
      const logsData = await api.getLogs();
      setLogs(logsData);
    } catch (error) {
      console.error('Error fetching admin data:', error);
      // 使用模拟数据作为备份
      setUsers([
        {
          id: '1',
          email: 'admin@example.com',
          name: 'Admin User',
          avatar: 'https://picsum.photos/id/100/100/100',
          created_at: '2024-01-15T10:30:00Z'
        },
        {
          id: '2',
          email: 'user1@example.com',
          name: 'Regular User 1',
          avatar: 'https://picsum.photos/id/101/100/100',
          created_at: '2024-02-20T14:22:00Z'
        },
        {
          id: '3',
          email: 'user2@example.com',
          name: 'Regular User 2',
          avatar: 'https://picsum.photos/id/102/100/100',
          created_at: '2024-03-10T09:15:00Z'
        }
      ]);

      setContents([
        {
          id: '1',
          title: 'Generative AI in Modern UI Interactions',
          content: 'Exploring how LLMs are transforming traditional UI interaction paradigms...',
          author: 'Admin User',
          created_at: '2024-05-15T16:45:00Z',
          user_id: '1'
        },
        {
          id: '2',
          title: 'Quantum Computing: Industry Impact Analysis',
          content: 'Analysis of how quantum computing will reshape various industries...',
          author: 'Regular User 1',
          created_at: '2024-05-14T11:20:00Z',
          user_id: '2'
        }
      ]);

      setCourses([
        {
          id: '1',
          title: 'Introduction to Generative AI',
          description: 'Learn the fundamentals of generative AI and how to use it in your projects.',
          instructor: 'Dr. Alan Chen',
          instructorAvatar: 'https://picsum.photos/id/140/100/100',
          duration: '10 hours',
          level: 'Beginner',
          category: 'AI & Machine Learning',
          image: 'https://picsum.photos/id/115/600/400',
          created_at: '2024-05-15T16:45:00Z',
          user_id: '1'
        },
        {
          id: '2',
          title: 'Quantum Computing Fundamentals',
          description: 'Explore the basics of quantum computing and its potential applications.',
          instructor: 'Prof. Sarah Lin',
          instructorAvatar: 'https://picsum.photos/id/141/100/100',
          duration: '15 hours',
          level: 'Intermediate',
          category: 'Computer Science',
          image: 'https://picsum.photos/id/116/600/400',
          created_at: '2024-05-14T11:20:00Z',
          user_id: '2'
        }
      ]);

      // 模拟日志数据
      setLogs([
        {
          id: '1',
          user: 'Admin User',
          action: 'User Authentication',
          description: 'User logged in',
          timestamp: new Date().toISOString(),
          ip: '192.168.1.1'
        },
        {
          id: '2',
          user: 'Admin User',
          action: 'Content Management',
          description: 'Created new content: Introduction to Generative AI',
          timestamp: new Date().toISOString(),
          ip: '192.168.1.2'
        },
        {
          id: '3',
          user: 'Admin User',
          action: 'System Settings',
          description: 'Updated backup settings',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          ip: '192.168.1.2'
        },
        {
          id: '4',
          user: 'Regular User 1',
          action: 'Content Interaction',
          description: 'Viewed content: Quantum Computing Fundamentals',
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          ip: '192.168.1.3'
        },
        {
          id: '5',
          user: 'Regular User 2',
          action: 'User Authentication',
          description: 'User logged in',
          timestamp: new Date(Date.now() - 10800000).toISOString(),
          ip: '192.168.1.4'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        setLoading(true);
        // 调用API删除用户
        await api.request(`/users/${userId}`, {
          method: 'DELETE'
        });
        // 更新本地状态
        setUsers(users.filter(user => user.id !== userId));
        addNotification('User deleted successfully', 'success');
      } catch (error) {
        console.error('Error deleting user:', error);
        addNotification('Failed to delete user', 'error');
      } finally {
        setLoading(false);
      }
    }
  };

  const deleteContent = async (contentId: string) => {
    if (window.confirm('Are you sure you want to delete this content?')) {
      try {
        setLoading(true);
        // 调用API删除内容
        await api.deleteContent(contentId);
        // 更新本地状态
        setContents(contents.filter(content => content.id !== contentId));
        addNotification('Content deleted successfully', 'success');
      } catch (error) {
        console.error('Error deleting content:', error);
        addNotification('Failed to delete content', 'error');
      } finally {
        setLoading(false);
      }
    }
  };

  const deleteCourse = async (courseId: string) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        setLoading(true);
        // 调用API删除课程
        await api.deleteCourse(courseId);
        // 更新本地状态
        setCourses(courses.filter(course => course.id !== courseId));
        addNotification('Course deleted successfully', 'success');
      } catch (error) {
        console.error('Error deleting course:', error);
        addNotification('Failed to delete course', 'error');
      } finally {
        setLoading(false);
      }
    }
  };

  // 通知系统函数
  const addNotification = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
    const id = Date.now().toString();
    setNotifications(prev => [...prev, { id, message, type }]);
    
    // 3秒后自动删除通知
    setTimeout(() => {
      setNotifications(prev => prev.filter(notification => notification.id !== id));
    }, 3000);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  // 表单验证函数
  const validateUserForm = (data: any): Record<string, string> => {
    const errors: Record<string, string> = {};
    
    if (!data.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!data.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!editingUser && !data.password) {
      errors.password = 'Password is required';
    } else if (data.password && data.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    return errors;
  };

  const validateContentForm = (data: any): Record<string, string> => {
    const errors: Record<string, string> = {};
    
    if (!data.title.trim()) {
      errors.title = 'Title is required';
    } else if (data.title.length < 3) {
      errors.title = 'Title must be at least 3 characters';
    }
    
    if (!data.content.trim()) {
      errors.content = 'Content is required';
    } else if (data.content.length < 10) {
      errors.content = 'Content must be at least 10 characters';
    }
    
    if (!data.category) {
      errors.category = 'Category is required';
    }
    
    return errors;
  };

  const validateCourseForm = (data: any): Record<string, string> => {
    const errors: Record<string, string> = {};
    
    if (!data.title.trim()) {
      errors.title = 'Title is required';
    } else if (data.title.length < 3) {
      errors.title = 'Title must be at least 3 characters';
    }
    
    if (!data.description.trim()) {
      errors.description = 'Description is required';
    } else if (data.description.length < 10) {
      errors.description = 'Description must be at least 10 characters';
    }
    
    if (!data.instructor.trim()) {
      errors.instructor = 'Instructor is required';
    }
    
    if (!data.duration) {
      errors.duration = 'Duration is required';
    }
    
    if (!data.level) {
      errors.level = 'Level is required';
    }
    
    if (!data.category) {
      errors.category = 'Category is required';
    }
    
    return errors;
  };

  const handleUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 表单验证
    const errors = validateUserForm(userFormData);
    setUserFormErrors(errors);
    
    if (Object.keys(errors).length > 0) {
      return;
    }
    
    try {
      setLoading(true);
      if (editingUser) {
        // 编辑用户
        await api.request(`/users/${editingUser.id}`, {
          method: 'PUT',
          body: JSON.stringify(userFormData)
        });
        // 更新本地状态
        setUsers(users.map(user => 
          user.id === editingUser.id 
            ? { ...user, ...userFormData }
            : user
        ));
        addNotification('User updated successfully', 'success');
      } else {
        // 创建用户
        const newUser = await api.register(
          userFormData.email,
          userFormData.password,
          userFormData.name
        );
        // 更新本地状态
        setUsers([...users, {
          id: newUser.user_id,
          name: newUser.name,
          email: newUser.email,
          avatar: `https://picsum.photos/id/${Math.floor(Math.random() * 1000)}/100/100`,
          created_at: new Date().toISOString()
        }]);
        addNotification('User created successfully', 'success');
      }
      // 重置表单
      setShowUserForm(false);
      setEditingUser(null);
      setUserFormData({ name: '', email: '', password: '' });
      setUserFormErrors({ name: '', email: '', password: '' });
    } catch (error) {
      console.error('Error saving user:', error);
      addNotification('Failed to save user', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleContentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 表单验证
    const errors = validateContentForm(contentFormData);
    setContentFormErrors(errors);
    
    if (Object.keys(errors).length > 0) {
      return;
    }
    
    try {
      setLoading(true);
      if (editingContent) {
        // 编辑内容
        await api.request(`/content/${editingContent.id}`, {
          method: 'PUT',
          body: JSON.stringify(contentFormData)
        });
        // 更新本地状态
        setContents(contents.map(content => 
          content.id === editingContent.id 
            ? { ...content, ...contentFormData, author: 'Admin User' }
            : content
        ));
        addNotification('Content updated successfully', 'success');
      } else {
        // 创建内容
        const newContent = await api.createContent(contentFormData);
        // 更新本地状态
        setContents([...contents, newContent]);
        addNotification('Content created successfully', 'success');
      }
      // 重置表单
      setShowContentForm(false);
      setEditingContent(null);
      setContentFormData({ title: '', content: '', category: 'Knowledge', cover: '' });
      setContentFormErrors({ title: '', content: '', category: '' });
    } catch (error) {
      console.error('Error saving content:', error);
      addNotification('Failed to save content', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCourseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 表单验证
    const errors = validateCourseForm(courseFormData);
    setCourseFormErrors(errors);
    
    if (Object.keys(errors).length > 0) {
      return;
    }
    
    try {
      setLoading(true);
      if (editingCourse) {
        // 编辑课程
        await api.request(`/courses/${editingCourse.id}`, {
          method: 'PUT',
          body: JSON.stringify(courseFormData)
        });
        // 更新本地状态
        setCourses(courses.map(course => 
          course.id === editingCourse.id 
            ? { ...course, ...courseFormData }
            : course
        ));
        addNotification('Course updated successfully', 'success');
      } else {
        // 创建课程
        const newCourse = await api.request('/courses', {
          method: 'POST',
          body: JSON.stringify(courseFormData)
        });
        // 更新本地状态
        setCourses([...courses, newCourse]);
        addNotification('Course created successfully', 'success');
      }
      // 重置表单
      setShowCourseForm(false);
      setEditingCourse(null);
      setCourseFormData({ 
        title: '', 
        description: '', 
        instructor: '', 
        duration: '10 hours', 
        level: 'Beginner', 
        category: 'AI & Machine Learning', 
        cover: '' 
      });
      setCourseFormErrors({ 
        title: '', 
        description: '', 
        instructor: '', 
        duration: '', 
        level: '', 
        category: '' 
      });
    } catch (error) {
      console.error('Error saving course:', error);
      addNotification('Failed to save course', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setUserFormData({ name: user.name, email: user.email, password: '' });
    setShowUserForm(true);
  };

  const handleEditContent = (content: Content) => {
    setEditingContent(content);
    setContentFormData({ 
      title: content.title, 
      content: content.content, 
      category: content.category || 'Knowledge', 
      cover: '' 
    });
    setShowContentForm(true);
  };

  const handleEditCourse = (course: Course) => {
    setEditingCourse(course);
    setCourseFormData({ 
      title: course.title, 
      description: course.description, 
      instructor: course.instructor, 
      duration: course.duration, 
      level: course.level, 
      category: course.category, 
      cover: course.image 
    });
    setShowCourseForm(true);
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">管理后台</h1>
          <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            管理用户、内容和系统设置
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className={`p-6 rounded-xl shadow ${theme === 'dark' ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:bg-gray-50'} transition-all duration-300 transform hover:-translate-y-1`}>
            <div className="text-3xl font-bold text-blue-500">{stats.totalUsers}</div>
            <div className={`mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>总用户数</div>
          </div>
          <div className={`p-6 rounded-xl shadow ${theme === 'dark' ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:bg-gray-50'} transition-all duration-300 transform hover:-translate-y-1`}>
            <div className="text-3xl font-bold text-green-500">{stats.totalContent}</div>
            <div className={`mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>总内容数</div>
          </div>
          <div className={`p-6 rounded-xl shadow ${theme === 'dark' ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:bg-gray-50'} transition-all duration-300 transform hover:-translate-y-1`}>
            <div className="text-3xl font-bold text-purple-500">{stats.totalGroups}</div>
            <div className={`mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>总群组数</div>
          </div>
          <div className={`p-6 rounded-xl shadow ${theme === 'dark' ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:bg-gray-50'} transition-all duration-300 transform hover:-translate-y-1`}>
            <div className="text-3xl font-bold text-yellow-500">{stats.dailyActiveUsers}</div>
            <div className={`mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>日活跃用户</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap border-b mb-6">
          <button
            className={`px-4 py-3 font-medium rounded-t-lg ${activeTab === 'users' ? 'border-b-2 border-blue-500 text-blue-500 bg-opacity-10' : theme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-900'}`}
            onClick={() => setActiveTab('users')}
          >
            用户管理
          </button>
          <button
            className={`px-4 py-3 font-medium rounded-t-lg ${activeTab === 'content' ? 'border-b-2 border-blue-500 text-blue-500 bg-opacity-10' : theme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-900'}`}
            onClick={() => setActiveTab('content')}
          >
            内容管理
          </button>
          <button
            className={`px-4 py-3 font-medium rounded-t-lg ${activeTab === 'courses' ? 'border-b-2 border-blue-500 text-blue-500 bg-opacity-10' : theme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-900'}`}
            onClick={() => setActiveTab('courses')}
          >
            课程管理
          </button>
          <button
            className={`px-4 py-3 font-medium rounded-t-lg ${activeTab === 'stats' ? 'border-b-2 border-blue-500 text-blue-500 bg-opacity-10' : theme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-900'}`}
            onClick={() => setActiveTab('stats')}
          >
            统计报表
          </button>
          <button
            className={`px-4 py-3 font-medium rounded-t-lg ${activeTab === 'logs' ? 'border-b-2 border-blue-500 text-blue-500 bg-opacity-10' : theme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-900'}`}
            onClick={() => setActiveTab('logs')}
          >
            操作日志
          </button>
          <button
            className={`px-4 py-3 font-medium rounded-t-lg ${activeTab === 'system' ? 'border-b-2 border-blue-500 text-blue-500 bg-opacity-10' : theme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-900'}`}
            onClick={() => setActiveTab('system')}
          >
            系统设置
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'users' && (
          <div className={`rounded-xl shadow ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} overflow-hidden transition-all duration-300`}>
            <div className="p-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
                <h2 className="text-xl font-bold flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  用户管理
                </h2>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="搜索用户..." 
                      className={`pl-10 pr-4 py-2 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 focus:border-blue-500' : 'bg-white border border-gray-300 focus:border-blue-500'} focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all`}
                    />
                    <span className="absolute left-3 top-2.5 text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </span>
                  </div>
                  <select className={`px-4 py-2 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 focus:border-blue-500' : 'bg-white border border-gray-300 focus:border-blue-500'} focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all`}>
                    <option>所有用户</option>
                    <option>活跃用户</option>
                    <option>非活跃用户</option>
                  </select>
                  <button 
                    className={`px-4 py-2 rounded-lg ${theme === 'dark' ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'} text-white font-medium flex items-center transition-all transform hover:scale-105`}
                    onClick={() => {
                      setEditingUser(null);
                      setUserFormData({ name: '', email: '', password: '' });
                      setShowUserForm(true);
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    创建用户
                  </button>
                </div>
              </div>
              {loading ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className={theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}>
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">用户</th>
                        <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">邮箱</th>
                        <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">加入日期</th>
                        <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">操作</th>
                      </tr>
                    </thead>
                    <tbody className={`divide-y ${theme === 'dark' ? 'divide-gray-700 bg-gray-800' : 'divide-gray-200 bg-white'}`}>
                      {users.map((user) => (
                        <tr key={user.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <img className="h-10 w-10 rounded-full" src={user.avatar} alt={user.name} />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium">{user.name}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm">{user.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {new Date(user.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => deleteUser(user.id)}
                              className={`px-3 py-1 rounded ${theme === 'dark' ? 'bg-red-900/20 text-red-400 hover:bg-red-900/30' : 'bg-red-100 text-red-600 hover:bg-red-200'} transition-all mr-2`}
                            >
                              删除
                            </button>
                            <button 
                              className={`px-3 py-1 rounded ${theme === 'dark' ? 'bg-blue-900/20 text-blue-400 hover:bg-blue-900/30' : 'bg-blue-100 text-blue-600 hover:bg-blue-200'} transition-all`}
                              onClick={() => handleEditUser(user)}
                            >
                              编辑
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* User Form Modal */}
        {showUserForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className={`rounded-xl shadow-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 max-w-md w-full transform transition-all duration-300 scale-100`}>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">{editingUser ? '编辑用户' : '创建用户'}</h3>
                <button 
                  type="button" 
                  className={`p-2 rounded-full ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-all`}
                  onClick={() => setShowUserForm(false)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <form onSubmit={handleUserSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">姓名</label>
                  <input 
                    type="text" 
                    className={`w-full px-4 py-2 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 focus:border-blue-500' : 'border-gray-300 focus:border-blue-500'} ${userFormErrors.name ? (theme === 'dark' ? 'border-red-500' : 'border-red-500') : ''} focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all`}
                    value={userFormData.name}
                    onChange={(e) => {
                      setUserFormData({ ...userFormData, name: e.target.value });
                      if (userFormErrors.name) {
                        setUserFormErrors({ ...userFormErrors, name: '' });
                      }
                    }}
                    placeholder="请输入姓名"
                    required
                  />
                  {userFormErrors.name && (
                    <p className="mt-1 text-sm text-red-600">{userFormErrors.name}</p>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">邮箱</label>
                  <input 
                    type="email" 
                    className={`w-full px-4 py-2 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 focus:border-blue-500' : 'border-gray-300 focus:border-blue-500'} ${userFormErrors.email ? (theme === 'dark' ? 'border-red-500' : 'border-red-500') : ''} focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all`}
                    value={userFormData.email}
                    onChange={(e) => {
                      setUserFormData({ ...userFormData, email: e.target.value });
                      if (userFormErrors.email) {
                        setUserFormErrors({ ...userFormErrors, email: '' });
                      }
                    }}
                    placeholder="请输入邮箱"
                    required
                  />
                  {userFormErrors.email && (
                    <p className="mt-1 text-sm text-red-600">{userFormErrors.email}</p>
                  )}
                </div>
                {!editingUser && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-1">密码</label>
                    <input 
                      type="password" 
                      className={`w-full px-4 py-2 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 focus:border-blue-500' : 'border-gray-300 focus:border-blue-500'} ${userFormErrors.password ? (theme === 'dark' ? 'border-red-500' : 'border-red-500') : ''} focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all`}
                      value={userFormData.password}
                      onChange={(e) => {
                        setUserFormData({ ...userFormData, password: e.target.value });
                        if (userFormErrors.password) {
                          setUserFormErrors({ ...userFormErrors, password: '' });
                        }
                      }}
                      placeholder="请输入密码"
                      required
                    />
                    {userFormErrors.password && (
                      <p className="mt-1 text-sm text-red-600">{userFormErrors.password}</p>
                    )}
                  </div>
                )}
                <div className="flex justify-end space-x-3">
                  <button 
                    type="button" 
                    className={`px-4 py-2 rounded-lg ${theme === 'dark' ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-200 hover:bg-gray-300'} transition-all`}
                    onClick={() => setShowUserForm(false)}
                  >
                    取消
                  </button>
                  <button 
                    type="submit" 
                    className={`px-4 py-2 rounded-lg ${theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white transition-all transform hover:scale-105`}
                    disabled={loading}
                  >
                    {loading ? '保存中...' : '保存'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {activeTab === 'content' && (
          <div className={`rounded-xl shadow ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} overflow-hidden`}>
            <div className="p-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-4">
                <h2 className="text-xl font-bold">Content Management</h2>
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="Search content..." 
                      className={`pl-10 pr-4 py-2 rounded ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border border-gray-300'}`}
                    />
                    <span className="absolute left-3 top-2.5 text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </span>
                  </div>
                  <select className={`px-4 py-2 rounded ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border border-gray-300'}`}>
                    <option>All Categories</option>
                    <option>Knowledge</option>
                    <option>Technology</option>
                    <option>Science</option>
                    <option>Arts</option>
                    <option>Business</option>
                  </select>
                  <button 
                    className={`px-4 py-2 rounded ${theme === 'dark' ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'} text-white font-medium`}
                    onClick={() => {
                      setEditingContent(null);
                      setContentFormData({ title: '', content: '', category: 'Knowledge', cover: '' });
                      setShowContentForm(true);
                    }}
                  >
                    Create Content
                  </button>
                </div>
              </div>
              {loading ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className={theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}>
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Title</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Author</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className={`divide-y ${theme === 'dark' ? 'divide-gray-700 bg-gray-800' : 'divide-gray-200 bg-white'}`}>
                      {contents.map((content) => (
                        <tr key={content.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium">{content.title}</div>
                            <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                              {content.content.substring(0, 60)}...
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {content.author}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {new Date(content.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => deleteContent(content.id)}
                              className="text-red-600 hover:text-red-900 mr-4"
                            >
                              Delete
                            </button>
                            <button 
                              className="text-blue-600 hover:text-blue-900"
                              onClick={() => handleEditContent(content)}
                            >
                              Edit
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Content Form Modal */}
        {showContentForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className={`rounded-xl shadow-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 max-w-2xl w-full`}>
              <h3 className="text-xl font-semibold mb-4">{editingContent ? 'Edit Content' : 'Create Content'}</h3>
              <form onSubmit={handleContentSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Title</label>
                  <input 
                    type="text" 
                    className={`w-full px-3 py-2 rounded border ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'border-gray-300'} ${contentFormErrors.title ? (theme === 'dark' ? 'border-red-500' : 'border-red-500') : ''}`}
                    value={contentFormData.title}
                    onChange={(e) => {
                      setContentFormData({ ...contentFormData, title: e.target.value });
                      if (contentFormErrors.title) {
                        setContentFormErrors({ ...contentFormErrors, title: '' });
                      }
                    }}
                    required
                  />
                  {contentFormErrors.title && (
                    <p className="mt-1 text-sm text-red-600">{contentFormErrors.title}</p>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Content</label>
                  <textarea 
                    className={`w-full px-3 py-2 rounded border ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'border-gray-300'} ${contentFormErrors.content ? (theme === 'dark' ? 'border-red-500' : 'border-red-500') : ''}`}
                    value={contentFormData.content}
                    onChange={(e) => {
                      setContentFormData({ ...contentFormData, content: e.target.value });
                      if (contentFormErrors.content) {
                        setContentFormErrors({ ...contentFormErrors, content: '' });
                      }
                    }}
                    rows={4}
                    required
                  />
                  {contentFormErrors.content && (
                    <p className="mt-1 text-sm text-red-600">{contentFormErrors.content}</p>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Category</label>
                  <select 
                    className={`w-full px-3 py-2 rounded border ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'border-gray-300'} ${contentFormErrors.category ? (theme === 'dark' ? 'border-red-500' : 'border-red-500') : ''}`}
                    value={contentFormData.category}
                    onChange={(e) => {
                      setContentFormData({ ...contentFormData, category: e.target.value });
                      if (contentFormErrors.category) {
                        setContentFormErrors({ ...contentFormErrors, category: '' });
                      }
                    }}
                  >
                    <option>Knowledge</option>
                    <option>Technology</option>
                    <option>Science</option>
                    <option>Art</option>
                    <option>Other</option>
                  </select>
                  {contentFormErrors.category && (
                    <p className="mt-1 text-sm text-red-600">{contentFormErrors.category}</p>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Cover Image URL</label>
                  <input 
                    type="text" 
                    className={`w-full px-3 py-2 rounded border ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'border-gray-300'}`}
                    value={contentFormData.cover}
                    onChange={(e) => setContentFormData({ ...contentFormData, cover: e.target.value })}
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <button 
                    type="button" 
                    className={`px-4 py-2 rounded ${theme === 'dark' ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-200 hover:bg-gray-300'}`}
                    onClick={() => setShowContentForm(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className={`px-4 py-2 rounded ${theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {activeTab === 'courses' && (
          <div className={`rounded-xl shadow ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} overflow-hidden`}>
            <div className="p-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-4">
                <h2 className="text-xl font-bold">Course Management</h2>
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="Search courses..." 
                      className={`pl-10 pr-4 py-2 rounded ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border border-gray-300'}`}
                    />
                    <span className="absolute left-3 top-2.5 text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </span>
                  </div>
                  <select className={`px-4 py-2 rounded ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border border-gray-300'}`}>
                    <option>All Categories</option>
                    <option>AI & Machine Learning</option>
                    <option>Web Development</option>
                    <option>Data Science</option>
                    <option>Business</option>
                    <option>Design</option>
                  </select>
                  <select className={`px-4 py-2 rounded ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border border-gray-300'}`}>
                    <option>All Levels</option>
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                  </select>
                  <button 
                    className={`px-4 py-2 rounded ${theme === 'dark' ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'} text-white font-medium`}
                    onClick={() => {
                      setEditingCourse(null);
                      setCourseFormData({ 
                        title: '', 
                        description: '', 
                        instructor: '', 
                        duration: '10 hours', 
                        level: 'Beginner', 
                        category: 'AI & Machine Learning', 
                        cover: '' 
                      });
                      setShowCourseForm(true);
                    }}
                  >
                    Create Course
                  </button>
                </div>
              </div>
              {loading ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className={theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}>
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Title</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Instructor</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Category</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Level</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className={`divide-y ${theme === 'dark' ? 'divide-gray-700 bg-gray-800' : 'divide-gray-200 bg-white'}`}>
                      {courses.map((course) => (
                        <tr key={course.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium">{course.title}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {course.instructor}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {course.category}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {course.level}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {new Date(course.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => deleteCourse(course.id)}
                              className="text-red-600 hover:text-red-900 mr-4"
                            >
                              Delete
                            </button>
                            <button 
                              className="text-blue-600 hover:text-blue-900"
                              onClick={() => handleEditCourse(course)}
                            >
                              Edit
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Course Form Modal */}
        {showCourseForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className={`rounded-xl shadow-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 max-w-2xl w-full`}>
              <h3 className="text-xl font-semibold mb-4">{editingCourse ? 'Edit Course' : 'Create Course'}</h3>
              <form onSubmit={handleCourseSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Title</label>
                  <input 
                    type="text" 
                    className={`w-full px-3 py-2 rounded border ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'border-gray-300'} ${courseFormErrors.title ? (theme === 'dark' ? 'border-red-500' : 'border-red-500') : ''}`}
                    value={courseFormData.title}
                    onChange={(e) => {
                      setCourseFormData({ ...courseFormData, title: e.target.value });
                      if (courseFormErrors.title) {
                        setCourseFormErrors({ ...courseFormErrors, title: '' });
                      }
                    }}
                    required
                  />
                  {courseFormErrors.title && (
                    <p className="mt-1 text-sm text-red-600">{courseFormErrors.title}</p>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea 
                    className={`w-full px-3 py-2 rounded border ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'border-gray-300'} ${courseFormErrors.description ? (theme === 'dark' ? 'border-red-500' : 'border-red-500') : ''}`}
                    value={courseFormData.description}
                    onChange={(e) => {
                      setCourseFormData({ ...courseFormData, description: e.target.value });
                      if (courseFormErrors.description) {
                        setCourseFormErrors({ ...courseFormErrors, description: '' });
                      }
                    }}
                    rows={3}
                    required
                  />
                  {courseFormErrors.description && (
                    <p className="mt-1 text-sm text-red-600">{courseFormErrors.description}</p>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Instructor</label>
                  <input 
                    type="text" 
                    className={`w-full px-3 py-2 rounded border ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'border-gray-300'} ${courseFormErrors.instructor ? (theme === 'dark' ? 'border-red-500' : 'border-red-500') : ''}`}
                    value={courseFormData.instructor}
                    onChange={(e) => {
                      setCourseFormData({ ...courseFormData, instructor: e.target.value });
                      if (courseFormErrors.instructor) {
                        setCourseFormErrors({ ...courseFormErrors, instructor: '' });
                      }
                    }}
                    required
                  />
                  {courseFormErrors.instructor && (
                    <p className="mt-1 text-sm text-red-600">{courseFormErrors.instructor}</p>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Duration</label>
                  <input 
                    type="text" 
                    className={`w-full px-3 py-2 rounded border ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'border-gray-300'} ${courseFormErrors.duration ? (theme === 'dark' ? 'border-red-500' : 'border-red-500') : ''}`}
                    value={courseFormData.duration}
                    onChange={(e) => {
                      setCourseFormData({ ...courseFormData, duration: e.target.value });
                      if (courseFormErrors.duration) {
                        setCourseFormErrors({ ...courseFormErrors, duration: '' });
                      }
                    }}
                    required
                  />
                  {courseFormErrors.duration && (
                    <p className="mt-1 text-sm text-red-600">{courseFormErrors.duration}</p>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Level</label>
                  <select 
                    className={`w-full px-3 py-2 rounded border ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'border-gray-300'} ${courseFormErrors.level ? (theme === 'dark' ? 'border-red-500' : 'border-red-500') : ''}`}
                    value={courseFormData.level}
                    onChange={(e) => {
                      setCourseFormData({ ...courseFormData, level: e.target.value });
                      if (courseFormErrors.level) {
                        setCourseFormErrors({ ...courseFormErrors, level: '' });
                      }
                    }}
                  >
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                  </select>
                  {courseFormErrors.level && (
                    <p className="mt-1 text-sm text-red-600">{courseFormErrors.level}</p>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Category</label>
                  <select 
                    className={`w-full px-3 py-2 rounded border ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'border-gray-300'} ${courseFormErrors.category ? (theme === 'dark' ? 'border-red-500' : 'border-red-500') : ''}`}
                    value={courseFormData.category}
                    onChange={(e) => {
                      setCourseFormData({ ...courseFormData, category: e.target.value });
                      if (courseFormErrors.category) {
                        setCourseFormErrors({ ...courseFormErrors, category: '' });
                      }
                    }}
                  >
                    <option>AI & Machine Learning</option>
                    <option>Computer Science</option>
                    <option>Data Science</option>
                    <option>Web Development</option>
                    <option>Mobile Development</option>
                    <option>Other</option>
                  </select>
                  {courseFormErrors.category && (
                    <p className="mt-1 text-sm text-red-600">{courseFormErrors.category}</p>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Cover Image URL</label>
                  <input 
                    type="text" 
                    className={`w-full px-3 py-2 rounded border ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'border-gray-300'}`}
                    value={courseFormData.cover}
                    onChange={(e) => setCourseFormData({ ...courseFormData, cover: e.target.value })}
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <button 
                    type="button" 
                    className={`px-4 py-2 rounded ${theme === 'dark' ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-200 hover:bg-gray-300'}`}
                    onClick={() => setShowCourseForm(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className={`px-4 py-2 rounded ${theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {activeTab === 'stats' && (
          <div className={`rounded-xl shadow ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} overflow-hidden`}>
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Statistics & Reports</h2>
              
              {/* Overview Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-blue-50'}`}>
                  <div className="text-sm font-medium text-blue-600 mb-1">Total Users</div>
                  <div className="text-2xl font-bold">{stats.totalUsers}</div>
                  <div className="text-xs text-green-600 mt-1">+12% from last month</div>
                </div>
                <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-green-50'}`}>
                  <div className="text-sm font-medium text-green-600 mb-1">Total Content</div>
                  <div className="text-2xl font-bold">{stats.totalContent}</div>
                  <div className="text-xs text-green-600 mt-1">+8% from last month</div>
                </div>
                <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-purple-50'}`}>
                  <div className="text-sm font-medium text-purple-600 mb-1">Total Groups</div>
                  <div className="text-2xl font-bold">{stats.totalGroups}</div>
                  <div className="text-xs text-green-600 mt-1">+5% from last month</div>
                </div>
                <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-yellow-50'}`}>
                  <div className="text-sm font-medium text-yellow-600 mb-1">Daily Active Users</div>
                  <div className="text-2xl font-bold">{stats.dailyActiveUsers}</div>
                  <div className="text-xs text-green-600 mt-1">+15% from last week</div>
                </div>
              </div>
              
              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* User Activity Chart */}
                <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-white'} shadow`}>
                  <h3 className="font-medium mb-4">User Activity (Last 7 Days)</h3>
                  <div className="h-64 flex items-end justify-between space-x-2">
                    {[324, 289, 356, 412, 387, 456, 521].map((value, index) => (
                      <div key={index} className="flex-1">
                        <div 
                          className="h-full bg-blue-500 rounded-t-md" 
                          style={{ height: `${(value / 550) * 100}%` }}
                        ></div>
                        <div className="text-xs text-center mt-1">Day {index + 1}</div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Content Categories Chart */}
                <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-white'} shadow`}>
                  <h3 className="font-medium mb-4">Content Categories Distribution</h3>
                  <div className="h-64 flex flex-col justify-end">
                    {[
                      { name: 'Knowledge', value: 35 },
                      { name: 'Technology', value: 25 },
                      { name: 'Science', value: 20 },
                      { name: 'Art', value: 10 },
                      { name: 'Other', value: 10 }
                    ].map((category, index) => (
                      <div key={index} className="flex items-center mb-2">
                        <div className="w-32 text-sm">{category.name}</div>
                        <div className="flex-1 h-4 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-purple-500 rounded-full" 
                            style={{ width: `${category.value}%` }}
                          ></div>
                        </div>
                        <div className="w-12 text-sm text-right ml-2">{category.value}%</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Detailed Reports */}
              <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-white'} shadow mb-6`}>
                <h3 className="font-medium mb-4">Top Performing Content</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className={theme === 'dark' ? 'bg-gray-600' : 'bg-gray-100'}>
                      <tr>
                        <th className="py-2 px-4 text-left text-sm font-medium">Title</th>
                        <th className="py-2 px-4 text-left text-sm font-medium">Category</th>
                        <th className="py-2 px-4 text-left text-sm font-medium">Author</th>
                        <th className="py-2 px-4 text-left text-sm font-medium">Views</th>
                        <th className="py-2 px-4 text-left text-sm font-medium">Created At</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {contents.slice(0, 5).map((content) => (
                        <tr key={content.id}>
                          <td className="py-2 px-4 text-sm">{content.title}</td>
                          <td className="py-2 px-4 text-sm">{content.category || 'Knowledge'}</td>
                          <td className="py-2 px-4 text-sm">{content.author}</td>
                          <td className="py-2 px-4 text-sm">{Math.floor(Math.random() * 1000) + 100}</td>
                          <td className="py-2 px-4 text-sm">{new Date(content.created_at).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              {/* Export Reports Button */}
              <div className="flex justify-end">
                <button className={`px-4 py-2 rounded ${theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white font-medium`}>
                  Export Reports
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'system' && (
          <div className={`rounded-xl shadow ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} overflow-hidden`}>
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">System Settings</h2>
              <div className="space-y-6">
                {/* General Settings */}
                <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <h3 className="font-medium mb-4">General Settings</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Enable User Registration</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Email Verification Required</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Enable Social Login</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Site Name</span>
                      <input 
                        type="text" 
                        defaultValue="x² Knowledge Nebula" 
                        className={`px-3 py-1 rounded ${theme === 'dark' ? 'bg-gray-600' : 'bg-white border'}`}
                        style={{ width: '200px' }}
                      />
                    </div>
                  </div>
                </div>
                
                {/* Security Settings */}
                <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <h3 className="font-medium mb-4">Security Settings</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Two-Factor Authentication</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Session Timeout</span>
                      <select className={`px-3 py-1 rounded ${theme === 'dark' ? 'bg-gray-600' : 'bg-white border'}`}>
                        <option>30 minutes</option>
                        <option>1 hour</option>
                        <option>2 hours</option>
                        <option>Never</option>
                      </select>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Password Strength Requirements</span>
                      <select className={`px-3 py-1 rounded ${theme === 'dark' ? 'bg-gray-600' : 'bg-white border'}`}>
                        <option>Low</option>
                        <option>Medium</option>
                        <option>High</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                {/* Data Backup Settings */}
                <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <h3 className="font-medium mb-4">Data Backup Settings</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Enable Automatic Backup</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Backup Frequency</span>
                      <select className={`px-3 py-1 rounded ${theme === 'dark' ? 'bg-gray-600' : 'bg-white border'}`}>
                        <option>Daily</option>
                        <option>Weekly</option>
                        <option>Monthly</option>
                      </select>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Backup Retention Period</span>
                      <select className={`px-3 py-1 rounded ${theme === 'dark' ? 'bg-gray-600' : 'bg-white border'}`}>
                        <option>7 days</option>
                        <option>30 days</option>
                        <option>90 days</option>
                      </select>
                    </div>
                    <div className="pt-2">
                      <button 
                        className={`px-4 py-2 rounded ${theme === 'dark' ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'} text-white font-medium mr-2`}
                        onClick={async () => {
                          try {
                            await api.backupData();
                            addNotification('数据备份成功', 'success');
                          } catch (error) {
                            addNotification('数据备份失败', 'error');
                          }
                        }}
                      >
                        Manual Backup Now
                      </button>
                      <input
                        type="file"
                        accept=".json"
                        className="hidden"
                        id="backup-file"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            try {
                              await api.restoreData(file);
                              addNotification('数据恢复成功', 'success');
                              // 重置文件输入
                              e.target.value = '';
                            } catch (error) {
                              addNotification('数据恢复失败', 'error');
                            }
                          }
                        }}
                      />
                      <label
                        htmlFor="backup-file"
                        className={`px-4 py-2 rounded ${theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white font-medium cursor-pointer`}
                      >
                        Restore Backup
                      </label>
                    </div>
                    <div className="mt-4">
                      <h4 className="font-medium text-sm mb-2">Backup Instructions</h4>
                      <ul className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} space-y-1 list-disc pl-5`}>
                        <li>Backup files are in JSON format and include all system data</li>
                        <li>Restoring data will overwrite current system data, please proceed with caution</li>
                        <li>It is recommended to backup data regularly to prevent data loss</li>
                        <li>After restoring data, it is recommended to refresh the page to view the latest data</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                {/* Log Settings */}
                <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <h3 className="font-medium mb-4">Log Settings</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Enable Operation Logs</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Log Retention Period</span>
                      <select className={`px-3 py-1 rounded ${theme === 'dark' ? 'bg-gray-600' : 'bg-white border'}`}>
                        <option>7 days</option>
                        <option>30 days</option>
                        <option>90 days</option>
                        <option>180 days</option>
                      </select>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Log Level</span>
                      <select className={`px-3 py-1 rounded ${theme === 'dark' ? 'bg-gray-600' : 'bg-white border'}`}>
                        <option>Debug</option>
                        <option>Info</option>
                        <option>Warning</option>
                        <option>Error</option>
                      </select>
                    </div>
                    <div className="pt-2">
                      <button 
                        className={`px-4 py-2 rounded ${theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white font-medium`}
                        onClick={() => setActiveTab('logs')}
                      >
                        View Logs
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Performance Settings */}
                <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <h3 className="font-medium mb-4">Performance Settings</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Enable Caching</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Cache Duration</span>
                      <select className={`px-3 py-1 rounded ${theme === 'dark' ? 'bg-gray-600' : 'bg-white border'}`}>
                        <option>5 minutes</option>
                        <option>15 minutes</option>
                        <option>30 minutes</option>
                        <option>1 hour</option>
                      </select>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Max Upload Size</span>
                      <select className={`px-3 py-1 rounded ${theme === 'dark' ? 'bg-gray-600' : 'bg-white border'}`}>
                        <option>10MB</option>
                        <option>50MB</option>
                        <option>100MB</option>
                        <option>200MB</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                {/* Save Changes */}
                <div className="pt-4">
                  <button className={`px-4 py-2 rounded ${theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white font-medium mr-2`}>
                    Save Changes
                  </button>
                  <button className={`px-4 py-2 rounded ${theme === 'dark' ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-200 hover:bg-gray-300'}`}>
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Logs Tab */}
        {activeTab === 'logs' && (
          <div className={`rounded-xl shadow ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} overflow-hidden`}>
            <div className="p-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-4">
                <h2 className="text-xl font-bold">Operation Logs</h2>
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="Search logs..." 
                      className={`pl-10 pr-4 py-2 rounded ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border border-gray-300'}`}
                    />
                    <span className="absolute left-3 top-2.5 text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </span>
                  </div>
                  <select className={`px-3 py-2 rounded ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border border-gray-300'}`}>
                    <option>All Actions</option>
                    <option>User Authentication</option>
                    <option>Content Management</option>
                    <option>System Settings</option>
                    <option>User Management</option>
                  </select>
                </div>
              </div>
              {loading ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className={theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}>
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">User</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Action</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Description</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Timestamp</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">IP Address</th>
                      </tr>
                    </thead>
                    <tbody className={`divide-y ${theme === 'dark' ? 'divide-gray-700 bg-gray-800' : 'divide-gray-200 bg-white'}`}>
                      {logs.map((log) => (
                        <tr key={log.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">{log.user}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">{log.action}</td>
                          <td className="px-6 py-4 text-sm">{log.description}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">{new Date(log.timestamp).toLocaleString()}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">{log.ip}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Notification System */}
        <div className="fixed top-4 right-4 z-50 space-y-2">
          {notifications.map((notification) => (
            <div 
              key={notification.id}
              className={`px-4 py-3 rounded-lg shadow-md flex items-center justify-between ${notification.type === 'success' ? 'bg-green-100 text-green-800' : notification.type === 'error' ? 'bg-red-100 text-red-800' : notification.type === 'warning' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'}`}
            >
              <span>{notification.message}</span>
              <button 
                onClick={() => removeNotification(notification.id)}
                className="ml-4 text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;