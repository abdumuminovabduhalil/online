import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import AdminLayout from "../layout/AdminLayout";
import SellerLayout from "../layout/SellerLayout";
import Home from "../pages/Home";
import About from "../pages/About";
import Contact from "../pages/Contact";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Buys from "../pages/Buys";
import Likes from "../pages/Likes";
import NotFound from "../pages/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "about", element: <About /> },
      { path: "contact", element: <Contact /> },
      { path: "buys", element: <Buys /> },
      { path: "likes", element: <Likes /> },
    ],
  },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/admin", element: <AdminLayout /> },
  { path: "/seller", element: <SellerLayout /> },
  { path: "*", element: <NotFound /> },
]);
