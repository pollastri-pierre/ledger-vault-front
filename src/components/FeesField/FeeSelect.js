// @flow

import React from "react";

import type { Speed } from "api/queries/AccountCalculateFeeQuery";
import Select from "components/base/Select";

const options = [
  { key: "slow", title: "Slow (1 hour)" },
  { key: "normal", title: "Medium (30 minutes)" },
  { key: "fast", title: "Fast (10 minutes)" },
].map(f => ({ label: f.title, value: f.key, data: f }));

type Props = {
  value: Speed,
  onChange: Speed => void,
};

type Option = {
  label: string,
  value: Speed,
};

export default (props: Props) => {
  const { value, onChange } = props;
  const option = options.find(o => o.value === value);
  const handleChange = (option: ?Option) => option && onChange(option.value);
  return <Select value={option} options={options} onChange={handleChange} />;
};
