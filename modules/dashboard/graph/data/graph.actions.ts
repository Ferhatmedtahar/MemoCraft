"use server";

import { createClientForServer } from "@/utils/supabase/server";

export interface KnowledgeNode {
  id: string;
  name: string;
  type: "note" | "atom" | "flashcard" | "folder" | "flashcard_deck";
  category: string;
  content?: string;
  folder_id?: string | null;
  deck_id?: string | null;
  created_at: string;
  is_favorite?: boolean;
  is_pinned?: boolean;
  index?: number;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  fx?: number | null;
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

const STOPS = [
  "the","and","or","but","in","on","at","to","for","of","with","by",
  "a","an","is","are","was","were","be","been","have","has","had",
  "do","does","did","will","would","should","could","can","may","might",
  "must","shall","this","that","these","those","i","you","he","she",
  "it","we","they",
];

function randomPosition() {
  return {
    x: Math.random() * 1200,
    y: Math.random() * 800,
    vx: (Math.random() - 0.5) * 0.01,
    vy: (Math.random() - 0.5) * 0.01,
  };
}

function createNode(
  id: string,
  name: string,
  type: KnowledgeNode["type"],
  category: string,
  extra: Partial<KnowledgeNode> = {},
  index: number
): KnowledgeNode {
  return {
    id,
    name,
    type,
    category,
    created_at: extra.created_at || new Date().toISOString(),
    folder_id: extra.folder_id ?? null,
    index,
    ...randomPosition(),
    ...extra,
  };
}

function parseFlashcardContent(deck: any): any[] {
  try {
    if (typeof deck.content === "string") {
      return JSON.parse(deck.content);
    }
    if (Array.isArray(deck.content)) {
      return deck.content;
    }
  } catch (error) {
    console.error("Error parsing flashcard content:", error);
  }
  return [];
}

function countIndividualFlashcards(flashcards: any[]): number {
  return flashcards.reduce((total, deck) => {
    try {
      return total + parseFlashcardContent(deck).length;
    } catch {
      return total;
    }
  }, 0);
}

function significantWords(text: string): string[] {
  return text
    .split(/\s+/)
    .filter((word) => word.length > 2 && !STOPS.includes(word));
}

function buildNodesAndLinks(
  folders: any[],
  notes: any[],
  atoms: any[],
  flashcards: any[]
) {
  const nodes: KnowledgeNode[] = [];
  const links: KnowledgeLink[] = [];
  const categorySet = new Set<string>();
  let index = 0;

  for (const folder of folders) {
    const folderType = folder.content_type || folder.folder_type;
    const category = folderType === "notes" ? "Notes" : "Atoms";
    nodes.push(
      createNode(folder.id, folder.name || `${folderType} Folder`, "folder", category, { created_at: folder.created_at }, index++)
    );
    categorySet.add(category);
  }

  for (const note of notes) {
    const category = note.folder_id ? "Notes" : "Uncategorized Notes";
    nodes.push(
      createNode(note.id, note.title || "Untitled Note", "note", category, {
        content: note.content,
        folder_id: note.folder_id,
        created_at: note.created_at,
        is_favorite: note.is_favorite,
        is_pinned: note.is_pinned,
      }, index++)
    );
    categorySet.add(category);
    if (note.folder_id) {
      links.push({ source: note.folder_id, target: note.id, relationship: "contains" });
    }
  }

  for (const atom of atoms) {
    const category = atom.folder_id ? "Atoms" : "Uncategorized Atoms";
    nodes.push(
      createNode(atom.id, atom.title || "Untitled Atom", "atom", category, {
        content: atom.content,
        folder_id: atom.folder_id,
        created_at: atom.created_at,
        is_favorite: atom.favorite,
        is_pinned: atom.pinned,
      }, index++)
    );
    categorySet.add(category);
    if (atom.folder_id) {
      links.push({ source: atom.folder_id, target: atom.id, relationship: "contains" });
    }
  }

  categorySet.add("Flashcards");
  for (const deck of flashcards) {
    const flashcardContent = parseFlashcardContent(deck);
    const deckName = `${deck.deck_name} (${flashcardContent.length} cards)`;
    nodes.push(
      createNode(deck.id, deckName, "flashcard_deck", "Flashcards", {
        content: `Flashcard deck with ${flashcardContent.length} cards`,
        created_at: deck.created_at,
      }, index++)
    );

    for (let i = 0; i < flashcardContent.length; i++) {
      const card = flashcardContent[i];
      const cardId = `${deck.id}_card_${i}`;
      const cardName = card.question
        ? card.question.length > 30
          ? `${card.question.substring(0, 30)}...`
          : card.question
        : `Card ${i + 1}`;

      nodes.push(
        createNode(cardId, cardName, "flashcard", "Flashcards", {
          content: `Question: ${card.question || "No question"}\nAnswer: ${card.answer || "No answer"}${card.hint ? `\nHint: ${card.hint}` : ""}`,
          deck_id: deck.id,
          created_at: deck.created_at,
        }, index++)
      );
      links.push({ source: deck.id, target: cardId, relationship: "contains" });
    }
  }

  return { nodes, links, categorySet };
}

function createContentConnections(
  nodes: KnowledgeNode[],
  links: KnowledgeLink[]
) {
  const contentNodes = nodes.filter(
    (n) => n.content && n.type !== "folder" && n.type !== "flashcard_deck"
  );

  for (let i = 0; i < contentNodes.length; i++) {
    for (let j = i + 1; j < contentNodes.length; j++) {
      const a = contentNodes[i];
      const b = contentNodes[j];
      if (a.id === b.id || a.deck_id === b.deck_id) continue;

      const contentA = a.content?.toLowerCase() || "";
      const contentB = b.content?.toLowerCase() || "";
      const titleA = a.name.toLowerCase();
      const titleB = b.name.toLowerCase();

      const wordsA = significantWords(titleA);
      const wordsB = significantWords(titleB);

      const hasCommonWords = wordsA.some((w) => wordsB.includes(w));

      const hasContentOverlap =
        contentA.length > 50 &&
        contentB.length > 50 &&
        (contentA.includes(titleB.slice(0, 10)) ||
          contentB.includes(titleA.slice(0, 10)) ||
          wordsA.some((w) => w.length > 4 && contentB.includes(w)) ||
          wordsB.some((w) => w.length > 4 && contentA.includes(w)));

      if (hasCommonWords || hasContentOverlap) {
        links.push({ source: a.id, target: b.id, relationship: "related" });
      }
    }
  }
}

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
    ...(noteFolders || []).map((f) => ({ ...f, content_type: "notes" })),
    ...(atomFolders || []).map((f) => ({ ...f, content_type: "atoms" })),
  ];
}

