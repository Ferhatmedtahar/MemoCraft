import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus } from "lucide-react";

export default function AtomsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Atoms</h1>
          <p className="text-muted-foreground mt-2">
            Your notes and knowledge bits
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Note
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Getting Started</CardTitle>
          <CardDescription>
            Notes are large, focused pieces of knowledge that you can connect
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Start creating your first note to begin building your knowledge
            base.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
