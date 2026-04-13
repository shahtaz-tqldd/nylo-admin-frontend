import { apiSlice } from "../api/apiSlice";

const buildOrderListUrl = ({ page, page_size, search_str } = {}) => {
  const params = new URLSearchParams();

  if (page) {
    params.set("page", page);
  }

  if (page_size) {
    params.set("page_size", page_size);
  }

  if (search_str) {
    params.set("search_str", search_str);
  }

  const queryString = params.toString();
  return queryString
    ? `/admin/orders/list/?${queryString}`
    : "/admin/orders/list/";
};

export const orderApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    updateOrder: builder.mutation({
      query: ({ payload, orderId }) => ({
        url: `/admin/orders/update/${orderId}/`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["orders"],
    }),

    orderList: builder.query({
      query: (params) => ({
        url: buildOrderListUrl(params),
        method: "GET",
      }),
      providesTags: ["orders"],
    }),
  }),
});

export const { useOrderListQuery, useUpdateOrderMutation } = orderApiSlice;
