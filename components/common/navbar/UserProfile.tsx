import type { User } from "@supabase/supabase-js";
import Image from "next/image";

type UserProfileProps = {
  user: User;
};

export default function UserProfile({ user }: UserProfileProps) {
  return (
    <div className="relative group inline-block">
      <Image
        src={user.user_metadata.avatar_url}
        alt={user.user_metadata.full_name}
        width={32}
        height={32}
        className=" border-2 border-primary  shadow-sm cursor-pointer hover:ring-primary/50 transition-all duration-200"
      />
      <div className="absolute left-1/2 -translate-x-1/2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
        <div className="bg-popover border border-border  shadow-lg px-3 py-2 text-xs whitespace-nowrap">
          <p className="font-medium text-popover-foreground">
            {user.user_metadata.full_name}
          </p>
          <p className="text-muted-foreground">{user.email}</p>
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-popover border-l border-t border-border rotate-45"></div>
        </div>
      </div>
    </div>
  );
}
