import { createRoot } from "react-dom/client";
import "./index.css";
import "swiper/css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./Pages/Home.jsx";
import Layout from "./Layout.jsx";
import Login from "./Pages/Login.jsx";
import SignUp from "./Pages/SignUp.jsx";
import Profile from "./Pages/Profile.jsx";
import Notes from "./Pages/Notes.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "Login",
        element: <Login />,
      },
      {
        path: "SignUp",
        element: <SignUp />,
      },
      {
        path: "Notes",
        element: <Notes />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "*",
        element: <h1>NOT FOUND</h1>,
      },
    ],
  },
]);
createRoot(document.getElementById("root")).render(
  <RouterProvider router={router}></RouterProvider>
);
