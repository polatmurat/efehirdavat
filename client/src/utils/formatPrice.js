export const formatPrice = (price, currency) => {
    const formattedPrice = parseFloat(price).toFixed(2); // Fiyatı iki ondalıklı hale getir
    const priceWithoutDecimal = parseFloat(price); // Ondalıklı olmayan fiyatı al

    // Eğer fiyat ondalıklı değilse ",00" ekleyelim, ondalıklı ise , ile ayıralım
    const formatted = formattedPrice.includes('.00') ? priceWithoutDecimal.toLocaleString('tr-TR') + ',00' : formattedPrice.replace('.', ',');

    if (currency === 'TL') {
        return `${formatted} ₺`;
    } else if (currency === 'USD') {
        return `${formatted} $`;
    } else {
        return `${formatted} €`;
    }
};