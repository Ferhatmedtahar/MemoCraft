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
import { Input } from "@/components/ui/input";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
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
import { useMediaQuery } from "react-responsive";
interface AtomCardProps {
  atom: {
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

function AtomCard({
  atom,
  onDelete,
  onUpdate,
  onPin,
  onFavorite,
}: AtomCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [updateTitle, setUpdateTitle] = useState(atom.title);
  const [isLoading, setIsLoading] = useState(false);
  const isTablet = useMediaQuery({ query: "(max-width: 768px)" });
  const [isDragMode, setIsDragMode] = useState(false);
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: atom.id,
    });

  // Better transform handling
  const style = {
    transform: CSS.Translate.toString(transform),
    zIndex: isDragging ? 1000 : undefined,
    backgroundColor: "var(--color-secondary)",
    color: "var(--color-secondary-foreground)",
    // Prevent text selection during drag
    WebkitUserSelect: isDragging ? "none" : "auto",
    userSelect: isDragging ? "none" : "auto",
    // Improve touch handling
    touchAction: "none",
  };

  // Handle long press for drag mode on mobile
  const handleTouchStart = () => {
    const timer = setTimeout(() => {
      setIsDragMode(true);
    }, 500); // 500ms long press

    const cleanup = () => {
      clearTimeout(timer);
      document.removeEventListener("touchend", cleanup);
      document.removeEventListener("touchmove", cleanup);
    };

    document.addEventListener("touchend", cleanup);
    document.addEventListener("touchmove", cleanup);
  };

  const handleDelete = async () => {
    if (!onDelete) return;
    setIsLoading(true);
    try {
      await onDelete(atom.id);
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
      await onUpdate(atom.id, updateTitle.trim());
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
      await onPin(atom.id);
    } catch (error) {
      console.error("Failed to pin/unpin atom:", error);
    }
  };

  const handleFavorite = async () => {
    if (!onFavorite) return;
    try {
      await onFavorite(atom.id);
    } catch (error) {
      console.error("Failed to favorite/unfavorite atom:", error);
    }
  };

  const style2 = transform
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
        style={style2}
        onTouchStart={handleTouchStart}
        className={`
          relative p-3 sm:p-4 transition-all duration-300 cursor-pointer
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
          className={`absolute top-2 left-2 opacity-100 lg:opacity-0 group-hover:opacity-100 sm:group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing ${
            isTablet ? "opacity-100" : isDragging ? "opacity-100" : ""
          } sm:block touch-manipulation`}
          style={{
            touchAction: "none",
            WebkitTouchCallout: "none",
            WebkitUserSelect: "none",
          }}
        >
          <GripVertical className="h-3 w-3 sm:h-4 sm:w-4" />
        </div>

        {/* Main content */}
        <div className="pl-2 sm:pl-6 pr-8 sm:pr-10">
          <div className="flex items-start gap-1 sm:gap-2 mb-1 sm:mb-2 min-h-[20px]">
            {atom.pinned && (
              <Pin className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0 mt-0.5" />
            )}
            {atom.favorite && (
              <Heart className="h-3 w-3 sm:h-4 sm:w-4 text-red-500 fill-current flex-shrink-0 mt-0.5" />
            )}
          </div>
          <p className="text-sm sm:text-base leading-relaxed break-words hyphens-auto">
            {atom.title}
          </p>
        </div>

        {/* Action menu - always visible on mobile, hover on desktop */}
        <div
          className={`absolute top-2 right-2 sm:top-3 sm:right-3 transition-opacity duration-200 opacity-100 lg:opacity-0 sm:group-hover:opacity-100`}
        >
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={(e) => e.stopPropagation()}
                className="h-7 w-7 sm:h-8 sm:w-8"
              >
                <MoreVertical className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => setIsUpdateModalOpen(true)}>
                <Edit3 className="h-4 w-4 mr-2 text-primary/90" />
                Update
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handlePin}>
                {atom.pinned ? (
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
                {atom.favorite ? (
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
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      {/* Update Modal */}
      <Dialog open={isUpdateModalOpen} onOpenChange={setIsUpdateModalOpen}>
        <Dialog.Content className="sm:max-w-[425px]">
          <form onSubmit={handleUpdate}>
            <Dialog.Header>
              {/* <Dialog.Title className="text-white"> */}
              Update Atom
              {/* </Dialog.Title> */}
              <Dialog.Description className="text-white">
                Modify your atom content
              </Dialog.Description>
            </Dialog.Header>
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
            <Dialog.Footer>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsUpdateModalOpen(false);
                  setUpdateTitle(atom.title);
                }}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Updating..." : "Update"}
              </Button>
            </Dialog.Footer>
          </form>
        </Dialog.Content>
      </Dialog>

      {/* Delete Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <Dialog.Content className="sm:max-w-[425px]">
          <Dialog.Header>
            {/* <DialogTitle className="text-white"> */}
            Delete Atom
            {/* </DialogTitle> */}
            <Dialog.Description className="text-white">
              Are you sure you want to delete this atom? This action cannot be
              undone.
            </Dialog.Description>
          </Dialog.Header>
          <div className="py-4">
            <div className="bg-red-800 p-3 ">
              <p className="text-gray-300 text-sm">{atom.title}</p>
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

export default AtomCard;
