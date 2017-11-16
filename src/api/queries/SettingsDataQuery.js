//@flow
import Query from "../../restlay/Query";

type Input = void;
export type Response = {
  blockchainExplorers: Array<{
    id: string // e.g. blockchain.info
    // FIXME not sure if we should have more fields like a label/name
  }>,
  countervalueSources: Array<{
    id: string, // e.g. kraken
    fiats: Array<string> // e.g. ["EUR", "USD"]
  }>
};

export default class SettingsDataQuery extends Query<Input, Response> {
  uri = "/settings-data";
}
