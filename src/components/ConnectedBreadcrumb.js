// @flow

import React from "react";
import type { Location } from "react-router-dom";
import { Link } from "react-router-dom";
import { withRouter, matchPath } from "react-router";

import { Breadcrumb, BreadcrumbContainer } from "components/base/Breadcrumb";

type ConfigNode<T> = [
  string,
  React$Node | (T => React$Node),
  ?(ConfigNode<T>[]),
];

type Props<T> = {
  location: Location,
  prefix: string,
  config: ConfigNode<T>[],
  additionalProps?: T,
};

function ConnectedBreadcrumb<T>(props: Props<T>) {
  const { config, location, additionalProps, prefix } = props;

  const unwrap = node => {
    const { path: _path, render, children, exact } = node;
    const path = `${prefix}${_path}`;
    const isFn = typeof render === "function";
    const match = path ? matchPath(location.pathname, { path, exact }) : true;
    if (!match) return null;
    const content = isFn ? render({ match, ...additionalProps }) : render;
    let c;
    (children || []).find(node => (c = unwrap(node)));
    const link = match.url || path;
    return [{ key: path, content, link }, ...(c || [])];
  };

  const children = config
    // $FlowFixMe flow is lost
    .reduce((acc, node) => [...acc, ...unwrap(node)], [])
    .filter(Boolean)
    .map((el, i, arr) => {
      const isLast = !arr[i + 1];
      return isLast ? (
        <Breadcrumb key={el.key}>{el.content}</Breadcrumb>
      ) : (
        <Breadcrumb key={el.key} as={Link} to={el.link}>
          {el.content}
        </Breadcrumb>
      );
    });

  return <BreadcrumbContainer>{children}</BreadcrumbContainer>;
}

export default withRouter(ConnectedBreadcrumb);
