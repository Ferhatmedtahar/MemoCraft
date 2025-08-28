import CreateAtomDialog from "@/modules/dashboard/atoms/features/CreateAtomDialog";
import AtomsListServer from "./features/components/AtomListServer";
import CreateFolderDialog from "./features/CreateFolderDialog";
export default async function AtomsScreen() {
  return (
    <div className="space-y-6 h-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Atoms</h1>
          <p className="text-muted-foreground mt-2">
            Your atomic notes and knowledge bits
          </p>
        </div>
        <div className="flex space-x-2">
          <CreateAtomDialog />
          <CreateFolderDialog />
        </div>
      </div>
      <main className="h-full">
        <AtomsListServer />
      </main>
    </div>
  );
}
