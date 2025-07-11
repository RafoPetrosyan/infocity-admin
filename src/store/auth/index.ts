import { axiosBaseQuery } from '@/store/customBaseQuery';
import {
  UsersResponse,
} from '@/store/auth/types';
import { createApi } from '@reduxjs/toolkit/query/react';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    getUsers: builder.query<UsersResponse, any>({
      query: (params) => ({
        url: `/user`,
        method: 'GET',
        params,
      }),
    }),

    signIn: builder.mutation<any, any>({
      query: (credentials) => ({
        url: `/users/sign-in`,
        method: 'POST',
        data: credentials,
      }),
    }),

  }),
});

export const {
  useLazyGetUsersQuery,
  useSignInMutation
} = authApi;
