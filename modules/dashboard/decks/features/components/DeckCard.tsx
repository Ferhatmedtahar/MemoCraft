"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowUpRight, Edit3, MoreVertical, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useMediaQuery } from "react-responsive";
import { DeckType } from "../types/deck.type";
import DeleteDeckDialog from "./DeleteDeckDialog";
import EditDeckDialog from "./EditDeckDialog";

interface DeckCardProps {
  deck: DeckType;
}

function DeckCard({ deck }: DeckCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const isTablet = useMediaQuery({ query: "(max-width: 768px)" });
  const router = useRouter();

  const handleDeckUpdated = () => {
    router.refresh();
  };

  const handleDeckDeleted = () => {
    router.refresh();
  };

  const handleCardClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest(".dropdown-trigger")) {
      e.preventDefault();
      return;
    }
  };

  // Truncate description if it's too long
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + "...";
  };

  return (
    <>
      <div
        className="relative group w-full cursor-pointer h-full group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Link
          href={`/dashboard/decks/${deck.id}`}
          onClick={handleCardClick}
          className="block h-full"
        >
          <Card
            style={{ backgroundColor: `${deck.color}70` }}
            className="w-full h-full transition-all duration-200 hover:shadow-lg cursor-pointer flex flex-col"
          >
            <Card.Header className="relative flex-1 min-h-[120px] flex flex-col">
              <Card.Title className="capitalize text-lg font-semibold   line-clamp-2 group-hover:underline">
                <div className="flex items-center gap-2">
                  <span>{deck.deck_name}</span>
                  <ArrowUpRight className="w-4 h-4 " />
                </div>
              </Card.Title>
              <Card.Description className="flex-1 line-clamp-3 mt-2">
                {deck.description
                  ? truncateText(deck.description, 100)
                  : "No description"}
              </Card.Description>

              {/* Three dots menu */}
              <div
                className={`dropdown-trigger absolute top-4 right-4 transition-opacity duration-200 ${
                  isTablet
                    ? "opacity-100"
                    : isHovered
                    ? "opacity-100"
                    : "opacity-0"
                }`}
              >
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setEditDialogOpen(true);
                      }}
                      className="cursor-pointer"
                    >
                      <Edit3 className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setDeleteDialogOpen(true);
                      }}
                      className="cursor-pointer text-red-600 hover:text-red-700 focus:text-red-600"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </Card.Header>
          </Card>
        </Link>
      </div>

      <EditDeckDialog
        deck={deck}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onDeckUpdated={handleDeckUpdated}
      />

      <DeleteDeckDialog
        deck={deck}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onDeckDeleted={handleDeckDeleted}
      />
    </>
  );
}

export default DeckCard;
