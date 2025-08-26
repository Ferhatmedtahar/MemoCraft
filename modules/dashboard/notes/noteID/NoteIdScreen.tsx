import MarkdownRenderer from "@/components/common/markdown-renderer";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Pin, Star } from "lucide-react"; // lucide-react icons
import Link from "next/link";
import { fetchNoteById } from "../data/fetchData";
import { NoteId } from "../types/notes.type";

async function NoteIdScreen({ id }: { id: string }) {
  const noteContent: NoteId = await fetchNoteById(id);

  const createdAt = new Date(noteContent.created_at);
  const updatedAt = new Date(noteContent.updated_at);

  const isUpdated = noteContent.updated_at !== noteContent.created_at;
  console.log("noteContent:", noteContent);
  return (
    <main className="p-4">
      {/* Title + icons */}
      <div className="flex items-center justify-between gap-2 mb-2 border-b pb-2">
        <div className="flex flex-col gap-3 pb-2 ">
          <h1 className="text-4xl font-bold">{noteContent.title}</h1>
          <Button variant="outline" className="w-fit">
            <Link href={`/dashboard/notes/update/${id}`}>Edit Note</Link>
          </Button>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-2">
            {noteContent.is_pinned && (
              <Pin className="w-5 h-5 text-blue-500" aria-label="Pinned" />
            )}

            {noteContent.is_favorite && (
              <Star className="w-5 h-5 text-yellow-500" aria-label="Favorite" />
            )}
          </div>
          <div className="text-sm text-gray-500 mb-4">
            <p>Created: {format(createdAt, "PPP p")}</p>
            {isUpdated && <p>Updated: {format(updatedAt, "PPP p")}</p>}
          </div>
        </div>
      </div>

      <div className="mt-4">
        <MarkdownRenderer
          content={noteContent.content || "Your content will appear here..."}
        />
      </div>
    </main>
  );
}

export default NoteIdScreen;
