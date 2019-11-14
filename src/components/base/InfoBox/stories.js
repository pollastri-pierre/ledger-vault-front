/* eslint-disable react/prop-types */

import React from "react";

import { storiesOf } from "@storybook/react";
import { boolean } from "@storybook/addon-knobs";
import { action } from "@storybook/addon-actions";

import InfoBox from "components/base/InfoBox";
import Text from "components/base/Text";
import Button from "components/base/Button";

import colors from "shared/colors";

storiesOf("components", module).add("InfoBox", () => {
  const withIcon = boolean("withIcon", true);
  const types = ["info", "warning", "error", "success"];
  return (
    <div>
      {types.map(t => (
        <Wrapper
          key={t}
          type={t}
          withFooter={t === "info"}
          withIcon={withIcon}
        />
      ))}
      <div style={{ maxWidth: 400 }}>
        <InfoBox alignCenter type="warning">
          <Text>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ac
            massa orci. Vestibulum ante ipsum primis in faucibus orci luctus et
            ultrices posuere cubilia Curae; Aliquam convallis sapien magna, ac
            aliquet nunc lacinia pulvinar.
          </Text>
        </InfoBox>
      </div>
    </div>
  );
});

const Footer = () => (
  <Button type="filled" onClick={action("click")}>
    Take action
  </Button>
);

const Wrapper = ({ type, withFooter, ...props }) => (
  <div
    style={{
      marginBottom: 30,
      maxWidth: 400,
    }}
  >
    <div
      style={{
        fontFamily: "Open Sans",
        textTransform: "uppercase",
        fontWeight: "bold",
        fontSize: 12,
        marginBottom: 10,
        color: colors.legacyLightGrey3,
      }}
    >
      {type}
    </div>
    <InfoBox
      type={type}
      Footer={withFooter ? <Footer /> : undefined}
      {...props}
    >
      <Text>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ac massa
        orci. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices
        posuere cubilia Curae; Aliquam convallis sapien magna, ac aliquet nunc
        lacinia pulvinar.
      </Text>
    </InfoBox>
  </div>
);
