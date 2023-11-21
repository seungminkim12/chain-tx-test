import axios from "axios";
import { useCallback, useEffect, useState, useRef } from "react";
import { WEB3 } from "./module/web3";
import "./App2.css";
import BasicButton from "./componentLibrary/BasicButton";
import BasicInput from "./componentLibrary/BasicInput";
import TransferTransaction from "./components/TransferTransaction";
import LoadBalance from "./components/LoadBalance";
import { getAllTokensAction } from "./action/tokenAction";
import TransactionTable from "components/TransactionTable";
import TokensTable from "./components/TokensTable";
import { getGasPriceFromServer, getNonceFromServer } from "server/dataAPI";
import TransferTransaction2 from "./components/TransferTransaction2";
import { server } from "./server/utils/serverInstance";

export const SENDER_PRIVATE_KEY = process.env.REACT_APP_PRIVATE_KEY;

function App2() {
  const [pk, setPk] = useState("");
  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState("");
  const [isCoin, setIsCoin] = useState(false);
  const [isTransfer, setIsTransfer] = useState(false);

  const loadTransactionHandler = async () => {};

  const getPkToAddressHandler = async () => {
    const result = await WEB3.privateKeyToAddress("0x" + pk);
    setAddress(result.address);
  };

  const getBalance_ = async () => {
    if (!address.length > 0) return;
    if (isCoin) {
      const result = await WEB3.getBalance(address);
      setBalance(WEB3.fromWei(result));
    } else {
      const ABICode = await server
        .get(
          `/api/v2/contracts/address/${process.env.REACT_APP_CONTRACT_ADDRESS}/abi-code?microChainId=${process.env.REACT_APP_MICRO_CHAIN_ID}`
        )
        .then((res) => res.data);

      //contract
      const contract = await WEB3.Contract(
        ABICode,
        process.env.REACT_APP_META_CONTRACT_ADDRESS
      );

      const balanceResult = await contract.methods["balanceOf"](address).call();

      setBalance(WEB3.fromWei(balanceResult));
    }
  };

  useEffect(() => {
    getBalance_();
    setIsTransfer(false);
  }, [address, isCoin, isTransfer]);

  return (
    <div className="App">
      <div className="address-by-pk-container">
        <p>getAddressBypk</p>
        <div className="adress-by-pk-field-container">
          <BasicInput
            type={"text"}
            className={""}
            value={pk}
            onChangeFunc={(e) => setPk(e.target.value)}
          />
          <BasicButton value={"Get"} onClickFunc={getPkToAddressHandler} />
        </div>

        {address ? address : ""}
      </div>
      {balance.length > 0 ? (
        <div className="address-after-container">
          <div>
            <p>{balance}</p>
          </div>
          <div className="transaction-container">
            <div>Transaction</div>
            <TransferTransaction2
              //   receiveAddress={receiveAddress}
              //   setRecieveAddress={setRecieveAddress}
              //   gasPrice={gasPrice}
              //   nonce={nonce}
              //   setTxReceipt={setTxReceipt}
              //   setIsList={setIsList}
              //   isTokenBalance={isTokenBalance}
              senderAddress={address}
              pk={pk}
              isCoin={isCoin}
              setIsCoin={setIsCoin}
              setIsTransfer={setIsTransfer}
              // contractByteCode={contractByteCode}
            />
            <div>
              <BasicButton
                className="load-transaction-button"
                value="Load TxHistory"
                onClickFunc={loadTransactionHandler}
              />
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export default App2;
