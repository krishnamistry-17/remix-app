import { useState } from "react";
import {
  Form,
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
  useLoaderData,
} from "react-router";
import { commitSession, getSession } from "~/utils/sessions.server";
import { Eye, EyeOff } from "lucide-react";

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
  const [passwordVisisble, setPasswordVisible] = useState<boolean>(false);
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisisble);
  };
  return (
    <main className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <header className="mb-6 text-center">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              Welcome back
            </h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Sign in to continue
            </p>
          </header>

          {error && (
            <div className="mb-4 rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/30 dark:text-red-300">
              {error}
            </div>
          )}

          <Form method="post" className="space-y-4">
            <div className="space-y-1.5">
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-800 dark:text-gray-200"
              >
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2
                 text-gray-900 placeholder:text-gray-400
                 focus:outline-none focus:ring-0  dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                placeholder="Enter your username"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-800 dark:text-gray-200"
              >
                Password
              </label>
              <div
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2
                 text-gray-900 placeholder:text-gray-400
                 focus:outline-none focus:ring-0 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
              >
                <input
                  id="password"
                  name="password"
                  type={passwordVisisble ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  placeholder="••••••••"
                  className=" focus:outline-none focus:ring-0"
                />
                <button type="button" onClick={togglePasswordVisibility}>
                  {!passwordVisisble ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="mt-2 w-full rounded-md bg-blue-600 px-4 py-2.5 text-sm
               font-medium text-white transition hover:bg-blue-700 focus:outline-none focus:ring-0 dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              Sign in
            </button>
          </Form>
        </div>

        <p className="mt-4 text-center text-xs text-gray-500 dark:text-gray-400">
          By continuing, you agree to our Terms and Privacy Policy.
        </p>
      </div>
    </main>
  );
}
