//@flow
import type { Currency } from "./datatypes";
const currencies: Array<Currency> = global.CRYPTO_CURRENCIES || [];
if (currencies.length === 0) {
  console.error("No currencies available!");
}
export default currencies;
