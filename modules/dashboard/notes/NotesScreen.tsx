import { Button } from "@/components/ui/button";
import Link from "next/link";
import { fetchFolders, fetchNotes } from "./data/fetchData";
import NotesListServer from "./features/NotesListServer";

async function NotesScreen() {
  const [notesData, foldersData] = await Promise.all([
    fetchNotes(),
    fetchFolders(),
  ]);
  console.log("Fetched notes:", notesData);
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Notes</h1>
          <p className="text-muted-foreground mt-2">
            Your personal notes and knowledge repository
          </p>
        </div>
        <div>
          <Button size="sm" className="text-white">
            <Link href="/dashboard/notes/new">Create Note</Link>
          </Button>
        </div>
      </div>
      {notesData && foldersData && notesData.length > 0 ? (
        <NotesListServer notesData={notesData} foldersData={foldersData} />
      ) : (
        <div>List of Notes will be displayed here.</div>
      )}
    </div>
  );
}

export default NotesScreen;
