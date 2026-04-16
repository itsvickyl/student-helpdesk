"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { GraduationCap, ArrowLeft, Loader2, UserPlus, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { UserRole } from '@/lib/types';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithRedirect, getRedirectResult } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<UserRole>('student');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    dob: '',
    address: '',
    password: '',
    confirmPassword: ''
  });

  // Handle redirect result when returning from Google sign-in redirect
  useEffect(() => {
    const handleRedirectResult = async () => {
      try {
        const { auth, firestore } = initializeFirebase();
        const result = await getRedirectResult(auth);
        if (result) {
          const user = result.user;
          const userDocRef = doc(firestore, 'users', user.uid);
          const userDocSnap = await getDoc(userDocRef);
          if (!userDocSnap.exists()) {
            await setDoc(userDocRef, {
              id: user.uid,
              role,
              name: user.displayName || 'New User',
              email: user.email || '',
              phone: '',
              dob: null,
              address: null,
              createdAt: new Date().toISOString()
            });
            if (role === 'admin') {
              await setDoc(doc(firestore, 'admins', user.uid), {
                id: user.uid,
                name: user.displayName || 'New User',
                email: user.email || '',
                phone: '',
                createdAt: new Date().toISOString()
              });
            }
            toast({ title: "Registration Successful", description: `Welcome to EduHelp, ${user.displayName || 'Student'}!` });
          } else {
            toast({ title: "Login Successful", description: `Welcome back, ${user.displayName || 'Student'}!` });
          }
          router.push(`/dashboard/${role}`);
        }
      } catch (error: any) {
        console.error("Redirect signup error:", error);
        if (error.code !== 'auth/redirect-cancelled-by-user') {
          toast({
            title: "Signup Failed",
            description: error.message || "Failed to complete Google sign-up.",
            variant: "destructive"
          });
        }
      }
    };
    handleRedirectResult();
  }, [router, toast, role]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Data Validation
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(formData.phone)) {
      toast({ title: "Invalid Phone Number", description: "Must start with 6-9 and be exactly 10 digits.", variant: "destructive" });
      setLoading(false);
      return;
    }

    if (!formData.email.includes('@')) {
       toast({ title: "Invalid Email", description: "Please enter a valid email address.", variant: "destructive" });
       setLoading(false);
       return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({ title: "Passwords Mismatch", description: "Password and confirmation must match.", variant: "destructive" });
      setLoading(false);
      return;
    }

    // Firebase Registration
    try {
      const { auth, firestore } = initializeFirebase();
      
      // 1. Create secure user account
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      // 2. Save profile data to Firestore
      await setDoc(doc(firestore, 'users', user.uid), {
        id: user.uid,
        role,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        dob: role === 'student' ? formData.dob : null,
        address: role === 'student' ? formData.address : null,
        createdAt: new Date().toISOString()
      });

      // If registering as admin, also create a document in the /admins/ collection.
      // Firestore security rules check exists(/admins/{uid}) to grant admin privileges.
      if (role === 'admin') {
        await setDoc(doc(firestore, 'admins', user.uid), {
          id: user.uid,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          createdAt: new Date().toISOString()
        });
      }

      toast({ title: "Registration Successful", description: `Welcome to EduHelp, ${formData.name}!` });
      router.push(`/dashboard/${role}`);
    } catch (error: any) {
      console.error("Registration Exception:", error);
      let description = "Failed to create an account. Please try again.";
      if (error.code === 'auth/email-already-in-use') {
        description = "This email is already registered. Please log in instead.";
      } else if (error.code === 'auth/weak-password') {
        description = "Password is too weak. Please use at least 6 characters.";
      } else if (error.code === 'auth/invalid-email') {
        description = "The email address is not valid.";
      }
      toast({ 
        title: "Registration Failed", 
        description,
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setLoading(true);
    try {
      const { auth } = initializeFirebase();
      const provider = new GoogleAuthProvider();
      // Use redirect-based sign-in — more reliable than popup across browsers
      // The redirect result is handled in the useEffect above
      await signInWithRedirect(auth, provider);
    } catch (error: any) {
      console.error("Google Signup Exception:", error);
      toast({ 
        title: "Google Signup Failed", 
        description: error.message || "Failed to authenticate with Google.", 
        variant: "destructive" 
      });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen mesh-bg flex flex-col items-center justify-center p-4 py-12 relative overflow-hidden">
      {/* Blobs */}
      <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-primary/10 rounded-full filter blur-3xl animate-blob" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] bg-accent/10 rounded-full filter blur-3xl animate-blob animation-delay-2000" />

      <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 text-slate-600 font-medium hover:text-primary transition-all backdrop-blur-sm bg-white/40 px-4 py-2.5 rounded-full border border-white/50 hover:bg-white/60 hover:shadow-sm group">
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
        Back to Home
      </Link>

      <div className="w-full max-w-2xl relative z-10">
        <div className="flex flex-col items-center mb-8 gap-3">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-white/70 to-white/40 shadow-lg shadow-primary/5 border border-white/60 backdrop-blur-xl">
            <UserPlus className="h-10 w-10 text-primary" />
          </div>
          <div className="text-center">
            <h1 className="text-3xl font-headline font-bold text-slate-800 tracking-tight">Create Your Account</h1>
            <p className="text-sm text-slate-500 mt-1">Join EduHelp Connect in minutes</p>
          </div>
        </div>

        <Card className="glass-panel border-white/50 rounded-[1.5rem] shadow-xl shadow-black/[0.03]">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl">Registration Details</CardTitle>
            <CardDescription>All fields are required for academic records.</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              {/* Role selector */}
              <div className="space-y-3">
                <Label className="text-xs font-semibold uppercase tracking-wider text-slate-500">I am a...</Label>
                <RadioGroup defaultValue="student" className="flex gap-3" onValueChange={(v) => setRole(v as UserRole)}>
                  <label htmlFor="student" className={`flex-1 flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${role === 'student' ? 'border-primary/40 bg-primary/[0.04]' : 'border-border/30 bg-white/30 hover:border-border/50'}`}>
                    <RadioGroupItem value="student" id="student" />
                    <div>
                      <p className="font-semibold text-sm text-slate-800">Student</p>
                      <p className="text-[11px] text-slate-500">Access helpdesk support</p>
                    </div>
                  </label>
                  <label htmlFor="admin" className={`flex-1 flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${role === 'admin' ? 'border-primary/40 bg-primary/[0.04]' : 'border-border/30 bg-white/30 hover:border-border/50'}`}>
                    <RadioGroupItem value="admin" id="admin" />
                    <div>
                      <p className="font-semibold text-sm text-slate-800">Staff / Admin</p>
                      <p className="text-[11px] text-slate-500">Manage tickets</p>
                    </div>
                  </label>
                </RadioGroup>
              </div>

              {/* Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-xs font-semibold uppercase tracking-wider text-slate-500">Full Name</Label>
                  <Input id="name" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="h-11 rounded-xl bg-white/60 border-border/40 focus:bg-white focus:border-primary/30 transition-all" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-slate-500">Email Address</Label>
                  <Input id="email" type="email" placeholder="example@gmail.com" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="h-11 rounded-xl bg-white/60 border-border/40 focus:bg-white focus:border-primary/30 transition-all placeholder:text-slate-400" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-xs font-semibold uppercase tracking-wider text-slate-500">Phone Number</Label>
                  <Input id="phone" placeholder="9876543210" required value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value.replace(/[^0-9]/g, '').slice(0, 10)})} maxLength={10} className="h-11 rounded-xl bg-white/60 border-border/40 focus:bg-white focus:border-primary/30 transition-all placeholder:text-slate-400" />
                </div>
                {role === 'student' && (
                  <div className="space-y-2">
                    <Label htmlFor="dob" className="text-xs font-semibold uppercase tracking-wider text-slate-500">Date of Birth</Label>
                    <Input id="dob" type="date" required value={formData.dob} onChange={(e) => setFormData({...formData, dob: e.target.value})} className="h-11 rounded-xl bg-white/60 border-border/40 focus:bg-white focus:border-primary/30 transition-all" />
                  </div>
                )}
              </div>

              {role === 'student' && (
                <div className="space-y-2">
                  <Label htmlFor="address" className="text-xs font-semibold uppercase tracking-wider text-slate-500">Permanent Address</Label>
                  <Input id="address" required value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} className="h-11 rounded-xl bg-white/60 border-border/40 focus:bg-white focus:border-primary/30 transition-all" />
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-slate-500">Password</Label>
                  <div className="relative">
                    <Input id="password" type={showPassword ? 'text' : 'password'} autoComplete="new-password" required value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="h-11 rounded-xl bg-white/60 border-border/40 focus:bg-white focus:border-primary/30 transition-all pr-10" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-xs font-semibold uppercase tracking-wider text-slate-500">Confirm Password</Label>
                  <Input id="confirmPassword" type="password" autoComplete="new-password" required value={formData.confirmPassword} onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} className="h-11 rounded-xl bg-white/60 border-border/40 focus:bg-white focus:border-primary/30 transition-all" />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4 pt-2">
              <Button type="submit" className="w-full bg-gradient-to-r from-primary to-indigo-600 hover:opacity-90 h-11 rounded-xl shadow-lg shadow-primary/15 font-semibold transition-all hover:shadow-xl hover:shadow-primary/20" disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Complete Registration"}
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
                onClick={handleGoogleSignup} 
                disabled={loading}
              >
                <img src="https://www.google.com/favicon.ico" alt="Google" className="mr-2.5 h-4 w-4" />
                Sign up with Google
              </Button>

              <p className="text-sm text-center text-muted-foreground pt-2">
                Already have an account? <Link href="/login/student" className="text-primary font-semibold hover:underline">Log in</Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
