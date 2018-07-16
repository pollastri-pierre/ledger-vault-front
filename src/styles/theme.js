import colors from "shared/colors";

const tickerBeforeStyle = {
  content: "''",
  cursor: "pointer",
  backgroundColor: "currentColor",
  width: 0,
  height: 26,
  display: "block",
  position: "absolute",
  bottom: "calc(50% - (26px / 2))",
  opacity: 1,
  transition: "width 0.2s ease"
};

const tickerActiveStyle = {
  opacity: 1,
  width: 5
};

const theme = {
  direction: "ltr",
  overrides: {
    MuiTabs: {
      root: {
        position: "relative",
        "&:after": {
          content: '""',
          height: "1px",
          width: "100%",
          background: colors.mouse,
          display: "block",
          position: "absolute",
          bottom: "0px",
          zIndex: "-1"
        }
      }
    },
    MuiTab: {
      label: {
        fontSize: "10px!important",
        fontWeight: "600"
      },
      root: {
        minWidth: "auto!important",
        marginRight: "23px",
        opacity: 0.4
      },
      disabled: {
        opacity: 0.2
      },
      labelContainer: {
        paddingLeft: "0!important",
        paddingRight: "0!important"
      }
    },
    MuiInput: {
      root: {
        fontSize: 13
      },
      underline: {
        "&:before": {
          borderBottom: "1px solid rgb(238, 238, 238)"
        },
        "&:after": {
          borderBottom: "2px solid rgb(202, 198, 198)"
        }
      }
    },
    MuiSelect: {
      select: {
        ".MuiSelect-disable-arrow &": {
          padding: "0 0 2px 0"
        },
        "&:focus": {
          backgroundColor: "transparent"
        }
      },
      icon: {
        ".MuiSelect-disable-arrow &": {
          display: "none"
        }
      }
    },
    MuiMenuItem: {
      root: {
        fontSize: 11,
        fontWeight: 600, // FIXME bad idea, this should be opt-in
        opacity: 0.5,
        "&:hover": {
          backgroundColor: "transparent",
          opacity: 1
        },
        "&:focus": {
          backgroundColor: "transparent",
          opacity: 1
        },
        ".MuiListItem-ticker-right &": {
          justifyContent: "flex-end"
        },
        "&$selected": {
          backgroundColor: "transparent",
          opacity: 1,
          "&:before": {
            ...tickerBeforeStyle,
            ...tickerActiveStyle,
            left: 0
          },
          ".MuiListItem-ticker-right &:before": {
            left: "auto",
            right: 0
          }
        }
      }
    },
    MuiListItem: {
      default: {
        paddingTop: 2,
        paddingBottom: 2
      },
      button: {
        "&:hover": {
          backgroundColor: "transparent"
        },
        "&:focus": {
          backgroundColor: "transparent",
          "&:before": {
            ...tickerBeforeStyle,
            ...tickerActiveStyle,
            left: 0
          },
          ".MuiListItem-ticker-right &:before": {
            left: "auto",
            right: 0
          }
        },
        "&:before": { ...tickerBeforeStyle, left: 0 },
        "&:hover:before": tickerActiveStyle,
        ".MuiListItem-ticker-right &:before": {
          left: "auto",
          right: 0
        }
      },
      gutters: {
        paddingLeft: 20,
        paddingRight: 20
      }
    },
    MuiPopover: {
      paper: {
        "& > ul": {
          overflowY: "auto",
          maxHeight: "inherit"
        },
        "&:before": {
          content: "''",
          position: "absolute",
          top: -12,
          background: "white",
          right: 20,
          width: "0",
          height: "0",
          border: "12px solid black",
          borderColor: "transparent transparent #ffffff #ffffff",
          transform: "rotate(-45deg)",
          boxShadow: "2px -3px 10px 0 rgba(0, 0, 0, 0.04)"
        },
        ".MuiPopover-triangle-left &:before": {
          left: 20,
          right: "auto"
        }
      }
    }
  },
  palette: {
    common: {
      black: "#000",
      white: "#fff",
      transparent: "rgba(0, 0, 0, 0)",
      fullBlack: "rgba(0, 0, 0, 1)",
      darkBlack: "rgba(0, 0, 0, 0.87)",
      lightBlack: "rgba(0, 0, 0, 0.2)",
      minBlack: "rgba(0, 0, 0, 0.26)",
      faintBlack: "rgba(0, 0, 0, 0.12)",
      fullWhite: "rgba(255, 255, 255, 1)",
      darkWhite: "rgba(255, 255, 255, 0.87)",
      lightWhite: "rgba(255, 255, 255, 0.54)"
    },
    type: "light",
    primary: {
      "50": "#e3f2fd",
      "100": "#bbdefb",
      "200": "#90caf9",
      "300": "#64b5f6",
      "400": "#42a5f5",
      "500": "#27d0e2",
      "600": "#1e88e5",
      "700": "#1976d2",
      "800": "#1565c0",
      "900": "#0d47a1",
      A100: "#82b1ff",
      A200: "#448aff",
      A400: "#2979ff",
      A700: "rgb(238, 238, 238)",
      contrastDefaultColor: "light"
    },
    secondary: {
      "50": "#fce4ec",
      "100": "#f8bbd0",
      "200": "#f48fb1",
      "300": "#f06292",
      "400": "#ec407a",
      "500": "#e91e63",
      "600": "#d81b60",
      "700": "#c2185b",
      "800": "#ad1457",
      "900": "#880e4f",
      A100: "#ff80ab",
      A200: "#27d0e2",
      A400: "#f50057",
      A700: "#c51162",
      contrastDefaultColor: "light"
    },
    error: {
      "50": "#ffebee",
      "100": "#ffcdd2",
      "200": "#ef9a9a",
      "300": "#e57373",
      "400": "#ef5350",
      "500": "#f44336",
      "600": "#e53935",
      "700": "#d32f2f",
      "800": "#c62828",
      "900": "#b71c1c",
      A100: "#ff8a80",
      A200: "#ff5252",
      A400: "#ff1744",
      A700: "#d50000",
      contrastDefaultColor: "light"
    },
    grey: {
      "50": "#fafafa",
      "100": "#f5f5f5",
      "200": "#eeeeee",
      "300": "#e0e0e0",
      "400": "#bdbdbd",
      "500": "#9e9e9e",
      "600": "#757575",
      "700": "#616161",
      "800": "#424242",
      "900": "#212121",
      A100: "#d5d5d5",
      A200: "#aaaaaa",
      A400: "red",
      A700: "#616161",
      contrastDefaultColor: "dark"
    },
    shades: {
      dark: {
        text: {
          primary: "rgba(255, 255, 255, 1)",
          secondary: "rgba(255, 255, 255, 0.7)",
          disabled: "rgba(255, 255, 255, 0.5)",
          hint: "rgba(255, 255, 255, 0.5)",
          icon: "rgba(255, 255, 255, 0.5)",
          divider: "rgba(255, 255, 255, 0.12)",
          lightDivider: "rgba(255, 255, 255, 0.075)"
        },
        input: {
          bottomLine: "rgba(255, 255, 255, 0.7)",
          helperText: "rgba(255, 255, 255, 0.7)",
          labelText: "rgba(255, 255, 255, 0.7)",
          inputText: "rgba(255, 255, 255, 1)",
          disabled: "rgba(255, 255, 255, 0.5)"
        },
        action: {
          active: "rgba(255, 255, 255, 1)",
          disabled: "rgba(255, 255, 255, 0.3)"
        },
        background: {
          default: "rgb(234, 46, 73)",
          paper: "#424242",
          appBar: "#212121",
          contentFrame: "#212121"
        },
        line: {
          stepper: "#bdbdbd"
        }
      },
      light: {
        text: {
          primary: "rgba(0, 0, 0, 0.87)",
          secondary: "rgba(0, 0, 0, 0.54)",
          disabled: "rgba(0, 0, 0, 0.38)",
          hint: "rgba(0, 0, 0, 0.38)",
          icon: "rgba(0, 0, 0, 0.38)",
          divider: "rgba(0, 0, 0, 0.12)",
          lightDivider: "rgba(0, 0, 0, 0.075)"
        },
        input: {
          bottomLine: "rgb(238, 238, 238)",
          helperText: "rgba(0, 0, 0, 0.54)",
          labelText: "rgba(0, 0, 0, 0.54)",
          inputText: "rgba(0, 0, 0, 0.87)",
          disabled: "rgba(0, 0, 0, 0.42)"
        },
        action: {
          active: "rgba(0, 0, 0, 0.54)",
          disabled: "rgba(0, 0, 0, 0.26)"
        },
        background: {
          default: "#fafafa",
          paper: "#fff",
          appBar: "#f5f5f5",
          contentFrame: "#eeeeee"
        },
        line: {
          stepper: "#bdbdbd"
        }
      }
    },
    text: {
      primary: "#d8d8d8",
      secondary: "rgba(0, 0, 0, 0.54)",
      disabled: "rgba(0, 0, 0, 0.38)",
      hint: "rgba(0, 0, 0, 0.38)",
      icon: "rgba(0, 0, 0, 0.38)",
      divider: "rgba(0, 0, 0, 0.12)",
      lightDivider: "rgba(0, 0, 0, 0.075)"
    },
    input: {
      bottomLine: "rgb(238, 238, 238)",
      helperText: "rgba(0, 0, 0, 0.54)",
      labelText: "rgba(0, 0, 0, 0.54)",
      inputText: "rgba(0, 0, 0, 0.87)",
      disabled: "rgb(238, 238, 238)"
    },
    action: {
      active: "rgba(0, 0, 0, 0.54)",
      disabled: "rgba(0, 0, 0, 0.26)"
    },
    background: {
      default: "#fafafa",
      paper: "#fff",
      appBar: "#f5f5f5",
      contentFrame: "#eeeeee"
    },
    line: {
      stepper: "#bdbdbd"
    }
  },
  typography: {
    fontFamily: "'Open Sans', Roboto', 'Helvetica', 'Arial', sans-serif",
    fontSize: 14,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    display4: {
      fontSize: "7rem",
      fontWeight: 300,
      fontFamily: "'Open Sans', Roboto', 'Helvetica', 'Arial', sans-serif",
      letterSpacing: "-.04em",
      lineHeight: "1.14286em",
      marginLeft: "-.06em",
      color: "rgba(0, 0, 0, 0.54)"
    },
    display3: {
      fontSize: "3.5rem",
      fontWeight: 400,
      fontFamily: "'Open Sans', Roboto', 'Helvetica', 'Arial', sans-serif",
      letterSpacing: "-.02em",
      lineHeight: "1.30357em",
      marginLeft: "-.04em",
      color: "rgba(0, 0, 0, 0.54)"
    },
    display2: {
      fontSize: "2.8125rem",
      fontWeight: 400,
      fontFamily: "'Open Sans', Roboto', 'Helvetica', 'Arial', sans-serif",
      lineHeight: "1.06667em",
      marginLeft: "-.04em",
      color: "rgba(0, 0, 0, 0.54)"
    },
    display1: {
      fontSize: "2.125rem",
      fontWeight: 400,
      fontFamily: "'Open Sans', Roboto', 'Helvetica', 'Arial', sans-serif",
      lineHeight: "1.20588em",
      marginLeft: "-.04em",
      color: "rgba(0, 0, 0, 0.54)"
    },
    headline: {
      fontSize: "1.5rem",
      fontWeight: 400,
      fontFamily: "'Open Sans', Roboto', 'Helvetica', 'Arial', sans-serif",
      lineHeight: "1.35417em",
      color: "rgba(0, 0, 0, 0.87)"
    },
    title: {
      fontSize: "1.3125rem",
      fontWeight: 500,
      fontFamily: "'Open Sans', Roboto', 'Helvetica', 'Arial', sans-serif",
      lineHeight: "1.16667em",
      color: "rgba(0, 0, 0, 0.87)"
    },
    subheading: {
      fontSize: "1rem",
      fontWeight: 400,
      fontFamily: "'Open Sans', Roboto', 'Helvetica', 'Arial', sans-serif",
      lineHeight: "1.5em",
      color: "rgba(0, 0, 0, 0.87)"
    },
    body2: {
      fontSize: "0.875rem",
      fontWeight: 500,
      fontFamily: "'Open Sans', Roboto', 'Helvetica', 'Arial', sans-serif",
      lineHeight: "1.71429em",
      color: "rgba(0, 0, 0, 0.87)"
    },
    body1: {
      fontSize: "0.875rem",
      fontWeight: 400,
      fontFamily: "'Open Sans', Roboto', 'Helvetica', 'Arial', sans-serif",
      lineHeight: "1.46429em",
      color: "rgba(0, 0, 0, 0.87)"
    },
    caption: {
      fontSize: "0.75rem",
      fontWeight: 400,
      fontFamily: "'Open Sans', Roboto', 'Helvetica', 'Arial', sans-serif",
      lineHeight: "1.375em",
      color: "rgba(0, 0, 0, 0.54)"
    },
    button: {
      fontSize: "0.875rem",
      textTransform: "uppercase",
      fontFamily: "'Open Sans', Roboto', 'Helvetica', 'Arial', sans-serif",
      fontWeight: 500
    }
  },
  mixins: {
    toolbar: {
      minHeight: 56,
      "@media (min-width:0px) and (orientation: landscape)": {
        minHeight: 48
      },
      "@media (min-width:600px)": {
        minHeight: 64
      }
    }
  },
  breakpoints: {
    keys: ["xs", "sm", "md", "lg", "xl"],
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920
    }
  },
  shadows: [
    "none",
    "0px 1px 3px 0px rgba(0, 0, 0, 0.04),0px 1px 1px 0px rgba(0, 0, 0, 0.04),0px 2px 1px -1px rgba(0, 0, 0, 0.04)",
    "0px 1px 5px 0px rgba(0, 0, 0, 0.04),0px 2px 2px 0px rgba(0, 0, 0, 0.04),0px 3px 1px -2px rgba(0, 0, 0, 0.04)",
    "0px 1px 8px 0px rgba(0, 0, 0, 0.04),0px 3px 4px 0px rgba(0, 0, 0, 0.04),0px 3px 3px -2px rgba(0, 0, 0, 0.04)",
    "0px 2px 4px -1px rgba(0, 0, 0, 0.04),0px 4px 5px 0px rgba(0, 0, 0, 0.04),0px 1px 10px 0px rgba(0, 0, 0, 0.04)",
    "0px 3px 5px -1px rgba(0, 0, 0, 0.04),0px 5px 8px 0px rgba(0, 0, 0, 0.04),0px 1px 14px 0px rgba(0, 0, 0, 0.04)",
    "0px 3px 5px -1px rgba(0, 0, 0, 0.04),0px 6px 10px 0px rgba(0, 0, 0, 0.04),0px 1px 18px 0px rgba(0, 0, 0, 0.04)",
    "0px 4px 5px -2px rgba(0, 0, 0, 0.04),0px 7px 10px 1px rgba(0, 0, 0, 0.04),0px 2px 16px 1px rgba(0, 0, 0, 0.04)",
    "0px 5px 5px -3px rgba(0, 0, 0, 0.04),0px 8px 10px 1px rgba(0, 0, 0, 0.04),0px 3px 14px 2px rgba(0, 0, 0, 0.04)",
    "0px 5px 6px -3px rgba(0, 0, 0, 0.04),0px 9px 12px 1px rgba(0, 0, 0, 0.04),0px 3px 16px 2px rgba(0, 0, 0, 0.04)",
    "0px 6px 6px -3px rgba(0, 0, 0, 0.04),0px 10px 14px 1px rgba(0, 0, 0, 0.04),0px 4px 18px 3px rgba(0, 0, 0, 0.04)",
    "0px 6px 7px -4px rgba(0, 0, 0, 0.04),0px 11px 15px 1px rgba(0, 0, 0, 0.04),0px 4px 20px 3px rgba(0, 0, 0, 0.04)",
    "0px 7px 8px -4px rgba(0, 0, 0, 0.04),0px 12px 17px 2px rgba(0, 0, 0, 0.04),0px 5px 22px 4px rgba(0, 0, 0, 0.04)",
    "0px 7px 8px -4px rgba(0, 0, 0, 0.04),0px 13px 19px 2px rgba(0, 0, 0, 0.04),0px 5px 24px 4px rgba(0, 0, 0, 0.04)",
    "0px 7px 9px -4px rgba(0, 0, 0, 0.04),0px 14px 21px 2px rgba(0, 0, 0, 0.04),0px 5px 26px 4px rgba(0, 0, 0, 0.04)",
    "0px 8px 9px -5px rgba(0, 0, 0, 0.04),0px 15px 22px 2px rgba(0, 0, 0, 0.04),0px 6px 28px 5px rgba(0, 0, 0, 0.04)",
    "0px 8px 10px -5px rgba(0, 0, 0, 0.04),0px 16px 24px 2px rgba(0, 0, 0, 0.04),0px 6px 30px 5px rgba(0, 0, 0, 0.04)",
    "0px 8px 11px -5px rgba(0, 0, 0, 0.04),0px 17px 26px 2px rgba(0, 0, 0, 0.04),0px 6px 32px 5px rgba(0, 0, 0, 0.04)",
    "0px 9px 11px -5px rgba(0, 0, 0, 0.04),0px 18px 28px 2px rgba(0, 0, 0, 0.04),0px 7px 34px 6px rgba(0, 0, 0, 0.04)",
    "0px 9px 12px -6px rgba(0, 0, 0, 0.04),0px 19px 29px 2px rgba(0, 0, 0, 0.04),0px 7px 36px 6px rgba(0, 0, 0, 0.04)",
    "0px 10px 13px -6px rgba(0, 0, 0, 0.04),0px 20px 31px 3px rgba(0, 0, 0, 0.04),0px 8px 38px 7px rgba(0, 0, 0, 0.04)",
    "0px 10px 13px -6px rgba(0, 0, 0, 0.04),0px 21px 33px 3px rgba(0, 0, 0, 0.04),0px 8px 40px 7px rgba(0, 0, 0, 0.04)",
    "0px 10px 14px -6px rgba(0, 0, 0, 0.04),0px 22px 35px 3px rgba(0, 0, 0, 0.04),0px 8px 42px 7px rgba(0, 0, 0, 0.04)",
    "0px 11px 14px -7px rgba(0, 0, 0, 0.04),0px 23px 36px 3px rgba(0, 0, 0, 0.04),0px 9px 44px 8px rgba(0, 0, 0, 0.04)",
    "0px 11px 15px -7px rgba(0, 0, 0, 0.04),0px 24px 38px 3px rgba(0, 0, 0, 0.04),0px 9px 46px 8px rgba(0, 0, 0, 0.04)"
  ],
  transitions: {
    easing: {
      easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
      easeOut: "cubic-bezier(0.0, 0, 0.2, 1)",
      easeIn: "cubic-bezier(0.4, 0, 1, 1)",
      sharp: "cubic-bezier(0.4, 0, 0.6, 1)"
    },
    duration: {
      shortest: 150,
      shorter: 200,
      short: 250,
      standard: 300,
      complex: 375,
      enteringScreen: 225,
      leavingScreen: 195
    }
  },
  spacing: {
    unit: 8
  },
  zIndex: {
    mobileStepper: 900,
    menu: 1000,
    appBar: 1100,
    drawerOverlay: 1200,
    navDrawer: 1300,
    dialogOverlay: 1400,
    dialog: 1500,
    layer: 2000,
    popover: 2100,
    snackbar: 2900,
    tooltip: 3000
  }
};

export default theme;
