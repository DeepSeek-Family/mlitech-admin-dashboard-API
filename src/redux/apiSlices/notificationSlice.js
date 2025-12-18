import { api } from "../api/baseApi";
import socketService from "../../components/common/socketService";


const notificationApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query({
      query: (args) => {
        const params = new URLSearchParams();
        if (args && args.length > 0) {
          args.forEach((arg) => {
            params.append(arg.name, arg.value);
          });
        }
        return {
          url: `/notifications`,
          method: "GET",
          params
        };
      },
      providesTags: ["Notifications"],
      async onCacheEntryAdded(arg, { updateCachedData, cacheDataLoaded, cacheEntryRemoved, dispatch }) {
        try {
          await cacheDataLoaded;
        } catch {}

        const userId = Array.isArray(arg)
          ? arg.find((x) => x?.name === "userId")?.value
          : undefined;

        if (!userId) {
          await cacheEntryRemoved;
          return;
        }

        socketService.connect(userId);

        const handler = (payload) => {
          updateCachedData((draft) => {
            const data = draft?.data || {};
            const list = Array.isArray(data.notifications) ? data.notifications : [];
            const incoming = payload?.notification || payload;
            if (incoming) {
              data.notifications = [incoming, ...list];
            } else {
              data.notifications = list;
            }
            const currentUnread = typeof data.unreadCount === "number" ? data.unreadCount : 0;
            data.unreadCount = currentUnread + 1;
            draft.data = data;
            if (draft.pagination && typeof draft.pagination.total === "number") {
              draft.pagination.total = draft.pagination.total + 1;
            }
          });

          dispatch(api.util.invalidateTags(["Notifications"]));
        };

        socketService.subscribeToUserNotifications(userId, handler);

        try {
          await cacheEntryRemoved;
        } finally {
          socketService.unsubscribeFromUserNotifications(userId, handler);
        }
      },
    }),
    readNotification: builder.mutation({
      query: () => ({
        url: `/notifications/read`,
        method: "PATCH",
      }),
      invalidatesTags: ["Notifications"],
    }),
  }),
});

export const { 
  useGetNotificationsQuery, 
  useReadNotificationMutation 
} = notificationApi;
