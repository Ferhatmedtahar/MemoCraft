import { fetchAtoms } from "@/modules/dashboard/atoms/data/fetchData";
import DashboardScreen from "@/modules/dashboard/dashboard/dashboardScreen";
import { getActivityData } from "@/modules/dashboard/dashboard/data/activity.action";
import { fetchNotes } from "@/modules/dashboard/notes/data/fetchData";
import { createClientForServer } from "@/utils/supabase/server";

export default async function DashboardPage() {
  const [data, activityData] = await Promise.all([
    fetchDashboardData(),
    getActivityData(),
  ]);

  return (
    <div className="space-y-6 ">
      {/* <Suspense
        fallback={
          <div className="text-white flex items-center justify-center  h-full text-lg ">
            <div className="loader" />
          </div>
        }
      > */}
      <DashboardScreen data={data} activityData={activityData} />
      {/* </Suspense> */}
      {/* <div>
        <h1 className="text-3xl font-bold text-foreground">
          Welcome to your Dashboard
        </h1>
        <p className="text-muted-foreground mt-2">
          Manage your notes, flashcards, and get AI assistance all in one place.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <Card
              key={feature.title}
              className="hover:shadow-lg transition-shadow cursor-pointer"
            >
              <Card.Header>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <Card.Title className="text-xl">{feature.title}</Card.Title>
                    <Card.Description>{feature.description}</Card.Description>
                  </div>
                </div>
              </Card.Header>
            </Card>
          );
        })}
      </div> */}
    </div>
  );
}
async function fetchDashboardData() {
  const supabase = await createClientForServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  // Fetch notes and atoms
  const notes = (await fetchNotes()) || [];
  const atoms = (await fetchAtoms()) || [];

  // For now, flashcards will be 0 since not implemented yet
  const flashcards: any = [];

  return {
    user,
    notes,
    atoms,
    flashcards,
  };
}
