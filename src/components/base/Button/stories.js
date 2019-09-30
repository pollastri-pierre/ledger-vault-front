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

import { delay } from "utils/promise";

const asyncAction = async () => delay(2000);

storiesOf("components/base", module).add("Button", () => (
  <Box flow={20}>
    <Box flow={10}>
      <Text bold uppercase>
        Buttons by Type
      </Text>
      <Box horizontal flow={15}>
        <Button type="filled" variant="primary" onClick={asyncAction}>
          <Text>Filled</Text>
        </Button>
        <Button type="outline" variant="primary" onClick={asyncAction}>
          <Text>Outline</Text>
        </Button>
        <Button onClick={asyncAction}>
          <Text>Default</Text>
        </Button>
        <Button type="link" variant="primary" onClick={asyncAction}>
          <Text>Link</Text>
        </Button>
        <Button circular onClick={() => {}}>
          <FaPlus />
        </Button>
        <Button circular type="outline" variant="primary" onClick={() => {}}>
          <FaCheck />
        </Button>
      </Box>
    </Box>
    <Box flow={10}>
      <Text bold uppercase>
        Buttons by Variant
      </Text>
      <Box horizontal flow={15}>
        <Button type="filled" variant="danger" onClick={asyncAction}>
          <Text>Filled danger</Text>
        </Button>
        <Button type="outline" variant="warning" onClick={asyncAction}>
          <Text>Outline warning</Text>
        </Button>
        <Button type="link" onClick={asyncAction}>
          <Text>Link Default</Text>
        </Button>
        <Button type="filled" variant="primary" onClick={asyncAction}>
          <Text>Filled Primary</Text>
        </Button>
        <Button type="outline" variant="primary" onClick={asyncAction}>
          <Text>Outline Primary</Text>
        </Button>
        <Button type="filled" variant="info" onClick={asyncAction}>
          <Text>Filled Primary</Text>
        </Button>
        <Button type="outline" variant="info" onClick={asyncAction}>
          <Text>Outline Primary</Text>
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
      </Box>
    </Box>
    <Box flow={10}>
      <Text bold uppercase>
        Buttons with icons
      </Text>
      <Box horizontal flow={15}>
        <Button type="outline" onClick={asyncAction}>
          <Box horizontal flow={5} justify="center" align="center">
            <FaArrowLeft />
            <Text>Back</Text>
          </Box>
        </Button>
        <Button type="filled" variant="info" onClick={asyncAction}>
          <Box horizontal flow={5} justify="center" align="center">
            <Text>Forward</Text>
            <FaArrowRight />
          </Box>
        </Button>
        <Button type="filled" onClick={asyncAction}>
          <Box horizontal flow={5} justify="center" align="center">
            <FaPlus />
            <Text>Create Account</Text>
          </Box>
        </Button>
        <Button type="outline" variant="info" onClick={asyncAction}>
          <Box horizontal flow={5} justify="center" align="center">
            <Text>View in Explorer</Text>
            <FaExternalLinkAlt />
          </Box>
        </Button>
        <Button type="filled" variant="warning" onClick={asyncAction}>
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
        <Button type="filled" small onClick={asyncAction}>
          <Text>Small</Text>
        </Button>
        <Button type="outline" onClick={asyncAction}>
          <Text>Default</Text>
        </Button>
        <Button circular type="outline" onClick={asyncAction}>
          <FaPowerOff size={12} />
        </Button>
      </Box>
    </Box>
  </Box>
));
