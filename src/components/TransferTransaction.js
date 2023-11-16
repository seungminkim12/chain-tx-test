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
}) => {
  const targetChainId = MY_MICRO_CHAIN_ID;
  const sendTransactionHandler = async () => {
    let txValue = 0.01;
    let tokenDataValue;
    console.log("MY_MICRO_CHAIN_ID", MY_MICRO_CHAIN_ID);
    //token contract
    if (isTokenBalance) {
      const amount = 1;
      const ABICode = await server
        .get(
          `/api/v2/contracts/address/${process.env.REACT_APP_CONTRACT_ADDRESS}/abi-code?microChainId=${MY_MICRO_CHAIN_ID}`
        )
        .then((res) => res.data);
      console.log("ABICode", ABICode);
      const contract = await WEB3.Contract(ABICode);

      console.log("defaultAccount", WEB3.getDefaultAccount());

      console.log(
        "balanceByDefaultAccount",
        await WEB3.getBalanceByDefaultAccount()
      );

      console.log("contract", contract);

      const transferParameter = [
        process.env.REACT_APP_TARGET_ADDRESS,
        WEB3.toHex(WEB3.toWei(amount.toString())),
      ];

      console.log("transferParameter", transferParameter);

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

    console.log("estimateGasBody", estimateGasBody);

    const gas = await getGasAction(MY_MICRO_CHAIN_ID, estimateGasBody);
    console.log("gas: ", gas);

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

    console.log("transaction", transaction);

    const { rawTransaction } = await WEB3.signTransaction(
      transaction,
      SENDER_PRIVATE_KEY
    );
    console.log("rawTransaction: ", rawTransaction);
    const sendTransactionBody = {
      rawTransaction,
    };

    const transactionResult = isTokenBalance
      ? await getTokenTransactionFromServer(targetChainId, sendTransactionBody)
      : await getTransactionHashAction(targetChainId, sendTransactionBody);

    const transactionHash = transactionResult.data.transaction_hash;
    console.log("transactionResult", transactionResult);

    let transactionRecipient;
    setTimeout(async () => {
      transactionRecipient = await getTransactionRecipientFromServer(
        transactionHash,
        targetChainId
      );
      setTxReceipt(transactionRecipient.data.transaction);
      console.log("transactionRecipient", transactionRecipient);
    }, 2000);

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
