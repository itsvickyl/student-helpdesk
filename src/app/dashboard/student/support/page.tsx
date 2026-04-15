"use client";

import { useState } from 'react';
import { LifeBuoy, Mail, Phone, Clock, MapPin, ChevronDown, ChevronUp, MessageSquare, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const faqs = [
  {
    question: "How long does it take to resolve a ticket?",
    answer: "Most tickets are resolved within 24-48 working hours. Complex issues involving multiple departments may take up to 5 working days."
  },
  {
    question: "Can I edit a ticket after submitting?",
    answer: "Currently, tickets cannot be edited after submission. If you need to add more details, please raise a new ticket referencing the original one."
  },
  {
    question: "What categories of issues can I raise?",
    answer: "You can raise issues related to Academics, IT Support, Library, Hostel, Finance, and General Administration."
  },
  {
    question: "How do I check the status of my ticket?",
    answer: "Go to your Dashboard from the sidebar. All your submitted tickets and their current statuses are listed there."
  },
  {
    question: "Who can see my support tickets?",
    answer: "Only you and the college administration/staff can view your tickets. Other students cannot access your submissions."
  },
  {
    question: "What should I do if my issue is urgent?",
    answer: "For urgent matters, please visit the helpdesk office in person or call the support hotline. You can still raise a ticket for record-keeping."
  },
];

export default function SupportPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div>
        <h1 className="text-2xl sm:text-3xl font-headline font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Support Center</h1>
        <p className="text-muted-foreground mt-1 text-sm sm:text-base">Get help, find answers, and reach out to the helpdesk team.</p>
      </div>

      {/* Contact Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 animate-fade-in-up animate-delay-100">
        <Card className="glass-card p-0 overflow-hidden group">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3.5 rounded-2xl bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                <Mail className="h-6 w-6" />
              </div>
              <div className="pt-1">
                <p className="font-semibold text-sm uppercase tracking-wider text-slate-500">Email Support</p>
                <p className="font-bold text-foreground mt-0.5">helpdesk@college.edu</p>
                <p className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1">
                  <Clock className="h-3 w-3" /> Response within 24 hours
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card p-0 overflow-hidden group">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3.5 rounded-2xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
                <Phone className="h-6 w-6" />
              </div>
              <div className="pt-1">
                <p className="font-semibold text-sm uppercase tracking-wider text-slate-500">Phone Helpline</p>
                <p className="font-bold text-foreground mt-0.5">+91 80-1234-5678</p>
                <p className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1">
                  <Clock className="h-3 w-3" /> Mon–Fri, 9 AM – 5 PM
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card p-0 overflow-hidden group">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3.5 rounded-2xl bg-amber-50 text-amber-600 group-hover:bg-amber-500 group-hover:text-white transition-colors duration-300">
                <MapPin className="h-6 w-6" />
              </div>
              <div className="pt-1">
                <p className="font-semibold text-sm uppercase tracking-wider text-slate-500">Visit In Person</p>
                <p className="font-bold text-foreground mt-0.5">Admin Block, Room 102</p>
                <p className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> Ground Floor, Main Campus
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in-up animate-delay-200">
        <div className="lg:col-span-2">
          {/* FAQ Section */}
          <Card className="glass-card border-none shadow-sm h-full">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-xl">Frequently Asked Questions</CardTitle>
                  <CardDescription className="text-sm mt-0.5">Quick answers to common queries</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 pt-2">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-border/40 bg-white/50 overflow-hidden transition-all duration-200 hover:border-primary/30 hover:shadow-sm"
                >
                  <button
                    className="w-full flex items-center justify-between p-4 text-left text-[15px] font-semibold text-slate-800 hover:text-primary transition-colors focus:outline-none"
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  >
                    <span>{faq.question}</span>
                    <div className={`p-1 rounded-full bg-primary/5 text-primary/60 transition-transform duration-200 ${openFaq === index ? 'rotate-180 bg-primary/10 text-primary' : ''}`}>
                      <ChevronDown className="h-4 w-4" />
                    </div>
                  </button>
                  <div className={`
                    overflow-hidden transition-all duration-300 ease-in-out
                    ${openFaq === index ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}
                  `}>
                    <div className="px-4 pb-5 pt-1 text-[14px] text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Office Hours */}
          <Card className="glass-card shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                  <Clock className="h-5 w-5" />
                </div>
                <CardTitle className="text-lg">Office Hours</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="space-y-1">
                {/* Mon-Fri */}
                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/30 transition-colors">
                  <p className="font-semibold text-sm">Mon – Fri</p>
                  <p className="text-sm text-muted-foreground font-medium">9:00 AM – 5:00 PM</p>
                </div>
                <div className="h-[1px] w-full bg-border/40" />
                {/* Saturday */}
                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/30 transition-colors">
                  <p className="font-semibold text-sm">Saturday</p>
                  <p className="text-sm text-muted-foreground font-medium">10:00 AM – 1:00 PM</p>
                </div>
                <div className="h-[1px] w-full bg-border/40" />
                {/* Sunday */}
                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/30 transition-colors">
                  <p className="font-semibold text-sm">Sunday</p>
                  <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20 font-semibold px-2 py-0">Closed</Badge>
                </div>
                <div className="h-[1px] w-full bg-border/40" />
                {/* Holidays */}
                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/30 transition-colors">
                  <p className="font-semibold text-sm">Public Holidays</p>
                  <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20 font-semibold px-2 py-0">Closed</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="glass-card p-6 bg-gradient-to-br from-indigo-500/10 to-transparent border-indigo-500/20">
             <h3 className="font-bold text-lg mb-2 text-indigo-900">Need Immediate Help?</h3>
             <p className="text-sm text-slate-600 mb-4">Check out our comprehensive knowledge base for self-service guides and tutorials.</p>
             <Button variant="outline" className="w-full rounded-xl border-indigo-200 bg-white hover:bg-indigo-50 text-indigo-700 shadow-sm">
               View Documentation
               <ExternalLink className="h-4 w-4 ml-2" />
             </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
