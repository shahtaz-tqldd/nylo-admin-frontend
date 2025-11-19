import { createBrowserRouter } from "react-router-dom";
import DashboardLayout from "./layouts/main";
import Overview from "./pages/overview";
import CustomerPage from "./pages/customers";
import OrderPage from "./pages/orders";
import ProductPage from "./pages/products";
import SalesPage from "./pages/sales";
import MessagesPage from "./pages/messages";
import ManagersPage from "./pages/managers";
import StorePage from "./pages/store";
import CouponPage from "./pages/coupons";
import SettingsPage from "./pages/settings";
import AddProductPage from "./pages/products/add-product-page";
import CollectionPage from "./pages/products/collection-page";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <DashboardLayout />,
    children: [
      {
        path: "/",
        element: <Overview />,
      },
      {
        path: "/customers",
        element: <CustomerPage />,
      },
      {
        path: "/orders",
        element: <OrderPage />,
      },
      {
        path: "/products",
        element: <ProductPage />,
      },
      {
        path: "/products/add-new-product",
        element: <AddProductPage />,
      },
      {
        path: "/products/collections",
        element: <CollectionPage />,
      },
      {
        path: "/sales",
        element: <SalesPage />,
      },
      {
        path: "/messages",
        element: <MessagesPage />,
      },
      {
        path: "/managers",
        element: <ManagersPage />,
      },
      {
        path: "/store",
        element: <StorePage />,
      },
      {
        path: "/coupons",
        element: <CouponPage />,
      },
      {
        path: "/settings",
        element: <SettingsPage />,
      },
    ],
  },
]);
