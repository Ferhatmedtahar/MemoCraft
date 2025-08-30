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
            relative flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 
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
          <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1 pr-2 sm:pr-0">
            {isOver ? (
              <FolderOpen className="h-5 w-5 sm:h-6 sm:w-6 text-white flex-shrink-0" />
            ) : (
              <Folder className="h-5 w-5 sm:h-6 sm:w-6 text-white flex-shrink-0" />
            )}
            <div className="flex flex-col min-w-0">
              <h2 className="text-base sm:text-lg font-semibold text-white capitalize break-words">
                {folder.name}
              </h2>
              <p className="text-white/80 text-xs sm:text-sm inline-block py-0.5">
                {atomCount} {atomCount === 1 ? "atom" : "atoms"}
              </p>
            </div>
          </div>

          {/* Action menu - positioned for mobile */}
          {folder.name !== "unassigned" && folder.id !== "unassigned" && (
            <div className="absolute top-2 right-2 sm:top-3 sm:right-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={(e) => e.stopPropagation()}
                    className="h-8 w-8 sm:h-10 sm:w-10 backdrop-blur-sm"
                  >
                    <MoreVertical className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
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

          {/* Drop indicator */}
          {isOver && (
            <div className="absolute inset-0 border-2 border-dashed border-white/50 bg-white/10 flex items-center justify-center ">
              <span className="text-white font-medium text-sm sm:text-base text-center px-2">
                Drop atom here
              </span>
            </div>
          )}
        </Card>
      </div>

      {/* Update Modal */}
      <Dialog open={isUpdateModalOpen} onOpenChange={setIsUpdateModalOpen}>
        <Dialog.Content className="sm:max-w-[425px] mx-2 sm:mx-0">
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
                    className="font-mono text-sm"
                    pattern="^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"
                  />
                </div>
              </div>
            </div>
            <Dialog.Footer className="flex flex-col sm:flex-row gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsUpdateModalOpen(false);
                  setUpdateName(folder.name);
                  setUpdateColor(folder.color);
                }}
                disabled={isLoading}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full sm:w-auto"
              >
                {isLoading ? "Updating..." : "Update"}
              </Button>
            </Dialog.Footer>
          </form>
        </Dialog.Content>
      </Dialog>

      {/* Delete Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <Dialog.Content className="sm:max-w-[425px] mx-2 sm:mx-0">
          <Dialog.Header>
            <Dialog.Title>Delete Folder</Dialog.Title>
            <Dialog.Description>
              Are you sure you want to delete this folder? All atoms in this
              folder will be moved to unassigned. This action cannot be undone.
            </Dialog.Description>
          </Dialog.Header>
          <div className="py-4">
            <div
              className="p-3 sm:p-4 border-2 "
              style={{
                background: `linear-gradient(135deg, ${folder.color}50, ${folder.color}80)`,
                borderColor: `${folder.color}80`,
              }}
            >
              <div className="flex items-center gap-3">
                <Folder
                  className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0"
                  style={{ color: folder.color }}
                />
                <div className="min-w-0">
                  <p className="font-medium break-words">{folder.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {atomCount} {atomCount === 1 ? "atom" : "atoms"}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <Dialog.Footer className="flex flex-col sm:flex-row gap-2 ">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
              disabled={isLoading}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="default"
              onClick={handleDelete}
              disabled={isLoading}
              className="w-full sm:w-auto"
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
// import { toast } from "sonner";
// import { deleteFolder, updateFolder } from "../../data/folder.actions";
// import { Folder as FolderType } from "../../types/folder.type";

// interface FolderComponentProps {
//   folder: FolderType;
//   atomCount?: number;
// }

// // import { Folder as FolderType } from "../../types/folder.type";
// // import { deleteFolder, updateFolder } from "../../data/folder.actions";

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
//       const res = await updateFolder(folder.id, updateName.trim(), updateColor);
//       if (res.success) {
//         toast.success("Folder updated successfully");
//       } else {
//         throw new Error(res.message);
//       }

//       setIsUpdateModalOpen(false);
//     } catch (error) {
//       toast.error("Failed to update folder");
//       console.error(error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleDelete = async () => {
//     setIsLoading(true);
//     try {
//       const res = await deleteFolder(folder.id);
//       if (res.success) {
//         toast.success("Folder deleted successfully");
//       } else {
//         throw new Error(res.message);
//       }
//       setIsDeleteModalOpen(false);
//     } catch (error) {
//       toast.error("Failed to delete folder");
//       console.error(error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   console.log("Rendering FolderComponent for folder:", folder);
//   {
//   }
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
//         </Card>

//         {/* Action menu */}

//         {folder.name !== "unassigned" && folder.id !== "unassigned" && (
//           <div
//             className={`absolute top-3 right-3 transition-opacity duration-200 `}
//           >
//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <Button
//                   variant="outline"
//                   size="icon"
//                   onClick={(e) => e.stopPropagation()}
//                   className=" backdrop-blur-sm "
//                 >
//                   <MoreVertical className="h-4 w-4 text-white" />
//                 </Button>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent align="end" className="w-48">
//                 <DropdownMenuItem onClick={() => setIsUpdateModalOpen(true)}>
//                   <Edit3 className="h-4 w-4 mr-2 text-primary/90" />
//                   Update Folder
//                 </DropdownMenuItem>
//                 <DropdownMenuSeparator />
//                 <DropdownMenuItem
//                   onClick={() => setIsDeleteModalOpen(true)}
//                   className="focus:bg-red-800 text-red-400 hover:text-red-100 focus:text-red-400"
//                 >
//                   <Trash2 className="h-4 w-4 mr-2" />
//                   Delete Folder
//                 </DropdownMenuItem>
//               </DropdownMenuContent>
//             </DropdownMenu>
//           </div>
//         )}
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
//                 <label
//                   htmlFor="update-color"
//                   className="text-sm font-medium flex items-center gap-2"
//                 >
//                   <Palette className="h-4 w-4" />
//                   Folder Color
//                 </label>
//                 <div className="flex items-center space-x-3">
//                   <div
//                     className="w-8 h-8 rounded-full border-2 border-gray-300 flex-shrink-0"
//                     style={{ backgroundColor: updateColor }}
//                   />
//                   <Input
//                     id="update-color"
//                     type="text"
//                     value={updateColor}
//                     onChange={(e) => setUpdateColor(e.target.value)}
//                     placeholder="#6366f1"
//                     className="font-mono"
//                     pattern="^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"
//                   />
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
//               className="p-4  border-2 "
//               style={{
//                 background: `linear-gradient(135deg, ${folder.color}50, ${folder.color}80)`,
//                 borderColor: `${folder.color}80`,
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
