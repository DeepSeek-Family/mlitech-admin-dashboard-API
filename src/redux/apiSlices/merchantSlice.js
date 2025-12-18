import { api } from "../api/baseApi";

export const merchantApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // ---------------------------------------
    // GET merchant PROFILE
    // ---------------------------------------
    getMerchantProfile: builder.query({
      query: (args) => {
        const params = new URLSearchParams();
        if (args) {
          args.forEach((arg) => {
            params.append(arg.name, arg.value);
          });
        }
        return {
          url: `/admin/merchants?${params.toString()}`,
          method: "GET",
        };
      },
      transformResponse: (response) => response,
      providesTags: ["Merchant"],
    }),
    createMerchant: builder.mutation({
      query: (data) => ({
        url: "/usermanagement/merchant",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Merchant"],
    }),
    // ---------------------------------------
    // DELETE merchant
    // ---------------------------------------
    deleteMerchant: builder.mutation({
      query: (id) => ({
        url: `/admin/merchants/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Merchant"],
    }),
    // ---------------------------------------
    // UPDATE merchant approval status
    // ---------------------------------------
    updateMerchantApprovalStatus: builder.mutation({
      query: ({ id, approveStatus }) => ({
        url: `/admin/merchants/${id}`,
        method: "PATCH",
        body: { approveStatus },
      }),
      invalidatesTags: ["Merchant"],
    }),
    // ---------------------------------------
    // UPDATE merchant status (active/inactive)
    // ---------------------------------------
    updateMerchantStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/admin/merchants/status/${id}`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Merchant"],
    }),
  }),
});

export const {
  useGetMerchantProfileQuery,
  useCreateMerchantMutation,
  useDeleteMerchantMutation,
  useUpdateMerchantApprovalStatusMutation,
  useUpdateMerchantStatusMutation,
} = merchantApi;
