import { getAllTokensFromServer } from "server/tokenAPI";

export const getAllTokensParser = async (microChainId: string) => {
  const result = await getAllTokensFromServer({
    params: {
      microChainId,
    },
  });

  return result;
};
