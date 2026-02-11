-- Database Schema for x² Knowledge Nebula

-- Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    avatar TEXT,
    bio TEXT,
    location TEXT,
    website TEXT,
    social_links JSONB,
    preferences JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Content Table (for Discovery Page)
CREATE TABLE content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    content_body JSONB,
    category TEXT,
    tags TEXT[],
    cover TEXT,
    media_files JSONB,
    author_id UUID REFERENCES users(id),
    views INTEGER DEFAULT 0,
    likes INTEGER DEFAULT 0,
    shares INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    is_published BOOLEAN DEFAULT TRUE,
    published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Content Comments Table
CREATE TABLE content_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_id UUID REFERENCES content(id),
    user_id UUID REFERENCES users(id),
    comment TEXT NOT NULL,
    parent_id UUID REFERENCES content_comments(id),
    likes INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Groups Table
CREATE TABLE groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    cover TEXT,
    icon TEXT,
    category TEXT,
    tags TEXT[],
    settings JSONB,
    members_count INTEGER DEFAULT 0,
    posts_count INTEGER DEFAULT 0,
    is_public BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Group Members Table
CREATE TABLE group_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID REFERENCES groups(id),
    user_id UUID REFERENCES users(id),
    role TEXT DEFAULT 'member',
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_active_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(group_id, user_id)
);

-- Group Posts Table
CREATE TABLE group_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID REFERENCES groups(id),
    user_id UUID REFERENCES users(id),
    title TEXT NOT NULL,
    content JSONB,
    media_files JSONB,
    likes INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Group Post Comments Table
CREATE TABLE group_post_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID REFERENCES group_posts(id),
    user_id UUID REFERENCES users(id),
    comment TEXT NOT NULL,
    parent_id UUID REFERENCES group_post_comments(id),
    likes INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Events Table
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    category TEXT,
    tags TEXT[],
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    location TEXT,
    location_coords JSONB,
    distance FLOAT,
    cover TEXT,
    media_files JSONB,
    organizer_id UUID REFERENCES users(id),
    attendees_count INTEGER DEFAULT 0,
    max_attendees INTEGER,
    is_public BOOLEAN DEFAULT TRUE,
    is_free BOOLEAN DEFAULT TRUE,
    price DECIMAL(10, 2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Events Table (for booked events)
CREATE TABLE user_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    event_id UUID REFERENCES events(id),
    status TEXT DEFAULT 'registered',
    registered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, event_id)
);

-- Courses Table
CREATE TABLE courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    instructor TEXT,
    instructor_id UUID REFERENCES users(id),
    cover TEXT,
    media_files JSONB,
    category TEXT,
    tags TEXT[],
    level TEXT DEFAULT 'beginner',
    duration INTEGER,
    modules JSONB,
    is_published BOOLEAN DEFAULT TRUE,
    price DECIMAL(10, 2),
    discount_price DECIMAL(10, 2),
    enrolled_count INTEGER DEFAULT 0,
    rating DECIMAL(3, 2),
    reviews_count INTEGER DEFAULT 0,
    published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Course Modules Table
CREATE TABLE course_modules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID REFERENCES courses(id),
    title TEXT NOT NULL,
    description TEXT,
    order_index INTEGER DEFAULT 0,
    lessons JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Courses Table (for learning progress)
CREATE TABLE user_courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    course_id UUID REFERENCES courses(id),
    progress INTEGER DEFAULT 0,
    completed BOOLEAN DEFAULT FALSE,
    is_purchased BOOLEAN DEFAULT TRUE,
    purchase_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    last_accessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, course_id)
);

-- Checkins Table
CREATE TABLE checkins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    date TEXT NOT NULL,
    type TEXT NOT NULL,
    content TEXT,
    emoji TEXT,
    mood INTEGER,
    activities JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Calendar Events Table
CREATE TABLE calendar_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    title TEXT NOT NULL,
    description TEXT,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    type TEXT,
    location TEXT,
    is_all_day BOOLEAN DEFAULT FALSE,
    recurrence TEXT,
    reminders JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Heatmap Data Table
CREATE TABLE heatmap_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    date DATE NOT NULL,
    level INTEGER DEFAULT 0,
    activities TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, date)
);

-- User Preferences Table
CREATE TABLE user_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    preferences JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- User Notifications Table
CREATE TABLE user_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    data JSONB,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    read_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_created_at ON users(created_at);

CREATE INDEX idx_content_category ON content(category);
CREATE INDEX idx_content_author_id ON content(author_id);
CREATE INDEX idx_content_published_at ON content(published_at);
CREATE INDEX idx_content_is_published ON content(is_published);
CREATE INDEX idx_content_tags ON content USING GIN (tags);

CREATE INDEX idx_content_comments_content_id ON content_comments(content_id);
CREATE INDEX idx_content_comments_user_id ON content_comments(user_id);

CREATE INDEX idx_groups_category ON groups(category);
CREATE INDEX idx_groups_members_count ON groups(members_count);
CREATE INDEX idx_groups_is_public ON groups(is_public);
CREATE INDEX idx_groups_tags ON groups USING GIN (tags);

CREATE INDEX idx_group_members_group_id ON group_members(group_id);
CREATE INDEX idx_group_members_user_id ON group_members(user_id);
CREATE INDEX idx_group_members_role ON group_members(role);

CREATE INDEX idx_group_posts_group_id ON group_posts(group_id);
CREATE INDEX idx_group_posts_user_id ON group_posts(user_id);

CREATE INDEX idx_group_post_comments_post_id ON group_post_comments(post_id);
CREATE INDEX idx_group_post_comments_user_id ON group_post_comments(user_id);

