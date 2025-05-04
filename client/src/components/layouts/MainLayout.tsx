import React, { useState } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import AssessmentYearSwitcher from '../AssessmentYearSwitcher';
import { useAssessmentYear } from '../../context/AssessmentYearContext';

interface NavItem {
  id: string;
  label: string;
  path: string;
  subitems?: { id: string; label: string; path: string; }[];
}

export default function MainLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { assessmentYear, setAssessmentYear } = useAssessmentYear();

  const navItems: NavItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      path: '/'
    },
    {
      id: 'documents',
      label: 'Documents',
      path: '/documents'
    },
    {
      id: 'itr',
      label: 'ITR Generation',
      path: '/itr-generation'
    },
    {
      id: 'review',
      label: 'Review',
      path: '/review'
    },
    {
      id: 'diff-viewer',
      label: 'ITR Diff Viewer',
      path: '/diff-viewer'
    }
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleNavigation = (item: NavItem) => {
    if (item.subitems) {
      toggleExpanded(item.id);
      // If collapsed, expand and navigate to first subitem
      if (!expandedItems.includes(item.id)) {
        navigate(item.subitems[0].path);
      }
    } else {
      navigate(item.path);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside 
        className={`
          fixed left-0 top-0 h-full bg-white shadow-lg
          transition-all duration-300 ease-in-out
          ${isSidebarOpen ? 'w-64' : 'w-20'}
        `}
      >
        {/* Logo */}
        <div className="h-16 border-b flex items-center px-4">
          <span className="text-xl font-semibold">
            {isSidebarOpen ? 'Munshi' : 'M'}
          </span>
        </div>

        {/* Navigation */}
        <nav className="mt-4">
          {navItems.map(item => (
            <div key={item.id}>
              <button
                onClick={() => handleNavigation(item)}
                className={`
                  w-full text-left px-4 py-2
                  hover:bg-gray-50 transition-colors
                  ${isActive(item.path) ? 'bg-gray-100' : ''}
                  flex items-center justify-between
                `}
              >
                <span className={!isSidebarOpen ? 'text-center w-full' : ''}>
                  {isSidebarOpen ? item.label : item.label[0]}
                </span>
                {isSidebarOpen && item.subitems && (
                  <span className="text-xs">▾</span>
                )}
              </button>

              {/* Subitems */}
              {isSidebarOpen && item.subitems && expandedItems.includes(item.id) && (
                <div className="ml-4 border-l">
                  {item.subitems.map(subitem => (
                    <button
                      key={subitem.id}
                      onClick={() => navigate(subitem.path)}
                      className={`
                        w-full text-left py-2 px-4 text-sm
                        hover:bg-gray-50 transition-colors
                        ${isActive(subitem.path) ? 'bg-gray-100' : ''}
                      `}
                    >
                      {subitem.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className={`
        flex-1 transition-all duration-300
        ${isSidebarOpen ? 'ml-64' : 'ml-20'}
      `}>
        {/* Header */}
        <header className="h-16 bg-white border-b px-4 flex items-center justify-between fixed right-0 left-auto transition-all duration-300 ease-in-out"
          style={{ width: `calc(100% - ${isSidebarOpen ? '16rem' : '5rem'})` }}>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="px-4 py-2 hover:bg-gray-100 rounded-md transition-colors"
            >
              {isSidebarOpen ? 'Collapse' : 'Expand'}
            </button>
            
            {/* Assessment Year Switcher */}
            <AssessmentYearSwitcher 
              currentYear={assessmentYear}
              onChange={setAssessmentYear}
            />
          </div>
          
          <div className="flex items-center">
            <span className="font-medium">John Doe</span>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6 mt-16">
          <Outlet />
        </div>
      </main>
    </div>
  );
}