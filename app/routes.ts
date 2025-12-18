import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("blog", "routes/blog/index.tsx"),
  route("blog/:id", "routes/blog/$slug.tsx"),
  route("login", "routes/login.tsx"),
  route("logout", "routes/logout.tsx"),
] satisfies RouteConfig;
