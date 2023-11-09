import React from "react";

const BasicInput = ({ type, className, value, onChangeFunc = undefined }) => {
  return (
    <input
      type={type}
      className={className}
      value={value}
      onChange={onChangeFunc}
    />
  );
};

export default BasicInput;
