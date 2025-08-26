import { fetchNoteById } from "@/modules/dashboard/notes/data/fetchData";
import UpdateNoteScreen from "@/modules/dashboard/notes/noteID/features/UpdateScreen";

export default async function UpdatePostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const noteData = await fetchNoteById(id);
  return (
    <UpdateNoteScreen
      notetitle={noteData.title}
      id={id}
      notecontent={noteData.content}
    />
  );
}
