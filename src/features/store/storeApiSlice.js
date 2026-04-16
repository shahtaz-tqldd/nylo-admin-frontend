import { apiSlice } from "../api/apiSlice";

export const storeApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    updateStore: builder.mutation({
      query: ({ payload }) => ({
        url: `/admin/shop/store-configuration/`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["store"],
    }),

    storeDetails: builder.query({
      query: () => ({
        url: `/shop/store-configuration/`,
        method: "GET",
      }),
      providesTags: ["store"],
    }),
  }),
});

export const { useStoreDetailsQuery, useUpdateStoreMutation } = storeApiSlice;
