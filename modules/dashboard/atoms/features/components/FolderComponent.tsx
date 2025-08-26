import { Card } from "@/components/ui/card";
import { useDroppable } from "@dnd-kit/core";
import { Folder, FolderOpen } from "lucide-react";
import { Folder as FolderType } from "../../types/folder.type";

interface FolderComponentProps {
  folder: FolderType;
  atomCount?: number;
}

function FolderComponent({ folder, atomCount = 0 }: FolderComponentProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: folder.id,
  });

  return (
    <div ref={setNodeRef}>
      <Card
        className={`
          relative flex items-center justify-between p-4 
          transition-all duration-200 cursor-pointer
          border-2 border-foreground
          ${
            isOver
              ? "ring-2 ring-white ring-opacity-50 transform scale-102 shadow-none translate-y-1"
              : "shadow-[var(--theme-shadow)] hover:shadow-none hover:translate-y-1"
          }
        `}
        style={{
          background: `linear-gradient(135deg, ${folder.color}cc, ${folder.color}dd)`,
        }}
      >
        {/* Folder Icon and Title */}
        <div className="flex items-center gap-4">
          {isOver ? (
            <FolderOpen className="h-6 w-6 text-white" />
          ) : (
            <Folder className="h-6 w-6 text-white" />
          )}
          <div className="flex flex-col">
            <h2 className="text-lg font-semibold text-white capitalize">
              {folder.name}
            </h2>
            <p className="text-white/80 text-sm inline-block py-0.5">
              {atomCount} {atomCount === 1 ? "atom" : "atoms"}
            </p>
          </div>
        </div>

        {/* Drop indicator */}
        {isOver && (
          <div className="absolute inset-0 border-2 border-dashed border-white/50 bg-white/10 flex items-center justify-center">
            <span className="text-white font-medium">Drop atom here</span>
          </div>
        )}

        {/* Atom count badge */}
        {atomCount > 0 && (
          <div className="bg-primary/30 backdrop-blur-sm rounded-full px-3 py-1">
            <span className="text-white font-medium text-sm">{atomCount}</span>
          </div>
        )}
      </Card>
    </div>
  );
}

export default FolderComponent;
