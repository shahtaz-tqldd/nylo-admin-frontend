export const formatMoneyValue = (value) => {
  if (value === null || value === undefined || value === "") {
    return "-";
  }

  const numericValue = Number(value);

  if (Number.isNaN(numericValue)) {
    return "-";
  }

  return `$${numericValue.toFixed(2)}`;
};

export const formatCouponDiscount = (coupon) => {
  const numericValue = Number(coupon?.value);

  if (Number.isNaN(numericValue)) {
    return "-";
  }

  if (coupon?.coupon_type === "percentage") {
    return `${numericValue}%`;
  }

  return formatMoneyValue(coupon?.value);
};

export const formatCouponStatus = (coupon) => {
  const now = new Date();
  const validFrom = coupon?.valid_from ? new Date(coupon.valid_from) : null;
  const validUntil = coupon?.valid_until ? new Date(coupon.valid_until) : null;
  const usageLimit =
    coupon?.usage_limit === null || coupon?.usage_limit === undefined
      ? null
      : Number(coupon.usage_limit);
  const usedCount = Number(coupon?.used_count ?? 0);

  if (!coupon?.is_active) {
    return "Inactive";
  }

  if (validFrom && validFrom > now) {
    return "Scheduled";
  }

  if (validUntil && validUntil < now) {
    return "Expired";
  }

  if (usageLimit !== null && !Number.isNaN(usageLimit) && usedCount >= usageLimit) {
    return "Limit Reached";
  }

  return "Active";
};

export const formatCouponDateTime = (value) => {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
};

export const formatDateTimeLocalInput = (value) => {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60 * 1000);

  return localDate.toISOString().slice(0, 16);
};

export const buildCouponPayload = (formData) => ({
  code: formData.code.trim().toUpperCase(),
  coupon_type: formData.coupon_type,
  value: formData.value.trim(),
  minimum_order_amount: formData.minimum_order_amount.trim() || "0",
  maximum_discount_amount: formData.maximum_discount_amount.trim() || null,
  usage_limit: formData.usage_limit.trim() || null,
  valid_from: formData.valid_from || null,
  valid_until: formData.valid_until || null,
  is_active: formData.is_active,
  description: formData.description.trim() || "",
});

export const getCouponUsageProgress = (coupon) => {
  const usageLimit = Number(coupon?.usage_limit);
  const usedCount = Number(coupon?.used_count ?? 0);

  if (!usageLimit || Number.isNaN(usageLimit)) {
    return null;
  }

  return Math.min(100, (usedCount / usageLimit) * 100);
};
