import React from "react";
import "./index.css";

function InputTextWithUnity(props) {
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
