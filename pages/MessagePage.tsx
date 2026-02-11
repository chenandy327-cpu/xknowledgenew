
import React, { useState, useEffect } from 'react';
import { api } from '../src/services/api';

interface Contact {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'offline';
  lastMessage: string;
  lastMessageTime: string;
  unread: boolean;
  type: 'user' | 'agent';
  agentCategory?: string;
}

interface Message {
  id: string;
  contactId: string;
  sender: 'me' | 'other';
  content: string;
  time: string;
  status: 'sent' | 'delivered' | 'read';
  isFavorite?: boolean;
}

interface Notebook {
  id: string;
  title: string;
  createdAt: string;
  messages: string[]; // 消息ID数组
}

interface FriendRequest {
  id: string;
  name: string;
  avatar: string;
  message: string;
  time: string;
}

const MessagePage: React.FC = () => {
  const [activeContact, setActiveContact] = useState<string | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: '1',
      name: '陈婉莹 (AI 研究)',
      avatar: 'https://picsum.photos/id/151/100/100',
      status: 'online',
      lastMessage: '期待你分享更多的学习图谱...',
      lastMessageTime: '14:20',
      unread: false,
      type: 'user'
    },
    {
      id: '2',
      name: '张明 (前端开发)',
      avatar: 'https://picsum.photos/id/152/100/100',
      status: 'offline',
      lastMessage: '代码已经提交，麻烦 review 一下',
      lastMessageTime: '昨天',
      unread: true,
      type: 'user'
    },
    {
      id: '3',
      name: '李华 (产品经理)',
      avatar: 'https://picsum.photos/id/153/100/100',
      status: 'online',
      lastMessage: '下次会议时间确定了吗？',
      lastMessageTime: '10:30',
      unread: false,
      type: 'user'
    },
    {
      id: '4',
      name: '王芳 (UI 设计师)',
      avatar: 'https://picsum.photos/id/154/100/100',
      status: 'offline',
      lastMessage: '设计稿已经更新到 Figma',
      lastMessageTime: '3天前',
      unread: false,
      type: 'user'
    },
    {
      id: '5',
      name: '赵强 (后端开发)',
      avatar: 'https://picsum.photos/id/155/100/100',
      status: 'online',
      lastMessage: 'API 文档已经更新',
      lastMessageTime: '今天',
      unread: true,
      type: 'user'
    },
    // 智能体联系人
    {
      id: 'agent-1',
      name: 'AI 学习助手',
      avatar: 'https://picsum.photos/id/237/100/100',
      status: 'online',
      lastMessage: '你好！我是你的 AI 学习助手，有什么可以帮助你的？',
      lastMessageTime: '今天',
      unread: false,
      type: 'agent',
      agentCategory: '学习'
    },
    {
      id: 'agent-2',
      name: '技术顾问',
      avatar: 'https://picsum.photos/id/238/100/100',
      status: 'online',
      lastMessage: '你好！我是你的技术顾问，有什么技术问题可以问我。',
      lastMessageTime: '今天',
      unread: false,
      type: 'agent',
      agentCategory: '技术'
    },
    {
      id: 'agent-3',
      name: '创意导师',
      avatar: 'https://picsum.photos/id/239/100/100',
      status: 'online',
      lastMessage: '你好！我是你的创意导师，很高兴为你提供创意支持。',
      lastMessageTime: '今天',
      unread: false,
      type: 'agent',
      agentCategory: '创意'
    },
    {
      id: 'agent-4',
      name: '职业规划师',
      avatar: 'https://picsum.photos/id/240/100/100',
      status: 'online',
      lastMessage: '你好！我是你的职业规划师，有什么职业相关的问题可以问我。',
      lastMessageTime: '今天',
      unread: false,
      type: 'agent',
      agentCategory: '职业'
    }
  ]);
  const [favorites, setFavorites] = useState<string[]>([]); // 收藏的消息ID
  const [notebooks, setNotebooks] = useState<Notebook[]>([]); // 笔记本列表
  const [showNotebooks, setShowNotebooks] = useState(false); // 是否显示笔记本
  const [newNotebookTitle, setNewNotebookTitle] = useState(''); // 新笔记本标题
  const [showAddNotebookModal, setShowAddNotebookModal] = useState(false); // 是否显示添加笔记本模态框
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      contactId: '1',
      sender: 'other',
      content: '你好！看了你最近更新的作品集，非常赞同你对生成式设计模块的理解。',
      time: '14:15',
      status: 'read'
    },
    {
      id: '2',
      contactId: '1',
      sender: 'me',
      content: '谢谢陈老师！我也在关注您的研究，收获良多。',
      time: '14:20',
      status: 'read'
    },
    {
      id: '3',
      contactId: '1',
      sender: 'other',
      content: '期待你分享更多的学习图谱，我们可以一起探讨 AI 在设计中的应用。',
      time: '14:25',
      status: 'read'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([
    {
      id: '1',
      name: '刘阳 (数据科学家)',
      avatar: 'https://picsum.photos/id/156/100/100',
      message: '您好，看到您在 AI 领域的研究，希望能加个好友交流。',
      time: '今天 09:30'
    },
    {
      id: '2',
      name: '孙婷 (UX 研究员)',
      avatar: 'https://picsum.photos/id/157/100/100',
      message: '您好，我是孙婷，想和您交流一下用户研究的方法。',
      time: '昨天 16:45'
    }
  ]);
  const [showAddFriendModal, setShowAddFriendModal] = useState(false);
  const [newFriendEmail, setNewFriendEmail] = useState('');
  const [showAddAgentModal, setShowAddAgentModal] = useState(false);
  const [newAgent, setNewAgent] = useState({
    name: '',
    category: '学习',
    description: ''
  });
  const [searchQuery, setSearchQuery] = useState('');

  // 过滤联系人
  const filteredContacts = contacts.filter(contact => 
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 选择联系人
  const selectContact = (contactId: string) => {
    setActiveContact(contactId);
    // 标记为已读
    setContacts(contacts.map(contact => 
      contact.id === contactId ? { ...contact, unread: false } : contact
    ));
  };

  // 发送消息
  const sendMessage = async () => {
    if (inputMessage && activeContact) {
      const newMessage: Message = {
        id: Date.now().toString(),
        contactId: activeContact,
        sender: 'me',
        content: inputMessage,
        time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
        status: 'sent'
      };
      setMessages([...messages, newMessage]);
      setInputMessage('');
      // 更新联系人的最后一条消息
      setContacts(contacts.map(contact => 
        contact.id === activeContact ? {
          ...contact,
          lastMessage: inputMessage,
          lastMessageTime: newMessage.time
        } : contact
      ));

      try {
        // 尝试通过API发送消息
        await api.sendMessage(activeContact, inputMessage);
      } catch (error) {
        console.warn('发送消息失败，使用本地存储:', error);
      }

      // 智能体回复
      if (activeContact) {
        const isAgent = contacts.find(c => c.id === activeContact)?.type === 'agent';
        if (isAgent) {
          const agent = contacts.find(c => c.id === activeContact);
          if (agent?.agentCategory) {
            // 获取历史消息作为上下文
            const historyMessages = messages.filter(msg => msg.contactId === activeContact)
              .map(msg => `${msg.sender === 'me' ? '用户' : '智能体'}: ${msg.content}`);
            
            try {
              // 调用API获取智能体回复
              const replyContent = await api.getAgentResponse(
                agent.agentCategory,
                inputMessage,
                historyMessages
              );
              
              const replyMessage: Message = {
                id: (Date.now() + 1).toString(),
                contactId: activeContact,
                sender: 'other',
                content: replyContent,
                time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
                status: 'delivered'
              };
              setMessages(prevMessages => [...prevMessages, replyMessage]);
              // 更新联系人的最后一条消息
              setContacts(prevContacts => prevContacts.map(contact => 
                contact.id === activeContact ? {
                  ...contact,
                  lastMessage: replyMessage.content,
                  lastMessageTime: replyMessage.time
                } : contact
              ));
            } catch (error) {
              console.error('获取智能体回复失败:', error);
              // 失败时使用默认回复
              const defaultReply = '抱歉，我暂时无法回复你的消息，请稍后再试。';
              const replyMessage: Message = {
                id: (Date.now() + 1).toString(),
                contactId: activeContact,
                sender: 'other',
                content: defaultReply,
                time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
                status: 'delivered'
              };
              setMessages(prevMessages => [...prevMessages, replyMessage]);
              // 更新联系人的最后一条消息
              setContacts(prevContacts => prevContacts.map(contact => 
                contact.id === activeContact ? {
                  ...contact,
                  lastMessage: replyMessage.content,
                  lastMessageTime: replyMessage.time
                } : contact
              ));
            }
          }
        } else {
          // 普通用户回复
          setTimeout(() => {
            const replyContent = '收到你的消息，我会尽快回复。';
            const replyMessage: Message = {
              id: (Date.now() + 1).toString(),
              contactId: activeContact,
              sender: 'other',
              content: replyContent,
              time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
              status: 'delivered'
            };
            setMessages(prevMessages => [...prevMessages, replyMessage]);
            // 更新联系人的最后一条消息
            setContacts(prevMessages => prevMessages.map(contact => 
              contact.id === activeContact ? {
                ...contact,
                lastMessage: replyMessage.content,
                lastMessageTime: replyMessage.time
              } : contact
            ));
          }, 1000);
        }
      }
    }
  };

  // 收藏/取消收藏消息
  const toggleFavorite = (messageId: string) => {
    if (favorites.includes(messageId)) {
      setFavorites(favorites.filter(id => id !== messageId));
    } else {
      setFavorites([...favorites, messageId]);
    }
  };

  // 创建笔记本
  const createNotebook = () => {
    if (newNotebookTitle) {
      const newNotebook: Notebook = {
        id: Date.now().toString(),
        title: newNotebookTitle,
        createdAt: new Date().toISOString(),
        messages: []
      };
      setNotebooks([newNotebook, ...notebooks]);
      setShowAddNotebookModal(false);
      setNewNotebookTitle('');
    }
  };

  // 添加消息到笔记本
  const addMessageToNotebook = (messageId: string, notebookId: string) => {
    setNotebooks(notebooks.map(notebook => 
      notebook.id === notebookId 
        ? { ...notebook, messages: [...notebook.messages, messageId] }
        : notebook
    ));
  };

  // 添加好友
  const addFriend = async () => {
    if (newFriendEmail) {
      try {
        // 尝试通过API添加好友
        const newFriend = await api.addFriend(newFriendEmail);
        if (newFriend) {
          const typedFriend = newFriend as any;
          const newContact: Contact = {
            id: typedFriend.id,
            name: typedFriend.name,
            avatar: typedFriend.avatar,
            status: typedFriend.isOnline ? 'online' : 'offline',
            lastMessage: typedFriend.lastMessage || '',
            lastMessageTime: typedFriend.lastMessageTime || '',
            unread: false,
            type: 'user'
          };
          setContacts([newContact, ...contacts]);
        } else {
          // API调用失败时使用模拟数据
          const newContact: Contact = {
            id: Date.now().toString(),
            name: newFriendEmail.split('@')[0],
            avatar: `https://picsum.photos/id/${Math.floor(Math.random() * 100)}/100/100`,
            status: 'offline',
            lastMessage: '',
            lastMessageTime: '',
            unread: false,
            type: 'user'
          };
          setContacts([newContact, ...contacts]);
        }
      } catch (error) {
        console.warn('添加好友失败，使用模拟数据:', error);
        // API调用失败时使用模拟数据
        const newContact: Contact = {
          id: Date.now().toString(),
          name: newFriendEmail.split('@')[0],
          avatar: `https://picsum.photos/id/${Math.floor(Math.random() * 100)}/100/100`,
          status: 'offline',
          lastMessage: '',
          lastMessageTime: '',
          unread: false,
          type: 'user'
        };
        setContacts([newContact, ...contacts]);
      } finally {
        setShowAddFriendModal(false);
        setNewFriendEmail('');
        // 保存到本地存储
        localStorage.setItem('contacts', JSON.stringify(contacts));
      }
    }
  };

  // 接受好友请求
  const acceptFriendRequest = (requestId: string) => {
    const request = friendRequests.find(r => r.id === requestId);
    if (request) {
      const newContact: Contact = {
        id: Date.now().toString(),
        name: request.name,
        avatar: request.avatar,
        status: 'offline',
        lastMessage: '',
        lastMessageTime: '',
        unread: false,
        type: 'user'
      };
      setContacts([newContact, ...contacts]);
      setFriendRequests(friendRequests.filter(r => r.id !== requestId));
      // 保存到本地存储
      localStorage.setItem('contacts', JSON.stringify([newContact, ...contacts]));
      localStorage.setItem('friendRequests', JSON.stringify(friendRequests.filter(r => r.id !== requestId)));
    }
  };

  // 拒绝好友请求
  const rejectFriendRequest = (requestId: string) => {
    setFriendRequests(friendRequests.filter(r => r.id !== requestId));
    // 保存到本地存储
    localStorage.setItem('friendRequests', JSON.stringify(friendRequests.filter(r => r.id !== requestId)));
  };

  // 添加智能体
  const addAgent = () => {
    if (newAgent.name) {
      const newContact: Contact = {
        id: `agent-${Date.now()}`,
        name: newAgent.name,
        avatar: `https://picsum.photos/id/${Math.floor(Math.random() * 100)}/100/100`,
        status: 'online',
        lastMessage: newAgent.description || '你好！我是你的智能助手，有什么可以帮助你的？',
        lastMessageTime: '今天',
        unread: false,
        type: 'agent',
        agentCategory: newAgent.category
      };
      setContacts([newContact, ...contacts]);
      setShowAddAgentModal(false);
      setNewAgent({ name: '', category: '学习', description: '' });
      // 保存到本地存储
      localStorage.setItem('contacts', JSON.stringify([newContact, ...contacts]));
    }
  };

  // 从API加载数据
  useEffect(() => {
    const loadData = async () => {
      try {
        // 尝试从API加载好友列表
        const friends = await api.getFriends();
        if (friends && Array.isArray(friends)) {
          const formattedContacts = friends.map(friend => ({
            id: friend.id,
            name: friend.name,
            avatar: friend.avatar,
            status: friend.isOnline ? 'online' : 'offline',
            lastMessage: friend.lastMessage || '',
            lastMessageTime: friend.lastMessageTime || '',
            unread: false
          }));
          setContacts(formattedContacts);
        }

        // 尝试从API加载消息
        const messages = await api.getMessages();
        if (messages && Array.isArray(messages)) {
          const formattedMessages = messages.map(msg => ({
            id: msg.id,
            contactId: msg.senderId,
            sender: msg.senderId === '1' ? 'me' : 'other',
            content: msg.content,
            time: new Date(msg.timestamp).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
            status: 'read'
          }));
          setMessages(formattedMessages);
        }
      } catch (error) {
        console.warn('API加载失败，使用本地存储数据:', error);
        // API加载失败时使用本地存储
        const savedContacts = localStorage.getItem('contacts');
        const savedMessages = localStorage.getItem('messages');
        const savedFriendRequests = localStorage.getItem('friendRequests');
        if (savedContacts) {
          setContacts(JSON.parse(savedContacts));
        }
        if (savedMessages) {
          setMessages(JSON.parse(savedMessages));
        }
        if (savedFriendRequests) {
          setFriendRequests(JSON.parse(savedFriendRequests));
        }
      }
    };

    loadData();
  }, []);

  // 保存数据到本地存储
  useEffect(() => {
    localStorage.setItem('contacts', JSON.stringify(contacts));
  }, [contacts]);

  useEffect(() => {
    localStorage.setItem('messages', JSON.stringify(messages));
  }, [messages]);

  // 获取当前联系人的消息
  const currentMessages = activeContact ? messages.filter(msg => msg.contactId === activeContact) : [];

  // 获取当前联系人信息
  const currentContact = activeContact ? contacts.find(contact => contact.id === activeContact) : null;

  return (
    <div className="flex h-screen bg-white dark:bg-zinc-950">
      {/* Contact List */}
      <aside className="w-80 border-r border-primary/5 flex flex-col">
        <div className="p-6 border-b border-primary/5">
          <h1 className="text-2xl font-bold mb-6">消息</h1>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-2 text-slate-400">search</span>
            <input 
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-zinc-900 border-none rounded-xl text-sm" 
              placeholder="搜索对话..." 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        {/* Friend Requests */}
        {friendRequests.length > 0 && (
          <div className="p-4 border-b border-primary/5 bg-primary/5">
            <h3 className="font-bold text-sm mb-3">好友请求 ({friendRequests.length})</h3>
            {friendRequests.map(request => (
              <div key={request.id} className="flex items-center gap-3 mb-3 p-3 bg-white dark:bg-zinc-900 rounded-xl border border-primary/5">
                <img className="w-10 h-10 rounded-full object-cover" src={request.avatar} alt="Request" />
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-xs truncate">{request.name}</h4>
                  <p className="text-[9px] text-slate-500 truncate">{request.message}</p>
                  <p className="text-[8px] text-slate-400">{request.time}</p>
                </div>
                <div className="flex flex-col gap-1">
                  <button 
                    onClick={() => acceptFriendRequest(request.id)}
                    className="w-5 h-5 bg-primary text-white rounded-full flex items-center justify-center text-[8px] hover:scale-110 transition-all"
                    title="接受"
                  >
                    ✓
                  </button>
                  <button 
                    onClick={() => rejectFriendRequest(request.id)}
                    className="w-5 h-5 bg-slate-200 dark:bg-zinc-800 text-slate-600 dark:text-slate-400 rounded-full flex items-center justify-center text-[8px] hover:bg-red-500 hover:text-white transition-all"
                    title="拒绝"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="flex-1 overflow-y-auto no-scrollbar">
          {filteredContacts.map((contact) => (
            <div 
              key={contact.id} 
              className={`p-4 flex items-center gap-4 cursor-pointer hover:bg-primary/5 border-b border-primary/5 ${activeContact === contact.id ? 'bg-primary/5 border-l-4 border-primary' : ''}`}
              onClick={() => selectContact(contact.id)}
            >
              <div className="relative">
                <img className="w-12 h-12 rounded-2xl object-cover" src={contact.avatar} alt="Avatar" />
                <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-zinc-900 ${contact.status === 'online' ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                {contact.type === 'agent' && (
                  <div className="absolute top-0 right-0 w-5 h-5 bg-blue-500 text-white rounded-full border-2 border-white dark:border-zinc-900 flex items-center justify-center text-[8px] font-bold">
                    AI
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm truncate">{contact.name}</h3>
                    {contact.type === 'agent' && contact.agentCategory && (
                      <span className="px-2 py-0.5 bg-primary/10 text-primary text-[8px] rounded-full font-bold">
                        {contact.agentCategory}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400">{contact.lastMessageTime}</span>
                </div>
                <p className={`text-xs truncate ${contact.unread ? 'text-primary font-bold' : 'text-slate-500'}`}>{contact.lastMessage || '暂无消息'}</p>
                {contact.unread && (
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-primary rounded-full"></div>
                )}
              </div>
            </div>
          ))}
        </div>
        
        <div className="p-4 border-t border-primary/5 space-y-3">
          <button 
            onClick={() => setShowAddFriendModal(true)}
            className="w-full py-3 bg-primary text-white rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-primary/20 transition-all"
          >
            + 添加好友
          </button>
          <button 
            onClick={() => setShowAddAgentModal(true)}
            className="w-full py-3 bg-blue-500 text-white rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-blue-200 transition-all"
          >
            + 添加智能体
          </button>
        </div>
      </aside>

      {/* Chat Area */}
      {activeContact && currentContact ? (
        <main className="flex-1 flex flex-col">
          <header className="h-20 px-8 border-b border-primary/5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img className="w-10 h-10 rounded-xl" src={currentContact.avatar} alt="Active Chat" />
                <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-zinc-900 ${
                  currentContact.status === 'online' ? 'bg-emerald-500' : 'bg-slate-300'
                }`}></div>
              </div>
              <div>
                <h2 className="font-bold text-base">{currentContact.name}</h2>
                <p className={`text-[10px] uppercase font-bold tracking-widest ${
                  currentContact.status === 'online' ? 'text-emerald-500' : 'text-slate-400'
                }`}>{currentContact.status === 'online' ? '在线' : '离线'}</p>
              </div>
            </div>
            <div className="flex gap-4">
              <button className="p-2 text-slate-400 hover:text-primary transition-colors"><span className="material-symbols-outlined">call</span></button>
              <button className="p-2 text-slate-400 hover:text-primary transition-colors"><span className="material-symbols-outlined">video_call</span></button>
              <button className="p-2 text-slate-400 hover:text-primary transition-colors"><span className="material-symbols-outlined">more_vert</span></button>
            </div>
          </header>

          <div className="flex-1 p-8 overflow-y-auto no-scrollbar space-y-6">
            {currentMessages.map((message) => (
              <div key={message.id} className={`flex ${message.sender === 'me' ? 'flex-row-reverse' : ''} gap-4 max-w-2xl ${message.sender === 'me' ? 'ml-auto' : 'mr-auto'}`}>
                {message.sender === 'other' && (
                  <img className="w-8 h-8 rounded-xl mt-1 flex-shrink-0" src={currentContact.avatar} alt="Other" />
                )}
                <div className={`p-4 rounded-2xl text-sm leading-relaxed ${message.sender === 'me' ? 'bg-primary text-white rounded-tr-none shadow-lg shadow-primary/20' : 'bg-slate-50 dark:bg-zinc-900 rounded-tl-none border border-primary/5'}`}>
                  {message.content}
                  <div className={`flex justify-between mt-1 text-[9px] ${message.sender === 'me' ? 'text-white/70' : 'text-slate-400'}`}>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => toggleFavorite(message.id)}
                        className={`p-1 rounded-full ${favorites.includes(message.id) ? 'text-yellow-400' : 'text-inherit'}`}
                        title={favorites.includes(message.id) ? '取消收藏' : '收藏消息'}
                      >
                        <span className="material-symbols-outlined text-[12px]">
                          {favorites.includes(message.id) ? 'star' : 'star_outline'}
                        </span>
                      </button>
                      <button 
                        onClick={() => setShowAddNotebookModal(true)}
                        className="p-1 rounded-full text-inherit hover:bg-black/10"
                        title="添加到笔记本"
                      >
                        <span className="material-symbols-outlined text-[12px]">note_add</span>
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>{message.time}</span>
                      {message.sender === 'me' && (
                        <span>
                          {message.status === 'sent' && '✓'}
                          {message.status === 'delivered' && '✓✓'}
                          {message.status === 'read' && '✓✓'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <footer className="p-6 border-t border-primary/5">
            <div className="relative">
              <textarea 
                className="w-full p-4 pr-16 bg-slate-50 dark:bg-zinc-900 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 text-sm resize-none"
                placeholder="输入消息..."
                rows={1}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
              ></textarea>
              <button 
                className="absolute right-3 bottom-3 w-10 h-10 bg-primary text-white rounded-xl shadow-lg flex items-center justify-center hover:scale-110 transition-all"
                onClick={sendMessage}
              >
                <span className="material-symbols-outlined">send</span>
              </button>
            </div>
          </footer>
        </main>
      ) : (
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8">
              <span className="material-symbols-outlined text-6xl text-primary/50">chat</span>
            </div>
            <h2 className="text-2xl font-bold mb-4">选择一个联系人开始聊天</h2>
            <p className="text-slate-500 mb-8">或者添加新的好友</p>
            <button 
              onClick={() => setShowAddFriendModal(true)}
              className="px-8 py-3 bg-primary text-white rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-primary/20 transition-all"
            >
              添加好友
            </button>
          </div>
        </main>
      )}

      {/* Add Friend Modal */}
      {showAddFriendModal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-6 bg-black/60 backdrop-blur-xl animate-in zoom-in-95 duration-300">
          <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-[3rem] p-12 shadow-2xl border border-primary/20">
            <h2 className="text-2xl font-black mb-8 tracking-tighter">添加好友</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">邮箱地址</label>
                <input 
                  type="email"
                  placeholder="输入好友的邮箱地址..."
                  value={newFriendEmail}
                  onChange={(e) => setNewFriendEmail(e.target.value)}
                  className="w-full px-6 py-4 bg-slate-50 dark:bg-zinc-800 rounded-2xl border-none focus:ring-2 focus:ring-primary/50 text-sm font-bold"
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button 
                  onClick={() => setShowAddFriendModal(false)}
                  className="flex-1 py-4 text-slate-400 font-black uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-zinc-800 rounded-2xl transition-all"
                >
                  取消
                </button>
                <button 
                  onClick={addFriend}
                  className="flex-1 py-4 bg-primary text-white font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-primary/30 hover:scale-105 transition-all"
                >
                  发送请求
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Notebook Modal */}
      {showAddNotebookModal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-6 bg-black/60 backdrop-blur-xl animate-in zoom-in-95 duration-300">
          <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-[3rem] p-12 shadow-2xl border border-primary/20">
            <h2 className="text-2xl font-black mb-8 tracking-tighter">创建笔记本</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">笔记本标题</label>
                <input 
                  type="text"
                  placeholder="输入笔记本标题..."
                  value={newNotebookTitle}
                  onChange={(e) => setNewNotebookTitle(e.target.value)}
                  className="w-full px-6 py-4 bg-slate-50 dark:bg-zinc-800 rounded-2xl border-none focus:ring-2 focus:ring-primary/50 text-sm font-bold"
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button 
                  onClick={() => setShowAddNotebookModal(false)}
                  className="flex-1 py-4 text-slate-400 font-black uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-zinc-800 rounded-2xl transition-all"
                >
                  取消
                </button>
                <button 
                  onClick={createNotebook}
                  className="flex-1 py-4 bg-primary text-white font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-primary/30 hover:scale-105 transition-all"
                >
                  创建
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Agent Modal */}
      {showAddAgentModal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-6 bg-black/60 backdrop-blur-xl animate-in zoom-in-95 duration-300">
          <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-[3rem] p-12 shadow-2xl border border-primary/20">
            <h2 className="text-2xl font-black mb-8 tracking-tighter">添加智能体</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">智能体名称</label>
                <input 
                  type="text"
                  placeholder="输入智能体名称..."
                  value={newAgent.name}
                  onChange={(e) => setNewAgent({...newAgent, name: e.target.value})}
                  className="w-full px-6 py-4 bg-slate-50 dark:bg-zinc-800 rounded-2xl border-none focus:ring-2 focus:ring-primary/50 text-sm font-bold"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">智能体领域</label>
                <select 
                  value={newAgent.category}
                  onChange={(e) => setNewAgent({...newAgent, category: e.target.value})}
                  className="w-full px-6 py-4 bg-slate-50 dark:bg-zinc-800 rounded-2xl border-none focus:ring-2 focus:ring-primary/50 text-sm font-bold"
                >
                  <option value="学习">学习</option>
                  <option value="技术">技术</option>
                  <option value="创意">创意</option>
                  <option value="职业">职业</option>
                  <option value="健康">健康</option>
                  <option value="财务">财务</option>
                  <option value="其他">其他</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">智能体描述</label>
                <textarea 
                  placeholder="输入智能体描述..."
                  value={newAgent.description}
                  onChange={(e) => setNewAgent({...newAgent, description: e.target.value})}
                  rows={3}
                  className="w-full px-6 py-4 bg-slate-50 dark:bg-zinc-800 rounded-2xl border-none focus:ring-2 focus:ring-primary/50 text-sm font-bold"
                ></textarea>
              </div>
              <div className="flex gap-4 pt-4">
                <button 
                  onClick={() => setShowAddAgentModal(false)}
                  className="flex-1 py-4 text-slate-400 font-black uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-zinc-800 rounded-2xl transition-all"
                >
                  取消
                </button>
                <button 
                  onClick={addAgent}
                  className="flex-1 py-4 bg-blue-500 text-white font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-blue-30 hover:scale-105 transition-all"
                >
                  添加智能体
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessagePage;
