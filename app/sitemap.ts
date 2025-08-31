import { fetchDecks } from "@/modules/dashboard/decks/features/data/fetchData";
import { fetchNotes } from "@/modules/dashboard/notes/data/fetchData";
import { MetadataRoute } from "next";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { data: decks } = await fetchDecks();
  const notes = await fetchNotes();

  const decksUrl = (decks || []).map((deck) => ({
    url: `${baseUrl}/decks/${deck.id}`,
    lastModified: new Date(),
    priority: 0.8,
  }));
  const decksUrlStudy = (decks || []).map((deck) => ({
    url: `${baseUrl}/decks/study/${deck.id}`,
    lastModified: new Date(),
    priority: 0.8,
  }));

  const notesUrl = (notes || []).map((note) => ({
    url: `${baseUrl}/notes/${note.id}`,
    lastModified: new Date(),
    priority: 0.8,
  }));

  const notesUpdateUrl = (notes || []).map((note) => ({
    url: `${baseUrl}/notes/update/${note.id}`,
    lastModified: new Date(),
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      priority: 1.0,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      priority: 1.0,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      priority: 1.0,
    },
    {
      url: `${baseUrl}/dashboard`,
      lastModified: new Date(),
      priority: 0.9,
    },
    {
      url: `${baseUrl}/dashboard/graph-view`,
      lastModified: new Date(),
      priority: 0.9,
    },
    {
      url: `${baseUrl}/dashboard/ai-assistant`,
      lastModified: new Date(),
      priority: 0.7,
    },
    {
      url: `${baseUrl}/dashboard/decks`,
      lastModified: new Date(),
      priority: 0.7,
    },

    {
      url: `${baseUrl}/dashboard/atoms`,
      lastModified: new Date(),
      priority: 0.9,
    },
    {
      url: `${baseUrl}/dashboard/notes`,
      lastModified: new Date(),
      priority: 0.9,
    },
    {
      url: `${baseUrl}/dashboard/notes/new`,
      lastModified: new Date(),
      priority: 0.9,
    },
    {
      url: `${baseUrl}/profile`,
      lastModified: new Date(),
      priority: 0.9,
    },

    {
      url: `${baseUrl}/videos`,
      lastModified: new Date(),
      priority: 1.0,
    },
    ...decksUrl,
    ...decksUrlStudy,
    ...notesUrl,
    ...notesUpdateUrl,
  ];
}
