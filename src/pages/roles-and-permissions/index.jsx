import React, { useState } from "react";
import toast from "react-hot-toast";
import { Plus, Check, X, ChevronDown, ChevronUp } from "lucide-react";

import { Text, Title } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { TableUserProfile } from "@/components/ui/profile";
import StatusBadge from "@/components/ui/status";
import ThreeDotMenu from "@/components/dropdown/three-dot-menu";
import DeleteDialog from "@/components/dialog/delete-dialog";
import {
  useDeleteAdminUserMutation,
  useAdminUserListQuery,
  useSendInvitationMutation,
  useUpdateAdminUserMutation,
} from "@/features/auth/authApiSlice";

import UpdateRoleDialog from "./update-role-dialog";

const ALL_PERMISSIONS = [
  {
    module: "PRODUCT_MANAGEMENT",
    name: "Product Management",
    description: "Manage products and inventory visibility.",
    actions: ["VIEW", "CREATE", "UPDATE", "DELETE"],
  },
  {
    module: "CUSTOMER_MANAGEMENT",
    name: "Customer Management",
    description: "Access customer profiles and update account details.",
    actions: ["VIEW", "UPDATE"],
  },
  {
    module: "ORDER_MANAGEMENT",
    name: "Order Management",
    description: "Review orders and update their operational status.",
    actions: ["VIEW", "UPDATE"],
  },
  {
    module: "COUPON_MANAGEMENT",
    name: "Coupon Management",
    description: "Create and update promotional coupon campaigns.",
    actions: ["VIEW", "CREATE", "UPDATE", "DELETE"],
  },
  {
    module: "SALES",
    name: "Sales",
    description: "Inspect sales reports and performance metrics.",
    actions: ["VIEW"],
  },
  {
    module: "CHAT_SUPPORT",
    name: "Chat Support",
    description: "Review incoming support conversations.",
    actions: ["VIEW", "CREATE", "UPDATE", "DELETE"],
  },
];

const DEFAULT_INVITATION = {
  expires_in_hours: 48,
};

const createPermissionMap = (permissions = []) =>
  permissions.reduce((acc, permission) => {
    acc[permission.module] = permission.actions;
    return acc;
  }, {});

const buildPermissionsFromMap = (permissionMap = {}) =>
  Object.entries(permissionMap)
    .filter(([, actions]) => actions.length > 0)
    .map(([module, actions]) => ({
      module,
      actions,
    }));

const getModuleActions = (permissions = [], module) =>
  permissions.find((permission) => permission.module === module)?.actions ?? [];

const formatNameFromEmail = (email, fallback = "Admin User") => {
  const localPart = email?.split("@")[0];

  if (!localPart) {
    return fallback;
  }

  const parts = localPart
    .split(/[._-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1));

  if (parts.length >= 2) {
    return `${parts[0]} ${parts[1]}`;
  }

  if (parts.length === 1) {
    return `${parts[0]} Admin`;
  }

  return fallback;
};

const FULL_PERMISSION_SET = ALL_PERMISSIONS.map((permission) => ({
  module: permission.module,
  actions: [...permission.actions],
}));

const normalizeStatus = (status, fallback = "Pending") => {
  if (!status) {
    return fallback;
  }

  return status
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
};

const mapAdminUserToRole = (adminUser) => ({
  id: adminUser.id,
  name: adminUser.full_name || formatNameFromEmail(adminUser.email),
  email: adminUser.email,
  phone: adminUser.phone,
  job_title:
    adminUser.job_title ||
    (adminUser.is_superuser ? "Super Admin" : "Admin User"),
  invitaion_status: normalizeStatus(
    adminUser.status,
    adminUser.is_active ? "Active" : "Inactive",
  ),
  expires_in_hours: 72,
  permissions: adminUser.is_superuser
    ? FULL_PERMISSION_SET
    : adminUser.permissions || [],
  is_superuser: adminUser.is_superuser,
  is_active: adminUser.is_active,
  date_joined: adminUser.date_joined,
});

