import { api } from "../api/baseApi";

const reportAnalyticsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    merchantReportAnalytics: builder.query({
      query: (args) => {
        const params = new URLSearchParams();
        if (args && args.length > 0) {
          args.forEach((arg) => {
            if (arg.value !== undefined && arg.value !== null && arg.value !== "") {
              params.append(arg.name, arg.value);
            }
          });
        }
        return {
          url: `/report-analytics/merchant`,
          method: "GET",
          params
        };
      },
      providesTags: ["ReportAnalytics"],
    }),
    customerReportAnalytics: builder.query({
      query: (args) => {
        const params = new URLSearchParams();
        if (args && args.length > 0) {
          args.forEach((arg) => {
            if (arg.value !== undefined && arg.value !== null && arg.value !== "") {
              params.append(arg.name, arg.value);
            }
          });
        }
        return {
          url: `/report-analytics/customer`,
          method: "GET",
          params
        };
      },
      providesTags: ["ReportAnalytics"],
    }),
  }),
});

export const { 
  useMerchantReportAnalyticsQuery, 
  useCustomerReportAnalyticsQuery 
} = reportAnalyticsApi;
