"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { GraduationCap, LogOut, LayoutDashboard, TicketPlus, LifeBuoy, User, Phone, Mail, Calendar, MapPin, Shield, Pencil, ChevronRight, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UserProfile } from '@/lib/types';
import { Separator } from '@/components/ui/separator';
import { Toaster } from '@/components/ui/toaster';
import { useAuth } from '@/hooks/use-auth';
import { getAuth, signOut } from 'firebase/auth';
import { initializeFirebase } from '@/firebase';

function NavButton({ active, onClick, icon: Icon, label, compact }: { active: boolean; onClick: () => void; icon: any; label: string; compact?: boolean }) {
  if (compact) {
    return (
      <button
        onClick={onClick}
        className={`
          flex flex-col items-center justify-center gap-1 py-2 px-3 rounded-xl text-[11px] font-medium transition-all duration-200 min-w-[64px]
          ${active
            ? 'text-accent'
            : 'text-white/50'}
        `}
      >
        <div className={`
          p-1.5 rounded-lg transition-all duration-200
          ${active
            ? 'bg-accent/20 text-accent'
            : 'text-white/50'}
        `}>
          <Icon className="h-5 w-5" />
        </div>
        <span className="truncate">{label}</span>
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group
        ${active
          ? 'bg-white/15 text-white shadow-lg shadow-black/5'
          : 'text-white/70 hover:bg-white/8 hover:text-white'}
      `}
    >
      <div className={`
        p-1.5 rounded-lg transition-all duration-200
        ${active
          ? 'bg-accent/20 text-accent'
          : 'text-white/50 group-hover:text-accent/80'}
      `}>
        <Icon className="h-4 w-4" />
      </div>
      <span>{label}</span>
      {active && <ChevronRight className="h-3.5 w-3.5 ml-auto opacity-60" />}
    </button>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  // Close sidebar on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  // Prevent body scroll when sidebar is open on mobile
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [sidebarOpen]);

  if (loading) return (
    <div className="min-h-screen dash-bg flex flex-col justify-center items-center gap-3">
      <div className="h-10 w-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      <p className="text-sm text-muted-foreground font-medium">Loading session...</p>
    </div>
  );
  if (!user) return null;

  const handleLogout = async () => {
    const { auth } = initializeFirebase();
    await signOut(auth);
    router.push('/');
  };

  const isStudent = user.role === 'student';

  const navItems = [
    { active: pathname === `/dashboard/${user.role}`, onClick: () => router.push(`/dashboard/${user.role}`), icon: LayoutDashboard, label: 'Dashboard' },
    ...(isStudent ? [
      { active: pathname.includes('create'), onClick: () => router.push('/dashboard/student/create'), icon: TicketPlus, label: 'Raise Issue' },
      { active: pathname.includes('support'), onClick: () => router.push('/dashboard/student/support'), icon: LifeBuoy, label: 'Support' },
    ] : []),
  ];

  const sidebarContent = (
    <>
      {/* Brand */}
      <div className="p-6 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-accent/15 backdrop-blur-sm">
            <GraduationCap className="h-6 w-6 text-accent" />
          </div>
          <div>
            <h1 className="text-lg font-headline font-bold text-white tracking-tight">EduHelp</h1>
            <p className="text-[10px] text-white/40 font-medium tracking-wider uppercase">Student Helpdesk</p>
          </div>
        </div>
      </div>

      {/* Profile card */}
      <div className="px-4 mb-5">
        <div className="rounded-2xl bg-white/[0.06] border border-white/[0.08] p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[10px] font-semibold text-white/40 uppercase tracking-widest">Profile</h2>
            <button
              onClick={() => router.push(`/dashboard/student/profile`)}
              className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-white/40 hover:text-accent"
              title="Edit Profile"
            >
              <Pencil className="h-3 w-3" />
            </button>
          </div>
          <div className="space-y-2.5">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center shrink-0">
                <User className="h-4 w-4 text-accent" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                <p className="text-[11px] text-white/40 truncate">{user.email}</p>
              </div>
            </div>
            {user.phone && (
              <div className="flex items-center gap-2 text-white/50 pl-1">
                <Phone className="h-3 w-3 text-white/30" />
                <span className="text-[11px]">{user.phone}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="px-4 flex-1">
        <p className="text-[10px] font-semibold text-white/30 uppercase tracking-widest mb-2 px-1">Navigation</p>
        <nav className="space-y-1">
          {navItems.map((item, i) => (
            <NavButton key={i} {...item} />
          ))}
        </nav>
      </div>

      {/* Logout */}
      <div className="p-4 mt-auto">
        <Separator className="bg-white/[0.08] mb-4" />
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-white/8 transition-all duration-200 group"
        >
          <LogOut className="h-4 w-4 group-hover:text-rose-400 transition-colors" />
          <span>Log out</span>
        </button>
      </div>
    </>
  );

  return (
    <div className="flex h-screen flex-col md:flex-row">
      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 border-b border-border/30 bg-[hsl(232_47%_14%)] z-40">
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded-lg bg-accent/15">
            <GraduationCap className="h-5 w-5 text-accent" />
          </div>
          <div>
            <h1 className="text-base font-headline font-bold text-white tracking-tight">EduHelp</h1>
          </div>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all"
          aria-label="Toggle menu"
        >
          {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </header>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40 mt-[57px]"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Desktop: always visible, Mobile: slide-in drawer */}
      <aside
        className={`
          fixed md:relative z-50 md:z-auto
          w-[280px] h-[calc(100vh-57px)] md:h-screen
          flex flex-col
          transition-transform duration-300 ease-in-out
          md:translate-x-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          top-[57px] md:top-0
        `}
        style={{
          background: 'linear-gradient(180deg, hsl(232 47% 15%) 0%, hsl(232 47% 12%) 100%)',
        }}
      >
        {sidebarContent}
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto dash-bg pb-20 md:pb-0">
        {/* <Toaster /> Temporarily disabled due to Radix React 19 ref loop bug */}
        <div className="max-w-6xl mx-auto p-4 sm:p-6 md:p-8">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around px-2 py-1 safe-area-bottom"
        style={{
          background: 'linear-gradient(180deg, hsl(232 47% 15%) 0%, hsl(232 47% 12%) 100%)',
          borderTop: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        {navItems.map((item, i) => (
          <NavButton key={i} {...item} compact />
        ))}
        <button
          onClick={handleLogout}
          className="flex flex-col items-center justify-center gap-1 py-2 px-3 rounded-xl text-[11px] font-medium text-white/50 min-w-[64px]"
        >
          <div className="p-1.5 rounded-lg text-white/50">
            <LogOut className="h-5 w-5" />
          </div>
          <span>Logout</span>
        </button>
      </nav>
    </div>
  );
}
