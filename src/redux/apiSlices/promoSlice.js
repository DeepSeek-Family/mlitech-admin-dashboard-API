import { api } from "../api/baseApi";

export const customerApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // ---------------------------------------
    // GET promo details
    // ---------------------------------------
    getPromoDetails: builder.query({
      query: (args) => {
        const params = new URLSearchParams();
        if (args) {
          args.forEach((arg) => {
            params.append(arg.name, arg.value);
          });
        }
        return {
          url: `/admin-promo?${params.toString()}`,
          method: "GET",
        };
      },
      transformResponse: (response) => response,
      providesTags: ["Promo"],
    }),

    // ---------------------------------------
    // PATCH toggle promo status
    // ---------------------------------------
    togglePromoStatus: builder.mutation({
      query: (id) => ({
        url: `/admin-promo/toggle/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Promo"],
    }),

    // ---------------------------------------
    // PATCH update promotion
    // ---------------------------------------
    updatePromotion: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/admin-promo/${id}`,
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: ["Promo"],
    }),

    // ---------------------------------------
    // POST create promotion
    // ---------------------------------------
    createPromotion: builder.mutation({
      query: (formData) => ({
        url: `/admin-promo`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Promo"],
    }),

    // ---------------------------------------
    // DELETE promotion
    // ---------------------------------------
    deletePromotion: builder.mutation({
      query: (id) => ({
        url: `/admin-promo/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Promo"],
    }),
  }),
});

export const {
  useGetPromoDetailsQuery,
  useTogglePromoStatusMutation,
  useUpdatePromotionMutation,
  useCreatePromotionMutation,
  useDeletePromotionMutation,
} = customerApi;
