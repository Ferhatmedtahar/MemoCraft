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
        className="rounded-full ring-2 ring-background shadow-sm cursor-pointer hover:ring-primary/50 transition-all duration-200"
      />

      {/* Tooltip */}
      <div className="absolute left-1/2 -translate-x-1/2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
        <div className="bg-popover border border-border  shadow-lg px-3 py-2 text-xs whitespace-nowrap">
          <p className="font-medium text-popover-foreground">
            {user.user_metadata.full_name}
          </p>
          <p className="text-muted-foreground">{user.email}</p>
          {/* Small arrow */}
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-popover border-l border-t border-border rotate-45"></div>
        </div>
      </div>
    </div>
  );
}
// import type { User } from "@supabase/supabase-js";
// import Image from "next/image";

// type UserProfileProps = {
//   user: User;
// };

// export default function UserProfile({ user }: UserProfileProps) {
//   return (
//     <div className="relative group inline-block">
//       <div className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
//         <Image
//           src={user.user_metadata.avatar_url}
//           alt={user.user_metadata.full_name}
//           width={32}
//           height={32}
//           className="rounded-full ring-2 ring-background shadow-sm"
//         />
//         <div className="hidden sm:block">
//           <p className="text-sm font-medium text-foreground leading-none">
//             {user.user_metadata.full_name}
//           </p>
//           <p className="text-xs text-muted-foreground mt-0.5">{user.email}</p>
//         </div>
//       </div>

//       {/* Tooltip for mobile/small screens */}
//       <div className="absolute left-1/2 -translate-x-1/2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 sm:hidden">
//         <div className="bg-popover border border-border rounded-md shadow-lg px-3 py-2 text-xs whitespace-nowrap">
//           <p className="font-medium text-popover-foreground">
//             {user.user_metadata.full_name}
//           </p>
//           <p className="text-muted-foreground">{user.email}</p>
//           {/* Small arrow */}
//           <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-popover border-l border-t border-border rotate-45"></div>
//         </div>
//       </div>
//     </div>
//   );
// } // import type { User } from "@supabase/supabase-js";
// // import Image from "next/image";

// // type UserProfileProps = {
// //   user: User;
// // };

// // export default function UserProfile({ user }: UserProfileProps) {
// //   return (
// //     <div className="relative group inline-block">
// //       <Image
// //         src={user.user_metadata.avatar_url}
// //         alt={user.user_metadata.full_name}
// //         width={32}
// //         height={32}
// //         className="rounded-full cursor-pointer"
// //       />
// //       <span className="absolute left-1/2 -translate-x-1/2 mt-2 hidden group-hover:block rounded bg-gray-800 px-2 py-1 text-xs text-white shadow-lg whitespace-nowrap">
// //         {user.user_metadata.full_name}
// //       </span>
// //     </div>
// //   );
// // }

// // // import { Tooltip } from "@/components/ui/tooltip";
// // // import type { User } from "@supabase/supabase-js";
// // // import Image from "next/image";

// // // type UserProfileProps = {
// // //   user: User;
// // // };

// // // export default function UserProfile({ user }: UserProfileProps) {
// // //   return (
// // //     <Tooltip.Provider>
// // //       <Tooltip.Root>
// // //         <Tooltip.Trigger asChild>
// // //           <Image
// // //             src={user.user_metadata.avatar_url}
// // //             alt={user.user_metadata.full_name}
// // //             width={32}
// // //             height={32}
// // //             className="rounded-full cursor-pointer"
// // //           />
// // //         </Tooltip.Trigger>
// // //         <Tooltip.Content>
// // //           <p>{user.user_metadata.full_name}</p>
// // //         </Tooltip.Content>
// // //       </Tooltip.Root>
// // //     </Tooltip.Provider>
// // //   );
// // // }
// // // // import { Tooltip } from "@/components/ui/tooltip";
// // // // import type { User } from "@supabase/supabase-js";
// // // // import Image from "next/image";

// // // // type UserProfileProps = {
// // // //   user: User;
// // // // };

// // // // export default function UserProfile({ user }: UserProfileProps) {
// // // //   return (
// // // //     <Tooltip.Provider>
// // // //       <Tooltip>
// // // //         <Tooltip.Trigger asChild>
// // // //           <Image
// // // //             src={user.user_metadata.avatar_url}
// // // //             alt={user.user_metadata.full_name}
// // // //             width={32}
// // // //             height={32}
// // // //             className="rounded-full cursor-pointer"
// // // //           />
// // // //         </Tooltip.Trigger>
// // // //         <Tooltip.Content>
// // // //           <p>{user.user_metadata.full_name}</p>
// // // //         </Tooltip.Content>
// // // //       </Tooltip>
// // // //     </Tooltip.Provider>
// // // //   );
// // // // }

// // // // // import type { User } from "@supabase/supabase-js";
// // // // // import Image from "next/image";
// // // // // type UserProfileProps = {
// // // // //   user: User;
// // // // // };

// // // // // async function UserProfile({ user }: UserProfileProps) {
// // // // //   return (
// // // // //     <div className="flex items-center gap-2">
// // // // //       <Image
// // // // //         src={user.user_metadata.avatar_url}
// // // // //         alt={user.user_metadata.full_name}
// // // // //         width={32}
// // // // //         height={32}
// // // // //         className="rounded-full"
// // // // //       />
// // // // //       <p className="font-medium">{user.user_metadata.full_name}</p>
// // // // //     </div>
// // // // //   );
// // // // // }

// // // // // export default UserProfile;
// // // // // // import Image from "next/image";

// // // // // // async function UserProfile({ user }: { user: any }) {
// // // // // //   console.log("user from profile", user);
// // // // // //   return (
// // // // // //     <div>
// // // // // //       <p>{user.full_name}</p>
// // // // // //       <Image
// // // // // //         src={user.avatar_url}
// // // // // //         alt={user.full_name}
// // // // // //         width={32}
// // // // // //         height={32}
// // // // // //       />
// // // // // //     </div>
// // // // // //   );
// // // // // // }

// // // // // // export default UserProfile;
