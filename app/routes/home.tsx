import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";
// import type { LoaderFunctionArgs } from "react-router";
// import { getSession } from "~/utils/sessions.server";
// import { redirect } from "react-router";

//if user is not logged in it redirect to login page
// export async function loader({ request }: LoaderFunctionArgs) {
//   const session = await getSession(request.headers.get("Cookie"));

//   if (!session.has("userId")) {
//     return redirect("/login");
//   }

//   return null;
// }

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return <Welcome />;
}
