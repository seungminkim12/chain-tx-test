import axios from "axios";
import { useCallback, useEffect, useState, useRef } from "react";
import { WEB3 } from "./module/web3";
import "./App.css";
import BasicButton from "./componentLibrary/BasicButton";
import BasicInput from "./componentLibrary/BasicInput";
import TransferTransaction from "./components/TransferTransaction";
import LoadBalance from "./components/LoadBalance";
import { getAllTokensAction } from "./action/tokenAction";
import TransactionTable from "components/TransactionTable";
import TokensTable from "./components/TokensTable";
import { getGasPriceFromServer, getNonceFromServer } from "server/dataAPI";

export const SENDER_ADDRESS = process.env.REACT_APP_USER_ADDRESS;
export const SENDER_PRIVATE_KEY = process.env.REACT_APP_PRIVATE_KEY;

export const SEND_AMOUNT = 0.001;

export const MY_MICRO_CHAIN_ID = process.env.REACT_APP_MICRO_CHAIN_ID;

export let server = axios.create({
  baseURL: process.env.REACT_APP_SERVER_URL,
});

server.defaults.headers.common["x-eq-ag-api-key"] =
  process.env.REACT_APP_API_KEY;

function App() {
  const [balance, setBalance] = useState("");
  const [receiveAddress, setRecieveAddress] = useState("");
  const [gasPrice, setGasPrice] = useState("");
  const [nonce, setNonce] = useState("");
  const [txReceipt, setTxReceipt] = useState({});
  const [txHistorys, setTxHistorys] = useState([]);
  const [historyLimit, setHistoryLimit] = useState(10);
  const [isList, setIsList] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pk, setPk] = useState("");
  const [addressByPk, setAddressByPk] = useState("");
  const [tokenList, setTokenList] = useState([]);
  const [isToken, setIsToken] = useState(false);

  const columns = isList
    ? ["txHash", "to", "from", "fee"]
    : ["txHash", "to", "from", "gas", "gasPrice", "nonce"];
  const tokenColumns = ["image", "name", "unit", "contract_address"];

  const isTokenBalance = false;

  const targetChainId = isTokenBalance
    ? process.env.REACT_APP_TOKEN_MICRO_CHAIN_ID
    : MY_MICRO_CHAIN_ID;

  const observer = useRef();

  const lastElementRef = useCallback(
    (node) => {
      if (!node) return;
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !loading) {
          setHistoryLimit((prev) => prev + 10);
          setLoading(true);
        }
      });
      if (node) observer.current.observe(node);
    },
    [txHistorys]
  );

  const getNonceFromAddressHandler = async () => {
    const result = await WEB3.getTransactionCount(SENDER_ADDRESS);
    console.log("result", result);
  };

  const getContractByAddressHandler = async () => {
    const result = await server.get(
      `api/v2/contracts/address/${process.env.REACT_APP_CONTRACT_ADDRESS}?microChainId=${MY_MICRO_CHAIN_ID}`
    );
    console.log("result", result);
  };

  const getMicroChainListHandler = async () => {
    const result = await server.get(`/api/v2/micro-chains`);
    console.log("result", result);
  };

  const getNetworkListHandler = async () => {
    const result = await server.get(`/api/v2/networks`);
    console.log("result: ", result);
  };

  const getContractListHandler = async () => {
    const result = await server.get("/api/v2/contracts");
    console.log("result: ", result);
  };

  const getAllTokensHandler = async () => {
    const result = await getAllTokensAction(MY_MICRO_CHAIN_ID);
    setTokenList(result.data);
    setIsToken(true);
  };

  const loadTransactionHandler = async () => {
    setLoading(true);
    const result = await server.get(
      isTokenBalance
        ? `/api/v2/micro-chain-currency/${process.env.REACT_APP_TOKEN_MICRO_CHAIN_ID}/transactions?address=${SENDER_ADDRESS}&limit=${historyLimit}`
        : `/api/v2/block-explorer/wallets/coins/transactions?microChainId=${MY_MICRO_CHAIN_ID}&address=${SENDER_ADDRESS}&limit=${historyLimit}`
    );

    setTxHistorys(result.data);
    setIsList(true);
    if (result) {
      setLoading(false);
    }
    setIsToken(false);
  };

  const getPkToAddressHandler = async () => {
    const result = await WEB3.privateKeyToAddress(pk);
    setAddressByPk(result.address);
  };

  useEffect(() => {
    getGasPriceFromServer(MY_MICRO_CHAIN_ID).then((res) =>
      setGasPrice(WEB3.fromDecimal(res.data.gas_price))
    );
    getNonceFromServer(MY_MICRO_CHAIN_ID, SENDER_ADDRESS).then((res) => {
      setNonce(res.data.nonce);
      console.log(WEB3.hexToNumber(res.data.nonce));
    });
  }, []);

  useEffect(() => {
    if (historyLimit > 10) {
      loadTransactionHandler();
    }
  }, [historyLimit]);

  return (
    <div className="App">
      <div className="balance-container">
        <p>Balance </p>
        <LoadBalance
          balance={balance}
          setBalance={setBalance}
          isTokenBalance={isTokenBalance}
        />
      </div>
      <div className="pk-to-address-container">
        <p>getAddress</p>
        <div className="pk-to-address-field-container">
          <BasicInput
            type={"text"}
            className={""}
            value={pk}
            onChangeFunc={(e) => setPk(e.target.value)}
          />
          <BasicButton value={"Get"} onClickFunc={getPkToAddressHandler} />
        </div>

        {addressByPk}
      </div>
      <div className="transaction-container">
        <div>Transaction</div>
        <TransferTransaction
          receiveAddress={receiveAddress}
          setRecieveAddress={setRecieveAddress}
          gasPrice={gasPrice}
          nonce={nonce}
          setTxReceipt={setTxReceipt}
          setIsList={setIsList}
          isTokenBalance={isTokenBalance}
        />
        <div>
          <BasicButton
            className="load-transaction-button"
            value="Load TxHistory"
            onClickFunc={loadTransactionHandler}
          />
        </div>
      </div>
      <div>
        <p>getAllTokens</p>
        <div>
          <BasicButton value={"Get"} onClickFunc={getAllTokensHandler} />
        </div>
      </div>
      <div>
        <p>getContracts</p>
        <div>
          <BasicButton value={"Get"} onClickFunc={getContractListHandler} />
        </div>
      </div>
      <div>
        <p>getNetworks</p>
        <div>
          <BasicButton value={"Get"} onClickFunc={getNetworkListHandler} />
        </div>
      </div>
      <div>
        <p>getMicroChains</p>
        <div>
          <BasicButton value={"Get"} onClickFunc={getMicroChainListHandler} />
        </div>
      </div>
      <div>
        <p>getContractByAddress</p>
        <div>
          <BasicButton
            value={"Get"}
            onClickFunc={getContractByAddressHandler}
          />
        </div>
      </div>
      <div>
        <p>getNonceFromAddress</p>
        <div>
          <BasicButton value={"Get"} onClickFunc={getNonceFromAddressHandler} />
        </div>
      </div>

      <div className="transaction-table-wrapper">
        <table>
          {isToken ? (
            <TokensTable columns={tokenColumns} tokenList={tokenList} />
          ) : (
            <TransactionTable
              columns={columns}
              isList={isList}
              txHistorys={txHistorys}
              historyLimit={historyLimit}
              lastElementRef={lastElementRef}
              txReceipt={txReceipt}
            />
          )}
        </table>
      </div>
    </div>
  );
}

export default App;
