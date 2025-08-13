import React from 'react';
import { NavLink } from 'react-router-dom';
import { ChartBarIcon, ClipboardDocumentListIcon, CalendarDaysIcon, BellAlertIcon } from '@heroicons/react/24/outline';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen grid grid-cols-[240px_1fr]">
      <aside className="bg-white border-r border-slate-200 p-4 hidden md:block">
        <div className="text-xl font-bold mb-6">MES</div>
        <nav className="space-y-1">
          <NavItem to="/" label="Dashboard" Icon={ChartBarIcon} end />
          <NavItem to="/production-logs" label="Production Logs" Icon={ClipboardDocumentListIcon} />
          <NavItem to="/planned-production" label="Planned Production" Icon={CalendarDaysIcon} />
          <NavItem to="/alerts" label="Alerts" Icon={BellAlertIcon} />
        </nav>
      </aside>
      <main className="p-4">
        <TopBar />
        <div className="mt-6">{children}</div>
      </main>
    </div>
  );
};

function TopBar() {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-semibold">Factory Dashboard</h1>
      <div className="text-sm text-slate-500">v0.1</div>
    </div>
  );
}

function NavItem({ to, label, Icon, end = false }: { to: string; label: string; Icon: any; end?: boolean }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium ${isActive ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100'}`
      }
    >
      <Icon className="h-5 w-5" />
      {label}
    </NavLink>
  );
}