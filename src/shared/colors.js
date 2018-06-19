const colors = {
  night: "#1d2028",
  mouse: "#e2e2e2",
  ocean: "#27d0e2",
  grenade: "#ea2e49",
  argile: "#eeeeee",
  shark: "#666666",
  steel: "#767676",
  lead: "#999999",
  pearl: "#f4f4f4",
  cream: "#f9f9f9",
  white: "#ffffff",
  black: "#000000",
  blue_orange: "#ffd384",
  blue_red: "#ea2e497d",
  blue_green: "#078e0791"
};

function hexToRgbA(hex, a) {
  var c;
  if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
    c = hex.substring(1).split("");
    if (c.length == 3) {
      c = [c[0], c[0], c[1], c[1], c[2], c[2]];
    }
    c = "0x" + c.join("");
    return (
      "rgba(" +
      [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(",") +
      "," +
      a +
      ")"
    );
  }
  throw new Error("Bad Hex");
}

export { colors as default, hexToRgbA };
