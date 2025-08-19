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
import { createAtom } from "../data/CreateAtom";
function CreateAtomDialog() {
  return (
    <Dialog>
      <form className="text-white" action={createAtom}>
        <DialogTrigger asChild>
          <Button variant="default">
            {" "}
            <Plus className="h-4 w-4 mr-2" />
            New Atom
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-white">Create Atom</DialogTitle>
            <DialogDescription className="text-white">
              Add a new atom to your knowledge base
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3 text-white">
              <label htmlFor="title">Atom</label>
              <Input id="title" name="title" />
            </div>
          </div>
          <DialogFooter className="text-white">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Create Atom</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}

export default CreateAtomDialog;
