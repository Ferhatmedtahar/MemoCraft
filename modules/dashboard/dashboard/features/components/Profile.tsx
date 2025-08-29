import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { User } from "@supabase/supabase-js";
import { Award, Calendar, Target, Trophy } from "lucide-react";
import { getInitials } from "../../lib/helpers";

function Profile({ user, NumOfitems = 0 }: { user: User; NumOfitems: number }) {
  // Calculate days since joining
  const memberSince = new Date(user.created_at);
  const today = new Date();
  const daysSinceJoining = Math.floor(
    (today.getTime() - memberSince.getTime()) / (1000 * 3600 * 24)
  );

  // Calculate user level based on total items (gamification)
  const getUserLevel = (items: number) => {
    if (items >= 100)
      return { level: 5, title: "Expert", color: "bg-purple-500" };
    if (items >= 50)
      return { level: 4, title: "Advanced", color: "bg-blue-500" };
    if (items >= 25)
      return { level: 3, title: "Intermediate", color: "bg-green-500" };
    if (items >= 10)
      return { level: 2, title: "Beginner", color: "bg-yellow-500" };
    return { level: 1, title: "Starter", color: "bg-gray-500" };
  };

  const userLevel = getUserLevel(NumOfitems);
  const nextLevelThreshold = [10, 25, 50, 100, 200][userLevel.level - 1];
  const progressToNext = nextLevelThreshold
    ? Math.min((NumOfitems / nextLevelThreshold) * 100, 100)
    : 100;

  return (
    <Card className="h-full w-full">
      <Card.Header className="pb-4">
        <Card.Title className="text-center mb-0 flex items-center justify-center gap-2">
          <Award className="h-5 w-5" />
          Profile
        </Card.Title>
      </Card.Header>

      <Card.Content className="space-y-6">
        {/* User Avatar and Basic Info */}
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="relative">
            <Avatar className="w-24 h-24 ring-2 ring-primary/20">
              <Avatar.Image src={user.user_metadata?.avatar_url} />
              <Avatar.Fallback className="text-xl font-semibold">
                {getInitials(user.user_metadata?.full_name || user.email)}
              </Avatar.Fallback>
            </Avatar>
            {/* Level badge on avatar */}
            <div
              className={`absolute -bottom-1 -right-1 ${userLevel.color} text-foreground text-xs px-2 py-1 rounded-full font-bold`}
            >
              L{userLevel.level}
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-bold text-xl">
              {user.user_metadata?.full_name || "User"}
            </h3>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            <Badge variant="default" className="text-xs">
              {userLevel.title}
            </Badge>
          </div>
        </div>

        {/* Progress Bar */}
        {userLevel.level < 5 && (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">
                Progress to next level
              </span>
              <span className="text-xs font-medium">
                {NumOfitems}/{nextLevelThreshold}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressToNext}%` }}
              ></div>
            </div>
          </div>
        )}

        <div className="space-y-3">
          <h4 className="font-semibold text-sm flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            Achievements
          </h4>
          <div className="space-y-2 grid grid-cols-2 items-start justify-center">
            {NumOfitems >= 1 && (
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Getting Started</span>
              </div>
            )}

            {NumOfitems >= 25 && (
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>Knowledge Builder</span>
              </div>
            )}
            {daysSinceJoining >= 7 && (
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span>Week Warrior</span>
              </div>
            )}
            {daysSinceJoining >= 30 && (
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span>Month Master</span>
              </div>
            )}
          </div>
        </div>

        {/* Member Info */}
        <div className="space-y-3 pt-4 border-t">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Member since
              </span>
            </div>
            <span className="text-sm font-medium">
              {memberSince.toLocaleDateString("en-US", {
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Next Goal</span>
            </div>
            <span className="text-sm font-medium">
              {userLevel.level < 5
                ? `${nextLevelThreshold - NumOfitems} more items`
                : "Max Level!"}
            </span>
          </div>
        </div>

        {/* Quick Action or Status */}
      </Card.Content>
    </Card>
  );
}

export default Profile;
// import { Avatar } from "@/components/ui/avatar";
// import { Card } from "@/components/ui/card";
// import { User } from "@supabase/supabase-js";
// import { getInitials } from "../../lib/helpers";
// function Profile({ user, NumOfitems = 0 }: { user: User; NumOfitems: number }) {
//   return (
//     <Card className="h-full w-full">
//       <Card.Header>
//         <Card.Title className="text-center mb-0">Profile</Card.Title>
//       </Card.Header>
//       <Card.Content className="space-y-4">
//         <div className="flex flex-col items-center text-center space-y-3">
//           <Avatar className="w-28 h-28">
//             <Avatar.Image src={user.user_metadata?.avatar_url} />
//             <Avatar.Fallback className="text-lg">
//               {getInitials(user.user_metadata?.full_name || user.email)}
//             </Avatar.Fallback>
//           </Avatar>
//           <div>
//             <h3 className="font-semibold text-lg">
//               {user.user_metadata?.full_name || "User"}
//             </h3>
//             <p className="text-sm text-muted-foreground">{user.email}</p>
//           </div>
//         </div>

//         <div className="space-y-2 pt-4 border-t">
//           <div className="flex items-center justify-between">
//             <span className="text-sm text-muted-foreground">Member since</span>
//             <span className="text-sm font-medium">
//               {new Date(user.created_at).toLocaleDateString("en-US", {
//                 month: "short",
//                 year: "numeric",
//               })}
//             </span>
//           </div>
//           <div className="flex items-center justify-between">
//             <span className="text-sm text-muted-foreground">Total Items</span>
//             <span className="text-sm font-medium">{NumOfitems}</span>
//           </div>
//         </div>
//       </Card.Content>
//     </Card>
//   );
// }

// export default Profile;
