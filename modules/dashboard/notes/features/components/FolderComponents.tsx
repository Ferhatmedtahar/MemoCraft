import { useDroppable } from "@dnd-kit/core";
import { Folder, FolderOpen } from "lucide-react";
import { Folder as FolderType } from "../../types/folder.type";

interface FolderComponentProps {
  folder: FolderType;
  NoteCount?: number;
}

function FolderComponent({ folder, NoteCount = 0 }: FolderComponentProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: folder.id,
  });

  return (
    <div
      ref={setNodeRef}
      className={`
        relative flex items-center justify-between  p-4 
        transition-all duration-200 cursor-pointer
        border-2 border-foreground
        ${
          isOver
            ? "ring-2 ring-white ring-opacity-50 transform scale-102 shadow-none translate-y-1"
            : "shadow-[var(--theme-shadow)] hover:shadow-none hover:translate-y-1"
        }
      `}
      style={{
        background: `linear-gradient(135deg, ${folder.color}aa, ${folder.color}dd)`,
      }}
    >
      {/* Folder Icon and Title */}
      <div className="flex items-center gap-3">
        {isOver ? (
          <FolderOpen className="h-6 w-6 text-white" />
        ) : (
          <Folder className="h-6 w-6 text-white" />
        )}
        <div>
          <h2 className="text-lg font-semibold text-white">{folder.name}</h2>
          <p className="text-white/70 text-sm">
            {NoteCount} {NoteCount === 1 ? "note" : "notes"}
          </p>
        </div>
      </div>

      {/* Drop indicator */}
      {isOver && (
        <div className="absolute inset-0 rounded-lg border-2 border-dashed border-white/50 bg-white/10 flex items-center justify-center">
          <span className="text-white font-medium">Drop atom here</span>
        </div>
      )}

      {/* Atom count badge */}
      {NoteCount > 0 && (
        <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
          <span className="text-white font-medium text-sm">{NoteCount}</span>
        </div>
      )}
    </div>
  );
}

export default FolderComponent;
// import { useDroppable } from "@dnd-kit/core";
// import { Folder, FolderOpen } from "lucide-react";
// import { Folder as FolderType } from "../../types/folder.type";

// interface FolderComponentProps {
//   folder: FolderType;
//   NoteCount?: number;
// }

// function FolderComponent({ folder, NoteCount = 0 }: FolderComponentProps) {
//   const { isOver, setNodeRef } = useDroppable({
//     id: folder.id,
//   });

//   return (
//     <div
//       ref={setNodeRef}
//       className={`relative flex items-center justify-between rounded-lg p-4 transition-all duration-200 ${
//         isOver
//           ? "ring-2 ring-white ring-opacity-50 transform scale-105"
//           : "hover:transform hover:scale-102"
//       }`}
//       style={{
//         background: `linear-gradient(135deg, ${folder.color}aa, ${folder.color}dd)`,
//         border: `2px solid ${isOver ? "#ffffff" : folder.color}`,
//         boxShadow: isOver
//           ? "0 8px 32px rgba(0,0,0,0.3)"
//           : "0 4px 16px rgba(0,0,0,0.1)",
//       }}
//     >
//       {/* Folder Icon and Title */}
//       <div className="flex items-center gap-3">
//         {isOver ? (
//           <FolderOpen className="h-6 w-6 text-white" />
//         ) : (
//           <Folder className="h-6 w-6 text-white" />
//         )}
//         <div>
//           <h2 className="text-lg font-semibold text-white">{folder.title}</h2>
//           <p className="text-white/70 text-sm">
//             {NoteCount} {NoteCount === 1 ? "atom" : "atoms"}
//           </p>
//         </div>
//       </div>

//       {/* Drop indicator */}
//       {isOver && (
//         <div className="absolute inset-0 rounded-lg border-2 border-dashed border-white/50 bg-white/10 flex items-center justify-center">
//           <span className="text-white font-medium">Drop atom here</span>
//         </div>
//       )}

//       {/* Atom count badge */}
//       {NoteCount > 0 && (
//         <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
//           <span className="text-white font-medium text-sm">{NoteCount}</span>
//         </div>
//       )}
//     </div>
//   );
// }

// export default FolderComponent;
