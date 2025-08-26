"use client";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDraggable } from "@dnd-kit/core";
import {
  Edit3,
  GripVertical,
  Heart,
  HeartOff,
  MoreVertical,
  Pin,
  PinOff,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

interface NoteCardProps {
  note: {
    id: string;
    title: string;
    pinned?: boolean;
    favorite?: boolean;
    folder_id?: string | null;
  };
  onDelete?: (id: string) => void;
  onUpdate?: (id: string, title: string) => void;
  onPin?: (id: string) => void;
  onFavorite?: (id: string) => void;
}

function NoteCard({
  note,
  onDelete,
  onUpdate,
  onPin,
  onFavorite,
}: NoteCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [updateTitle, setUpdateTitle] = useState(note.title);
  const [isLoading, setIsLoading] = useState(false);

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: note.id,
    });

  const handleDelete = async () => {
    if (!onDelete) return;
    setIsLoading(true);
    try {
      await onDelete(note.id);
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("Failed to delete note:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onUpdate || !updateTitle.trim()) return;

    setIsLoading(true);
    try {
      await onUpdate(note.id, updateTitle.trim());
      setIsUpdateModalOpen(false);
    } catch (error) {
      console.error("Failed to update note:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePin = async () => {
    if (!onPin) return;
    try {
      await onPin(note.id);
    } catch (error) {
      console.error("Failed to pin/unpin note:", error);
    }
  };

  const handleFavorite = async () => {
    if (!onFavorite) return;
    try {
      await onFavorite(note.id);
    } catch (error) {
      console.error("Failed to favorite/unfavorite note:", error);
    }
  };

  const style = transform
    ? {
        transform: `translate(${transform.x}px, ${transform.y}px)`,
        zIndex: isDragging ? 1000 : undefined,
        backgroundColor: "var(--color-secondary)",
      }
    : {
        backgroundColor: "var(--color-secondary)",
        color: "var(--color-secondary-foreground)",
      };

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className={`
          relative p-2 py-3 transition-all duration-300 cursor-pointer
          border-2 border-foreground group
          ${
            isDragging
              ? "opacity-50 shadow-lg"
              : "shadow-[var(--theme-shadow)] hover:shadow-none hover:translate-y-1"
          }
        `}
        draggable={true}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Drag handle */}
        <div
          {...attributes}
          {...listeners}
          className={`absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing ${
            isDragging ? "opacity-100" : ""
          }`}
        >
          <GripVertical className="h-4 w-4" />
        </div>

        {/* Main content */}

        <div className="pl-6 pr-8">
          <div className="flex items-start gap-2 mb-2  ">
            {note.pinned && <Pin className="h-4 w-4 flex-shrink-0 mt-0.5" />}
            {note.favorite && (
              <Heart className="h-4 w-4 text-red-500 fill-current flex-shrink-0 mt-0.5" />
            )}
          </div>
          <Link
            className=" hover:underline text-foreground hover:text-primary"
            href={`/dashboard/notes/${note.id}`}
          >
            <p className="text-base leading-relaxed break-words">
              {note.title}
            </p>
          </Link>
        </div>
        {/* Action menu */}
        <div
          className={`absolute top-3 right-3 transition-opacity duration-200 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        >
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem>
                <Link
                  className="flex items-center"
                  href={`/dashboard/notes/update/${note.id}`}
                >
                  <Edit3 className="h-4 w-4 mr-2 text-primary/90" />
                  Update
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handlePin}>
                {note.pinned ? (
                  <>
                    <PinOff className="h-4 w-4 mr-2 text-primary/90" />
                    Unpin
                  </>
                ) : (
                  <>
                    <Pin className="h-4 w-4 mr-2 text-primary/90" />
                    Pin
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleFavorite}>
                {note.favorite ? (
                  <>
                    <HeartOff className="h-4 w-4 mr-2 text-primary/90" />
                    Remove from favorites
                  </>
                ) : (
                  <>
                    <Heart className="h-4 w-4 mr-2 text-primary/90" />
                    Add to favorites
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setIsDeleteModalOpen(true)}
                className="focus:bg-red-800 text-red-400 hover:text-red-100 focus:text-red-400"
              >
                <Trash2 className="h-4 w-4 mr-2 text-primary/90" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Delete Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <Dialog.Content className="sm:max-w-[425px]">
          <Dialog.Header>
            Delete Note
            <Dialog.Description className="text-white">
              Are you sure you want to delete this note? This action cannot be
              undone.
            </Dialog.Description>
          </Dialog.Header>
          <div className="py-4">
            <div className="bg-red-800 p-3 rounded-md">
              <p className="text-gray-300 text-sm">{note.title}</p>
            </div>
          </div>
          <Dialog.Footer>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={handleDelete}
              disabled={isLoading}
            >
              {isLoading ? "Deleting..." : "Delete"}
            </Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog>
    </>
  );
}

export default NoteCard;
