import React from "react";
import "./LoadBalance.css";
import BasicButton from "../componentLibrary/BasicButton";
import { MY_MICRO_CHAIN_ID, server, SENDER_ADDRESS } from "../App";
import { WEB3 } from "../module/web3";

const LoadBalance = ({ balance, setBalance, isTokenBalance }) => {
  const loadBalanceHandler = async () => {
    const { data } = await server.get(
      isTokenBalance
        ? `/api/v2/micro-chain-currency/${process.env.REACT_APP_TOKEN_MICRO_CHAIN_ID}/balance?address=${SENDER_ADDRESS}&microChainId=${process.env.REACT_APP_MICRO_CHAIN_ID}`
        : `/api/v2/block-explorer/wallets/coins/balance?microChainId=${MY_MICRO_CHAIN_ID}&address=${SENDER_ADDRESS}`
    );
    setBalance(WEB3.fromWei(data.balance));
  };
  return (
    <div className="balance-button-wrapper">
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
