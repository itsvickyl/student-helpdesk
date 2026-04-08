"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { GraduationCap, LogOut, LayoutDashboard, TicketPlus, LifeBuoy, User, Phone, Mail, Calendar, MapPin, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getSession, clearSession } from '@/lib/auth-mock';
import { UserProfile } from '@/lib/types';
import { Separator } from '@/components/ui/separator';
import { Toaster } from '@/components/ui/toaster';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const session = getSession();
    if (!session) {
      router.push('/');
    } else {
      setUser(session);
    }
  }, [router]);

  if (!user) return null;

  const handleLogout = () => {
    clearSession();
    router.push('/');
  };

  const isStudent = user.role === 'student';

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-72 bg-primary text-white flex flex-col shadow-xl">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <GraduationCap className="h-8 w-8 text-accent" />
            <h1 className="text-xl font-headline font-bold">EduHelp</h1>
          </div>

          <div className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-xs font-semibold text-primary-foreground/60 uppercase tracking-wider">My Profile</h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <User className="h-4 w-4 mt-1 text-accent" />
                  <div>
                    <p className="text-xs text-primary-foreground/60">Name</p>
                    <p className="text-sm font-medium">{user.name}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="h-4 w-4 mt-1 text-accent" />
                  <div>
                    <p className="text-xs text-primary-foreground/60">Phone</p>
                    <p className="text-sm font-medium">{user.phone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="h-4 w-4 mt-1 text-accent" />
                  <div>
                    <p className="text-xs text-primary-foreground/60">Email</p>
                    <p className="text-sm font-medium truncate w-44">{user.email}</p>
                  </div>
                </div>
                {user.dob && (
                  <div className="flex items-start gap-3">
                    <Calendar className="h-4 w-4 mt-1 text-accent" />
                    <div>
                      <p className="text-xs text-primary-foreground/60">DOB</p>
                      <p className="text-sm font-medium">{user.dob}</p>
                    </div>
                  </div>
                )}
                {user.address && (
                  <div className="flex items-start gap-3">
                    <MapPin className="h-4 w-4 mt-1 text-accent" />
                    <div>
                      <p className="text-xs text-primary-foreground/60">Address</p>
                      <p className="text-sm font-medium leading-tight">{user.address}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <Separator className="bg-primary-foreground/20" />

            <nav className="space-y-1">
              <Button 
                variant="ghost" 
                className={`w-full justify-start text-white hover:bg-white/10 ${pathname.includes('dashboard') ? 'bg-white/10' : ''}`}
                onClick={() => router.push(`/dashboard/${user.role}`)}
              >
                <LayoutDashboard className="mr-3 h-4 w-4 text-accent" />
                Dashboard
              </Button>
              {isStudent && (
                <>
                  <Button 
                    variant="ghost" 
                    className={`w-full justify-start text-white hover:bg-white/10 ${pathname.includes('create') ? 'bg-white/10' : ''}`}
                    onClick={() => router.push('/dashboard/student/create')}
                  >
                    <TicketPlus className="mr-3 h-4 w-4 text-accent" />
                    Raise Issue
                  </Button>
                  <Button variant="ghost" className="w-full justify-start text-white hover:bg-white/10">
                    <LifeBuoy className="mr-3 h-4 w-4 text-accent" />
                    Support
                  </Button>
                </>
              )}
            </nav>
          </div>
        </div>

        <div className="mt-auto p-6">
          <Button 
            variant="outline" 
            className="w-full border-white/20 text-white hover:bg-white hover:text-primary transition-colors"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8 relative">
        <Toaster />
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
