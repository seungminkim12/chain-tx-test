import React from "react";
import { WEB3 } from "./web3";

const TableData = ({ txReceipt = null, idx, lastElementRef }) => {
  const isList = txReceipt.gas;
  return (
    <tr id={idx} key={idx} ref={lastElementRef ? lastElementRef : undefined}>
      <td>{txReceipt.hash}</td>
      <td>{txReceipt.to}</td>
      <td>{txReceipt.from}</td>
      {isList ? (
        <>
          <td>{WEB3.toHex(txReceipt.gas)}</td>
          <td>{WEB3.toHex(txReceipt.gasPrice)}</td>
          <td>{txReceipt.nonce}</td>
        </>
      ) : (
        <td>{txReceipt.fee ? WEB3.fromWei(txReceipt.fee) : ""}</td>
      )}
    </tr>
  );
};

export default TableData;
