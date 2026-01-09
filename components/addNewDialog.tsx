"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
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

import { Spinner } from "@/components/ui/spinner";
import { createSubWrap } from "@/app/actions/dboptAction";

function SubmitButton({ pending }: { pending: boolean }) {
  return (
    <Button type="submit" disabled={pending}>
      {pending && (<Spinner />)}
      {pending ? "Submitting..." : "Submit"}
    </Button>
  );
}

export default function AddNewDialog({ onUpdate }: { onUpdate?: () => void }) {
  const [pending, setPending] = useState(false);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    setPending(true);
    setError("");

    try {
      const result = await createSubWrap(formData);
      if (result.ok) {
        setOpen(false);
        onUpdate?.();
      } else {
        setError(result.msg);
      }
    } catch (err) {
      setError("Network request failed, please try again later");
      console.error(err);
    } finally {
      setPending(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add Subs</DialogTitle>
            <DialogDescription>Input Server Name and Link.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-3">
              <Label htmlFor="name-1">Name</Label>
              <Input
                id="name-1"
                name="name"
                placeholder="US | JP | HK"
                required
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="link-1">Link</Label>
              <Input
                id="link-1"
                name="link"
                placeholder="ss://xxx | vless://xxx"
                required
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="enable-1" name="enable" defaultChecked={true} />
              <Label htmlFor="enable-1">Enable</Label>
            </div>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <SubmitButton pending={pending} />
          </DialogFooter>
          {error && (
            <p className="text-red-500 text-sm mt-2 text-center">{error}</p>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}
