import React, { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, PlusCircle, PieChart, Save } from 'lucide-react';
import { AppRoutes } from '../types';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const [pageTitle, setPageTitle] = useState('Trang chủ');

  useEffect(() => {
    switch (location.pathname) {
      case AppRoutes.HOME: setPageTitle('Tổng quan tài chính'); break;
      case AppRoutes.TRANSACTIONS: setPageTitle('Ghi thu chi'); break;
      case AppRoutes.BUDGET: setPageTitle('Quản lý ngân sách'); break;
      case AppRoutes.BACKUP: setPageTitle('Sao lưu dữ liệu'); break;
      default: setPageTitle('VietinFinance');
    }
  }, [location]);

  const navItems = [
    { to: AppRoutes.HOME, icon: <Home size={20} />, label: 'Trang chủ' },
    { to: AppRoutes.TRANSACTIONS, icon: <PlusCircle size={20} />, label: 'Ghi thu chi' },
    { to: AppRoutes.BUDGET, icon: <PieChart size={20} />, label: 'Ngân sách' },
    { to: AppRoutes.BACKUP, icon: <Save size={20} />, label: 'Sao lưu' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 pb-20 md:pb-0">
      {/* Header */}
      <header className="bg-vietin text-white sticky top-0 z-10 shadow-md">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">{pageTitle}</h1>
          <div className="text-sm opacity-90 font-light">VietinFinance</div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-3xl mx-auto p-4">
        {children}
      </main>

      {/* Bottom Navigation (Mobile) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden z-20">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center w-full h-full text-xs font-medium transition-colors duration-200 ${
                  isActive ? 'text-vietin bg-blue-50' : 'text-gray-500 hover:bg-gray-50'
                }`
              }
            >
              <div className="mb-1">{item.icon}</div>
              {item.label}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Top Navigation (Desktop) - Replaces Bottom Nav on larger screens */}
      <nav className="hidden md:block fixed top-0 right-0 h-16 z-20 mr-4">
          <div className="flex h-full items-center gap-4 text-white">
             {/* Simple Desktop Nav Links if needed, but for this simpler app, 
                 we rely on the mobile-first approach. 
                 To make it look good on desktop, we can inject links into the header above.
                 However, keeping it consistent with the "app" feel:
             */}
          </div>
      </nav>
      {/* Injecting desktop menu into header for better desktop UX */}
      <div className="hidden md:flex fixed top-0 left-0 right-0 max-w-3xl mx-auto h-[60px] items-center justify-end px-4 z-30 pointer-events-none">
        <div className="pointer-events-auto flex gap-1 bg-vietin rounded-b-lg p-1 shadow-lg">
             {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200 flex items-center gap-2 ${
                  isActive ? 'bg-white text-vietin shadow-sm' : 'text-blue-100 hover:bg-[#00448a]'
                }`
              }
            >
              {item.icon}
              <span className="hidden lg:inline">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </div>

    </div>
  );
};