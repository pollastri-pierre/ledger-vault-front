/* eslint-disable react/prop-types */

import React from "react";
import styled from "styled-components";
import { storiesOf } from "@storybook/react";

import Card, { CardTitle } from "components/base/Card";
import Text from "components/base/Text";

const Page = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 100px;
  background-color: #eee;
`;

storiesOf("Components/layout", module).add("Card", () => (
  <Page>
    <Card>
      <CardTitle>This is the card title</CardTitle>
      <Text>Lorem ipsum.</Text>
    </Card>
  </Page>
));
