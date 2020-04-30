// @flow
//
import React, { useState, useRef } from "react";
import InputText from "components/base/form/inputs/InputText";
import Box from "components/base/Box";
import FakeInputContainer from "components/base/FakeInputContainer";

type Props = {
  value: string,
  prefix: string,
  onChange: string => void,
  errors: Error[],
};
const DerivationInput = ({ value, prefix, onChange, errors }: Props) => {
  const [active, setActive] = useState(false);
  const inputRef = useRef();
  const onBlur = () => {
    setActive(false);
  };
  const onClick = () => {
    inputRef.current && inputRef.current.focus();
    setActive(true);
  };
  return (
    <FakeInputContainer
      leftAlign
      isActive={active}
      onClick={onClick}
      isError={errors && errors.length > 0}
    >
      <Box>{prefix}/</Box>
      <Box grow>
        <InputText
          inputRef={inputRef}
          style={{
            paddingLeft: 1,
            border: 0,
            boxShadow: "none",
            height: "80%",
            width: 200,
          }}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          errors={errors}
          placeholder="address index"
        />
      </Box>
    </FakeInputContainer>
  );
};

export default DerivationInput;
