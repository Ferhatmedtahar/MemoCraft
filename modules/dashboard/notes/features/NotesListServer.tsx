// This should be your main page component (Server Component)
import NotesListClient from "../features/components/NotesList";

async function NotesListServer({
  notesData,
  foldersData,
}: {
  notesData: any[];
  foldersData: any[];
}) {
  // Fetch data in the server component

  return (
    <NotesListClient
      initialNotes={notesData || []}
      initialFolders={foldersData || []}
    />
  );
}

export default NotesListServer;
