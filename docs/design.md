# x² Knowledge Nebula System Design Document

## 1. System Architecture

### 1.1 High-Level Architecture
The x² Knowledge Nebula platform follows a client-server architecture with a clear separation between frontend and backend components:

```
+------------------------+
|        Frontend        |
| React + TypeScript     |
| (Vite Build Tool)       |
+------------------------+
            |
            v
+------------------------+
|         Backend         |
| FastAPI + Python        |
+------------------------+
            |
            v
+------------------------+
|        Database         |
|      Supabase           |
+------------------------+
```

### 1.2 Component Diagram

```
+------------------------+
|  User Interface Layer   |
| - React Components      |
| - Pages                 |
| - Navigation            |
+------------------------+
            |
            v
+------------------------+
|   Frontend Logic Layer  |
| - API Service           |
| - State Management      |
| - Form Validation       |
+------------------------+
            |
            v
+------------------------+
|    Backend API Layer    |
| - Authentication        |
| - Content Management    |
| - Course Management     |
| - User Management       |
| - Social Features       |
+------------------------+
            |
            v
+------------------------+
|   Business Logic Layer  |
| - User Services         |
| - Content Services      |
| - Course Services       |
| - Social Services       |
| - Admin Services        |
+------------------------+
            |
            v
+------------------------+
|    Data Access Layer    |
| - Database Operations   |
| - Data Validation       |
| - Transaction Management|
+------------------------+
            |
            v
+------------------------+
|      Data Storage       |
| - Supabase Database     |
| - File Storage          |
+------------------------+
```

## 2. Frontend Design

### 2.1 Technology Stack
- **Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router
- **State Management**: React Context API + localStorage
- **API Client**: Custom API Service

### 2.2 Key Components

#### 2.2.1 Core Pages
- **LoginPage**: User authentication interface
- **DiscoveryPage**: Home page with content discovery
- **GroupPage**: Social groups and communities
- **LocalPage**: Local content and interactions
- **CoursePage**: Course catalog and enrollment
- **MessagePage**: User messaging system
- **ProfilePage**: User profile management
- **AdminPage**: Administrative dashboard

#### 2.2.2 Reusable Components
- **Sidebar**: Navigation component
- **CreateModal**: Content creation interface
- **Notification**: User feedback system
- **Form components**: Reusable input elements with validation

### 2.3 State Management
The application uses React Context API for global state management:

```typescript
interface AppContextType {
  theme: AppTheme;
  toggleTheme: () => void;
  isLoggedIn: boolean;
  isAdmin: boolean;
  login: () => void;
  logout: () => void;
  checkAdminStatus: () => void;
}
```

### 2.4 API Service
The frontend communicates with the backend through a custom API service:

```typescript
class ApiService {
  private token: string | null = null;

  setToken(token: string): void { /* ... */ }
  getToken(): string | null { /* ... */ }
  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> { /* ... */ }
  private getMockData<T>(endpoint: string, options: RequestInit = {}): Promise<T> { /* ... */ }
  
  // Authentication methods
  async login(email: string, password: string): Promise<any> { /* ... */ }
  async register(email: string, password: string, name: string): Promise<any> { /* ... */ }
  async resetPassword(email: string): Promise<any> { /* ... */ }
  
  // Content methods
  async getContent(): Promise<any[]> { /* ... */ }
  async createContent(data: any): Promise<any> { /* ... */ }
  async updateContent(id: string, data: any): Promise<any> { /* ... */ }
  async deleteContent(id: string): Promise<any> { /* ... */ }
  
  // Course methods
  async getCourses(): Promise<any[]> { /* ... */ }
  async createCourse(data: any): Promise<any> { /* ... */ }
  async updateCourse(id: string, data: any): Promise<any> { /* ... */ }
  async deleteCourse(id: string): Promise<any> { /* ... */ }
  
  // User methods
  async getFriends(): Promise<any[]> { /* ... */ }
  async addFriend(userId: string): Promise<any> { /* ... */ }
  async getUserRole(): Promise<any> { /* ... */ }
  
  // Admin methods
  async getStats(): Promise<any> { /* ... */ }
  async getLogs(): Promise<any[]> { /* ... */ }
  async addLog(action: string, description: string): Promise<any> { /* ... */ }
  
  // Data management
  async backupData(): Promise<any> { /* ... */ }
  async restoreData(backupFile: File): Promise<any> { /* ... */ }
}
```

## 3. Backend Design

### 3.1 Technology Stack
- **Framework**: FastAPI
- **Language**: Python 3.10+
- **Authentication**: JWT
- **Password Hashing**: bcrypt
- **Database**: Supabase (PostgreSQL)
- **CORS**: FastAPI CORS middleware

