import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingBag,
  LineChart,
  MessageSquare,
  Shield,
  Store,
  Tags,
  Settings,
} from "lucide-react";
import logo from "@/assets/images/logo.svg";
import { useSelector } from "react-redux";

const SideMenu = () => {
  const location = useLocation();

  const navItems = [
    {
      id: 1,
      label: "Overview",
      link: "/",
      icon: <LayoutDashboard size={18} />,
    },
    {
      id: 2,
      label: "Customers",
      link: "/customers",
      icon: <Users size={18} />,
    },
    {
      id: 3,
      label: "Products",
      link: "/products",
      icon: <Package size={18} />,
    },
    {
      id: 4,
      label: "Orders",
      link: "/orders",
      icon: <ShoppingBag size={18} />,
    },
    { id: 5, label: "Sales", link: "/sales", icon: <LineChart size={18} /> },
    {
      id: 6,
      label: "Messages",
      link: "/messages",
      icon: <MessageSquare size={18} />,
    },
    { id: 9, label: "Coupons", link: "/coupons", icon: <Tags size={18} /> },
    {
      id: 7,
      label: "Roles & Permissions",
      link: "/roles-and-permissions",
      icon: <Shield size={18} />,
    },

    // 💡 Additional eCommerce admin suggested:
    { id: 8, label: "Storefront", link: "/store", icon: <Store size={18} /> },
    {
      id: 10,
      label: "Account Settings",
      link: "/settings",
      icon: <Settings size={18} />,
    },
  ];

  const { user } = useSelector((state) => state.auth);
  const full_name = user
    ? `${user.first_name} ${user.last_name}`
    : "Store Admin";
  const role = user ? user.role : "Admin";
  const profileImage = user?.profile_picture_url;

  return (
    <div className="max-w-[240px] w-full h-screen bg-primary/15 p-6 pr-2 flex flex-col justify-between">
      <div className="space-y-6">
        <Link to="/" className="flex items-center">
          <img src={logo} className="h-11 w-11" />
          <h2 className="text-primary font-medium">nylo admin panel</h2>
        </Link>
        <ul className="space-y-1 w-full">
          {navItems.map((item) => {
            const isActive = location.pathname === item.link;

            return (
              <li key={item.id}>
                <Link
                  to={item.link}
                  className={`flex items-center gap-3 px-3 py-2 w-full text-sm rounded-md transition-all
                  ${
                    isActive
                      ? "bg-primary text-white"
                      : "text-primary/75 hover:bg-primary/15 hover:text-primary"
                  }
                `}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="bg-primary/5 border border-primary/20 p-3 rounded-lg flex items-center gap-2">
        {profileImage ? (
          <img src={profileImage} className="h-9 w-9 rounded-full" />
        ) : (
          <div className="h-9 w-9 rounded-full bg-primary/15 font-semibold center text-primary">
            {full_name.charAt(0).toUpperCase()}
          </div>
        )}
        <div className="flex-1">
          <h2 className="text-sm text-primary font-medium">{full_name}</h2>
          <p className="text-xs text-primary/75">{role}</p>
        </div>
      </div>
    </div>
  );
};

export default SideMenu;
