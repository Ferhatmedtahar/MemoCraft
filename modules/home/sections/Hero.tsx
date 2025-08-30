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
import Cta from "./Cta";

export default async function HomePage() {
  const supabase = await createClientForServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="min-h-screen w-full relative">
        {/* Grid Background */}
        <div
          className="absolute inset-0 z-0 bg-primary/10"
          style={{
            backgroundImage: `
      linear-gradient(
  to right,
  color-mix(in oklab, var(--color-primary) 35%,transparent) 1px,
  transparent 1px
),
linear-gradient(
  to bottom,
  color-mix(in oklab, var(--color-primary) 35%, transparent) 1px,
  transparent 1px
)
`,
            backgroundSize: "40px 40px",
          }}
        />
        {/* Your Content/Components */}
        <section className="relative z-10 py-20 px-4 min-h-[100vh] flex items-center justify-center">
          <div className="container mx-auto text-center max-w-4xl   mb-20   md:pb-12 flex flex-col items-center gap-6">
            <h2 className="text-5xl md:text-6xl font-bold text-foreground leading-none">
              Organize, Connect, and
              <span className="text-primary"> Learn Smarter</span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Transform your notes into a powerful knowledge system with
              AI-powered summaries, interactive knowledge graphs, and
              personalized learning tools.
            </p>
            {user ? (
              <>
                <Button variant="secondary" size={"lg"}>
                  Go to Dashboard
                </Button>
              </>
            ) : (
              <AuthForm />
            )}
          </div>
        </section>
      </div>
      {/* Features Section */}
      <section className="py-16 px-4 border-t-2 border-border">
        <div className="container mx-auto max-w-6xl">
          <h3 className="text-3xl font-bold text-center text-foreground mb-12">
            Everything you need to supercharge your learning
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Notes & Folders */}
            <Card>
              <Card.Content className="p-6">
                <div className="w-12 h-12 bg-primary/10 border-2 border-foreground/60 flex items-center justify-center mb-4">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <h4 className="text-xl font-semibold text-foreground mb-2">
                  Notes & Folders
                </h4>
                <p className="text-muted-foreground">
                  Create rich-text notes and organize them in intuitive folder
                  structures for easy access.
                </p>
              </Card.Content>
            </Card>

            {/* Knowledge Graph */}
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

            {/* AI Summaries */}
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

            {/* Flashcards */}
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

            {/* Themes & Personalization */}
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

            {/* Statistics & Streaks */}
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
          </div>
        </div>
      </section>

      {/* App Screenshot Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-5xl text-center">
          <h3 className="text-3xl font-bold text-foreground mb-8">
            See MemoCraft in action
          </h3>
          <div className="bg-card border border-border rounded-2xl p-8 shadow-xl">
            <div className="aspect-video bg-muted rounded-xl flex items-center justify-center">
              <img
                src="/placeholder.svg?height=400&width=800"
                alt="MemoCraft Dashboard Preview"
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
          </div>
        </div>
      </section>
      <Cta user={user} />
    </div>
  );
}
