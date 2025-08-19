import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  BarChart3,
  CreditCard,
  FileText,
  Network,
  Palette,
  Sparkles,
  Target,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <h2 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
            Organize, Connect, and
            <span className="text-primary"> Learn Smarter</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Transform your notes into a powerful knowledge system with
            AI-powered summaries, interactive knowledge graphs, and personalized
            learning tools.
          </p>
          <Button
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 text-lg"
          >
            Get Started with Google
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <h3 className="text-3xl font-bold text-center text-foreground mb-12">
            Everything you need to supercharge your learning
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Notes & Folders */}
            <Card className="border-border bg-card hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <h4 className="text-xl font-semibold text-foreground mb-2">
                  Notes & Folders
                </h4>
                <p className="text-muted-foreground">
                  Create rich-text notes and organize them in intuitive folder
                  structures for easy access.
                </p>
              </CardContent>
            </Card>

            {/* Knowledge Graph */}
            <Card className="border-border bg-card hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <Network className="w-6 h-6 text-accent" />
                </div>
                <h4 className="text-xl font-semibold text-foreground mb-2">
                  Knowledge Graph
                </h4>
                <p className="text-muted-foreground">
                  Visualize connections between your notes and discover hidden
                  relationships in your knowledge.
                </p>
              </CardContent>
            </Card>

            {/* AI Summaries */}
            <Card className="border-border bg-card hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <h4 className="text-xl font-semibold text-foreground mb-2">
                  AI Summaries
                </h4>
                <p className="text-muted-foreground">
                  Get instant AI-powered summaries of your notes to quickly
                  review key concepts.
                </p>
              </CardContent>
            </Card>

            {/* Flashcards */}
            <Card className="border-border bg-card hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <CreditCard className="w-6 h-6 text-accent" />
                </div>
                <h4 className="text-xl font-semibold text-foreground mb-2">
                  Flashcards
                </h4>
                <p className="text-muted-foreground">
                  Turn your notes into interactive flashcards for effective
                  spaced repetition learning.
                </p>
              </CardContent>
            </Card>

            {/* Themes & Personalization */}
            <Card className="border-border bg-card hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Palette className="w-6 h-6 text-primary" />
                </div>
                <h4 className="text-xl font-semibold text-foreground mb-2">
                  Themes & Personalization
                </h4>
                <p className="text-muted-foreground">
                  Customize your workspace with beautiful themes and
                  personalization options.
                </p>
              </CardContent>
            </Card>

            {/* Statistics & Streaks */}
            <Card className="border-border bg-card hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="w-6 h-6 text-accent" />
                </div>
                <h4 className="text-xl font-semibold text-foreground mb-2">
                  Statistics & Streaks
                </h4>
                <p className="text-muted-foreground">
                  Track your learning progress with detailed statistics and
                  maintain study streaks.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* App Screenshot Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-5xl text-center">
          <h3 className="text-3xl font-bold text-foreground mb-8">
            See CollabNotes in action
          </h3>
          <div className="bg-card border border-border rounded-2xl p-8 shadow-xl">
            <div className="aspect-video bg-muted rounded-xl flex items-center justify-center">
              <img
                src="/placeholder.svg?height=400&width=800"
                alt="CollabNotes Dashboard Preview"
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 px-4 bg-primary/5">
        <div className="container mx-auto text-center max-w-3xl">
          <Target className="w-16 h-16 text-primary mx-auto mb-6" />
          <h3 className="text-4xl font-bold text-foreground mb-6">
            Ready to transform your learning?
          </h3>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of students and professionals who are already
            learning smarter with CollabNotes.
          </p>
          <Button
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg"
          >
            Get Started with Google
          </Button>
        </div>
      </section>
    </div>
  );
}
