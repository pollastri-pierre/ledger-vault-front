/* eslint-disable react/prop-types */

import React from "react";
import { storiesOf } from "@storybook/react";
import { boolean } from "@storybook/addon-knobs";

import Modal, { ModalFooterButton, ConfirmModal } from "components/base/Modal";
import ModalHeader from "components/base/Modal/ModalHeader";
import ModalBody from "components/base/Modal/ModalBody";
import Box from "components/base/Box";
import Text from "components/base/Text";

const CustomFooter = () => <ModalFooterButton>Next</ModalFooterButton>;
const CustomBreadcrumb = () => (
  <div>
    <div style={{ opacity: 0.5, marginBottom: 10 }}>1. Introduction</div>
    <div style={{ fontWeight: "bold", marginBottom: 10 }}>2. Something</div>
    <div style={{ opacity: 0.5 }}>3. Confirmation</div>
  </div>
);

storiesOf("components/base/modals", module)
  .add("Modal", () => (
    <Modal
      isOpened={boolean("isOpened", true)}
      isLoading={boolean("isLoading", false)}
      Footer={CustomFooter}
      Breadcrumb={CustomBreadcrumb}
    >
      <Box flow={10}>
        <ModalHeader>
          <Box>
            <Text header bold>
              Group
            </Text>
            <Text uppercase small>
              edit the members
            </Text>
          </Box>
        </ModalHeader>
        <ModalBody>
          <Box width={600}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut varius
            volutpat magna, quis sollicitudin tortor consectetur vitae. Nullam
            vulputate arcu nec elit volutpat, sit amet porttitor neque
            malesuada. Sed sed felis at tortor mollis tempus sed eget velit.
            Fusce malesuada scelerisque quam, id scelerisque ante hendrerit nec.
            Nam vulputate lectus sit amet ipsum tristique pharetra. Suspendisse
            luctus ex purus, eu dictum nisi convallis eu. Lorem ipsum dolor sit
            amet, consectetur adipiscing elit. Integer est libero, imperdiet
            eget ante nec, condimentum interdum risus. Duis faucibus nisl ut
            convallis gravida. Pellentesque viverra convallis quam et ultrices.
            Vestibulum ultrices leo ut erat lacinia fringilla. Quisque a
            fermentum dui, dictum hendrerit ex.
          </Box>
        </ModalBody>
      </Box>
    </Modal>
  ))
  .add("ConfirmModal", () => (
    <ConfirmModal title="Are you sure?" isOpened>
      You are about to destroy the entire database. Are you sure you want to
      proceed?
    </ConfirmModal>
  ));
