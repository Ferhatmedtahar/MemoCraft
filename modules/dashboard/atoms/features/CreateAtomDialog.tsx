"use client";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
      <Dialog.Trigger asChild>
        <Button variant="default">
          <Plus className="h-4 w-4 mr-2" />
          New Atom
        </Button>
      </Dialog.Trigger>
      <Dialog.Content className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <Dialog.Header>
            <Dialog.Title>Create Atom</Dialog.Title>
            <Dialog.Description>
              Add a new atom to your knowledge base
            </Dialog.Description>
          </Dialog.Header>

          <Dialog.Body>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="content">Atom Title</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Enter atom Content..."
                  required
                />
              </div>
            </div>
          </Dialog.Body>

          <Dialog.Footer>
            <Dialog.Close asChild>
              <Button type="button" variant="outline" disabled={isLoading}>
                Cancel
              </Button>
            </Dialog.Close>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Atom"}
            </Button>
          </Dialog.Footer>
        </form>
      </Dialog.Content>
    </Dialog>
  );
}

export default CreateAtomDialog;
// "use client";
// import { Button } from "@/components/ui/button";
// import { Dialog } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Plus } from "lucide-react";
// import { useState } from "react";
// import { createAtom } from "../data/CreateAtom";

// function CreateAtomDialog() {
//   const [open, setOpen] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);

//   async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
//     event.preventDefault();
//     setIsLoading(true);

//     const formData: FormData = new FormData(event.currentTarget);
//     const title = formData.get("title") as string;

//     if (!title.trim()) {
//       setIsLoading(false);
//       return;
//     }

//     try {
//       await createAtom({ title });
//       setOpen(false); // Close dialog on success
//       // Reset form
//       (event.target as HTMLFormElement).reset();
//     } catch (error) {
//       console.error("Failed to create atom:", error);
//       // You might want to show a toast notification here
//     } finally {
//       setIsLoading(false);
//     }
//   }

//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
//       <Dialog.Trigger asChild>
//         <Button variant="default">
//           <Plus className="h-4 w-4 mr-2" />
//           New Atom
//         </Button>
//       </Dialog.Trigger>
//       <Dialog.Content className="sm:max-w-[425px]">
//         <form onSubmit={handleSubmit}>
//           <Dialog.Header>
//             <Dialog.Header className="text-white">Create Atom</Dialog.Header>
//             <Dialog.Description className="text-white">
//               Add a new atom to your knowledge base
//             </Dialog.Description>
//           </Dialog.Header>
//           <div className="grid gap-4">
//             <div className="grid gap-3 text-white">
//               <label htmlFor="title">Atom</label>
//               <Input
//                 id="title"
//                 name="title"
//                 placeholder="Enter atom title..."
//                 required
//               />
//             </div>
//           </div>
//           <Dialog.Footer className="text-white">
//             {/* <Dialog. asChild>
//               <Button type="button" variant="outline" disabled={isLoading}>
//                 Cancel
//               </Button>
//             </Dialog.> */}
//             <Button type="submit" disabled={isLoading}>
//               {isLoading ? "Creating..." : "Create Atom"}
//             </Button>
//           </Dialog.Footer>
//         </form>
//       </Dialog.Content>
//     </Dialog>
//   );
// }

// export default CreateAtomDialog;
// // "use client";
// // import { Button } from "@/components/ui/button";
// // import {
// //   Dialog,
// //   DialogClose,
// //   DialogContent,
// //   DialogDescription,
// //   DialogFooter,
// //   DialogHeader,
// //   DialogTitle,
// //   DialogTrigger,
// // } from "@/components/ui/dialog";
// // import { Input } from "@/components/ui/input";
// // import { Plus } from "lucide-react";
// // import { createAtom } from "../data/CreateAtom";
// // function CreateAtomDialog() {
// //   async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
// //     event.preventDefault();
// //     const formData: FormData = new FormData(event.currentTarget);

// //     await createAtom({
// //       title: formData.get("title") as string,
// //     });
// //   }
// //   return (
// //     <Dialog>
// //       <form className="text-white" onSubmit={handleSubmit}>
// //         <DialogTrigger asChild>
// //           <Button type="submit" variant="default">
// //             {" "}
// //             <Plus className="h-4 w-4 mr-2" />
// //             New Atom
// //           </Button>
// //         </DialogTrigger>
// //         <DialogContent className="sm:max-w-[425px]">
// //           <DialogHeader>
// //             <DialogTitle className="text-white">Create Atom</DialogTitle>
// //             <DialogDescription className="text-white">
// //               Add a new atom to your knowledge base
// //             </DialogDescription>
// //           </DialogHeader>
// //           <div className="grid gap-4">
// //             <div className="grid gap-3 text-white">
// //               <label htmlFor="title">Atom</label>
// //               <Input id="title" name="title" />
// //             </div>
// //           </div>
// //           <DialogFooter className="text-white">
// //             <DialogClose asChild>
// //               <Button variant="outline">Cancel</Button>
// //             </DialogClose>
// //             <Button type="submit">Create Atom</Button>
// //           </DialogFooter>
// //         </DialogContent>
// //       </form>
// //     </Dialog>
// //   );
// // }

// // export default CreateAtomDialog;