### 3.2 API Endpoints

#### 3.2.1 Authentication Endpoints
- `POST /api/auth/login`: User login
- `POST /api/auth/register`: User registration
- `POST /api/auth/reset-password`: Password reset
- `GET /api/auth/me`: Get current user

#### 3.2.2 Content Endpoints
- `GET /api/content`: Get content list
- `POST /api/content`: Create new content
- `GET /api/content/{id}`: Get content by ID
- `PUT /api/content/{id}`: Update content
- `DELETE /api/content/{id}`: Delete content

#### 3.2.3 Course Endpoints
- `GET /api/courses`: Get course list
- `POST /api/courses`: Create new course
- `GET /api/courses/{id}`: Get course by ID
- `PUT /api/courses/{id}`: Update course
- `DELETE /api/courses/{id}`: Delete course
- `POST /api/courses/enroll`: Enroll in course
- `GET /api/courses/progress/{id}`: Get course progress
- `PUT /api/courses/progress/{id}`: Update course progress

#### 3.2.4 User Endpoints
- `GET /api/users`: Get user list (admin only)
- `GET /api/users/{id}`: Get user by ID
- `PUT /api/users/{id}`: Update user
- `DELETE /api/users/{id}`: Delete user (admin only)
- `GET /api/users/friends`: Get user friends
- `POST /api/users/friends/{id}`: Add friend
- `GET /api/users/role`: Get user role

#### 3.2.5 Message Endpoints
- `GET /api/messages`: Get messages
- `POST /api/messages`: Send message
- `PUT /api/messages/{id}`: Update message status

#### 3.2.6 Admin Endpoints
- `GET /api/admin/stats`: Get system statistics
- `GET /api/admin/logs`: Get operation logs
- `POST /api/admin/backup`: Create data backup
- `POST /api/admin/restore`: Restore data from backup

### 3.3 Business Logic

#### 3.3.1 Authentication Service
- User registration with password hashing
- JWT token generation and validation
- Password reset functionality
- User role verification

#### 3.3.2 Content Service
- Content creation and validation
- Content retrieval with filtering
- Content update and deletion
- Content view tracking

#### 3.3.3 Course Service
- Course creation and management
- User enrollment processing
- Progress tracking and updates
- Course completion handling

#### 3.3.4 User Service
- User profile management
- Friend relationship handling
- User role management
- User activity tracking

#### 3.3.5 Admin Service
- System statistics aggregation
- Operation log recording
- Data backup and restoration
- User and content moderation

## 4. Database Design

### 4.1 Data Models

#### 4.1.1 User Model
| Field Name | Data Type | Constraints | Description |
|------------|-----------|-------------|-------------|
| `user_id` | `UUID` | `PRIMARY KEY` | Unique user identifier |
| `email` | `VARCHAR(255)` | `UNIQUE NOT NULL` | User email address |
| `name` | `VARCHAR(100)` | `NOT NULL` | User display name |
| `avatar` | `VARCHAR(500)` | | User profile picture URL |
| `password_hash` | `VARCHAR(255)` | `NOT NULL` | Hashed password |
| `role` | `VARCHAR(20)` | `DEFAULT 'user'` | User role (user/admin) |
| `created_at` | `TIMESTAMP` | `DEFAULT NOW()` | Account creation time |
| `updated_at` | `TIMESTAMP` | `DEFAULT NOW()` | Last update time |

#### 4.1.2 Content Model
| Field Name | Data Type | Constraints | Description |
|------------|-----------|-------------|-------------|
| `content_id` | `UUID` | `PRIMARY KEY` | Unique content identifier |
| `title` | `VARCHAR(255)` | `NOT NULL` | Content title |
| `content` | `TEXT` | `NOT NULL` | Content body |
| `author` | `VARCHAR(100)` | `NOT NULL` | Content author |
| `user_id` | `UUID` | `REFERENCES users(user_id)` | Creator user ID |
| `category` | `VARCHAR(50)` | | Content category |
| `image` | `VARCHAR(500)` | | Content image URL |
| `views` | `INTEGER` | `DEFAULT 0` | Content view count |
| `created_at` | `TIMESTAMP` | `DEFAULT NOW()` | Creation time |
| `updated_at` | `TIMESTAMP` | `DEFAULT NOW()` | Last update time |

