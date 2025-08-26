import { Card } from "@/components/ui/card";
import { Atom, BookOpen, Bot, User } from "lucide-react";

export default function DashboardPage() {
  const features = [
    {
      title: "Atoms",
      description: "Manage your atomic notes and knowledge bits",
      icon: Atom,
      href: "/dashboard/atoms",
    },
    {
      title: "Flashcards",
      description: "Create and study with interactive flashcards",
      icon: BookOpen,
      href: "/dashboard/flashcards",
    },
    {
      title: "AI Assistant",
      description: "Get help from your personal AI assistant",
      icon: Bot,
      href: "/dashboard/ai-assistant",
    },
    {
      title: "Profile",
      description: "Manage your account and preferences",
      icon: User,
      href: "/dashboard/profile",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Welcome to your Dashboard
        </h1>
        <p className="text-muted-foreground mt-2">
          Manage your notes, flashcards, and get AI assistance all in one place.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <Card
              key={feature.title}
              className="hover:shadow-lg transition-shadow cursor-pointer"
            >
              <Card.Header>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <Card.Title className="text-xl">{feature.title}</Card.Title>
                    <Card.Description>{feature.description}</Card.Description>
                  </div>
                </div>
              </Card.Header>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
