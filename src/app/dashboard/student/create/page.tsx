"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Send, ArrowLeft, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { getSession } from '@/lib/auth-mock';
import { saveTicket } from '@/lib/ticket-store';
import { adminTicketCategorization } from '@/ai/flows/admin-ticket-categorization';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function CreateTicketPage() {
  const router = useRouter();
  const { toast } = useToast();
  const user = getSession();
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: ''
  });

  const handleSuggestCategory = async () => {
    if (!formData.description || formData.description.length < 10) {
      toast({ title: "More info needed", description: "Please provide a longer description for AI categorization." });
      return;
    }

    setAnalyzing(true);
    try {
      const result = await adminTicketCategorization({ description: formData.description });
      setFormData(prev => ({ ...prev, category: result.category }));
      toast({ title: "Category Suggested", description: `AI suggested: ${result.category}` });
    } catch (error) {
      console.error(error);
      toast({ title: "Analysis Failed", description: "AI could not suggest a category. Please select manually.", variant: "destructive" });
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);

    if (!formData.category) {
        toast({ title: "Category Required", description: "Please select an issue category.", variant: "destructive" });
        setLoading(false);
        return;
    }

    const newTicket = {
      id: `t_${Math.random().toString(36).substr(2, 9)}`,
      userId: user.id,
      userName: user.name,
      title: formData.title,
      description: formData.description,
      category: formData.category,
      status: 'Unsolved' as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setTimeout(() => {
      saveTicket(newTicket);
      toast({ title: "Ticket Created", description: "Your support request has been submitted successfully." });
      router.push('/dashboard/student');
    }, 1000);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-3xl font-headline font-bold text-primary">New Helpdesk Ticket</h1>
      </div>

      <Card className="shadow-lg border-none">
        <CardHeader>
          <CardTitle>Submit an Issue</CardTitle>
          <CardDescription>Provide detailed information so our staff can assist you promptly.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Issue Subject</Label>
              <Input 
                id="title" 
                placeholder="Brief summary of the problem" 
                required 
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="description">Detailed Description</Label>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm" 
                  className="text-xs text-primary flex items-center gap-1"
                  onClick={handleSuggestCategory}
                  disabled={analyzing}
                >
                  {analyzing ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
                  Auto-Categorize
                </Button>
              </div>
              <Textarea 
                id="description" 
                placeholder="Tell us more about the issue you are facing..." 
                className="min-h-[150px]"
                required 
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Department / Category</Label>
              <Select 
                value={formData.category} 
                onValueChange={(v) => setFormData({...formData, category: v})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="IT Support">IT Support</SelectItem>
                  <SelectItem value="Admissions">Admissions</SelectItem>
                  <SelectItem value="Billing">Billing</SelectItem>
                  <SelectItem value="General Inquiry">General Inquiry</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-3 bg-muted/50 rounded-b-lg py-4">
            <Button type="button" variant="ghost" onClick={() => router.back()}>Cancel</Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90" disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
              Submit Ticket
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
