import {
  deleteAtom,
  toggleFavorite,
  togglePin,
  updateAtom,
} from "../data/AtomActions";
import { fetchAtoms } from "../data/fetchData";
import AtomCard from "./components/AtomCard";

async function AtomsList() {
  const data = await fetchAtoms();

  if (!data || data.length === 0) {
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

  // Sort atoms: pinned first, then favorites, then the rest
  const sortedAtoms = [...data].sort((a, b) => {
    // Pinned items first
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;

    // Among non-pinned items, favorites first
    if (!a.pinned && !b.pinned) {
      if (a.favorite && !b.favorite) return -1;
      if (!a.favorite && b.favorite) return 1;
    }

    // If both have same pin/favorite status, maintain original order
    return 0;
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
      {sortedAtoms.map((atom) => (
        <AtomCard
          key={atom.id}
          atom={atom}
          onDelete={async (id: string) => {
            "use server";
            await deleteAtom(id);
          }}
          onUpdate={async (id: string, title: string) => {
            "use server";
            await updateAtom(id, title);
          }}
          onPin={async (id: string) => {
            "use server";
            await togglePin(id);
          }}
          onFavorite={async (id: string) => {
            "use server";
            await toggleFavorite(id);
          }}
        />
      ))}
    </div>
  );
}

export default AtomsList;
// import {
//   deleteAtom,
//   toggleFavorite,
//   togglePin,
//   updateAtom,
// } from "../data/AtomActions";
// import { fetchAtoms } from "../data/fetchData";
// import AtomCard from "./components/AtomCard";

// async function AtomsList() {
//   const data = await fetchAtoms();

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

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
//       {data.map((atom) => (
//         <AtomCard
//           key={atom.id}
//           atom={atom}
//           onDelete={async (id: string) => {
//             "use server";
//             await deleteAtom(id);
//           }}
//           onUpdate={async (id: string, title: string) => {
//             "use server";
//             await updateAtom(id, title);
//           }}
//           onPin={async (id: string) => {
//             "use server";
//             await togglePin(id);
//           }}
//           onFavorite={async (id: string) => {
//             "use server";
//             await toggleFavorite(id);
//           }}
//         />
//       ))}
//     </div>
//   );
// }

// export default AtomsList;
