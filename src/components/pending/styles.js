import colors from "../../shared/colors";

const styles = {
  base: {
    "& a": {
      textDecoration: "none"
    }
  },
  headerBlack: {
    fontSize: 22,
    color: colors.black,
    letterSpacing: "-.9px",
    lineHeight: 1.5
  },
  header: {
    margin: 0,
    "& span:last-child": {
      float: "right"
    }
  },
  headerLight: {
    fontSize: 10,
    fontWeight: "600",
    lineHeight: 3,
    textTransform: "uppercase",
    color: colors.lead,
    paddingBottom: 23,
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
  dateContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  date: {
    fontSize: 10,
    color: colors.black,
    textTransform: "uppercase",
    fontWeight: "600",
    lineHeight: 2.3
  },
  name: {
    color: colors.black
  },
  status: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 11,
    color: colors.lead,
    lineHeight: 2.09
  },
  currency: {
    color: colors.lead,
    textTransform: "uppercase",
    fontWeight: "600"
  },
  operationDetailsContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between"
  }
};

export default styles;
