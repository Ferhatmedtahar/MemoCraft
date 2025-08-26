"use client";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
} from "@dnd-kit/core";
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
      <div className="text-white flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-lg mb-2">No atoms found</p>
          <p className="text-gray-400 text-sm">
            Create your first atom to get started
          </p>
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
      <div className="p-4 space-y-6">
        {/* Folders with their atoms */}
        {initialFolders.map((folder) => (
          <div key={folder.id} className="space-y-4">
            <FolderComponent
              folder={folder}
              atomCount={atomsByFolder[folder.id]?.length || 0}
            />

            {/* Atoms in this folder */}
            {atomsByFolder[folder.id] &&
              atomsByFolder[folder.id].length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 ml-8">
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
            <div className="space-y-4">
              <div className="bg-gray-700 rounded-lg p-4">
                <h2 className="text-lg font-semibold text-white">
                  Unassigned Atoms ({atomsByFolder["unassigned"].length})
                </h2>
                <p className="text-gray-400 text-sm">
                  Drag these atoms to folders to organize them
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 ml-8">
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
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 shadow-lg opacity-90">
            <p className="text-white text-sm">{activeAtom.title}</p>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

export default AtomsListClient;
