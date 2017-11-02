//@flow
import type { Currency } from "./datatypes";

// FIXME DEPRECATED, we will have currencies in the data store because they can evolve over time
console.warn("src/currencies.js is deprecated, use the data store currencies");

const currencies: Array<Currency> = global.CRYPTO_CURRENCIES || [];
if (currencies.length === 0) {
  console.error("No currencies available!");
}
export default currencies;
