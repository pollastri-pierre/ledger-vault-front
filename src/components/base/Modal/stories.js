/* eslint-disable react/prop-types */

import React from "react";
import { storiesOf } from "@storybook/react";
import { boolean } from "@storybook/addon-knobs";
import { FaUser } from "react-icons/fa";
import { MdEdit } from "react-icons/md";

import colors from "shared/colors";
import Modal, {
  ConfirmModal,
  RichModalHeader,
  RichModalFooter,
  RichModalTabsContainer,
  RichModalTab,
  ModalFooterButton,
} from "components/base/Modal";
import Box from "components/base/Box";
import Text from "components/base/Text";
import Button from "components/legacy/Button";

storiesOf("components/base/modals", module)
  .add("RichModal", () => (
    <Modal isOpened={boolean("isOpened", true)}>
      <RichModalHeader title="Banana split" Icon={FaUser}>
        <RichModalTabsContainer>
          <RichModalTab isActive to="overview">
            Overview
          </RichModalTab>
          <RichModalTab to="details">Details</RichModalTab>
          <RichModalTab to="history">History</RichModalTab>
        </RichModalTabsContainer>
        <Button size="tiny" type="submit" variant="filled" IconLeft={MdEdit}>
          Take action
        </Button>
      </RichModalHeader>

      <Box width={600} p={40} style={{ minHeight: 200 }}>
        This is the modal content.
      </Box>

      <RichModalFooter>
        <Box
          grow
          horizontal
          flexDirection="row-reverse"
          align="flex-end"
          justify="space-between"
        >
          <ModalFooterButton color={colors.ocean}>Do this</ModalFooterButton>
          <ModalFooterButton color={colors.grenade}>Do that</ModalFooterButton>
        </Box>
      </RichModalFooter>
    </Modal>
  ))
  .add("Modal", () => (
    <Modal isOpened={boolean("isOpened", true)}>
      <Box p={40}>
        <Text>This is a basic modal.</Text>
      </Box>
    </Modal>
  ))
  .add("ConfirmModal", () => (
    <ConfirmModal title="Are you sure?" isOpened>
      You are about to destroy the entire database. Are you sure you want to
      proceed?
    </ConfirmModal>
  ));
