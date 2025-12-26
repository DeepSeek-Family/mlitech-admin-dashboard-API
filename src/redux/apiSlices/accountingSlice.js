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
    getPointsRedeemed: builder.query({
      query: (args) => {
        const params = new URLSearchParams();
        if (args) {
          args.forEach((arg) => {
            params.append(arg.name, arg.value);
          });
        }
        return {
          url: `/report-analytics/accountings/point-redeemed?${params.toString()}`,
          method: "GET",
        };
      },
      transformResponse: (response) => response,
      providesTags: ["PointsRedeemed"],
    }),
    exportPointsRedeemed: builder.query({
      query: (args) => {
        const params = new URLSearchParams();
        if (args) {
          args.forEach((arg) => {
            params.append(arg.name, arg.value);
          });
        }
        return {
          url: `/report-analytics/accountings/point-redeemed/export?${params.toString()}`,
          method: "GET",
          responseHandler: (response) => response.blob(),
        };
      },
      providesTags: ["PointsRedeemed"],
    }),
    exportRevenuePerUser: builder.query({
      query: (args) => {
        const params = new URLSearchParams();
        if (args) {
          args.forEach((arg) => {
            params.append(arg.name, arg.value);
          });
        }
        return {
          url: `/report-analytics/accountings/revenue-per-user/export?${params.toString()}`,
          method: "GET",
          responseHandler: (response) => response.blob(),
        };
      },
      providesTags: ["RevenuePerUser"],
    }),
    exportCashCollection: builder.query({
      query: (args) => {
        const params = new URLSearchParams();
        if (args) {
          args.forEach((arg) => {
            params.append(arg.name, arg.value);
          });
        }
        return {
          url: `/report-analytics/accountings/cash-collection/export?${params.toString()}`,
          method: "GET",
          responseHandler: (response) => response.blob(),
        };
      },
      providesTags: ["CashCollection"],
    }),
    getCashReceivable: builder.query({
      query: (args) => {
        const params = new URLSearchParams();
        if (args) {
          args.forEach((arg) => {
            params.append(arg.name, arg.value);
          });
        }
        return {
          url: `/report-analytics/accountings/cash-receivable?${params.toString()}`,
          method: "GET",
        };
      },
      transformResponse: (response) => response,
      providesTags: ["CashReceivable"],
    }),
    exportCashReceivable: builder.query({
      query: (args) => {
        const params = new URLSearchParams();
        if (args) {
          args.forEach((arg) => {
            params.append(arg.name, arg.value);
          });
        }
        return {
          url: `/report-analytics/accountings/cash-receivable/export?${params.toString()}`,
          method: "GET",
          responseHandler: (response) => response.blob(),
        };
      },
      providesTags: ["CashReceivable"],
    }),
  }),
});

export const { useGetCashCollectionQuery, useGetRevenuePerUserQuery, useGetPointsRedeemedQuery, useLazyExportPointsRedeemedQuery, useLazyExportRevenuePerUserQuery, useLazyExportCashCollectionQuery, useGetCashReceivableQuery, useLazyExportCashReceivableQuery } = accountingSlice;
