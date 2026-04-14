import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { GraduationCap, ShieldCheck, TicketCheck, Users, Bot, Zap, Clock } from 'lucide-react';
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
        <section className="relative w-full py-12 md:py-24 lg:py-32 xl:py-48 flex items-center justify-center overflow-hidden">
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
          <div className="absolute top-20 left-10 w-64 h-64 bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-accent/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-80 h-80 bg-blue-300/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
          <div className="container px-4 md:px-6 relative z-10 flex justify-center">
            <div className="flex flex-col items-center space-y-4 text-center glass-panel p-8 md:p-12 rounded-3xl max-w-4xl border border-white/60">
              <div className="space-y-4">
                <h1 className="text-4xl font-headline font-extrabold tracking-tight sm:text-5xl md:text-6xl text-slate-800 drop-shadow-sm">
                  Effortless Support for Your Academic Journey
                </h1>
                <p className="mx-auto max-w-[700px] text-slate-600 md:text-xl font-medium">
                  The central hub for all student inquiries, technical support, and administrative assistance.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 mt-8 w-full sm:w-auto">
                <Button asChild size="lg" className="bg-primary/90 backdrop-blur-sm text-primary-foreground hover:bg-primary shadow-lg px-12 transition-all rounded-full border border-primary/20">
                  <Link href="/register">Get Started / Register</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-white/30 backdrop-blur-md border-y border-white/40">
          <div className="container px-4 md:px-6 mx-auto">
            <h2 className="text-3xl font-headline font-bold text-center mb-12 text-slate-800">How EduHelp Works</h2>
            <div className="grid gap-8 md:grid-cols-3 relative">
              <div className="absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent -translate-y-1/2 hidden md:block" />
              
              <div className="flex flex-col items-center space-y-4 text-center relative z-10 transition-all hover:-translate-y-2">
                <div className="w-16 h-16 rounded-full glass-panel flex items-center justify-center text-primary font-bold text-xl shadow-lg border-2 border-white">
                  1
                </div>
                <h3 className="text-xl font-bold text-slate-800">Submit Ticket</h3>
                <p className="text-slate-600 font-medium">Describe your issue in detail via your secure student dashboard.</p>
              </div>

              <div className="flex flex-col items-center space-y-4 text-center relative z-10 transition-all hover:-translate-y-2">
                <div className="w-16 h-16 rounded-full glass-panel flex items-center justify-center text-primary font-bold text-xl shadow-lg border-2 border-white bg-gradient-to-br from-white/60 to-accent/20">
                  <Bot className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-800">AI Categorization</h3>
                <p className="text-slate-600 font-medium">Our Genkit AI instantly analyzes and routes your ticket to the correct department.</p>
              </div>

              <div className="flex flex-col items-center space-y-4 text-center relative z-10 transition-all hover:-translate-y-2">
                <div className="w-16 h-16 rounded-full glass-panel flex items-center justify-center text-primary font-bold text-xl shadow-lg border-2 border-white">
                  <Zap className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-800">Swift Resolution</h3>
                <p className="text-slate-600 font-medium">Staff connects with you directly to resolve the issue with live updates.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6 mx-auto max-w-3xl">
            <h2 className="text-3xl font-headline font-bold text-center mb-8 text-slate-800">Frequently Asked Questions</h2>
            <Accordion type="single" collapsible className="w-full space-y-4">
              <AccordionItem value="item-1" className="glass-panel px-6 py-2 rounded-2xl border-white/60">
                <AccordionTrigger className="text-lg font-semibold text-slate-800 hover:no-underline hover:text-primary">How long does it usually take to get a response?</AccordionTrigger>
                <AccordionContent className="text-slate-600 font-medium text-base">
                  Most IT and General Inquiry tickets are reviewed within 2-4 hours during business days. Billing and Admissions may take up to 24 hours depending on the complexity of the request.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2" className="glass-panel px-6 py-2 rounded-2xl border-white/60">
                <AccordionTrigger className="text-lg font-semibold text-slate-800 hover:no-underline hover:text-primary">Can I update a ticket after submitting it?</AccordionTrigger>
                <AccordionContent className="text-slate-600 font-medium text-base">
                  Currently, tickets are reviewed as submitted. If you have additional information, please wait for a staff response or submit a follow-up ticket referencing your previous issue.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3" className="glass-panel px-6 py-2 rounded-2xl border-white/60">
                <AccordionTrigger className="text-lg font-semibold text-slate-800 hover:no-underline hover:text-primary">How does the AI Categorization work?</AccordionTrigger>
                <AccordionContent className="text-slate-600 font-medium text-base">
                  We use Google's advanced Genkit AI to read your ticket description and automatically assign it to the most relevant department (IT, Admissions, Billing, etc.) to save time and prevent misrouting.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 glass-panel border-t-0 border-b-0 rounded-t-3xl mt-auto mx-auto max-w-[98%] mb-0">
        <p className="text-xs font-medium text-slate-600">© 2024 EduHelp Connect. All rights reserved.</p>
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
