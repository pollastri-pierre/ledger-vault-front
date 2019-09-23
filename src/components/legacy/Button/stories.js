/* eslint-disable react/prop-types */

import { delay } from "utils/promise";
import React, { PureComponent } from "react";
import { storiesOf } from "@storybook/react";
import { MdCreateNewFolder } from "react-icons/md";
import { boolean, text } from "@storybook/addon-knobs";
import Box from "components/base/Box";
import Text from "components/base/Text";
import VaultButton from "components/legacy/Button";

const asyncAction = async () => delay(2000);

class ButtonStories extends PureComponent {
  render() {
    const {
      isRightIcon,
      isLeftIcon,
      type,
      variant,
      disabled,
      customColor,
      size,
      label,
    } = this.props;
    return (
      <VaultButton
        IconLeft={isLeftIcon && MdCreateNewFolder}
        IconRight={isRightIcon && MdCreateNewFolder}
        onClick={asyncAction}
        variant={variant}
        type={type}
        disabled={disabled}
        customColor={customColor}
        size={size}
      >
        {label}
      </VaultButton>
    );
  }
}

storiesOf("components/base", module).add("ButtonsLegacy", () => {
  const isLeftIcon = boolean("isLeftIcon", true);
  const isRightIcon = boolean("isRightIcon", false);
  const isDisabled = boolean("isDisabled", false);
  const label = text("label", "create account");
  return (
    <>
      <Box align="flex-start" flow={20}>
        <Box flow={20}>
          <Text header bold>
            Sizes
          </Text>
          <Box flow={20} align="flex-start" horizontal>
            <Box>
              <Text>small</Text>
              <ButtonStories
                isLeftIcon={isLeftIcon}
                isRightIcon={isRightIcon}
                size="small"
                type="submit"
                label="create account"
                disabled={isDisabled}
              />
            </Box>
            <Box>
              <Text>medium</Text>
              <ButtonStories
                isLeftIcon={isLeftIcon}
                isRightIcon={isRightIcon}
                size="medium"
                label="create account"
                type="submit"
                disabled={isDisabled}
              />
            </Box>
          </Box>
        </Box>

        <Box flow={20}>
          <Text header bold>
            Type/variants
          </Text>
          <Box horizontal flow={135} ml={70}>
            <Text>text</Text>
            <Text>filled</Text>
            <Text>outlined</Text>
          </Box>
          <Box horizontal flow={20} align="flex-end">
            <Text bold>Cancel</Text>
            <Box horizontal flow={20}>
              <ButtonStories
                isLeftIcon={isLeftIcon}
                isRightIcon={isRightIcon}
                type="cancel"
                label={label}
                disabled={isDisabled}
                variant="text"
              />
              <ButtonStories
                isLeftIcon={isLeftIcon}
                isRightIcon={isRightIcon}
                type="cancel"
                label={label}
                disabled={isDisabled}
                variant="filled"
              />
              <ButtonStories
                isLeftIcon={isLeftIcon}
                isRightIcon={isRightIcon}
                type="cancel"
                label={label}
                disabled={isDisabled}
                variant="outlined"
              />
            </Box>
          </Box>
          <Box horizontal flow={20} align="center">
            <Text bold>Submit</Text>
            <Box horizontal flow={20}>
              <ButtonStories
                isLeftIcon={isLeftIcon}
                isRightIcon={isRightIcon}
                type="submit"
                label={label}
                disabled={isDisabled}
                variant="text"
              />
              <ButtonStories
                isLeftIcon={isLeftIcon}
                isRightIcon={isRightIcon}
                type="submit"
                label={label}
                disabled={isDisabled}
                variant="filled"
              />
              <ButtonStories
                isLeftIcon={isLeftIcon}
                isRightIcon={isRightIcon}
                type="submit"
                label={label}
                disabled={isDisabled}
                variant="outlined"
              />
            </Box>
          </Box>
        </Box>
        <Box flow={20}>
          <Text header bold>
            Custom color
          </Text>
          <Box horizontal flow={20} align="center">
            <Text> orange </Text>
            <ButtonStories
              isLeftIcon={isLeftIcon}
              isRightIcon={isRightIcon}
              customColor="orange"
              label={label}
              disabled={isDisabled}
              variant="text"
            />
            <ButtonStories
              isLeftIcon={isLeftIcon}
              isRightIcon={isRightIcon}
              customColor="orange"
              label={label}
              disabled={isDisabled}
            />
            <ButtonStories
              isLeftIcon={isLeftIcon}
              isRightIcon={isRightIcon}
              customColor="orange"
              variant="filled"
              label={label}
              disabled={isDisabled}
            />
          </Box>
          <Box horizontal flow={20} align="center">
            <Text>Green</Text>
            <ButtonStories
              isLeftIcon={isLeftIcon}
              isRightIcon={isRightIcon}
              customColor="green"
              label={label}
              disabled={isDisabled}
              variant="text"
            />
            <ButtonStories
              isLeftIcon={isLeftIcon}
              isRightIcon={isRightIcon}
              customColor="green"
              label={label}
              disabled={isDisabled}
            />
            <ButtonStories
              isLeftIcon={isLeftIcon}
              isRightIcon={isRightIcon}
              customColor="green"
              variant="filled"
              label={label}
              disabled={isDisabled}
            />
          </Box>
          <Box horizontal flow={20} align="center">
            <Text>Red</Text>
            <ButtonStories
              isLeftIcon={isLeftIcon}
              isRightIcon={isRightIcon}
              customColor="red"
              label={label}
              disabled={isDisabled}
              variant="text"
            />
            <ButtonStories
              isLeftIcon={isLeftIcon}
              isRightIcon={isRightIcon}
              customColor="red"
              label={label}
              disabled={isDisabled}
            />
            <ButtonStories
              isLeftIcon={isLeftIcon}
              isRightIcon={isRightIcon}
              customColor="red"
              variant="filled"
              label={label}
              disabled={isDisabled}
            />
          </Box>
        </Box>
      </Box>
    </>
  );
});
