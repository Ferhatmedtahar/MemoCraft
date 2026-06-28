import NotesListClient from "../features/components/NotesList";

async function NotesListServer({
  notesData,
  foldersData,
}: {
  notesData: any[];
  foldersData: any[];
}) {
  return (
    <NotesListClient
      initialNotes={notesData || []}
      initialFolders={foldersData || []}
    />
  );
}

export default NotesListServer;
