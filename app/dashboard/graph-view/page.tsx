import { Badge } from "@/components/ui/badge";
import KnowledgeGraph from "@/modules/dashboard/graph/components/Graph";

export default function AtomsPage() {
  return (
    <div className="h-full flex flex-col">
      {/* Header stays on top */}
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-2 ">
          Knowledge Graph
          <Badge
            size={"sm"}
            variant={"surface"}
            // className=" ml-2 inline-block  border-2 border-secondary-foreground bg-accent px-1 py-0.5 text-xs font-medium text-secondary-foreground "
          >
            Beta
          </Badge>
        </h1>
        <p className="text-muted-foreground mt-2">
          Visualized connections between your atoms and notes.
        </p>
      </div>
      <KnowledgeGraph />
    </div>
  );
}
