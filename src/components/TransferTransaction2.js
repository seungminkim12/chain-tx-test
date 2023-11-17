import React, { useState, useEffect } from "react";
import "./TransferTransaction2.css";
import BasicInput from "../componentLibrary/BasicInput";
import BasicButton from "../componentLibrary/BasicButton";
import { WEB3 } from "../module/web3";
import {
  SENDER_PRIVATE_KEY,
  SENDER_ADDRESS,
  SEND_AMOUNT,
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
import { server } from "../server/utils/serverInstance";

const TransferTransaction2 = ({
  // receiveAddress,
  // setRecieveAddress,
  setTxReceipt,
  setIsList,
  isTokenBalance,
  defaultAddress,
  senderAddress,
  pk,
  isCoin,
  setIsCoin,
}) => {
  const targetChainId = MY_MICRO_CHAIN_ID;
  const [amount, setAmount] = useState("");
  const [receiveAddress, setRecieveAddress] = useState(
    process.env.REACT_APP_META_TARGET_ADDRESS
  );
  const [nonce, setNonce] = useState("");
  const [gasPrice, setGasPrice] = useState("");
  const [estimatedGas, setEstimatedGas] = useState("");

  let encodeParameter = null;

  const sendTransactionHandler = async () => {
    if (!isCoin) {
      const amountToHex = WEB3.toHex(WEB3.toWei(amount));
      //token
      //ABICode
      const ABICode = await server
        .get(
          `/api/v2/contracts/address/${process.env.REACT_APP_CONTRACT_ADDRESS}/abi-code?microChainId=${MY_MICRO_CHAIN_ID}`
        )
        .then((res) => res.data);
      console.log("ABICode", ABICode);
      //contract
      const contract = await WEB3.Contract(
        ABICode,
        process.env.REACT_APP_META_CONTRACT_ADDRESS
      );
      console.log("contract", contract);

      const tansferParameter = [receiveAddress, amountToHex];
      console.log("tansferParameter", tansferParameter);
      encodeParameter = contract.methods["transfer"](
        ...tansferParameter
      ).encodeABI();

      console.log("encodeParameter: ", encodeParameter);
      // console.log("contractResult: ", contractResult);
      //transfer
      //transfer function call
      //data
    }
    console.log(
      "isCoin ? receiveAddress : process.env.REACT_APP_META_CONTRACT_ADDRESS",
      isCoin ? receiveAddress : process.env.REACT_APP_META_CONTRACT_ADDRESS
    );
    console.log("encodeParameter", encodeParameter);
    //gas
    const gasResult = await WEB3.estimateGas({
      from: senderAddress,
      value: isCoin ? WEB3.toHex(WEB3.toWei(amount)) : null,
      to: isCoin ? receiveAddress : process.env.REACT_APP_META_CONTRACT_ADDRESS,
      gasPrice,
      data: encodeParameter,
    });
    console.log("gasResult", gasResult);
    // setEstimatedGas(gasResult);
    //value
    const signTransactionResult = await WEB3.signTransaction(
      {
        nonce,
        gasPrice,
        gas: gasResult,
        value: isCoin ? WEB3.toHex(WEB3.toWei(amount)) : null,
        to: isCoin
          ? receiveAddress
          : process.env.REACT_APP_META_CONTRACT_ADDRESS,
        data: encodeParameter,
        // maxFeePerGas: gasPrice,
      },
      pk
    );
    const rawTransaction = signTransactionResult.rawTransaction;
    console.log("rawTransaction: ", rawTransaction);
    console.log("signTransactionResult", signTransactionResult);
    const txResult = await WEB3.sendSignedTransaction(rawTransaction);
    console.log("txResult: ", txResult);
  };

  const getGasPrice = async () => {
    const result = await WEB3.getGasPrice();
    console.log("gas", result);
    console.log("gas", WEB3.fromWei(result));
    setGasPrice(30000000);
  };

  const getNonce = async () => {
    const result = await WEB3.getTransactionCount(senderAddress);
    console.log("result: ", result);
    setNonce(result);
  };

  useEffect(() => {
    //nonce
    getNonce();
    //gasPrice
    getGasPrice();
  }, []);

  return (
    <div className="transaction-input-wrapper">
      <BasicInput
        type="checkbox"
        checked={isCoin}
        onChangeFunc={() => setIsCoin(!isCoin)}
      />
      {isCoin ? "coin" : "token"}
      <BasicInput
        type="text"
        className="transactipn-input"
        value={receiveAddress}
        onChangeFunc={(e) => setRecieveAddress(e.target.value)}
      />
      <BasicInput
        type="text"
        className="transaction-value-input"
        value={amount}
        placeholder="Amount"
        onChangeFunc={(e) => setAmount(e.target.value)}
      />
      <BasicButton
        className="transaction-button"
        value="Transfer"
        onClickFunc={sendTransactionHandler}
      />
    </div>
  );
};

export default TransferTransaction2;
