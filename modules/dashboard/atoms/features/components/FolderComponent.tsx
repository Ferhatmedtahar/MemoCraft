"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useDroppable } from "@dnd-kit/core";
import {
  Edit3,
  Folder,
  FolderOpen,
  MoreVertical,
  Palette,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { deleteFolder, updateFolder } from "../../data/folder.actions";
import { Folder as FolderType } from "../../types/folder.type";

interface FolderComponentProps {
  folder: FolderType;
  atomCount?: number;
}

// import { Folder as FolderType } from "../../types/folder.type";
// import { deleteFolder, updateFolder } from "../../data/folder.actions";

function FolderComponent({ folder, atomCount = 0 }: FolderComponentProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [updateName, setUpdateName] = useState(folder.name);
  const [updateColor, setUpdateColor] = useState(folder.color);
  const [isLoading, setIsLoading] = useState(false);

  const { isOver, setNodeRef } = useDroppable({
    id: folder.id,
  });

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!updateName.trim()) return;

    setIsLoading(true);
    try {
      const res = await updateFolder(folder.id, updateName.trim(), updateColor);
      if (res.success) {
        toast.success("Folder updated successfully");
      } else {
        throw new Error(res.message);
      }

      setIsUpdateModalOpen(false);
    } catch (error) {
      toast.error("Failed to update folder");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const res = await deleteFolder(folder.id);
      if (res.success) {
        toast.success("Folder deleted successfully");
      } else {
        throw new Error(res.message);
      }
      setIsDeleteModalOpen(false);
    } catch (error) {
      toast.error("Failed to delete folder");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  console.log("Rendering FolderComponent for folder:", folder);
  {
  }
  return (
    <>
      <div
        ref={setNodeRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative"
      >
        <Card
          className={`
            relative flex items-center justify-between p-4 
            transition-all duration-200 cursor-pointer
            border-2 border-foreground
            ${
              isOver
                ? "ring-2 ring-white ring-opacity-50 transform scale-102 shadow-none translate-y-1"
                : "shadow-[var(--theme-shadow)] hover:shadow-none hover:translate-y-1"
            }
          `}
          style={{
            background: `linear-gradient(135deg, ${folder.color}cc, ${folder.color}dd)`,
          }}
        >
          {/* Folder Icon and Title */}
          <div className="flex items-center gap-4">
            {isOver ? (
              <FolderOpen className="h-6 w-6 text-white" />
            ) : (
              <Folder className="h-6 w-6 text-white" />
            )}
            <div className="flex flex-col">
              <h2 className="text-lg font-semibold text-white capitalize">
                {folder.name}
              </h2>
              <p className="text-white/80 text-sm inline-block py-0.5">
                {atomCount} {atomCount === 1 ? "atom" : "atoms"}
              </p>
            </div>
          </div>

          {/* Drop indicator */}
          {isOver && (
            <div className="absolute inset-0 border-2 border-dashed border-white/50 bg-white/10 flex items-center justify-center">
              <span className="text-white font-medium">Drop atom here</span>
            </div>
          )}
        </Card>

        {/* Action menu */}

        {folder.name !== "unassigned" && folder.id !== "unassigned" && (
          <div
            className={`absolute top-3 right-3 transition-opacity duration-200 `}
          >
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={(e) => e.stopPropagation()}
                  className=" backdrop-blur-sm "
                >
                  <MoreVertical className="h-4 w-4 text-white" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => setIsUpdateModalOpen(true)}>
                  <Edit3 className="h-4 w-4 mr-2 text-primary/90" />
                  Update Folder
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setIsDeleteModalOpen(true)}
                  className="focus:bg-red-800 text-red-400 hover:text-red-100 focus:text-red-400"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Folder
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>

      {/* Update Modal */}
      <Dialog open={isUpdateModalOpen} onOpenChange={setIsUpdateModalOpen}>
        <Dialog.Content className="sm:max-w-[425px]">
          <form onSubmit={handleUpdate}>
            <Dialog.Header>
              <Dialog.Title>Update Folder</Dialog.Title>
              <Dialog.Description>
                Modify your folder name and color
              </Dialog.Description>
            </Dialog.Header>
            <div className="grid gap-4 py-4">
              <div className="grid gap-3">
                <label htmlFor="update-name" className="text-sm font-medium">
                  Folder Name
                </label>
                <Input
                  id="update-name"
                  value={updateName}
                  onChange={(e) => setUpdateName(e.target.value)}
                  placeholder="Enter folder name..."
                  required
                />
              </div>
              <div className="grid gap-3">
                <label
                  htmlFor="update-color"
                  className="text-sm font-medium flex items-center gap-2"
                >
                  <Palette className="h-4 w-4" />
                  Folder Color
                </label>
                <div className="flex items-center space-x-3">
                  <div
                    className="w-8 h-8 rounded-full border-2 border-gray-300 flex-shrink-0"
                    style={{ backgroundColor: updateColor }}
                  />
                  <Input
                    id="update-color"
                    type="text"
                    value={updateColor}
                    onChange={(e) => setUpdateColor(e.target.value)}
                    placeholder="#6366f1"
                    className="font-mono"
                    pattern="^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"
                  />
                </div>
              </div>
            </div>
            <Dialog.Footer>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsUpdateModalOpen(false);
                  setUpdateName(folder.name);
                  setUpdateColor(folder.color);
                }}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Updating..." : "Update"}
              </Button>
            </Dialog.Footer>
          </form>
        </Dialog.Content>
      </Dialog>

      {/* Delete Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <Dialog.Content className="sm:max-w-[425px]">
          <Dialog.Header>
            <Dialog.Title>Delete Folder</Dialog.Title>
            <Dialog.Description>
              Are you sure you want to delete this folder? All atoms in this
              folder will be moved to unassigned. This action cannot be undone.
            </Dialog.Description>
          </Dialog.Header>
          <div className="py-4">
            <div
              className="p-4  border-2 "
              style={{
                background: `linear-gradient(135deg, ${folder.color}50, ${folder.color}80)`,
                borderColor: `${folder.color}80`,
              }}
            >
              <div className="flex items-center gap-3">
                <Folder className="h-5 w-5" style={{ color: folder.color }} />
                <div>
                  <p className="font-medium">{folder.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {atomCount} {atomCount === 1 ? "atom" : "atoms"}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <Dialog.Footer>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="default"
              onClick={handleDelete}
              disabled={isLoading}
            >
              {isLoading ? "Deleting..." : "Delete"}
            </Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog>
    </>
  );
}

export default FolderComponent;
// "use client";

// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";
// import { Dialog } from "@/components/ui/dialog";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { Input } from "@/components/ui/input";
// import { useDroppable } from "@dnd-kit/core";
// import {
//   Edit3,
//   Folder,
//   FolderOpen,
//   MoreVertical,
//   Palette,
//   Trash2,
// } from "lucide-react";
// import { useState } from "react";
// import { deleteFolder, updateFolder } from "../../data/folder.actions";
// import { Folder as FolderType } from "../../types/folder.type";

// interface FolderComponentProps {
//   folder: FolderType;
//   atomCount?: number;
// }

// const colorOptions = [
//   "#6366f1", // indigo
//   "#8b5cf6", // violet
//   "#06b6d4", // cyan
//   "#10b981", // emerald
//   "#f59e0b", // amber
//   "#ef4444", // red
//   "#ec4899", // pink
//   "#84cc16", // lime
// ];

// function FolderComponent({ folder, atomCount = 0 }: FolderComponentProps) {
//   const [isHovered, setIsHovered] = useState(false);
//   const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
//   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
//   const [updateName, setUpdateName] = useState(folder.name);
//   const [updateColor, setUpdateColor] = useState(folder.color);
//   const [isLoading, setIsLoading] = useState(false);

//   const { isOver, setNodeRef } = useDroppable({
//     id: folder.id,
//   });

//   const handleUpdate = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!updateName.trim()) return;

//     setIsLoading(true);
//     try {
//       await updateFolder(folder.id, updateName.trim(), updateColor);
//       // toast.success("Folder updated successfully");
//       setIsUpdateModalOpen(false);
//     } catch (error) {
//       // toast.error("Failed to update folder");
//       console.error(error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleDelete = async () => {
//     setIsLoading(true);
//     try {
//       await deleteFolder(folder.id);
//       // toast.success("Folder deleted successfully");
//       setIsDeleteModalOpen(false);
//     } catch (error) {
//       // toast.error("Failed to delete folder");
//       console.error(error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <>
//       <div
//         ref={setNodeRef}
//         onMouseEnter={() => setIsHovered(true)}
//         onMouseLeave={() => setIsHovered(false)}
//         className="relative"
//       >
//         <Card
//           className={`
//             relative flex items-center justify-between p-4
//             transition-all duration-200 cursor-pointer
//             border-2 border-foreground
//             ${
//               isOver
//                 ? "ring-2 ring-white ring-opacity-50 transform scale-102 shadow-none translate-y-1"
//                 : "shadow-[var(--theme-shadow)] hover:shadow-none hover:translate-y-1"
//             }
//           `}
//           style={{
//             background: `linear-gradient(135deg, ${folder.color}cc, ${folder.color}dd)`,
//           }}
//         >
//           {/* Folder Icon and Title */}
//           <div className="flex items-center gap-4">
//             {isOver ? (
//               <FolderOpen className="h-6 w-6 text-white" />
//             ) : (
//               <Folder className="h-6 w-6 text-white" />
//             )}
//             <div className="flex flex-col">
//               <h2 className="text-lg font-semibold text-white capitalize">
//                 {folder.name}
//               </h2>
//               <p className="text-white/80 text-sm inline-block py-0.5">
//                 {atomCount} {atomCount === 1 ? "atom" : "atoms"}
//               </p>
//             </div>
//           </div>

//           {/* Drop indicator */}
//           {isOver && (
//             <div className="absolute inset-0 border-2 border-dashed border-white/50 bg-white/10 flex items-center justify-center">
//               <span className="text-white font-medium">Drop atom here</span>
//             </div>
//           )}

//           {/* Atom count badge */}
//           {atomCount > 0 && (
//             <div className="bg-primary/30 backdrop-blur-sm rounded-full px-3 py-1">
//               <span className="text-white font-medium text-sm">
//                 {atomCount}
//               </span>
//             </div>
//           )}
//         </Card>

//         {/* Action menu */}
//         <div
//           className={`absolute top-3 right-3 transition-opacity duration-200 ${
//             isHovered ? "opacity-100" : "opacity-0"
//           }`}
//         >
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button
//                 variant="outline"
//                 size="icon"
//                 onClick={(e) => e.stopPropagation()}
//                 className="bg-white/20 backdrop-blur-sm border-white/30 hover:bg-white/30"
//               >
//                 <MoreVertical className="h-4 w-4 text-white" />
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent align="end" className="w-48">
//               <DropdownMenuItem onClick={() => setIsUpdateModalOpen(true)}>
//                 <Edit3 className="h-4 w-4 mr-2 text-primary/90" />
//                 Update Folder
//               </DropdownMenuItem>
//               <DropdownMenuSeparator />
//               <DropdownMenuItem
//                 onClick={() => setIsDeleteModalOpen(true)}
//                 className="focus:bg-red-800 text-red-400 hover:text-red-100 focus:text-red-400"
//               >
//                 <Trash2 className="h-4 w-4 mr-2" />
//                 Delete Folder
//               </DropdownMenuItem>
//             </DropdownMenuContent>
//           </DropdownMenu>
//         </div>
//       </div>

//       {/* Update Modal */}
//       <Dialog open={isUpdateModalOpen} onOpenChange={setIsUpdateModalOpen}>
//         <Dialog.Content className="sm:max-w-[425px]">
//           <form onSubmit={handleUpdate}>
//             <Dialog.Header>
//               <Dialog.Title>Update Folder</Dialog.Title>
//               <Dialog.Description>
//                 Modify your folder name and color
//               </Dialog.Description>
//             </Dialog.Header>
//             <div className="grid gap-4 py-4">
//               <div className="grid gap-3">
//                 <label htmlFor="update-name" className="text-sm font-medium">
//                   Folder Name
//                 </label>
//                 <Input
//                   id="update-name"
//                   value={updateName}
//                   onChange={(e) => setUpdateName(e.target.value)}
//                   placeholder="Enter folder name..."
//                   required
//                 />
//               </div>
//               <div className="grid gap-3">
//                 <label className="text-sm font-medium flex items-center gap-2">
//                   <Palette className="h-4 w-4" />
//                   Folder Color
//                 </label>
//                 <div className="grid grid-cols-4 gap-2">
//                   {colorOptions.map((color) => (
//                     <button
//                       key={color}
//                       type="button"
//                       className={`
//                         w-12 h-12 rounded-full border-2 transition-all
//                         ${
//                           updateColor === color
//                             ? "border-white scale-110 shadow-lg"
//                             : "border-gray-300 hover:scale-105"
//                         }
//                       `}
//                       style={{ backgroundColor: color }}
//                       onClick={() => setUpdateColor(color)}
//                     />
//                   ))}
//                 </div>
//               </div>
//             </div>
//             <Dialog.Footer>
//               <Button
//                 type="button"
//                 variant="outline"
//                 onClick={() => {
//                   setIsUpdateModalOpen(false);
//                   setUpdateName(folder.name);
//                   setUpdateColor(folder.color);
//                 }}
//                 disabled={isLoading}
//               >
//                 Cancel
//               </Button>
//               <Button type="submit" disabled={isLoading}>
//                 {isLoading ? "Updating..." : "Update"}
//               </Button>
//             </Dialog.Footer>
//           </form>
//         </Dialog.Content>
//       </Dialog>

//       {/* Delete Modal */}
//       <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
//         <Dialog.Content className="sm:max-w-[425px]">
//           <Dialog.Header>
//             <Dialog.Title>Delete Folder</Dialog.Title>
//             <Dialog.Description>
//               Are you sure you want to delete this folder? All atoms in this
//               folder will be moved to unassigned. This action cannot be undone.
//             </Dialog.Description>
//           </Dialog.Header>
//           <div className="py-4">
//             <div
//               className="p-4 rounded-lg border"
//               style={{
//                 background: `linear-gradient(135deg, ${folder.color}20, ${folder.color}30)`,
//                 borderColor: `${folder.color}40`,
//               }}
//             >
//               <div className="flex items-center gap-3">
//                 <Folder className="h-5 w-5" style={{ color: folder.color }} />
//                 <div>
//                   <p className="font-medium">{folder.name}</p>
//                   <p className="text-sm text-muted-foreground">
//                     {atomCount} {atomCount === 1 ? "atom" : "atoms"}
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//           <Dialog.Footer>
//             <Button
//               type="button"
//               variant="outline"
//               onClick={() => setIsDeleteModalOpen(false)}
//               disabled={isLoading}
//             >
//               Cancel
//             </Button>
//             <Button
//               type="button"
//               variant="default"
//               onClick={handleDelete}
//               disabled={isLoading}
//             >
//               {isLoading ? "Deleting..." : "Delete"}
//             </Button>
//           </Dialog.Footer>
//         </Dialog.Content>
//       </Dialog>
//     </>
//   );
// }

// export default FolderComponent;
// // import { Card } from "@/components/ui/card";
// // import { useDroppable } from "@dnd-kit/core";
// // import { Folder, FolderOpen } from "lucide-react";
// // import { Folder as FolderType } from "../../types/folder.type";

// // interface FolderComponentProps {
// //   folder: FolderType;
// //   atomCount?: number;
// // }

// // function FolderComponent({ folder, atomCount = 0 }: FolderComponentProps) {
// //   const { isOver, setNodeRef } = useDroppable({
// //     id: folder.id,
// //   });

// //   return (
// //     <div ref={setNodeRef}>
// //       <Card
// //         className={`
// //           relative flex items-center justify-between p-4
// //           transition-all duration-200 cursor-pointer
// //           border-2 border-foreground
// //           ${
// //             isOver
// //               ? "ring-2 ring-white ring-opacity-50 transform scale-102 shadow-none translate-y-1"
// //               : "shadow-[var(--theme-shadow)] hover:shadow-none hover:translate-y-1"
// //           }
// //         `}
// //         style={{
// //           background: `linear-gradient(135deg, ${folder.color}cc, ${folder.color}dd)`,
// //         }}
// //       >
// //         {/* Folder Icon and Title */}
// //         <div className="flex items-center gap-4">
// //           {isOver ? (
// //             <FolderOpen className="h-6 w-6 text-white" />
// //           ) : (
// //             <Folder className="h-6 w-6 text-white" />
// //           )}
// //           <div className="flex flex-col">
// //             <h2 className="text-lg font-semibold text-white capitalize">
// //               {folder.name}
// //             </h2>
// //             <p className="text-white/80 text-sm inline-block py-0.5">
// //               {atomCount} {atomCount === 1 ? "atom" : "atoms"}
// //             </p>
// //           </div>
// //         </div>

// //         {/* Drop indicator */}
// //         {isOver && (
// //           <div className="absolute inset-0 border-2 border-dashed border-white/50 bg-white/10 flex items-center justify-center">
// //             <span className="text-white font-medium">Drop atom here</span>
// //           </div>
// //         )}

// //         {/* Atom count badge */}
// //         {atomCount > 0 && (
// //           <div className="bg-primary/30 backdrop-blur-sm rounded-full px-3 py-1">
// //             <span className="text-white font-medium text-sm">{atomCount}</span>
// //           </div>
// //         )}
// //       </Card>
// //     </div>
// //   );
// // }

// // export default FolderComponent;
