import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const homeProducts = createApi({
  reducerPath: "homeProducts",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_API_URL,
  }),
  endpoints: (builder) => {
    return {
      catProducts: builder.query({
        query: (params) => {
          return {
            url: `/cat-products/${params.categoryId}/${params.page}`,
            method: "GET",
          };
        },
      }),
      searchProducts: builder.query({
        query: (params) => {
          return {
            url: `/search-products/${params.keyword}/${params.page}`,
            method: "GET",
          };
        },
      }),
    };
  },
});
export const { useCatProductsQuery, useSearchProductsQuery } = homeProducts;
export default homeProducts;
