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
      {/* Responsive Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground break-words">
            Notes
          </h1>
          <p className="text-muted-foreground mt-2 text-sm sm:text-base break-words">
            Your personal notes and knowledge repository
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:space-x-2 w-full sm:w-auto">
          <Button className="w-full sm:w-auto">
            <Link href="/dashboard/notes/new" className="block w-full">
              Create Note
            </Link>
          </Button>
          <div className="w-full sm:w-auto">
            <CreateFolderDialog className={"w-full sm:w-auto"} />
          </div>
        </div>
      </div>

      {/* Content */}
      {notesData && foldersData && notesData.length > 0 ? (
        <NotesListServer notesData={notesData} foldersData={foldersData} />
      ) : (
        <div className="flex items-center justify-center text-muted-foreground h-[75%] px-4">
          <div className="flex flex-col justify-center items-center gap-4 bg-secondary/70 border-2 sm:border-4 border-secondary  p-6 sm:p-8 text-center max-w-md">
            <NotebookPenIcon className="w-10 h-10 sm:w-12 sm:h-12" />
            <span className="text-lg sm:text-xl font-semibold break-words">
              Start by creating your first note!
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default NotesScreen;
