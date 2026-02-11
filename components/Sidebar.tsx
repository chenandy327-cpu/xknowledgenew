
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useApp } from '../App';

interface SidebarProps {
  onOpenCreate: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onOpenCreate }) => {
  const { toggleTheme, theme, isAdmin } = useApp();

  const navItems = [
    { to: '/', icon: 'explore', label: '发现' },
    { to: '/groups', icon: 'groups', label: '小组' },
    { to: '/local', icon: 'location_on', label: '同城' },
    { to: '/courses', icon: 'school', label: '课程' },
    { to: '/messages', icon: 'chat_bubble', label: '消息' },
    { to: '/profile', icon: 'person', label: '个人' },
  ];

  const adminNavItems = [
    { to: '/admin', icon: 'admin_panel_settings', label: '管理后台' },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-20 lg:w-64 bg-white dark:bg-zinc-900 border-r border-primary/10 flex flex-col z-50 transition-all duration-300">
      <div className="p-6 lg:p-8 flex justify-center lg:justify-start">
        <div className="flex items-center gap-3 text-primary font-bold text-2xl">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">x²</div>
          <span className="hidden lg:block tracking-tight">Space</span>
        </div>
      </div>

      <nav className="flex-1 px-3 lg:px-4 space-y-2 overflow-y-auto no-scrollbar">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center justify-center lg:justify-start gap-4 px-4 py-3 rounded-xl transition-all group ${
                isActive
                  ? 'bg-primary text-white shadow-lg shadow-primary/20'
                  : 'text-slate-500 hover:bg-primary/5 hover:text-primary'
              }`
            }
          >
            <span className="material-symbols-outlined">{item.icon}</span>
            <span className="hidden lg:block font-medium">{item.label}</span>
          </NavLink>
        ))}
        {isAdmin && adminNavItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center justify-center lg:justify-start gap-4 px-4 py-3 rounded-xl transition-all group ${
                isActive
                  ? 'bg-primary text-white shadow-lg shadow-primary/20'
                  : 'text-slate-500 hover:bg-primary/5 hover:text-primary'
              }`
            }
          >
            <span className="material-symbols-outlined">{item.icon}</span>
            <span className="hidden lg:block font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-primary/5 space-y-4">
        <button
          onClick={toggleTheme}
          className="w-full flex items-center justify-center lg:justify-start gap-4 px-4 py-3 text-slate-500 hover:bg-primary/5 rounded-xl transition-all"
        >
          <span className="material-symbols-outlined">
            {theme === 'light' ? 'dark_mode' : 'light_mode'}
          </span>
          <span className="hidden lg:block font-medium">切换模式</span>
        </button>

        <button
          onClick={onOpenCreate}
          className="w-full flex items-center justify-center lg:justify-start gap-4 px-4 py-3 bg-primary/10 text-primary rounded-xl hover:bg-primary hover:text-white transition-all group"
        >
          <span className="material-symbols-outlined group-hover:rotate-90 transition-transform">add_circle</span>
          <span className="hidden lg:block font-bold">创作中心</span>
        </button>

        <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-50 dark:bg-zinc-800/50">
          <img
            className="w-8 h-8 rounded-full object-cover ring-2 ring-primary/10"
            src="https://picsum.photos/id/64/100/100"
            alt="Avatar"
          />
          <div className="hidden lg:block flex-1 min-w-0">
            <p className="text-xs font-bold truncate">林梓安</p>
            <p className="text-[10px] text-slate-400">Pro Member</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
