import { getGasParser } from "parser/transactionParser";

export const getGasAction = async (
  microChainId: string,
  estimateGasBody: { to: string; from: string; gasPrice: string; value: string }
) => {
  const result = await getGasParser(microChainId, estimateGasBody);
  return result;
};