const RolesAndPermissionPage = () => {
  const { data, isLoading } = useAdminUserListQuery();
  const [updateAdminUser, { isLoading: isUpdatingAdminUser }] =
    useUpdateAdminUserMutation();
  const [deleteAdminUser, { isLoading: isDeletingAdminUser }] =
    useDeleteAdminUserMutation();
  const [sendInvitation, { isLoading: isSendingInvitation }] =
    useSendInvitationMutation();
  const [invitedRoles, setInvitedRoles] = useState([]);
  const [editedRoles, setEditedRoles] = useState({});
  const [hiddenRoleIds, setHiddenRoleIds] = useState([]);

  const [expandedRole, setExpandedRole] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedRoleId, setSelectedRoleId] = useState(null);
  const [formData, setFormData] = useState({
    email: "",
    job_title: "",
    expires_in_hours: 72,
    permissionMap: {},
  });
  const fetchedRoles = (data?.data || []).map(mapAdminUserToRole);
  const roles = [
    ...invitedRoles,
    ...fetchedRoles
      .filter((role) => !hiddenRoleIds.includes(role.id))
      .map((role) => editedRoles[role.id] || role),
  ];

  const handleAddRole = () => {
    setEditingRole(null);
    setFormData({
      email: DEFAULT_INVITATION.email,
      job_title: DEFAULT_INVITATION.job_title,
      expires_in_hours: DEFAULT_INVITATION.expires_in_hours,
      permissionMap: createPermissionMap(DEFAULT_INVITATION.permissions),
    });
    setIsModalOpen(true);
  };

  const handleEditRole = (role) => {
    setEditingRole(role);
    setFormData({
      email: role.email,
      job_title: role.job_title,
      expires_in_hours: role.expires_in_hours ?? 72,
      permissionMap: createPermissionMap(role.permissions),
    });
    setIsModalOpen(true);
  };

  const handleDeleteRole = () => {
    if (!selectedRoleId) {
      return false;
    }

    const isLocalInvitation = invitedRoles.some(
      (role) => role.id === selectedRoleId,
    );

    if (isLocalInvitation) {
      setInvitedRoles((prevRoles) =>
        prevRoles.filter((role) => role.id !== selectedRoleId),
      );
      setSelectedRoleId(null);
      toast.success("Invitation removed locally.");
      return true;
    }

    return deleteAdminUser(selectedRoleId)
      .unwrap()
      .then((response) => {
        setEditedRoles((prevRoles) => {
          const nextRoles = { ...prevRoles };
          delete nextRoles[selectedRoleId];
          return nextRoles;
        });
        setHiddenRoleIds((prev) => [...prev, selectedRoleId]);
        setSelectedRoleId(null);
        toast.success(
          response?.message ||
            response?.data?.message ||
            "Admin user deleted successfully.",
        );
        return true;
      })
      .catch((error) => {
        toast.error(error?.data?.message || "Failed to delete admin user.");
        return false;
      });
  };

  const handleSaveRole = async () => {
    const payload = {
      email: formData.email.trim(),
      job_title: formData.job_title.trim(),
      expires_in_hours: Number(formData.expires_in_hours),
      permissions: buildPermissionsFromMap(formData.permissionMap),
    };

    if (!payload.email) {
      toast.error("Email is required.");
      return false;
    }

    if (!payload.job_title) {
      toast.error("Job title is required.");
      return false;
    }

    if (!payload.permissions.length) {
      toast.error("Select at least one module permission.");
      return false;
    }

    if (
      !editingRole &&
      (!payload.expires_in_hours || payload.expires_in_hours < 1)
    ) {
      toast.error("Invitation expiry must be at least 1 hour.");
      return false;
    }

    if (editingRole) {
      const updatedRole = {
        ...editingRole,
        email: payload.email,
        name: editingRole.name || formatNameFromEmail(payload.email),
        job_title: payload.job_title,
        expires_in_hours: payload.expires_in_hours,
        permissions: payload.permissions,
      };

      if (invitedRoles.some((role) => role.id === editingRole.id)) {
        setInvitedRoles((prevRoles) =>
          prevRoles.map((role) =>
            role.id === editingRole.id ? updatedRole : role,
          ),
        );
        toast.success("Role updated locally.");
        setIsModalOpen(false);
        return true;
      } else {
        return updateAdminUser({
          adminUserId: editingRole.id,
          data: {
            job_title: payload.job_title,
            permissions: payload.permissions,
          },
        })
          .unwrap()
          .then((response) => {
            setEditedRoles((prevRoles) => ({
              ...prevRoles,
              [editingRole.id]: updatedRole,
            }));
            toast.success(
              response?.message ||
                response?.data?.message ||
                "Admin user updated successfully.",
            );
            setIsModalOpen(false);
            return true;
          })
          .catch((error) => {
            toast.error(error?.data?.message || "Failed to update admin user.");
            return false;
          });
      }
    }

    try {
      const response = await sendInvitation(payload).unwrap();

      setInvitedRoles((prevRoles) => [
        {
          id: `invited-${Date.now()}`,
          name: formatNameFromEmail(payload.email, payload.job_title),
          email: payload.email,
          job_title: payload.job_title,
          invitaion_status: "Pending",
          expires_in_hours: payload.expires_in_hours,
          permissions: payload.permissions,
          is_superuser: false,
        },
        ...prevRoles,
      ]);

      toast.success(
        response?.message ||
          response?.data?.message ||
          "Invitation sent successfully.",
      );
      setIsModalOpen(false);
      setFormData({
        email: "",
        job_title: "",
        expires_in_hours: 72,
        permissionMap: {},
      });
      return true;
    } catch (error) {
      toast.error(error?.data?.message || "Failed to send invitation.");
      return false;
    }
  };

  const togglePermission = (module, action) => {
    setFormData((prev) => {
      const selectedActions = prev.permissionMap[module] ?? [];
      const nextActions = selectedActions.includes(action)
        ? selectedActions.filter((item) => item !== action)
        : [...selectedActions, action];

      return {
        ...prev,
        permissionMap: {
          ...prev.permissionMap,
          [module]: nextActions,
        },
      };
    });
  };

  const toggleModulePermissions = (module, actions) => {
    setFormData((prev) => {
      const selectedActions = prev.permissionMap[module] ?? [];
      const shouldSelectAll = selectedActions.length !== actions.length;

      return {
        ...prev,
        permissionMap: {
          ...prev.permissionMap,
          [module]: shouldSelectAll ? [...actions] : [],
        },
      };
    });
  };

  const toggleAllPermissions = () => {
    setFormData((prev) => {
      const areAllSelected = ALL_PERMISSIONS.every((permission) => {
        const selectedActions = prev.permissionMap[permission.module] ?? [];
        return selectedActions.length === permission.actions.length;
      });

      return {
        ...prev,
        permissionMap: areAllSelected
          ? {}
          : ALL_PERMISSIONS.reduce((acc, permission) => {
              acc[permission.module] = [...permission.actions];
              return acc;
            }, {}),
      };
    });
  };

  return (
    <div>
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

      <div className="space-y-4 mt-8">
        {isLoading ? (
          <div className="rounded-lg border border-slate-200 bg-white p-6 text-sm text-slate-500">
            Loading admin users...
          </div>
        ) : null}

        {!isLoading && roles.length === 0 ? (
          <div className="rounded-lg border border-slate-200 bg-white p-6 text-sm text-slate-500">
            No admin users found.
          </div>
        ) : null}

        {roles.map((role) => (
          <div
            key={role.id}
            className="bg-white rounded-lg shadow-sm overflow-hidden"
          >
            <div className="p-4">
              <div className="flex items-center w-full py-2">
                <div className="w-1/4">
                  <TableUserProfile name={role.name} email={role.email} />
                </div>

                <div className="w-1/4 text-sm text-gray-700 flex justify-center">
                  {role.job_title || "No title assigned"}
                </div>

                <div className="w-1/4 text-sm text-gray-700 flex justify-center">
                  {role.permissions.reduce(
                    (total, permission) => total + permission.actions.length,
                    0,
                  )}{" "}
                  permissions
                  {role.is_superuser ? " (All Access)" : ""}
                </div>

                <div className="w-1/4 flex justify-center">
                  <StatusBadge status={role.invitaion_status} />
                </div>

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
                            expandedRole === role.id ? null : role.id,
                          ),
                      },
                      { label: "Edit", onSelect: () => handleEditRole(role) },
                      {
                        label: "Delete",
                        destructive: true,
                        onSelect: () => {
                          setSelectedRoleId(role.id);
                          setIsDeleteDialogOpen(true);
                        },
                      },
                    ]}
                  />
                </div>
              </div>

              {expandedRole === role.id && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">
                    Permissions
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {ALL_PERMISSIONS.map((permission) => {
                      const grantedActions = getModuleActions(
                        role.permissions,
                        permission.module,
                      );
                      const hasPermission = grantedActions.length > 0;

                      return (
                        <div
                          key={permission.module}
                          className={`p-3 rounded-lg border ${
                            hasPermission
                              ? "border-primary/40 bg-primary/5"
                              : "border-gray-200 bg-gray-50"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {hasPermission ? (
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
                          <p className="text-xs text-gray-500 mt-2 ml-6">
                            {hasPermission
                              ? grantedActions.join(", ")
                              : "No actions assigned"}
                          </p>
                          {role.is_superuser ? (
                            <p className="text-xs text-primary mt-2 ml-6 font-medium">
                              Granted via superuser access
                            </p>
                          ) : null}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <UpdateRoleDialog
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        editingRole={editingRole}
        formData={formData}
        setFormData={setFormData}
        handleSaveRole={handleSaveRole}
        allPermissions={ALL_PERMISSIONS}
        togglePermission={togglePermission}
        toggleModulePermissions={toggleModulePermissions}
        toggleAllPermissions={toggleAllPermissions}
        isSubmitting={isSendingInvitation || isUpdatingAdminUser}
      />

      <DeleteDialog
        isOpen={isDeleteDialogOpen}
        setIsOpen={setIsDeleteDialogOpen}
        onConfirm={handleDeleteRole}
        isLoading={isDeletingAdminUser}
      />
    </div>
  );
};

export default RolesAndPermissionPage;
