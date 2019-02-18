/* eslint-disable react/prop-types */

import React, { PureComponent } from "react";
import { storiesOf } from "@storybook/react";
import EditableText from "components/base/EditableText";
import Box from "components/base/Box";

const text =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum quis tempus massa, sed consectetur est. Integer ultricies finibus ";
class Wrapper extends PureComponent {
  state = {
    text
  };

  onChange = val => this.setState({ text: val });

  render() {
    const { text } = this.state;
    return <EditableText onChange={this.onChange} text={text} />;
  }
}
storiesOf("Components", module).add("EditableText", () => (
  <Box flow={20} width={500}>
    <EditableText text={text} loading />
    <Wrapper />
  </Box>
));
