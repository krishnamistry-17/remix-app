import { Link } from "react-router";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4 px-4 py-10">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-lg">Page not found</p>
      <Link to="/" className="text-blue-500 hover:underline">
        Go to home
      </Link>
    </div>
  );
};
export default NotFound;
