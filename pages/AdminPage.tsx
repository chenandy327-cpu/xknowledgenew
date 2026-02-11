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
}

const AdminPage: React.FC = () => {
  const { theme } = useApp();
  const [activeTab, setActiveTab] = useState<'users' | 'content' | 'system'>('users');
  const [users, setUsers] = useState<User[]>([]);
  const [contents, setContents] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalContent: 0,
    totalGroups: 0,
    dailyActiveUsers: 0
  });

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

      // 获取用户列表（模拟数据）
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

      // 获取内容列表（模拟数据）
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
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        // 在实际应用中，这里会调用API删除用户
        setUsers(users.filter(user => user.id !== userId));
        alert('User deleted successfully');
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Failed to delete user');
      }
    }
  };

  const deleteContent = async (contentId: string) => {
    if (window.confirm('Are you sure you want to delete this content?')) {
      try {
        // 在实际应用中，这里会调用API删除内容
        setContents(contents.filter(content => content.id !== contentId));
        alert('Content deleted successfully');
      } catch (error) {
        console.error('Error deleting content:', error);
        alert('Failed to delete content');
      }
    }
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Manage users, content, and system settings
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className={`p-6 rounded-xl shadow ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="text-3xl font-bold text-blue-500">{stats.totalUsers}</div>
            <div className={`mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Total Users</div>
          </div>
          <div className={`p-6 rounded-xl shadow ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="text-3xl font-bold text-green-500">{stats.totalContent}</div>
            <div className={`mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Total Content</div>
          </div>
          <div className={`p-6 rounded-xl shadow ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="text-3xl font-bold text-purple-500">{stats.totalGroups}</div>
            <div className={`mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Total Groups</div>
          </div>
          <div className={`p-6 rounded-xl shadow ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="text-3xl font-bold text-yellow-500">{stats.dailyActiveUsers}</div>
            <div className={`mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Daily Active Users</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b mb-6">
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'users' ? 'border-b-2 border-blue-500 text-blue-500' : theme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-900'}`}
            onClick={() => setActiveTab('users')}
          >
            Users Management
          </button>
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'content' ? 'border-b-2 border-blue-500 text-blue-500' : theme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-900'}`}
            onClick={() => setActiveTab('content')}
          >
            Content Management
          </button>
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'system' ? 'border-b-2 border-blue-500 text-blue-500' : theme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-900'}`}
            onClick={() => setActiveTab('system')}
          >
            System Settings
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'users' && (
          <div className={`rounded-xl shadow ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} overflow-hidden`}>
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">User Management</h2>
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
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Join Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
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
                              className="text-red-600 hover:text-red-900 mr-4"
                            >
                              Delete
                            </button>
                            <button className="text-blue-600 hover:text-blue-900">
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

        {activeTab === 'content' && (
          <div className={`rounded-xl shadow ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} overflow-hidden`}>
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Content Management</h2>
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
                            <button className="text-blue-600 hover:text-blue-900">
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

        {activeTab === 'system' && (
          <div className={`rounded-xl shadow ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} overflow-hidden`}>
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">System Settings</h2>
              <div className="space-y-4">
                <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <h3 className="font-medium mb-2">General Settings</h3>
                  <div className="space-y-2">
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
                  </div>
                </div>
                
                <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <h3 className="font-medium mb-2">Security Settings</h3>
                  <div className="space-y-2">
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
                  </div>
                </div>
                
                <div className="pt-4">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 mr-2">
                    Save Changes
                  </button>
                  <button className={`px-4 py-2 rounded border ${theme === 'dark' ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-100'}`}>
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;