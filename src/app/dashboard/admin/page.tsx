"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Filter, CheckCircle2, AlertCircle, MessageSquare, Save, X, Eye, ShieldAlert, TrendingUp, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { subscribeToAllTickets, saveTicket } from '@/lib/ticket-store';
import { Ticket, TicketStatus } from '@/lib/types';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';

export default function AdminDashboard() {
  const { toast } = useToast();
  const { user, loading } = useAuth();
  const router = useRouter();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [search, setSearch] = useState('');
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editResponse, setEditResponse] = useState('');
  const [editStatus, setEditStatus] = useState<TicketStatus>('Unsolved');
  const [mounted, setMounted] = useState(false);

  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    setMounted(true);
    // Only subscribe to all tickets if the user is verified as an admin
    if (!isAdmin) return;

    const unsubscribe = subscribeToAllTickets((fetchedTickets) => {
      setTickets(fetchedTickets);
    });
    return () => unsubscribe();
  }, [isAdmin]);

  const filteredTickets = tickets.filter(t => 
    t.title.toLowerCase().includes(search.toLowerCase()) ||
    t.userName.toLowerCase().includes(search.toLowerCase()) ||
    t.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenTicket = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setEditResponse(ticket.response || '');
    setEditStatus(ticket.status);
    setIsDialogOpen(true);
  };

  const handleUpdateTicket = async () => {
    if (!selectedTicket) return;

    const updated: Ticket = {
      ...selectedTicket,
      status: editStatus,
      response: editResponse,
      updatedAt: new Date().toISOString()
    };

    await saveTicket(updated);
    setIsDialogOpen(false);
    toast({ title: "Ticket Updated", description: "The ticket status and response have been saved." });
  };

  if (!mounted || loading) return (
    <div className="min-h-[60vh] flex flex-col justify-center items-center gap-3">
      <div className="h-10 w-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      <p className="text-sm text-muted-foreground font-medium">Loading...</p>
    </div>
  );

  if (!isAdmin) {
    return (
      <div className="min-h-[60vh] flex flex-col justify-center items-center gap-5 text-center animate-fade-in-up">
        <div className="h-20 w-20 rounded-2xl bg-destructive/10 flex items-center justify-center">
          <ShieldAlert className="h-10 w-10 text-destructive/60" />
        </div>
        <div>
          <h1 className="text-2xl font-headline font-bold text-destructive">Access Denied</h1>
          <p className="text-muted-foreground max-w-md mt-2">
            You do not have administrator privileges. This dashboard is restricted to staff and admin accounts.
          </p>
        </div>
        <Button variant="outline" onClick={() => router.push(`/dashboard/student`)} className="rounded-xl mt-2">
          Go to Student Dashboard
        </Button>
      </div>
    );
  }

  const todayStr = new Date().toISOString().split('T')[0];
  const solvedToday = tickets.filter(t => t.status === 'Solved' && t.updatedAt.startsWith(todayStr)).length;
  const unsolved = tickets.filter(t => t.status === 'Unsolved').length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="animate-fade-in-up">
        <h1 className="text-2xl sm:text-3xl font-headline font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          Administration Control
        </h1>
        <p className="text-muted-foreground mt-1 text-sm sm:text-base">Monitoring and responding to student helpdesk requests.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 animate-fade-in-up animate-delay-100">
        <div className="stat-card stat-card-blue">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Total Tickets</p>
              <p className="text-3xl font-bold mt-1.5 tracking-tight">{tickets.length}</p>
            </div>
            <div className="h-11 w-11 rounded-xl bg-primary/8 flex items-center justify-center">
              <MessageSquare className="h-5 w-5 text-primary/50" />
            </div>
          </div>
        </div>
        <div className="stat-card stat-card-red">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Unsolved</p>
              <p className="text-3xl font-bold mt-1.5 tracking-tight text-destructive">{unsolved}</p>
            </div>
            <div className="h-11 w-11 rounded-xl bg-destructive/8 flex items-center justify-center">
              <AlertCircle className="h-5 w-5 text-destructive/50" />
            </div>
          </div>
        </div>
        <div className="stat-card stat-card-green">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Solved Today</p>
              <p className="text-3xl font-bold mt-1.5 tracking-tight text-emerald-600">{solvedToday}</p>
            </div>
            <div className="h-11 w-11 rounded-xl bg-emerald-500/8 flex items-center justify-center">
              <CheckCircle2 className="h-5 w-5 text-emerald-500/50" />
            </div>
          </div>
        </div>
        <div className="stat-card stat-card-amber">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Departments</p>
              <p className="text-3xl font-bold mt-1.5 tracking-tight">5 Active</p>
            </div>
            <div className="h-11 w-11 rounded-xl bg-amber-500/8 flex items-center justify-center">
              <Filter className="h-5 w-5 text-amber-500/50" />
            </div>
          </div>
        </div>
      </div>

      {/* Ticket Table */}
      <div className="glass-card overflow-hidden animate-fade-in-up animate-delay-200">
        <div className="p-5 border-b border-border/30">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold">Master Ticket Queue</h2>
              <p className="text-xs text-muted-foreground mt-0.5">{filteredTickets.length} ticket{filteredTickets.length !== 1 ? 's' : ''} found</p>
            </div>
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
              <Input 
                placeholder="Search students, titles..." 
                className="pl-10 rounded-xl bg-muted/30 border-border/40 focus:bg-white h-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>
        {/* Desktop: Table View */}
        <div className="overflow-x-auto hidden md:block">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/30 border-b border-border/20">
                <th className="px-5 py-3.5 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Student</th>
                <th className="px-5 py-3.5 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Issue</th>
                <th className="px-5 py-3.5 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Category</th>
                <th className="px-5 py-3.5 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="px-5 py-3.5 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Created</th>
                <th className="px-5 py-3.5 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/20">
              {filteredTickets.map(ticket => (
                <tr key={ticket.id} className="hover:bg-primary/[0.02] transition-colors duration-150">
                  <td className="px-5 py-4 font-semibold text-primary text-sm">{ticket.userName}</td>
                  <td className="px-5 py-4 max-w-xs truncate text-foreground/80">{ticket.title}</td>
                  <td className="px-5 py-4">
                    <Badge variant="outline" className="font-normal text-xs rounded-lg bg-muted/20 border-border/40">{ticket.category}</Badge>
                  </td>
                  <td className="px-5 py-4">
                    <Badge className={`
                      rounded-lg px-2.5 py-0.5 text-xs font-semibold border
                      ${ticket.status === 'Solved'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'}
                    `}>
                      {ticket.status}
                    </Badge>
                  </td>
                  <td className="px-5 py-4 text-muted-foreground text-xs">
                    {format(new Date(ticket.createdAt), 'MMM d, yyyy')}
                  </td>
                  <td className="px-5 py-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOpenTicket(ticket)}
                      className="text-xs h-8 rounded-lg hover:bg-primary/10 hover:text-primary font-semibold"
                    >
                      <Eye className="h-3.5 w-3.5 mr-1.5" />
                      Manage
                    </Button>
                  </td>
                </tr>
              ))}
              {filteredTickets.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Search className="h-8 w-8 text-muted-foreground/30" />
                      <p className="text-muted-foreground font-medium">No tickets found matching your search.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile: Card View */}
        <div className="md:hidden divide-y divide-border/20">
          {filteredTickets.map(ticket => (
            <div key={ticket.id} className="p-4 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-sm text-foreground truncate">{ticket.title}</p>
                  <p className="text-xs text-primary font-medium mt-0.5">{ticket.userName}</p>
                </div>
                <Badge className={`
                  shrink-0 rounded-lg px-2 py-0.5 text-[11px] font-semibold border
                  ${ticket.status === 'Solved'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-amber-50 text-amber-700 border-amber-200'}
                `}>
                  {ticket.status}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="font-normal text-[11px] rounded-lg bg-muted/20 border-border/40">{ticket.category}</Badge>
                  <span className="text-[11px] text-muted-foreground">{format(new Date(ticket.createdAt), 'MMM d')}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleOpenTicket(ticket)}
                  className="text-xs h-8 rounded-lg hover:bg-primary/10 hover:text-primary font-semibold"
                >
                  <Eye className="h-3.5 w-3.5 mr-1" />
                  Manage
                </Button>
              </div>
            </div>
          ))}
          {filteredTickets.length === 0 && (
            <div className="px-6 py-16 text-center">
              <div className="flex flex-col items-center gap-2">
                <Search className="h-8 w-8 text-muted-foreground/30" />
                <p className="text-muted-foreground font-medium">No tickets found.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Management Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl rounded-2xl max-h-[90vh] overflow-y-auto mx-4">
          <DialogHeader>
            <DialogTitle className="text-xl">Ticket Management</DialogTitle>
            <DialogDescription>Review student issue and provide official resolution.</DialogDescription>
          </DialogHeader>
          
          {selectedTicket && (
            <div className="space-y-6 py-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm bg-muted/20 p-4 rounded-xl border border-border/30">
                <div>
                  <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-medium">Submitted by</p>
                  <p className="font-bold mt-0.5">{selectedTicket.userName}</p>
                </div>
                <div>
                  <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-medium">Submission Date</p>
                  <p className="font-bold mt-0.5">{format(new Date(selectedTicket.createdAt), 'PPpp')}</p>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-primary font-bold text-xs uppercase tracking-wider">Issue Title</Label>
                <p className="text-lg font-headline font-semibold">{selectedTicket.title}</p>
              </div>

              <div className="space-y-1.5">
                <Label className="text-primary font-bold text-xs uppercase tracking-wider">Description</Label>
                <p className="p-4 bg-white border border-border/30 rounded-xl text-sm leading-relaxed whitespace-pre-wrap">
                  {selectedTicket.description}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-2">
                  <Label className="text-xs font-semibold">Update Status</Label>
                  <Select value={editStatus} onValueChange={(v) => setEditStatus(v as TicketStatus)}>
                    <SelectTrigger className="rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Unsolved">Unsolved (Pending)</SelectItem>
                      <SelectItem value="Solved">Solved (Closed)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-semibold">Department</Label>
                  <Input disabled value={selectedTicket.category} className="rounded-xl bg-muted/30" />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold">Resolution Response</Label>
                <Textarea 
                  placeholder="Type your response to the student..."
                  className="min-h-[120px] rounded-xl"
                  value={editResponse}
                  onChange={(e) => setEditResponse(e.target.value)}
                />
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button variant="ghost" onClick={() => setIsDialogOpen(false)} className="rounded-xl">
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button className="bg-primary hover:bg-primary/90 rounded-xl px-6" onClick={handleUpdateTicket}>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
