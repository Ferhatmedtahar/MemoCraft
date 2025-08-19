import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function AtomsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Atoms</h1>
          <p className="text-muted-foreground mt-2">
            Your atomic notes and knowledge bits
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Atom
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Getting Started</CardTitle>
          <CardDescription>
            Atoms are small, focused pieces of knowledge that you can connect
            and build upon.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Start creating your first atom to begin building your knowledge
            base.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
