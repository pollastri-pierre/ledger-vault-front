/* eslint-disable react/prop-types */

import React from "react";
import { storiesOf } from "@storybook/react";
import {
  FaPlus,
  FaCheck,
  FaArrowLeft,
  FaArrowRight,
  FaExternalLinkAlt,
  FaPowerOff,
  FaTrash,
} from "react-icons/fa";

import Button from "components/base/Button";
import Text from "components/base/Text";
import Box from "components/base/Box";

import colors from "shared/colors";
import { delay } from "utils/promise";

const asyncAction = async () => delay(2000);

storiesOf("components/base", module).add("Button", () => (
  <Box flow={20}>
    <Box flow={10}>
      <Text bold uppercase>
        Buttons by Type
      </Text>
      <Box horizontal flow={15}>
        <Button type="primary" onClick={asyncAction}>
          <Text>Primary</Text>
        </Button>
        <Button type="danger" onClick={asyncAction}>
          <Text>Danger</Text>
        </Button>
        <Button onClick={asyncAction}>
          <Text>Default</Text>
        </Button>
        <Button type="outline" onClick={asyncAction}>
          <Text>Outline Default</Text>
        </Button>
        <Button
          type="outline"
          outlineColor={colors.shark}
          onClick={asyncAction}
        >
          <Text>Outline Custom Color</Text>
        </Button>
        <Button type="link" onClick={() => {}}>
          <Text>Link Button</Text>
        </Button>
        <Button circular onClick={() => {}}>
          <FaPlus />
        </Button>
        <Button circular outline onClick={() => {}}>
          <FaCheck />
        </Button>
      </Box>
    </Box>
    <Box flow={10}>
      <Text bold uppercase>
        Buttons by State
      </Text>
      <Box horizontal flow={15}>
        <Button type="primary" disabled onClick={asyncAction}>
          <Text>Disabled</Text>
        </Button>
        <Button type="primary" isFocused onClick={asyncAction}>
          <Text>Focused</Text>
        </Button>
        <Button type="outline" isFocused onClick={asyncAction}>
          <Text>Focused</Text>
        </Button>
      </Box>
    </Box>
    <Box flow={10}>
      <Text bold uppercase>
        Buttons with icons
      </Text>
      <Box horizontal flow={15}>
        <Button
          type="outline"
          outlineColor={colors.shark}
          onClick={asyncAction}
        >
          <Box horizontal flow={5} justify="center" align="center">
            <FaArrowLeft />
            <Text>Back</Text>
          </Box>
        </Button>
        <Button type="outline" onClick={asyncAction}>
          <Box horizontal flow={5} justify="center" align="center">
            <Text>Forward</Text>
            <FaArrowRight />
          </Box>
        </Button>
        <Button type="primary" onClick={asyncAction}>
          <Box horizontal flow={5} justify="center" align="center">
            <FaPlus />
            <Text>Create Account</Text>
          </Box>
        </Button>
        <Button
          type="outline"
          outlineColor={colors.mediumGrey}
          onClick={asyncAction}
        >
          <Box horizontal flow={5} justify="center" align="center">
            <Text>View in Explorer</Text>
            <FaExternalLinkAlt />
          </Box>
        </Button>
        <Button
          type="outline"
          outlineColor={colors.grenade}
          onClick={asyncAction}
        >
          <Box horizontal flow={5} justify="center" align="center">
            <FaTrash />
            <Text>Reject</Text>
          </Box>
        </Button>
      </Box>
    </Box>
    <Box flow={10}>
      <Text bold uppercase>
        Buttons by size
      </Text>
      <Box horizontal flow={15}>
        <Button type="danger" isFocused small onClick={asyncAction}>
          <Text>Small</Text>
        </Button>
        <Button type="outline" onClick={asyncAction}>
          <Text>Default</Text>
        </Button>
        <Button circular type="outline" isFocused small onClick={asyncAction}>
          <FaPowerOff size={12} />
        </Button>
        <Button circular type="primary" onClick={asyncAction}>
          <FaPlus size={12} />
        </Button>
      </Box>
    </Box>
  </Box>
));
