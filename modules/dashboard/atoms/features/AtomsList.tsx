"use client";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
} from "@dnd-kit/core";
import { Atom } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  deleteAtom,
  toggleFavorite,
  togglePin,
  updateAtom,
  updateAtomFolder,
} from "../data/AtomActions";
import { Folder } from "../types/folder.type";
import AtomCard from "./components/AtomCard";
import FolderComponent from "./components/FolderComponent";

interface Atom {
  id: string;
  title: string;
  pinned?: boolean;
  favorite?: boolean;
  folder_id?: string | null;
}

interface AtomsListClientProps {
  initialAtoms: Atom[];
  initialFolders: Folder[];
}

function AtomsListClient({
  initialAtoms,
  initialFolders,
}: AtomsListClientProps) {
  const router = useRouter();
  const [activeAtom, setActiveAtom] = useState<Atom | null>(null);

  // Handle drag start
  function handleDragStart(event: DragStartEvent) {
    const atom = initialAtoms.find((atom) => atom.id === event.active.id);
    setActiveAtom(atom || null);
  }

  // Handle drag end
  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveAtom(null);

    if (!over) return;

    const atomId = active.id as string;
    const targetId = over.id as string;

    // Check if dropping on a folder
    const isFolder = initialFolders.some((folder) => folder.id === targetId);

    if (isFolder) {
      try {
        await updateAtomFolder(atomId, targetId);
        router.refresh(); // Refresh to show updated data
      } catch (error) {
        console.error("Failed to update atom folder:", error);
      }
    }
  }

  if (!initialAtoms || initialAtoms.length === 0) {
    return (
      <div className="h-[75%] flex items-center justify-center text-muted-foreground px-4">
        <div className="flex flex-col justify-center items-center gap-4 bg-secondary/70 border-2 sm:border-4 border-secondary rounded-lg p-6 sm:p-8 text-center max-w-md">
          <Atom className="w-10 h-10 sm:w-12 sm:h-12" />
          <span className="text-lg sm:text-xl font-semibold break-words">
            Start by creating your first atom!
          </span>
        </div>
      </div>
    );
  }

  // Separate atoms by folder
  const atomsByFolder = initialAtoms.reduce((acc, atom) => {
    const folderId = atom.folder_id || "unassigned";
    if (!acc[folderId]) {
      acc[folderId] = [];
    }
    acc[folderId].push(atom);
    return acc;
  }, {} as Record<string, Atom[]>);

  // Sort atoms within each folder: pinned first, then favorites, then the rest
  Object.keys(atomsByFolder).forEach((folderId) => {
    atomsByFolder[folderId].sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      if (!a.pinned && !b.pinned) {
        if (a.favorite && !b.favorite) return -1;
        if (!a.favorite && b.favorite) return 1;
      }
      return 0;
    });
  });

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="px-2 sm:px-4 space-y-4 sm:space-y-6">
        {/* Folders with their atoms */}
        {initialFolders.map((folder) => (
          <div key={folder.id} className="space-y-3 sm:space-y-4">
            <FolderComponent
              folder={folder}
              atomCount={atomsByFolder[folder.id]?.length || 0}
            />

            {/* Atoms in this folder */}
            {atomsByFolder[folder.id] &&
              atomsByFolder[folder.id].length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 ml-2 sm:ml-6 lg:ml-8">
                  {atomsByFolder[folder.id].map((atom) => (
                    <AtomCard
                      key={atom.id}
                      atom={atom}
                      onDelete={async (id: string) => {
                        await deleteAtom(id);
                        router.refresh();
                      }}
                      onUpdate={async (id: string, title: string) => {
                        await updateAtom(id, title);
                        router.refresh();
                      }}
                      onPin={async (id: string) => {
                        await togglePin(id);
                        router.refresh();
                      }}
                      onFavorite={async (id: string) => {
                        await toggleFavorite(id);
                        router.refresh();
                      }}
                    />
                  ))}
                </div>
              )}
          </div>
        ))}

        {/* Unassigned atoms */}
        {atomsByFolder["unassigned"] &&
          atomsByFolder["unassigned"].length > 0 && (
            <div className="space-y-3 sm:space-y-4">
              <FolderComponent
                folder={{
                  id: "unassigned",
                  name: "unassigned",
                  color: "#6b7280",
                }}
                atomCount={atomsByFolder["unassigned"].length}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 ml-2 sm:ml-6 lg:ml-8">
                {atomsByFolder["unassigned"].map((atom) => (
                  <AtomCard
                    key={atom.id}
                    atom={atom}
                    onDelete={async (id: string) => {
                      await deleteAtom(id);
                      router.refresh();
                    }}
                    onUpdate={async (id: string, title: string) => {
                      await updateAtom(id, title);
                      router.refresh();
                    }}
                    onPin={async (id: string) => {
                      await togglePin(id);
                      router.refresh();
                    }}
                    onFavorite={async (id: string) => {
                      await toggleFavorite(id);
                      router.refresh();
                    }}
                  />
                ))}
              </div>
            </div>
          )}
      </div>

      {/* Drag overlay */}
      <DragOverlay>
        {activeAtom ? (
          <div className="bg-primary/80 border-2 border-card-foreground p-3 sm:p-4 shadow-lg opacity-90  max-w-xs">
            <p className="text-foreground text-xs sm:text-sm truncate">
              {activeAtom.title}
            </p>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

export default AtomsListClient;
