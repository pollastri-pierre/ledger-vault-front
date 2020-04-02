// @flow

import React, { useState } from "react";
import { FaList } from "react-icons/fa";

import Modal, { RichModalHeader } from "components/base/Modal";
import Box from "components/base/Box";
import Button from "components/base/Button";
// TODO FIX IMPORT IN STORYBOOK
// import { Form, InputText, Label } from "components/base/form";
import Form from "components/base/form/Form";
import InputText from "components/base/form/inputs/InputText";
import Label from "components/base/form/Label";

import {
  useSoftDevicesState,
  useSoftDevicesDispatch,
} from "./SoftDevicesContext";

type Props = {
  onCreate: ({ seed: string, name: string }) => any,
};

const SeedsManager = (props: Props) => {
  const { isSeedsManagerOpened } = useSoftDevicesState();
  const dispatch = useSoftDevicesDispatch();
  const handleClose = () => dispatch({ type: "CLOSE_SEEDS_MANAGER" });
  return (
    <Modal isOpened={isSeedsManagerOpened} onClose={handleClose} zIndex={301}>
      <SeedsManagerInner {...props} />
    </Modal>
  );
};

const SeedsManagerInner = (props: Props) => {
  const { onCreate } = props;
  const [seed, setSeed] = useState({ name: "", seed: "" });
  const dispatch = useSoftDevicesDispatch();
  const handleClose = () => dispatch({ type: "CLOSE_SEEDS_MANAGER" });
  const handleChange = (key: string) => val => setSeed({ ...seed, [key]: val });
  const handleSubmit = () => {
    dispatch({ type: "REGISTER_SEED", payload: seed });
    onCreate(seed);
    handleClose();
  };
  const isValid = !!seed.name && !!seed.seed;
  return (
    <>
      <RichModalHeader
        Icon={FaList}
        title="Add custom seed"
        onClose={handleClose}
      />
      <Box p={40} pt={20} width={500}>
        <Form onSubmit={handleSubmit}>
          <Box flow={20}>
            <Box>
              <Label>Name</Label>
              <InputText
                placeholder="Demo user 1"
                value={seed.name}
                onChange={handleChange("name")}
                // autoFocus is not currently working because @reach/menu-button is stealing
                // focus, this should be fixed in 0.9.1 but we cannot update because of https://github.com/reach/reach-ui/issues/523
                // nice lib, guys!
                autoFocus
              />
            </Box>
            <Box>
              <Label>Seed</Label>
              <InputText
                placeholder="abandon abandon abandon..."
                value={seed.seed}
                onChange={handleChange("seed")}
              />
            </Box>
            <Box align="flex-end">
              <Button type="filled" onClick={handleSubmit} disabled={!isValid}>
                Not a scam
              </Button>
            </Box>
          </Box>
        </Form>
      </Box>
    </>
  );
};

export default SeedsManager;
