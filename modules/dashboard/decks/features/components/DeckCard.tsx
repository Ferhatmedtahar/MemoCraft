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
import { Edit3, MoreVertical, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { DeckType } from "../types/deck.type";
import EditDeckDialog from "./EditDeckDialog";
import DeleteDeckDialog from "./DeleteDeckDialog";

interface DeckCardProps {
  deck: DeckType;
}

function DeckCard({ deck }: DeckCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const router = useRouter();

  const handleDeckUpdated = () => {
    // Refresh the page to get updated data
    router.refresh();
  };

  const handleDeckDeleted = () => {
    // Refresh the page to get updated data
    router.refresh();
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent navigation if clicking on the dropdown menu
    if ((e.target as HTMLElement).closest(".dropdown-trigger")) {
      e.preventDefault();
      return;
    }
  };

  return (
    <>
      <div
        className="relative group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Link
          href={`/dashboard/decks/${deck.id}`}
          onClick={handleCardClick}
          className="block"
        >
          <Card
            style={{ backgroundColor: `${deck.color}70` }}
            className="transition-all duration-200 hover:shadow-lg cursor-pointer"
          >
            <Card.Header className="relative">
              <Card.Title className="pr-8">{deck.deck_name}</Card.Title>
              {deck.description ? (
                <Card.Description>{deck.description}</Card.Description>
              ) : (
                <Card.Description>No description</Card.Description>
              )}

              {/* Three dots menu */}
              <div
                className={`dropdown-trigger absolute top-4 right-4 transition-opacity duration-200 ${
                  isHovered ? "opacity-100" : "opacity-0"
                }`}
              >
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
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
// import { Card } from "@/components/ui/card";
// import Link from "next/link";
// import { DeckType } from "../types/deck.type";
// function DeckCard({ deck }: { deck: DeckType }) {
//   return (
//     <Link href={`/dashboard/decks/${deck.id}`} key={deck.id}>
//       <Card style={{ backgroundColor: `${deck.color}70` }} key={deck.id}>
//         <Card.Header>
//           <Card.Title>{deck.deck_name}</Card.Title>
//           {deck.description ? (
//             <Card.Description>{deck.description}</Card.Description>
//           ) : (
//             <Card.Description>No description</Card.Description>
//           )}
//         </Card.Header>
//       </Card>
//     </Link>
//   );
// }

// export default DeckCard;
