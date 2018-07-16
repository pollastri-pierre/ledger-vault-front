//@flow
import schema from "data/schema";
import Query from "restlay/Query";
import type { Fiat } from "data/types";

type Input = *;
type Response = Fiat[];

export default class FiatCurrenciesQuery extends Query<Input, Response> {
  uri = "/fiat_currencies";
  cacheMaxAge = 60;
  responseSchema = [schema.Fiat];
}
