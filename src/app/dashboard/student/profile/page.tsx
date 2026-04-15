"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Save, Loader2, ArrowLeft, User, Phone, Mail, Calendar, MapPin, CheckCircle2, ShieldCheck, Camera } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { initializeFirebase } from '@/firebase';
import { doc, updateDoc } from 'firebase/firestore';

export default function ProfilePage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, loading, refreshUser } = useAuth();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    dob: '',
    address: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        dob: user.dob || '',
        address: user.address || '',
      });
    }
  }, [user]);

  const handleSave = async () => {
    if (!user) return;

    // Validate phone
    const phoneRegex = /^[6-9]\d{9}$/;
    if (formData.phone && !phoneRegex.test(formData.phone)) {
      toast({ title: "Invalid Phone Number", description: "Must start with 6-9 and be exactly 10 digits.", variant: "destructive" });
      return;
    }

    if (!formData.name.trim()) {
      toast({ title: "Name Required", description: "Please enter your full name.", variant: "destructive" });
      return;
    }

    setSaving(true);
    try {
      const { firestore } = initializeFirebase();
      const userRef = doc(firestore, 'users', user.id);

      await updateDoc(userRef, {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        dob: formData.dob || null,
        address: formData.address.trim() || null,
      });

      // Also update admins collection if user is admin
      if (user.role === 'admin') {
        try {
          const adminRef = doc(firestore, 'admins', user.id);
          await updateDoc(adminRef, {
            name: formData.name.trim(),
            phone: formData.phone.trim(),
          });
        } catch {
          // Admin doc may not exist for older accounts, ignore
        }
      }

      // Refresh user data in the auth hook
      if (refreshUser) await refreshUser();

      setSaved(true);
      toast({ title: "Profile Updated", description: "Your details have been saved successfully." });
      setTimeout(() => setSaved(false), 3000);
    } catch (error: any) {
      console.error("Profile update error:", error);
      toast({
        title: "Update Failed",
        description: error.message || "Could not save your profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col justify-center items-center gap-3">
        <div className="h-10 w-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        <p className="text-sm text-muted-foreground font-medium">Loading profile...</p>
      </div>
    );
  }

  if (!user) return null;

  const isStudent = user.role === 'student';

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push(`/dashboard/${user.role}`)}
          className="rounded-xl hover:bg-primary/10 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-headline font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Edit Profile</h1>
          <p className="text-muted-foreground mt-1 text-sm">Update your personal information and contact details.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Profile Preview Card */}
        <Card className="glass-card shadow-sm lg:col-span-1 h-min overflow-hidden">
          <div className="h-24 bg-gradient-to-r from-indigo-500/20 to-primary/30 relative">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '16px 16px' }} />
          </div>
          <CardContent className="pt-0 relative px-6 pb-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="relative -mt-12 mb-2">
                <div className="h-24 w-24 rounded-2xl bg-white shadow-xl flex items-center justify-center border-4 border-white">
                  <div className="h-full w-full rounded-xl bg-gradient-to-br from-indigo-50 to-primary/10 flex items-center justify-center">
                    <User className="h-10 w-10 text-primary/80" />
                  </div>
                </div>
                <button className="absolute -bottom-2 -right-2 p-2 bg-primary text-white rounded-full shadow-lg hover:bg-primary/90 transition-transform hover:scale-105">
                  <Camera className="h-3.5 w-3.5" />
                </button>
              </div>
              
              <div>
                <p className="font-bold text-xl tracking-tight text-slate-800">{formData.name || 'Your Name'}</p>
                <div className="flex items-center gap-1.5 justify-center mt-1">
                  {user.role === 'admin' && <ShieldCheck className="h-3.5 w-3.5 text-indigo-500" />}
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 uppercase tracking-wider">
                    {user.role}
                  </span>
                </div>
              </div>

              <div className="w-full pt-6 border-t border-border/40 space-y-4 text-sm text-left">
                <div className="flex items-start gap-3 text-muted-foreground group">
                  <div className="p-2 rounded-lg bg-slate-100 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div className="pt-0.5 min-w-0">
                    <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Email Address</p>
                    <p className="text-slate-700 font-medium truncate">{user.email}</p>
                  </div>
                </div>
                {formData.phone && (
                  <div className="flex items-start gap-3 text-muted-foreground group">
                    <div className="p-2 rounded-lg bg-slate-100 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                      <Phone className="h-4 w-4" />
                    </div>
                    <div className="pt-0.5 min-w-0">
                      <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Phone</p>
                      <p className="text-slate-700 font-medium">{formData.phone}</p>
                    </div>
                  </div>
                )}
                {formData.dob && (
                  <div className="flex items-start gap-3 text-muted-foreground group">
                    <div className="p-2 rounded-lg bg-slate-100 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                      <Calendar className="h-4 w-4" />
                    </div>
                    <div className="pt-0.5 min-w-0">
                      <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Date of Birth</p>
                      <p className="text-slate-700 font-medium">{formData.dob}</p>
                    </div>
                  </div>
                )}
                {formData.address && (
                  <div className="flex items-start gap-3 text-muted-foreground group">
                    <div className="p-2 rounded-lg bg-slate-100 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                      <MapPin className="h-4 w-4" />
                    </div>
                    <div className="pt-0.5 min-w-0">
                      <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Location</p>
                      <p className="text-slate-700 font-medium leading-tight">{formData.address}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Edit Form */}
        <Card className="glass-card shadow-lg border-white/60 lg:col-span-2">
          <CardHeader className="pb-4 pt-6 px-4 sm:px-8 border-b border-border/30">
            <CardTitle className="text-xl">Personal Information</CardTitle>
            <CardDescription className="text-sm">
              Update your details. Verified fields like email cannot be changed.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6 px-4 sm:px-8 pb-6 sm:pb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 ml-1">
                  <User className="h-3.5 w-3.5 text-primary/60" /> Full Name
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter your full name"
                  className="h-11 rounded-xl bg-white/60 border-border/40 focus:bg-white focus:border-primary/30"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 ml-1">
                  <Mail className="h-3.5 w-3.5 text-slate-400" /> Email Address
                </Label>
                <div className="relative">
                  <Input
                    id="email"
                    value={user.email}
                    disabled
                    className="h-11 rounded-xl bg-slate-100/50 border-transparent text-slate-500 cursor-not-allowed opacity-100"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 ml-1">
                  <Phone className="h-3.5 w-3.5 text-primary/60" /> Phone Number
                </Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="9876543210"
                  maxLength={10}
                  className="h-11 rounded-xl bg-white/60 border-border/40 focus:bg-white focus:border-primary/30"
                />
              </div>

              {isStudent && (
                <div className="space-y-2">
                  <Label htmlFor="dob" className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 ml-1">
                    <Calendar className="h-3.5 w-3.5 text-primary/60" /> Date of Birth
                  </Label>
                  <Input
                    id="dob"
                    type="date"
                    value={formData.dob}
                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                    className="h-11 rounded-xl bg-white/60 border-border/40 focus:bg-white focus:border-primary/30"
                  />
                </div>
              )}
            </div>

            {isStudent && (
              <div className="space-y-2">
                <Label htmlFor="address" className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 ml-1">
                  <MapPin className="h-3.5 w-3.5 text-primary/60" /> Permanent Address
                </Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Enter your full apartment, street, and city address"
                  className="h-11 rounded-xl bg-white/60 border-border/40 focus:bg-white focus:border-primary/30"
                />
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-6 mt-4 border-t border-border/30">
              <Button
                onClick={handleSave}
                disabled={saving}
                className="bg-gradient-to-r from-primary to-indigo-600 hover:opacity-90 rounded-xl px-8 h-11 font-semibold shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:-translate-y-0.5"
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : saved ? (
                  <>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Saved!
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
              <Button
                variant="ghost"
                onClick={() => router.push(`/dashboard/${user.role}`)}
                className="rounded-xl px-6 h-11 font-medium hover:bg-slate-100"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
