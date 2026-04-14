"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck, ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { initializeFirebase } from '@/firebase';

export default function AdminLoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Firebase Login
    try {
      const { auth } = initializeFirebase();
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      
      toast({ title: "Admin Login Successful", description: "Redirecting to staff dashboard..." });
      router.push('/dashboard/admin');
    } catch (error: any) {
      console.error("Admin Login Exception:", error);
      toast({ 
        title: "Login Failed", 
        description: "Invalid credentials. Please verify your administrative access.", 
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen mesh-bg-dark flex flex-col items-center justify-center p-4 py-12 relative overflow-hidden">
      <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 text-slate-300 font-medium hover:text-white transition-colors backdrop-blur-sm bg-white/10 px-4 py-2 rounded-full border border-white/20">
        <ArrowLeft className="h-4 w-4" />
        Back to Home
      </Link>

      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8 gap-2 relative z-10">
          <div className="p-4 rounded-2xl bg-slate-800 shadow-sm border border-slate-700 mb-2">
            <ShieldCheck className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-3xl font-headline font-bold text-white text-center drop-shadow-sm">Admin Portal</h1>
        </div>

        <Card className="bg-slate-900/60 backdrop-blur-xl border-slate-700 rounded-3xl relative z-10 text-slate-200">          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Staff Login</CardTitle>
            <CardDescription className="text-center">
              Restricted access for college administration and IT staff
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Admin Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="staff@eduhelp.edu" 
                  required 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Security Password</Label>
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  required 
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="bg-slate-800/50 border-slate-700 focus:bg-slate-800 transition-colors text-white"
                />
              </div>
            </CardContent>
            <CardFooter className="pt-6 mt-4 border-t border-slate-700/50">
              <Button type="submit" className="w-full bg-primary/90 hover:bg-primary py-6 rounded-xl shadow-md transition-all border border-primary/20 backdrop-blur-sm" disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Verify Identity"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
