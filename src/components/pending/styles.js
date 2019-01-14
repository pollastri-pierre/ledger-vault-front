import colors from "../../shared/colors";

const styles = {
  base: {
    "& a": {
      textDecoration: "none"
    }
  },
  headerBlack: {
    fontSize: "22px",
    color: "#000",
    letterSpacing: "-.9px",
    lineHeight: "1.5"
  },
  header: {
    margin: "0",
    "& span:last-child": {
      float: "right"
    }
  },
  headerLight: {
    fontSize: "10px",
    fontWeight: "600",
    lineHeight: "3",
    textTransform: "uppercase",
    color: "#999",
    paddingBottom: "23px",
    borderBottom: "1px solid #eee"
  },
  row: {
    cursor: "pointer",
    display: "block",
    position: "relative",
    padding: "10px 0",
    "&:before": {
      transition: "all 100ms ease",
      width: 0,
      height: 28,
      background: colors.ocean,
      position: "absolute",
      content: '""',
      left: -40,
      top: "50%",
      marginTop: -14
    },
    "&:not(:last-child)": {
      borderBottom: "1px solid #eee"
    },
    "&:hover:before": {
      width: 5
    }
  },
  date: {
    fontSize: "10px",
    color: "#000",
    textTransform: "uppercase",
    fontWeight: "600",
    lineHeight: "2.3"
  },
  name: {
    float: "right",
    fontSize: "13px",
    color: "#000",
    lineHeight: "1.77"
  },
  status: {
    fontSize: "11px",
    color: "#999",
    lineHeight: "2.09"
  },
  currency: {
    float: "right",
    fontSize: "11px",
    color: "#999",
    textTransform: "uppercase",
    fontWeight: "600",
    lineHeight: "2.09",
    "&.center": {
      position: "absolute",
      left: "40%",
      top: "12px"
    }
  }
};

export default styles;
