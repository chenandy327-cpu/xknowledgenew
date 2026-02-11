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
      avatar: 'https://picsum.photos/id/1005/100/100',
      password: 'password'
    }
  },
  tokens: {
    'explorer@knowledge.art': 'mock-token-12345'
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
    return new Promise((resolve) => {
      setTimeout(() => {
        if (endpoint.includes('/auth/login')) {
          const body = JSON.parse(options.body as string);
          const user = mockData.users[body.email];
          if (user && user.password === body.password) {
            resolve({
              access_token: mockData.tokens[body.email],
              user_id: user.user_id,
              email: user.email,
              name: user.name
            } as T);
          } else {
            throw new Error('Invalid credentials');
          }
        } else if (endpoint.includes('/auth/register')) {
          const body = JSON.parse(options.body as string);
          // 检查邮箱是否已存在
          if (mockData.users[body.email]) {
            throw new Error('Email already exists');
          }
          const newUser = {
            user_id: Date.now().toString(),
            email: body.email,
            name: body.name,
            avatar: `https://picsum.photos/id/${Math.floor(Math.random() * 1000)}/100/100`,
            password: body.password
          };
          mockData.users[body.email] = newUser;
          mockData.tokens[body.email] = `mock-token-${Date.now()}`;
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
          const body = JSON.parse(options.body as string);
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
        } else if (endpoint.includes('/content')) {
          // 获取内容
          resolve(mockData.content as T);
        } else {
          // 默认返回空对象
          resolve({} as T);
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
      const newFriend = {
        id: Date.now().toString(),
        name: email.split('@')[0],
        avatar: `https://picsum.photos/id/${Math.floor(Math.random() * 1000)}/100/100`,
        lastMessage: '',
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

  // User API
  async getCurrentUser() {
    return this.request('/users/me');
  }

  async getUser(userId: string) {
    return this.request(`/users/${userId}`);
  }

  async updateCurrentUser(data: {
    name?: string;
    avatar?: string;
  }) {
    return this.request('/users/me', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Content API
  async getContent(category?: string, limit: number = 10, offset: number = 0) {
    if (USE_MOCK_DATA) {
      // 直接返回模拟数据
      let content = [...mockData.content];
      if (category) {
        content = content.filter(item => item.category === category);
      }
      return Promise.resolve(content.slice(offset, offset + limit));
    }
    
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    params.append('limit', limit.toString());
    params.append('offset', offset.toString());
    return this.request(`/content?${params.toString()}`);
  }

  async getHotspots() {
    return this.request('/content/hotspots');
  }

  async getHotChats() {
    return this.request('/content/hot-chats');
  }

  async getContentById(contentId: string) {
    return this.request(`/content/${contentId}`);
  }

  async createContent(data: {
    title: string;
    description?: string;
    category?: string;
    cover?: string;
  }) {
    return this.request('/content', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Groups API
  async getGroups(limit: number = 10, offset: number = 0) {
    return this.request(`/groups?limit=${limit}&offset=${offset}`);
  }

  async getMyGroups() {
    return this.request('/groups/my');
  }

  async getGroupById(groupId: string) {
    return this.request(`/groups/${groupId}`);
  }

  async createGroup(data: {
    name: string;
    description?: string;
    cover?: string;
    icon?: string;
  }) {
    return this.request('/groups', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async joinGroup(groupId: string, userId: string) {
    return this.request(`/groups/${groupId}/members`, {
      method: 'POST',
      body: JSON.stringify({ group_id: groupId, user_id: userId }),
    });
  }

  // Events API
  async getEvents(category?: string, limit: number = 10, offset: number = 0) {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    params.append('limit', limit.toString());
    params.append('offset', offset.toString());
    return this.request(`/events?${params.toString()}`);
  }

  async getMockEvents() {
    return this.request('/events/mock');
  }

  async getEventById(eventId: string) {
    return this.request(`/events/${eventId}`);
  }

  async createEvent(data: {
    title: string;
    category?: string;
    date?: string;
    location?: string;
    distance?: number;
    cover?: string;
  }) {
    return this.request('/events', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async bookEvent(userId: string, eventId: string) {
    return this.request('/events/book', {
      method: 'POST',
      body: JSON.stringify({ user_id: userId, event_id: eventId }),
    });
  }

  // Courses API
  async getCourses(limit: number = 10, offset: number = 0) {
    return this.request(`/courses?limit=${limit}&offset=${offset}`);
  }

  async getMockCourses() {
    return this.request('/courses/mock');
  }

  async getCourseById(courseId: string) {
    return this.request(`/courses/${courseId}`);
  }

  async getUserCourses(userId: string) {
    return this.request(`/courses/user/${userId}`);
  }

  async enrollCourse(userId: string, courseId: string) {
    return this.request('/courses/enroll', {
      method: 'POST',
      body: JSON.stringify({ user_id: userId, course_id: courseId }),
    });
  }

  async updateProgress(userCourseId: string, progress: number, completed: boolean) {
    return this.request(`/courses/progress/${userCourseId}`, {
      method: 'PUT',
      body: JSON.stringify({ progress, completed }),
    });
  }

  async getHeatmapData(userId: string) {
    return this.request(`/courses/heatmap/${userId}`);
  }

  async updateHeatmapData(userId: string, data: number[]) {
    return this.request(`/courses/heatmap/${userId}`, {
      method: 'POST',
      body: JSON.stringify(data),
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
}

export const api = new ApiService();
