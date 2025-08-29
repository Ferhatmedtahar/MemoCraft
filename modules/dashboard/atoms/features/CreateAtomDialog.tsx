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
