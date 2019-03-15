const header = {
  marginBottom: 30,
  "& > h2": {
    fontSize: 18,
    letterSpacing: "-0.4px",
    fontWeight: "normal",
    margin: 0,
    marginBottom: 20,
  },
};
const modals = {
  base: {
    padding: 40,
    "& > header": header,
    "& .footer": {
      position: "absolute",
      bottom: 0,
      left: 0,
      width: "100%",
      padding: "0 40px 0 40px",
    },
  },
  small: {
    padding: 38,
    position: "relative",
    "& > header": header,
  },
};

export default modals;
