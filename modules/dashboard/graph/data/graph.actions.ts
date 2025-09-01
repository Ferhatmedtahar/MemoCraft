"use server";

import { createClientForServer } from "@/utils/supabase/server";

// Types for your data
export interface KnowledgeNode {
  id: string;
  name: string;
  type: "note" | "atom" | "flashcard" | "folder" | "flashcard_deck";
  category: string;
  content?: string;
  folder_id?: string | null;
  deck_id?: string | null; // For individual flashcards
  created_at: string;
  is_favorite?: boolean;
  is_pinned?: boolean;
  index?: number;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  fx?: number | null; // D3 drag properties
  fy?: number | null;
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
    let nodeIndex = 0;

    // Process folders first
    folders.forEach((folder) => {
      const folderType = folder.content_type || folder.folder_type;
      const category = folderType === "notes" ? "Notes" : "Atoms";

      nodes.push({
        id: folder.id,
        name: folder.name || `${folderType} Folder`,
        type: "folder",
        category,
        created_at: folder.created_at,
        folder_id: null,
        index: nodeIndex++,
        x: Math.random() * 1200,
        y: Math.random() * 800,
        vx: (Math.random() - 0.5) * 0.01,
        vy: (Math.random() - 0.5) * 0.01,
      });
      categorySet.add(category);
    });

    // Process notes
    notes.forEach((note) => {
      const category = note.folder_id ? "Notes" : "Uncategorized Notes";
      nodes.push({
        id: note.id,
        name: note.title || "Untitled Note",
        type: "note",
        category,
        content: note.content,
        folder_id: note.folder_id,
        created_at: note.created_at,
        is_favorite: note.is_favorite,
        is_pinned: note.is_pinned,
        index: nodeIndex++,
        x: Math.random() * 1200,
        y: Math.random() * 800,
        vx: (Math.random() - 0.5) * 0.01,
        vy: (Math.random() - 0.5) * 0.01,
      });
      categorySet.add(category);

      // Create link from folder to note
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
        name: atom.title || "Untitled Atom",
        type: "atom",
        category,
        content: atom.content,
        folder_id: atom.folder_id,
        created_at: atom.created_at,
        is_favorite: atom.favorite,
        is_pinned: atom.pinned,
        index: nodeIndex++,
        x: Math.random() * 1200,
        y: Math.random() * 800,
        vx: (Math.random() - 0.5) * 0.01,
        vy: (Math.random() - 0.5) * 0.01,
      });
      categorySet.add(category);

      // Create link from folder to atom
      if (atom.folder_id) {
        links.push({
          source: atom.folder_id,
          target: atom.id,
          relationship: "contains",
        });
      }
    });

    // Process flashcard decks and individual cards
    flashcards.forEach((deck) => {
      let flashcardContent = [];

      // Parse the content - it might be a string or already an array
      try {
        if (typeof deck.content === "string") {
          flashcardContent = JSON.parse(deck.content);
        } else if (Array.isArray(deck.content)) {
          flashcardContent = deck.content;
        }
      } catch (error) {
        console.error("Error parsing flashcard content:", error);
        flashcardContent = [];
      }

      const flashcardCount = flashcardContent.length;
      const deckName = `${deck.deck_name} (${flashcardCount} cards)`;

      // Create deck node
      const deckId = deck.id;
      nodes.push({
        id: deckId,
        name: deckName,
        type: "flashcard_deck",
        category: "Flashcards",
        content: `Flashcard deck with ${flashcardCount} cards`,
        created_at: deck.created_at,
        folder_id: null,
        index: nodeIndex++,
        x: Math.random() * 1200,
        y: Math.random() * 800,
        vx: (Math.random() - 0.5) * 0.01,
        vy: (Math.random() - 0.5) * 0.01,
      });
      categorySet.add("Flashcards");

      // Create individual flashcard nodes
      flashcardContent.forEach((card: any, cardIndex: number) => {
        const cardId = `${deckId}_card_${cardIndex}`;
        const cardName = card.question
          ? card.question.length > 30
            ? `${card.question.substring(0, 30)}...`
            : card.question
          : `Card ${cardIndex + 1}`;

        nodes.push({
          id: cardId,
          name: cardName,
          type: "flashcard",
          category: "Flashcards",
          content: `Question: ${card.question || "No question"}\nAnswer: ${
            card.answer || "No answer"
          }${card.hint ? `\nHint: ${card.hint}` : ""}`,
          deck_id: deckId,
          created_at: deck.created_at,
          folder_id: null,
          index: nodeIndex++,
          x: Math.random() * 1200,
          y: Math.random() * 800,
          vx: (Math.random() - 0.5) * 0.01,
          vy: (Math.random() - 0.5) * 0.01,
        });

        // Create link from deck to card
        links.push({
          source: deckId,
          target: cardId,
          relationship: "contains",
        });
      });
    });

    // Create connections based on content similarity or keywords
    const createContentConnections = () => {
      const contentNodes = nodes.filter(
        (n) => n.content && n.type !== "folder" && n.type !== "flashcard_deck"
      );

      contentNodes.forEach((nodeA, i) => {
        contentNodes.slice(i + 1).forEach((nodeB) => {
          if (nodeA.id !== nodeB.id && nodeA.deck_id !== nodeB.deck_id) {
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
              "is",
              "are",
              "was",
              "were",
              "be",
              "been",
              "have",
              "has",
              "had",
              "do",
              "does",
              "did",
              "will",
              "would",
              "should",
              "could",
              "can",
              "may",
              "might",
              "must",
              "shall",
              "this",
              "that",
              "these",
              "those",
              "i",
              "you",
              "he",
              "she",
              "it",
              "we",
              "they",
            ];

            const wordsA = titleA
              .split(/\s+/)
              .filter((word) => word.length > 2 && !commonWords.includes(word));
            const wordsB = titleB
              .split(/\s+/)
              .filter((word) => word.length > 2 && !commonWords.includes(word));

            const hasCommonWords = wordsA.some((word) => wordsB.includes(word));

            // More sophisticated content overlap detection
            const hasContentOverlap =
              contentA.length > 50 &&
              contentB.length > 50 &&
              (contentA.includes(
                titleB.slice(0, Math.min(10, titleB.length))
              ) ||
                contentB.includes(
                  titleA.slice(0, Math.min(10, titleA.length))
                ) ||
                // Check for shared significant words in content
                wordsA.some(
                  (word) => word.length > 4 && contentB.includes(word)
                ) ||
                wordsB.some(
                  (word) => word.length > 4 && contentA.includes(word)
                ));

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

    // Count individual flashcards for stats
    const totalIndividualFlashcards = flashcards.reduce((total, deck) => {
      try {
        let content = [];
        if (typeof deck.content === "string") {
          content = JSON.parse(deck.content);
        } else if (Array.isArray(deck.content)) {
          content = deck.content;
        }
        return total + content.length;
      } catch {
        return total;
      }
    }, 0);

    return {
      nodes,
      links,
      categories: ["All", ...Array.from(categorySet)],
      stats: {
        totalNotes: notes.length,
        totalAtoms: atoms.length,
        totalFlashcards: totalIndividualFlashcards, // Count individual cards, not decks
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
