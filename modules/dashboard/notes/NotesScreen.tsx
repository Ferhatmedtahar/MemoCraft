import { Button } from "@/components/ui/button";
import { NotebookPenIcon } from "lucide-react";
import Link from "next/link";
import { fetchFolders, fetchNotes } from "./data/fetchData";
import CreateFolderDialog from "./features/components/CreateFolderDialog";
import NotesListServer from "./features/NotesListServer";

async function NotesScreen() {
  const [notesData, { success, data: foldersData }] = await Promise.all([
    fetchNotes(),
    fetchFolders(),
  ]);

  return (
    <div className="space-y-6 h-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Notes</h1>
          <p className="text-muted-foreground mt-2">
            Your personal notes and knowledge repository
          </p>
        </div>
        <div className="flex space-x-2">
          <Button>
            <Link href="/dashboard/notes/new">Create Note</Link>
          </Button>
          <CreateFolderDialog />{" "}
        </div>
      </div>
      {notesData && foldersData && notesData.length > 0 ? (
        <NotesListServer notesData={notesData} foldersData={foldersData} />
      ) : (
        <div className=" flex items-center justify-center text-muted-foreground text-bold text-xl h-[75%]">
          <p className=" flex flex-col  justify-center items-center gap-4 bg-secondary/70 border-4 border-secondary p-4">
            <NotebookPenIcon className="w-12 h-12" />
            <span>Start by creating your first note!</span>
          </p>
        </div>
      )}
    </div>
  );
}

export default NotesScreen;
