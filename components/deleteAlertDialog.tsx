import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { ServerLinkType } from "@/types/ServerLinksType";
import { deleteSubWrap } from "@/app/actions/dboptAction";
import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";

export default function DeleteAlertDialog({
  specs,
  onDelete,
}: {
  specs: ServerLinkType;
  onDelete?: () => void;
}) {
  const [isPending, setIsPending] = useState(false);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");

  async function handDelete() {
    setIsPending(true);
    try {
      const result = await deleteSubWrap(specs.id);
      if (result.ok) {
        setOpen(false);
        onDelete?.();
      } else {
        console.error(result.msg);
        setError(result.msg);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsPending(false);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="mr-auto">
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this
            subscription!
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handDelete}>
            {isPending && <Spinner />}Continue
          </AlertDialogAction>
        </AlertDialogFooter>
        {error && (
          <p className="text-red-500 text-sm mt-2 text-center">{error}</p>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
}
