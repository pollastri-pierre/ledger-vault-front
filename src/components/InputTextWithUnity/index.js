//@flow
import React from "react";

function InputTextWithUnity(props: {
  children: React$Node | string,
  field: React$Node | string,
  hasError: boolean,
  label: React$Node | string
}) {
  const { children, field, hasError, label } = props;
  return (
    <div className={`field-text-unity ${hasError ? "error" : ""}`}>
      <label>{label}</label>
      <div className="value-left">{field}</div>
      <div className="unity-right">{children}</div>
    </div>
  );
}

export default InputTextWithUnity;
