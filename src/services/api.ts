// API Service for x² Knowledge Nebula

const API_BASE_URL = 'http://localhost:8000/api';
const USE_MOCK_DATA = true; // 使用模拟数据，无需后端服务

interface ApiResponse<T> {
  data: T;
  error?: string;
}

// 模拟数据
const mockData = {
  users: {
    'explorer@knowledge.art': {
      user_id: '1',
      email: 'explorer@knowledge.art',
      name: 'Knowledge Explorer',
      avatar: 'https://picsum.photos/id/1005/100/100'
      // 注意：不在前端存储密码
    },
    'admin@example.com': {
      user_id: '2',
      email: 'admin@example.com',
      name: 'Admin User',
      avatar: 'https://picsum.photos/id/100/100/100'
      // 注意：不在前端存储密码
    }
  },
  tokens: {
    'explorer@knowledge.art': 'mock-token-12345',
    'admin@example.com': 'mock-token-admin-12345'
  },
  // 密码验证（仅用于模拟，实际应在后端验证）
  mockPasswords: {
    'explorer@knowledge.art': 'password',
    'admin@example.com': 'password'
  },
  messages: [
    {
      id: '1',
      senderId: '2',
      senderName: 'Alice Chen',
      senderAvatar: 'https://picsum.photos/id/1012/100/100',
      content: '你好！欢迎加入知识星云社区！',
      timestamp: new Date().toISOString(),
      isRead: false
    },
    {
      id: '2',
      senderId: '3',
      senderName: 'Bob Wang',
      senderAvatar: 'https://picsum.photos/id/1025/100/100',
      content: '嗨，最近在学习什么新技术？',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      isRead: true
    }
  ],
  friends: [
    {
      id: '2',
      name: 'Alice Chen',
      avatar: 'https://picsum.photos/id/1012/100/100',
      lastMessage: '你好！欢迎加入知识星云社区！',
      lastMessageTime: new Date().toISOString(),
      isOnline: true
    },
    {
      id: '3',
      name: 'Bob Wang',
      avatar: 'https://picsum.photos/id/1025/100/100',
      lastMessage: '嗨，最近在学习什么新技术？',
      lastMessageTime: new Date(Date.now() - 3600000).toISOString(),
      isOnline: false
    }
  ],
  content: [
    {
      id: '1',
      title: '生成式 AI 在现代 UI 交互中的深度实践',
      content: '探讨大语言模型与实时渲染技术如何深度融合，为用户带来前所未有的沉浸式体验与认知革命...',
      author: 'Dr. Alan Chen',
      authorAvatar: 'https://picsum.photos/id/140/100/100',
      views: '2.4k',
      category: 'Knowledge',
      image: 'https://picsum.photos/id/115/600/400',
      created_at: new Date().toISOString(),
      user_id: '1'
    },
    {
      id: '2',
      title: '量子计算技术如何在未来五年内重塑行业生态',
      content: '量子计算的突破将如何改变我们的生活和工作方式，从金融到医疗，从物流到能源...',
      author: 'Prof. Sarah Lin',
      authorAvatar: 'https://picsum.photos/id/141/100/100',
      views: '1.8k',
      category: '量子计算',
      image: 'https://picsum.photos/id/116/600/400',
      created_at: new Date(Date.now() - 86400000).toISOString(),
      user_id: '2'
    }
  ],
  hotspots: [
    { name: '量子计算', top: '25%', left: '30%', color: '#a855f7' },
    { name: '生成式AI', top: '45%', left: '60%', color: '#7f13ec' },
    { name: '神经网络', top: '65%', left: '35%', color: '#3b82f6' },
    { name: '艺术哲学', top: '15%', left: '55%', color: '#ec4899' },
    { name: '数字孪生', top: '75%', left: '55%', color: '#3b82f6' },
    { name: '脑机接口', top: '35%', left: '15%', color: '#f59e0b' },
  ],
  hotChats: [
    { id: 1, topic: 'DeepSeek-R1 的推理逻辑', count: '1.2w', trend: 'up' },
    { id: 2, topic: '碳基与硅基生命的边界', count: '8.4k', trend: 'up' },
    { id: 3, topic: '空间计算中的交互革命', count: '6.2k', trend: 'steady' },
    { id: 4, topic: '从原子到比特：物质数字化', count: '4.8k', trend: 'up' },
    { id: 5, topic: '后人类主义下的艺术创作', count: '3.1k', trend: 'new' },
  ],
  courses: [
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
      created_at: new Date().toISOString(),
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
      created_at: new Date(Date.now() - 86400000).toISOString(),
      user_id: '2'
    }
  ],
  logs: [
    {
      id: '1',
      user: 'Knowledge Explorer',
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
      user: 'Knowledge Explorer',
      action: 'Content Interaction',
      description: 'Viewed content: Quantum Computing Fundamentals',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      ip: '192.168.1.1'
    }
  ]
};

