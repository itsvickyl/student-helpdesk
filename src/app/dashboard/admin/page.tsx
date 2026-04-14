"use client";

import { useEffect, useState } from 'react';
import { Search, Filter, CheckCircle2, AlertCircle, MessageSquare, Save, X, Eye } from 'lucide-react';
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

export default function AdminDashboard() {
  const { toast } = useToast();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [search, setSearch] = useState('');
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editResponse, setEditResponse] = useState('');
  const [editStatus, setEditStatus] = useState<TicketStatus>('Unsolved');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const unsubscribe = subscribeToAllTickets((fetchedTickets) => {
      setTickets(fetchedTickets);
    });
    return () => unsubscribe();
  }, []);

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

  if (!mounted) return null;

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-bold text-primary">Administration Control</h1>
        <p className="text-muted-foreground">Monitoring and responding to student helpdesk requests.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white shadow-sm border-none">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs text-muted-foreground uppercase">Total Tickets</p>
                <p className="text-2xl font-bold">{tickets.length}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-primary opacity-20" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-sm border-none">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs text-muted-foreground uppercase">Unsolved</p>
                <p className="text-2xl font-bold text-destructive">{tickets.filter(t => t.status === 'Unsolved').length}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-destructive opacity-20" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-sm border-none">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs text-muted-foreground uppercase">Solved Today</p>
                <p className="text-2xl font-bold text-green-600">
                  {tickets.filter(t => t.status === 'Solved' && t.updatedAt.startsWith(todayStr)).length}
                </p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-600 opacity-20" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-sm border-none">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs text-muted-foreground uppercase">Departments</p>
                <p className="text-2xl font-bold">5 Active</p>
              </div>
              <Filter className="h-8 w-8 text-accent opacity-20" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white shadow-lg border-none">
        <CardHeader className="border-b pb-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle>Master Ticket Queue</CardTitle>
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search students, titles..." 
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/30">
                <tr>
                  <th className="px-6 py-4 font-medium">Student</th>
                  <th className="px-6 py-4 font-medium">Issue</th>
                  <th className="px-6 py-4 font-medium">Category</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Created</th>
                  <th className="px-6 py-4 font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredTickets.map(ticket => (
                  <tr key={ticket.id} className="hover:bg-muted/10 transition-colors">
                    <td className="px-6 py-4 font-medium text-primary">{ticket.userName}</td>
                    <td className="px-6 py-4 max-w-xs truncate">{ticket.title}</td>
                    <td className="px-6 py-4">
                      <Badge variant="outline" className="font-normal">{ticket.category}</Badge>
                    </td>
                    <td className="px-6 py-4">
                      <Badge className={ticket.status === 'Solved' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}>
                        {ticket.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {format(new Date(ticket.createdAt), 'MMM d, yyyy')}
                    </td>
                    <td className="px-6 py-4">
                      <Button variant="ghost" size="sm" onClick={() => handleOpenTicket(ticket)}>
                        <Eye className="h-4 w-4 mr-1" />
                        Manage
                      </Button>
                    </td>
                  </tr>
                ))}
                {filteredTickets.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                      No tickets found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Management Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Ticket Management</DialogTitle>
            <DialogDescription>Review student issue and provide official resolution.</DialogDescription>
          </DialogHeader>
          
          {selectedTicket && (
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-2 gap-4 text-sm bg-muted/30 p-4 rounded-lg">
                <div>
                  <p className="text-muted-foreground">Submitted by</p>
                  <p className="font-bold">{selectedTicket.userName}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Submission Date</p>
                  <p className="font-bold">{format(new Date(selectedTicket.createdAt), 'PPpp')}</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-primary font-bold">Issue Title</Label>
                <p className="text-lg font-headline">{selectedTicket.title}</p>
              </div>

              <div className="space-y-2">
                <Label className="text-primary font-bold">Description</Label>
                <p className="p-3 bg-white border rounded-lg text-sm leading-relaxed whitespace-pre-wrap">
                  {selectedTicket.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Update Status</Label>
                  <Select value={editStatus} onValueChange={(v) => setEditStatus(v as TicketStatus)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Unsolved">Unsolved (Pending)</SelectItem>
                      <SelectItem value="Solved">Solved (Closed)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Department</Label>
                  <Input disabled value={selectedTicket.category} />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Resolution Response</Label>
                <Textarea 
                  placeholder="Type your response to the student..."
                  className="min-h-[120px]"
                  value={editResponse}
                  onChange={(e) => setEditResponse(e.target.value)}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsDialogOpen(false)}>
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button className="bg-primary hover:bg-primary/90" onClick={handleUpdateTicket}>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
