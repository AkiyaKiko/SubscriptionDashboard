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
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ServerLinkType } from "@/types/ServerLinksType";
import { useState } from "react";
import { updateSubWrap } from "@/app/actions/dboptAction";
import { Spinner } from "@/components/ui/spinner";
import DeleteAlertDialog from "@/components/deleteAlertDialog";

function UpdateButton({ pending }: { pending: boolean }) {
  return (
    <Button type="submit" disabled={pending}>
      {pending && <Spinner />}
      {pending ? "Updating..." : "Update"}
    </Button>
  );
}

export default function EditDialog({
  specs,
  onUpdate,
}: {
  specs: ServerLinkType;
  onUpdate?: () => void;
}) {
  const [isPending, setIsPending] = useState(false);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");

  function handleUpdate(e: React.FormEvent<HTMLFormElement>, id: number) {
    e.stopPropagation();
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.append("id", String(id));
    setIsPending(true);

    updateSubWrap(formData)
      .then((result) => {
        if (result.ok) {
          setOpen(false);
          onUpdate?.();
        } else {
          console.error(result.msg);
        }
      })
      .catch((err) => {
        setError("Network request failed, please try again later");
        console.error(err);
      })
      .finally(() => {
        setIsPending(false);
      });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Edit</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <form onSubmit={(e) => handleUpdate(e, specs.id)}>
          <DialogHeader>
            <DialogTitle>Edit Sub</DialogTitle>
            <DialogDescription>
              Make changes to your sub here. Click save when you&apos;re done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="name-1">Name</Label>
              <Input id="name-1" name="name" defaultValue={specs.name} />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="link-1">Link</Label>
              <Input id="link-1" name="link" defaultValue={specs.link} />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="enable-1"
                name="enable"
                defaultChecked={specs.enable}
              />
              <Label htmlFor="enable-1">Enable</Label>
            </div>
          </div>
          <DialogFooter className=" mt-4">
            <DeleteAlertDialog
              specs={specs}
              onDelete={() => {
                setOpen(false);
                onUpdate?.();
              }}
            />
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <UpdateButton pending={isPending} />
          </DialogFooter>
          {error && (
            <p className="text-red-500 text-sm mt-2 text-center">{error}</p>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}
