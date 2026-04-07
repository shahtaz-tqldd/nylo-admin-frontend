import { apiSlice } from "../api/apiSlice";

const buildProductListUrl = ({
  page,
  page_size,
  search_str,
  category = [],
  gender = [],
  brand = [],
  collection = [],
} = {}) => {
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

  [
    ["category", category],
    ["gender", gender],
    ["brand", brand],
    ["collection", collection],
  ].forEach(([key, values]) => {
    values.filter(Boolean).forEach((value) => params.append(key, value));
  });

  const queryString = params.toString();
  return queryString
    ? `/admin/products/list/?${queryString}`
    : "/admin/products/list/";
};

export const productApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // products
    createProduct: builder.mutation({
      query: (body) => ({
        url: "/admin/products/create/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["products"],
    }),

    updateProduct: builder.mutation({
      query: ({ payload, productId }) => ({
        url: `/admin/products/update/${productId}/`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["products"],
    }),

    productList: builder.query({
      query: (params) => ({
        url: buildProductListUrl(params),
        method: "GET",
      }),
      providesTags: ["products"],
    }),

    productDetails: builder.query({
      query: (productId) => ({
        url: `/admin/products/${productId}/`,
        method: "GET",
      }),
    }),

    deleteProduct: builder.mutation({
      query: (productId) => ({
        url: `/admin/products/${productId}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["products"],
    }),

    // category
    createCategory: builder.mutation({
      query: (body) => ({
        url: "/admin/products/category/create/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["productSettings"],
    }),

    updateCategory: builder.mutation({
      query: ({ id, body }) => ({
        url: `/admin/products/category/update/${id}/`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["productSettings"],
    }),

    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `/admin/products/category/delete/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["productSettings"],
    }),

    // brand
    createBrand: builder.mutation({
      query: (body) => ({
        url: "/admin/products/brand/create/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["productSettings"],
    }),

    updateBrand: builder.mutation({
      query: ({ id, body }) => ({
        url: `/admin/products/brand/update/${id}/`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["productSettings"],
    }),

    deleteBrand: builder.mutation({
      query: (id) => ({
        url: `/admin/products/brand/delete/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["productSettings"],
    }),

    // size
    createSize: builder.mutation({
      query: (body) => ({
        url: "/admin/products/size/create/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["productSettings"],
    }),

    updateSize: builder.mutation({
      query: ({ id, body }) => ({
        url: `/admin/products/size/update/${id}/`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["productSettings"],
    }),

    deleteSize: builder.mutation({
      query: (id) => ({
        url: `/admin/products/size/delete/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["productSettings"],
    }),

    // color
    createColor: builder.mutation({
      query: (body) => ({
        url: "/admin/products/color/create/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["productSettings"],
    }),

    updateColor: builder.mutation({
      query: ({ id, body }) => ({
        url: `/admin/products/color/update/${id}/`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["productSettings"],
    }),

    deleteColor: builder.mutation({
      query: (id) => ({
        url: `/admin/products/color/delete/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["productSettings"],
    }),

    // collection
    createCollection: builder.mutation({
      query: (body) => ({
        url: "/admin/products/collection/create/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["productSettings"],
    }),

    updateCollection: builder.mutation({
      query: ({ id, body }) => ({
        url: `/admin/products/collection/update/${id}/`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["productSettings"],
    }),

    deleteCollection: builder.mutation({
      query: (id) => ({
        url: `/admin/products/collection/delete/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["productSettings"],
    }),

    collectionList: builder.query({
      query: () => ({
        url: "/admin/products/collection/list/",
        method: "GET",
      }),
      providesTags: ["productSettings"],
    }),

    // product create settings
    productSettings: builder.query({
      query: () => ({
        url: "/admin/products/settings/",
        method: "GET",
      }),
      providesTags: ["productSettings"],
    }),
  }),
});

export const {
  useProductListQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useProductDetailsQuery,
  useDeleteProductMutation,

  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useCreateBrandMutation,
  useUpdateBrandMutation,
  useDeleteBrandMutation,
  useCreateSizeMutation,
  useUpdateSizeMutation,
  useDeleteSizeMutation,
  useCreateColorMutation,
  useUpdateColorMutation,
  useDeleteColorMutation,
  useCreateCollectionMutation,
  useUpdateCollectionMutation,
  useDeleteCollectionMutation,
  useCollectionListQuery,

  useProductSettingsQuery,
} = productApiSlice;
