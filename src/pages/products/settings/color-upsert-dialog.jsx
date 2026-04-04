import React, { useState } from "react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FloatingInput } from "@/components/ui/input";

import { useCreateColorMutation } from "@/features/products/productApiSlice";
import { Label } from "@/components/ui/label";

const ColorUpsertDialog = ({ open, setOpen }) => {
  const [newColorName, setNewColorName] = useState("");
  const [newColorCode, setNewColorCode] = useState("#111827");
  const [createColor, { isLoading }] = useCreateColorMutation();

  const handleCreateColor = async () => {
    const normalizedName = newColorName.trim();

    if (!normalizedName) {
      return;
    }

    const color = {
      name: normalizedName,
      color_code: newColorCode,
    };

    try {
      const res = await createColor(color).unwrap();

      if (res?.data?.success) {
        toast.success(res.data.message);
        setNewColorName("");
        setNewColorCode("#111827");
        setOpen(false);
      }
    } catch (error) {
      toast.error(`Color creation failed: ${error}`);
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Color</DialogTitle>
          <DialogDescription>
            Create a color with name and picker value.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <FloatingInput
              label="Color Name"
              value={newColorName}
              onChange={(e) => setNewColorName(e.target.value)}
            />
          </div>

          <div className="space-y-4">
            <Label>Color Picker</Label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={newColorCode}
                onChange={(e) => setNewColorCode(e.target.value)}
                className="h-14 w-16 cursor-pointer rounded-md border border-gray-200 bg-white p-1"
              />
              <FloatingInput
                value={newColorCode}
                onChange={(e) => setNewColorCode(e.target.value)}
                label="Color code"
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleCreateColor}
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Save Color"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ColorUpsertDialog;
