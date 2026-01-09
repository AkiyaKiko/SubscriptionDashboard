"use client";
import type { APIType } from "@/types/ServerLinksType";
import { getAllSubs } from "@/app/actions/dboptAction";
import { Spinner } from "@/components/ui/spinner";
import AddNewDialog from "@/components/addNewDialog";
import EditDialog from "@/components/editDialog";
import RouteEdit from "@/components/routeEdit";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Checkbox } from "@/components/ui/checkbox";
import { useEffect, useState } from "react";

export default function Home() {
  const [subList, setSubList] = useState<APIType>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchSubs = async () => {
    setLoading(true);
    try {
      const res = await getAllSubs();
      if (res.ok) setSubList(res.msg as APIType);
      else console.error("Failed to fetch data");
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubs();
  }, []);

  return (
    <div className="flex flex-col min-h-screen  m-4 gap-4">
      <div id="tools" className="w-full">
        <AddNewDialog onUpdate={fetchSubs} />
      </div>
      {loading ? (
        <div className="bg-gray-200 w-full h-24 flex justify-center items-center">
          <Spinner className="size-8 m-auto" />
        </div>
      ) : (
        <div id="tables" className="w-full">
          <Table className="table-fixed border-3">
            <TableHeader className=" border-2">
              <TableRow className=" bg-gray-200 dark:bg-gray-700">
                <TableHead className="w-10">id</TableHead>
                <TableHead className="w-50">Name</TableHead>
                <TableHead>Link</TableHead>
                <TableHead className="text-right">Enabled</TableHead>
                <TableHead className="text-center w-25">Edit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className=" border-2">
              {subList.map((item, idx) => {
                return (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{idx + 1}</TableCell>
                    <TableCell className="font-medium truncate">
                      {item.name}
                    </TableCell>
                    <TableCell className="truncate">{item.link}</TableCell>
                    <TableCell className="text-right">
                      <Checkbox
                        className="m-2 border-2"
                        disabled={true}
                        defaultChecked={item.enable}
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      <EditDialog specs={item} onUpdate={fetchSubs} />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
      <div id="suburi" className=" mt-4">
        <RouteEdit />
      </div>
    </div>
  );
}
