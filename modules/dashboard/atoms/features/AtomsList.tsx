"use client";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
} from "@dnd-kit/core";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  deleteAtom,
  toggleFavorite,
  togglePin,
  updateAtom,
  updateAtomFolder,
} from "../data/AtomActions";
import { Folder } from "../types/folder.type";
import AtomCard from "./components/AtomCard";
import FolderComponent from "./components/FolderComponent";

interface Atom {
  id: string;
  title: string;
  pinned?: boolean;
  favorite?: boolean;
  folder_id?: string | null;
}

interface AtomsListClientProps {
  initialAtoms: Atom[];
  initialFolders: Folder[];
}

function AtomsListClient({
  initialAtoms,
  initialFolders,
}: AtomsListClientProps) {
  const router = useRouter();
  const [activeAtom, setActiveAtom] = useState<Atom | null>(null);

  // Handle drag start
  function handleDragStart(event: DragStartEvent) {
    const atom = initialAtoms.find((atom) => atom.id === event.active.id);
    setActiveAtom(atom || null);
  }

  // Handle drag end
  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveAtom(null);

    if (!over) return;

    const atomId = active.id as string;
    const targetId = over.id as string;

    // Check if dropping on a folder
    const isFolder = initialFolders.some((folder) => folder.id === targetId);

    if (isFolder) {
      try {
        await updateAtomFolder(atomId, targetId);
        router.refresh(); // Refresh to show updated data
      } catch (error) {
        console.error("Failed to update atom folder:", error);
      }
    }
  }

  if (!initialAtoms || initialAtoms.length === 0) {
    return (
      <div className="text-white flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-lg mb-2">No atoms found</p>
          <p className="text-gray-400 text-sm">
            Create your first atom to get started
          </p>
        </div>
      </div>
    );
  }

  // Separate atoms by folder
  const atomsByFolder = initialAtoms.reduce((acc, atom) => {
    const folderId = atom.folder_id || "unassigned";
    if (!acc[folderId]) {
      acc[folderId] = [];
    }
    acc[folderId].push(atom);
    return acc;
  }, {} as Record<string, Atom[]>);

  // Sort atoms within each folder: pinned first, then favorites, then the rest
  Object.keys(atomsByFolder).forEach((folderId) => {
    atomsByFolder[folderId].sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      if (!a.pinned && !b.pinned) {
        if (a.favorite && !b.favorite) return -1;
        if (!a.favorite && b.favorite) return 1;
      }
      return 0;
    });
  });

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="p-4 space-y-6">
        {/* Folders with their atoms */}
        {initialFolders.map((folder) => (
          <div key={folder.id} className="space-y-4">
            <FolderComponent
              folder={folder}
              atomCount={atomsByFolder[folder.id]?.length || 0}
            />

            {/* Atoms in this folder */}
            {atomsByFolder[folder.id] &&
              atomsByFolder[folder.id].length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 ml-8">
                  {atomsByFolder[folder.id].map((atom) => (
                    <AtomCard
                      key={atom.id}
                      atom={atom}
                      onDelete={async (id: string) => {
                        await deleteAtom(id);
                        router.refresh();
                      }}
                      onUpdate={async (id: string, title: string) => {
                        await updateAtom(id, title);
                        router.refresh();
                      }}
                      onPin={async (id: string) => {
                        await togglePin(id);
                        router.refresh();
                      }}
                      onFavorite={async (id: string) => {
                        await toggleFavorite(id);
                        router.refresh();
                      }}
                    />
                  ))}
                </div>
              )}
          </div>
        ))}

        {/* Unassigned atoms */}
        {atomsByFolder["unassigned"] &&
          atomsByFolder["unassigned"].length > 0 && (
            <div className="space-y-4">
              <div className="bg-gray-700 rounded-lg p-4">
                <h2 className="text-lg font-semibold text-white">
                  Unassigned Atoms ({atomsByFolder["unassigned"].length})
                </h2>
                <p className="text-gray-400 text-sm">
                  Drag these atoms to folders to organize them
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 ml-8">
                {atomsByFolder["unassigned"].map((atom) => (
                  <AtomCard
                    key={atom.id}
                    atom={atom}
                    onDelete={async (id: string) => {
                      await deleteAtom(id);
                      router.refresh();
                    }}
                    onUpdate={async (id: string, title: string) => {
                      await updateAtom(id, title);
                      router.refresh();
                    }}
                    onPin={async (id: string) => {
                      await togglePin(id);
                      router.refresh();
                    }}
                    onFavorite={async (id: string) => {
                      await toggleFavorite(id);
                      router.refresh();
                    }}
                  />
                ))}
              </div>
            </div>
          )}
      </div>

      {/* Drag overlay */}
      <DragOverlay>
        {activeAtom ? (
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 shadow-lg opacity-90">
            <p className="text-white text-sm">{activeAtom.title}</p>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

export default AtomsListClient;
// "use client";
// import {
//   DndContext,
//   DragEndEvent,
//   DragOverlay,
//   DragStartEvent,
// } from "@dnd-kit/core";
// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import {
//   deleteAtom,
//   toggleFavorite,
//   togglePin,
//   updateAtom,
//   updateAtomFolder,
// } from "../data/AtomActions";
// import { fetchAtoms, fetchFolders } from "../data/fetchData";
// import { Folder } from "../types/folder.type";
// import AtomCard from "./components/AtomCard";
// import FolderComponent from "./components/FolderComponent";

// interface Atom {
//   id: string;
//   title: string;
//   pinned?: boolean;
//   favorite?: boolean;
//   folder_id?: string | null;
// }

// async function AtomsList() {
//   const router = useRouter();
//   const [activeAtom, setActiveAtom] = useState<Atom | null>(null);

//   const data = await fetchAtoms();
//   const foldersData = await fetchFolders();

//   // Handle drag start
//   function handleDragStart(event: DragStartEvent) {
//     const atom = data?.find((atom) => atom.id === event.active.id);
//     setActiveAtom(atom || null);
//   }

//   // Handle drag end
//   async function handleDragEnd(event: DragEndEvent) {
//     const { active, over } = event;
//     setActiveAtom(null);

//     if (!over || !data) return;

//     const atomId = active.id as string;
//     const targetId = over.id as string;

//     // Check if dropping on a folder
//     const isFolder = foldersData?.some((folder) => folder.id === targetId);

//     if (isFolder) {
//       try {
//         await updateAtomFolder(atomId, targetId);
//         router.refresh(); // Refresh to show updated data
//       } catch (error) {
//         console.error("Failed to update atom folder:", error);
//       }
//     }
//   }

//   if (!data || data.length === 0) {
//     return (
//       <div className="text-white flex items-center justify-center h-full">
//         <div className="text-center">
//           <p className="text-lg mb-2">No atoms found</p>
//           <p className="text-gray-400 text-sm">
//             Create your first atom to get started
//           </p>
//         </div>
//       </div>
//     );
//   }

//   // Separate atoms by folder
//   const atomsByFolder = data.reduce((acc, atom) => {
//     const folderId = atom.folder_id || "unassigned";
//     if (!acc[folderId]) {
//       acc[folderId] = [];
//     }
//     acc[folderId].push(atom);
//     return acc;
//   }, {} as Record<string, Atom[]>);

//   // Sort atoms within each folder: pinned first, then favorites, then the rest
//   Object.keys(atomsByFolder).forEach((folderId) => {
//     atomsByFolder[folderId].sort((a, b) => {
//       if (a.pinned && !b.pinned) return -1;
//       if (!a.pinned && b.pinned) return 1;
//       if (!a.pinned && !b.pinned) {
//         if (a.favorite && !b.favorite) return -1;
//         if (!a.favorite && b.favorite) return 1;
//       }
//       return 0;
//     });
//   });

//   return (
//     <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
//       <div className="p-4 space-y-6">
//         {/* Folders with their atoms */}
//         {foldersData?.map((folder) => (
//           <div key={folder.id} className="space-y-4">
//             <FolderComponent
//               folder={folder}
//               atomCount={atomsByFolder[folder.id]?.length || 0}
//             />

//             {/* Atoms in this folder */}
//             {atomsByFolder[folder.id] &&
//               atomsByFolder[folder.id].length > 0 && (
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 ml-8">
//                   {atomsByFolder[folder.id].map((atom) => (
//                     <AtomCard
//                       key={atom.id}
//                       atom={atom}
//                       onDelete={async (id: string) => {
//                         await deleteAtom(id);
//                         router.refresh();
//                       }}
//                       onUpdate={async (id: string, title: string) => {
//                         await updateAtom(id, title);
//                         router.refresh();
//                       }}
//                       onPin={async (id: string) => {
//                         await togglePin(id);
//                         router.refresh();
//                       }}
//                       onFavorite={async (id: string) => {
//                         await toggleFavorite(id);
//                         router.refresh();
//                       }}
//                     />
//                   ))}
//                 </div>
//               )}
//           </div>
//         ))}

//         {/* Unassigned atoms */}
//         {atomsByFolder["unassigned"] &&
//           atomsByFolder["unassigned"].length > 0 && (
//             <div className="space-y-4">
//               <div className="bg-gray-700 rounded-lg p-4">
//                 <h2 className="text-lg font-semibold text-white">
//                   Unassigned Atoms ({atomsByFolder["unassigned"].length})
//                 </h2>
//                 <p className="text-gray-400 text-sm">
//                   Drag these atoms to folders to organize them
//                 </p>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 ml-8">
//                 {atomsByFolder["unassigned"].map((atom) => (
//                   <AtomCard
//                     key={atom.id}
//                     atom={atom}
//                     onDelete={async (id: string) => {
//                       await deleteAtom(id);
//                       router.refresh();
//                     }}
//                     onUpdate={async (id: string, title: string) => {
//                       await updateAtom(id, title);
//                       router.refresh();
//                     }}
//                     onPin={async (id: string) => {
//                       await togglePin(id);
//                       router.refresh();
//                     }}
//                     onFavorite={async (id: string) => {
//                       await toggleFavorite(id);
//                     }}
//                   />
//                 ))}
//               </div>
//             </div>
//           )}
//       </div>

//       {/* Drag overlay */}
//       <DragOverlay>
//         {activeAtom ? (
//           <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 shadow-lg opacity-90">
//             <p className="text-white text-sm">{activeAtom.title}</p>
//           </div>
//         ) : null}
//       </DragOverlay>
//     </DndContext>
//   );
// }

// export default AtomsList;
// // "use client";
// // import { DndContext, DragEndEvent } from "@dnd-kit/core";
// // import {
// //   deleteAtom,
// //   toggleFavorite,
// //   togglePin,
// //   updateAtom,
// //   updateAtomFolder,
// // } from "../data/AtomActions";
// // import { fetchAtoms, fetchFolders } from "../data/fetchData";
// // import { Folder } from "../types/folder.type";
// // import AtomCard from "./components/AtomCard";
// // import FolderComponent from "./components/FolderComponent";

// // const folders: Folder[] = [
// //   { id: "1", color: "#ff0000", title: "Folder 1" },
// //   { id: "2", color: "#00ff00", title: "Folder 2" },
// //   { id: "3", color: "#0000ff", title: "Folder 3" },
// // ];

// // async function AtomsList() {
// //   const data = await fetchAtoms();
// //   // !folders here
// //   const foldersdata = await fetchFolders();

// //   // function that handle the drag end
// //   async function handleDragEnd(event: DragEndEvent) {
// //     const { active, over } = event;

// //     if (!over) return;

// //     const atomId = active.id as string;
// //     const folderId = over.id as string;
// //     //!update the atom folder id
// //     await updateAtomFolder(atomId, folderId);
// //   }

// //   if (!data || data.length === 0) {
// //     return (
// //       <div className="text-white flex items-center justify-center h-full">
// //         <div className="text-center">
// //           <p className="text-lg mb-2">No atoms found</p>
// //           <p className="text-gray-400 text-sm">
// //             Create your first atom to get started
// //           </p>
// //         </div>
// //       </div>
// //     );
// //   }

// //   // Sort atoms: pinned first, then favorites, then the rest
// //   const sortedAtoms = [...data].sort((a, b) => {
// //     // Pinned items first
// //     if (a.pinned && !b.pinned) return -1;
// //     if (!a.pinned && b.pinned) return 1;

// //     // Among non-pinned items, favorites first
// //     if (!a.pinned && !b.pinned) {
// //       if (a.favorite && !b.favorite) return -1;
// //       if (!a.favorite && b.favorite) return 1;
// //     }

// //     // If both have same pin/favorite status, maintain original order
// //     return 0;
// //   });

// //   return (
// //     <DndContext onDragEnd={handleDragEnd}>
// //       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
// //         {folders.map((folder) => (
// //           <FolderComponent key={folder.id} folder={folder} />
// //         ))}

// //         {sortedAtoms.map((atom) => (
// //           <AtomCard
// //             key={atom.id}
// //             atom={atom}
// //             onDelete={async (id: string) => {
// //               await deleteAtom(id);
// //             }}
// //             onUpdate={async (id: string, title: string) => {
// //               await updateAtom(id, title);
// //             }}
// //             onPin={async (id: string) => {
// //               await togglePin(id);
// //             }}
// //             onFavorite={async (id: string) => {
// //               await toggleFavorite(id);
// //             }}
// //           />
// //         ))}
// //       </div>
// //     </DndContext>
// //   );
// // }

// // export default AtomsList;
// // // import {
// // //   deleteAtom,
// // //   toggleFavorite,
// // //   togglePin,
// // //   updateAtom,
// // // } from "../data/AtomActions";
// // // import { fetchAtoms } from "../data/fetchData";
// // // import AtomCard from "./components/AtomCard";

// // // async function AtomsList() {
// // //   const data = await fetchAtoms();

// // //   if (!data || data.length === 0) {
// // //     return (
// // //       <div className="text-white flex items-center justify-center h-full">
// // //         <div className="text-center">
// // //           <p className="text-lg mb-2">No atoms found</p>
// // //           <p className="text-gray-400 text-sm">
// // //             Create your first atom to get started
// // //           </p>
// // //         </div>
// // //       </div>
// // //     );
// // //   }

// // //   return (
// // //     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
// // //       {data.map((atom) => (
// // //         <AtomCard
// // //           key={atom.id}
// // //           atom={atom}
// // //           onDelete={async (id: string) => {
// // //             "use server";
// // //             await deleteAtom(id);
// // //           }}
// // //           onUpdate={async (id: string, title: string) => {
// // //             "use server";
// // //             await updateAtom(id, title);
// // //           }}
// // //           onPin={async (id: string) => {
// // //             "use server";
// // //             await togglePin(id);
// // //           }}
// // //           onFavorite={async (id: string) => {
// // //             "use server";
// // //             await toggleFavorite(id);
// // //           }}
// // //         />
// // //       ))}
// // //     </div>
// // //   );
// // // }

// // // export default AtomsList;
