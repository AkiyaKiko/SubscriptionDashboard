"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useEffect, useState } from "react";
import { getSubUri, updateSubUri } from "@/app/actions/dboptAction";
import { SubType } from "@/types/SubType";
import { ActionResultType } from "@/types/ServerLinksType";

export default function RouteEdit() {
  const [sub, setSub] = useState<string>("");
  const [isChanged, setIsChanged] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const res: ActionResultType<SubType | null> = await getSubUri();

        if (!isMounted) return;

        if (res.ok) {
          // msg 可能为 null，所以要兜底
          setSub(res.msg?.uri ?? "");
        } else {
          console.error("Failed to fetch URI:", res.msg);
        }
      } catch (err) {
        console.error("getSubUri error:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.value === (sub as string)) {
      return;
    } else {
      console.log("Input: ", e.target.value);
      setSub(e.target.value);
      setIsChanged(true);
      setIsDirty(true);
    }
  }

  async function handleUpdate() {
    setIsPending(true);
    const res = await updateSubUri(String(sub));
    if (res.ok) {
      console.log("Update Success", res.msg);
      setIsPending(false);
      setIsChanged(false);
      setIsDirty(false);
    } else {
      console.error("Update Failed", res.msg);
      setIsPending(false);
    }
  }

  async function fetchRandomUri() {
    setIsPending(true);
    try {
      const len = 16;
      const chars =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      const array = new Uint32Array(len);
      crypto.getRandomValues(array);

      const res = Array.from(array, (x) => chars[x % chars.length]).join("");

      if (res) {
        console.log("Generated URI:", res);
        setSub(res);
        setIsChanged(true);
        setIsDirty(true);
      }
    } finally {
      setIsPending(false);
    }
  }

  return (
    <>
      <Button className="mb-4" onClick={handleUpdate} disabled={isPending}>
        {isPending && <Spinner />}
        {isPending ? "Updating..." : "Update"}
      </Button>
      <Button className="ml-4" onClick={fetchRandomUri} disabled={isPending}>
        {isPending && <Spinner />}
        {isPending ? "Generating..." : "Get Random URI"}
      </Button>
      <span className="text-sm text-gray-300 ml-4 my-2 block w-full break-all">
        Default Sub URI: /s/{sub || "Not Set"}
      </span>
      {loading ? (
        <div className="bg-gray-200 w-full h-24 flex justify-center items-center">
          <Spinner className="size-8 m-auto" />
        </div>
      ) : (
        <Input
          value={sub || ""}
          onChange={handleChange}
          className={
            isChanged && isDirty && String(sub).trim() === ""
              ? "border-red-500 focus-visible:ring-red-500"
              : ""
          }
        />
      )}
      {isDirty && String(sub).trim() === "" && (
        <span className=" text-red-500">Cannot be null! </span>
      )}
    </>
  );
}
