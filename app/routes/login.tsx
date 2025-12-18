import { useState } from "react";
import {
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
  useLoaderData,
  useSubmit,
} from "react-router";
import { commitSession, getSession } from "~/utils/sessions.server";
import { Eye, EyeOff } from "lucide-react";
import * as Yup from "yup";
import { Formik } from "formik";
import type { Route } from "./+types/home";

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

const loginSchema = Yup.object().shape({
  username: Yup.string().required("Username is required"),
  password: Yup.string().required("Password is required"),
});

export async function action({ request }: ActionFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));

  const form = await request.formData();
  const username = form.get("username");
  const password = form.get("password");

  try {
    await loginSchema.validate({ username, password });
  } catch (error) {
    if (error instanceof Yup.ValidationError) {
      return { error: error.message };
    }
    throw error;
  }

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
  const submit = useSubmit();
  const [passwordVisisble, setPasswordVisible] = useState<boolean>(false);
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisisble);
  };
  return (
    <main className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-gray-200 bg-bg text-text p-6 shadow-sm ">
          <header className="mb-6 text-center">
            <h1 className="text-2xl font-semibold ">Welcome back</h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Sign in to continue
            </p>
          </header>

          <Formik
            initialValues={{ username: "", password: "" }}
            validationSchema={loginSchema}
            onSubmit={(values, { setSubmitting }) => {
              const fd = new FormData();
              fd.append("username", values.username);
              fd.append("password", values.password);
              submit(fd, { method: "post" });
              setSubmitting(false);
            }}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              isSubmitting,
            }) => (
              <form noValidate onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium "
                  >
                    Username
                  </label>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    autoComplete="username"
                    value={values.username}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    aria-invalid={touched.username && !!errors.username}
                    aria-describedby={
                      touched.username && errors.username
                        ? "username-error"
                        : undefined
                    }
                    className={`w-full rounded-md  px-3 py-2  focus:outline-none focus:ring-0 ${
                      touched.username && errors.username
                        ? "border-red-500 dark:border-red-500 border"
                        : "border border-gray-300 dark:border-gray-700"
                    }`}
                    placeholder="Enter your username"
                  />
                  {touched.username && errors.username && (
                    <p
                      id="username-error"
                      className="text-xs text-red-600 mt-1"
                    >
                      {errors.username}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium "
                  >
                    Password
                  </label>
                  <div
                    className={`flex items-center justify-between gap-2 rounded-md  px-3 py-2  focus:outline-none focus:ring-0  ${
                      touched.password && errors.password
                        ? "border-red-500 dark:border-red-500 border"
                        : "border border-gray-300 dark:border-gray-700"
                    }`}
                  >
                    <input
                      id="password"
                      name="password"
                      type={passwordVisisble ? "text" : "password"}
                      autoComplete="current-password"
                      value={values.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      aria-invalid={touched.password && !!errors.password}
                      aria-describedby={
                        touched.password && errors.password
                          ? "password-error"
                          : undefined
                      }
                      placeholder="••••••••"
                      className="flex-1 bg-transparent focus:outline-none focus:ring-0"
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="text-gray-500"
                    >
                      {!passwordVisisble ? <EyeOff /> : <Eye />}
                    </button>
                  </div>
                  {touched.password && errors.password && (
                    <p
                      id="password-error"
                      className="text-xs text-red-600 mt-1"
                    >
                      {errors.password}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-2 w-full rounded-md bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition
                   hover:bg-blue-700 focus:outline-none focus:ring-0 disabled:opacity-70 dark:bg-blue-500 dark:hover:bg-blue-600"
                >
                  Sign in
                </button>
              </form>
            )}
          </Formik>
        </div>

        <p className="mt-4 text-center text-xs text-gray-500 dark:text-gray-400">
          By continuing, you agree to our Terms and Privacy Policy.
        </p>
      </div>
    </main>
  );
}

export function meta({}: Route.MetaArgs) {
  return [{ title: "Login" }, { name: "description", content: "Login page" }];
}
