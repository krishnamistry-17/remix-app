import {
  Form,
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
  useLoaderData,
} from "react-router";
import { commitSession, getSession } from "~/utils/sessions.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));

  if (session.has("userId")) {
    return redirect("/");
  }

  const data = { error: session.get("error") ?? null };
  return new Response(JSON.stringify(data), {
    headers: {
      "Content-Type": "application/json",
      "Set-Cookie": await commitSession(session),
    },
  });
}

export async function getCredentials(username: string, password: string) {
  return {
    userId: "123",
  };
}

export async function action({ request }: ActionFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));

  const form = await request.formData();
  const username = form.get("username");
  const password = form.get("password");

  const userId = await getCredentials(username as string, password as string);

  if (userId === null) {
    session.flash("error", "Invalid username/password");

    return redirect("/login", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  }

  session.set("userId", userId);

  return redirect("/", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}

export default function Login() {
  const { error } = useLoaderData<typeof loader>() as unknown as {
    error: string | null;
  };
  return (
    <Form method="POST">
      {error && <p className="text-red-500">{error}</p>}
      <label htmlFor="username">Username</label>
      <input type="text" name="username" id="username" />
      <label htmlFor="password">Password</label>
      <input type="password" name="password" id="password" />
      <button type="submit">Login</button>
    </Form>
  );
}
