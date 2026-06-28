import CreateAtomDialog from "@/modules/dashboard/atoms/features/CreateAtomDialog";
import AtomsListServer from "./features/components/AtomListServer";
import CreateFolderDialog from "./features/CreateFolderDialog";

export default async function AtomsScreen() {
  return (
    <div className="space-y-6 h-full">
      {/* Responsive Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground break-words">
            Atoms
          </h1>
          <p className="text-muted-foreground mt-2 text-sm sm:text-base break-words">
            Your atomic notes and knowledge bits
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:space-x-2 w-full sm:w-auto">
          <div className="w-full sm:w-auto">
            <CreateAtomDialog />
          </div>
          <div className="w-full sm:w-auto">
            <CreateFolderDialog />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="h-full">
        <AtomsListServer />
      </main>
    </div>
  );
}
