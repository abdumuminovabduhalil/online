import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import AdminLayout from "../layout/AdminLayout";
import SellerLayout from "../layout/SellerLayout";
import NotFound from "../pages/NotFound";
import Home from "../pages/Home";
import About from "../pages/About";
import Buys from "../pages/Buys";
import Contact from "../pages/Contact";
import Likes from "../pages/Likes";
import Login from "../pages/Login";
import Register from "../pages/Register";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Home/>
      },
      {
        path: "about",
        element: <About/>
      },
      {
        path: "buys",
        element:<Buys/>
      },
      {
        path: "contact",
        element: <Contact/>
      },
      {
        path: "likes",
        element: <Likes/>
      },
      {
        path: "login",
        element: <Login/>
      },
      
      {
        path: "register",
        element: <Register/>
      }
    ]
  },
  {
    path: "admin",
    element: <AdminLayout />,
  },
  {
    path: "seller",
    element: <SellerLayout />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);
