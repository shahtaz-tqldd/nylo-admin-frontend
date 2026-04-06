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
    ? `/products/admin/list/?${queryString}`
    : "/products/admin/list/";
};

export const productApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // products
    createProduct: builder.mutation({
      query: (body) => ({
        url: "/products/admin/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["products"],
    }),

    updateProduct: builder.mutation({
      query: ({ payload, productId }) => ({
        url: `/products/admin/${productId}/`,
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
        url: `/products/admin/${productId}/`,
        method: "GET",
      }),
    }),

    deleteProduct: builder.mutation({
      query: (productId) => ({
        url: `/products/admin/${productId}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["products"],
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

    updateCategory: builder.mutation({
      query: ({ id, body }) => ({
        url: `/products/admin/category/${id}/`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["productSettings"],
    }),

    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `/products/admin/category/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["productSettings"],
    }),

    // brand
    createBrand: builder.mutation({
      query: (body) => ({
        url: "/products/admin/brand/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["productSettings"],
    }),

    updateBrand: builder.mutation({
      query: ({ id, body }) => ({
        url: `/products/admin/brand/${id}/`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["productSettings"],
    }),

    deleteBrand: builder.mutation({
      query: (id) => ({
        url: `/products/admin/brand/${id}/`,
        method: "DELETE",
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

    updateSize: builder.mutation({
      query: ({ id, body }) => ({
        url: `/products/admin/size/${id}/`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["productSettings"],
    }),

    deleteSize: builder.mutation({
      query: (id) => ({
        url: `/products/admin/size/${id}/`,
        method: "DELETE",
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

    updateColor: builder.mutation({
      query: ({ id, body }) => ({
        url: `/products/admin/color/${id}/`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["productSettings"],
    }),

    deleteColor: builder.mutation({
      query: (id) => ({
        url: `/products/admin/color/${id}/`,
        method: "DELETE",
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

    updateCollection: builder.mutation({
      query: ({ id, body }) => ({
        url: `/products/admin/collection/${id}/`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["productSettings"],
    }),

    deleteCollection: builder.mutation({
      query: (id) => ({
        url: `/products/admin/collection/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["productSettings"],
    }),

    collectionList: builder.query({
      query: () => ({
        url: "/products/admin/collection/list/",
        method: "GET",
      }),
      providesTags: ["productSettings"],
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
