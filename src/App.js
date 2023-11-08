import axios from "axios";
import { useCallback, useEffect, useState, useRef } from "react";
import { WEB3 } from "./module/web3";
import "./App.css";
import TableData from "./module/TableData";

const SENDER_ADDRESS = process.env.REACT_APP_USER_ADDRESS;
const SENDER_PRIVATE_KEY = process.env.REACT_APP_PRIVATE_KEY;

const SEND_AMOUNT = 0.001;

const MY_MICRO_CHAIN_ID = process.env.REACT_APP_MICRO_CHAIN_ID;

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

  const columns = isList
    ? ["txHash", "to", "from", "fee"]
    : ["txHash", "to", "from", "gas", "gasPrice", "nonce"];

  let server = axios.create({
    baseURL: process.env.REACT_APP_SERVER_URL,
  });

  server.defaults.headers.common["x-eq-ag-api-key"] =
    process.env.REACT_APP_API_KEY;

  let estimateGasBody;

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

  const loadBalanceHandler = async () => {
    const { data } = await server.get(
      `/api/v2/block-explorer/wallets/coins/balance?microChainId=${process.env.REACT_APP_MICRO_CHAIN_ID}&address=${process.env.REACT_APP_USER_ADDRESS}`
    );

    setBalance(WEB3.fromWei(data.balance));
  };

  const sendTransactionHandler = async () => {
    estimateGasBody = {
      to: receiveAddress,
      from: SENDER_ADDRESS,
      gasPrice,
      value: WEB3.toHex(WEB3.toWei(SEND_AMOUNT.toString())),
    };

    const gas = await server
      .post(
        `/api/v2/request/estimate-gas?microChainId=${MY_MICRO_CHAIN_ID}`,
        estimateGasBody
      )
      .then((res) => {
        return res.data.gas;
      });

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
    const transactionResult = await server.post(
      `/api/v2/request/transaction?microChainId=${MY_MICRO_CHAIN_ID}`,
      sendTransactionBody
    );

    const transactionHash = transactionResult.data.transaction_hash;

    const transactionRecipient = await server.get(
      `/api/v2/request/transaction/${transactionHash}?microChainId=${MY_MICRO_CHAIN_ID}`
    );
    setTxReceipt(transactionRecipient.data.transaction);

    // const transactionRecipient = await server.get(
    //   `/api/v2/transactions/result?microChainId=${MY_MICRO_CHAIN_ID}&transactionHash=${transactionHash}`
    // );

    // setTxReceipt(transactionRecipient.data[0]);
    setIsList(false);
  };

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
        <div className="balance-button-wrapper">
          <input
            type="button"
            className="balance-button"
            value="Load"
            onClick={loadBalanceHandler}
          />
          <p className="balance-text">{balance}</p>
        </div>
      </div>
      <div className="transaction-container">
        <div>Transaction</div>
        <div className="transaction-input-wrapper">
          <input
            type="text"
            className="transactipn-input"
            value={receiveAddress}
            onChange={(e) => setRecieveAddress(e.target.value)}
          />
          <input
            type="button"
            className="transaction-button"
            value="Transfer"
            onClick={sendTransactionHandler}
          />
          <input
            type={"button"}
            className="transaction-button"
            value="Load TxHistory"
            onClick={loadTransactionHandler}
          />
        </div>
        {/* <div></div> */}
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
                //
                if (idx === historyLimit) {
                  //
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
