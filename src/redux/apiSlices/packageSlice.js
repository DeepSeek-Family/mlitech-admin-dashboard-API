import { api } from "../api/baseApi";

export const PackagesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // ---------------------------------------
    // GET package details
    // ---------------------------------------
    getPackages: builder.query({
      query: (args) => {
        const params = new URLSearchParams();
        if (args) {
          args.forEach((arg) => {
            params.append(arg.name, arg.value);
          });
        }
        return {
          url: `/package?${params.toString()}`,
          method: "GET",
        };
      },
      transformResponse: (response) => response,
      providesTags: ["Package"],
    }),
    // ---------------------------------------
    // CREATE package
    // ---------------------------------------
    createPackage: builder.mutation({
      query: (data) => ({
        url: `/package`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Package"],
    }),
    // ---------------------------------------
    // UPDATE package
    // ---------------------------------------
    updatePackage: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/package/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Package"],
    }),
    // ---------------------------------------
    // TOGGLE package status
    // ---------------------------------------
    togglePackageStatus: builder.mutation({
      query: (id) => ({
        url: `/package/toggle/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Package"],
    }),
  }),
});

export const {
  useGetPackagesQuery,
  useCreatePackageMutation,
  useUpdatePackageMutation,
  useTogglePackageStatusMutation,
} = PackagesApi;
