import { getAllTokensParser } from "../parser/tokenParser";

export const getAllTokensAction = async (microChainId: string) => {
  const result = await getAllTokensParser(microChainId);

  return result;
};
