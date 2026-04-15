"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { GraduationCap, ArrowLeft, Loader2 } from 'lucide-react';
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
      <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 text-slate-700 font-medium hover:text-primary transition-colors backdrop-blur-sm bg-white/30 px-4 py-2 rounded-full border border-white/40">
        <ArrowLeft className="h-4 w-4" />
        Back to Home
      </Link>

      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8 gap-2 relative z-10">
          <div className="p-4 rounded-2xl bg-white/50 shadow-sm border border-white/60 mb-2">
            <GraduationCap className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-3xl font-headline font-bold text-slate-800 text-center drop-shadow-sm">Student Portal</h1>
        </div>

        <Card className="glass-panel border-white/60 rounded-3xl relative z-10">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Login</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access your helpdesk dashboard
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="student@gmail.com" 
                  required 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link href="#" className="text-sm text-primary hover:underline">Forgot password?</Link>
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  required 
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="bg-white/50 border-white/60 focus:bg-white transition-colors"
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4 pt-6 mt-4 border-t border-border/10">
              <Button type="submit" className="w-full bg-primary/90 hover:bg-primary py-6 rounded-xl shadow-md transition-all border border-primary/20 backdrop-blur-sm" disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Sign In"}
              </Button>
              
              <div className="relative w-full py-2">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border/40" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white/50 px-2 text-muted-foreground backdrop-blur-md rounded-full">
                    Or continue with
                  </span>
                </div>
              </div>

              <Button 
                type="button" 
                variant="outline" 
                className="w-full py-6 rounded-xl bg-white/80 hover:bg-white text-slate-700 shadow-sm transition-all border-white/60"
                onClick={handleGoogleLogin} 
                disabled={loading}
              >
                <img src="https://www.google.com/favicon.ico" alt="Google" className="mr-2 h-4 w-4" />
                Sign in with Google
              </Button>

              <p className="text-sm text-center text-muted-foreground pt-2">
                Don't have an account? <Link href="/register" className="text-primary font-semibold hover:underline">Register now</Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
