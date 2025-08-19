import CreateAtomDialog from "@/modules/dashboard/atoms/features/CreateAtomDialog";
import { createClientForServer } from "@/utils/supabase/server";
import AtomsList from "./features/AtomsList";
export default async function AtomsScreen() {
  const supabase = await createClientForServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  console.log("user", user);
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Atoms</h1>
          <p className="text-muted-foreground mt-2">
            Your atomic notes and knowledge bits
          </p>
        </div>

        <CreateAtomDialog />
      </div>

      <AtomsList />
    </div>
  );
}
