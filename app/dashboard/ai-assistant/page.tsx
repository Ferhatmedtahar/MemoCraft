import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MessageCircle } from "lucide-react";

export default function AIAssistantPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">AI Assistant</h1>
          <p className="text-muted-foreground mt-2">
            Get help from your personal AI assistant
          </p>
        </div>
        <Button>
          <MessageCircle className="h-4 w-4 mr-2" />
          New Chat
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>AI-Powered Help</CardTitle>
          <CardDescription>
            Ask questions, get explanations, and receive assistance with your
            studies.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Start a conversation with your AI assistant to get help with
            anything you need.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
