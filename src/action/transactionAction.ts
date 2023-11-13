import {
  getGasParser,
  getTransactionHashParser,
} from "parser/transactionParser";

export const getGasAction = async (
  microChainId: string,
  estimateGasBody: { to: string; from: string; gasPrice: string; value: string }
) => {
  const result = await getGasParser(microChainId, estimateGasBody);
  return result;
};

export const getTransactionHashAction = async (
  microChainId: string,
  sendTransactionBody: { rawTransaction: string }
) => {
  const result = await getTransactionHashParser(
    microChainId,
    sendTransactionBody
  );

  return result;
};
