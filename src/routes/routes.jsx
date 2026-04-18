import { createBrowserRouter, Navigate } from "react-router-dom";
import DashboardLayout from "../layouts/main";
import Overview from "../pages/overview";
import CustomerPage from "../pages/customers";
import OrderPage from "../pages/orders";
import ProductPage from "../pages/products";
import SalesPage from "../pages/sales";
import MessagesPage from "../pages/messages";
import RolesAndPermissionPage from "../pages/roles-and-permissions";
import StorePage from "../pages/store";
import CouponPage from "../pages/coupons";
import SettingsPage from "../pages/settings";
import LoginPage from "../pages/auth/login";
import RegisterPage from "../pages/auth/register";
import ForgotPasswordPage from "../pages/auth/forgot-password";
import ResetPasswordPage from "../pages/auth/reset-password";
import PrivateRoute from "./private-route";
import UpsertProductPage from "@/pages/products/upsert/upsert-product-page";
import CollectionPage from "@/pages/collections";
import ProductSettingsPage from "@/pages/products/settings";
import StoreConfigurationPage from "@/pages/store/configuration";
import StoreAboutPage from "@/pages/store/about";
import StoreLegalPage from "@/pages/store/legal";
import StoreFaqPage from "@/pages/store/faqs";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
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
        element: <UpsertProductPage />,
      },
      {
        path: "/products/update/:productId",
        element: <UpsertProductPage />,
      },
      {
        path: "/products/collections",
        element: <CollectionPage />,
      },
      {
        path: "/products/settings",
        element: <ProductSettingsPage />,
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
        path: "/roles-and-permissions",
        element: <RolesAndPermissionPage />,
      },
      {
        path: "/store",
        element: <StorePage />,
        children: [
          {
            index: true,
            element: <Navigate to="configuration" replace />,
          },
          {
            path: "configuration",
            element: <StoreConfigurationPage />,
          },
          {
            path: "about-us",
            element: <StoreAboutPage />,
          },
          {
            path: "legal-content",
            element: <StoreLegalPage />,
          },
          {
            path: "faqs",
            element: <StoreFaqPage />,
          },
        ],
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
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/sign-up",
    element: <RegisterPage />,
  },
  {
    path: "/forget-password",
    element: <ForgotPasswordPage />,
  },
  {
    path: "/reset-password",
    element: <ResetPasswordPage />,
  },
]);
