import { createCookie } from "react-router";

export const themeCookie = createCookie("theme", {
  //default values to the cookies
  path: "/",
  sameSite: "lax",
  httpOnly: false,
  maxAge: 60 * 60 * 24 * 365,
});
