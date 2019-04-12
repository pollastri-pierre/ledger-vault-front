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
  focus: `${opacity(form.focus, 0.07)} 0 2px 5px 2px`,
  error: `${opacity(form.error, 0.1)} 0 2px 5px 2px`,
  warning: `${opacity(form.warning, 0.2)} 0 2px 5px 2px`,
};

form.shadow = formShadows;

const colors = {
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
  text: "#6f6f6f",
  textLight: "#aaaaaa",
  form,
};

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
