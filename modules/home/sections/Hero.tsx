import AuthForm from "@/components/common/navbar/AuthForm";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { createClientForServer } from "@/utils/supabase/server";
import {
  BarChart3,
  CreditCard,
  FileText,
  Network,
  Palette,
  Sparkles,
} from "lucide-react";
import * as motion from "motion/react-client";
import Link from "next/link";
import Cta from "./Cta";
import InteractiveDemoGraph from "./InteractiveDemoGraph";

export default async function HomePage() {
  const supabase = await createClientForServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="min-h-screen w-full relative overflow-hidden">
        {/* Grid Background with radial fade */}
        <div
          className="absolute inset-0 z-0 bg-primary/5"
          style={{
            backgroundImage: `
              linear-gradient(to right, color-mix(in oklab, var(--color-primary) 20%, transparent) 1px, transparent 1px),
              linear-gradient(to bottom, color-mix(in oklab, var(--color-primary) 20%, transparent) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
            maskImage: "radial-gradient(ellipse at center, black 40%, transparent 80%)",
            WebkitMaskImage: "radial-gradient(ellipse at center, black 40%, transparent 80%)",
          }}
        />
        
        {/* Floating Decorative Badges */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ y: [0, -15, 0], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[20%] left-[10%] md:left-[20%] bg-background/80 backdrop-blur-md border border-border px-4 py-2 rounded-full shadow-lg flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">AI Summaries</span>
          </motion.div>
          
          <motion.div
            animate={{ y: [0, 20, 0], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute top-[35%] right-[5%] md:right-[15%] bg-background/80 backdrop-blur-md border border-border px-4 py-2 rounded-full shadow-lg flex items-center gap-2"
          >
            <Network className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">Knowledge Graphs</span>
          </motion.div>
          
          <motion.div
            animate={{ y: [0, -10, 0], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute bottom-[25%] left-[15%] md:left-[25%] bg-background/80 backdrop-blur-md border border-border px-4 py-2 rounded-full shadow-lg flex items-center gap-2"
          >
            <FileText className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">Smart Notes</span>
          </motion.div>
        </div>

        {/* Your Content/Components */}
        <section className="relative z-10 py-20 px-4 min-h-[100vh] flex items-center justify-center">
          <div className="container mx-auto text-center max-w-4xl mb-20 md:pb-12 flex flex-col items-center gap-6">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-5xl md:text-7xl font-extrabold text-foreground leading-tight tracking-tight"
            >
              Organize, Connect, and <br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent"> Learn Smarter</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-light"
            >
              Transform your notes into a powerful knowledge system with
              AI-powered summaries, interactive knowledge graphs, and
              personalized learning tools.
            </motion.p>
            {user ? (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
                className="mt-4"
              >
                <Button variant="default" size="lg" className="rounded-full shadow-xl hover:shadow-primary/25 transition-all duration-300 px-8 text-lg">
                  <Link href="/dashboard">Go to Dashboard</Link>
                </Button>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
                className="mt-4"
              >
                <AuthForm />
              </motion.div>
            )}
          </div>
        </section>
      </div>
      {/* Features Section */}
      <section className="py-16 px-4 border-t-2 border-border">
        <div className="container mx-auto max-w-6xl">
          <motion.h3
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-3xl font-bold text-center text-foreground mb-12"
          >
            Everything you need to supercharge your learning
          </motion.h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Notes & Folders */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
            >
              <Card>
                <Card.Content className="p-6 ">
                  <div className="w-12 h-12 bg-primary/10 border-2 border-foreground/60 flex items-center justify-center mb-4">
                    <FileText className="w-6 h-6 text-primary" />
                  </div>
                  <h4 className="text-xl font-semibold text-foreground mb-2">
                    Notes & Folders
                  </h4>
                  <p className="text-muted-foreground">
                    Create rich-text notes and organize them in intuitive folder
                    structures.
                  </p>
                </Card.Content>
              </Card>
            </motion.div>

            {/* Knowledge Graph */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            >
              <Card>
                <Card.Content className="p-6">
                  <div className="w-12 h-12 bg-primary/10 border-2 border-foreground/60 flex items-center justify-center mb-4">
                    <Network className="w-6 h-6 text-primary" />
                  </div>
                  <h4 className="text-xl font-semibold text-foreground mb-2">
                    Knowledge Graph
                  </h4>
                  <p className="text-muted-foreground">
                    Visualize connections between your notes and discover hidden
                    relationships in your knowledge.
                  </p>
                </Card.Content>
              </Card>
            </motion.div>

            {/* AI Summaries */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
            >
              <Card>
                <Card.Content className="p-6">
                  <div className="w-12 h-12 bg-primary/10 border-2 border-foreground/60 flex items-center justify-center mb-4">
                    <Sparkles className="w-6 h-6 text-primary" />
                  </div>
                  <h4 className="text-xl font-semibold text-foreground mb-2">
                    AI Summaries
                  </h4>
                  <p className="text-muted-foreground">
                    Get instant AI-powered summaries of your notes to quickly
                    review key concepts.
                  </p>
                </Card.Content>
              </Card>
            </motion.div>

            {/* Flashcards */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
            >
              <Card>
                <Card.Content className="p-6">
                  <div className="w-12 h-12 bg-primary/10 border-2 border-foreground/60 flex items-center justify-center mb-4">
                    <CreditCard className="w-6 h-6 text-primary" />
                  </div>
                  <h4 className="text-xl font-semibold text-foreground mb-2">
                    Flashcards
                  </h4>
                  <p className="text-muted-foreground">
                    Turn your notes into interactive flashcards for effective
                    spaced repetition learning.
                  </p>
                </Card.Content>
              </Card>
            </motion.div>

            {/* Themes & Personalization */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.5 }}
            >
              <Card>
                <Card.Content className="p-6">
                  <div className="w-12 h-12 bg-primary/10 border-2 border-foreground/60 flex items-center justify-center mb-4">
                    <Palette className="w-6 h-6 text-primary" />
                  </div>
                  <h4 className="text-xl font-semibold text-foreground mb-2">
                    Themes & Personalization
                  </h4>
                  <p className="text-muted-foreground ">
                    Customize your workspace with beautiful themes and
                    personalization options.
                  </p>
                </Card.Content>
              </Card>
            </motion.div>

            {/* Statistics & Streaks */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.6 }}
            >
              <Card>
                <Card.Content className="p-6">
                  <div className="w-12 h-12 bg-primary/10 border-2 border-foreground/60 flex items-center justify-center mb-4">
                    <BarChart3 className="w-6 h-6 text-primary" />
                  </div>
                  <h4 className="text-xl font-semibold text-foreground mb-2">
                    Statistics & Streaks
                  </h4>
                  <p className="text-muted-foreground">
                    Track your learning progress with detailed statistics and
                    maintain study streaks.
                  </p>
                </Card.Content>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* App Screenshot Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-5xl text-center">
          <motion.h3
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-3xl font-bold text-foreground mb-8"
          >
            See MemoCraft in action
          </motion.h3>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          >
            <InteractiveDemoGraph />
          </motion.div>
        </div>
      </section>
      <Cta user={user} />
    </div>
  );
}
