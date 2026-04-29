import { api } from "../api/baseApi";

export const homeApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // ---------------------------------------
    // GET LineChart Data
    // ---------------------------------------
    getLineChartData: builder.query({
      query: (args) => {
        const params = new URLSearchParams();
        if (args) {
          args.forEach((arg) => {
            params.append(arg.name, arg.value);
          });
        }
        return {
          url: `/overview/total-revenue?${params.toString()}`,
          method: "GET",
        };
      },
      transformResponse: (response) => response,
      providesTags: ["Statistics"],
    }),
    // ---------------------------------------
    // GET Statistics Data
    // ---------------------------------------
    getStatisticsData: builder.query({
      query: (args) => {
        const params = new URLSearchParams();
        if (args) {
          args.forEach((arg) => {
            params.append(arg.name, arg.value);
          });
        }
        return {
          url: `/overview/admin-statistics?${params.toString()}`,
          method: "GET",
        };
      },
      transformResponse: (response) => response,
      providesTags: ["Statistics"],
    }),
    // ---------------------------------------
    // GET Yearly Revenue Data
    // ---------------------------------------
    getYearlyRevenueData: builder.query({
      query: (args) => {
        const params = new URLSearchParams();
        if (args) {
          args.forEach((arg) => {
            params.append(arg.name, arg.value);
          });
        }
        return {
          url: `/overview/yearly-revenue?${params.toString()}`,
          method: "GET",
        };
      },
      transformResponse: (response) => response,
      providesTags: ["Statistics"],
    }),
  }),
});

export const { useGetStatisticsDataQuery, useGetLineChartDataQuery, useGetYearlyRevenueDataQuery } = homeApi;
