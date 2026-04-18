import { apiSlice } from "../api/apiSlice";

export const couponApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    couponList: builder.query({
      query: () => ({
        url: "/admin/coupons/list/",
        method: "GET",
      }),
      providesTags: ["coupons"],
    }),

    couponDetails: builder.query({
      query: (id) => ({
        url: `/admin/coupons/${id}/`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "coupons", id }],
    }),

    createCoupon: builder.mutation({
      query: (body) => ({
        url: "/admin/coupons/create/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["coupons"],
    }),

    updateCoupon: builder.mutation({
      query: ({ id, body }) => ({
        url: `/admin/coupons/update/${id}/`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        "coupons",
        { type: "coupons", id },
      ],
    }),

    deleteCoupon: builder.mutation({
      query: (id) => ({
        url: `/admin/coupons/delete/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["coupons"],
    }),
  }),
});

export const {
  useCouponListQuery,
  useCouponDetailsQuery,
  useCreateCouponMutation,
  useUpdateCouponMutation,
  useDeleteCouponMutation,
} = couponApiSlice;
