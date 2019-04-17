/* eslint-disable react/prop-types */

import React from "react";
import { storiesOf } from "@storybook/react";
import { text } from "@storybook/addon-knobs";
import { FaLink } from "react-icons/fa";

import { InputText } from "components/base/form";

const p = () => ({
  value: text("value", ""),
  placeholder: text("placeholder", "Enter some text..."),
  autoFocus: true,
});

const errors = [new Error("Invalid value")];
const warnings = [new Error("Can't verify your address")];
const hints = [
  {
    key: "maxChars",
    label: v => `10 chars max (${10 - v.length} left)`,
    check: v => v !== "",
  },
  {
    key: "whatever",
    label: `Very long inspiration hint that should take multiple lines`,
    check: () => true,
  },
  {
    key: "numbers",
    label: `Only numbers`,
    check: v =>
      v.split("").every(c => {
        const charCode = c.charCodeAt(0);
        if (charCode > 31 && (charCode < 48 || charCode > 57)) return false;
        return true;
      }),
  },
];

storiesOf("form/InputText", module)
  .addDecorator(story => <div style={{ maxWidth: 400 }}>{story()}</div>)
  .add("basic", () => <InputText {...p()} />)
  .add("icon", () => <InputText {...p()} IconLeft={FaLink} />)
  .add("error", () => <InputText {...p()} errors={errors} />)
  .add("warning", () => <InputText {...p()} warnings={warnings} />)
  .add("hints", () => (
    <InputText autoFocus value={text("value", "40420.aa")} hints={hints} />
  ));
