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
import {
  getTokenTransactionFromServer,
  getTransactionRecipientFromServer,
} from "server/dataAPI";

const TransferTransaction = ({
  receiveAddress,
  setRecieveAddress,
  gasPrice,
  nonce,
  setTxReceipt,
  setIsList,
  isTokenBalance,
  defaultAddress,
}) => {
  const targetChainId = MY_MICRO_CHAIN_ID;
  const sendTransactionHandler = async () => {
    let txValue = 0.01;
    let tokenDataValue;

    //token contract
    if (isTokenBalance) {
      const amount = 1;
      const ABICode = await server
        .get(
          `/api/v2/contracts/address/${process.env.REACT_APP_CONTRACT_ADDRESS}/abi-code?microChainId=${MY_MICRO_CHAIN_ID}`
        )
        .then((res) => res.data);

      const contract = await WEB3.Contract(ABICode);

      const transferParameter = [
        process.env.REACT_APP_TARGET_ADDRESS,
        WEB3.toHex(WEB3.toWei(amount.toString())),
      ];

      const encodeParameter = contract.methods["transfer"](
        ...transferParameter
      ).encodeABI();

      tokenDataValue = encodeParameter;
    }

    const estimateGasBody = {
      from: SENDER_ADDRESS,
    };

    if (isTokenBalance) {
      estimateGasBody["data"] = tokenDataValue;
      estimateGasBody["to"] = process.env.REACT_APP_CONTRACT_ADDRESS;
    } else {
      estimateGasBody["gasPrice"] = gasPrice;
      estimateGasBody["to"] = receiveAddress;
      estimateGasBody["value"] = txValue;
    }

    const gas = await getGasAction(MY_MICRO_CHAIN_ID, estimateGasBody);

    const transaction = {
      nonce,
      chainId: targetChainId.toString(),
      gasPrice,
      gas: WEB3.fromDecimal(gas),
    };

    if (isTokenBalance) {
      transaction["data"] = tokenDataValue;
      transaction["to"] = process.env.REACT_APP_CONTRACT_ADDRESS;
    } else {
      transaction["gasPrice"] = gasPrice;
      transaction["to"] = receiveAddress;
      transaction["value"] = txValue;
    }

    const { rawTransaction } = await WEB3.signTransaction(
      transaction,
      SENDER_PRIVATE_KEY
    );

    const sendTransactionBody = {
      rawTransaction,
    };

    const transactionResult = isTokenBalance
      ? await getTokenTransactionFromServer(targetChainId, sendTransactionBody)
      : await getTransactionHashAction(targetChainId, sendTransactionBody);

    const transactionHash = transactionResult.data.transaction_hash;

    let transactionRecipient;
    setTimeout(async () => {
      transactionRecipient = await getTransactionRecipientFromServer(
        transactionHash,
        targetChainId
      );
      setTxReceipt(transactionRecipient.data.transaction);
    }, 2000);

    setIsList(false);
  };

  return (
    <div className="transaction-input-wrapper">
      <BasicInput
        type="text"
        className="transactipn-input"
        value={
          receiveAddress ? receiveAddress : process.env.REACT_APP_TARGET_ADDRESS
        }
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
