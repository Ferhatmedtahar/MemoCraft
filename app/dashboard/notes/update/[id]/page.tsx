import { Button } from "@/components/ui/button";
import { fetchNoteById } from "@/modules/dashboard/notes/data/fetchData";
import UpdateNoteScreen from "@/modules/dashboard/notes/noteID/features/UpdateScreen";
import Link from "next/link";

export default async function UpdatePostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { success, data: noteData } = await fetchNoteById(id);

  if (!success) {
    return (
      <div className="h-full flex flex-col justify-center items-center">
        <p className="text-center text-muted-foreground mt-10">
          Note not found
        </p>
        <Button className="mt-4">
          <Link href="/dashboard/notes">Back to Notes</Link>
        </Button>
      </div>
    );
  }

  return (
    <UpdateNoteScreen
      notetitle={noteData.title}
      id={id}
      notecontent={noteData.content}
    />
  );
}
