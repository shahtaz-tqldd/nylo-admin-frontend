import { TableUserProfile } from "@/components/ui/profile";
import StatusBadge from "@/components/ui/status";

export const DEMO_CUSTOMERS = [
  {
    id: 1,
    customer: (
      <TableUserProfile name="John Carter" email="john.carter@example.com" />
    ),
    phone: "+1 202 555 0147",
    region: "United States",
    last_active: "2 hours ago",
    created_at: "January 10, 2025",
    message_count: 12,
    order_count: 5,
    status: <StatusBadge status="Active" />,
  },
  {
    id: 2,
    customer: (
      <TableUserProfile
        name="Emily Johnson"
        email="emily.johnson@example.com"
      />
    ),
    phone: "+1 202 555 0183",
    region: "Canada",
    last_active: "1 day ago",
    created_at: "February 3, 2025",
    message_count: 3,
    order_count: 8,
    status: <StatusBadge status="Active" />,
  },
  {
    id: 3,
    customer: (
      <TableUserProfile name="Michael Lee" email="michael.lee@example.com" />
    ),
    phone: "+44 20 7946 0958",
    region: "United Kingdom",
    last_active: "5 days ago",
    created_at: "February 18, 2025",
    message_count: 1,
    order_count: 2,
    status: <StatusBadge status="Inactive" />,
  },
  {
    id: 4,
    customer: (
      <TableUserProfile
        name="Sophia Williams"
        email="sophia.williams@example.com"
      />
    ),
    phone: "+61 2 9374 4000",
    region: "Australia",
    last_active: "3 hours ago",
    created_at: "March 2, 2025",
    message_count: 18,
    order_count: 10,
    status: <StatusBadge status="Active" />,
  },
  {
    id: 5,
    customer: (
      <TableUserProfile
        name="Daniel Ramirez"
        email="daniel.ramirez@example.com"
      />
    ),
    phone: "+34 91 123 4567",
    region: "Spain",
    last_active: "12 days ago",
    created_at: "March 25, 2025",
    message_count: 0,
    order_count: 1,
    status: <StatusBadge status="Blocked" />,
  },
];
