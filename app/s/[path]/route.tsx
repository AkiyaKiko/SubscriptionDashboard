import { getSubBase64, getSubUri } from "@/app/actions/dboptAction";

export async function GET(
  request: Request,
  { params }: RouteContext<"/s/[path]">
) {
  const { path } = await params;
  const pathRes = await getSubUri();

  if (!pathRes.ok || !pathRes.msg) {
    return new Response("Error retrieving path", { status: 500 });
  }

  const truePath = pathRes.msg.uri;

  if (path !== truePath) {
    return new Response("Not Found", { status: 404 });
  }

  const b64Links = await getSubBase64();

  if (!b64Links.ok || !b64Links.msg) {
    return new Response("Error retrieving links", { status: 500 });
  }

  return new Response(b64Links.msg, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
