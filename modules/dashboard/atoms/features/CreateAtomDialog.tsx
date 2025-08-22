"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { useState } from "react";
import { createAtom } from "../data/CreateAtom";

function CreateAtomDialog() {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    const formData: FormData = new FormData(event.currentTarget);
    const title = formData.get("title") as string;

    if (!title.trim()) {
      setIsLoading(false);
      return;
    }

    try {
      await createAtom({ title });
      setOpen(false); // Close dialog on success
      // Reset form
      (event.target as HTMLFormElement).reset();
    } catch (error) {
      console.error("Failed to create atom:", error);
      // You might want to show a toast notification here
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">
          <Plus className="h-4 w-4 mr-2" />
          New Atom
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-white">Create Atom</DialogTitle>
            <DialogDescription className="text-white">
              Add a new atom to your knowledge base
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3 text-white">
              <label htmlFor="title">Atom</label>
              <Input
                id="title"
                name="title"
                placeholder="Enter atom title..."
                required
              />
            </div>
          </div>
          <DialogFooter className="text-white">
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={isLoading}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Atom"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default CreateAtomDialog;
// "use client";
// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogClose,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Plus } from "lucide-react";
// import { createAtom } from "../data/CreateAtom";
// function CreateAtomDialog() {
//   async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
//     event.preventDefault();
//     const formData: FormData = new FormData(event.currentTarget);

//     await createAtom({
//       title: formData.get("title") as string,
//     });
//   }
//   return (
//     <Dialog>
//       <form className="text-white" onSubmit={handleSubmit}>
//         <DialogTrigger asChild>
//           <Button type="submit" variant="default">
//             {" "}
//             <Plus className="h-4 w-4 mr-2" />
//             New Atom
//           </Button>
//         </DialogTrigger>
//         <DialogContent className="sm:max-w-[425px]">
//           <DialogHeader>
//             <DialogTitle className="text-white">Create Atom</DialogTitle>
//             <DialogDescription className="text-white">
//               Add a new atom to your knowledge base
//             </DialogDescription>
//           </DialogHeader>
//           <div className="grid gap-4">
//             <div className="grid gap-3 text-white">
//               <label htmlFor="title">Atom</label>
//               <Input id="title" name="title" />
//             </div>
//           </div>
//           <DialogFooter className="text-white">
//             <DialogClose asChild>
//               <Button variant="outline">Cancel</Button>
//             </DialogClose>
//             <Button type="submit">Create Atom</Button>
//           </DialogFooter>
//         </DialogContent>
//       </form>
//     </Dialog>
//   );
// }

// export default CreateAtomDialog;
