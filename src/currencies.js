const currencies = window.CRYPTO_CURRENCIES || [];
if (currencies.length === 0) {
  console.error('No currencies available!');
}
export default currencies;
