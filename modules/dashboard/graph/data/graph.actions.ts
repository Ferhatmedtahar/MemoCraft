"use server";

import { createClientForServer } from "@/utils/supabase/server";

// Types for your data
export interface KnowledgeNode {
  id: string;
  name: string;
  type: "note" | "atom" | "flashcard" | "folder";
  category: string;
  content?: string;
  folder_id?: string | null;
  created_at: string;
  is_favorite?: boolean;
  is_pinned?: boolean;
}

export interface KnowledgeLink {
  source: string;
  target: string;
  relationship: "contains" | "related" | "tagged";
}

export interface KnowledgeGraphData {
  nodes: KnowledgeNode[];
  links: KnowledgeLink[];
  categories: string[];
  stats: {
    totalNotes: number;
    totalAtoms: number;
    totalFlashcards: number;
    totalFolders: number;
  };
}

// Fetch all folders for both notes and atoms
export async function fetchAllFolders() {
  const supabase = await createClientForServer();
  const user = await supabase.auth.getUser();
  if (!user.data.user) return [];

  const { data: noteFolders } = await supabase
    .from("folders")
    .select("*")
    .eq("folder_type", "notes")
    .eq("user_id", user.data.user.id);

  const { data: atomFolders } = await supabase
    .from("folders")
    .select("*")
    .eq("folder_type", "atoms")
    .eq("user_id", user.data.user.id);

  return [
    ...(noteFolders || []).map((folder) => ({
      ...folder,
      content_type: "notes",
    })),
    ...(atomFolders || []).map((folder) => ({
      ...folder,
      content_type: "atoms",
    })),
  ];
}

// Fetch all notes
export async function fetchAllNotes() {
  const supabase = await createClientForServer();
  const user = await supabase.auth.getUser();
  if (!user.data.user) return [];

  const { data } = await supabase
    .from("notes")
    .select("*")
    .eq("user_id", user.data.user.id);

  return data || [];
}

// Fetch all atoms
export async function fetchAllAtoms() {
  const supabase = await createClientForServer();
  const user = await supabase.auth.getUser();
  if (!user.data.user) return [];

  const { data } = await supabase
    .from("atoms")
    .select("*")
    .eq("user_id", user.data.user.id);

  return data || [];
}

// Fetch all flashcard decks
export async function fetchAllFlashcards() {
  const supabase = await createClientForServer();
  const user = await supabase.auth.getUser();
  if (!user.data.user) return [];

  const { data } = await supabase
    .from("flashcards")
    .select("*")
    .eq("user_id", user.data.user.id);

  return data || [];
}

// Main function to fetch and process all knowledge graph data
export async function fetchKnowledgeGraphData(): Promise<KnowledgeGraphData> {
  try {
    const [folders, notes, atoms, flashcards] = await Promise.all([
      fetchAllFolders(),
      fetchAllNotes(),
      fetchAllAtoms(),
      fetchAllFlashcards(),
    ]);

    const nodes: KnowledgeNode[] = [];
    const links: KnowledgeLink[] = [];
    const categorySet = new Set<string>();

    // Process folders
    folders.forEach((folder) => {
      const folderType = folder.content_type || folder.folder_type;
      nodes.push({
        id: folder.id,
        name: folder.name || `${folderType} Folder`,
        type: "folder",
        category: folderType === "notes" ? "Notes" : "Atoms",
        created_at: folder.created_at,
        folder_id: null,
      });
      categorySet.add(folderType === "notes" ? "Notes" : "Atoms");
    });

    // Process notes
    notes.forEach((note) => {
      const category = note.folder_id ? "Notes" : "Uncategorized Notes";
      nodes.push({
        id: note.id,
        name: note.title,
        type: "note",
        category,
        content: note.content,
        folder_id: note.folder_id,
        created_at: note.created_at,
        is_favorite: note.is_favorite,
        is_pinned: note.is_pinned,
      });
      categorySet.add(category);

      // Create link to folder if it exists
      if (note.folder_id) {
        links.push({
          source: note.folder_id,
          target: note.id,
          relationship: "contains",
        });
      }
    });

    // Process atoms
    atoms.forEach((atom) => {
      const category = atom.folder_id ? "Atoms" : "Uncategorized Atoms";
      nodes.push({
        id: atom.id,
        name: atom.title,
        type: "atom",
        category,
        content: atom.content,
        folder_id: atom.folder_id,
        created_at: atom.created_at,
        is_favorite: atom.favorite,
        is_pinned: atom.pinned,
      });
      categorySet.add(category);

      // Create link to folder if it exists
      if (atom.folder_id) {
        links.push({
          source: atom.folder_id,
          target: atom.id,
          relationship: "contains",
        });
      }
    });

    // Process flashcards
    flashcards.forEach((deck) => {
      const flashcardCount = Array.isArray(deck.content)
        ? deck.content.length
        : 0;
      const deckName = `${deck.deck_name} (${flashcardCount} cards)`;

      nodes.push({
        id: deck.id,
        name: deckName,
        type: "flashcard",
        category: "Flashcards",
        content: JSON.stringify(deck.content),
        created_at: deck.created_at,
        folder_id: null,
      });
      categorySet.add("Flashcards");
    });

    // Create connections based on content similarity or keywords
    // This is a basic implementation - you can enhance this based on your needs
    const createContentConnections = () => {
      const contentNodes = nodes.filter(
        (n) => n.content && n.type !== "folder"
      );

      contentNodes.forEach((nodeA, i) => {
        contentNodes.slice(i + 1).forEach((nodeB) => {
          if (nodeA.id !== nodeB.id) {
            // Simple keyword matching - you can make this more sophisticated
            const contentA = nodeA.content?.toLowerCase() || "";
            const contentB = nodeB.content?.toLowerCase() || "";
            const titleA = nodeA.name.toLowerCase();
            const titleB = nodeB.name.toLowerCase();

            // Check if titles share words (excluding common words)
            const commonWords = [
              "the",
              "and",
              "or",
              "but",
              "in",
              "on",
              "at",
              "to",
              "for",
              "of",
              "with",
              "by",
              "a",
              "an",
            ];
            const wordsA = titleA
              .split(" ")
              .filter((word) => word.length > 2 && !commonWords.includes(word));
            const wordsB = titleB
              .split(" ")
              .filter((word) => word.length > 2 && !commonWords.includes(word));

            const hasCommonWords = wordsA.some((word) => wordsB.includes(word));
            const hasContentOverlap =
              contentA.length > 10 &&
              contentB.length > 10 &&
              (contentA.includes(titleB.slice(0, 5)) ||
                contentB.includes(titleA.slice(0, 5)));

            if (hasCommonWords || hasContentOverlap) {
              links.push({
                source: nodeA.id,
                target: nodeB.id,
                relationship: "related",
              });
            }
          }
        });
      });
    };

    createContentConnections();

    return {
      nodes,
      links,
      categories: ["All", ...Array.from(categorySet)],
      stats: {
        totalNotes: notes.length,
        totalAtoms: atoms.length,
        totalFlashcards: flashcards.length,
        totalFolders: folders.length,
      },
    };
  } catch (error) {
    console.error("Error fetching knowledge graph data:", error);
    return {
      nodes: [],
      links: [],
      categories: ["All"],
      stats: {
        totalNotes: 0,
        totalAtoms: 0,
        totalFlashcards: 0,
        totalFolders: 0,
      },
    };
  }
}
