"use server";
import { prisma } from "@/lib/prisma";
import type { ServerLinkType, APIType } from "@/types/ServerLinksType";
import type { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import type { ActionResultType } from "@/types/ServerLinksType";
import type { SubType } from "@/types/SubType";

export type NewSubWithoutID = Omit<ServerLinkType, "id">;
export type NewSubWithID = ServerLinkType;

function returnError<T>(msg: T): ActionResultType<T> {
  return { ok: false, msg: msg };
}

function returnSuccess<T>(msg: T): ActionResultType<T> {
  return { ok: true, msg: msg };
}

export async function getAllSubs(): Promise<ActionResultType<APIType | null>> {
  try {
    const Subs = await prisma.link.findMany();
    return { ok: true, msg: Subs };
  } catch (e) {
    return { ok: false, msg: e };
  }
}

export async function createSub(
  newSub: NewSubWithoutID
): Promise<ActionResultType<null | ServerLinkType>> {
  try {
    const newSubToCreate = await prisma.link.create({
      data: newSub,
    });
    return { ok: true, msg: newSubToCreate };
  } catch (e) {
    return { ok: false, msg: e };
  }
}

export async function createSubWrap(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const link = String(formData.get("link") ?? "").trim();

  if (!name) return { ok: false, msg: "Name Cannot be null" };
  if (!link) return { ok: false, msg: "Link Cannot be null" };
  const enable = formData.get("enable") != null;

  const res = await createSub({ name, link, enable });
  if (!res.ok) {
    return { ok: false, msg: "Create Failed!" };
  } else {
    return { ok: true, msg: "Create Success!" };
  }
}

export async function deleteSub(
  id: NewSubWithID["id"]
): Promise<
  ActionResultType<PrismaClientKnownRequestError | unknown | APIType>
> {
  try {
    const deletedSub = await prisma.link.delete({
      where: {
        id: id,
      },
    });
    return returnSuccess(deletedSub);
  } catch (e) {
    return returnError(e);
  }
}

export async function deleteSubWrap(id: number) {
  if (!id) return { ok: false, msg: "ID Cannot be null" };
  const res = await deleteSub(id);
  if (!res.ok) {
    return { ok: false, msg: "Delete Failed!" };
  } else {
    return { ok: true, msg: "Delete Success!" };
  }
}

export async function updateSub(
  newSub: NewSubWithID
): Promise<
  ActionResultType<PrismaClientKnownRequestError | unknown | APIType>
> {
  try {
    const updatedSub = await prisma.link.update({
      where: {
        id: newSub.id,
      },
      data: newSub,
    });
    return returnSuccess(updatedSub);
  } catch (e) {
    return returnError(e);
  }
}

export async function updateSubWrap(formData: FormData) {
  const id = Number(formData.get("id") ?? 0);
  const name = String(formData.get("name") ?? "").trim();
  const link = String(formData.get("link") ?? "").trim();

  if (!id) return { ok: false, msg: "ID Cannot be null" };
  if (!name) return { ok: false, msg: "Name Cannot be null" };
  if (!link) return { ok: false, msg: "Link Cannot be null" };

  const enable = formData.get("enable") != null;
  const res = await updateSub({ id, name, link, enable });

  if (!res.ok) {
    return { ok: false, msg: "Update Failed!" };
  } else {
    return { ok: true, msg: "Update Success!" };
  }
}

export async function getSubUri(): Promise<ActionResultType<SubType | null>> {
  try {
    const sub = await prisma.subscription.findUnique({
      where: { id: 1 },
    });
    return { ok: true, msg: sub };
  } catch (e) {
    return { ok: false, msg: e };
  }
}

export async function updateSubUri(
  uri: string
): Promise<ActionResultType<string | null>> {
  try {
    console.log("Updating URI to:", uri);
    await prisma.subscription.upsert({
      where: { id: 1 },
      update: { uri: uri },
      create: { id: 1, uri: uri },
    });
    return { ok: true, msg: "success" };
  } catch (e) {
    return { ok: false, msg: e };
  }
}

export async function getSubBase64(): Promise<ActionResultType<string | null>> {
  const subs = await getAllSubs();
  if (subs.ok) {
    const res = subs.msg;
    let init = "";
    if (res) {
      res.forEach((curr) => {
        if(curr.enable){
        init += "\n" + curr.link;
        }
      });
      const base64 = Buffer.from(init, 'utf8').toString('base64');
      return {ok:true, msg: base64}
    }else{
      return {ok:true, msg: init}
    }
  }else{
    return {ok:false, msg: subs.msg}
  }
}


