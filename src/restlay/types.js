// @flow

type SimpleDeserializer<T> = (T) => T;
type NestedDeserializer<T> = { [_: string]: SimpleDeserializer<T> };

export type Deserializer<T> = SimpleDeserializer<T> | NestedDeserializer<T>;
