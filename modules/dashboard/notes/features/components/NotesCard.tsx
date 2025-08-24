"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
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
      console.error("Failed to delete atom:", error);
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
      console.error("Failed to update atom:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePin = async () => {
    if (!onPin) return;
    try {
      await onPin(note.id);
    } catch (error) {
      console.error("Failed to pin/unpin atom:", error);
    }
  };

  const handleFavorite = async () => {
    if (!onFavorite) return;
    try {
      await onFavorite(note.id);
    } catch (error) {
      console.error("Failed to favorite/unfavorite atom:", error);
    }
  };

  const style = transform
    ? {
        transform: `translate(${transform.x}px, ${transform.y}px)`,
        zIndex: isDragging ? 1000 : undefined,
      }
    : undefined;

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className={`relative bg-gray-800 hover:bg-gray-750 border border-gray-700 rounded-lg p-4 transition-all duration-200 group ${
          isDragging ? "opacity-50 shadow-lg" : "cursor-pointer"
        }`}
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
          <GripVertical className="h-4 w-4 text-gray-500" />
        </div>

        {/* Main content */}
        <div className="pl-6 pr-8">
          <div className="flex items-start gap-2 mb-2">
            {note.pinned && (
              <Pin className="h-4 w-4 text-blue-400 flex-shrink-0 mt-0.5" />
            )}
            {note.favorite && (
              <Heart className="h-4 w-4 text-red-400 fill-current flex-shrink-0 mt-0.5" />
            )}
          </div>
          <p className="text-white text-sm leading-relaxed break-words">
            {note.title}
          </p>
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
                size="sm"
                className="h-8 w-8 p-0 hover:bg-gray-600"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreVertical className="h-4 w-4 text-gray-400" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => setIsUpdateModalOpen(true)}>
                <Edit3 className="h-4 w-4 mr-2" />
                Update
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handlePin}>
                {note.pinned ? (
                  <>
                    <PinOff className="h-4 w-4 mr-2" />
                    Unpin
                  </>
                ) : (
                  <>
                    <Pin className="h-4 w-4 mr-2" />
                    Pin
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleFavorite}>
                {note.favorite ? (
                  <>
                    <HeartOff className="h-4 w-4 mr-2" />
                    Remove from favorites
                  </>
                ) : (
                  <>
                    <Heart className="h-4 w-4 mr-2" />
                    Add to favorites
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setIsDeleteModalOpen(true)}
                className="text-red-400 focus:text-red-400"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Update Modal */}
      <Dialog open={isUpdateModalOpen} onOpenChange={setIsUpdateModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleUpdate}>
            <DialogHeader>
              <DialogTitle className="text-white">Update Atom</DialogTitle>
              <DialogDescription className="text-white">
                Modify your atom content
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-3">
                <label htmlFor="update-title" className="text-white text-sm">
                  Atom Content
                </label>
                <Input
                  id="update-title"
                  value={updateTitle}
                  onChange={(e) => setUpdateTitle(e.target.value)}
                  placeholder="Enter atom content..."
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsUpdateModalOpen(false);
                  setUpdateTitle(note.title);
                }}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Updating..." : "Update"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-white">Delete Atom</DialogTitle>
            <DialogDescription className="text-white">
              Are you sure you want to delete this atom? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="bg-gray-800 p-3 rounded-md">
              <p className="text-gray-300 text-sm">{note.title}</p>
            </div>
          </div>
          <DialogFooter>
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
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default NoteCard;
