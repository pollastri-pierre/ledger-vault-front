/* eslint-disable react/prop-types */

import React from "react";
import { storiesOf } from "@storybook/react";

import Text from "components/base/Text";

const DUMMY_TEXT =
  "The quick brown fox jumps over the lazy dog. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean consectetur lectus quis hendrerit scelerisque. Pellentesque iaculis quam erat. Aenean feugiat, odio a posuere blandit, ipsum nisl aliquet urna, id imperdiet quam erat sed augue. Phasellus id convallis nunc. Quisque massa diam, feugiat in auctor id, lobortis in purus.";

const TypographyRow = ({ children, label }) => (
  <div>
    <div>
      <span
        style={{
          padding: 5,
          fontSize: 10,
          backgroundColor: "#eee",
        }}
      >
        {label}
      </span>
    </div>
    <div style={{ padding: 20 }}>{children}</div>
  </div>
);

storiesOf("components/base", module).add("Text", () => (
  <>
    <TypographyRow label="large">
      <Text large>{DUMMY_TEXT}</Text>
    </TypographyRow>
    <TypographyRow label="normal (default)">
      <Text>{DUMMY_TEXT}</Text>
    </TypographyRow>
    <TypographyRow label="small">
      <Text small>{DUMMY_TEXT}</Text>
    </TypographyRow>
  </>
));
