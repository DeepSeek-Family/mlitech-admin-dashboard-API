import { api } from "../api/baseApi";

export const PushNotificationApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createPushNotification: builder.mutation({
      query: (data) => ({
        url: `/push-notification/admin/notify`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["PushNotification"],
    }),
  }),
});

export const { useCreatePushNotificationMutation } = PushNotificationApi;
