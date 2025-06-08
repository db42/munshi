import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import AssessmentYearSwitcher from '@/components/AssessmentYearSwitcher';
import { useAssessmentYear } from '@/context/AssessmentYearContext';
import { UserSwitcher } from '@/components/UserSwitcher';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  FileText,
  FileOutput,
  Search,
  GitCompare,
  PanelLeft,
} from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  path: string;
  icon: React.ElementType;
}

export default function MainLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { assessmentYear, setAssessmentYear } = useAssessmentYear();

  const navItems: NavItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      path: '/',
      icon: LayoutDashboard,
    },
    {
      id: 'documents',
      label: 'Documents',
      path: '/documents',
      icon: FileText,
    },
    {
      id: 'itr',
      label: 'ITR Generation',
      path: '/itr-generation',
      icon: FileOutput,
    },
    {
      id: 'review',
      label: 'Review',
      path: '/review',
      icon: Search,
    },
    {
      id: 'diff-viewer',
      label: 'ITR Diff Viewer',
      path: '/diff-viewer',
      icon: GitCompare,
    },
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <Sidebar>
          <SidebarHeader>
            <span className="text-lg font-semibold">Munshi</span>
          </SidebarHeader>
          <SidebarMenu>
            {navItems.map(item => (
              <SidebarMenuItem key={item.id}>
                <SidebarMenuButton
                    onClick={(e: React.MouseEvent) => {
                        e.preventDefault();
                        navigate(item.path);
                    }}
                    isActive={isActive(item.path)}
                    tooltip={item.label}
                >
                    <item.icon className="size-4" />
                    <span>{item.label}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
          <SidebarFooter>
            {/* Can add footer items here if needed */}
          </SidebarFooter>
        </Sidebar>

        <SidebarInset className="flex-1 min-w-0">
          <header className="h-16 bg-card border-b px-4 flex items-center justify-between w-full">
            <div className="flex items-center space-x-4">
              <SidebarTrigger>
                <PanelLeft className="size-4" />
              </SidebarTrigger>
              <AssessmentYearSwitcher
                currentYear={assessmentYear}
                onChange={setAssessmentYear}
              />
            </div>
            <div className="flex items-center space-x-4">
              <UserSwitcher />
            </div>
          </header>
          <div className="p-6">
            <Outlet />
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}