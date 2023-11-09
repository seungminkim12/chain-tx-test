import { getGasFromServer } from "server/transactionAPI";

export const getGasParser = async (
  microChainId: string,
  estimateGasBody: { to: string; from: string; gasPrice: string; value: string }
) => {
  const result = await getGasFromServer({
    params: {
      microChainId,
    },
    query: estimateGasBody,
  });
  return result.data.gas;
};
