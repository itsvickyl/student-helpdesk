"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { GraduationCap, ArrowLeft, Loader2, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { initializeFirebase } from '@/firebase';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

export default function StudentLoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate validation
    if (!formData.email.endsWith('@gmail.com') && !formData.email.endsWith('.edu')) {
       toast({ title: "Validation Error", description: "Please use a valid email format (e.g., example@gmail.com)", variant: "destructive" });
       setLoading(false);
       return;
    }

    // Firebase Login
    try {
      const { auth } = initializeFirebase();
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      
      toast({ title: "Login Successful", description: "Welcome back!" });
      router.push('/dashboard/student');
    } catch (error: any) {
      console.error("Login Exception:", error);
      toast({ 
        title: "Login Failed", 
        description: "Invalid email or password. Please try again.", 
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const { auth, firestore } = initializeFirebase();
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;

      // Ensure the user exists in the Firestore users collection 
      // (in case they login with Google instead of registering first)
      const userDocRef = doc(firestore, 'users', user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (!userDocSnap.exists()) {
        await setDoc(userDocRef, {
          id: user.uid,
          role: 'student', // Default role for Google Login via student portal
          name: user.displayName || 'Unknown Student',
          email: user.email || '',
          phone: '',
          dob: null,
          address: null,
          createdAt: new Date().toISOString()
        });
      }

      toast({ title: "Login Successful", description: `Welcome back, ${user.displayName || 'Student'}!` });
      router.push('/dashboard/student');
    } catch (error: any) {
      console.error("Google Login Exception:", error);
      toast({ 
        title: "Google Login Failed", 
        description: error.message || "Failed to authenticate with Google.", 
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen mesh-bg flex flex-col items-center justify-center p-4 py-12 relative overflow-hidden">
      {/* Blobs */}
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/10 rounded-full filter blur-3xl animate-blob" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-accent/10 rounded-full filter blur-3xl animate-blob animation-delay-2000" />

      <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 text-slate-600 font-medium hover:text-primary transition-all backdrop-blur-sm bg-white/40 px-4 py-2.5 rounded-full border border-white/50 hover:bg-white/60 hover:shadow-sm group">
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
        Back to Home
      </Link>

      <div className="w-full max-w-md relative z-10">
        <div className="flex flex-col items-center mb-8 gap-3">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-white/70 to-white/40 shadow-lg shadow-primary/5 border border-white/60 backdrop-blur-xl">
            <GraduationCap className="h-10 w-10 text-primary" />
          </div>
          <div className="text-center">
            <h1 className="text-3xl font-headline font-bold text-slate-800 tracking-tight">Student Portal</h1>
            <p className="text-sm text-slate-500 mt-1">Access your helpdesk dashboard</p>
          </div>
        </div>

        <Card className="glass-panel border-white/50 rounded-[1.5rem] shadow-xl shadow-black/[0.03]">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl text-center">Welcome back</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to sign in
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-slate-500">Email Address</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="student@gmail.com" 
                  required 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="h-11 rounded-xl bg-white/60 border-border/40 focus:bg-white focus:border-primary/30 transition-all placeholder:text-slate-400"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-slate-500">Password</Label>
                  <Link href="#" className="text-xs text-primary/80 hover:text-primary font-medium transition-colors">Forgot password?</Link>
                </div>
                <div className="relative">
                  <Input 
                    id="password" 
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required 
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="h-11 rounded-xl bg-white/60 border-border/40 focus:bg-white focus:border-primary/30 transition-all pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4 pt-2">
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-primary to-indigo-600 hover:opacity-90 h-11 rounded-xl shadow-lg shadow-primary/15 font-semibold transition-all hover:shadow-xl hover:shadow-primary/20"
                disabled={loading}
              >
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Sign In"}
              </Button>
              
              <div className="relative w-full py-3">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border/30" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white/60 px-3 text-muted-foreground/70 backdrop-blur-md rounded-full text-[11px] tracking-wider font-medium">
                    Or continue with
                  </span>
                </div>
              </div>

              <Button 
                type="button" 
                variant="outline" 
                className="w-full h-11 rounded-xl bg-white/70 hover:bg-white text-slate-700 shadow-sm transition-all border-border/40 hover:border-border/60 hover:shadow-md font-medium"
                onClick={handleGoogleLogin} 
                disabled={loading}
              >
                <img src="https://www.google.com/favicon.ico" alt="Google" className="mr-2.5 h-4 w-4" />
                Sign in with Google
              </Button>

              <p className="text-sm text-center text-muted-foreground pt-2">
                Don&apos;t have an account? <Link href="/register" className="text-primary font-semibold hover:underline">Register now</Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