#### 4.1.3 Course Model
| Field Name | Data Type | Constraints | Description |
|------------|-----------|-------------|-------------|
| `course_id` | `UUID` | `PRIMARY KEY` | Unique course identifier |
| `title` | `VARCHAR(255)` | `NOT NULL` | Course title |
| `description` | `TEXT` | `NOT NULL` | Course description |
| `instructor` | `VARCHAR(100)` | `NOT NULL` | Course instructor |
| `instructor_avatar` | `VARCHAR(500)` | | Instructor avatar URL |
| `user_id` | `UUID` | `REFERENCES users(user_id)` | Creator user ID |
| `duration` | `VARCHAR(50)` | `NOT NULL` | Course duration |
| `level` | `VARCHAR(20)` | `NOT NULL` | Course difficulty level |
| `category` | `VARCHAR(50)` | `NOT NULL` | Course category |
| `image` | `VARCHAR(500)` | | Course image URL |
| `created_at` | `TIMESTAMP` | `DEFAULT NOW()` | Creation time |
| `updated_at` | `TIMESTAMP` | `DEFAULT NOW()` | Last update time |

#### 4.1.4 UserCourse Model
| Field Name | Data Type | Constraints | Description |
|------------|-----------|-------------|-------------|
| `user_course_id` | `UUID` | `PRIMARY KEY` | Unique user-course identifier |
| `user_id` | `UUID` | `REFERENCES users(user_id)` | User ID |
| `course_id` | `UUID` | `REFERENCES courses(course_id)` | Course ID |
| `progress` | `INTEGER` | `DEFAULT 0` | Progress percentage |
| `completed` | `BOOLEAN` | `DEFAULT FALSE` | Completion status |
| `enrolled_at` | `TIMESTAMP` | `DEFAULT NOW()` | Enrollment time |
| `updated_at` | `TIMESTAMP` | `DEFAULT NOW()` | Last update time |

#### 4.1.5 Message Model
| Field Name | Data Type | Constraints | Description |
|------------|-----------|-------------|-------------|
| `message_id` | `UUID` | `PRIMARY KEY` | Unique message identifier |
| `sender_id` | `UUID` | `REFERENCES users(user_id)` | Sender user ID |
| `receiver_id` | `UUID` | `REFERENCES users(user_id)` | Receiver user ID |
| `content` | `TEXT` | `NOT NULL` | Message content |
| `is_read` | `BOOLEAN` | `DEFAULT FALSE` | Read status |
| `created_at` | `TIMESTAMP` | `DEFAULT NOW()` | Creation time |

#### 4.1.6 Friend Model
| Field Name | Data Type | Constraints | Description |
|------------|-----------|-------------|-------------|
| `friendship_id` | `UUID` | `PRIMARY KEY` | Unique friendship identifier |
| `user_id` | `UUID` | `REFERENCES users(user_id)` | First user ID |
| `friend_id` | `UUID` | `REFERENCES users(user_id)` | Second user ID |
| `status` | `VARCHAR(20)` | `DEFAULT 'pending'` | Friendship status |
| `created_at` | `TIMESTAMP` | `DEFAULT NOW()` | Creation time |
| `updated_at` | `TIMESTAMP` | `DEFAULT NOW()` | Last update time |

#### 4.1.7 Log Model
| Field Name | Data Type | Constraints | Description |
|------------|-----------|-------------|-------------|
| `log_id` | `UUID` | `PRIMARY KEY` | Unique log identifier |
| `user_id` | `UUID` | `REFERENCES users(user_id)` | User ID |
| `action` | `VARCHAR(50)` | `NOT NULL` | Action type |
| `description` | `TEXT` | `NOT NULL` | Action description |
| `ip_address` | `VARCHAR(50)` | | User IP address |
| `created_at` | `TIMESTAMP` | `DEFAULT NOW()` | Creation time |

### 4.2 Database Relationships

```
User ────────────┐
  │              │
  │ 1:N          │ 1:N
  ▼              ▼
Content       Course
  │              │
  │ N:1          │ N:1
  └──────────────┘
                 │
                 │ 1:N
                 ▼
           UserCourse
                 │
                 │ N:1
                 └───┐
                    │
User ───────────────┤
  │                 │
  │ N:1             │
  ▼                 │
Message ────────────┤
  │                 │
  │ N:1             │
  └──────────────┐  │
                 │  │
Friend ──────────┘  │
  │                 │
  │ N:1             │
  └─────────────────┘
```

## 5. Security Design

### 5.1 Authentication
- **JWT Tokens**: Used for secure authentication
- **Password Hashing**: bcrypt algorithm for password storage
- **Token Expiration**: Access tokens with limited lifespan
- **Secure Storage**: Tokens stored in localStorage with secure flags

### 5.2 Authorization
- **Role-Based Access Control**: Different permissions based on user roles
- **Route Protection**: Protected routes for authenticated users
- **Admin-Only Endpoints**: Restricted access for administrative functions

