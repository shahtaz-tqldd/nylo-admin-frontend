import { apiSlice } from "../api/apiSlice";

export const storeApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // dashboard
    overview: builder.query({
      query: () => ({
        url: `/admin/shop/overview/`,
        method: "GET",
      }),
    }),

    // store config
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

    // legal content
    updateLegalContent: builder.mutation({
      query: ({ payload }) => ({
        url: `/admin/shop/legal-content/`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["legalContent"],
    }),

    legalContent: builder.query({
      query: () => ({
        url: `/shop/legal-content/`,
        method: "GET",
      }),
      providesTags: ["legalContent"],
    }),

    // about us
    updateAboutPageContent: builder.mutation({
      query: ({ payload }) => ({
        url: `/admin/shop/about-page/`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["aboutPageContent"],
    }),

    aboutPageContent: builder.query({
      query: () => ({
        url: `/shop/about-page/`,
        method: "GET",
      }),
      providesTags: ["aboutPageContent"],
    }),

    // faqs
    createFaqs: builder.mutation({
      query: ({ payload }) => ({
        url: `/admin/shop/faqs/create/`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["faqs"],
    }),

    faqList: builder.query({
      query: () => ({
        url: `/shop/faqs/`,
        method: "GET",
      }),
      providesTags: ["faqs"],
    }),

    updateFaq: builder.mutation({
      query: ({ payload, faqId }) => ({
        url: `/admin/shop/faqs/update/${faqId}/`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["faqs"],
    }),

    deleteFaq: builder.mutation({
      query: ({ faqId }) => ({
        url: `/admin/shop/faqs/delete/${faqId}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["faqs"],
    }),

    // analytics
    salesSummary: builder.query({
      query: () => ({
        url: `/admin/shop/sales-summary`,
        method: "GET",
      }),
    }),

    salesOverTime: builder.query({
      query: ({ dateFrom, dateTo } = {}) => ({
        url: `/admin/shop/sales-over-time`,
        method: "GET",
        params: {
          ...(dateFrom ? { date_from: dateFrom } : {}),
          ...(dateTo ? { date_to: dateTo } : {}),
        },
      }),
    }),

    salesByChannel: builder.query({
      query: () => ({
        url: `/admin/shop/sales-by-channel`,
        method: "GET",
      }),
    }),

    topPerformers: builder.query({
      query: () => ({
        url: `/admin/shop/top-performers`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useOverviewQuery,

  useStoreDetailsQuery,
  useUpdateStoreMutation,
  useLegalContentQuery,
  useUpdateLegalContentMutation,
  useAboutPageContentQuery,
  useUpdateAboutPageContentMutation,

  // faqs
  useFaqListQuery,
  useCreateFaqsMutation,
  useUpdateFaqMutation,
  useDeleteFaqMutation,

  // sales
  useSalesSummaryQuery,
  useSalesOverTimeQuery,
  useSalesByChannelQuery,
  useTopPerformersQuery,
} = storeApiSlice;
