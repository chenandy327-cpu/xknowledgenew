
export enum AppTheme {
  LIGHT = 'light',
  DARK = 'dark'
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  isFollowing?: boolean;
  isFriend?: boolean;
}

export interface Course {
  id: string;
  title: string;
  instructor: string;
  progress: number;
  completed: boolean;
  rating: number;
  comments: number;
  cover: string;
}

export interface EventActivity {
  id: string;
  title: string;
  category: string;
  date: string;
  location: string;
  distance: number;
  cover: string;
}

export interface CheckIn {
  date: string; // ISO string
  type: 'movie' | 'book' | 'show' | 'music' | 'event' | 'diary' | 'mood';
  content: string;
  emoji: string;
}
