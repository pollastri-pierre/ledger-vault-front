// @flow
import colors from "./colors";

const common = {
  list: {
    listStyleType: "none",
    margin: "0",
    padding: "0"
  },
  blueLink: {
    textTransform: "uppercase",
    textDecoration: "none",
    color: colors.ocean
  }
};

export function mixinHoverSelected(color: string, left: string) {
  return {
    position: "relative",
    opacity: "0.5",
    "&:before": {
      content: '""',
      backgroundColor: color,
      width: "5px",
      height: "26px",
      display: "block",
      position: "absolute",
      left,
      opacity: "0",
      bottom: "calc(50% - 13px)",
      transition: "opacity .2s ease"
    },
    "&:hover": {
      opacity: "1"
    },
    "&.active:before": {
      opacity: "1"
    },
    "&:hover:before, &.active": {
      opacity: "1"
    }
  };
}
export default common;
