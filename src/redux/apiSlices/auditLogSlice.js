import { api } from "../api/baseApi";

const auditLogSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    getAuditLogs: builder.query({
      query: ({ page = 1, limit = 10 }) => ({
        url: `/audit/audit-logs`,
        params: { page, limit },
      }),
      providesTags: ["AuditLog"],
    }),
  }),
});

export const { useGetAuditLogsQuery } = auditLogSlice;
