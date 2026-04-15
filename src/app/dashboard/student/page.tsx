"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PlusCircle, Info, Clock, CheckCircle2, AlertCircle, TrendingUp, Inbox } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { subscribeToUserTickets } from '@/lib/ticket-store';
import { useAuth } from '@/hooks/use-auth';
import { Ticket } from '@/lib/types';
import { format } from 'date-fns';

export default function StudentDashboard() {
  const router = useRouter();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [mounted, setMounted] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    setMounted(true);
    if (user) {
      const unsubscribe = subscribeToUserTickets(user.id, (fetchedTickets) => {
        setTickets(fetchedTickets);
      });
      return () => unsubscribe();
    }
  }, [user]);

  if (!mounted) return null;

  const pending = tickets.filter(t => t.status === 'Unsolved').length;
  const solved = tickets.filter(t => t.status === 'Solved').length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 animate-fade-in-up">
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">Welcome back,</p>
          <h1 className="text-2xl sm:text-3xl font-headline font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Academic Helpdesk
          </h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">Manage your support requests and track resolution status.</p>
        </div>
        <Button
          onClick={() => router.push('/dashboard/student/create')}
          className="w-full sm:w-auto bg-gradient-to-r from-accent to-amber-500 text-accent-foreground hover:opacity-90 shadow-lg shadow-accent/20 rounded-xl px-6 h-11 font-semibold transition-all hover:shadow-xl hover:shadow-accent/25 hover:-translate-y-0.5"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Create New Ticket
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-5 animate-fade-in-up animate-delay-100">
        <div className="stat-card stat-card-blue">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Tickets</p>
              <p className="text-2xl sm:text-4xl font-bold mt-2 tracking-tight">{tickets.length}</p>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-primary/8 flex items-center justify-center">
              <Inbox className="h-6 w-6 text-primary/60" />
            </div>
          </div>
        </div>
        <div className="stat-card stat-card-red">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-destructive/70 uppercase tracking-wider">Pending Issues</p>
              <p className="text-2xl sm:text-4xl font-bold mt-2 tracking-tight text-destructive">{pending}</p>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-destructive/8 flex items-center justify-center">
              <AlertCircle className="h-6 w-6 text-destructive/50" />
            </div>
          </div>
        </div>
        <div className="stat-card stat-card-green">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-emerald-600/70 uppercase tracking-wider">Solved Tickets</p>
              <p className="text-2xl sm:text-4xl font-bold mt-2 tracking-tight text-emerald-600">{solved}</p>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-emerald-500/8 flex items-center justify-center">
              <CheckCircle2 className="h-6 w-6 text-emerald-500/50" />
            </div>
          </div>
        </div>
      </div>

      {/* Ticket List */}
      <div className="space-y-4 animate-fade-in-up animate-delay-200">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Clock className="h-4 w-4 text-primary" />
          </div>
          <h2 className="text-lg font-bold">Recent Support History</h2>
        </div>
        
        {tickets.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-border/60 p-16 text-center bg-white/50">
            <div className="flex flex-col items-center space-y-4">
              <div className="h-16 w-16 rounded-2xl bg-muted/50 flex items-center justify-center">
                <Info className="h-8 w-8 text-muted-foreground/60" />
              </div>
              <div>
                <p className="font-semibold text-foreground/70 mb-1">No tickets yet</p>
                <p className="text-sm text-muted-foreground">Click &apos;Create New Ticket&apos; to submit your first support request.</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid gap-4">
            {tickets.map((ticket, i) => (
              <div
                key={ticket.id}
                className="glass-card p-0 overflow-hidden animate-fade-in-up"
                style={{ animationDelay: `${(i + 3) * 80}ms` }}
              >
                <div className="p-5">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-1.5 min-w-0 flex-1">
                      <h3 className="text-base font-semibold text-foreground truncate">{ticket.title}</h3>
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="outline" className="font-normal text-xs rounded-lg bg-muted/30 border-border/50">
                          {ticket.category}
                        </Badge>
                        <span className="text-[11px] text-muted-foreground">
                          {format(new Date(ticket.createdAt), 'MMM d, h:mm a')}
                        </span>
                      </div>
                    </div>
                    <Badge className={`
                      shrink-0 rounded-lg px-3 py-1 text-xs font-semibold border
                      ${ticket.status === 'Solved'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'}
                    `}>
                      {ticket.status === 'Solved' ? <CheckCircle2 className="h-3 w-3 mr-1.5" /> : <AlertCircle className="h-3 w-3 mr-1.5" />}
                      {ticket.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-3 leading-relaxed">{ticket.description}</p>
                  {ticket.response && (
                    <div className="mt-4 p-4 bg-gradient-to-r from-primary/[0.04] to-transparent rounded-xl border-l-[3px] border-primary/40">
                      <p className="text-[11px] font-bold text-primary/70 uppercase tracking-wider mb-1.5">Official Response</p>
                      <p className="text-sm text-foreground/80 italic leading-relaxed">&ldquo;{ticket.response}&rdquo;</p>
                    </div>
                  )}
                </div>
                <div className="flex justify-between items-center px-5 py-3 bg-muted/20 border-t border-border/30">
                  <span className="text-[11px] text-muted-foreground">
                    Updated {format(new Date(ticket.updatedAt), 'MMM d, h:mm a')}
                  </span>
                  <Button variant="ghost" size="sm" className="text-xs text-primary hover:text-primary font-semibold h-8 rounded-lg">
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
