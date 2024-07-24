import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import { createTheme, MantineProvider } from "@mantine/core";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { SWRConfig } from "swr";
import axios from "axios";
import { Notifications } from "@mantine/notifications";
import { ModalsProvider } from "@mantine/modals";
import HomePage from "./pages/index";

import BooksPage from "./pages/book/books";
import BookByIdPage from "./pages/book/book-by-id";
import BookEditById from "./pages/book/book-edit-by-id";
import BookCreatePage from "./pages/book/book-create";

import MenuPage from "./pages/menu/menus";
import MenuByIdPage from "./pages/menu/menu-by-id";
import MenuCreatePage from "./pages/menu/menu-create";
import MenuEditById from "./pages/menu/menu-edit-by-id";

import OrderPage from "./pages/order/orders";
import OrderByIdPage from "./pages/order/order-by-id";
import OrderCreatePage from "./pages/order/order-create";
import OrderEditById from "./pages/order/order-edit-by-id";

const theme = createTheme({
  primaryColor: "orange",
  fontFamily: '"Noto Sans Thai Looped", sans-serif',
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/books",
    element: <BooksPage />,
  },
  {
    path: "/books/create",
    element: <BookCreatePage />,
  },
  {
    path: "/books/:bookId",
    element: <BookByIdPage />,
  },
  {
    path: "/books/:bookId/edit",
    element: <BookEditById />,
  },
  {
    path: "/coffees",
    element: <MenuPage />,
  },
  {
    path: "/coffees/:coffeeId",
    element: <MenuByIdPage />,
  },
  {
    path: "/coffees/create",
    element: <MenuCreatePage />,
  },
  {
    path: "/coffees/:coffeeId/edit",
    element: <MenuEditById />,
  },
  {
    path: "/orders",
    element: <OrderPage />,
  },
  {
    path: "/orders/:orderId",
    element: <OrderByIdPage />,
  },
  {
    path: "/orders/create",
    element: <OrderCreatePage />,
  },
  {
    path: "/orders/:orderId/edit",
    element: <OrderEditById />,
  },
]);

if (import.meta.env.VITE_API_URL) {
  axios.defaults.baseURL = import.meta.env.VITE_API_URL;
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <SWRConfig
      value={{
        fetcher: (url: string) =>
          axios
            .get(url, {
              baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api/v1",
            })
            .then((res) => res.data),
      }}
    >
      <MantineProvider theme={theme}>
        <Notifications position="top-right" />
        <ModalsProvider>
          <RouterProvider router={router} />
        </ModalsProvider>
      </MantineProvider>
    </SWRConfig>
  </React.StrictMode>
);
