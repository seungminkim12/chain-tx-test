import { server } from "./utils/serverInstance";

const getGas = async (request: GetGasRequest) => {
  const result = await server.post(
    `/api/v2/request/estimate-gas?microChainId=${request.params.microChainId}`,
    request.query
  );
  return result;
};

type GetGasRequest = {
  params: {
    microChainId: string;
  };
  query: {
    to: string;
    from: string;
    gasPrice: string;
    value: string;
  };
};

// const getGas = async () => {
//     const result = await server.get()
// };
// const getGas = async () => {
//     const result = await server.get()
// };

export { getGas as getGasFromServer };
