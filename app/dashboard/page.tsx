import DashboardScreen from "@/modules/dashboard/dashboard/dashboardScreen";
import { getActivityData } from "@/modules/dashboard/dashboard/data/activity.action";
import { fetchDashboardData } from "@/modules/dashboard/dashboard/data/dashobard.action"; // Import the updated function

export default async function DashboardPage() {
  const [data, activityData] = await Promise.all([
    fetchDashboardData(),
    getActivityData(),
  ]);

  return (
    <div className="space-y-6">
      <DashboardScreen data={data} activityData={activityData} />
    </div>
  );
}
