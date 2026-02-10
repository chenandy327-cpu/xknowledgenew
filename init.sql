-- 创建用户表
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    avatar TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建内容表（用于发现页面的热点话题和热门聊天）
CREATE TABLE IF NOT EXISTS content (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    content TEXT,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建群组表
CREATE TABLE IF NOT EXISTS groups (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    members_count INTEGER DEFAULT 0,
    icon TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建群组成员表
CREATE TABLE IF NOT EXISTS group_members (
    id TEXT PRIMARY KEY,
    group_id TEXT REFERENCES groups(id) ON DELETE CASCADE,
    user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
    is_admin BOOLEAN DEFAULT false,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(group_id, user_id)
);

-- 创建活动表
CREATE TABLE IF NOT EXISTS events (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT,
    date TEXT,
    cover TEXT,
    dist FLOAT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建用户活动预约表
CREATE TABLE IF NOT EXISTS user_events (
    id TEXT PRIMARY KEY,
    user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
    event_id TEXT REFERENCES events(id) ON DELETE CASCADE,
    booked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, event_id)
);

-- 创建课程表
CREATE TABLE IF NOT EXISTS courses (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    instructor TEXT,
    cover TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建用户课程表
CREATE TABLE IF NOT EXISTS user_courses (
    id TEXT PRIMARY KEY,
    user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
    course_id TEXT REFERENCES courses(id) ON DELETE CASCADE,
    progress INTEGER DEFAULT 0,
    completed BOOLEAN DEFAULT false,
    completed_at TIMESTAMP WITH TIME ZONE,
    enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, course_id)
);

-- 创建日历事件表
CREATE TABLE IF NOT EXISTS calendar_events (
    id TEXT PRIMARY KEY,
    user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
    day INTEGER NOT NULL,
    title TEXT NOT NULL,
    type TEXT DEFAULT 'Personal',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, day)
);

-- 创建打卡表
CREATE TABLE IF NOT EXISTS checkins (
    id TEXT PRIMARY KEY,
    user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
    date TEXT NOT NULL,
    type TEXT NOT NULL,
    content TEXT,
    emoji TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, date)
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_groups_members_count ON groups(members_count DESC);
CREATE INDEX IF NOT EXISTS idx_events_category ON events(category);
CREATE INDEX IF NOT EXISTS idx_user_events_user_id ON user_events(user_id);
CREATE INDEX IF NOT EXISTS idx_user_courses_user_id ON user_courses(user_id);
CREATE INDEX IF NOT EXISTS idx_calendar_events_user_id ON calendar_events(user_id);
CREATE INDEX IF NOT EXISTS idx_checkins_user_id ON checkins(user_id);

-- 插入一些示例数据
-- 示例用户
INSERT INTO users (id, email, name, avatar) VALUES
('1', 'explorer@knowledge.art', '知识探索者', 'https://picsum.photos/id/100/100/100'),
('2', 'learner@example.com', '学习者', 'https://picsum.photos/id/101/100/100')
ON CONFLICT (id) DO NOTHING;

-- 示例群组
INSERT INTO groups (id, name, members_count, icon) VALUES
('1', '量子计算研讨会', 1200, '⚡'),
('2', '生成式艺术实验室', 840, '🎨'),
('3', '现代哲学沙龙', 3100, '🏛️')
ON CONFLICT (id) DO NOTHING;

-- 示例群组成员
INSERT INTO group_members (id, group_id, user_id, is_admin) VALUES
('1', '1', '1', true),
('2', '2', '1', false),
('3', '3', '1', false),
('4', '1', '2', false)
ON CONFLICT (group_id, user_id) DO NOTHING;

-- 示例活动
INSERT INTO events (id, title, category, date, cover, dist) VALUES
('1', 'x²年度跨界知识论坛', '学术会议', '11月11日', 'https://picsum.photos/id/111/400/300', 1.2),
('2', '"数字之境"光影艺术展', '艺术展览', '11月15日', 'https://picsum.photos/id/122/400/300', 3.5),
('3', '独立创作者交流周', '同城聚会', '11月20日', 'https://picsum.photos/id/133/400/300', 0.8)
ON CONFLICT (id) DO NOTHING;

-- 示例课程
INSERT INTO courses (id, title, instructor, cover) VALUES
('1', '量化分析进阶：模型与风控', 'Dr. Alan Chen', 'https://picsum.photos/id/180/400/300'),
('2', 'UI/UX 深度思维体系', 'Sarah Wang', 'https://picsum.photos/id/181/400/300'),
('3', '现代物理学基础：量子力学', 'Prof. Zhao', 'https://picsum.photos/id/182/400/300')
ON CONFLICT (id) DO NOTHING;

-- 示例用户课程
INSERT INTO user_courses (id, user_id, course_id, progress, completed) VALUES
('1', '1', '1', 45, false),
('2', '1', '2', 100, true),
('3', '1', '3', 12, false)
ON CONFLICT (user_id, course_id) DO NOTHING;

-- 示例热点话题内容
INSERT INTO content (id, type, title, content, metadata) VALUES
('1', 'hotspot', '量子计算', '', '{"top": "25%", "left": "30%", "color": "#a855f7"}'),
('2', 'hotspot', '生成式AI', '', '{"top": "45%", "left": "60%", "color": "#7f13ec"}'),
('3', 'hotspot', '神经网络', '', '{"top": "65%", "left": "35%", "color": "#3b82f6"}'),
('4', 'hotspot', '艺术哲学', '', '{"top": "15%", "left": "55%", "color": "#ec4899"}'),
('5', 'hotspot', '数字孪生', '', '{"top": "75%", "left": "55%", "color": "#3b82f6"}'),
('6', 'hotspot', '脑机接口', '', '{"top": "35%", "left": "15%", "color": "#f59e0b"}')
ON CONFLICT (id) DO NOTHING;

-- 示例热门聊天内容
INSERT INTO content (id, type, title, content, metadata) VALUES
('7', 'hot_chat', '数学之美：从几何到拓扑', '探讨数学的美学价值和应用', '{"count": 245, "id": "chat-001"}'),
('8', 'hot_chat', 'AI时代的艺术创作', '人工智能如何改变艺术创作', '{"count": 189, "id": "chat-002"}')
ON CONFLICT (id) DO NOTHING;