class ApiService {
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem('token');
    }
    return this.token;
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    if (USE_MOCK_DATA) {
      // 返回模拟数据
      return this.getMockData<T>(endpoint, options);
    }

    try {
      const url = `${API_BASE_URL}${endpoint}`;
      
      const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
      };

      if (this.getToken()) {
        headers['Authorization'] = `Bearer ${this.getToken()}`;
      }

      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `API Error: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.warn('API调用失败，使用模拟数据:', error);
      // API调用失败时使用模拟数据
      return this.getMockData<T>(endpoint, options);
    }
  }

  // 获取模拟数据
  private getMockData<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          if (endpoint.includes('/auth/login')) {
            if (!options.body) {
              reject(new Error('Invalid request: missing body'));
              return;
            }
            const body = JSON.parse(options.body as string);
            if (!body.email || !body.password) {
              reject(new Error('Invalid request: missing email or password'));
              return;
            }
            const user = mockData.users[body.email];
            const expectedPassword = mockData.mockPasswords[body.email];
            if (user && expectedPassword === body.password) {
              resolve({
                access_token: mockData.tokens[body.email],
                user_id: user.user_id,
                email: user.email,
                name: user.name
              } as T);
            } else {
              reject(new Error('Invalid credentials'));
            }
          } else if (endpoint.includes('/auth/register')) {
            if (!options.body) {
              reject(new Error('Invalid request: missing body'));
              return;
            }
            const body = JSON.parse(options.body as string);
            if (!body.email || !body.password || !body.name) {
              reject(new Error('Invalid request: missing required fields'));
              return;
            }
            // 检查邮箱是否已存在
            if (mockData.users[body.email]) {
              reject(new Error('Email already exists'));
            }
            const newUser = {
              user_id: Date.now().toString(),
              email: body.email,
              name: body.name,
              avatar: `https://picsum.photos/id/${Math.floor(Math.random() * 1000)}/100/100`
              // 注意：不在前端存储密码
            };
            mockData.users[body.email] = newUser;
            mockData.tokens[body.email] = `mock-token-${Date.now()}`;
            mockData.mockPasswords[body.email] = body.password;
            resolve({
              access_token: mockData.tokens[body.email],
              user_id: newUser.user_id,
              email: newUser.email,
              name: newUser.name
            } as T);
          } else if (endpoint.includes('/users/me')) {
            // 从token中获取当前用户
            const currentUserEmail = Object.keys(mockData.tokens).find(email => mockData.tokens[email] === this.getToken());
            if (currentUserEmail) {
              const user = mockData.users[currentUserEmail];
              resolve({
                user_id: user.user_id,
                email: user.email,
                name: user.name,
                avatar: user.avatar
              } as T);
            } else {
              // 默认用户
              resolve({
                user_id: '1',
                email: 'explorer@knowledge.art',
                name: 'Knowledge Explorer',
                avatar: 'https://picsum.photos/id/1005/100/100'
              } as T);
            }
          } else if (endpoint.includes('/content/hotspots')) {
            resolve(mockData.hotspots as T);
          } else if (endpoint.includes('/content/hot-chats')) {
            resolve(mockData.hotChats as T);
          } else if (endpoint.includes('/content') && options.method === 'POST') {
            // 创建内容
            if (!options.body) {
              reject(new Error('Invalid request: missing body'));
              return;
            }
            const body = JSON.parse(options.body as string);
            if (!body.title) {
              reject(new Error('Invalid request: missing title'));
              return;
            }
            const currentUserEmail = Object.keys(mockData.tokens).find(email => mockData.tokens[email] === this.getToken());
            const currentUser = currentUserEmail ? mockData.users[currentUserEmail] : mockData.users['explorer@knowledge.art'];
            
            const newContent = {
              id: Date.now().toString(),
              title: body.title,
              content: body.description || '',
              author: currentUser.name,
              authorAvatar: currentUser.avatar,
              views: '0',
              category: body.category || 'Knowledge',
              image: body.cover || `https://picsum.photos/id/${Math.floor(Math.random() * 300)}/600/400`,
              created_at: new Date().toISOString(),
              user_id: currentUser.user_id
            };
            
            mockData.content.unshift(newContent);
            resolve(newContent as T);
          } else if (endpoint.includes('/content') && options.method === 'DELETE') {
            // 删除内容
            const contentId = endpoint.split('/').pop();
            if (contentId) {
              const initialLength = mockData.content.length;
              mockData.content = mockData.content.filter(item => item.id !== contentId);
              if (mockData.content.length < initialLength) {
                resolve({ success: true, message: '内容删除成功' } as T);
              } else {
                reject(new Error('内容不存在'));
              }
            } else {
              reject(new Error('无效的内容ID'));
            }
          } else if (endpoint.includes('/content')) {
            // 获取内容
            resolve(mockData.content as T);
          } else if (endpoint.includes('/courses') && options.method === 'DELETE') {
            // 删除课程
            const courseId = endpoint.split('/').pop();
            if (courseId) {
              const initialLength = mockData.courses.length;
              mockData.courses = mockData.courses.filter(item => item.id !== courseId);
              if (mockData.courses.length < initialLength) {
                resolve({ success: true, message: '课程删除成功' } as T);
              } else {
                reject(new Error('课程不存在'));
              }
            } else {
              reject(new Error('无效的课程ID'));
            }
          } else if (endpoint.includes('/courses') && options.method === 'POST') {
            // 创建课程
            if (!options.body) {
              reject(new Error('Invalid request: missing body'));
              return;
            }
            const body = JSON.parse(options.body as string);
            if (!body.title) {
              reject(new Error('Invalid request: missing title'));
              return;
            }
            const currentUserEmail = Object.keys(mockData.tokens).find(email => mockData.tokens[email] === this.getToken());
            const currentUser = currentUserEmail ? mockData.users[currentUserEmail] : mockData.users['explorer@knowledge.art'];
            
            const newCourse = {
              id: Date.now().toString(),
              title: body.title,
              description: body.description || '',
              instructor: body.instructor || currentUser.name,
              instructorAvatar: currentUser.avatar,
              duration: body.duration || '10 hours',
              level: body.level || 'Beginner',
              category: body.category || 'Other',
              image: body.cover || `https://picsum.photos/id/${Math.floor(Math.random() * 300)}/600/400`,
              created_at: new Date().toISOString(),
              user_id: currentUser.user_id
            };
            
            mockData.courses.unshift(newCourse);
            resolve(newCourse as T);
          } else if (endpoint.includes('/courses') && options.method === 'PUT') {
            // 编辑课程
            const courseId = endpoint.split('/').pop();
            if (courseId) {
              const courseIndex = mockData.courses.findIndex(item => item.id === courseId);
              if (courseIndex !== -1) {
                if (!options.body) {
                  reject(new Error('Invalid request: missing body'));
                  return;
                }
                const body = JSON.parse(options.body as string);
                mockData.courses[courseIndex] = {
                  ...mockData.courses[courseIndex],
                  ...body,
                  image: body.cover || mockData.courses[courseIndex].image
                };
                resolve(mockData.courses[courseIndex] as T);
              } else {
                reject(new Error('课程不存在'));
              }
            } else {
              reject(new Error('无效的课程ID'));
            }
          } else if (endpoint.includes('/courses')) {
            // 获取课程
            resolve(mockData.courses as T);
          } else if (endpoint.includes('/users') && options.method === 'DELETE') {
            // 删除用户
            const userId = endpoint.split('/').pop();
            if (userId) {
              // 从mockData.users中删除用户
              const userEmail = Object.keys(mockData.users).find(email => mockData.users[email].user_id === userId);
              if (userEmail) {
                delete mockData.users[userEmail];
                delete mockData.tokens[userEmail];
                delete mockData.mockPasswords[userEmail];
                // 从好友列表中删除
                mockData.friends = mockData.friends.filter(friend => friend.id !== userId);
                resolve({ success: true, message: '用户删除成功' } as T);
              } else {
                reject(new Error('用户不存在'));
              }
            } else {
              reject(new Error('无效的用户ID'));
            }
          } else if (endpoint.includes('/users') && options.method === 'PUT') {
            // 编辑用户
            const userId = endpoint.split('/').pop();
            if (userId) {
              const userEmail = Object.keys(mockData.users).find(email => mockData.users[email].user_id === userId);
              if (userEmail) {
                if (!options.body) {
                  reject(new Error('Invalid request: missing body'));
                  return;
                }
                const body = JSON.parse(options.body as string);
                // 分离密码和其他用户信息
                const { password, ...userData } = body;
                // 更新用户信息
                mockData.users[userEmail] = {
                  ...mockData.users[userEmail],
                  ...userData
                };
                // 如果提供了密码，更新密码
                if (password) {
                  mockData.mockPasswords[userEmail] = password;
                }
                resolve(mockData.users[userEmail] as T);
              } else {
                reject(new Error('用户不存在'));
              }
            } else {
              reject(new Error('无效的用户ID'));
            }
          } else if (endpoint.includes('/content') && options.method === 'PUT') {
            // 编辑内容
            const contentId = endpoint.split('/').pop();
            if (contentId) {
              const contentIndex = mockData.content.findIndex(item => item.id === contentId);
              if (contentIndex !== -1) {
                if (!options.body) {
                  reject(new Error('Invalid request: missing body'));
                  return;
                }
                const body = JSON.parse(options.body as string);
                mockData.content[contentIndex] = {
                  ...mockData.content[contentIndex],
                  ...body,
                  content: body.content || mockData.content[contentIndex].content,
                  image: body.cover || mockData.content[contentIndex].image
                };
                resolve(mockData.content[contentIndex] as T);
              } else {
                reject(new Error('内容不存在'));
              }
            } else {
              reject(new Error('无效的内容ID'));
            }
          } else {
            // 默认返回空对象
            resolve({} as T);
          }
        } catch (error) {
          console.error('Mock data error:', error);
          if (error instanceof SyntaxError) {
            reject(new Error('Invalid request: malformed JSON'));
          } else if (error instanceof Error) {
            reject(error);
          } else {
            reject(new Error('Internal server error'));
          }
        }
      }, 300); // 模拟网络延迟
    });
  }

  // Auth API
  async login(email: string, password: string) {
    return this.request<{
      access_token: string;
      user_id: string;
      email: string;
      name: string;
    }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(email: string, password: string, name: string) {
    return this.request<{
      access_token: string;
      user_id: string;
      email: string;
      name: string;
    }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });
  }

  async logout() {
    this.token = null;
    localStorage.removeItem('token');
    return this.request('/auth/logout', {
      method: 'POST',
    });
  }

  // Message API
  async getMessages() {
    if (USE_MOCK_DATA) {
      return Promise.resolve(mockData.messages);
    }
    return this.request('/messages');
  }

  async getFriends() {
    if (USE_MOCK_DATA) {
      return Promise.resolve(mockData.friends);
    }
    return this.request('/friends');
  }

  async sendMessage(friendId: string, content: string) {
    if (USE_MOCK_DATA) {
      // 获取当前用户信息
      const currentUserEmail = Object.keys(mockData.tokens).find(email => mockData.tokens[email] === this.getToken());
      const currentUser = currentUserEmail ? mockData.users[currentUserEmail] : mockData.users['explorer@knowledge.art'];
      
      const newMessage = {
        id: Date.now().toString(),
        senderId: currentUser.user_id,
        senderName: currentUser.name,
        senderAvatar: currentUser.avatar,
        content,
        timestamp: new Date().toISOString(),
        isRead: false
      };
      mockData.messages.push(newMessage);
      return Promise.resolve(newMessage);
    }
    return this.request('/messages/send', {
      method: 'POST',
      body: JSON.stringify({ friend_id: friendId, content }),
    });
  }

  async addFriend(email: string) {
    if (USE_MOCK_DATA) {
      // 模拟添加好友
      const newFriend = {
        id: Date.now().toString(),
        name: email.split('@')[0],
        avatar: `https://picsum.photos/id/${Math.floor(Math.random() * 300)}/100/100`,
        lastMessage: '新的好友关系已建立',
        lastMessageTime: new Date().toISOString(),
        isOnline: true
      };
      mockData.friends.push(newFriend);
      return Promise.resolve(newFriend);
    }
    return this.request('/friends/add', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  // Data Backup API
  async backupData() {
    if (USE_MOCK_DATA) {
      // 模拟数据备份
      const backupData = {
        users: mockData.users,
        mockPasswords: mockData.mockPasswords,
        tokens: mockData.tokens,
        messages: mockData.messages,
        friends: mockData.friends,
        content: mockData.content,
        courses: mockData.courses,
        hotspots: mockData.hotspots,
        hotChats: mockData.hotChats,
        backupTime: new Date().toISOString()
      };
      // 将备份数据转换为JSON字符串
      const backupString = JSON.stringify(backupData, null, 2);
      // 创建下载链接
      const blob = new Blob([backupString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `backup_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      return Promise.resolve({ success: true, message: '数据备份成功' });
    }
    return this.request('/backup', {
      method: 'GET'
    });
  }

  async restoreData(backupFile: File) {
    if (USE_MOCK_DATA) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const backupData = JSON.parse(e.target?.result as string);
            // 恢复数据
            if (backupData.users) mockData.users = backupData.users;
            if (backupData.mockPasswords) mockData.mockPasswords = backupData.mockPasswords;
            if (backupData.tokens) mockData.tokens = backupData.tokens;
            if (backupData.messages) mockData.messages = backupData.messages;
            if (backupData.friends) mockData.friends = backupData.friends;
            if (backupData.content) mockData.content = backupData.content;
            if (backupData.courses) mockData.courses = backupData.courses;
            if (backupData.hotspots) mockData.hotspots = backupData.hotspots;
            if (backupData.hotChats) mockData.hotChats = backupData.hotChats;
            resolve({ success: true, message: '数据恢复成功' });
          } catch (error) {
            reject(new Error('无效的备份文件'));
          }
        };
        reader.onerror = () => {
          reject(new Error('文件读取失败'));
        };
        reader.readAsText(backupFile);
      });
    }
    return this.request('/restore', {
      method: 'POST',
      body: backupFile
    });
  }

  // Content API
  async getContent() {
    if (USE_MOCK_DATA) {
      return Promise.resolve(mockData.content);
    }
    return this.request('/content');
  }

  async createContent(data: any) {
    if (USE_MOCK_DATA) {
      // 获取当前用户信息
      const currentUserEmail = Object.keys(mockData.tokens).find(email => mockData.tokens[email] === this.getToken());
      const currentUser = currentUserEmail ? mockData.users[currentUserEmail] : mockData.users['explorer@knowledge.art'];
      
      const newContent = {
        id: Date.now().toString(),
        title: data.title,
        content: data.description || '',
        author: currentUser.name,
        authorAvatar: currentUser.avatar,
        views: '0',
        category: data.category || 'Knowledge',
        image: data.cover || `https://picsum.photos/id/${Math.floor(Math.random() * 300)}/600/400`,
        created_at: new Date().toISOString(),
        user_id: currentUser.user_id
      };
      
      mockData.content.unshift(newContent);
      return Promise.resolve(newContent);
    }
    return this.request('/content', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async deleteContent(contentId: string) {
    if (USE_MOCK_DATA) {
      const initialLength = mockData.content.length;
      mockData.content = mockData.content.filter(item => item.id !== contentId);
      if (mockData.content.length < initialLength) {
        return Promise.resolve({ success: true, message: '内容删除成功' });
      } else {
        return Promise.reject(new Error('内容不存在'));
      }
    }
    return this.request(`/content/${contentId}`, {
      method: 'DELETE',
    });
  }

  // Course API
  async getCourses() {
    if (USE_MOCK_DATA) {
      return Promise.resolve(mockData.courses);
    }
    return this.request('/courses');
  }

  async deleteCourse(courseId: string) {
    if (USE_MOCK_DATA) {
      const initialLength = mockData.courses.length;
      mockData.courses = mockData.courses.filter(item => item.id !== courseId);
      if (mockData.courses.length < initialLength) {
        return Promise.resolve({ success: true, message: '课程删除成功' });
      } else {
        return Promise.reject(new Error('课程不存在'));
      }
    }
    return this.request(`/courses/${courseId}`, {
      method: 'DELETE',
    });
  }

  // User API
  async getUsers() {
    if (USE_MOCK_DATA) {
      const users = Object.values(mockData.users).map(user => ({
        id: user.user_id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        created_at: new Date().toISOString()
      }));
      return Promise.resolve(users);
    }
    return this.request('/users');
  }

  // Stats API
  async getStats() {
    if (USE_MOCK_DATA) {
      return Promise.resolve({
        userCount: Object.keys(mockData.users).length,
        contentCount: mockData.content.length,
        courseCount: mockData.courses.length,
        messageCount: mockData.messages.length
      });
    }
    return this.request('/stats');
  }

  // Logs API
  async getLogs() {
    if (USE_MOCK_DATA) {
      return Promise.resolve(mockData.logs);
    }
    return this.request('/logs');
  }

  // Add log entry
  async addLog(action: string, description: string) {
    if (USE_MOCK_DATA) {
      const currentUserEmail = Object.keys(mockData.tokens).find(email => mockData.tokens[email] === this.getToken());
      const currentUser = currentUserEmail ? mockData.users[currentUserEmail] : { name: 'Unknown User' };
      
      const newLog = {
        id: Date.now().toString(),
        user: currentUser.name,
        action,
        description,
        timestamp: new Date().toISOString(),
        ip: '192.168.1.1' // 模拟IP地址
      };
      
      mockData.logs.unshift(newLog);
      return Promise.resolve(newLog);
    }
    return this.request('/logs', {
      method: 'POST',
      body: JSON.stringify({ action, description })
    });
  }
}

export const api = new ApiService();
      method: 'DELETE',
    });
  }

  // Calendar API
  async getUserCalendarEvents(userId: string) {
    return this.request(`/calendar/user/${userId}`);
  }

  async createCalendarEvent(userId: string, day: number, title: string, type: string = 'Personal') {
    return this.request(`/calendar/user/${userId}`, {
      method: 'POST',
      body: JSON.stringify({ day, title, type }),
    });
  }

  async updateCalendarEvent(userId: string, day: number, title: string) {
    return this.request(`/calendar/user/${userId}/${day}`, {
      method: 'PUT',
      body: JSON.stringify({ title }),
    });
  }

  // Checkins API
  async getUserCheckins(userId: string, startDate?: string, endDate?: string) {
    const params = new URLSearchParams();
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);
    return this.request(`/checkins/user/${userId}?${params.toString()}`);
  }

  async createCheckin(userId: string, date: string, type: string, content: string, emoji: string) {
    return this.request(`/checkins/user/${userId}`, {
      method: 'POST',
      body: JSON.stringify({ date, type, content, emoji }),
    });
  }

  // Social Interaction API
  async followUser(userId: string) {
    if (USE_MOCK_DATA) {
      // 模拟关注用户
      return Promise.resolve({ success: true, message: '关注成功' });
    }
    return this.request(`/users/${userId}/follow`, {
      method: 'POST',
    });
  }

  async unfollowUser(userId: string) {
    if (USE_MOCK_DATA) {
      // 模拟取消关注用户
      return Promise.resolve({ success: true, message: '取消关注成功' });
    }
    return this.request(`/users/${userId}/unfollow`, {
      method: 'POST',
    });
  }

  async likeContent(contentId: string) {
    if (USE_MOCK_DATA) {
      // 模拟点赞内容
      return Promise.resolve({ success: true, message: '点赞成功' });
    }
    return this.request(`/content/${contentId}/like`, {
      method: 'POST',
    });
  }

  async unlikeContent(contentId: string) {
    if (USE_MOCK_DATA) {
      // 模拟取消点赞内容
      return Promise.resolve({ success: true, message: '取消点赞成功' });
    }
    return this.request(`/content/${contentId}/unlike`, {
      method: 'POST',
    });
  }

  async sendPrivateMessage(userId: string, content: string) {
    if (USE_MOCK_DATA) {
      // 获取当前用户信息
      const currentUserEmail = Object.keys(mockData.tokens).find(email => mockData.tokens[email] === this.getToken());
      const currentUser = currentUserEmail ? mockData.users[currentUserEmail] : mockData.users['explorer@knowledge.art'];
      
      // 模拟发送私信
      const newMessage = {
        id: Date.now().toString(),
        senderId: currentUser.user_id,
        senderName: currentUser.name,
        senderAvatar: currentUser.avatar,
        receiverId: userId,
        content,
        timestamp: new Date().toISOString(),
        isRead: false
      };
      mockData.messages.push(newMessage);
      return Promise.resolve(newMessage);
    }
    return this.request(`/messages/private`, {
      method: 'POST',
      body: JSON.stringify({ receiver_id: userId, content }),
    });
  }

  async getPrivateMessages(userId: string) {
    if (USE_MOCK_DATA) {
      // 模拟获取私信
      return Promise.resolve(mockData.messages.filter(msg => 
        msg.senderId === userId
      ));
    }
    return this.request(`/messages/private/${userId}`);
  }

  // AI Agent API
  async getAgentResponse(agentCategory: string, userMessage: string, conversationHistory: string[]) {
    if (USE_MOCK_DATA) {
      // 模拟大模型回复
      return new Promise<string>((resolve) => {
        setTimeout(() => {
          const responses: {[key: string]: string[]} = {
            '学习': [
              '根据你的问题，我推荐你先了解基础知识，然后逐步深入。你可以从官方文档开始，配合实践项目来巩固理解。',
              '这个知识点确实比较复杂，让我为你分解一下。首先需要掌握核心概念，然后理解应用场景，最后通过练习来强化记忆。',
              '学习是一个循序渐进的过程，建议你制定一个合理的学习计划，每天坚持练习。遇到问题时不要气馁，多查阅资料和请教他人。',
              '关于这个主题，我有一些学习资源可以推荐给你。同时，建议你尝试将学到的知识应用到实际项目中，这样能更好地理解和记忆。',
              '学习编程最重要的是实践，光看书是不够的。建议你多写代码，多调试，从错误中学习，这样才能真正掌握技能。'
            ],
            '技术': [
              '这个技术问题可以通过以下步骤解决：首先分析问题根源，然后选择合适的解决方案，最后进行测试验证。让我为你详细解释一下。',
              '根据我的经验，这种情况通常是由配置问题或依赖冲突引起的。建议你检查相关配置文件，确保所有依赖项版本兼容。',
              '对于这个技术选型，我建议你考虑项目的具体需求、团队的技术栈以及未来的可扩展性。不同的技术方案各有优缺点，需要根据实际情况权衡。',
              '这个问题的解决方案涉及到几个关键技术点：架构设计、性能优化和安全性考虑。让我为你详细分析一下每个方面。',
              '技术发展日新月异，建议你保持学习的习惯，关注行业动态。同时，建立自己的技术知识体系，这样在面对新问题时才能快速找到解决方案。'
            ],
            '创意': [
              '你的创意想法很有趣！为了进一步发展这个概念，建议你考虑目标用户群体、核心价值主张以及实施可行性。让我帮你一起头脑风暴。',
              '创意的产生往往需要灵感和积累的结合。建议你多观察生活，多接触不同领域的知识，这样能激发更多创意火花。',
              '对于这个创意项目，我建议你先做一个最小可行产品（MVP），测试市场反应，然后根据反馈不断迭代优化。',
              '创意的实现需要考虑很多因素，包括技术可行性、资源限制和时间规划。让我帮你分析一下这个创意的优势和挑战。',
              '创意是无限的，但好的创意需要落地执行。建议你制定一个详细的实施计划，明确每个阶段的目标和任务，这样能提高创意成功的可能性。'
            ],
            '职业': [
              '关于职业规划，建议你先明确自己的兴趣和优势，然后设定短期和长期目标。同时，保持学习和 networking，为职业发展创造更多机会。',
              '简历是求职的敲门砖，建议你突出自己的核心技能和成就，使用具体的数据和案例来证明自己的能力。同时，根据不同的职位调整简历内容。',
              '面试时，除了准备常见问题的回答，建议你研究一下目标公司的文化和业务，这样能展示你对公司的了解和诚意。同时，准备一些问题向面试官提问，表现你的主动性。',
              '职业发展是一个长期的过程，建议你定期评估自己的职业状态，设定新的目标。同时，保持学习的态度，不断提升自己的技能和知识。',
              '在职业发展中，建立良好的人际关系网络非常重要。建议你积极参加行业活动，与同行交流，这样能获得更多的机会和资源。'
            ],
            '健康': [
              '保持健康的生活方式需要从饮食、运动和睡眠三个方面入手。建议你均衡饮食，适量运动，保证充足的睡眠，这样才能维持身体的健康状态。',
              '心理健康同样重要，建议你学会减压，保持积极的心态，与朋友和家人保持良好的沟通。如果感到压力过大，不要犹豫寻求专业帮助。',
              '建立健康的生活习惯需要时间和毅力，建议你从小事做起，逐步改变，不要急于求成。同时，找到适合自己的方式，这样更容易坚持下去。',
              '定期体检是预防疾病的重要手段，建议你根据自己的年龄和身体状况，制定合适的体检计划。早发现、早治疗是保持健康的关键。',
              '健康是一切的基础，建议你将健康管理纳入日常生活，培养良好的生活习惯。记住，健康的身体和心态是事业成功和生活幸福的前提。'
            ],
            '财务': [
              '理财的第一步是建立预算，了解自己的收入和支出情况。建议你记录日常开销，分析消费习惯，找出可以优化的地方。',
              '储蓄是理财的基础，建议你养成定期储蓄的习惯，设置紧急备用金，以应对突发情况。同时，合理配置资产，分散风险。',
              '投资需要根据自己的风险承受能力和投资目标来选择合适的产品。建议你在投资前充分了解相关知识，不要盲目跟风。',
              '财务规划是一个长期的过程，建议你设定明确的财务目标，如购房、教育、退休等，然后制定相应的计划。定期评估和调整财务状况，确保目标的实现。',
              '理财不仅是为了积累财富，更是为了实现财务自由，让金钱为你工作。建议你学习理财知识，培养正确的金钱观念，这样才能更好地管理个人财务。'
            ],
            '其他': [
              '感谢你的提问！我会尽力为你提供有价值的信息和建议。如果你有任何其他问题，随时告诉我。',
              '很高兴能帮到你！希望我的回答对你有所帮助。如果你需要更详细的信息或有其他问题，随时可以问我。',
              '这个问题很有趣，让我思考一下。根据我的理解，我认为可以从以下几个方面来考虑...',
              '感谢你的分享！我很欣赏你的观点。关于这个话题，我也有一些想法想和你交流...',
              '你提出了一个很好的问题，这确实是很多人关心的话题。让我为你详细分析一下，希望能给你一些启发。'
            ]
          };
          
          const categoryResponses = responses[agentCategory] || responses['其他'];
          const randomResponse = categoryResponses[Math.floor(Math.random() * categoryResponses.length)];
          resolve(randomResponse);
        }, 1000);
      });
    }
    
    return this.request('/ai/agent/response', {
      method: 'POST',
      body: JSON.stringify({ agent_category: agentCategory, user_message: userMessage, conversation_history: conversationHistory }),
    });
  }

  // Admin API
  async getUserRole() {
    if (USE_MOCK_DATA) {
      // 在模拟模式下，我们可以根据邮箱判断是否为管理员
      const currentUserEmail = Object.keys(mockData.tokens).find(email => mockData.tokens[email] === this.getToken());
      const isAdmin = currentUserEmail === 'admin@example.com';
      return Promise.resolve({ role: isAdmin ? 'admin' : 'user', user_id: '1' });
    }
    return this.request('/auth/user-role');
  }
}

export const api = new ApiService();
