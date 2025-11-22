import React, { useState } from "react";
import {
  Shield,
  Users,
  Edit2,
  Trash2,
  Plus,
  Check,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Text, Title } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { TableUserProfile } from "@/components/ui/profile";
import StatusBadge from "@/components/ui/status";
import ThreeDotMenu from "@/components/dropdown/three-dot-menu";
import DeleteDialog from "@/components/dialog/delete-dialog";
import UpdateRoleDialog from "./update-role-dialog";

const RolesAndPermissionPage = () => {
  const [roles, setRoles] = useState([
    {
      id: 1,
      name: "Ayesha Karim",
      email: "ayesha.karim@example.com",
      role_name: "Store Admin",
      invitaion_status: "pending",
      permissions: [
        "manage_customers",
        "manage_products",
        "manage_orders",
        "view_sales",
        "manage_messages",
        "manage_coupons",
      ],
    },
    {
      id: 2,
      name: "Nayeem Hassan",
      email: "nayeem.hassan@example.com",
      role_name: "Product Manager",
      invitaion_status: "accepted",
      permissions: ["manage_products", "manage_orders", "manage_customers"],
    },
    {
      id: 3,
      name: "Ritika Chowdhury",
      email: "ritika.chowdhury@example.com",
      role_name: "Order and Sales",
      invitaion_status: "accepted",
      permissions: ["manage_orders", "view_sales"],
    },
  ]);

  const [expandedRole, setExpandedRole] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const allPermissions = [
    {
      id: "manage_customers",
      name: "Customer Management",
      description: "View, create, update, and manage customers.",
    },
    {
      id: "manage_products",
      name: "Product Management",
      description:
        "Add new products, update existing ones, and manage inventory.",
    },
    {
      id: "manage_orders",
      name: "Order Management",
      description: "View and manage customer orders, including status updates.",
    },
    {
      id: "view_sales",
      name: "Sales Analysis",
      description: "Access sales reports, analytics, and revenue insights.",
    },
    {
      id: "manage_messages",
      name: "Chat Assistant",
      description: "View and manage AI assistant messages with users.",
    },
    {
      id: "manage_coupons",
      name: "Coupon Management",
      description: "Create and manage discount codes and promotional offers.",
    },
  ];

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    permissions: [],
  });

  const handleAddRole = () => {
    setEditingRole(null);
    setFormData({ name: "", description: "", permissions: [] });
    setIsModalOpen(true);
  };

  const handleEditRole = (role) => {
    setEditingRole(role);
    setFormData({
      email: role.email,
      role_name: role.role_name,
      permissions: [...role.permissions],
    });
    setIsModalOpen(true);
  };

  const handleDeleteRole = (id) => {
    setRoles(roles.filter((role) => role.id !== id));
  };

  const handleSaveRole = () => {
    if (!formData.name.trim()) {
      alert("Role name is required");
      return;
    }

    if (editingRole) {
      setRoles(
        roles.map((role) =>
          role.id === editingRole.id ? { ...role, ...formData } : role
        )
      );
    } else {
      const newRole = {
        id: Math.max(...roles.map((r) => r.id), 0) + 1,
        ...formData,
        userCount: 0,
      };
      setRoles([...roles, newRole]);
    }

    setIsModalOpen(false);
    setFormData({ name: "", description: "", permissions: [] });
  };

  const togglePermission = (permissionId) => {
    setFormData((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(permissionId)
        ? prev.permissions.filter((p) => p !== permissionId)
        : [...prev.permissions, permissionId],
    }));
  };

  return (
    <div>
      {/* Header */}
      <div className="flbx">
        <div>
          <Title variant="lg">Roles & Permissions</Title>
          <Text className="mt-2">Manage user roles and access control</Text>
        </div>

        <Button className="pr-4 pl-3" onClick={handleAddRole}>
          <div className="flx gap-1.5">
            <Plus className="!h-4" />
            Assign a new Role
          </div>
        </Button>
      </div>

      {/* Roles List */}
      <div className="space-y-4 mt-8">
        {roles.map((role) => (
          <div
            key={role.id}
            className="bg-white rounded-lg shadow-sm overflow-hidden"
          >
            <div className="p-4">
              <div className="flex items-center w-full py-2">
                {/* Column 1 – User Profile */}
                <div className="w-1/4">
                  <TableUserProfile name={role.name} email={role.email} />
                </div>

                {/* Column 2 – Role Name */}
                <div className="w-1/4 text-sm text-gray-700 flex justify-center">
                  {role.role_name}
                </div>

                {/* Column 3 – Permissions Count */}
                <div className="w-1/4 text-sm text-gray-700 flex justify-center">
                  {role.permissions.length} permissions
                </div>

                {/* Column 4 – Invitation Status */}
                <div className="w-1/4 flex justify-center">
                  <StatusBadge status={role.invitaion_status} />
                </div>

                {/* Column 5 – Actions (auto pushed to right) */}
                <div className="flex items-center gap-2 ml-auto">
                  <button
                    onClick={() =>
                      setExpandedRole(expandedRole === role.id ? null : role.id)
                    }
                    className="p-2 text-gray-600 bg-gray-100 hover:bg-primary/10 rounded-lg transition-colors"
                  >
                    {expandedRole === role.id ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </button>

                  <ThreeDotMenu
                    actions={[
                      {
                        label: "View",
                        onSelect: () =>
                          setExpandedRole(
                            expandedRole === role.id ? null : role.id
                          ),
                      },
                      { label: "Edit", onSelect: () => handleEditRole(role) },
                      {
                        label: "Delete",
                        destructive: true,
                        onSelect: () => setIsDeleteDialogOpen(true),
                      },
                    ]}
                  />
                </div>
              </div>

              {/* Permissions Display */}
              {expandedRole === role.id && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">
                    Permissions
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {allPermissions.map((permission) => (
                      <div
                        key={permission.id}
                        className={`p-3 rounded-lg border ${
                          role.permissions.includes(permission.id)
                            ? "border-primary/40 bg-primary/10"
                            : "border-gray-200 bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {role.permissions.includes(permission.id) ? (
                            <Check className="w-4 h-4 text-green-600" />
                          ) : (
                            <X className="w-4 h-4 text-gray-400" />
                          )}
                          <span className="text-sm font-medium text-primary">
                            {permission.name}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 mt-1 ml-6">
                          {permission.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <UpdateRoleDialog
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        editingRole={editingRole}
        formData={formData}
        setFormData={setFormData}
        handleSaveRole={handleSaveRole}
        allPermissions={allPermissions}
        togglePermission={togglePermission}
      />
      <DeleteDialog
        isOpen={isDeleteDialogOpen}
        setIsOpen={setIsDeleteDialogOpen}
        onConfirm={handleDeleteRole}
      />
    </div>
  );
};

export default RolesAndPermissionPage;
