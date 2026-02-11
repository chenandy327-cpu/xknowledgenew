// API Service for x² Knowledge Nebula

const API_BASE_URL = 'http://localhost:8000/api';

interface ApiResponse<T> {
  data: T;
  error?: string;
}

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
