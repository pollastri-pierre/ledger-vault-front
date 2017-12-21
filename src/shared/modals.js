import colors from "./colors";
const header = {
  marginBottom: "35px",
  "& > h2": {
    fontSize: "18px",
    letterSpacing: "-0.4px",
    fontWeight: "normal",
    margin: "0",
    marginBottom: "20px"
  }
};
const modals = {
  base: {
    padding: "40px",
    position: "relative",
    "& > header": header,
    "& .footer": {
      position: "absolute",
      bottom: "0",
      left: "0",
      width: "100%",
      padding: "0 40px 0 40px"
    }
  },
  small: {
    padding: "38px",
    position: "relative",
    "& > header": header
  }
};

export default modals;
