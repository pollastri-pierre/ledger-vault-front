// @flow

import type { ObjectParameters, ObjectParameter } from "query-string";

export type QueryUpdater = ObjectParameters => ObjectParameters;

export type FieldProps = {
  queryParams: ObjectParameters,
  updateQueryParams: (
    string | QueryUpdater,
    ?ObjectParameter | ?$ReadOnlyArray<ObjectParameter>,
  ) => void,
};

export type FieldsGroupProps = {
  queryParams: ObjectParameters,
  onChange: ObjectParameters => void,
};