### 5.3 Data Protection
- **HTTPS**: All communications over secure HTTPS
- **Input Validation**: Server-side validation of all user inputs
- **SQL Injection Prevention**: Parameterized queries and ORM usage
- **Cross-Site Scripting (XSS) Protection**: Input sanitization and output encoding
- **Cross-Site Request Forgery (CSRF) Protection**: CSRF tokens for state-changing requests

### 5.4 Rate Limiting
- **API Rate Limiting**: Prevent brute force attacks and DoS attacks
- **Login Attempt Limiting**: Restrict failed login attempts
- **Password Reset Limiting**: Prevent abuse of password reset functionality

## 6. Performance Optimization

### 6.1 Frontend Optimization
- **Code Splitting**: Lazy loading of components with React.lazy
- **Image Optimization**: Responsive images and lazy loading
- **Caching**: Browser caching of static assets
- **Bundle Size Optimization**: Tree shaking and code minification
- **State Management Optimization**: Efficient use of context and memoization

### 6.2 Backend Optimization
- **Database Indexing**: Proper indexing of frequently queried fields
- **Query Optimization**: Efficient database queries
- **Caching**: Server-side caching of frequently accessed data
- **Connection Pooling**: Optimized database connections
- **Asynchronous Processing**: Non-blocking I/O operations

### 6.3 Scalability
- **Horizontal Scaling**: Ability to add more servers
- **Load Balancing**: Distributing traffic across multiple servers
- **Database Sharding**: Partitioning data across multiple databases
- **Stateless Architecture**: Server-side state minimized

## 7. Deployment Strategy

### 7.1 Development Environment
- **Local Development**: Docker containers for consistent environment
- **Hot Reloading**: Real-time code changes
- **Mock Data**: For frontend development without backend

### 7.2 Production Environment
- **Containerization**: Docker for consistent deployment
- **Orchestration**: Kubernetes for scaling
- **CI/CD Pipeline**: Automated testing and deployment
- **Monitoring**: Logging and performance monitoring
- **Backup Strategy**: Regular database backups

### 7.3 Deployment Steps
1. Build frontend assets
2. Deploy backend API
3. Configure database connections
4. Set up environment variables
5. Deploy static assets to CDN
6. Run database migrations
7. Start services
8. Run health checks

## 8. Testing Strategy

### 8.1 Frontend Testing
- **Unit Tests**: Component testing with Jest
- **Integration Tests**: Testing component interactions
- **End-to-End Tests**: User flow testing with Cypress
- **Performance Testing**: Load time and responsiveness

### 8.2 Backend Testing
- **Unit Tests**: API endpoint testing
- **Integration Tests**: Service layer testing
- **Database Tests**: Data integrity and query testing
- **Security Tests**: Vulnerability scanning

### 8.3 Test Coverage
- **Code Coverage**: Minimum 80% coverage
- **Critical Path Testing**: All core user flows tested
- **Edge Case Testing**: Error handling and boundary conditions

## 9. Monitoring and Maintenance

### 9.1 Logging
- **Application Logs**: Request/response logging
- **Error Logs**: Exception and error tracking
- **Audit Logs**: User actions and system changes
- **Performance Logs**: Response times and resource usage

### 9.2 Monitoring
- **Uptime Monitoring**: Service availability
- **Performance Monitoring**: Response times and throughput
- **Error Monitoring**: Exception tracking
- **Resource Monitoring**: CPU, memory, and disk usage

### 9.3 Maintenance
- **Regular Updates**: Security patches and dependency updates
- **Database Maintenance**: Index optimization and cleanup
- **Backup Verification**: Regular backup testing
- **Performance Tuning**: Ongoing optimization

## 10. Conclusion

The x² Knowledge Nebula system design provides a comprehensive architecture for a knowledge sharing and social networking platform. The design incorporates modern technologies and best practices to ensure a secure, scalable, and user-friendly application. The system is designed to meet the functional and non-functional requirements outlined in the requirements document, with a focus on performance, security, and maintainability.

### 10.1 Key Design Decisions
- **Technology Stack**: React + TypeScript frontend with FastAPI backend
- **Database**: Supabase for managed database services
- **Authentication**: JWT tokens for secure authentication
- **Architecture**: Clean separation of concerns with layered design
- **Scalability**: Horizontal scaling capabilities
- **Security**: Multi-layered security approach

### 10.2 Future Enhancements
- **Real-time Features**: WebSocket integration for real-time updates
- **Advanced Search**: Full-text search capabilities
- **Recommendation Engine**: Personalized content recommendations
- **Mobile Applications**: Native mobile apps
- **Third-party Integrations**: Social media and learning platform integrations
- **Analytics Dashboard**: Advanced user and content analytics
