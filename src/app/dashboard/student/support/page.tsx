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
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-bold text-primary">Support Center</h1>
        <p className="text-muted-foreground">Get help, find answers, and reach out to the helpdesk team.</p>
      </div>

      {/* Contact Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-white shadow-sm border-none hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-primary/10">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-sm">Email Support</p>
                <p className="text-sm text-muted-foreground mt-1">helpdesk@college.edu</p>
                <p className="text-xs text-muted-foreground mt-0.5">Response within 24 hours</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm border-none hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-green-50">
                <Phone className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="font-semibold text-sm">Phone Helpline</p>
                <p className="text-sm text-muted-foreground mt-1">+91 80-1234-5678</p>
                <p className="text-xs text-muted-foreground mt-0.5">Mon–Fri, 9 AM – 5 PM</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm border-none hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-amber-50">
                <MapPin className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <p className="font-semibold text-sm">Visit In Person</p>
                <p className="text-sm text-muted-foreground mt-1">Admin Block, Room 102</p>
                <p className="text-xs text-muted-foreground mt-0.5">Ground Floor, Main Campus</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Office Hours */}
      <Card className="bg-white shadow-sm border-none">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Office Hours</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="p-3 rounded-lg bg-muted/30">
              <p className="font-medium">Monday – Friday</p>
              <p className="text-muted-foreground">9:00 AM – 5:00 PM</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/30">
              <p className="font-medium">Saturday</p>
              <p className="text-muted-foreground">10:00 AM – 1:00 PM</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/30">
              <p className="font-medium">Sunday</p>
              <p className="text-muted-foreground text-destructive font-medium">Closed</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/30">
              <p className="font-medium">Holidays</p>
              <p className="text-muted-foreground text-destructive font-medium">Closed</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* FAQ Section */}
      <Card className="bg-white shadow-lg border-none">
        <CardHeader>
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Frequently Asked Questions</CardTitle>
          </div>
          <CardDescription>Quick answers to common queries</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border rounded-lg overflow-hidden transition-colors hover:border-primary/30"
            >
              <button
                className="w-full flex items-center justify-between p-4 text-left text-sm font-medium hover:bg-muted/20 transition-colors"
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
              >
                <span>{faq.question}</span>
                {openFaq === index ? (
                  <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0 ml-2" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0 ml-2" />
                )}
              </button>
              {openFaq === index && (
                <div className="px-4 pb-4 text-sm text-muted-foreground leading-relaxed border-t bg-muted/10 pt-3">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
