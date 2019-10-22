// @flow

import React from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import Absolute from "components/base/Absolute";

import colors from "shared/colors";

const DEFAULT_COLOR = colors.spinner;

const SIZES = {
  normal: 16,
};

type Size = $Keys<typeof SIZES>;

type Props = {
  size?: Size,
  color?: string,
};

export default function Spinner(props: Props) {
  const { size: sizeProp, color: colorProp } = props;
  const size = SIZES[sizeProp || "normal"];
  const color = colorProp || DEFAULT_COLOR;
  return (
    <div style={{ color }}>
      <CircularProgress size={size} color="inherit" />
    </div>
  );
}

export function SpinnerCentered(props: Props) {
  return (
    <Absolute top={0} left={0} right={0} bottom={0} center>
      <Spinner {...props} />
    </Absolute>
  );
}
