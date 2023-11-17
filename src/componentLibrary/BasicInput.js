import React from "react";

const BasicInput = ({
  type,
  className,
  value,
  onChangeFunc = undefined,
  placeholder,
  checked,
}) => {
  return (
    <input
      type={type}
      className={className}
      value={value}
      checked={checked}
      onChange={onChangeFunc}
      placeholder={placeholder}
    />
  );
};

export default BasicInput;
