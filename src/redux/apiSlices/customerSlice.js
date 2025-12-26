import { api } from "../api/baseApi";

export const customerApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // ---------------------------------------
    // GET customer PROFILE
    // ---------------------------------------
    getCustomerProfile: builder.query({
      query: (args) => {
        const params = new URLSearchParams();
        if (args) {
          args.forEach((arg) => {
            params.append(arg.name, arg.value);
          });
        }
        return {
          url: `/admin/customers?${params.toString()}`,
          method: "GET",
        };
      },
      transformResponse: (response) => response,
      providesTags: ["Customer"],
    }),
    // ---------------------------------------
    // DELETE customer
    // ---------------------------------------
    deleteCustomer: builder.mutation({
      query: (id) => ({
        url: `/admin/customers/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Customer"],
    }),
    // ---------------------------------------
    // TOGGLE customer STATUS
    // ---------------------------------------
    updateCustomerStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/admin/customers/${id}`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Customer"],
    }),
    // ----------------------------------------
    // EXPORT customers
    // ----------------------------------------
    exportCustomers: builder.query({
      query: (args) => {
        const params = new URLSearchParams();
        if (args && args.length > 0) {
          args.forEach((arg) => {
            if (
              arg.value !== undefined &&
              arg.value !== null &&
              arg.value !== ""
            ) {
              params.append(arg.name, arg.value);
            }
          });
        }
        return {
          url: `/admin/customers/export`,
          method: "GET",
          params,
          responseHandler: (response) => response.blob(),
        };
      },
      providesTags: ["Customer"],
    }),
  }),
});

export const {
  useGetCustomerProfileQuery,
  useDeleteCustomerMutation,
  useUpdateCustomerStatusMutation,
  useExportCustomersQuery,
  useLazyExportCustomersQuery,
} = customerApi;
