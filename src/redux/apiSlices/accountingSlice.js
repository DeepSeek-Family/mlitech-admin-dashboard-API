import { api } from "../api/baseApi";

const accountingSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    getCashCollection: builder.query({
      query: (args) => {
        const params = new URLSearchParams();
        if (args) {
          args.forEach((arg) => {
            params.append(arg.name, arg.value);
          });
        }
        return {
          url: `/report-analytics/accountings/cash-collection?${params.toString()}`,
          method: "GET",
        };
      },
      transformResponse: (response) => response,
      providesTags: ["CashCollection"],
    }),
    getRevenuePerUser: builder.query({
      query: (args) => {
        const params = new URLSearchParams();
        if (args) {
          args.forEach((arg) => {
            params.append(arg.name, arg.value);
          });
        }
        return {
          url: `/report-analytics/accountings/revenue-per-user?${params.toString()}`,
          method: "GET",
        };
      },
      transformResponse: (response) => response,
      providesTags: ["RevenuePerUser"],
    }),
  }),
});

export const { useGetCashCollectionQuery, useGetRevenuePerUserQuery } = accountingSlice;
