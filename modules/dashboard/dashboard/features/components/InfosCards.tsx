import { Card } from "@/components/ui/card";
import { Atom, BookOpen, NotebookTabs } from "lucide-react";
function InfosCards({
  notes,
  atoms,
  flashcards,
}: {
  notes: number;
  atoms: number;
  flashcards: number;
}) {
  return (
    <>
      <Card>
        <Card.Content className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Notes</p>
              <p className="text-2xl font-bold">{notes}</p>
            </div>
            <div className="w-12 h-12 bg-primary/10 border-2 border-foreground/60 flex items-center justify-center mb-4">
              <NotebookTabs className="w-6 h-6 text-primary" />
            </div>
          </div>
        </Card.Content>
      </Card>

      <Card>
        <Card.Content className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Atoms</p>
              <p className="text-2xl font-bold">{atoms}</p>
            </div>
            <div className="w-12 h-12 bg-primary/10 border-2 border-foreground/60 flex items-center justify-center mb-4">
              <Atom className="w-6 h-6 text-primary" />
            </div>
          </div>
        </Card.Content>
      </Card>

      <Card>
        <Card.Content className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Flashcards
              </p>
              <p className="text-2xl font-bold">{flashcards}</p>
            </div>{" "}
            <div className="w-12 h-12 bg-primary/10 border-2 border-foreground/60 flex items-center justify-center mb-4">
              <BookOpen className="w-6 h-6 text-primary" />
            </div>
          </div>
        </Card.Content>
      </Card>
    </>
  );
}

export default InfosCards;
