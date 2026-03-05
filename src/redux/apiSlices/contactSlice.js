import { api } from "../api/baseApi";

export const contactApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // ---------------------------------------
    // GET ALL CONTACT MESSAGES
    // ---------------------------------------
    getContactMessages: builder.query({
      query: (queryParams = []) => {
        const params = new URLSearchParams();
        queryParams.forEach(({ name, value }) => {
          if (value !== undefined && value !== null) {
            params.append(name, value);
          }
        });
        return {
          url: `/contact/contact?${params.toString()}`,
          method: "GET",
        };
      },
      transformResponse: (response) => response,
      providesTags: ["ContactMessages"],
    }),

    // ---------------------------------------
    // GET SINGLE CONTACT MESSAGE
    // ---------------------------------------
    getContactMessageById: builder.query({
      query: (id) => ({
        url: `/contact/contact/${id}`,
        method: "GET",
      }),
      transformResponse: (response) => response,
      providesTags: (result, error, id) => [{ type: "ContactMessages", id }],
    }),

    // ---------------------------------------
    // DELETE CONTACT MESSAGE
    // ---------------------------------------
    deleteContactMessage: builder.mutation({
      query: (id) => ({
        url: `/contact/contact/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["ContactMessages"],
    }),
  }),
});

export const {
  useGetContactMessagesQuery,
  useGetContactMessageByIdQuery,
  useDeleteContactMessageMutation,
} = contactApi;
