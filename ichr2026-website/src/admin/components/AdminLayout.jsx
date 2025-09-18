import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
  LayoutDashboard,
  Users,
  FileText,
  Mail,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';
import { Sheet, SheetContent, SheetTrigger } from '../../components/ui/sheet';
import { Dialog } from '../../components/ui/dialog';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Registrations', href: '/admin/registrations', icon: Users },
    { name: 'Papers', href: '/admin/papers', icon: FileText },
    { name: 'Messages', href: '/admin/messages', icon: Mail },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
    { name: 'Users', href: '/admin/users', icon: Users },
  ];

  const NavItem = ({ item, mobile = false }) => (
    <NavLink
      to={item.href}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
          mobile ? 'text-base' : 'text-sm'
        } ${
          isActive
            ? 'bg-primary text-primary-foreground'
            : 'text-muted-foreground hover:bg-muted hover:text-primary'
        }`
      }
      onClick={() => mobile && setOpen(false)}
    >
      <item.icon className={`h-5 w-5 ${mobile ? 'h-6 w-6' : ''}`} />
      <span>{item.name}</span>
    </NavLink>
  );

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden border-r bg-muted/40 lg:block lg:w-64">
        <div className="flex h-full flex-col">
          <div className="flex h-14 items-center border-b px-4">
            <NavLink to="/admin/dashboard" className="flex items-center gap-2 font-semibold">
              <span className="text-primary">ICHR 2026</span>
              <span>Admin</span>
            </NavLink>
          </div>
          <nav className="flex-1 overflow-auto p-3">
            <div className="space-y-1">
              {navigation.map((item) => (
                <NavItem key={item.name} item={item} />
              ))}
            </div>
          </nav>
          <div className="border-t p-3">
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-sm text-muted-foreground"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5" />
              <span>Log out</span>
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger className="hidden">Open</SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <div className="flex h-full flex-col">
            <div className="flex h-14 items-center border-b px-4">
              <NavLink to="/admin/dashboard" className="flex items-center gap-2 font-semibold">
                <span className="text-primary">ICHR 2026</span>
                <span>Admin</span>
              </NavLink>
            </div>
            <nav className="flex-1 overflow-auto p-3">
              <div className="space-y-1">
                {navigation.map((item) => (
                  <NavItem key={item.name} item={item} mobile />
                ))}
              </div>
            </nav>
            <div className="border-t p-3">
              <Button
                variant="ghost"
                className="w-full justify-start gap-3"
                onClick={handleLogout}
              >
                <LogOut className="h-5 w-5" />
                <span>Log out</span>
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 sm:px-6 lg:px-8">
          <Button 
            variant="outline" 
            size="icon" 
            className="shrink-0 lg:hidden"
            onClick={() => setOpen(true)}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
          <div className="flex-1" />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    {user?.username?.charAt(0).toUpperCase() || 'A'}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden sm:inline-block">{user?.username}</span>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;