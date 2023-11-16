import React, { useState } from "react";
import "./LoadBalance.css";
import BasicButton from "../componentLibrary/BasicButton";
import { MY_MICRO_CHAIN_ID, server, SENDER_ADDRESS } from "../App";
import { WEB3 } from "../module/web3";
import BasicInput from "componentLibrary/BasicInput";

const microChainId = process.env.REACT_APP_MICRO_CHAIN_ID;
const tokenMicroChainId = process.env.REACT_APP_TOKEN_MICRO_CHAIN_ID;

const LoadBalance = ({ balance, setBalance, isTokenBalance }) => {
  const [inputAddress, setInputAddress] = useState("");
  const loadBalanceHandler = async () => {
    const { data } = await server.get(
      isTokenBalance
        ? `/api/v2/micro-chain-currency/${tokenMicroChainId}/balance?address=${SENDER_ADDRESS}&microChainId=${microChainId}`
        : `/api/v2/block-explorer/wallets/coins/balance?microChainId=${microChainId}&address=${SENDER_ADDRESS}`
    );
    const moduleResult = await WEB3.getBalance(inputAddress);
    console.log("moduleResult", WEB3.fromWei(moduleResult));
    setBalance(WEB3.fromWei(data.balance));
  };
  return (
    <div className="balance-button-wrapper">
      <BasicInput
        type={`text`}
        value={inputAddress}
        onChangeFunc={(e) => setInputAddress(e.target.value)}
      />
      <BasicButton
        className="balance-button"
        value="Load"
        onClickFunc={loadBalanceHandler}
      />
      <p className="balance-text">{balance}</p>
    </div>
  );
};

export default LoadBalance;
