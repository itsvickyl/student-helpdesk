"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { GraduationCap, ArrowLeft, Loader2, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { UserRole } from '@/lib/types';
import { getAuth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
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
      toast({ 
        title: "Registration Failed", 
        description: error.message || "Failed to create an account. Please try again.",
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setLoading(true);
    try {
      const { auth, firestore } = initializeFirebase();
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;

      // Check if user already exists
      const userDocRef = doc(firestore, 'users', user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (!userDocSnap.exists()) {
        // Create new user profile in Firestore
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

        // If registering as admin via Google, also create the /admins/ document.
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
    } catch (error: any) {
      console.error("Google Signup Exception:", error);
      toast({ 
        title: "Google Signup Failed", 
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

      <div className="w-full max-w-2xl">
        <div className="flex flex-col items-center mb-8 gap-2 relative z-10">
          <div className="p-4 rounded-2xl bg-white/50 shadow-sm border border-white/60 mb-2">
            <UserPlus className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-3xl font-headline font-bold text-slate-800 text-center drop-shadow-sm">Create Your Account</h1>
        </div>

        <Card className="glass-panel border-white/60 rounded-3xl relative z-10">
          <CardHeader>
            <CardTitle>Register Information</CardTitle>
            <CardDescription>All fields are required for academic records.</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label>I am a...</Label>
                <RadioGroup defaultValue="student" className="flex gap-4" onValueChange={(v) => setRole(v as UserRole)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="student" id="student" />
                    <Label htmlFor="student" className="font-normal">Student</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="admin" id="admin" />
                    <Label htmlFor="admin" className="font-normal">Staff / Admin</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" placeholder="example@gmail.com" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" placeholder="9876543210" required value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                </div>
                {role === 'student' && (
                  <div className="space-y-2">
                    <Label htmlFor="dob">Date of Birth</Label>
                    <Input id="dob" type="date" required value={formData.dob} onChange={(e) => setFormData({...formData, dob: e.target.value})} />
                  </div>
                )}
              </div>

              {role === 'student' && (
                <div className="space-y-2">
                  <Label htmlFor="address">Permanent Address</Label>
                  <Input id="address" required value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} />
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" required value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="bg-white/50 border-white/60 focus:bg-white transition-colors" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input id="confirmPassword" type="password" required value={formData.confirmPassword} onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} className="bg-white/50 border-white/60 focus:bg-white transition-colors" />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4 pt-6 mt-4 border-t border-border/10">
              <Button type="submit" className="w-full bg-primary/90 hover:bg-primary py-6 rounded-xl shadow-md transition-all border border-primary/20 backdrop-blur-sm" disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Complete Registration"}
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
                onClick={handleGoogleSignup} 
                disabled={loading}
              >
                <img src="https://www.google.com/favicon.ico" alt="Google" className="mr-2 h-4 w-4" />
                Sign in with Google
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
