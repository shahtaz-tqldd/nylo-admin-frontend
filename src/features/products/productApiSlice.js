import { apiSlice } from "../api/apiSlice";

export const productApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // products
    createProduct: builder.mutation({
      query: (body) => ({
        url: "/products/admin/product/",
        method: "POST",
        body,
      }),
    }),

    productList: builder.query({
      query: (query) => ({
        url: "/products/list/",
        method: "GET",
      }),
    }),

    // category
    createCategory: builder.mutation({
      query: (body) => ({
        url: "/products/admin/category/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["productSettings"],
    }),

    // size
    createSize: builder.mutation({
      query: (body) => ({
        url: "/products/admin/size/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["productSettings"],
    }),

    // color
    createColor: builder.mutation({
      query: (body) => ({
        url: "/products/admin/color/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["productSettings"],
    }),

    // collection
    createCollection: builder.mutation({
      query: (body) => ({
        url: "/products/admin/collection/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["productSettings"],
    }),

    // product create settings
    productSettings: builder.query({
      query: () => ({
        url: "/products/settings/",
        method: "GET",
      }),
      providesTags: ["productSettings"],
    }),
  }),
});

export const {
  useProductListQuery,
  useCreateProductMutation,

  useCreateCategoryMutation,
  useCreateSizeMutation,
  useCreateColorMutation,
  useCreateCollectionMutation,

  useProductSettingsQuery,
} = productApiSlice;
