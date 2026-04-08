import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { GraduationCap, ShieldCheck, TicketCheck, Users, UserPlus } from 'lucide-react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function Home() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-bg');

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-16 flex items-center bg-white border-b sticky top-0 z-50">
        <Link className="flex items-center justify-center gap-2" href="/">
          <GraduationCap className="h-8 w-8 text-primary" />
          <span className="text-xl font-headline font-bold text-primary">EduHelp Connect</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
          <Link className="text-sm font-medium hover:text-primary transition-colors" href="/login/student">
            Student Portal
          </Link>
          <Link className="text-sm font-medium hover:text-primary transition-colors" href="/login/admin">
            Admin Portal
          </Link>
          <Separator orientation="vertical" className="h-4" />
          <Link className="text-sm font-bold text-primary hover:underline transition-colors flex items-center gap-1" href="/register">
            <UserPlus className="h-4 w-4" />
            Register
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="relative w-full py-12 md:py-24 lg:py-32 xl:py-48 flex items-center justify-center overflow-hidden bg-primary">
          {heroImage && (
            <div className="absolute inset-0 opacity-20">
              <Image
                src={heroImage.imageUrl}
                alt={heroImage.description}
                fill
                className="object-cover"
                data-ai-hint={heroImage.imageHint}
              />
            </div>
          )}
          <div className="container px-4 md:px-6 relative z-10 text-center text-white">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-headline font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Effortless Support for Your Academic Journey
                </h1>
                <p className="mx-auto max-w-[700px] text-primary-foreground/90 md:text-xl">
                  The central hub for all student inquiries, technical support, and administrative assistance.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg">
                  <Link href="/register">Get Started / Register</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="bg-white/10 text-white border-white hover:bg-white hover:text-primary">
                  <Link href="/login/student">Student Login</Link>
                </Button>
                <Button asChild size="lg" variant="ghost" className="text-white hover:bg-white/20">
                  <Link href="/login/admin">Staff Portal</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center space-y-4 text-center p-6 rounded-xl border border-border shadow-sm">
                <div className="p-3 rounded-full bg-secondary">
                  <TicketCheck className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Smart Ticketing</h3>
                <p className="text-muted-foreground">
                  AI-powered ticket routing ensures your queries reach the right department instantly.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center p-6 rounded-xl border border-border shadow-sm">
                <div className="p-3 rounded-full bg-secondary">
                  <ShieldCheck className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Secure Access</h3>
                <p className="text-muted-foreground">
                  Robust authentication protecting student privacy and administrative data.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center p-6 rounded-xl border border-border shadow-sm">
                <div className="p-3 rounded-full bg-secondary">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Direct Assistance</h3>
                <p className="text-muted-foreground">
                  Real-time updates and direct communication between students and staff.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t bg-white">
        <p className="text-xs text-muted-foreground">© 2024 EduHelp Connect. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4 text-muted-foreground" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4 text-muted-foreground" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}

import { Separator } from '@/components/ui/separator';
