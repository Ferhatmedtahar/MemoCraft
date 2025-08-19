import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createClientForServer } from "@/utils/supabase/server";

export default async function ProfilePage() {
  const supabase = await createClientForServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Profile</h1>
        <p className="text-muted-foreground mt-2">
          Manage your account and preferences
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>Your account details and settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground">Email</label>
            <p className="text-muted-foreground">{user?.email}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">
              User ID
            </label>
            <p className="text-muted-foreground font-mono text-xs">
              {user?.id}
            </p>
          </div>
          <Button variant="outline">Edit Profile</Button>
        </CardContent>
      </Card>
    </div>
  );
}