CREATE INDEX idx_events_category ON events(category);
CREATE INDEX idx_events_start_date ON events(start_date);
CREATE INDEX idx_events_is_public ON events(is_public);
CREATE INDEX idx_events_tags ON events USING GIN (tags);

CREATE INDEX idx_user_events_user_id ON user_events(user_id);
CREATE INDEX idx_user_events_event_id ON user_events(event_id);
CREATE INDEX idx_user_events_status ON user_events(status);

CREATE INDEX idx_courses_category ON courses(category);
CREATE INDEX idx_courses_instructor_id ON courses(instructor_id);
CREATE INDEX idx_courses_is_published ON courses(is_published);
CREATE INDEX idx_courses_price ON courses(price);
CREATE INDEX idx_courses_rating ON courses(rating);
CREATE INDEX idx_courses_tags ON courses USING GIN (tags);

CREATE INDEX idx_course_modules_course_id ON course_modules(course_id);
CREATE INDEX idx_course_modules_order_index ON course_modules(order_index);

CREATE INDEX idx_user_courses_user_id ON user_courses(user_id);
CREATE INDEX idx_user_courses_course_id ON user_courses(course_id);
CREATE INDEX idx_user_courses_progress ON user_courses(progress);
CREATE INDEX idx_user_courses_completed ON user_courses(completed);

CREATE INDEX idx_checkins_user_id ON checkins(user_id);
CREATE INDEX idx_checkins_date ON checkins(date);
CREATE INDEX idx_checkins_type ON checkins(type);

CREATE INDEX idx_calendar_events_user_id ON calendar_events(user_id);
CREATE INDEX idx_calendar_events_start_time ON calendar_events(start_time);
CREATE INDEX idx_calendar_events_end_time ON calendar_events(end_time);

CREATE INDEX idx_heatmap_data_user_id ON heatmap_data(user_id);
CREATE INDEX idx_heatmap_data_date ON heatmap_data(date);

CREATE INDEX idx_user_preferences_user_id ON user_preferences(user_id);

CREATE INDEX idx_user_notifications_user_id ON user_notifications(user_id);
CREATE INDEX idx_user_notifications_is_read ON user_notifications(is_read);
CREATE INDEX idx_user_notifications_created_at ON user_notifications(created_at);

-- Create foreign key constraints with cascade delete
ALTER TABLE content_comments ADD CONSTRAINT fk_content_comments_content_id FOREIGN KEY (content_id) REFERENCES content(id) ON DELETE CASCADE;
ALTER TABLE group_members ADD CONSTRAINT fk_group_members_group_id FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE;
ALTER TABLE group_posts ADD CONSTRAINT fk_group_posts_group_id FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE;
ALTER TABLE group_post_comments ADD CONSTRAINT fk_group_post_comments_post_id FOREIGN KEY (post_id) REFERENCES group_posts(id) ON DELETE CASCADE;
ALTER TABLE user_events ADD CONSTRAINT fk_user_events_event_id FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE;
ALTER TABLE user_courses ADD CONSTRAINT fk_user_courses_course_id FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE;
ALTER TABLE course_modules ADD CONSTRAINT fk_course_modules_course_id FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE;

-- Create triggers for automatic updated_at timestamps
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_timestamp
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE PROCEDURE update_timestamp();

CREATE TRIGGER update_content_timestamp
BEFORE UPDATE ON content
FOR EACH ROW
EXECUTE PROCEDURE update_timestamp();

CREATE TRIGGER update_content_comments_timestamp
BEFORE UPDATE ON content_comments
FOR EACH ROW
EXECUTE PROCEDURE update_timestamp();

CREATE TRIGGER update_groups_timestamp
BEFORE UPDATE ON groups
FOR EACH ROW
EXECUTE PROCEDURE update_timestamp();

CREATE TRIGGER update_group_members_timestamp
BEFORE UPDATE ON group_members
FOR EACH ROW
EXECUTE PROCEDURE update_timestamp();

CREATE TRIGGER update_group_posts_timestamp
BEFORE UPDATE ON group_posts
FOR EACH ROW
EXECUTE PROCEDURE update_timestamp();

CREATE TRIGGER update_group_post_comments_timestamp
BEFORE UPDATE ON group_post_comments
FOR EACH ROW
EXECUTE PROCEDURE update_timestamp();

CREATE TRIGGER update_events_timestamp
BEFORE UPDATE ON events
FOR EACH ROW
EXECUTE PROCEDURE update_timestamp();

CREATE TRIGGER update_user_events_timestamp
BEFORE UPDATE ON user_events
FOR EACH ROW
EXECUTE PROCEDURE update_timestamp();

CREATE TRIGGER update_courses_timestamp
BEFORE UPDATE ON courses
FOR EACH ROW
EXECUTE PROCEDURE update_timestamp();

CREATE TRIGGER update_course_modules_timestamp
BEFORE UPDATE ON course_modules
FOR EACH ROW
EXECUTE PROCEDURE update_timestamp();

CREATE TRIGGER update_user_courses_timestamp
BEFORE UPDATE ON user_courses
FOR EACH ROW
EXECUTE PROCEDURE update_timestamp();

CREATE TRIGGER update_calendar_events_timestamp
BEFORE UPDATE ON calendar_events
FOR EACH ROW
EXECUTE PROCEDURE update_timestamp();

CREATE TRIGGER update_heatmap_data_timestamp
BEFORE UPDATE ON heatmap_data
FOR EACH ROW
EXECUTE PROCEDURE update_timestamp();

CREATE TRIGGER update_user_preferences_timestamp
BEFORE UPDATE ON user_preferences
FOR EACH ROW
EXECUTE PROCEDURE update_timestamp();
