import React from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { FloatingInput } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const UpdateRoleDialog = ({
  isOpen,
  setIsOpen,
  editingRole,
  formData,
  setFormData,
  handleSaveRole,
  allPermissions,
  togglePermission,
  toggleModulePermissions,
  toggleAllPermissions,
  isSubmitting = false,
}) => {
  const submitLabel = editingRole ? "Update Role" : "Send Invitation";
  const loadingLabel = editingRole ? "Updating..." : "Sending...";
  const description = editingRole
    ? "Update the admin user's role title and module permissions."
    : "Configure job title, expiration time, and module permissions before sending the invitation.";
  const areAllPermissionsSelected = allPermissions.every((permission) => {
    const selectedActions = formData.permissionMap?.[permission.module] ?? [];
    return selectedActions.length === permission.actions.length;
  });

  const handleSubmit = async () => {
    const shouldClose = await handleSaveRole();

    if (shouldClose !== false) {
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {editingRole ? "Edit Role" : "Invite Admin User"}
          </DialogTitle>
          <DialogDescription className="max-w-lg">
            {description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <FloatingInput
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              disabled={Boolean(editingRole)}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  email: e.target.value,
                }))
              }
            />

            <FloatingInput
              label="Job Title"
              name="job_title"
              value={formData.job_title}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  job_title: e.target.value,
                }))
              }
            />
          </div>

          {!editingRole ? (
            <FloatingInput
              label="Expires In (Hours)"
              type="number"
              min="1"
              name="expires_in_hours"
              value={String(formData.expires_in_hours ?? 72)}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  expires_in_hours: e.target.value,
                }))
              }
            />
          ) : null}

          <div
            className={cn(
              "overflow-auto custom-scrollbar px-2",
              editingRole ? "max-h-[60vh] " : "max-h-[50vh]",
            )}
          >
            <div className="mb-3 flex items-center justify-between gap-4">
              <label className="block text-sm font-medium text-gray-700">
                Permissions
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-700">
                <Checkbox
                  checked={areAllPermissionsSelected}
                  onCheckedChange={toggleAllPermissions}
                  aria-label="select-all-permissions"
                />
                <span>Select all permissions</span>
              </label>
            </div>

            <div className="space-y-4">
              {allPermissions.map((permission) => {
                const selectedActions =
                  formData.permissionMap?.[permission.module] ?? [];
                const areAllActionsSelected =
                  selectedActions.length === permission.actions.length;

                return (
                  <div
                    key={permission.module}
                    className="rounded-xl border border-slate-200 p-4"
                  >
                    <div className="mb-3">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <p className="text-sm font-semibold text-slate-900">
                          {permission.name}
                        </p>
                        <label className="flex items-center gap-2 text-sm text-slate-700">
                          <Checkbox
                            checked={areAllActionsSelected}
                            onCheckedChange={() =>
                              toggleModulePermissions(
                                permission.module,
                                permission.actions,
                              )
                            }
                            aria-label={`${permission.module}-select-all-actions`}
                          />
                          <span>Select all actions</span>
                        </label>
                      </div>
                      <p className="text-xs text-slate-500">
                        {permission.description}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-4">
                      {permission.actions.map((action) => (
                        <label
                          key={action}
                          className="flex items-center gap-2 text-sm text-slate-700"
                        >
                          <Checkbox
                            checked={selectedActions.includes(action)}
                            onCheckedChange={() =>
                              togglePermission(permission.module, action)
                            }
                            aria-label={`${permission.module}-${action}`}
                          />
                          <span>{action}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>

          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? loadingLabel : submitLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateRoleDialog;
