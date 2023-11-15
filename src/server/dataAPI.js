import { server } from "../App";

const getGasPrice = async (microChainId) => {
  const result = await server.get(
    `/api/v2/micro-chains/${microChainId}/gas-price`
  );
  return result;
};

const getNonce = async (microChainId, senderAddress) => {
  const result = await server.get(
    `/api/v2/request/nonce?microChainId=${microChainId}&address=${senderAddress}`
  );
  return result;
};

const getTokenTransaction = async (microChainId, tokenTxBody) => {
  const result = await server.post(
    `/api/v2/transactions/request?microChainId=${microChainId}`,
    tokenTxBody
  );
  console.log("result", result);
  return result;
};

const getTransactionRecipient = async (transactionHash, targetChainId) => {
  const result = await server.get(
    `/api/v2/request/transaction/${transactionHash}?microChainId=${targetChainId}`
  );
  console.log("result: ", result);
  return result;
};

export {
  getGasPrice as getGasPriceFromServer,
  getNonce as getNonceFromServer,
  getTransactionRecipient as getTransactionRecipientFromServer,
  getTokenTransaction as getTokenTransactionFromServer,
};
