// @flow

import React from "react";

type Props = {
  children: React$Node,
  onSubmit: Function,
};
export default function Form(props: Props) {
  const { children, onSubmit } = props;
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };
  return (
    <form onSubmit={handleSubmit}>
      {children}
      <input type="submit" style={{ display: "none" }} />
    </form>
  );
}
