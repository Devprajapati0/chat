import {createApi,fetchBaseQuery} from '@reduxjs/toolkit/query/react';

const api = createApi({
    reducerPath:'api',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:8000/api/v1/',
    }),
    tagTypes:['chat','message'],
    endpoints: (builder) => ({
        myChats: builder.query({
            query: () => ({
                url: 'chat/get-my-chats',
                credentials:"include",
                method: 'GET',
               
            }),
            providesTags: ['chat'],
        }),

        getMessages:builder.query({
            query:({chatId,page}) => ({
                
                url: `message/${chatId}?page=${page}`,
                credentials:"include",
                method: 'GET',
            }),
            keepUnusedDataFor: 0,
        }),

        sendAttachments: builder.mutation({
           query:(data) => ({
                url: 'message/send',
                method: 'POST',
                body: data,
                credentials:"include",
            }),
            invalidatesTags: ['message'],
           }),
           getSenderId: builder.query({
            query: (id) => ({
                url: `chat/${id}`,
                credentials:"include",
                method: 'GET',
            }),
            providesTags: ['chat'],

        }),

        getPublicKey: builder.query({
            query: (data) => ({
                url: 'user/public-key',
                credentials:"include",
                method: 'GET',
                body: data,
            }),
            providesTags: ['chat'],
        }),
           

        }),

       
        
 })

export const {useSendAttachmentsMutation, useMyChatsQuery,useGetMessagesQuery,useGetSenderIdQuery,getPublicKey } = api;
export default api;