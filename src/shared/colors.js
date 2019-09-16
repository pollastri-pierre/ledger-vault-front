import color from "color";

const form = {
  border: "#e9e9e9",
  focus: "#1ea7fd",
  error: "#ea2e49",
  warning: "#ffac22",
  placeholder: "#d0d0d0",
  bg: "#fafafa",
};

const formShadows = {
  grey: `rgba(0, 0, 0, 0.02) 0 2px 5px 2px`,
  focus: `${opacity(form.focus, 0.07)} 0 2px 5px 2px`,
  error: `${opacity(form.error, 0.1)} 0 2px 5px 2px`,
  warning: `${opacity(form.warning, 0.2)} 0 2px 5px 2px`,
};

form.shadow = formShadows;

const colors = {
  spinner: "hsl(0, 0%, 60%)",
  night: "#1d2028",
  mouse: "#e2e2e2",
  green: "rgb(102, 190, 84)",
  ocean: "#27d0e2",
  grenade: "#ea2e49",
  argile: "#eeeeee",
  lightGrey: "#d8d8d8",
  mediumGrey: "#bbbbbb",
  shark: "#666666",
  steel: "#767676",
  lead: "#999999",
  pearl: "#f4f4f4",
  cream: "#f9f9f9",
  white: "#ffffff",
  black: "#000000",
  light_orange: "#ffa726",
  blue: "#1ea7fd",
  blue_orange: "#ffd384",
  blue_red: "#ea2e497d",
  blue_green: "#078e0791",
  warning: "#ffa100",
  warningButton: "#ffc3cb",
  translucentGreen: "rgba(102, 190, 84, 0.2)",
  translucentGrey: "rgba(153, 153, 153, 0.2)",
  translucentOcean: "rgb(39, 208, 226, 0.2)",
  translucentGrenade: "rgb(234, 46, 73, 0.1)",

  // NEW COLORS
  bgHover: opacity("#1ea7fd", 0.03),
  bgActive: opacity("#1ea7fd", 0.06),
  text: "#6f6f6f",
  textLight: "#aaaaaa",
  form,

  // LEGACY
  legacyLightBlue: "#27d0e280",
  legacyLightBlue2: "rgba(39, 208, 226, 0.04)",
  legacyGreen: "#0ce4bf",
  legacyLightBlue3: "#f3fbff",
  legacyBlue: "#18909c",
  legacyGrey: "#cccccc",
  legacyLightGrey1: "#f0f0f0",
  legacyLightGrey2: "#efefef",
  legacyLightGrey3: "#777",
  legacyLightGrey4: "#fbfbfb",
  legacyLightGrey5: "#f5f5f5",
  legacyLightGrey6: "#eae9e9",
  legacyLightGrey7: "#ddd",
  legacyLightGrey8: "#e5e5e5",
  legacyLightGrey9: "hsl(0, 0%, 90%)",
  legacyLightGrey10: "hsl(0, 0%, 95%)",
  legacyLightGrey11: "#eceaea",
  legacyLightGrey12: "rgba(0, 0, 0, 0.15)",
  legacyDarkGrey1: "#333",
  legacyDarkGrey2: "#888",
  legacyDarkGrey3: "#555",
  legacyDarkGrey4: "#444",
  legacyDarkGrey5: "hsl(0, 0%, 40%)",
  legacyDarkGrey6: "rgba(0, 0, 0, 0.7)",
  legacyTranslucentGrey1: "rgba(0, 0, 0, 0.07)",
  legacyTranslucentGrey2: "rgba(0, 0, 0, 0.2)",
  legacyTranslucentGrey3: "rgba(0, 0, 0, 0.1)",
  legacyTranslucentGrey4: "rgba(0, 0, 0, 0.05)",
  legacyTranslucentGrey5: "rgba(0, 0, 0, 0.3)",
  legacyTranslucentGrey6: "rgba(0, 0, 0, 0.03)",
  legacyTranslucentGrey7: "rgba(0, 0, 0, 0.04)",
  legacyTranslucentGrey8: "rgba(0, 0, 0, 0.02)",
  legacyTranslucentGrenade: "#ea2e492b",
  legacyGrenade: "#b14656",
  legacyViolet: "#777799",
};

const toast = {
  info: {
    fg: opacity(colors.blue, 0.7),
    bg: lighten(colors.blue, 0.77),
  },
  success: {
    fg: opacity(colors.green, 0.7),
    bg: lighten(colors.green, 0.82),
  },
  warning: {
    fg: darken(colors.warning, 0.05),
    bg: lighten(colors.warning, 0.97),
  },
  error: {
    fg: opacity(colors.grenade, 0.7),
    bg: lighten(colors.grenade, 0.8),
  },
};

colors.toast = toast;

function opacity(c, op) {
  return color(c)
    .alpha(op)
    .string();
}

function darken(c, n) {
  return color(c)
    .darken(n)
    .string();
}

function lighten(c, n) {
  return color(c)
    .lighten(n)
    .string();
}

export { colors as default, opacity, darken, lighten };
