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
      query: (customerId) => ({
        url: `/sales-rep/acknowledge/users/${customerId}`,
        method: "PATCH",
      }),
      invalidatesTags: ["SalesRep"],
    }),

    // ---------------------------------------
    // GENERATE TOKEN - Generate cash token for referral
    // ---------------------------------------
    generateSalesRepToken: builder.mutation({
      query: (customerId) => ({
        url: `/sales-rep/token/users/${customerId}`,
        method: "POST",
      }),
      invalidatesTags: ["SalesRep"],
    }),

    // ---------------------------------------
    // UPDATE USER STATUS - Activate/Deactivate user
    // ---------------------------------------
    updateUserStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/admin/users/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["SalesRep"],
    }),
  }),
});

export const {
  useGetSalesRepDataQuery,
  useAcknowledgeSalesRepMutation,
  useGenerateSalesRepTokenMutation,
  useUpdateUserStatusMutation,
} = salesRepApi;
