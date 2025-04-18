import { useGetExchangeRatesQuery } from '../../store/services/exchangeRateService';

function ExchangeRate() {
    const { data, isLoading, isError } = useGetExchangeRatesQuery();

    if (isLoading) return <p>...</p>;
    if (isError) return <p>Döviz alınırken hata oluştu.</p>;

    return (
        <div className='-ml-3'>
            <p> USD: {data.USD},00 | EUR: {data.EUR},00</p>
        </div>
    )
}

export default ExchangeRate