export async function fetchAllNotes() {
  const supabase = await createClientForServer();
  const user = await supabase.auth.getUser();
  if (!user.data.user) return [];
  const { data } = await supabase.from("notes").select("*").eq("user_id", user.data.user.id);
  return data || [];
}

export async function fetchAllAtoms() {
  const supabase = await createClientForServer();
  const user = await supabase.auth.getUser();
  if (!user.data.user) return [];
  const { data } = await supabase.from("atoms").select("*").eq("user_id", user.data.user.id);
  return data || [];
}

export async function fetchAllFlashcards() {
  const supabase = await createClientForServer();
  const user = await supabase.auth.getUser();
  if (!user.data.user) return [];
  const { data } = await supabase.from("flashcards").select("*").eq("user_id", user.data.user.id);
  return data || [];
}

export async function fetchKnowledgeGraphData(): Promise<KnowledgeGraphData> {
  try {
    const [folders, notes, atoms, flashcards] = await Promise.all([
      fetchAllFolders(),
      fetchAllNotes(),
      fetchAllAtoms(),
      fetchAllFlashcards(),
    ]);

    const { nodes, links, categorySet } = buildNodesAndLinks(
      folders,
      notes,
      atoms,
      flashcards
    );

    createContentConnections(nodes, links);

    return {
      nodes,
      links,
      categories: ["All", ...Array.from(categorySet)],
      stats: {
        totalNotes: notes.length,
        totalAtoms: atoms.length,
        totalFlashcards: countIndividualFlashcards(flashcards),
        totalFolders: folders.length,
      },
    };
  } catch (error) {
    console.error("Error fetching knowledge graph data:", error);
    return {
      nodes: [],
      links: [],
      categories: ["All"],
      stats: { totalNotes: 0, totalAtoms: 0, totalFlashcards: 0, totalFolders: 0 },
    };
  }
}
