"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PlusCircle, Info, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getTickets } from '@/lib/ticket-store';
import { getSession } from '@/lib/auth-mock';
import { Ticket } from '@/lib/types';
import { format } from 'date-fns';

export default function StudentDashboard() {
  const router = useRouter();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [mounted, setMounted] = useState(false);
  const user = getSession();

  useEffect(() => {
    if (user) {
      const allTickets = getTickets();
      setTickets(allTickets.filter(t => t.userId === user.id));
    }
    setMounted(true);
  }, [user]);

  if (!mounted) return null;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold text-primary">Academic Helpdesk</h1>
          <p className="text-muted-foreground">Manage your support requests and track resolution status.</p>
        </div>
        <Button onClick={() => router.push('/dashboard/student/create')} className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-md">
          <PlusCircle className="mr-2 h-4 w-4" />
          Create New Ticket
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white border-none shadow-md">
          <CardHeader className="pb-2">
            <CardDescription>Total Tickets</CardDescription>
            <CardTitle className="text-4xl">{tickets.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="bg-white border-none shadow-md">
          <CardHeader className="pb-2 text-destructive">
            <CardDescription className="text-destructive/80">Pending Issues</CardDescription>
            <CardTitle className="text-4xl">{tickets.filter(t => t.status === 'Unsolved').length}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="bg-white border-none shadow-md">
          <CardHeader className="pb-2 text-green-600">
            <CardDescription className="text-green-600/80">Solved Tickets</CardDescription>
            <CardTitle className="text-4xl">{tickets.filter(t => t.status === 'Solved').length}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          Recent Support History
        </h2>
        
        {tickets.length === 0 ? (
          <Card className="p-12 text-center bg-white border-dashed border-2 border-border">
            <div className="flex flex-col items-center space-y-4">
              <Info className="h-12 w-12 text-muted-foreground" />
              <p className="text-muted-foreground">You haven't raised any tickets yet. Click 'Create New Ticket' to get started.</p>
            </div>
          </Card>
        ) : (
          <div className="grid gap-4">
            {tickets.map(ticket => (
              <Card key={ticket.id} className="bg-white border-none shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{ticket.title}</CardTitle>
                    <div className="flex gap-2">
                      <Badge variant="outline" className="font-normal">{ticket.category}</Badge>
                      <span className="text-xs text-muted-foreground">Created: {format(new Date(ticket.createdAt), 'MMM d, h:mm a')}</span>
                    </div>
                  </div>
                  <Badge className={ticket.status === 'Solved' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-amber-100 text-amber-700 border-amber-200'}>
                    {ticket.status === 'Solved' ? <CheckCircle2 className="h-3 w-3 mr-1" /> : <AlertCircle className="h-3 w-3 mr-1" />}
                    {ticket.status}
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-2">{ticket.description}</p>
                  {ticket.response && (
                    <div className="p-3 bg-secondary rounded-lg border-l-4 border-primary mt-2">
                      <p className="text-xs font-bold text-primary mb-1">Official Response:</p>
                      <p className="text-sm italic">"{ticket.response}"</p>
                    </div>
                  )}
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-[10px] text-muted-foreground">Last updated: {format(new Date(ticket.updatedAt), 'MMM d, h:mm a')}</span>
                    <Button variant="ghost" size="sm" className="text-xs">View Details</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
