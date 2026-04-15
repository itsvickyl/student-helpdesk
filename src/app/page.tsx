import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { GraduationCap, ShieldCheck, TicketCheck, Users, Bot, Zap, Clock, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import PillNav from '@/components/ui/PillNav';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function Home() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-bg');

  return (
    <div className="flex flex-col min-h-screen mesh-bg">
      <PillNav
        logo={<GraduationCap className="h-6 w-6 text-white" />}
        logoAlt="EduHelp Connect Logo"
        brandName="Student Helpdesk"
        items={[
          { label: 'Student Portal', href: '/login/student' },
          { label: 'Admin Portal', href: '/login/admin' },
          { label: 'Register', href: '/register' }
        ]}
        activeHref="/"
        className="custom-nav"
        ease="power2.easeOut"
        baseColor="#334155"
        pillColor="rgba(255, 255, 255, 0.8)"
        hoveredPillTextColor="#ffffff"
        pillTextColor="#334155"
        initialLoadAnimation={true}
      />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative w-full py-16 md:py-28 lg:py-36 xl:py-48 flex items-center justify-center overflow-hidden">
          {heroImage && (
            <div className="absolute inset-0 opacity-15">
              <Image
                src={heroImage.imageUrl}
                alt={heroImage.description}
                fill
                className="object-cover"
                data-ai-hint={heroImage.imageHint}
              />
            </div>
          )}
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/15 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
          <div className="absolute top-40 right-10 w-80 h-80 bg-accent/15 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-96 h-96 bg-violet-300/15 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
          
          <div className="container px-4 md:px-6 relative z-10 flex justify-center">
            <div className="flex flex-col items-center space-y-6 text-center glass-panel p-10 md:p-16 rounded-[2rem] max-w-4xl border border-white/50">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/8 border border-primary/15 text-primary text-sm font-medium">
                <Sparkles className="h-3.5 w-3.5" />
                AI-Powered Student Support
              </div>
              <div className="space-y-5">
                <h1 className="text-4xl font-headline font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl bg-gradient-to-b from-slate-800 to-slate-600 bg-clip-text text-transparent leading-[1.1]">
                  Effortless Support for Your Academic Journey
                </h1>
                <p className="mx-auto max-w-[600px] text-slate-500 md:text-lg leading-relaxed">
                  The central hub for all student inquiries, technical support, and administrative assistance — powered by intelligent routing.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 mt-4 w-full sm:w-auto">
                <Button asChild size="lg" className="bg-gradient-to-r from-primary to-indigo-600 text-white hover:opacity-90 shadow-lg shadow-primary/20 px-8 h-12 rounded-full font-semibold text-base transition-all hover:shadow-xl hover:shadow-primary/25 hover:-translate-y-0.5">
                  <Link href="/register">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="bg-white/60 backdrop-blur-sm hover:bg-white border-border/50 px-8 h-12 rounded-full font-semibold text-base">
                  <Link href="/login/student">
                    Student Login
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* How it Works */}
        <section className="w-full py-16 md:py-24 lg:py-32 bg-white/40 backdrop-blur-lg border-y border-white/50">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="text-center mb-14">
              <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">How It Works</p>
              <h2 className="text-3xl md:text-4xl font-headline font-bold text-slate-800">Three simple steps to resolution</h2>
            </div>
            <div className="grid gap-8 md:grid-cols-3 relative max-w-5xl mx-auto">
              <div className="absolute top-[72px] left-[16%] right-[16%] h-[2px] bg-gradient-to-r from-primary/20 via-accent/30 to-primary/20 hidden md:block" />
              
              {[
                { step: '1', icon: TicketCheck, title: 'Submit Ticket', desc: 'Describe your issue in detail via your secure student dashboard.' },
                { step: null, icon: Bot, title: 'AI Categorization', desc: 'Our Genkit AI instantly analyzes and routes your ticket to the correct department.' },
                { step: null, icon: Zap, title: 'Swift Resolution', desc: 'Staff connects with you directly to resolve the issue with live updates.' },
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center space-y-5 text-center relative z-10 group">
                  <div className="w-[88px] h-[88px] rounded-3xl glass-panel flex items-center justify-center shadow-lg border-2 border-white/70 group-hover:shadow-xl group-hover:-translate-y-2 transition-all duration-300">
                    {item.step ? (
                      <span className="text-2xl font-bold bg-gradient-to-br from-primary to-indigo-500 bg-clip-text text-transparent">{item.step}</span>
                    ) : (
                      <item.icon className="h-8 w-8 text-primary" />
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-slate-800">{item.title}</h3>
                  <p className="text-slate-500 leading-relaxed max-w-[280px]">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features badges */}
        <section className="w-full py-16 md:py-20">
          <div className="container px-4 md:px-6 mx-auto max-w-4xl">
            <div className="text-center mb-10">
              <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">Why Choose Us</p>
              <h2 className="text-3xl md:text-4xl font-headline font-bold text-slate-800">Built for modern education</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { icon: Bot, title: 'AI-Powered Routing', desc: 'Automatic department classification using Google Genkit AI' },
                { icon: Clock, title: 'Real-Time Updates', desc: 'Live ticket status tracking with instant notifications' },
                { icon: ShieldCheck, title: 'Secure & Private', desc: 'Firebase auth with role-based access control' },
                { icon: Users, title: 'Multi-Role Support', desc: 'Separate dashboards for students and administration' },
              ].map((f, i) => (
                <div key={i} className="group glass-card p-5 flex items-start gap-4">
                  <div className="h-10 w-10 shrink-0 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center group-hover:from-primary/20 group-hover:to-accent/20 transition-all">
                    <f.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800 mb-0.5">{f.title}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="w-full py-16 md:py-24 lg:py-32 bg-white/30 backdrop-blur-sm">
          <div className="container px-4 md:px-6 mx-auto max-w-3xl">
            <div className="text-center mb-10">
              <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">FAQ</p>
              <h2 className="text-3xl md:text-4xl font-headline font-bold text-slate-800">Frequently Asked Questions</h2>
            </div>
            <Accordion type="single" collapsible className="w-full space-y-3">
              <AccordionItem value="item-1" className="glass-panel px-6 py-1 rounded-2xl border-white/50 data-[state=open]:shadow-lg transition-shadow">
                <AccordionTrigger className="text-[15px] font-semibold text-slate-800 hover:no-underline hover:text-primary py-4">How long does it usually take to get a response?</AccordionTrigger>
                <AccordionContent className="text-slate-500 text-[15px] leading-relaxed pb-5">
                  Most IT and General Inquiry tickets are reviewed within 2-4 hours during business days. Billing and Admissions may take up to 24 hours depending on the complexity of the request.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2" className="glass-panel px-6 py-1 rounded-2xl border-white/50 data-[state=open]:shadow-lg transition-shadow">
                <AccordionTrigger className="text-[15px] font-semibold text-slate-800 hover:no-underline hover:text-primary py-4">Can I update a ticket after submitting it?</AccordionTrigger>
                <AccordionContent className="text-slate-500 text-[15px] leading-relaxed pb-5">
                  Currently, tickets are reviewed as submitted. If you have additional information, please wait for a staff response or submit a follow-up ticket referencing your previous issue.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3" className="glass-panel px-6 py-1 rounded-2xl border-white/50 data-[state=open]:shadow-lg transition-shadow">
                <AccordionTrigger className="text-[15px] font-semibold text-slate-800 hover:no-underline hover:text-primary py-4">How does the AI Categorization work?</AccordionTrigger>
                <AccordionContent className="text-slate-500 text-[15px] leading-relaxed pb-5">
                  We use Google&apos;s advanced Genkit AI to read your ticket description and automatically assign it to the most relevant department (IT, Admissions, Billing, etc.) to save time and prevent misrouting.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-8 px-6 bg-white/40 backdrop-blur-lg border-t border-white/50">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-primary/60" />
            <p className="text-sm font-medium text-slate-500">© 2024 EduHelp Connect. All rights reserved.</p>
          </div>
          <nav className="flex gap-6">
            <Link className="text-sm text-slate-500 hover:text-primary transition-colors" href="#">
              Terms of Service
            </Link>
            <Link className="text-sm text-slate-500 hover:text-primary transition-colors" href="#">
              Privacy
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
