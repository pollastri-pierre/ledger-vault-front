import InterRegular from "assets/fonts/Inter-Regular.woff2";
import InterBold from "assets/fonts/Inter-Bold.woff2";
import InterSemiBold from "assets/fonts/Inter-SemiBold.woff2";

const css = `
  @font-face {
    font-family: Inter;
    font-style: normal;
    font-weight: normal;
    src: url('${InterRegular}') format('woff2');
  }

  @font-face {
    font-family: Inter;
    font-style: normal;
    font-weight: bold;
    src: url('${InterBold}') format('woff2');
  }

  @font-face {
    font-family: Inter;
    font-style: normal;
    font-weight: 600;
    src: url('${InterSemiBold}') format('woff2');
  }
`;

const style = document.createElement("style");
style.type = "text/css";
style.appendChild(document.createTextNode(css));

document.head.appendChild(style);
