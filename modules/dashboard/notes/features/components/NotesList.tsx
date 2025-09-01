"use client";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
} from "@dnd-kit/core";
import { NotebookPen } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  deleteNote,
  toggleFavoriteNote,
  togglePinNote,
  updateNote,
  updateNoteFolder,
} from "../../data/notesActions";
import { Folder } from "../../types/folder.type";
import FolderComponent from "../components/FolderComponents";
import NoteCard from "../components/NotesCard";

interface Note {
  id: string;
  title: string;
  content?: string;
  is_pinned?: boolean;
  is_favorite?: boolean;
  pinned?: boolean; // for backward compatibility
  favorite?: boolean; // for backward compatibility
  folder_id?: string | null;
  created_at?: string;
  updated_at?: string;
}

interface NotesListClientProps {
  initialNotes: Note[];
  initialFolders: Folder[];
}

function NotesListClient({
  initialNotes,
  initialFolders,
}: NotesListClientProps) {
  const router = useRouter();
  const [activeNote, setActiveNote] = useState<Note | null>(null);

  // Handle drag start
  function handleDragStart(event: DragStartEvent) {
    const note = initialNotes.find((note) => note.id === event.active.id);
    setActiveNote(note || null);
  }

  // Handle drag end
  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveNote(null);

    if (!over) return;

    const noteId = active.id as string;
    const targetId = over.id as string;

    // Check if dropping on a folder
    const isFolder = initialFolders.some((folder) => folder.id === targetId);

    if (isFolder) {
      try {
        await updateNoteFolder(noteId, targetId);
        router.refresh(); // Refresh to show updated data
      } catch (error) {
        console.error("Failed to update note folder:", error);
      }
    }
  }

  if (!initialNotes || initialNotes.length === 0) {
    return (
      <div className="text-foreground flex items-center justify-center h-full px-4">
        <div className="flex flex-col justify-center items-center gap-4 bg-secondary/70 border-2 sm:border-4 border-secondary rounded-lg p-6 sm:p-8 text-center max-w-md">
          <NotebookPen className="w-10 h-10 sm:w-12 sm:h-12" />
          <div>
            <p className="text-lg sm:text-xl font-semibold mb-2 break-words">
              No Notes found
            </p>
            <p className="text-foreground/80 text-sm break-words">
              Create your first Note to get started
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Separate notes by folder
  const notesByFolder = initialNotes.reduce((acc, note) => {
    const folderId = note.folder_id || "unassigned";
    if (!acc[folderId]) {
      acc[folderId] = [];
    }
    acc[folderId].push(note);
    return acc;
  }, {} as Record<string, Note[]>);

  // Sort notes within each folder: pinned first, then favorites, then the rest
  Object.keys(notesByFolder).forEach((folderId) => {
    notesByFolder[folderId].sort((a, b) => {
      // Use is_pinned if available, fallback to pinned for backward compatibility
      const aPinned = a.is_pinned ?? a.pinned ?? false;
      const bPinned = b.is_pinned ?? b.pinned ?? false;
      const aFavorite = a.is_favorite ?? a.favorite ?? false;
      const bFavorite = b.is_favorite ?? b.favorite ?? false;

      if (aPinned && !bPinned) return -1;
      if (!aPinned && bPinned) return 1;
      if (!aPinned && !bPinned) {
        if (aFavorite && !bFavorite) return -1;
        if (!aFavorite && bFavorite) return 1;
      }
      return 0;
    });
  });

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="px-2 sm:px-4 space-y-4 sm:space-y-6">
        {/* Folders with their notes */}
        {initialFolders.map((folder) => (
          <div key={folder.id} className="space-y-3 sm:space-y-4">
            <FolderComponent
              folder={folder}
              NoteCount={notesByFolder[folder.id]?.length || 0}
            />

            {/* Notes in this folder */}
            {notesByFolder[folder.id] &&
              notesByFolder[folder.id].length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 ml-2 sm:ml-6 lg:ml-8">
                  {notesByFolder[folder.id].map((note) => (
                    <NoteCard
                      key={note.id}
                      note={note}
                      onDelete={async (id: string) => {
                        await deleteNote(id);
                        router.refresh();
                      }}
                      onUpdate={async (
                        id: string,
                        title: string,
                        content?: string
                      ) => {
                        await updateNote(id, title, content);
                        router.refresh();
                      }}
                      onPin={async (id: string) => {
                        await togglePinNote(id);
                        router.refresh();
                      }}
                      onFavorite={async (id: string) => {
                        await toggleFavoriteNote(id);
                        router.refresh();
                      }}
                    />
                  ))}
                </div>
              )}
          </div>
        ))}

        {/* Unassigned notes */}
        {notesByFolder["unassigned"] &&
          notesByFolder["unassigned"].length > 0 && (
            <div className="space-y-3 sm:space-y-4">
              <FolderComponent
                folder={{
                  id: "unassigned",
                  name: "unassigned",
                  color: "#6b7280",
                }}
                NoteCount={notesByFolder["unassigned"].length}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 ml-2 sm:ml-6 lg:ml-8">
                {notesByFolder["unassigned"].map((note) => (
                  <NoteCard
                    key={note.id}
                    note={note}
                    onDelete={async (id: string) => {
                      await deleteNote(id);
                      router.refresh();
                    }}
                    onUpdate={async (
                      id: string,
                      title: string,
                      content?: string
                    ) => {
                      await updateNote(id, title, content);
                      router.refresh();
                    }}
                    onPin={async (id: string) => {
                      await togglePinNote(id);
                      router.refresh();
                    }}
                    onFavorite={async (id: string) => {
                      await toggleFavoriteNote(id);
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
        {activeNote ? (
          <div className="bg-primary/80 border-2 border-card-foreground p-3 sm:p-4 shadow-lg opacity-90  max-w-xs">
            <p className="text-foreground text-xs sm:text-sm truncate">
              {activeNote.title}
            </p>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

export default NotesListClient;
