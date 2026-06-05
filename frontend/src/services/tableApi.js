import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const tableApi = createApi({
  reducerPath: 'tableApi',
  baseQuery: fetchBaseQuery({
   baseUrl: 'https://pos-restaurant-backend-c9ow.onrender.com/api/tables',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Table'],
  endpoints: (builder) => ({
    getTables: builder.query({
      query: () => '/',
      providesTags: ['Table'],
    }),
    getTableById: builder.query({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: 'Table', id }],
    }),
    createTable: builder.mutation({
      query: (data) => ({
        url: '/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Table'],
    }),
    updateTable: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Table'],
    }),
    deleteTable: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Table'],
    }),
  }),
});

export const {
  useGetTablesQuery,
  useGetTableByIdQuery,
  useCreateTableMutation,
  useUpdateTableMutation,
  useDeleteTableMutation,
} = tableApi;
