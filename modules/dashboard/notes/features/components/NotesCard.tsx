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
import Link from "next/link";
import { useState } from "react";
import { useMediaQuery } from "react-responsive";
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
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDragMode, setIsDragMode] = useState(false);
  const isTablet = useMediaQuery({ query: "(max-width: 768px)" });
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
  const style = {
    transform: CSS.Translate.toString(transform),
    zIndex: isDragging ? 1000 : undefined,
    backgroundColor: "var(--color-secondary)",
    color: "var(--color-secondary-foreground)",
    WebkitUserSelect: isDragging ? "none" : "auto",
    userSelect: isDragging ? "none" : "auto",
    touchAction: "none",
  };

  // Handle long press for drag mode on mobile
  const handleTouchStart = () => {
    const timer = setTimeout(() => {
      setIsDragMode(true);
      // Add haptic feedback if supported
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
    }, 500);

    const cleanup = () => {
      clearTimeout(timer);
      document.removeEventListener("touchend", cleanup);
      document.removeEventListener("touchmove", cleanup);
    };

    document.addEventListener("touchend", cleanup);
    document.addEventListener("touchmove", cleanup);
  };
  return (
    <>
      <div
        ref={setNodeRef}
        style={style2}
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
        onTouchStart={handleTouchStart}
      >
        {/* Drag handle */}
        <div
          {...attributes}
          {...listeners}
          className={`absolute top-2 left-2 opacity-0 group-hover:opacity-100 sm:group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing ${
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
            {note.pinned && (
              <Pin className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0 mt-0.5" />
            )}
            {note.favorite && (
              <Heart className="h-3 w-3 sm:h-4 sm:w-4 text-red-500 fill-current flex-shrink-0 mt-0.5" />
            )}
          </div>
          <Link
            className="hover:underline text-foreground hover:text-primary block"
            href={`/dashboard/notes/${note.id}`}
          >
            <p className="text-sm sm:text-base leading-relaxed break-words hyphens-auto">
              {note.title}
            </p>
          </Link>
        </div>

        {/* Action menu - always visible on mobile, hover on desktop */}
        <div
          className={`absolute top-2 right-2 sm:top-3 sm:right-3 transition-opacity duration-200 opacity-100 sm:opacity-0 sm:group-hover:opacity-100`}
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
              <DropdownMenuItem>
                <Link
                  className="flex items-center w-full"
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
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Delete Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <Dialog.Content className="sm:max-w-[425px] mx-2 sm:mx-0">
          <Dialog.Header>
            <Dialog.Title>Delete Note</Dialog.Title>
            <Dialog.Description>
              Are you sure you want to delete this note? This action cannot be
              undone.
            </Dialog.Description>
          </Dialog.Header>
          <div className="py-4">
            <div className="bg-destructive/20 border border-destructive/50 p-3 rounded-md">
              <p className="text-sm break-words hyphens-auto">{note.title}</p>
            </div>
          </div>
          <Dialog.Footer className="flex flex-col sm:flex-row gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
              disabled={isLoading}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleDelete}
              disabled={isLoading}
              className="w-full sm:w-auto"
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
