import { api } from "../api/baseApi";

export const privacyPolicyApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // ---------------------------------------
    // GET merchant privacy policy
    // ---------------------------------------
    getMerchantPrivacyPolicy: builder.query({
      query: () => ({
        url: `/disclaimers/merchant-privacy-policy`,
        method: "GET",
      }),
      transformResponse: (response) => response,
      providesTags: ["MerchantPrivacyPolicy"],
    }),
    // ---------------------------------------
    // GET customer privacy policy
    // ---------------------------------------
    getCustomerPrivacyPolicy: builder.query({
      query: () => ({
        url: `/disclaimers/customer-privacy-policy`,
        method: "GET",
      }),
      transformResponse: (response) => response,
      providesTags: ["CustomerPrivacyPolicy"],
    }),
    // ---------------------------------------
    // UPDATE privacy policy
    // ---------------------------------------
    updatePrivacyPolicy: builder.mutation({
      query: (body) => ({
        url: `/disclaimers`,
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, arg) => {
        if (arg.type === "merchant-privacy-policy") {
          return ["MerchantPrivacyPolicy"];
        } else if (arg.type === "customer-privacy-policy") {
          return ["CustomerPrivacyPolicy"];
        }
        return ["MerchantPrivacyPolicy", "CustomerPrivacyPolicy"];
      },
    }),
  }),
});

export const {
  useGetMerchantPrivacyPolicyQuery,
  useGetCustomerPrivacyPolicyQuery,
  useUpdatePrivacyPolicyMutation,
} = privacyPolicyApi;
