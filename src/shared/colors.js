const colors = {
  night: "#1d2028",
  mouse: "#e2e2e2",
  green: "rgb(102, 190, 84)",
  ocean: "#27d0e2",
  grenade: "#ea2e49",
  argile: "#eeeeee",
  lightGrey: "#d8d8d8",
  shark: "#666666",
  steel: "#767676",
  lead: "#999999",
  pearl: "#f4f4f4",
  cream: "#f9f9f9",
  white: "#ffffff",
  black: "#000000",
  blue_orange: "#ffd384",
  blue_red: "#ea2e497d",
  blue_green: "#078e0791",
  warning: "#ffa100",
  translucentGreen: "rgba(102, 190, 84, 0.2)",
  translucentGrey: "rgba(153, 153, 153, 0.2)",
  translucentOcean: "rgb(39, 208, 226, 0.2)",
  translucentGrenade: "rgb(234, 46, 73, 0.1)"
};

function hexToRgbA(hex, a) {
  let c;
  if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
    c = hex.substring(1).split("");
    if (c.length === 3) {
      c = [c[0], c[0], c[1], c[1], c[2], c[2]];
    }
    c = `0x${c.join("")}`;
    return `rgba(${[(c >> 16) & 255, (c >> 8) & 255, c & 255].join(",")},${a})`; // eslint-disable-line no-bitwise
  }
  throw new Error("Bad Hex");
}

export { colors as default, hexToRgbA };
