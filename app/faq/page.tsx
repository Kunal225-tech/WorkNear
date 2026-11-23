"use client";

import { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { Button } from "@/components/ui/button";
import { ChevronDown, HelpCircle, ArrowRight, MessageSquare, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
  {
    id: "item-1",
    question: "What is WorkNear?",
    answer: "WorkNear is a local jobs and services platform designed to connect community members, small businesses, and neighbors with nearby workers for everyday tasks, home maintenance, repairs, and flexible gigs.",
  },
  {
    id: "item-2",
    question: "How do I find jobs near me?",
    answer: "You can visit the 'Browse Jobs' page to explore active listings around your location. Filter by category, location, or payment rate to find tasks that match your skills and schedule.",
  },
  {
    id: "item-3",
    question: "How do I post a job?",
    answer: "Click the 'Post a Job' button, fill in the job details (such as title, description, category, location, budget, and required date), and submit. Local workers will be able to view and apply for your job.",
  },
  {
    id: "item-4",
    question: "Is WorkNear free to use?",
    answer: "Yes! Browsing available jobs and posting tasks on WorkNear is free for community members.",
  },
  {
    id: "item-5",
    question: "How do I contact a job poster or worker?",
    answer: "Once a worker applies to a job post, the job poster can view their profile and application details. After accepting an application, both parties can connect directly to discuss project specifics.",
  },
  {
    id: "item-6",
    question: "How does job assignment work?",
    answer: "When workers submit applications for a job, the job poster reviews applicant profiles and clicks 'Accept' on the preferred worker. The job status automatically changes to 'Assigned'.",
  },
  {
    id: "item-7",
    question: "Do I need an account to browse jobs?",
    answer: "Yes, you need a free WorkNear account and must be signed in to browse job listings, search for local tasks, post jobs, or submit applications.",
  },
];

export default function FaqPage() {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({
    "item-1": true, // First FAQ open by default
  });

  const toggleItem = (id: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />

      <main className="flex-1">
        {/* Header Section */}
        <section className="border-b border-border bg-gradient-to-b from-primary/5 via-background to-background py-14 md:py-20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary mb-4">
              <HelpCircle size={14} />
              <span>Frequently Asked Questions</span>
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl md:text-5xl">
              Everything you need to know
            </h1>

            <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
              Got questions about WorkNear? Find quick answers about browsing jobs, posting tasks, connecting locally, and getting work done.
            </p>
          </div>
        </section>

        {/* Accordion FAQ Section */}
        <section className="py-12 md:py-20 bg-background">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <div className="space-y-4">
              {faqs.map((faq) => {
                const isOpen = !!openItems[faq.id];
                return (
                  <div
                    key={faq.id}
                    className="rounded-2xl border border-border bg-card shadow-sm transition-all duration-200 hover:border-primary/30 overflow-hidden"
                  >
                    <button
                      onClick={() => toggleItem(faq.id)}
                      className="flex w-full items-center justify-between p-5 text-left text-base font-semibold text-foreground transition-colors hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
                      aria-expanded={isOpen}
                    >
                      <span className="pr-4">{faq.question}</span>
                      <ChevronDown
                        size={20}
                        className={cn(
                          "shrink-0 text-muted-foreground transition-transform duration-200",
                          isOpen && "rotate-180 text-primary"
                        )}
                      />
                    </button>

                    {isOpen && (
                      <div className="px-5 pb-5 pt-0 text-sm leading-relaxed text-muted-foreground border-t border-border/40 mt-1 pt-4 animate-in fade-in-50 duration-150">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Support Callout */}
            <div className="mt-16 rounded-2xl border border-border bg-secondary/50 p-8 text-center sm:flex sm:items-center sm:justify-between sm:text-left">
              <div>
                <h3 className="text-lg font-bold text-foreground">Still have questions?</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Can't find what you're looking for? Explore open tasks or post your own.
                </p>
              </div>
              <div className="mt-6 sm:mt-0 flex flex-wrap gap-3 shrink-0">
                <Link href="/jobs">
                  <Button variant="outline" className="rounded-xl gap-2 font-semibold">
                    <span>Browse Jobs</span>
                    <ArrowRight size={16} />
                  </Button>
                </Link>
                <Link href="/post-job">
                  <Button className="rounded-xl gap-2 font-semibold">
                    <PlusCircle size={16} />
                    <span>Post a Job</span>
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
