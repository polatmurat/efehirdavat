
const exchangeRate = async (req, res) => {
    try {
        const USD_CONTAINER = await fetch('https://v6.exchangerate-api.com/v6/23de2a9f01f87c4b149d22f4/pair/USD/TRY');
        const EUR_CONTAINER = await fetch('https://v6.exchangerate-api.com/v6/23de2a9f01f87c4b149d22f4/pair/EUR/TRY');

        if (!(USD_CONTAINER.ok && EUR_CONTAINER.ok)) {
            return res.status(400).json({ data: 'error while exchange the rates.' });
        }

        const data_USD = await USD_CONTAINER.json();
        const data_EUR = await EUR_CONTAINER.json();
        const result = {
            USD_to_TRY: data_USD.conversion_rate.toFixed(2),
            EUR_to_TRY: data_EUR.conversion_rate.toFixed(2)
        };
        res.status(200).json(result);

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Exchange rate service failed' });
    }
};

export default exchangeRate;