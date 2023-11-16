import { server } from "./utils/serverInstance";

const getAllTokens = async (request: GetAllTokensRequest) => {
  // const result = await server.get(
  //   `/api/v2/wallet-20/tokens?microChainId=${request.params.microChainId}`
  // );
  // ``
  const result = await server.get(
    `/api/v2/wallet-manage/micro-chain-currency?microChainId=${request.params.microChainId}`
  );

  return result;
};

type GetAllTokensRequest = {
  params: {
    microChainId: string;
  };
};

export { getAllTokens as getAllTokensFromServer };
