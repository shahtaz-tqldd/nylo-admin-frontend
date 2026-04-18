import React from "react";
import {
  Activity,
  CalendarRange,
  CircleDollarSign,
  TicketPercent,
} from "lucide-react";

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

import {
  formatCouponDateTime,
  formatCouponDiscount,
  formatCouponStatus,
  formatMoneyValue,
  getCouponUsageProgress,
} from "./coupon-utils";

const CouponDetailsDrawer = ({ open, setOpen, coupon, isLoading }) => {
  const usageProgress = getCouponUsageProgress(coupon);

  return (
    <Drawer open={open} onOpenChange={setOpen} direction="right">
      <DrawerContent className="h-screen w-full max-w-full rounded-none border-l p-0 sm:max-w-xl">
        <div className="flex h-full flex-col">
          <DrawerHeader className="border-b px-6 py-5 text-left">
            <DrawerTitle>{coupon?.code || "Coupon details"}</DrawerTitle>
            <DrawerDescription>
              Review coupon information without leaving this page.
            </DrawerDescription>
          </DrawerHeader>

          <div className="flex-1 space-y-6 overflow-y-auto p-6">
            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 5 }, (_, idx) => (
                  <div
                    key={idx}
                    className="h-24 animate-pulse rounded-2xl bg-slate-100"
                  />
                ))}
              </div>
            ) : (
              <>
                <div className="grid gap-4 sm:grid-cols-2">
                  <InfoCard
                    icon={<TicketPercent className="h-4 w-4" />}
                    label="Discount"
                    value={formatCouponDiscount(coupon)}
                    secondary={
                      coupon?.coupon_type === "percentage"
                        ? "Percentage coupon"
                        : "Fixed amount coupon"
                    }
                  />
                  <InfoCard
                    icon={<Activity className="h-4 w-4" />}
                    label="Status"
                    value={formatCouponStatus(coupon)}
                    secondary={coupon?.is_active ? "Enabled" : "Disabled"}
                  />
                  <InfoCard
                    icon={<CircleDollarSign className="h-4 w-4" />}
                    label="Minimum Order"
                    value={formatMoneyValue(coupon?.minimum_order_amount)}
                    secondary={
                      coupon?.maximum_discount_amount
                        ? `Max discount ${formatMoneyValue(coupon.maximum_discount_amount)}`
                        : "No max discount cap"
                    }
                  />
                  <InfoCard
                    icon={<CalendarRange className="h-4 w-4" />}
                    label="Validity"
                    value={formatCouponDateTime(coupon?.valid_until)}
                    secondary={`Starts ${formatCouponDateTime(coupon?.valid_from)}`}
                  />
                </div>

                <Section title="Overview">
                  <InfoRow label="Code" value={coupon?.code || "-"} />
                  <InfoRow
                    label="Description"
                    value={coupon?.description || "No description provided."}
                  />
                  <InfoRow
                    label="Coupon Type"
                    value={
                      coupon?.coupon_type === "percentage"
                        ? "Percentage"
                        : coupon?.coupon_type === "fixed"
                          ? "Fixed Amount"
                          : "-"
                    }
                  />
                  <InfoRow
                    label="Created On"
                    value={formatCouponDateTime(coupon?.created_at)}
                  />
                </Section>

                <Section title="Usage">
                  <InfoRow
                    label="Used Count"
                    value={String(coupon?.used_count ?? 0)}
                  />
                  <InfoRow
                    label="Usage Limit"
                    value={
                      coupon?.usage_limit === null || coupon?.usage_limit === undefined
                        ? "Unlimited"
                        : String(coupon.usage_limit)
                    }
                  />

                  {usageProgress !== null ? (
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center justify-between text-sm text-slate-600">
                        <span>Usage progress</span>
                        <span>{usageProgress.toFixed(0)}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-200">
                        <div
                          className="h-2 rounded-full bg-primary transition-all"
                          style={{ width: `${usageProgress}%` }}
                        />
                      </div>
                    </div>
                  ) : (
                    <p className="mt-4 text-sm text-slate-500">
                      This coupon has no usage limit.
                    </p>
                  )}
                </Section>
              </>
            )}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default CouponDetailsDrawer;

const Section = ({ title, children }) => (
  <div className="rounded-2xl border p-5">
    <h3 className="text-base font-semibold text-slate-900">{title}</h3>
    <div className="mt-4">{children}</div>
  </div>
);

const InfoCard = ({ icon, label, value, secondary }) => (
  <div className="rounded-2xl border bg-slate-50 p-4">
    <div className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
      {icon}
      <span>{label}</span>
    </div>
    <p className="text-sm font-semibold text-slate-900">{value}</p>
    {secondary ? <p className="mt-1 text-xs text-slate-500">{secondary}</p> : null}
  </div>
);

const InfoRow = ({ label, value }) => (
  <div className="flex items-start justify-between gap-4 border-b py-3 last:border-b-0 last:pb-0 first:pt-0">
    <span className="text-sm text-slate-500">{label}</span>
    <span className="max-w-[60%] text-right text-sm font-medium text-slate-900">
      {value}
    </span>
  </div>
);
