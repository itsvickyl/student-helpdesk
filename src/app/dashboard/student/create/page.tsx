"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Send, ArrowLeft, Loader2, Sparkles, Building2, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { saveTicket } from '@/lib/ticket-store';
import { adminTicketCategorization } from '@/ai/flows/admin-ticket-categorization';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function CreateTicketPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();
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

    try {
      await saveTicket(newTicket);
      toast({ title: "Ticket Created", description: "Your support request has been submitted securely." });
      router.push('/dashboard/student');
    } catch(err) {
      toast({ title: "Error", description: "Could not submit ticket.", variant: "destructive" });
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto animate-fade-in-up">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-xl hover:bg-primary/10">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-headline font-bold text-primary">New Helpdesk Ticket</h1>
          <p className="text-muted-foreground text-sm mt-1">Submit an issue to the administration or IT team.</p>
        </div>
      </div>

      <Card className="glass-card shadow-lg border-white/60">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
              <HelpCircle className="h-6 w-6" />
            </div>
            <div>
              <CardTitle className="text-xl">Submit an Issue</CardTitle>
              <CardDescription className="text-sm mt-0.5">Provide detailed information so our staff can assist you promptly.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6 pt-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-xs font-semibold uppercase tracking-wider text-slate-500">Issue Subject</Label>
              <Input 
                id="title" 
                placeholder="Brief summary of the problem" 
                required 
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="h-11 rounded-xl bg-white/60 border-border/40 focus:bg-white focus:border-primary/30 text-base"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="description" className="text-xs font-semibold uppercase tracking-wider text-slate-500">Detailed Description</Label>
                <div className="relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-500/20 via-fuchsia-500/20 to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    className="relative text-xs text-indigo-600 bg-white/50 border-indigo-200 hover:border-indigo-300 hover:bg-white hover:text-indigo-700 h-8 rounded-lg font-semibold shadow-sm transition-all flex items-center gap-1.5"
                    onClick={handleSuggestCategory}
                    disabled={analyzing}
                  >
                    {analyzing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5 text-indigo-500" />}
                    AI Categorize Mode
                  </Button>
                </div>
              </div>
              <Textarea 
                id="description" 
                placeholder="Tell us more about the issue you are facing..." 
                className="min-h-[160px] rounded-xl bg-white/60 border-border/40 focus:bg-white focus:border-primary/30 p-4 text-base resize-y"
                required 
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category" className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5" /> Department / Category
              </Label>
              <Select 
                value={formData.category} 
                onValueChange={(v) => setFormData({...formData, category: v})}
              >
                <SelectTrigger className="h-11 rounded-xl bg-white/60 border-border/40 focus:bg-white focus:border-primary/30">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-border/50 shadow-xl">
                  <SelectItem value="IT Support">IT Support</SelectItem>
                  <SelectItem value="Admissions">Admissions</SelectItem>
                  <SelectItem value="Billing">Billing</SelectItem>
                  <SelectItem value="General Inquiry">General Inquiry</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col-reverse sm:flex-row justify-end gap-3 bg-muted/20 border-t border-border/30 rounded-b-[1.5rem] p-4 sm:p-5">
            <Button type="button" variant="ghost" onClick={() => router.back()} className="rounded-xl h-11 px-6 font-medium w-full sm:w-auto">Cancel</Button>
            <Button type="submit" className="w-full sm:w-auto bg-gradient-to-r from-primary to-indigo-600 hover:opacity-90 rounded-xl h-11 px-6 shadow-lg shadow-primary/20 font-semibold transition-all hover:shadow-xl hover:-translate-y-0.5" disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-5 w-5" />}
              Submit Ticket
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
