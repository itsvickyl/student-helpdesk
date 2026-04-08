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
import { setSession } from '@/lib/auth-mock';
import { UserRole } from '@/lib/types';

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

    // Simulate Registration
    setTimeout(() => {
      const user = {
        id: Math.random().toString(36).substr(2, 9),
        role,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        dob: role === 'student' ? formData.dob : undefined,
        address: role === 'student' ? formData.address : undefined,
      };
      setSession(user);
      toast({ title: "Registration Successful", description: `Welcome to EduHelp, ${formData.name}!` });
      router.push(`/dashboard/${role}`);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 py-12">
      <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 text-primary font-medium hover:underline">
        <ArrowLeft className="h-4 w-4" />
        Back to Home
      </Link>

      <div className="w-full max-w-2xl">
        <div className="flex flex-col items-center mb-8 gap-2">
          <UserPlus className="h-12 w-12 text-primary" />
          <h1 className="text-3xl font-headline font-bold text-primary text-center">Create Your Account</h1>
        </div>

        <Card className="shadow-xl border-none">
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
                  <Input id="password" type="password" required value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input id="confirmPassword" type="password" required value={formData.confirmPassword} onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 py-6" disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Complete Registration"}
              </Button>
              <p className="text-sm text-center text-muted-foreground">
                Already have an account? <Link href="/login/student" className="text-primary font-semibold hover:underline">Log in</Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
