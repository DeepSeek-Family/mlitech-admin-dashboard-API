import { api } from "../api/baseApi";

export const termsAndConditionApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // ---------------------------------------
    // GET merchant terms and conditions
    // ---------------------------------------
    getMerchantTermsAndConditions: builder.query({
      query: () => ({
        url: `/disclaimers/merchant-terms-and-conditions`,
        method: "GET",
      }),
      transformResponse: (response) => response,
      providesTags: ["MerchantTermsAndConditions"],
    }),
    // ---------------------------------------
    // GET customer terms and conditions
    // ---------------------------------------
    getCustomerTermsAndConditions: builder.query({
      query: () => ({
        url: `/disclaimers/customer-terms-and-conditions`,
        method: "GET",
      }),
      transformResponse: (response) => response,
      providesTags: ["CustomerTermsAndConditions"],
    }),
    // ---------------------------------------
    // UPDATE terms and conditions
    // ---------------------------------------
    updateTermsAndConditions: builder.mutation({
      query: (body) => ({
        url: `/rule/terms-and-conditions`,
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, arg) => {
        if (arg.type === "merchant-terms-and-conditions") {
          return ["MerchantTermsAndConditions"];
        } else if (arg.type === "customer-terms-and-conditions") {
          return ["CustomerTermsAndConditions"];
        }
        return ["MerchantTermsAndConditions", "CustomerTermsAndConditions"];
      },
    }),
  }),
});

export const {
  useGetMerchantTermsAndConditionsQuery,
  useGetCustomerTermsAndConditionsQuery,
  useUpdateTermsAndConditionsMutation,
} = termsAndConditionApi;
