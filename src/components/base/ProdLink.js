// @flow
import React from "react";
import { Link } from "react-router-dom";

type Props = {
  to: string,
  children: React$Node,
};

const ProdLink = (props: Props) => {
  if (process.env.NODE_ENV === "production") {
    const onClick = () => {
      window.location.href = props.to;
    };
    return <span onClick={onClick}>{props.children}</span>;
  }
  return <Link {...props} />;
};

export default ProdLink;
