import {
  Link,
  redirect,
  useFetcher,
  useRouteLoaderData,
  type ActionFunctionArgs,
} from "react-router";
import { destroySession, getSession } from "~/utils/sessions.server";

export async function action({ request }: ActionFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));

  return redirect("/", {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
}

export default function Logout() {
  const data = useRouteLoaderData<{ userId: string | null }>("root");
  const fetcher = useFetcher();
  const isLoggedIn = Boolean(data?.userId);
  console.log("isLoggedIn", isLoggedIn);
  return (
    <>
      {isLoggedIn ? (
        <fetcher.Form method="post" action="/logout">
          <button className="px-3 py-1 rounded-md bg-red-500 text-white">
            Logout
          </button>
        </fetcher.Form>
      ) : (
        <Link
          to="/login"
          className="px-3 py-1 rounded-md bg-green-500 text-white hover:bg-green-600"
        >
          Login
        </Link>
      )}
    </>
  );
}
