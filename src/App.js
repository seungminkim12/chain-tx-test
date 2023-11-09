import axios from "axios";
import { useCallback, useEffect, useState, useRef } from "react";
import { WEB3 } from "./module/web3";
import "./App.css";
import TableData from "./module/TableData";
import BasicButton from "./componentLibrary/BasicButton";
import BasicInput from "./componentLibrary/BasicInput";
import TransferTransaction from "./components/TransferTransaction";
import LoadBalance from "./components/LoadBalance";

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

  const columns = isList
    ? ["txHash", "to", "from", "fee"]
    : ["txHash", "to", "from", "gas", "gasPrice", "nonce"];

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

  const loadTransactionHandler = async () => {
    setLoading(true);
    const result = await server.get(
      `/api/v2/block-explorer/wallets/coins/transactions?microChainId=${MY_MICRO_CHAIN_ID}&address=${SENDER_ADDRESS}&limit=${historyLimit}`
    );
    setTxHistorys(result.data);
    setIsList(true);
    if (result) {
      setLoading(false);
    }
  };

  const getPkToAddressHandler = async () => {
    const result = await WEB3.privateKeyToAddress(pk);
    setAddressByPk(result.address);
  };

  useEffect(() => {
    server
      .get(`/api/v2/micro-chains/${MY_MICRO_CHAIN_ID}/gas-price`)
      .then((res) => {
        setGasPrice(WEB3.fromDecimal(res.data.gas_price));
      });
    server
      .get(
        `/api/v2/request/nonce?microChainId=${MY_MICRO_CHAIN_ID}&address=${SENDER_ADDRESS}`
      )
      .then((res) => {
        setNonce(res.data.nonce);
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
        <LoadBalance balance={balance} setBalance={setBalance} />
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
        />
        <div>
          <BasicButton
            className="load-transaction-button"
            value="Load TxHistory"
            onClickFunc={loadTransactionHandler}
          />
        </div>
      </div>

      <div className="transaction-table-wrapper">
        <table>
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column}>{column}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isList && txHistorys.length > 0 ? (
              txHistorys.map((tx, idx) => {
                if (idx === historyLimit) {
                  return (
                    <TableData
                      txReceipt={tx}
                      key={idx}
                      idx={idx}
                      lastElementRef={lastElementRef}
                    />
                  );
                } else {
                  return <TableData txReceipt={tx} key={idx} idx={idx} />;
                }
              })
            ) : (
              <TableData txReceipt={txReceipt} />
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
