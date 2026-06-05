import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const menuApi = createApi({
  reducerPath: 'menuApi',
  baseQuery: fetchBaseQuery({
   baseUrl: 'https://pos-restaurant-backend-c9ow.onrender.com/api/menu',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['MenuItem'],
  endpoints: (builder) => ({
    getMenuItems: builder.query({
      query: () => '/',
      providesTags: ['MenuItem'],
    }),
    getMenuItemById: builder.query({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: 'MenuItem', id }],
    }),
    createMenuItem: builder.mutation({
      query: (data) => ({
        url: '/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['MenuItem'],
    }),
    updateMenuItem: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['MenuItem'],
    }),
    deleteMenuItem: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['MenuItem'],
    }),
  }),
});

export const {
  useGetMenuItemsQuery,
  useGetMenuItemByIdQuery,
  useCreateMenuItemMutation,
  useUpdateMenuItemMutation,
  useDeleteMenuItemMutation,
} = menuApi;
