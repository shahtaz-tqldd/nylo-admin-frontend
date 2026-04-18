import { NavLink, Outlet } from "react-router-dom";

import { Text, Title } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

const STORE_TABS = [
  { label: "Store Configuration", to: "/store/configuration" },
  { label: "About Us", to: "/store/about-us" },
  { label: "Legal Content", to: "/store/legal-content" },
  { label: "FAQs", to: "/store/faqs" },
];

const StorePage = () => (
  <div className="space-y-6">
    <div className="space-y-2">
      <Title variant="lg">Storefront</Title>
      <Text>Manage storefront configuration and customer-facing content by section.</Text>
    </div>

    <div className=" w-fit">
      <div className="flex flex-wrap gap-2">
        {STORE_TABS.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            className={({ isActive }) =>
              cn(
                "rounded-xl px-4 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
              )
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </div>
    </div>

    <Outlet />
  </div>
);

export default StorePage;
