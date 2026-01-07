import { api } from "../api/baseApi";

export const salesRepApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // ---------------------------------------
    // GET Sales Rep data
    // ---------------------------------------
    getSalesRepData: builder.query({
      query: ({ page = 1, limit = 10 } = {}) => {
        const params = new URLSearchParams();
        params.append("page", page);
        params.append("limit", limit);

        return {
          url: `/sales-rep?${params.toString()}`,
          method: "GET",
        };
      },
      transformResponse: (response) => response,
      providesTags: ["SalesRep"],
    }),

    // ---------------------------------------
    // ACKNOWLEDGE - Mark referral as acknowledged
    // ---------------------------------------
    acknowledgeSalesRep: builder.mutation({
      query: (_id) => ({
        // url: `/sales-rep/acknowledge/users/${_id}`,
        url: `sales-rep/${_id}/acknowledge/`,
        method: "PATCH",
      }),
      invalidatesTags: ["SalesRep"],
    }),

    // ---------------------------------------
    // GENERATE TOKEN - Generate cash token for referral
    // ---------------------------------------
    generateSalesRepToken: builder.mutation({
      query: (_id) => ({
        // url: `/sales-rep/token/users/${customerId}`,
        url: `/sales-rep/${_id}/token`,
        method: "POST",
      }),
      invalidatesTags: ["SalesRep"],
    }),

    // ---------------------------------------
    // ACTIVATE USER ACCOUNT
    // ---------------------------------------
    activateUserAccount: builder.mutation({
      query: (id) => ({
        url: `/sales-rep/${id}/activate-account/`,
        method: "PATCH",
      }),
      invalidatesTags: ["SalesRep"],
    }),

    // ---------------------------------------
    // DEACTIVATE USER ACCOUNT
    // ---------------------------------------
    deactivateUserAccount: builder.mutation({
      query: (id) => ({
        url: `/sales-rep/${id}/deactivate-account/`,
        method: "PATCH",
      }),
      invalidatesTags: ["SalesRep"],
    }),
  }),
});

export const {
  useGetSalesRepDataQuery,
  useAcknowledgeSalesRepMutation,
  useGenerateSalesRepTokenMutation,
  useActivateUserAccountMutation,
  useDeactivateUserAccountMutation,
} = salesRepApi;
