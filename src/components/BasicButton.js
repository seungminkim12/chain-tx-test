import React from "react";

const BasicButton = ({ value, className, onClickFunc }) => {
  return (
    <button onClick={onClickFunc} className={className}>
      {value}
    </button>
  );
};

export default BasicButton;
