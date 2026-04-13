import React, { useState } from "react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const normalizeId = (value) => String(value ?? "");

const ProductOfferDialog = ({
  open,
  setOpen,
  product,
  assignmentData,
  isLoading,
  onCreateSignature,
  onCreateOfferItem,
  isSaving,
}) => {
  const assignmentPayload = assignmentData?.data ?? assignmentData ?? {};
  const productId = normalizeId(product?.id);
  const signatureId = normalizeId(
    assignmentPayload?.signature_product?.id ??
      assignmentPayload?.signature_item?.product?.id ??
      assignmentPayload?.signature_item?.id,
  );
  const offerProducts =
    assignmentPayload?.offer_products ??
    assignmentPayload?.offer_items?.map((item) => item?.product ?? item) ??
    [];
  const offerIds = offerProducts
    .map((item) => normalizeId(item?.id))
    .filter(Boolean);
  const defaultIsSignature = productId !== "" && productId === signatureId;
  const defaultIsOffer = productId !== "" && offerIds.includes(productId);
  const [signatureOverride, setSignatureOverride] = useState(null);
  const [offerOverride, setOfferOverride] = useState(null);
  const [offerEndsAt, setOfferEndsAt] = useState("");
  const isSignature = signatureOverride ?? defaultIsSignature;
  const isOffer = offerOverride ?? defaultIsOffer;

  const currentSignature =
    assignmentPayload?.signature_product ??
    assignmentPayload?.signature_item?.product ??
    assignmentPayload?.signature_item;

  const handleSubmit = async () => {
    if (!product?.id) {
      toast.error("No product selected");
      return;
    }

    if (!isSignature && !isOffer) {
      toast.error("Select at least one option");
      return;
    }

    const requests = [];

    if (isSignature) {
      requests.push(
        onCreateSignature({
          product_id: product.id,
        }),
      );
    }

    if (isOffer) {
      requests.push(
        onCreateOfferItem({
          product_id: product.id,
          ...(offerEndsAt ? { offer_ends_at: offerEndsAt } : {}),
        }),
      );
    }

    const results = await Promise.all(requests);
    const failedResult = results.find((result) => result?.error);

    if (failedResult) {
      toast.error(
        failedResult?.error?.data?.message ||
          failedResult?.error?.message ||
          "Failed to update featured product",
      );
      return;
    }

    toast.success("Featured product updated");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add offer</DialogTitle>
          <DialogDescription>
            Choose whether this product should be a signature product, an offer
            product, or both.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="rounded-xl border bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-900">
              Selected product
            </p>
            <p className="mt-1 text-sm text-slate-600">
              {product?.title || "-"}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="flex cursor-pointer items-start gap-3 rounded-xl border p-4">
              <Checkbox
                checked={isSignature}
                onCheckedChange={(checked) =>
                  setSignatureOverride(Boolean(checked))
                }
              />
              <div>
                <p className="font-medium text-slate-900">Add as signature</p>
                <p className="text-sm text-slate-500">
                  This will set the selected product as the current signature
                  product.
                </p>
              </div>
            </label>

            <label className="flex cursor-pointer items-start gap-3 rounded-xl border p-4">
              <Checkbox
                checked={isOffer}
                onCheckedChange={(checked) => setOfferOverride(Boolean(checked))}
              />
              <div>
                <p className="font-medium text-slate-900">Add as offer</p>
                <p className="text-sm text-slate-500">
                  This will add the selected product to the current offer list.
                </p>
              </div>
            </label>
          </div>

          {isOffer ? (
            <div className="space-y-2">
              <Label htmlFor="offerEndsAt">Offer ends at</Label>
              <Input
                id="offerEndsAt"
                type="date"
                value={offerEndsAt}
                onChange={(e) => setOfferEndsAt(e.target.value)}
              />
            </div>
          ) : null}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border p-4">
              <h3 className="font-semibold text-slate-900">
                Current signature product
              </h3>
              {isLoading ? (
                <div className="mt-3 h-16 animate-pulse rounded-lg bg-slate-100" />
              ) : currentSignature ? (
                <div className="mt-3 rounded-lg bg-slate-50 p-3">
                  <p className="font-medium text-slate-900">
                    {currentSignature?.title || "-"}
                  </p>
                  <p className="text-sm text-slate-500">
                    ID: {currentSignature?.id || "-"}
                  </p>
                </div>
              ) : (
                <p className="mt-3 text-sm text-slate-500">
                  No signature product assigned.
                </p>
              )}
            </div>

            <div className="rounded-xl border p-4">
              <h3 className="font-semibold text-slate-900">Current offers</h3>
              {isLoading ? (
                <div className="mt-3 space-y-2">
                  {Array.from({ length: 3 }, (_, idx) => (
                    <div
                      key={idx}
                      className="h-12 animate-pulse rounded-lg bg-slate-100"
                    />
                  ))}
                </div>
              ) : offerProducts.length ? (
                <div className="mt-3 space-y-2">
                  {offerProducts.map((item) => (
                    <div key={item.id} className="rounded-lg bg-slate-50 p-3">
                      <p className="font-medium text-slate-900">
                        {item?.title || "-"}
                      </p>
                      <p className="text-sm text-slate-500">
                        ID: {item?.id || "-"}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-3 text-sm text-slate-500">
                  No offer products assigned.
                </p>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProductOfferDialog;
