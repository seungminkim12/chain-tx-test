import React from "react";
import "./TransferTransaction.css";
import BasicInput from "../componentLibrary/BasicInput";
import BasicButton from "../componentLibrary/BasicButton";
import { WEB3 } from "../module/web3";
import {
  SENDER_PRIVATE_KEY,
  SENDER_ADDRESS,
  SEND_AMOUNT,
  server,
  MY_MICRO_CHAIN_ID,
} from "../App";
import {
  getGasAction,
  getTransactionHashAction,
} from "action/transactionAction";

const TransferTransaction = ({
  receiveAddress,
  setRecieveAddress,
  gasPrice,
  nonce,
  setTxReceipt,
  setIsList,
}) => {
  const sendTransactionHandler = async () => {
    const estimateGasBody = {
      to: receiveAddress,
      from: SENDER_ADDRESS,
      gasPrice,
      value: WEB3.toHex(WEB3.toWei(SEND_AMOUNT.toString())),
    };

    const gas = await getGasAction(MY_MICRO_CHAIN_ID, estimateGasBody);

    const transaction = {
      nonce,
      to: receiveAddress,
      chainId: MY_MICRO_CHAIN_ID.toString(),
      gasPrice,
      gas: WEB3.fromDecimal(gas),
      value: WEB3.toHex(WEB3.toWei(SEND_AMOUNT.toString())),
    };

    const { rawTransaction } = await WEB3.signTransaction(
      transaction,
      SENDER_PRIVATE_KEY
    );

    const sendTransactionBody = {
      rawTransaction,
    };

    const transactionResult = await getTransactionHashAction(
      MY_MICRO_CHAIN_ID,
      sendTransactionBody
    );

    const transactionHash = transactionResult.data.transaction_hash;

    const transactionRecipient = await server.get(
      `/api/v2/request/transaction/${transactionHash}?microChainId=${MY_MICRO_CHAIN_ID}`
    );
    setTxReceipt(transactionRecipient.data.transaction);

    setIsList(false);
  };

  return (
    <div className="transaction-input-wrapper">
      <BasicInput
        type="text"
        className="transactipn-input"
        value={receiveAddress}
        onChangeFunc={(e) => setRecieveAddress(e.target.value)}
      />
      <BasicButton
        className="transaction-button"
        value="Transfer"
        onClickFunc={sendTransactionHandler}
      />
    </div>
  );
};

export default TransferTransaction;
