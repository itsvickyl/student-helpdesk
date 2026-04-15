"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck, ArrowLeft, Loader2, Eye, EyeOff, Lock } from 'lucide-react';
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
  const [showPassword, setShowPassword] = useState(false);
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
      {/* Blobs */}
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/15 rounded-full filter blur-3xl animate-blob" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-violet-500/10 rounded-full filter blur-3xl animate-blob animation-delay-2000" />

      <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 text-slate-400 font-medium hover:text-white transition-all backdrop-blur-sm bg-white/[0.06] px-4 py-2.5 rounded-full border border-white/10 hover:bg-white/10 hover:border-white/20 group">
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
        Back to Home
      </Link>

      <div className="w-full max-w-md relative z-10">
        <div className="flex flex-col items-center mb-8 gap-3">
          <div className="p-4 rounded-2xl bg-white/[0.06] shadow-lg border border-white/10 backdrop-blur-xl">
            <ShieldCheck className="h-10 w-10 text-indigo-400" />
          </div>
          <div className="text-center">
            <h1 className="text-3xl font-headline font-bold text-white tracking-tight">Admin Portal</h1>
            <p className="text-sm text-slate-400 mt-1">Restricted access for staff</p>
          </div>
        </div>

        <Card className="bg-white/[0.04] backdrop-blur-2xl border-white/[0.08] rounded-[1.5rem] shadow-2xl shadow-black/20 text-slate-200">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl text-center text-white">Staff Login</CardTitle>
            <CardDescription className="text-center text-slate-400">
              Restricted access for college administration and IT staff
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-slate-400">Admin Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="staff@eduhelp.edu" 
                  required 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="h-11 rounded-xl bg-white/[0.06] border-white/10 focus:bg-white/[0.08] focus:border-indigo-400/40 transition-all text-white placeholder:text-slate-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-slate-400">Security Password</Label>
                <div className="relative">
                  <Input 
                    id="password" 
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required 
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="h-11 rounded-xl bg-white/[0.06] border-white/10 focus:bg-white/[0.08] focus:border-indigo-400/40 transition-all text-white pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-2">
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-indigo-500 to-violet-600 hover:opacity-90 h-11 rounded-xl shadow-lg shadow-indigo-500/20 font-semibold transition-all hover:shadow-xl text-white"
                disabled={loading}
              >
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : (
                  <>
                    <Lock className="mr-2 h-4 w-4" />
                    Verify Identity
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
