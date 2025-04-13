// services/exchangeRateService.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const exchangeRateService = createApi({
  reducerPath: 'exchangeRate',
  baseQuery: fetchBaseQuery({ baseUrl: process.env.REACT_APP_API_URL }),
  endpoints: (builder) => ({
    getExchangeRates: builder.query({
      query: () => '/exchange-rate',
    }),
  }),
});

export const { useGetExchangeRatesQuery } = exchangeRateService;
export default exchangeRateService;
